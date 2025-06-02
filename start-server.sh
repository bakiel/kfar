#!/bin/bash

echo "Starting KFAR Marketplace..."
echo "==========================="

# Kill any existing processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Wait a moment
sleep 2

# Start the server
echo "Starting Next.js server..."
npm run dev -- --hostname 127.0.0.1 --port 3000

echo "Server should be available at http://127.0.0.1:3000"