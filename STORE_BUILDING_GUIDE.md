# KFAR Marketplace Store Building Guide

## Overview
This guide documents the complete process for building and managing stores in the KFAR Marketplace system. All data flows through a centralized catalog system ensuring consistency across customer-facing pages, vendor admin panels, and API endpoints.

## Architecture Overview

### Data Flow
```
completeProductCatalog (single source of truth)
    ↓
├── API Endpoints (/api/products-enhanced)
├── Product Pages (/product/[id])
├── Shop Page (/shop)
├── Vendor Admin (/admin/vendor/[id])
└── Store Pages (/store/[vendorId])
```

## Key Files and Their Purposes

### 1. Data Sources
- **`/lib/data/complete-catalog.ts`** - Master product catalog containing all vendor and product data
- **`/lib/data/people-store-images.ts`** - Image mappings for People Store products
- **`/lib/data/products.ts`** - Legacy fallback data (being phased out)

### 2. API Endpoints
- **`/api/products-enhanced`** - Main products API with filtering, sorting, and vendor info
- **`/api/vendors`** - List of all vendors
- **`/api/vendors/[vendorId]/products`** - Products for specific vendor

### 3. Page Components
- **`/app/shop/page.tsx`** - Main marketplace page showing all products
- **`/app/product/[id]/page.tsx`** - Individual product detail pages
- **`/app/store/[vendorId]/page.tsx`** - Vendor-specific store pages
- **`/app/admin/vendor/[id]/page.tsx`** - Vendor admin dashboard

## Adding a New Vendor

### Step 1: Update the Master Catalog
Edit `/lib/data/complete-catalog.ts`:

```typescript
export const completeProductCatalog = {
  // ... existing vendors
  'new-vendor-id': {
    vendorId: 'new-vendor-id',
    vendorName: 'New Vendor Name',
    products: [
      {
        id: 'nv-001',
        name: 'Product Name',
        nameHe: 'שם המוצר',
        description: 'Product description',
        price: 25,
        originalPrice: 30, // Optional, for discounts
        category: 'food', // or 'beauty', 'wellness', etc.
        image: '/images/vendors/new_vendor_product_01.jpg',
        images: [
          '/images/vendors/new_vendor_product_01.jpg',
          '/images/vendors/new_vendor_product_02.jpg'
        ],
        kashrut: 'Badatz', // Optional
        vegan: true,
        organic: false,
        glutenFree: false,
        unit: 'piece',
        minimumOrder: 1,
        inStock: true,
        // Optional fields:
        rating: 4.8,
        reviewCount: 156,
        specifications: [
          { label: 'Weight', value: '200g' },
          { label: 'Ingredients', value: 'List of ingredients' }
        ],
        culturalSignificance: 'Description of cultural importance',
        shippingInfo: {
          localPickup: true,
          delivery: true,
          international: false
        }
      }
    ]
  }
};
```

### Step 2: Add Vendor Logo
Place the vendor logo in `/public/images/vendors/` with the naming convention:
- `new_vendor_id_logo.jpg` (or `.png`)

### Step 3: Add Product Images
Place product images in `/public/images/vendors/` with descriptive names:
- `new_vendor_product_01.jpg`
- `new_vendor_product_02.jpg`
- etc.

### Step 4: Update Logo Mappings
If using a non-standard logo filename, update the logo mappings in:
- `/app/admin/vendor/[id]/page.tsx`
- `/app/api/products-enhanced/route.ts`
- Any other files that reference vendor logos

## Managing Products

### Via Admin Panel
1. Navigate to `/admin`
2. Click on the vendor to manage
3. Use the inline editing features to:
   - Update product details
   - Change prices
   - Toggle stock status
   - Update dietary tags
   - Modify specifications

### Via Code
Update the product directly in `/lib/data/complete-catalog.ts` following the data structure above.

## API Usage

### Get All Products
```javascript
// Fetch all products with vendor info
const response = await fetch('/api/products-enhanced');
const data = await response.json();
// Returns: { products, totalCount, categories, vendors, filters }
```

### Filter Products
```javascript
// Filter by category and vendor
const response = await fetch('/api/products-enhanced?category=food&vendorId=teva-deli');

// Search products
const response = await fetch('/api/products-enhanced?search=burger');

// Sort products
const response = await fetch('/api/products-enhanced?sort=price-asc');
// Sort options: featured, price-asc, price-desc, rating, newest
```

## Product Page Features

### Floating Purchase Panel
The product page includes an enhanced floating card panel with:
- Gradient header with "Quick Purchase" branding
- Smooth animations and glow effects
- Collapsible design with animated toggle button
- All purchase options in one integrated card

### Related Products Section
- Shows detailed product cards with:
  - Larger images (96x96px)
  - Product descriptions
  - Review counts
  - Discount badges
  - Quick Add buttons
  - Dietary tags (Vegan, Kosher)

## Data Consistency Rules

1. **Single Source of Truth**: All product data must originate from `completeProductCatalog`
2. **Image Paths**: Always use absolute paths starting with `/images/`
3. **Required Fields**: Every product must have: id, name, description, price, category, image, inStock
4. **Vendor Mapping**: Vendor IDs must be consistent across all files
5. **API First**: Pages should fetch data from APIs, not import directly

## Testing Checklist

Before deploying new vendors/products:
- [ ] Product appears in shop page (`/shop`)
- [ ] Product detail page loads (`/product/[id]`)
- [ ] Vendor store page shows all products (`/store/[vendorId]`)
- [ ] Admin panel allows editing (`/admin/vendor/[id]`)
- [ ] API returns product data (`/api/products-enhanced`)
- [ ] Images load correctly
- [ ] Add to cart functionality works
- [ ] Mobile responsive design verified

## Common Issues and Solutions

### Issue: Product images not showing
**Solution**: 
- Check that images exist in `/public/images/vendors/` and paths in catalog match exactly
- For People Store products, ensure image mappings are in `/lib/data/people-store-images.ts`
- Implement fallback images in cart/checkout pages using onError handlers

### Issue: Vendor logo breaking on cart/checkout
**Solution**: 
- Update `getVendorLogo` function in cart page to include all vendor mappings
- Ensure vendor names match exactly (e.g., 'People Store' not 'Peoples Store')
- Add fallback logo path for unmatched vendors

### Issue: Vendor not appearing in admin
**Solution**: Ensure vendor ID in URL matches the key in `completeProductCatalog`

### Issue: Products not showing in shop
**Solution**: Verify the API endpoint `/api/products-enhanced` is returning data

### Issue: Cart not working
**Solution**: 
- Check that product has all required fields: id, name, price, image, vendorId, vendorName
- Ensure vendorName matches the display name (e.g., 'People Store' not 'people-store')

## Best Practices

1. **Image Optimization**: Keep product images under 500KB
2. **Consistent Naming**: Use kebab-case for IDs (e.g., 'teva-deli', 'ps-001')
3. **Descriptions**: Keep product descriptions under 200 characters
4. **Pricing**: Always use numbers for prices, not strings
5. **Stock Management**: Set inStock to false rather than removing products
6. **Cultural Context**: Include culturalSignificance for heritage products

## Future Enhancements

- Database integration to replace static catalog
- Real-time inventory management
- Multi-language support improvements
- Advanced search and filtering
- Customer review system
- Order management integration

---

Last Updated: January 2025
Version: 1.0