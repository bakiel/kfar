const { spawn } = require('child_process');
const path = require('path');

console.log('KFAR Marketplace Server Launcher');
console.log('================================');
console.log('Working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('');

// Kill any existing process on port 3000
console.log('Checking for existing processes on port 3000...');
const killPort = spawn('lsof', ['-ti:3000']);
killPort.on('close', (code) => {
  if (code === 0) {
    console.log('Found existing process, killing it...');
    spawn('kill', ['-9', killPort.stdout.toString().trim()]);
  }
  
  setTimeout(() => {
    startServer();
  }, 2000);
});

function startServer() {
  console.log('Starting Next.js server...');
  console.log('');
  
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: '3000',
      HOST: '0.0.0.0'
    }
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
  });

  // Give instructions
  setTimeout(() => {
    console.log('\n================================');
    console.log('Server should be starting...');
    console.log('Try accessing: http://localhost:3000/admin');
    console.log('Or try: http://127.0.0.1:3000/admin');
    console.log('Or try: http://0.0.0.0:3000/admin');
    console.log('================================\n');
  }, 3000);
}