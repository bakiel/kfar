# KFAR Marketplace Image Management Guide

## Overview
This guide documents the centralized image management system that prevents cross-contamination of vendor images and ensures each vendor's products display the correct images.

## Problem Solved
Previously, People Store (Nations Store) products were incorrectly displaying images from other vendors (Teva Deli, Queens Cuisine) due to a flawed image mapping system. This created confusion and misrepresentation of products.

## Solution Architecture

### 1. Centralized Image Manager (`/lib/utils/image-manager.ts`)
A single source of truth for all vendor and product images:

```typescript
import { getProductImage, getVendorLogo, getProductImages } from '@/lib/utils/image-manager';
```

### 2. Vendor-Specific Image Paths
Each vendor has its own namespace for images:
- **People Store**: `/images/vendors/Peoples Store - [Product Name].jpg`
- **Teva Deli**: `/images/vendors/teva_deli_[product_description].jpg`
- **Queens Cuisine**: `/images/vendors/queens_cuisine_[product_description].jpg`
- **Gahn Delight**: `/images/vendors/gahn_delight_[product_description].jpg`

### 3. Key Functions

#### `getProductImage(vendorId: string, productId: string): string`
Returns the correct image path for a product based on vendor and product ID.

#### `getVendorLogo(vendorId: string): string`
Returns the vendor's logo with fallback support.

#### `getProductImages(vendorId: string, productId: string): string[]`
Returns an array of images for product galleries.

## Usage Examples

### In Product Detail Pages
```typescript
const productImage = getProductImage(vendorId, productId);
const productImages = getProductImages(vendorId, productId);
const vendorLogo = getVendorLogo(vendorId);
```

### In API Endpoints
```typescript
const enhancedProduct = {
  ...product,
  image: getProductImage(vendorKey, product.id),
  vendorLogo: getVendorLogo(vendorKey),
};
```

## People Store Product Mapping

All 23 People Store products now correctly map to their actual images:

| Product ID | Product Name | Image File |
|------------|--------------|------------|
| ps-001 | Bulk Beans, Oats, Rice and Grains Basket | `Peoples Store - Bulk Beans Oats Rice and Grains Basket Display.jpg` |
| ps-002 | Bulk Flour and Powder Ingredients | `Peoples Store - Bulk Flour and Powder Ingredients.jpg` |
| ps-003 | FOCO Coconut Water Variety Pack | `Peoples Store - FOCO Coconut Water Variety Pack.jpg` |
| ps-004 | Great Northern Organic Maple Syrup | `Peoples Store - Great Northern Organic Maple Syrup.jpg` |
| ... | ... | ... |

## Benefits

1. **No Cross-Contamination**: Each vendor's products only show their own images
2. **Centralized Management**: Single place to update image mappings
3. **Fallback Support**: Graceful handling of missing images
4. **Type Safety**: TypeScript ensures correct usage
5. **Scalability**: Easy to add new vendors and products

## Adding New Vendors

To add a new vendor:

1. Add vendor entry to `VENDOR_IMAGE_PATHS` in `image-manager.ts`:
```typescript
'new-vendor-id': {
  logo: '/images/vendors/new_vendor_logo.jpg',
  products: {
    'nv-001': '/images/vendors/new_vendor_product_1.jpg',
    // ... more products
  }
}
```

2. Place images in `/public/images/vendors/` directory

3. Use the standard functions throughout the app

## Maintenance

### Checking for Missing Images
The image manager logs warnings for missing images:
- `Unknown vendor: [vendorId]`
- `Product image not found for [vendorId]/[productId]`

### Image Naming Convention
- **Vendor Logos**: `[vendor_name]_logo_[description].jpg`
- **Product Images**: `[Vendor Name] - [Product Description].jpg`

## Deprecated Files
The following file should no longer be used:
- `/lib/data/people-store-images.ts` - Contains incorrect mappings

## Testing
Always verify:
1. Product detail pages show correct images
2. Shop/marketplace pages display correct vendor products
3. API endpoints return proper image URLs
4. No console warnings about missing images

---

Last Updated: January 2025
Status: Implemented and Active