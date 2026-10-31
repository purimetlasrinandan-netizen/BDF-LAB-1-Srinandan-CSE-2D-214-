const { spawn } = require('child_process');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:3000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTests() {
  console.log('=== Starting Express Server for Testing ===');
  const serverProcess = spawn('node', [path.join(__dirname, 'app.js')], {
    stdio: ['inherit', 'pipe', 'pipe'],
    env: { ...process.env, PORT: '3000' }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data.toString().trim()}`);
  });

  // Wait for server to initialize DB and listen
  await sleep(2000);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} - ${err.message}`);
      failed++;
    }
  }

  try {
    console.log('\n--- Running CRUD Endpoint Tests ---\n');

    // Test 1: GET /books/
    await test('GET /books/ returns 200 and array of books', async () => {
      const res = await fetch(`${BASE_URL}/books/`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length < 8) {
        throw new Error(`Expected array with at least 8 items, got length ${data.length}`);
      }
      console.log(`   Found ${data.length} books. First book: "${data[0].title}" by ${data[0].author}`);
    });

    // Test 2: GET /books/:bookId/
    await test('GET /books/1/ returns book details', async () => {
      const res = await fetch(`${BASE_URL}/books/1/`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (data.id !== 1 || data.title !== 'The Great Gatsby') {
        throw new Error(`Unexpected data: ${JSON.stringify(data)}`);
      }
      console.log(`   Retrieved Book #1: "${data.title}", Price: ${data.price}`);
    });

    // Test 3: GET /books/999/ (Not Found)
    await test('GET /books/999/ returns 404 for non-existent book', async () => {
      const res = await fetch(`${BASE_URL}/books/999/`);
      if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
      const data = await res.json();
      console.log(`   Response: ${JSON.stringify(data)}`);
    });

    // Test 4: POST /books/
    let createdBookId;
    await test('POST /books/ adds a new book with status 201', async () => {
      const newBook = {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        price: 1100,
        pages: 616
      };
      const res = await fetch(`${BASE_URL}/books/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });
      if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
      const data = await res.json();
      if (!data.bookId) throw new Error(`Expected bookId in response, got ${JSON.stringify(data)}`);
      createdBookId = data.bookId;
      console.log(`   Added Book ID: ${createdBookId}, Message: "${data.message}"`);
    });

    // Test 5: Verify newly added book with GET /books/:bookId/
    await test(`GET /books/${createdBookId}/ retrieves newly added book`, async () => {
      const res = await fetch(`${BASE_URL}/books/${createdBookId}/`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (data.title !== 'Designing Data-Intensive Applications') {
        throw new Error(`Title mismatch: ${data.title}`);
      }
      console.log(`   Verified new book: "${data.title}" by ${data.author}`);
    });

    // Test 6: PUT /books/:bookId/
    await test(`PUT /books/${createdBookId}/ updates book information`, async () => {
      const updatedData = {
        title: 'Designing Data-Intensive Applications (Second Edition)',
        author: 'Martin Kleppmann',
        price: 1250,
        pages: 640
      };
      const res = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      console.log(`   Update response: "${data.message}"`);
    });

    // Test 7: Verify updated book
    await test(`GET /books/${createdBookId}/ confirms updated details`, async () => {
      const res = await fetch(`${BASE_URL}/books/${createdBookId}/`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      if (data.price !== 1250 || !data.title.includes('Second Edition')) {
        throw new Error(`Data was not updated properly: ${JSON.stringify(data)}`);
      }
      console.log(`   Confirmed update: "${data.title}", Price: ${data.price}`);
    });

    // Test 8: DELETE /books/:bookId/
    await test(`DELETE /books/${createdBookId}/ removes book with status 200`, async () => {
      const res = await fetch(`${BASE_URL}/books/${createdBookId}/`, {
        method: 'DELETE'
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const data = await res.json();
      console.log(`   Delete response: "${data.message}"`);
    });

    // Test 9: Verify deleted book returns 404
    await test(`GET /books/${createdBookId}/ returns 404 after deletion`, async () => {
      const res = await fetch(`${BASE_URL}/books/${createdBookId}/`);
      if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
      console.log(`   Confirmed deletion: Book ID ${createdBookId} no longer exists.`);
    });

    // Test 10: Validation error on POST with missing fields
    await test('POST /books/ returns 400 for missing fields', async () => {
      const res = await fetch(`${BASE_URL}/books/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Incomplete Book' })
      });
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      const data = await res.json();
      console.log(`   Validation error caught: ${data.error}`);
    });

    console.log(`\n=== Test Results: ${passed} passed, ${failed} failed ===`);
  } finally {
    console.log('Shutting down server...');
    serverProcess.kill();
  }
}

runTests();
