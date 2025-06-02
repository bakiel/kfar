const { execSync, spawn } = require('child_process');
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

console.log('🔬 ULTIMATE LOCALHOST DIAGNOSTIC & FIX');
console.log('=====================================\n');

// Step 1: Deep system check
console.log('1️⃣ System Security Check...');
try {
  // Check if firewall is blocking
  const firewallStatus = execSync('sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null || echo "Unable to check"', { encoding: 'utf8' });
  console.log('   Firewall:', firewallStatus.trim());
  
  // Check for proxy settings
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy || 'None';
  console.log('   HTTP Proxy:', httpProxy);
  
  // Check DNS resolution
  const dnsCheck = execSync('dscacheutil -q host -a name localhost', { encoding: 'utf8' });
  console.log('   DNS Resolution:', dnsCheck.includes('127.0.0.1') ? '✅ OK' : '❌ Failed');
} catch (e) {
  console.log('   ⚠️  Some security checks require sudo');
}

// Step 2: Port scan
console.log('\n2️⃣ Deep Port Analysis...');
function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', () => {
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function portScan() {
  const results = await Promise.all([
    checkPort(3000, '127.0.0.1').then(r => ({ host: '127.0.0.1:3000', open: r })),
    checkPort(3000, 'localhost').then(r => ({ host: 'localhost:3000', open: r })),
    checkPort(3000, '::1').then(r => ({ host: '[::1]:3000', open: r })),
    checkPort(3000, '0.0.0.0').then(r => ({ host: '0.0.0.0:3000', open: r }))
  ]);
  
  results.forEach(r => {
    console.log(`   ${r.host}: ${r.open ? '✅ Open' : '❌ Closed'}`);
  });
  
  return results.some(r => r.open);
}

