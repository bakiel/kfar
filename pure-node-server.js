const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

console.log('🔍 PURE NODE.JS DIAGNOSTIC SERVER');
console.log('=================================\n');

// Test basic HTTP functionality
const testServer = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Log request details
  console.log(`   From: ${req.socket.remoteAddress}`);
  console.log(`   Headers: ${JSON.stringify(req.headers).substring(0, 100)}...`);
  
  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>KFAR Test Server</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .success {
      background: #4caf50;
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .test-section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    pre {
      background: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
    .test-links a {
      display: inline-block;
      margin: 5px;
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .test-links a:hover {
      background: #1976d2;
    }
  </style>
</head>
<body>
  <div class="success">
    <h1>✅ Pure Node.js Server is Working!</h1>
    <p>Timestamp: ${new Date().toLocaleString()}</p>
    <p>Node Version: ${process.version}</p>
  </div>
  
  <div class="test-section">
    <h2>🔧 Connection Diagnostics</h2>
    <pre>
Your IP: ${req.socket.remoteAddress}
User-Agent: ${req.headers['user-agent']}
Protocol: ${req.httpVersion}
    </pre>
  </div>
  
  <div class="test-section">
    <h2>🧪 Test These URLs</h2>
    <div class="test-links">
      <a href="http://127.0.0.1:3000">127.0.0.1:3000</a>
      <a href="http://localhost:3000">localhost:3000</a>
      <a href="http://[::1]:3000">[::1]:3000</a>
      <a href="http://localhost.localdomain:3000">localhost.localdomain</a>
      <a href="/api/test">API Test</a>
    </div>
  </div>
  
  <div class="test-section">
    <h2>📊 Server Binding Info</h2>
    <div id="binding-info">Checking...</div>
  </div>
  
  <div class="test-section">
    <h2>🚨 If This Page Loads But Next.js Doesn't</h2>
    <ol>
      <li>The issue is specific to Next.js, not your network</li>
      <li>Try: <code>npx create-next-app test-app && cd test-app && npm run dev</code></li>
      <li>Check Node.js version: <code>node --version</code> (should be 18+)</li>
      <li>Clear npm cache: <code>npm cache clean --force</code></li>
      <li>Reinstall dependencies: <code>rm -rf node_modules && npm install</code></li>
    </ol>
  </div>
  
  <script>
    // Test from browser
    fetch('/api/test')
      .then(r => r.json())
      .then(data => {
        document.getElementById('binding-info').innerHTML = 
          '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
      })
      .catch(err => {
        document.getElementById('binding-info').innerHTML = 
          '<span style="color:red">API fetch failed: ' + err + '</span>';
      });
  </script>
</body>
</html>
    `);
  } else if (parsedUrl.pathname === '/api/test') {
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      status: 'ok',
      server: 'Pure Node.js',
      time: new Date().toISOString(),
      node: process.version,
      platform: process.platform,
      address: testServer.address(),
      pid: process.pid
    }, null, 2));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Error handling
testServer.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('\n🔍 Port 3000 is in use. Checking what\'s using it...');
    require('child_process').exec('lsof -i :3000', (err, stdout) => {
      if (stdout) {
        console.log('Processes on port 3000:');
        console.log(stdout);
      }
      console.log('\nTrying alternative port 3001...');
      tryPort(3001);
    });
  } else if (err.code === 'EACCES') {
    console.log('❌ Permission denied. Try a port above 1024.');
  } else {
    console.log('Trying alternative binding...');
    tryAlternativeBinding();
  }
});

// Success handler
testServer.on('listening', () => {
  const addr = testServer.address();
  console.log(`✅ Server listening on ${addr.address}:${addr.port}`);
  console.log('\n📱 Try these URLs in your browser:\n');
  console.log(`   1. http://127.0.0.1:${addr.port}`);
  console.log(`   2. http://localhost:${addr.port}`);
  console.log(`   3. http://[::1]:${addr.port}`);
  console.log('\n🧪 Test with curl:');
  console.log(`   curl http://127.0.0.1:${addr.port}/api/test\n`);
});

// Try different binding methods
let bindingAttempt = 0;
const bindingMethods = [
  () => testServer.listen(3000, '127.0.0.1'),
  () => testServer.listen(3000, 'localhost'),
  () => testServer.listen(3000, '0.0.0.0'),
  () => testServer.listen(3000),
  () => testServer.listen(3000, '::1')
];

function tryBinding() {
  if (bindingAttempt < bindingMethods.length) {
    console.log(`\nAttempt ${bindingAttempt + 1}: Trying binding method ${bindingAttempt + 1}...`);
    try {
      bindingMethods[bindingAttempt]();
    } catch (err) {
      console.log(`❌ Method ${bindingAttempt + 1} failed:`, err.message);
      bindingAttempt++;
      setTimeout(tryBinding, 100);
    }
  } else {
    console.log('\n❌ All binding methods failed!');
    console.log('\n🆘 CRITICAL SYSTEM ISSUE DETECTED');
    console.log('Your system is blocking all localhost connections.');
    console.log('\nPossible causes:');
    console.log('1. Security software (antivirus/firewall)');
    console.log('2. Corporate network policies');
    console.log('3. System Integrity Protection issue');
    console.log('4. Corrupted network configuration');
    console.log('\nImmediate fixes to try:');
    console.log('1. Restart your Mac in Safe Mode');
    console.log('2. Create new user account and test there');
    console.log('3. Reset network settings:');
    console.log('   sudo dscacheutil -flushcache');
    console.log('   sudo killall -HUP mDNSResponder');
    console.log('4. Check Console.app for system errors');
  }
}

function tryPort(port) {
  const altServer = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Server running on port ${port}`);
  });
  
  altServer.listen(port, '127.0.0.1', () => {
    console.log(`✅ Alternative server running on port ${port}`);
    console.log(`   Try: http://127.0.0.1:${port}`);
  });
}

function tryAlternativeBinding() {
  bindingAttempt++;
  tryBinding();
}

// Start the server
console.log('Starting server...');
tryBinding();