#!/bin/bash

echo "=== macOS Localhost Connection Diagnostics ==="
echo "Date: $(date)"
echo "Node version: $(node --version)"
echo ""

echo "1. Checking network interfaces..."
echo "Loopback interface (lo0):"
ifconfig lo0 | grep -E "(flags|inet)"
echo ""

echo "2. Checking /etc/hosts file..."
grep -E "(127\.0\.0\.1|localhost)" /etc/hosts
echo ""

echo "3. Checking for processes on port 3000..."
lsof -i :3000 2>/dev/null || echo "No processes found on port 3000"
echo ""

echo "4. Testing DNS resolution..."
echo "localhost resolves to: $(dscacheutil -q host -a name localhost | grep ip_address | awk '{print $2}')"
echo "127.0.0.1 resolves to: $(dscacheutil -q host -a ip_address 127.0.0.1 | grep name | awk '{print $2}')"
echo ""

echo "5. Testing network connectivity..."
echo "Pinging localhost (3 times):"
ping -c 3 localhost | grep -E "(PING|round-trip|packet loss)"
echo ""

echo "6. Checking for proxy settings..."
echo "HTTP_PROXY: ${HTTP_PROXY:-not set}"
echo "HTTPS_PROXY: ${HTTPS_PROXY:-not set}"
echo "NO_PROXY: ${NO_PROXY:-not set}"
echo "System proxy (HTTP): $(networksetup -getwebproxy Wi-Fi | grep -E "(Enabled|Server|Port)" | tr '\n' ' ')"
echo ""

echo "7. Checking browser-specific settings..."
echo "Chrome proxy settings:"
defaults read com.google.Chrome ProxyMode 2>/dev/null || echo "No Chrome proxy settings found"
echo ""

echo "8. Network Service Order:"
networksetup -listnetworkserviceorder | head -10
echo ""

echo "9. Checking for network filters or extensions..."
kextstat | grep -E "(filter|vpn|proxy)" | head -5
echo ""

echo "10. Testing with different Node.js server..."
cat > /tmp/test-server.js << 'EOF'
const net = require('net');
const server = net.createServer((socket) => {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
});
server.listen(3001, '127.0.0.1', () => {
  console.log('TCP server listening on 127.0.0.1:3001');
});
setTimeout(() => {
  server.close();
  process.exit(0);
}, 5000);
EOF

echo "Starting test TCP server on port 3001..."
node /tmp/test-server.js &
SERVER_PID=$!
sleep 1

echo "Testing connection to TCP server:"
(echo "test" | nc -w 2 127.0.0.1 3001) || echo "Failed to connect to test server"

kill $SERVER_PID 2>/dev/null
rm /tmp/test-server.js
echo ""

echo "=== Diagnostics Complete ==="
echo ""
echo "Recommendations:"
echo "1. If curl works but browsers don't, check browser proxy settings"
echo "2. Try disabling browser extensions temporarily"
echo "3. Clear browser cache and cookies"
echo "4. Try a different browser (Safari, Firefox, Chrome)"
echo "5. Check if any security software is installed"
echo "6. Reset network settings if needed (see instructions below)"