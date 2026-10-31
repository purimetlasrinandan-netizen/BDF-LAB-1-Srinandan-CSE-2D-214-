const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const dbPath = path.join(__dirname, 'books.db');

async function seed() {
  try {
    // Delete existing books.db to allow clean re-seeding if run again
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('Removed existing books.db for fresh initialization.');
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database at:', dbPath);

    const setupSql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf-8');
    await db.exec(setupSql);

    const rows = await db.all('SELECT * FROM book');
    console.log(`Database seeded successfully! Current books count: ${rows.length}`);
    console.table(rows);
    await db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
