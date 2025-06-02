// Direct Express server to bypass Next.js issues
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/_next', express.static(path.join(__dirname, '.next')));

// Basic HTML response
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>KFAR Marketplace - Direct Server</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #fef9ef;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .status {
      background: #478c0b;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .vendor-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .vendor-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      text-decoration: none;
      color: #3a3a1d;
      transition: transform 0.2s;
    }
    .vendor-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .vendor-card h3 {
      color: #478c0b;
      margin: 0 0 10px 0;
    }
    .debug {
      background: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="status">
      <h1>✅ KFAR Marketplace Server is Running!</h1>
      <p>Direct Express server bypassing Next.js localhost issues</p>
      <p>Time: ${new Date().toLocaleString()}</p>
    </div>
    
    <h2>🏪 Vendor Admin Dashboards</h2>
    <div class="vendor-grid">
      <a href="/admin/vendor/teva-deli" class="vendor-card">
        <h3>Teva Deli</h3>
        <p>46 products • Israeli vegan deli</p>
      </a>
      <a href="/admin/vendor/people-store" class="vendor-card">
        <h3>People Store</h3>
        <p>25 products • Community bulk store</p>
      </a>
      <a href="/admin/vendor/gahn-delight" class="vendor-card">
        <h3>Gahn Delight</h3>
        <p>8 products • Artisanal ice cream</p>
      </a>
      <a href="/admin/vendor/vop-shop" class="vendor-card">
        <h3>VOP Shop</h3>
        <p>15 products • Community store</p>
      </a>
      <a href="/admin/vendor/queens-cuisine" class="vendor-card">
        <h3>Queen's Cuisine</h3>
        <p>17 products • Plant-based foods</p>
      </a>
      <a href="/admin/vendor/garden-of-light" class="vendor-card">
        <h3>Garden of Light</h3>
        <p>20 products • Premium vegan deli</p>
      </a>
    </div>
    
    <div class="debug">
      <h3>Debug Information:</h3>
      <p>Server: Express ${require('express/package.json').version}</p>
      <p>Node: ${process.version}</p>
      <p>Platform: ${process.platform}</p>
      <p>Request Headers: ${JSON.stringify(req.headers, null, 2)}</p>
    </div>
  </div>
</body>
</html>
  `);
});

// Mock vendor admin pages
app.get('/admin/vendor/:vendorId', (req, res) => {
  const { vendorId } = req.params;
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>${vendorId} Admin - KFAR</title>
  <style>
    body { font-family: Arial; padding: 20px; background: #fef9ef; }
    .header { background: #478c0b; color: white; padding: 20px; border-radius: 8px; }
    .info { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${vendorId.replace(/-/g, ' ').toUpperCase()} Admin Dashboard</h1>
    <p>Direct server mode - Next.js features not available</p>
  </div>
  <div class="info">
    <h2>Connection Successful!</h2>
    <p>This proves the server can serve pages on localhost.</p>
    <p>To use the full Next.js app:</p>
    <ol>
      <li>Try using Safari browser</li>
      <li>Clear Chrome's cache and DNS</li>
      <li>Disable any VPN or proxy</li>
      <li>Try incognito/private mode</li>
    </ol>
    <p><a href="/">← Back to vendors</a></p>
  </div>
</body>
</html>
  `);
});

// API endpoints
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Try multiple binding strategies
const servers = [];
const hosts = ['127.0.0.1', '0.0.0.0', 'localhost'];
let successfulHost = null;

console.log('🚀 Starting Direct Express Server...\n');

hosts.forEach(host => {
  try {
    const server = app.listen(PORT, host, () => {
      console.log(`✅ Server listening on ${host}:${PORT}`);
      successfulHost = host;
      
      // Close other servers
      servers.forEach(s => {
        if (s !== server) s.close();
      });
    });
    
    server.on('error', (err) => {
      console.log(`❌ Failed to bind to ${host}:${PORT} - ${err.message}`);
    });
    
    servers.push(server);
  } catch (err) {
    console.log(`❌ Error with ${host}: ${err.message}`);
  }
});

// After 2 seconds, show access instructions
setTimeout(() => {
  if (successfulHost) {
    console.log(`
========================================
✅ DIRECT SERVER RUNNING SUCCESSFULLY!
========================================

Try accessing the server at:

1. http://127.0.0.1:3000
2. http://localhost:3000
3. http://[::1]:3000
4. http://localhost.localdomain:3000
5. http://lvh.me:3000

If Chrome doesn't work, try:
- Safari (often works better with localhost)
- Firefox in private mode
- curl http://127.0.0.1:3000

API Test: http://127.0.0.1:3000/api/test

Press Ctrl+C to stop the server
========================================
    `);
  } else {
    console.log(`
❌ CRITICAL ERROR: Could not bind to any address!

This indicates a serious system-level issue.
Possible causes:
1. Port 3000 is in use by another process
2. Firewall blocking Node.js
3. System network stack issue

Try:
1. Restart your Mac
2. Check: lsof -i :3000
3. Try a different port: PORT=8080 node direct-server.js
    `);
  }
}, 2000);