// Step 3: Create minimal test server
console.log('\n3️⃣ Creating Minimal Test Server...');
const testServer = http.createServer((req, res) => {
  console.log(`   📥 Request received: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head><title>KFAR Test Server</title></head>
      <body>
        <h1>✅ Test Server Working!</h1>
        <p>If you can see this, the connection works!</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Step 4: Try multiple binding strategies
console.log('\n4️⃣ Testing Binding Strategies...');
const bindingStrategies = [
  { host: '127.0.0.1', name: 'IPv4 Loopback' },
  { host: '::1', name: 'IPv6 Loopback' },
  { host: '0.0.0.0', name: 'All IPv4' },
  { host: '::', name: 'All IPv6' },
  { host: undefined, name: 'Node Default' }
];

let strategyIndex = 0;
let serverInstance = null;

async function tryNextStrategy() {
  if (strategyIndex >= bindingStrategies.length) {
    console.log('\n❌ All binding strategies failed!');
    console.log('\n5️⃣ Attempting System-Level Fixes...');
    
    // Try system fixes
    console.log('   Resetting network interfaces...');
    try {
      execSync('sudo ifconfig lo0 down && sudo ifconfig lo0 up', { stdio: 'inherit' });
      console.log('   ✅ Network reset complete');
    } catch (e) {
      console.log('   ⚠️  Network reset requires sudo');
    }
    
    // Create bypass server
    console.log('\n6️⃣ Creating Bypass Server...');
    createBypassServer();
    return;
  }
  
  const strategy = bindingStrategies[strategyIndex];
  console.log(`\n   Testing ${strategy.name}...`);
  
  serverInstance = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('OK');
  });
  
  serverInstance.on('error', (err) => {
    console.log(`   ❌ Failed: ${err.message}`);
    strategyIndex++;
    tryNextStrategy();
  });
  
  serverInstance.on('listening', async () => {
    const addr = serverInstance.address();
    console.log(`   ✅ Bound to ${addr.address}:${addr.port}`);
    
    // Test connection
    const testUrl = strategy.host === '::1' ? 'http://[::1]:3000' : 'http://127.0.0.1:3000';
    
    http.get(testUrl, (res) => {
      console.log(`   ✅ Connection test passed!`);
      serverInstance.close();
      
      // Use this strategy for Next.js
      console.log(`\n✨ Working strategy found: ${strategy.name}`);
      startNextWithStrategy(strategy);
    }).on('error', (err) => {
      console.log(`   ❌ Connection test failed: ${err.message}`);
      serverInstance.close();
      strategyIndex++;
      tryNextStrategy();
    });
  });
  
  try {
    if (strategy.host) {
      serverInstance.listen(3000, strategy.host);
    } else {
      serverInstance.listen(3000);
    }
  } catch (err) {
    console.log(`   ❌ Bind failed: ${err.message}`);
    strategyIndex++;
    tryNextStrategy();
  }
}

// Step 5: Start Next.js with working strategy
function startNextWithStrategy(strategy) {
  console.log('\n7️⃣ Starting Next.js with Working Configuration...');
  
  // Kill any existing Next.js
  try {
    execSync('pkill -f "next dev" || true');
  } catch (e) {}
  
  const env = { ...process.env };
  if (strategy.host) {
    env.HOST = strategy.host;
  }
  
  // Create custom server file
  const customServer = `
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = true;
const hostname = '${strategy.host || '127.0.0.1'}';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('Starting Next.js...');

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      res.end('error');
    }
  });
  
  server.listen(port, ${strategy.host ? `'${strategy.host}'` : ''}, (err) => {
    if (err) throw err;
    console.log('✅ Server running at:');
    console.log('   http://127.0.0.1:3000');
    console.log('   http://localhost:3000');
    ${strategy.host === '::1' ? "console.log('   http://[::1]:3000');" : ''}
  });
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
  `;
  
  fs.writeFileSync('custom-server.js', customServer);
  
  console.log('   Starting custom server...');
  const child = spawn('node', ['custom-server.js'], {
    cwd: process.cwd(),
    env,
    stdio: 'inherit'
  });
  
  child.on('error', (err) => {
    console.error('Failed to start:', err);
    createBypassServer();
  });
}

// Step 6: Create bypass server as last resort
function createBypassServer() {
  console.log('\n🚨 Creating Emergency Bypass Server...');
  
  // Create a simple static server
  const express = `
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log('Request:', req.url);
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(\`
<!DOCTYPE html>
<html>
<head>
  <title>KFAR Emergency Server</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    .success { color: green; }
    .info { background: #f0f0f0; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1 class="success">✅ Emergency Server Running!</h1>
  <div class="info">
    <h2>Localhost Connection Issues Detected</h2>
    <p>This emergency server proves Node.js can serve HTTP.</p>
    <p>To fix Next.js, try:</p>
    <ol>
      <li>Restart your Mac</li>
      <li>Disable VPN/Proxy</li>
      <li>Try Safari browser</li>
      <li>Use port forwarding: <code>ssh -L 8080:localhost:3000 localhost</code></li>
    </ol>
  </div>
  <div class="info">
    <h3>Alternative Access Methods:</h3>
    <ul>
      <li><a href="http://localhost.localdomain:3000">localhost.localdomain:3000</a></li>
      <li><a href="http://lvh.me:3000">lvh.me:3000</a></li>
      <li><a href="http://127.0.0.1.nip.io:3000">127.0.0.1.nip.io:3000</a></li>
    </ul>
  </div>
</body>
</html>
    \`);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Try multiple ports
const ports = [3000, 3001, 8080, 8000];
let portIndex = 0;

function tryPort() {
  const port = ports[portIndex];
  server.listen(port, '0.0.0.0', () => {
    console.log(\`
✅ EMERGENCY SERVER RUNNING!
==========================
Access at:
- http://127.0.0.1:\${port}
- http://localhost:\${port}
- http://[::1]:\${port}
- http://lvh.me:\${port}

If none work, your system has serious network issues.
    \`);
  }).on('error', () => {
    portIndex++;
    if (portIndex < ports.length) {
      tryPort();
    } else {
      console.log('❌ All ports failed! System network issue detected.');
    }
  });
}

tryPort();
  `;
  
  fs.writeFileSync('emergency-server.js', express);
  const child = spawn('node', ['emergency-server.js'], { stdio: 'inherit' });
}

// Run the diagnostic
async function runDiagnostic() {
  const portOpen = await portScan();
  
  if (portOpen) {
    console.log('\n⚠️  Port 3000 appears to be in use. Killing existing processes...');
    try {
      execSync('lsof -ti:3000 | xargs kill -9 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {}
  }
  
  tryNextStrategy();
}

runDiagnostic();