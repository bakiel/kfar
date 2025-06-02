#!/bin/bash

echo "=== KFAR Admin Connection Diagnostic ==="
echo ""

# 1. Check if Node processes are running
echo "1. Checking Node processes:"
ps aux | grep node | grep -E "(next|3000)" | grep -v grep | head -5

echo ""
echo "2. Checking what's listening on port 3000:"
lsof -nP -iTCP:3000

echo ""
echo "3. Testing localhost resolution:"
ping -c 1 localhost > /dev/null 2>&1 && echo "✓ localhost resolves correctly" || echo "✗ localhost resolution failed"

echo ""
echo "4. Checking firewall:"
sudo pfctl -s info 2>/dev/null | head -5 || echo "Firewall check requires admin password"

echo ""
echo "5. Testing port 3000 connectivity:"
nc -zv localhost 3000 2>&1
nc -zv 127.0.0.1 3000 2>&1

echo ""
echo "6. Network interfaces:"
ifconfig | grep -E "^lo0:|inet " | head -10

echo ""
echo "=== SOLUTIONS TO TRY ==="
echo ""
echo "1. If using VS Code Remote/SSH:"
echo "   - Check the 'Ports' tab in VS Code terminal panel"
echo "   - Look for auto-forwarded ports"
echo ""
echo "2. Try these in Safari (not Chrome):"
echo "   - http://127.0.0.1:3000/admin"
echo "   - http://[::1]:3000/admin"
echo ""
echo "3. Check for VPN/Proxy software that might interfere"
echo ""
echo "4. Try disabling firewall temporarily:"
echo "   sudo pfctl -d"
echo ""
echo "5. If all else fails, try:"
echo "   npm run build && npm run start"
echo "   (This runs production mode which might work differently)"
echo ""