#!/bin/bash

echo "🔧 KFAR Marketplace Server Fix Script"
echo "====================================="

# 1. Kill all Node processes
echo "1. Killing all Node processes..."
pkill -f node
pkill -f next
sleep 2

# 2. Clear all caches
echo "2. Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 3. Check disk permissions
echo "3. Checking file permissions..."
chmod -R 755 .
ls -la package.json

# 4. Reset npm
echo "4. Resetting npm..."
npm cache clean --force

# 5. Reinstall dependencies
echo "5. Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# 6. Try starting without Turbopack
echo "6. Starting server without Turbopack..."
echo "Server will start at: http://localhost:3000"
npx next dev --hostname 0.0.0.0 --port 3000