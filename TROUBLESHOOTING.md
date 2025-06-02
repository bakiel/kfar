# KFAR Marketplace Troubleshooting Guide

## Quick Fixes for Common Issues

### 1. People Store Logo Not Showing

**Symptoms**:
- Broken image icon in cart page vendor header
- Missing logo on checkout page
- Console errors about image not found

**Solution**:
```typescript
// In cart/page.tsx, ensure getVendorLogo includes:
const vendorIdMap: Record<string, string> = {
  'People Store': 'people-store',  // Note exact capitalization
  // ... other vendors
};
```

**Checklist**:
- [ ] Vendor name in cart matches catalog exactly ('People Store' not 'Peoples Store')
- [ ] Logo file exists at `/public/images/vendors/people_store_logo_community_retail.jpg`
- [ ] getVendorLogo function has mapping for People Store

### 2. Product Images Breaking

**Symptoms**:
- Product images show as broken in cart/checkout
- Especially common with People Store products

**Solution**:
```typescript
// Add image validation and fallback
let itemImage = item.image;
if (item.vendorId === 'people-store' && !item.image.startsWith('/images/')) {
  itemImage = '/images/vendors/[fallback-image].jpg';
}

// Add onError handler
<Image
  src={itemImage}
  alt={item.name}
  onError={(e) => {
    const target = e.currentTarget as HTMLImageElement;
    target.src = '/images/vendors/[fallback-image].jpg';
  }}
/>
```

### 3. TypeScript Errors in Cart

**Symptoms**:
- "Element implicitly has an 'any' type" errors
- Cannot index type errors with currency/coupon objects

**Solution**:
```typescript
// Add proper type annotations
const validCoupons: Record<string, { discount: number; description: string }> = {
  // ... coupons
};

// Use keyof for type safety
currencySymbols[currency as keyof typeof currencySymbols]
```

### 4. Floating Sidebar Issues

**Symptoms**:
- Sidebar overlapping content
- Can't close suggestions panel
- Panel not matching design

**Solution**:
- Ensure separate state for suggestions: `const [showSuggestions, setShowSuggestions] = useState(true)`
- Add close button in header with proper onClick handler
- Use consistent design patterns (gradient headers, rounded corners)

### 5. Data Not Flowing to Admin

**Symptoms**:
- Products not showing in vendor admin
- Changes not reflected across pages

**Solution**:
- Ensure all pages import from `@/lib/data/complete-catalog`
- Use the `/api/products-enhanced` endpoint
- Check vendor ID matches between URL and catalog keys

## Debug Commands

### Check Product Data
```bash
# View all vendor IDs
grep "vendorId:" lib/data/complete-catalog.ts

# Find specific vendor section
grep -n "'people-store':" lib/data/complete-catalog.ts

# Check image paths
ls -la public/images/vendors/ | grep people
```

### Test API Endpoints
```bash
# Test products API
curl http://localhost:3000/api/products-enhanced

# Test specific vendor
curl http://localhost:3000/api/products-enhanced?vendorId=people-store
```

### Common File Locations
- **Product Catalog**: `/lib/data/complete-catalog.ts`
- **People Store Images**: `/lib/data/people-store-images.ts`
- **Cart Context**: `/lib/context/CartContext.tsx`
- **API Routes**: `/app/api/products-enhanced/route.ts`

## Prevention Tips

1. **Always match vendor names exactly** - 'People Store' not 'people-store' for display
2. **Use consistent image paths** - Always start with `/images/`
3. **Test with all vendors** - Don't just test with one vendor
4. **Check TypeScript errors** - Fix them immediately to prevent runtime issues
5. **Use fallback images** - Always have a default image for failures

## When All Else Fails

1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Check browser console for specific errors
4. Verify file exists: `ls -la public/images/vendors/[filename]`
5. Use React DevTools to inspect component props

---

Last Updated: January 2025