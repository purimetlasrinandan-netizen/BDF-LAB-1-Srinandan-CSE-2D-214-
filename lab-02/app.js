const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'books.db');
let db = null;

// Initialize SQLite database connection and start Express server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Root route for sanity check & deployment status
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Online',
    message: 'Welcome to the Books CRUD API (Lab 2: SQLite database and CRUD routes)',
    endpoints: {
      getAllBooks: 'GET /books/',
      getBookById: 'GET /books/:bookId/',
      addBook: 'POST /books/',
      updateBook: 'PUT /books/:bookId/',
      deleteBook: 'DELETE /books/:bookId/',
    },
  });
});

// 1. GET /books/ - Get all books
app.get('/books/', async (req, res) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id ASC;
    `;
    const booksArray = await db.all(getBooksQuery);
    res.status(200).json(booksArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. GET /books/:bookId/ - Get a single book by ID
app.get('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return res.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. POST /books/ - Add a new book
app.post('/books/', async (req, res) => {
  try {
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide title, author, price, and pages.',
      });
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
    const bookId = dbResponse.lastID;

    res.status(201).json({
      message: 'Book Added Successfully',
      bookId: bookId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. PUT /books/:bookId/ - Update an existing book
app.put('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    if (!title || !author || price === undefined || pages === undefined) {
      return res.status(400).json({
        error: 'Missing required fields. Please provide title, author, price, and pages.',
      });
    }

    // Verify book exists
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);
    if (!existingBook) {
      return res.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;
    await db.run(updateBookQuery, [title, author, price, pages, bookId]);

    res.status(200).json({
      message: 'Book Updated Successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE /books/:bookId/ - Remove a book by ID
app.delete('/books/:bookId/', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Verify book exists
    const checkQuery = `SELECT * FROM book WHERE id = ?;`;
    const existingBook = await db.get(checkQuery, [bookId]);
    if (!existingBook) {
      return res.status(404).json({ error: `Book with id ${bookId} not found` });
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);

    res.status(200).json({
      message: 'Book Deleted Successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
