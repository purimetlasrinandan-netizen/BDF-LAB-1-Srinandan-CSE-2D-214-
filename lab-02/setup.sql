-- SQL script to initialize the books database and insert 10 sample records

CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);

-- Initial 10 records
INSERT INTO book (title, author, price, pages) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 450, 180);
INSERT INTO book (title, author, price, pages) VALUES ('To Kill a Mockingbird', 'Harper Lee', 550, 281);
INSERT INTO book (title, author, price, pages) VALUES ('1984', 'George Orwell', 399, 328);
INSERT INTO book (title, author, price, pages) VALUES ('Pride and Prejudice', 'Jane Austen', 299, 279);
INSERT INTO book (title, author, price, pages) VALUES ('The Catcher in the Rye', 'J.D. Salinger', 420, 214);
INSERT INTO book (title, author, price, pages) VALUES ('The Hobbit', 'J.R.R. Tolkien', 650, 310);
INSERT INTO book (title, author, price, pages) VALUES ('Fahrenheit 451', 'Ray Bradbury', 380, 256);
INSERT INTO book (title, author, price, pages) VALUES ('Brave New World', 'Aldous Huxley', 490, 268);
INSERT INTO book (title, author, price, pages) VALUES ('The Alchemist', 'Paulo Coelho', 350, 208);
INSERT INTO book (title, author, price, pages) VALUES ('Clean Code', 'Robert C. Martin', 1250, 464);
