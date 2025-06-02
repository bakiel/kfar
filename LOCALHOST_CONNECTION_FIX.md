# Localhost Connection Fix for KFAR Marketplace

## Issue Summary
- Server runs and shows "Ready" with successful requests in logs
- Browser shows ERR_CONNECTION_REFUSED when accessing localhost:3000
- This is a macOS-specific network/firewall issue

## Solution Steps

### 1. Use the Debug Server (Currently Running)
The server is running via `fix-localhost.js` and responding to requests.

### 2. Access Methods (Try in Order)

#### Method A: Direct IP Access
```
http://127.0.0.1:3000/admin
```

#### Method B: Network IP Access
```
http://192.168.18.3:3000/admin
```

#### Method C: IPv6 Access
```
http://[::1]:3000/admin
```

### 3. Browser-Specific Fixes

#### Chrome:
1. Open Chrome in Incognito Mode (Cmd+Shift+N)
2. Disable all extensions temporarily
3. Clear browser cache: chrome://settings/clearBrowserData
4. Try: chrome://net-internals/#dns and click "Clear host cache"

#### Safari:
1. Safari often works when Chrome doesn't
2. Open Safari and try http://127.0.0.1:3000/admin

### 4. System-Level Fixes

#### Check Firewall:
```bash
# Check if firewall is blocking
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps
```

#### Reset Network:
```bash
# Flush DNS cache
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Reset network interfaces
sudo ifconfig lo0 down
sudo ifconfig lo0 up
```

### 5. Alternative Access Method

Since VS Code might be interfering, try:
1. Quit VS Code completely
2. Open Terminal app directly (not VS Code terminal)
3. Run: `cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app && npm run dev`
4. Access via browser

### 6. Port Forwarding Alternative

If localhost still fails, use ngrok:
```bash
# Install ngrok
brew install ngrok

# Forward port 3000
ngrok http 3000
```

This will give you a public URL that bypasses localhost issues.

## Current Status

✅ Backend API running on port 5001
✅ Next.js server running and responding to requests
✅ API endpoints working (confirmed via logs)
❌ Browser cannot connect to localhost

## The Nuclear Option

If nothing else works:
1. Restart your Mac
2. Before opening any other apps, open Terminal
3. Navigate to project and run `npm run dev`
4. Immediately try http://127.0.0.1:3000/admin

## Verification

The server IS working - we see in the logs:
- `GET /admin 200 in 2895ms`
- `GET /api/vendors 200 in 1001ms`

This confirms the server is running and serving pages successfully.

---

Last Updated: January 2025
Issue: macOS localhost connection refused despite working server