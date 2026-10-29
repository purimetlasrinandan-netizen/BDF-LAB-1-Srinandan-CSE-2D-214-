// Lab 1: Node.js and Express Server
// Faculty: Chintakrindi Sai Siva Teja | Backend Development Fundamentals

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies (good practice)
app.use(express.json());

// Request logging middleware (Task 7 requirement)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Route 1: GET / (welcome text)
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Lab 1: Node.js and Express Server!');
});

// Route 2: GET /about (JSON with name and section)
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Srinandan',
    section: '214',
    rollNo: '1205'
  });
});

// Route 3: GET /time (current date and time using new Date())
app.get('/time', (req, res) => {
  const now = new Date();
  res.status(200).json({
    currentTime: now.toString(),
    isoTime: now.toISOString()
  });
});

// Route 4: 404 Handler for any unknown path
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. This route does not exist.`
  });
});

// Start Express server (Task 4)
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});
