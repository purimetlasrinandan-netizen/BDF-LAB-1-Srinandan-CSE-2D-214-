const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const dbPath = path.join(__dirname, 'books.db');

async function view() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const rows = await db.all('SELECT * FROM book ORDER BY id ASC;');
    console.log(`\n📚 SQLite Database: books.db (Total Records: ${rows.length})`);
    console.table(rows);
    await db.close();
  } catch (error) {
    console.error('Error reading database:', error);
    process.exit(1);
  }
}

view();

