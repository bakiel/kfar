# Enhanced Image Management System Guide

## Overview
The enhanced image management system provides complete segregation of vendor assets into isolated buckets, preventing cross-contamination and ensuring each vendor's brand integrity.

## Architecture

### Vendor Bucket Structure
Each vendor has a dedicated bucket with subdirectories:
```
/public/images/vendors/
├── teva-deli/
│   ├── logo/
│   ├── banners/
│   ├── products/
│   ├── gallery/
│   ├── certificates/
│   ├── team/
│   ├── promotional/
│   └── storefront/
├── queens-cuisine/
│   └── [same structure]
├── gahn-delight/
│   └── [same structure]
├── garden-of-light/
│   └── [same structure]
├── people-store/
│   └── [same structure]
└── vop-shop/
    └── [same structure]
```

## Key Features

### 1. Complete Asset Segregation
- **Logo**: Brand identity
- **Banner**: Hero images for vendor pages
- **Products**: Individual product images
- **Gallery**: Additional showcase images
- **Certificates**: Kosher, vegan, organic certifications
- **Team**: Staff and chef photos
- **Promotional**: Special offers and campaigns
- **Storefront**: Physical store images

### 2. Enhanced Functions

```typescript
import {
  getVendorLogo,
  getVendorBanner,
  getProductImage,
  getVendorStorefront,
  getVendorGallery,
  getVendorCertificates,
  getVendorTeam,
  getVendorPromotional,
  getVendorBucketSummary
} from '@/lib/utils/enhanced-image-manager';
```

### 3. Automatic Fallbacks
Each image type has a specific fallback:
- Logo → KFAR leaf icon
- Banner → Default marketplace banner
- Product → Product placeholder
- Others → Type-specific placeholders

## Usage Examples

### Vendor Store Page
```typescript
// Get all vendor assets
const vendorId = 'teva-deli';
const logo = getVendorLogo(vendorId);
const banner = getVendorBanner(vendorId);
const storefront = getVendorStorefront(vendorId);
const gallery = getVendorGallery(vendorId);
const certificates = getVendorCertificates(vendorId);
```

### Product Display
```typescript
// Get product image with vendor isolation
const productImage = getProductImage('teva-deli', 'td-001');
const altText = getImageAltText('Seitan Schnitzel', 'Teva Deli', 'product');
```

### Admin Dashboard
```typescript
// Get vendor bucket summary
const summary = getVendorBucketSummary('queens-cuisine');
console.log(`Products: ${summary.productCount}`);
console.log(`Gallery: ${summary.galleryCount}`);
```

## Migration Process

### Step 1: Organize Images
```bash
node scripts/organize-vendor-images.js
```

This will:
- Create vendor bucket directories
- Copy images to appropriate locations
- Generate vendor-image-index.json

### Step 2: Update Imports
Replace old image manager:
```typescript
// Old
import { getProductImage } from '@/lib/utils/image-manager';

// New
import { getProductImage } from '@/lib/utils/enhanced-image-manager';
```

### Step 3: Update Catalog Files
Remove hardcoded image paths from catalogs:
```typescript
// Before
{
  id: 'td-001',
  image: '/images/vendors/teva_deli_schnitzel.jpg',
  // ...
}

// After
{
  id: 'td-001',
  // image will be resolved by image manager
  // ...
}
```

## Benefits

### 1. **True Vendor Isolation**
- No cross-contamination possible
- Each vendor's assets stay in their bucket
- Clear organizational structure

### 2. **Scalability**
- Easy to add new vendors
- Simple to add new asset types
- Consistent structure across all vendors

### 3. **Brand Integrity**
- Vendor-specific banners and galleries
- Certificates and team photos
- Complete brand representation

### 4. **Performance**
- Future-ready for CDN integration
- Optimized image delivery
- Lazy loading support

### 5. **Maintenance**
- Single source of truth
- Easy to update mappings
- Clear file organization

## Image Naming Conventions

### Products
```
[vendor]_[product_type]_[description]_[variant].jpg
Example: teva_deli_vegan_schnitzel_breaded_cutlet.jpg
```

### Banners
```
[vendor]_banner_[theme].jpg
Example: queens_cuisine_banner_artisanal.jpg
```

### Certificates
```
[vendor]_certificate_[type].jpg
Example: teva_deli_certificate_badatz_kosher.jpg
```

## Debugging

### Check Vendor Assets
```typescript
const summary = getVendorBucketSummary('people-store');
console.log(JSON.stringify(summary, null, 2));
```

### Validate Image Paths
```typescript
const isValid = validateImagePath(imagePath);
```

### Console Warnings
The system logs warnings for:
- Missing vendor logos
- Missing product images
- Unknown vendor IDs

## Future Enhancements

### 1. Image Optimization
```typescript
const optimizedUrl = getOptimizedImageUrl(imagePath, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp'
});
```

### 2. CDN Integration
- Automatic CDN URL generation
- Edge caching support
- Global delivery

### 3. Dynamic Resizing
- On-demand image resizing
- Multiple format support
- Responsive image sets

## Best Practices

1. **Always use the image manager** - Never hardcode paths
2. **Check bucket summary** - Ensure all assets are present
3. **Use appropriate fallbacks** - Handle missing images gracefully
4. **Monitor console warnings** - Fix missing assets promptly
5. **Keep buckets organized** - Follow naming conventions

## Vendor Asset Checklist

For each vendor, ensure:
- [ ] Logo uploaded
- [ ] Banner created
- [ ] All products have images
- [ ] Certificates scanned (if applicable)
- [ ] Gallery populated (optional)
- [ ] Team photos added (optional)
- [ ] Promotional materials ready (optional)

---

**Last Updated**: January 2025
**Status**: Ready for Implementation