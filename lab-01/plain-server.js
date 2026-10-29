// Task 3: Plain HTTP server using Node.js built-in http module
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} -> 200 OK`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello');
});

server.listen(PORT, () => {
  console.log(`Plain HTTP server is running on http://localhost:${PORT}`);
});
