# KFAR Marketplace Server Status & Running Notes

## Current Status (January 2025)

### 🔴 Server Status
- **Next.js Server**: NOT RUNNING (was killed earlier due to routing conflicts)
- **WebSocket Server**: NOT RUNNING
- **PostgreSQL Database**: ✅ RUNNING (confirmed on port 5432)

### 📋 Completed Setup Tasks
1. ✅ PostgreSQL installed and database created (`kfar_marketplace`)
2. ✅ Environment variables configured in `.env.local`
3. ✅ Database migration partially completed (6 vendors created)
4. ✅ All dependencies installed (including pg, socket.io, bcryptjs, UI components)
5. ✅ Routing conflicts resolved (removed duplicate [id] and [vendorId] routes)

### 🚨 Known Issues
1. **Routing Conflict** (RESOLVED):
   - Had conflicting routes: `/app/admin/vendor/[id]` and `/app/admin/vendor/[vendorId]`
   - Fixed by removing the `[id]` directory

2. **Database Migration**:
   - Simple migration script created sample vendors but full product migration needs work
   - Schema has some column mismatches that need addressing

3. **Localhost Connection Issues** (Historical):
   - Previous issues with browser refusing localhost connections
   - Solutions documented in `LOCALHOST_CONNECTION_FIX.md`

## 🚀 How to Start Servers

### Option 1: Standard Development Mode
```bash
# Terminal 1 - Start Next.js
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app
npm run dev

# Terminal 2 - Start WebSocket Server (optional for real-time features)
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app
node server/websocket-server.js
```

### Option 2: Admin-Specific Mode (if localhost issues)
```bash
# Use specific host binding
npm run dev:admin
# This runs: next dev -H 127.0.0.1 -p 3000
```

### Option 3: Background Mode
```bash
# Start both servers in background
npm run dev > dev.log 2>&1 &
node server/websocket-server.js > websocket.log 2>&1 &

# Check logs
tail -f dev.log
tail -f websocket.log
```

## 🌐 Access Points

### Main Application
- Standard: http://localhost:3000
- Alternative IPs (if localhost fails):
  - http://127.0.0.1:3000
  - http://192.168.18.3:3000
  - http://[::1]:3000

### Vendor Admin Dashboards
- Teva Deli: http://localhost:3000/admin/vendor/teva-deli
- People Store: http://localhost:3000/admin/vendor/people-store
- Gahn Delight: http://localhost:3000/admin/vendor/gahn-delight
- VOP Shop: http://localhost:3000/admin/vendor/vop-shop
- Queen's Cuisine: http://localhost:3000/admin/vendor/queens-cuisine
- Garden of Light: http://localhost:3000/admin/vendor/garden-of-light

### API Endpoints
- Products: http://localhost:3000/api/products-enhanced
- Vendors: http://localhost:3000/api/vendors
- Specific Vendor: http://localhost:3000/api/products-enhanced?vendorId=teva-deli

## 🔐 Vendor Credentials

All vendors use the same password pattern:
- **Email**: `{vendorId}@kfar.com`
- **Password**: `kfar2024`

Examples:
- `teva-deli@kfar.com` / `kfar2024`
- `people-store@kfar.com` / `kfar2024`

## 🛠️ Troubleshooting

### If Server Won't Start
1. Check for port conflicts:
   ```bash
   lsof -i :3000
   lsof -i :3002
   ```

2. Kill any stuck processes:
   ```bash
   pkill -f "next dev"
   pkill -f "node.*websocket"
   ```

3. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

### If Browser Can't Connect
1. Try different browsers (Safari often works when Chrome doesn't)
2. Use incognito/private mode
3. Clear DNS cache:
   ```bash
   sudo dscacheutil -flushcache
   ```
4. See `LOCALHOST_CONNECTION_FIX.md` for detailed solutions

### Database Issues
1. Check PostgreSQL is running:
   ```bash
   pg_isready -h localhost
   ```

2. Verify database exists:
   ```bash
   psql -l | grep kfar_marketplace
   ```

3. Test database connection:
   ```bash
   psql postgresql://mac:@localhost:5432/kfar_marketplace -c "SELECT COUNT(*) FROM vendors;"
   ```

## 📊 System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  API Routes      │────▶│  PostgreSQL DB  │
│  (Port 3000)    │     │  (/api/v2/*)    │     │  (Port 5432)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                        │
         │                        │
         ▼                        ▼
┌─────────────────┐     ┌──────────────────┐
│ WebSocket Server│     │  Data Adapter    │
│  (Port 3002)    │     │ (JSON/DB Bridge) │
└─────────────────┘     └──────────────────┘
```

## 🎯 Current Mode

The system is currently in **Hybrid Mode**:
- ✅ JSON files still work (backward compatibility)
- ✅ Database ready for vendor self-management
- ✅ Data adapter allows seamless switching
- ⚠️ Real-time features require WebSocket server

## 📝 Next Steps

1. Start the Next.js server
2. Optionally start WebSocket server for real-time updates
3. Access vendor dashboards to test functionality
4. Verify vendor login works with provided credentials

---

**Last Updated**: January 31, 2025
**Created By**: Claude (Session continuation from self-managed marketplace implementation)