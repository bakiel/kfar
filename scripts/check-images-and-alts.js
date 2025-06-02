const fs = require('fs');
const path = require('path');

console.log('🖼️  KFAR Marketplace Image Path Validation\n');

// Load all vendor catalogs
const vendors = [
  { name: 'Garden of Light', file: './lib/data/garden-of-light-complete-catalog.json' },
  { name: 'Queens Cuisine', file: './lib/data/queens-cuisine-complete-catalog.json' },
  { name: 'Gahn Delight', file: './lib/data/gahn-delight-complete-catalog.json' },
  { name: 'VOP Shop', file: './lib/data/vop-shop-complete-catalog.json' },
  { name: 'People Store', file: './lib/data/people-store-complete-catalog.json' }
];

let totalProducts = 0;
let missingImages = [];
let invalidPaths = [];

vendors.forEach(vendor => {
  const data = JSON.parse(fs.readFileSync(vendor.file, 'utf-8'));
  console.log('\n=== Checking ' + vendor.name + ' ===');
  
  data.products.forEach(product => {
    totalProducts++;
    
    // Check if image exists
    if (!product.image) {
      missingImages.push(vendor.name + ': ' + product.name);
      return;
    }
    
    // Check if path starts with /
    if (!product.image.startsWith('/')) {
      invalidPaths.push(vendor.name + ': ' + product.name + ' - Path: ' + product.image);
    }
    
    // Check if physical file exists
    const imagePath = path.join('./public', product.image);
    if (!fs.existsSync(imagePath)) {
      console.log('  ❌ Missing file: ' + product.image);
    }
  });
  
  console.log('  ✅ Checked ' + data.products.length + ' products');
});

// Check some key component files for alt tag usage
console.log('\n=== Checking Component Alt Tag Usage ===');

const componentsToCheck = [
  './components/products/ProductCard.tsx',
  './components/vendors/VendorCard.tsx',
  './app/vendor/[vendorId]/page.tsx'
];

componentsToCheck.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf-8');
    const imgTags = content.match(/<img[^>]*>/g) || [];
    const NextImages = content.match(/<Image[^>]*>/g) || [];
    
    let hasAltIssues = false;
    
    // Check regular img tags
    imgTags.forEach(tag => {
      if (!tag.includes('alt=')) {
        hasAltIssues = true;
      }
    });
    
    // Check Next.js Image components
    NextImages.forEach(tag => {
      if (!tag.includes('alt=')) {
        hasAltIssues = true;
      }
    });
    
    if (hasAltIssues) {
      console.log('  ⚠️  ' + file + ' - Some images missing alt attributes');
    } else if (imgTags.length > 0 || NextImages.length > 0) {
      console.log('  ✅ ' + file + ' - All images have alt attributes');
    }
  } catch (e) {
    // File doesn't exist, skip
  }
});

console.log('\n=== SUMMARY ===');
console.log('Total products checked: ' + totalProducts);
console.log('Missing images: ' + missingImages.length);
console.log('Invalid paths: ' + invalidPaths.length);

if (missingImages.length > 0) {
  console.log('\n❌ Products with missing images:');
  missingImages.forEach(p => console.log('  - ' + p));
}

if (invalidPaths.length > 0) {
  console.log('\n❌ Products with invalid paths:');
  invalidPaths.forEach(p => console.log('  - ' + p));
}