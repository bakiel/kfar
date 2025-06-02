// Diagnostic configuration
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('🚀 Starting Next.js with diagnostic mode...');
console.log('   Host:', hostname);
console.log('   Port:', port);
console.log('   Dev mode:', dev);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`   📥 Request: ${req.method} ${req.url}`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('   ❌ Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`
✅ Next.js server is running!
==========================
🌐 Local URLs:
   - http://localhost:${port}
   - http://127.0.0.1:${port}
   - http://[::1]:${port}

🔍 Diagnostic Info:
   - Process ID: ${process.pid}
   - Node Version: ${process.version}
   - Working Directory: ${process.cwd()}

📱 Network URLs:
   - http://192.168.18.3:${port}

Press Ctrl+C to stop the server
`);
  });
}).catch(err => {
  console.error('❌ Failed to start Next.js:', err);
  process.exit(1);
});
