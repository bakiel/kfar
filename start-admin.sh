#!/bin/bash

echo "Starting KFAR Admin Panel..."
echo "================================"

# Kill any existing processes
echo "Cleaning up old processes..."
pkill -f "next dev" 2>/dev/null
pkill -f "node.*next" 2>/dev/null

# Wait for cleanup
sleep 2

# Start the server with explicit binding
echo "Starting Next.js server..."
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app

# Start with explicit host binding to all interfaces
HOST=0.0.0.0 PORT=3000 npx next dev &

# Wait for server to start
sleep 5

echo ""
echo "================================"
echo "Server should be starting..."
echo "Try these URLs:"
echo ""
echo "1. http://0.0.0.0:3000/admin"
echo "2. http://127.0.0.1:3000/admin"
echo "3. http://localhost:3000/admin"
echo "4. http://192.168.18.3:3000/admin (your network IP)"
echo ""
echo "If VS Code port forwarding is active, also try:"
echo "5. The forwarded port URL shown in VS Code's Ports panel"
echo "================================"