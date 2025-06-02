#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js server with process monitoring...');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Start Next.js server
const nextProcess = spawn('npx', ['next', 'dev', '-p', PORT, '-H', HOST], {
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit'
});

// Handle process lifecycle
let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  console.log(`\n[${signal}] Gracefully shutting down...`);
  
  // Give Next.js time to clean up
  nextProcess.kill('SIGTERM');
  
  setTimeout(() => {
    console.log('Force killing process...');
    nextProcess.kill('SIGKILL');
    process.exit(0);
  }, 5000);
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGHUP', () => gracefulShutdown('SIGHUP'));

// Monitor Next.js process
nextProcess.on('exit', (code, signal) => {
  console.log(`Next.js process exited with code ${code} and signal ${signal}`);
  if (!isShuttingDown) {
    console.error('Next.js process died unexpectedly!');
    process.exit(1);
  }
});

nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js process:', err);
  process.exit(1);
});

// Keep the process alive
process.stdin.resume();

console.log(`Server starting on http://${HOST}:${PORT}`);
console.log('Press Ctrl+C to stop the server gracefully');