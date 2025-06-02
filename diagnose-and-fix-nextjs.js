#!/usr/bin/env node
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 NEXT.JS LOCALHOST DIAGNOSTIC & FIX TOOL');
console.log('==========================================\n');

// Step 1: Kill any existing processes
console.log('1️⃣ Cleaning up existing processes...');
try {
  execSync('pkill -f "next dev" || true', { stdio: 'inherit' });
  execSync('pkill -f "node.*next" || true', { stdio: 'inherit' });
  console.log('   ✅ Cleaned up old processes\n');
} catch (e) {
  console.log('   ℹ️  No processes to clean\n');
}

// Step 2: Clear Next.js cache
console.log('2️⃣ Clearing Next.js cache...');
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  execSync('rm -rf .next', { cwd: __dirname });
  console.log('   ✅ Cache cleared\n');
} else {
  console.log('   ℹ️  No cache to clear\n');
}

// Step 3: Check and fix permissions
console.log('3️⃣ Checking file permissions...');
try {
  execSync('chmod -R 755 node_modules/.bin 2>/dev/null || true', { cwd: __dirname });
  console.log('   ✅ Permissions fixed\n');
} catch (e) {
  console.log('   ℹ️  Permissions OK\n');
}

// Step 4: Create custom Next.js config with explicit host binding
console.log('4️⃣ Creating diagnostic Next.js configuration...');
const diagnosticConfig = `// Diagnostic configuration
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
      console.log(\`   📥 Request: \${req.method} \${req.url}\`);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('   ❌ Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(\`
✅ Next.js server is running!
==========================
🌐 Local URLs:
   - http://localhost:\${port}
   - http://127.0.0.1:\${port}
   - http://[::1]:\${port}

🔍 Diagnostic Info:
   - Process ID: \${process.pid}
   - Node Version: \${process.version}
   - Working Directory: \${process.cwd()}

📱 Network URLs:
   - http://192.168.18.3:\${port}

Press Ctrl+C to stop the server
\`);
  });
}).catch(err => {
  console.error('❌ Failed to start Next.js:', err);
  process.exit(1);
});
`;

fs.writeFileSync(path.join(__dirname, 'server-diagnostic.js'), diagnosticConfig);
console.log('   ✅ Diagnostic config created\n');

// Step 5: Try different startup methods
console.log('5️⃣ Attempting to start Next.js server...\n');

const startMethods = [
  {
    name: 'Method 1: Direct Node execution with explicit host',
    command: 'node',
    args: ['server-diagnostic.js'],
    env: { ...process.env, HOSTNAME: '127.0.0.1', PORT: '3000' }
  },
  {
    name: 'Method 2: NPM dev with explicit host',
    command: 'npm',
    args: ['run', 'dev', '--', '-H', '127.0.0.1'],
    env: process.env
  },
  {
    name: 'Method 3: Direct Next.js with all interfaces',
    command: 'npx',
    args: ['next', 'dev', '-H', '0.0.0.0'],
    env: process.env
  }
];

let currentMethod = 0;

function tryNextMethod() {
  if (currentMethod >= startMethods.length) {
    console.log('\n❌ All methods failed. Manual intervention required.');
    console.log('\n🆘 MANUAL FIX STEPS:');
    console.log('1. Restart your Mac');
    console.log('2. Disable any VPN or proxy');
    console.log('3. Check System Preferences > Security & Privacy > Firewall');
    console.log('4. Try a different port: PORT=8080 npm run dev');
    console.log('5. Use Safari instead of Chrome');
    process.exit(1);
  }

  const method = startMethods[currentMethod];
  console.log(`🧪 ${method.name}...`);
  
  const child = spawn(method.command, method.args, {
    cwd: __dirname,
    env: method.env,
    stdio: 'pipe'
  });

  let outputBuffer = '';
  let serverStarted = false;

  const checkOutput = (data) => {
    outputBuffer += data.toString();
    process.stdout.write(data);

    // Check if server started successfully
    if (outputBuffer.includes('Ready in') || 
        outputBuffer.includes('started server on') ||
        outputBuffer.includes('Local:')) {
      serverStarted = true;
      console.log('\n✅ Server started! Attempting to connect...\n');
      
      // Test the connection
      setTimeout(() => {
        const http = require('http');
        http.get('http://127.0.0.1:3000', (res) => {
          console.log(`\n🎉 SUCCESS! Server is accessible!`);
          console.log(`   Status Code: ${res.statusCode}`);
          console.log(`\n📌 Access your app at:`);
          console.log(`   - http://localhost:3000`);
          console.log(`   - http://127.0.0.1:3000`);
          console.log(`\n✨ The server is now running. Press Ctrl+C to stop.`);
        }).on('error', (err) => {
          console.log(`\n⚠️  Server started but can't connect: ${err.message}`);
          console.log('   Try accessing via browser anyway, or use Safari.');
        });
      }, 2000);
    }

    // Check for errors
    if (outputBuffer.includes('EADDRINUSE')) {
      console.log('\n❌ Port 3000 is already in use!');
      child.kill();
      currentMethod++;
      setTimeout(tryNextMethod, 1000);
    } else if (outputBuffer.includes('Error:') && !serverStarted) {
      setTimeout(() => {
        if (!serverStarted) {
          console.log(`\n❌ Method failed, trying next...\n`);
          child.kill();
          currentMethod++;
          tryNextMethod();
        }
      }, 5000);
    }
  };

  child.stdout.on('data', checkOutput);
  child.stderr.on('data', checkOutput);

  child.on('error', (err) => {
    console.log(`\n❌ Failed to start: ${err.message}`);
    currentMethod++;
    setTimeout(tryNextMethod, 1000);
  });

  // Give it 10 seconds to start
  setTimeout(() => {
    if (!serverStarted) {
      console.log('\n⏱️  Timeout, trying next method...\n');
      child.kill();
      currentMethod++;
      tryNextMethod();
    }
  }, 10000);
}

// Start trying methods
tryNextMethod();