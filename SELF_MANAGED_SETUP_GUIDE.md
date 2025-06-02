# KFAR Self-Managed Marketplace Setup Guide

## Overview
This guide completes the transition from static JSON files to a fully self-managed marketplace with vendor dashboards, real-time updates, and database backend.

## Prerequisites

### 1. PostgreSQL Database
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb kfar_marketplace
```

### 2. Environment Configuration
Create `.env.local` file:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/kfar_marketplace
USE_DATABASE=true

# Auth
JWT_SECRET=your-secure-jwt-secret-here
BCRYPT_ROUNDS=10

# WebSocket
WEBSOCKET_PORT=3002

# API
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3002
```

## Installation Steps

### 1. Dependencies (Already Completed)
All required dependencies have been installed:
- `pg` - PostgreSQL client
- `socket.io` & `socket.io-client` - Real-time updates
- `bcryptjs` & `jsonwebtoken` - Authentication
- UI components - Radix UI, class-variance-authority, lucide-react

### 2. Database Setup

#### Run Migration Script
```bash
cd /Users/mac/Downloads/kfar-final/kfar-marketplace-app
node scripts/migrate-to-postgres.js
```

This will:
- Create all database tables
- Migrate existing JSON data to PostgreSQL
- Set up vendor accounts with default passwords

### 3. Start Services

#### Terminal 1: Next.js App
```bash
npm run dev
```

#### Terminal 2: WebSocket Server
```bash
node server/websocket-server.js
```

### 4. Default Vendor Credentials

After migration, vendors can login with:
- **Email**: `{vendorId}@kfar.com`
- **Password**: `kfar2024`

Example logins:
- `teva-deli@kfar.com` / `kfar2024`
- `people-store@kfar.com` / `kfar2024`
- `gahn-delight@kfar.com` / `kfar2024`
- `vop-shop@kfar.com` / `kfar2024`
- `queens-cuisine@kfar.com` / `kfar2024`
- `garden-of-light@kfar.com` / `kfar2024`

## Vendor Admin Features

### Access Dashboard
Navigate to: `http://localhost:3000/admin/vendor/{vendorId}`

### Dashboard Tabs

1. **Overview**
   - Sales metrics and analytics
   - Recent orders
   - Performance graphs

2. **Products**
   - Inline product editing
   - Image management
   - Inventory tracking
   - Real-time updates

3. **Store Info**
   - Branding customization
   - Banner management
   - Store description
   - Contact information

4. **Settings**
   - Payment preferences
   - Shipping options
   - Business hours
   - API settings

## Architecture Overview

### Data Flow
```
Frontend (Next.js)
    ↓
Data Adapter (Switches between JSON/DB)
    ↓
API v2 Endpoints
    ↓
PostgreSQL Database
    ↓
WebSocket Server (Real-time updates)
```

### Key Components

1. **Data Adapter** (`/lib/services/data-adapter.ts`)
   - Provides seamless switching between JSON and database
   - Maintains backward compatibility

2. **Vendor Data Service** (`/lib/services/vendor-data-service.ts`)
   - Comprehensive CRUD operations
   - Real-time synchronization
   - Audit logging

3. **API v2** (`/app/api/v2/`)
   - RESTful endpoints
   - Database integration
   - Authentication middleware

4. **WebSocket Integration**
   - Real-time product updates
   - Vendor-specific rooms
   - Event-based architecture

## Testing the System

### 1. Product Management
```typescript
// Update a product (triggers real-time sync)
await vendorDataService.product.updateProduct({
  productId: 'td-001',
  vendorId: 'teva-deli',
  updates: {
    name: 'Updated Product Name',
    price: 29.99,
    inventory: 50
  }
});
```

### 2. Real-time Updates
```typescript
// Subscribe to product updates
realtimeService.subscribe(RealtimeEvent.PRODUCT_UPDATED, (data) => {
  console.log('Product updated:', data);
});
```

### 3. Analytics Tracking
```typescript
// Record product view
await vendorDataService.analytics.recordProductView('td-001', 'teva-deli');
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Verify database exists
psql -l | grep kfar_marketplace
```

### WebSocket Connection
```bash
# Check if WebSocket server is running
lsof -i :3002
```

### Environment Variables
```bash
# Verify environment setup
node -e "console.log(process.env.DATABASE_URL)"
```

## Production Deployment

### 1. Database
- Use managed PostgreSQL (Supabase, Neon, etc.)
- Update DATABASE_URL in production env

### 2. WebSocket Server
- Deploy to separate service (Railway, Render)
- Configure CORS for production domain

### 3. Environment
- Set `USE_DATABASE=true` in production
- Configure secure JWT_SECRET
- Update API and WebSocket URLs

## Maintenance

### Backup Database
```bash
pg_dump kfar_marketplace > backup_$(date +%Y%m%d).sql
```

### Monitor Performance
- Check `/api/v2/analytics/performance`
- Review audit logs in database
- Monitor WebSocket connections

## Summary

The self-managed marketplace is now fully implemented with:
- ✅ Database backend (PostgreSQL)
- ✅ Vendor admin dashboards
- ✅ Real-time updates (WebSocket)
- ✅ Authentication system
- ✅ Data migration from JSON
- ✅ Backward compatibility
- ✅ UI components installed
- ✅ Comprehensive product pages

Vendors can now:
- Login to their dashboards
- Manage products in real-time
- Track analytics
- Customize their stores
- Receive instant updates

The system maintains full backward compatibility with existing JSON files while enabling database features when configured.