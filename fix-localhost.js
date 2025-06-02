const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const os = require('os');

console.log('\n🔍 KFAR Localhost Connection Diagnostic & Fix');
console.log('===========================================\n');

// System info
console.log('📊 System Information:');
console.log('- Platform:', os.platform());
console.log('- Node Version:', process.version);
console.log('- Current Directory:', process.cwd());
console.log('- Network Interfaces:');

// Show all network interfaces
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(name => {
  interfaces[name].forEach(iface => {
    if (iface.family === 'IPv4') {
      console.log(`  - ${name}: ${iface.address}`);
    }
  });
});

console.log('\n🚀 Starting Next.js with explicit localhost binding...\n');

const dev = true;
const hostname = '127.0.0.1'; // Force IPv4
const port = 3000;

// Create Next app instance
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server with explicit host binding
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('❌ Request error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Listen with explicit host and error handling
  server.listen(port, hostname, (err) => {
    if (err) {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    }
    
    console.log('✅ Server started successfully!\n');
    console.log('🌐 Access your admin panel at:');
    console.log(`   http://127.0.0.1:${port}/admin`);
    console.log(`   http://localhost:${port}/admin`);
    console.log('\n📝 Troubleshooting Tips:');
    console.log('1. If localhost doesn\'t work, use 127.0.0.1');
    console.log('2. Check if any firewall/antivirus is blocking port 3000');
    console.log('3. Try disabling browser extensions');
    console.log('4. Use incognito/private browsing mode');
    console.log('\n🛑 Press Ctrl+C to stop the server\n');
  });

  server.on('error', (err) => {
    console.error('\n❌ Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.log(`\n⚠️  Port ${port} is already in use!`);
      console.log('Run this command to find and kill the process:');
      console.log(`   lsof -ti:${port} | xargs kill -9`);
    }
  });

  // Test the connection ourselves
  setTimeout(() => {
    const http = require('http');
    http.get(`http://127.0.0.1:${port}/api/vendors`, (res) => {
      console.log(`\n✅ Self-test successful! Server responded with status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log('\n⚠️  Self-test failed:', err.message);
      console.log('The server might be having issues accepting connections.');
    });
  }, 3000);
});