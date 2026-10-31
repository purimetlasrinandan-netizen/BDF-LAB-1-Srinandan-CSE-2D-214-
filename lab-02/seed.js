const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const dbPath = path.join(__dirname, 'books.db');

async function seed() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('Connected to SQLite database at:', dbPath);

    // Drop table if exists to cleanly re-populate without deleting the file (prevents Windows EBUSY file locks)
    await db.exec('DROP TABLE IF EXISTS book;');

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
