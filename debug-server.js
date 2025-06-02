const http = require('http');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1';
const port = 3000;

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('Starting Next.js application...');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Working directory:', process.cwd());

// Error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.prepare().then(() => {
  console.log('Next.js app prepared successfully');
  
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      throw err;
    }
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log('> Server is running successfully');
    console.log('> Press Ctrl+C to stop');
  });

  // Keep track of connections
  const connections = new Set();
  
  server.on('connection', (conn) => {
    connections.add(conn);
    conn.on('close', () => {
      connections.delete(conn);
    });
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('\nGracefully shutting down...');
    
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });

    // Close all connections
    connections.forEach(conn => conn.end());
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

}).catch((err) => {
  console.error('Failed to prepare Next.js app:', err);
  console.error(err.stack);
  process.exit(1);
});