# Backend Development Fundamentals - Lab Repository

**Course:** Backend Development Fundamentals · Year II Term II · Aurora  
**Faculty:** Chintakrindi Sai Siva Teja  
**Student Name:** Srinandan  
**Roll Number:** 1205  
**Section:** 214 (CSE-2D)  
**GitHub Repository:** [https://github.com/purimetlasrinandan-netizen/BDF-LAB-1-Srinandan-CSE-2D-214-](https://github.com/purimetlasrinandan-netizen/BDF-LAB-1-Srinandan-CSE-2D-214-)

---

## Repository Structure
This repository contains all laboratory exercises for the Backend Development Fundamentals course:

```text
├── .gitignore
├── README.md
├── lab-01/               # Lab 1: Node.js and Express server
│   ├── package.json
│   ├── package-lock.json
│   ├── plain-server.js
│   ├── server.js
│   ├── README.md
│   └── screenshots/
│       ├── root_200.png
│       ├── about_200.png
│       ├── time_200.png
│       └── not_found_404.png
├── lab-02/               # Lab 2: SQLite database and CRUD routes
│   ├── package.json
│   ├── package-lock.json
│   ├── setup.sql
│   ├── seed.js
│   ├── view.js
│   ├── books.db
│   ├── app.js
│   ├── test-endpoints.js
│   ├── README.md
│   └── screenshots/
│       ├── 01-get-all-books.png
│       ├── 02-get-single-book.png
│       ├── 03-post-add-book.png
│       ├── 04-put-update-book.png
│       ├── 05-delete-book.png
│       └── 06-sqlite-cli-verification.png
├── lab-03/               # (Upcoming labs)
...
└── lab-10/
```

---

## Labs Directory
- **[Lab 01: Node.js and Express Server](./lab-01/README.md)** — HTTP server with core modules and Express routes (`/`, `/about`, `/time`, `404`).
- **[Lab 02: SQLite Database and CRUD Routes](./lab-02/README.md)** — Express server connected to SQLite database exposing CRUD endpoints with parameterized queries.

---

### Quick Start for Lab 02:
```bash
cd lab-02
npm install
npm run seed
npm run dev
```
Full documentation, endpoint table, viva answers, and screenshots are in [lab-02/README.md](./lab-02/README.md).
