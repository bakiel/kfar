#!/bin/bash

echo "=== Browser Localhost Connection Fix Script ==="
echo ""

echo "Since curl works but browsers fail, this is a browser-specific issue."
echo "Here are the steps to fix it:"
echo ""

echo "1. Testing with a simple HTML file..."
cat > /tmp/test-localhost.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Localhost Test</title>
</head>
<body>
    <h1>Testing Localhost Connections</h1>
    <div id="results"></div>
    <script>
        const results = document.getElementById('results');
        const urls = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://[::1]:3000',
            'http://192.168.18.3:3000'
        ];
        
        urls.forEach(url => {
            const div = document.createElement('div');
            div.innerHTML = `Testing ${url}... `;
            results.appendChild(div);
            
            fetch(url, { mode: 'no-cors' })
                .then(() => div.innerHTML += '✅ Reachable')
                .catch(err => div.innerHTML += `❌ Failed: ${err.message}`);
        });
    </script>
</body>
</html>
EOF

echo "Test file created at: /tmp/test-localhost.html"
echo "Open this file in your browser: file:///tmp/test-localhost.html"
echo ""

echo "2. Browser-specific fixes:"
echo ""

echo "For Chrome:"
echo "  a) Open chrome://settings/content/insecureContent"
echo "  b) Add these to 'Allowed to show insecure content':"
echo "     - http://localhost:3000"
echo "     - http://127.0.0.1:3000"
echo "  c) Open chrome://flags/"
echo "  d) Search for 'localhost' and ensure:"
echo "     - 'Allow invalid certificates for resources loaded from localhost' is ENABLED"
echo "  e) Clear cache: chrome://settings/privacy → Clear browsing data"
echo ""

echo "For Safari:"
echo "  a) Safari → Preferences → Advanced → Show Develop menu"
echo "  b) Develop → Disable Cross-Origin Restrictions"
echo "  c) Develop → Disable Local File Restrictions"
echo "  d) Clear cache: Develop → Empty Caches"
echo ""

echo "For Firefox:"
echo "  a) Type about:config in address bar"
echo "  b) Search for 'network.proxy.allow_hijacking_localhost'"
echo "  c) Set it to 'false'"
echo "  d) Clear cache: Preferences → Privacy & Security → Clear Data"
echo ""

echo "3. System-wide fixes (run these commands):"
echo ""

echo "Flush DNS cache:"
echo "sudo dscacheutil -flushcache"
echo "sudo killall -HUP mDNSResponder"
echo ""

echo "Reset network preferences:"
echo "sudo rm /Library/Preferences/SystemConfiguration/NetworkInterfaces.plist"
echo "sudo rm /Library/Preferences/SystemConfiguration/preferences.plist"
echo "(Then restart your Mac)"
echo ""

echo "4. Creating a bypass proxy script..."
cat > /tmp/fix-browser-proxy.sh << 'EOF'
#!/bin/bash
# Disable all proxy settings for current session
unset HTTP_PROXY
unset HTTPS_PROXY
unset ALL_PROXY
unset http_proxy
unset https_proxy
unset all_proxy
export NO_PROXY="localhost,127.0.0.1,::1,192.168.18.3"

echo "Proxy settings cleared for this session"
echo "Now try running your browser from this terminal:"
echo "  open -a 'Google Chrome'"
echo "  open -a Safari"
echo "  open -a Firefox"
EOF
chmod +x /tmp/fix-browser-proxy.sh

echo "Run this to test without proxy: source /tmp/fix-browser-proxy.sh"
echo ""

echo "5. Alternative development server options:"
echo ""
echo "Try using a different port:"
echo "  Change your server to use port 8080, 8000, or 5000"
echo ""
echo "Use ngrok for temporary public URL:"
echo "  brew install ngrok"
echo "  ngrok http 3000"
echo ""

echo "6. Quick test server with CORS headers:"
cat > /tmp/cors-test-server.js << 'EOF'
const http = require('http');
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('CORS-enabled server response\n');
});
server.listen(3000, '0.0.0.0', () => {
  console.log('CORS-enabled server running on port 3000');
});
EOF

echo "To test with CORS headers: node /tmp/cors-test-server.js"
echo ""

echo "=== Immediate Actions ==="
echo "1. First, kill the current server: killall node"
echo "2. Clear browser cache and cookies"
echo "3. Try accessing http://127.0.0.1:3000 in an incognito/private window"
echo "4. If still failing, open browser console (F12) and check for specific errors"
echo ""