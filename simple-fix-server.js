const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Enable CORS and other headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Bind to all interfaces explicitly
  server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`🚀 Ready on http://0.0.0.0:${port}`);
    console.log(`🌐 Network: http://192.168.18.3:${port}`);
    console.log(`📱 Local: http://localhost:${port}`);
  });
  
  // Handle server errors
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
});
