const fs = require('fs').promises;
const path = require('path');

async function findDuplicateImages() {
  console.log('🔍 Comprehensive Image Duplication & Mismatch Analysis\n');
  
  // Load all catalog files
  const catalogs = {
    'teva-deli': path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts'),
    'people-store': path.join(__dirname, '../lib/data/people-store-complete-catalog.json'),
    'vop-shop': path.join(__dirname, '../lib/data/vop-shop-complete-catalog.json'),
    'garden-of-light': path.join(__dirname, '../lib/data/garden-of-light-complete-catalog.json'),
    'queens-cuisine': path.join(__dirname, '../lib/data/queens-cuisine-complete-catalog.json'),
    'gahn-delight': path.join(__dirname, '../lib/data/gahn-delight-complete-catalog.json')
  };
  
  const allProducts = [];
  const imageUsage = {}; // Track which products use which images
  
  // Load Teva Deli (TypeScript file)
  const tevaContent = await fs.readFile(catalogs['teva-deli'], 'utf-8');
  const tevaRegex = /id: '([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?nameHe: '([^']+)',[\s\S]*?category: '([^']+)',[\s\S]*?image: '([^']+)'/g;
  let match;
  while ((match = tevaRegex.exec(tevaContent)) !== null) {
    const product = {
      vendor: 'teva-deli',
      id: match[1],
      name: match[2],
      nameHe: match[3],
      category: match[4],
      image: match[5]
    };
    allProducts.push(product);
    
    // Track image usage
    if (!imageUsage[product.image]) {
      imageUsage[product.image] = [];
    }
    imageUsage[product.image].push(product);
  }
  
  // Load JSON catalogs
  for (const [vendor, filePath] of Object.entries(catalogs)) {
    if (vendor === 'teva-deli') continue; // Already loaded
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      const products = data.products || [];
      
      products.forEach(p => {
        const product = {
          vendor,
          id: p.id,
          name: p.name,
          nameHe: p.nameHe || '',
          category: p.category,
          image: p.image
        };
        allProducts.push(product);
        
        // Track image usage
        if (!imageUsage[product.image]) {
          imageUsage[product.image] = [];
        }
        imageUsage[product.image].push(product);
      });
    } catch (err) {
      console.error(`Error loading ${vendor}:`, err.message);
    }
  }
  
  console.log(`Total products analyzed: ${allProducts.length}\n`);
  
  // Find duplicate images
  console.log('🔴 DUPLICATE IMAGES (same image used by multiple products):\n');
  let duplicateCount = 0;
  
  Object.entries(imageUsage).forEach(([image, products]) => {
    if (products.length > 1) {
      duplicateCount++;
      console.log(`Image: ${image.split('/').pop()}`);
      products.forEach(p => {
        console.log(`  - ${p.vendor}/${p.id}: ${p.name} (${p.nameHe}) [${p.category}]`);
      });
      console.log('');
    }
  });
  
  if (duplicateCount === 0) {
    console.log('✅ No duplicate images found!\n');
  } else {
    console.log(`Found ${duplicateCount} images used by multiple products\n`);
  }
  
  // Check for potential mismatches
  console.log('🟡 POTENTIAL MISMATCHES (name vs image filename):\n');
  let mismatchCount = 0;
  
  allProducts.forEach(product => {
    const imageName = product.image.toLowerCase();
    const productName = product.name.toLowerCase();
    
    // Check for obvious mismatches
    const checks = [
      // Product type mismatches
      { product: 'schnitzel', image: ['burger', 'kebab', 'shawarma', 'tofu', 'okara'] },
      { product: 'burger', image: ['schnitzel', 'kebab', 'shawarma', 'tofu'] },
      { product: 'tofu', image: ['schnitzel', 'burger', 'kebab', 'shawarma', 'seitan'] },
      { product: 'seitan', image: ['tofu', 'burger', 'schnitzel'] },
      { product: 'kebab', image: ['burger', 'schnitzel', 'tofu'] },
      { product: 'shawarma', image: ['burger', 'schnitzel', 'tofu', 'kebab'] },
      
      // Specific product mismatches
      { product: 'okara', image: ['schnitzel', 'burger', 'seitan'] },
      { product: 'salami', image: ['schnitzel', 'burger'] },
      { product: 'pastrami', image: ['burger', 'schnitzel'] }
    ];
    
    let mismatch = false;
    checks.forEach(check => {
      if (productName.includes(check.product)) {
        check.image.forEach(wrongType => {
          if (imageName.includes(wrongType) && !productName.includes(wrongType)) {
            mismatch = true;
          }
        });
      }
    });
    
    // Also check if image number makes sense for category
    const imageNum = imageName.match(/_(\d+)_/)?.[1];
    if (imageNum) {
      // Known patterns from our analysis:
      // 21-23: OKARA/ground products (green boxes)
      // 24-30: Burgers (black/brown boxes)
      // 31+: Shawarma/kebab products
      
      if (product.category === 'schnitzels' && parseInt(imageNum) >= 21 && parseInt(imageNum) <= 23) {
        console.log(`⚠️  Schnitzel using OKARA image: ${product.vendor}/${product.id} - ${product.name} (Image ${imageNum})`);
        mismatchCount++;
      } else if (product.category === 'burgers' && (parseInt(imageNum) < 21 || parseInt(imageNum) > 30)) {
        console.log(`⚠️  Burger using wrong range image: ${product.vendor}/${product.id} - ${product.name} (Image ${imageNum})`);
        mismatchCount++;
      } else if (mismatch) {
        console.log(`⚠️  Name/Image mismatch: ${product.vendor}/${product.id} - ${product.name} using ${imageName.split('/').pop()}`);
        mismatchCount++;
      }
    }
  });
  
  if (mismatchCount === 0) {
    console.log('✅ No obvious mismatches found!\n');
  }
  
  // Check for missing vendor prefixes
  console.log('🟠 CROSS-VENDOR IMAGE USAGE (potential wrong vendor images):\n');
  let crossVendorCount = 0;
  
  allProducts.forEach(product => {
    const expectedVendorPrefix = product.vendor.replace('-', '_');
    if (!product.image.includes(expectedVendorPrefix) && !product.image.includes('placeholder')) {
      console.log(`Wrong vendor? ${product.vendor}/${product.id}: ${product.name} uses ${product.image}`);
      crossVendorCount++;
    }
  });
  
  if (crossVendorCount === 0) {
    console.log('✅ All products use their own vendor images!\n');
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`- Total products: ${allProducts.length}`);
  console.log(`- Duplicate images: ${duplicateCount}`);
  console.log(`- Potential mismatches: ${mismatchCount}`);
  console.log(`- Cross-vendor issues: ${crossVendorCount}`);
}

findDuplicateImages().catch(console.error);