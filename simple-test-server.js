const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is working!\n');
});

const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Test server listening on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});