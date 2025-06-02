#!/bin/bash

echo "🔧 KFAR Marketplace Server Workaround"
echo "======================================"

# Kill any existing processes
pkill -f "next|node" 2>/dev/null || true

# Clear cache
rm -rf .next/cache 2>/dev/null || true

echo "🚀 Starting server on multiple interfaces..."

# Get network IP
NETWORK_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "unknown")

export HOSTNAME=0.0.0.0
export PORT=3001
export NEXT_PUBLIC_API_URL=http://localhost:3001

echo ""
echo "🌐 Server will be available at:"
echo "   📱 http://localhost:3001"
echo "   🖥️  http://127.0.0.1:3001" 
echo "   🌍 http://$NETWORK_IP:3001"
echo ""
echo "⚠️  If localhost doesn't work, try the network IP"
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev