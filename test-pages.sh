#!/bin/bash

echo "Testing KFAR Marketplace Pages..."
echo "================================"

# Test homepage
echo -n "Testing homepage... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/ | grep -q "200" && echo "✓ OK" || echo "✗ FAILED"

# Test product page
echo -n "Testing product page... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/product/1 | grep -q "200" && echo "✓ OK" || echo "✗ FAILED"

# Test cart page
echo -n "Testing cart page... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/cart | grep -q "200" && echo "✓ OK" || echo "✗ FAILED"

# Test checkout page
echo -n "Testing checkout page... "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/checkout | grep -q "200" && echo "✓ OK" || echo "✗ FAILED"

echo "================================"
echo "All page tests completed!"