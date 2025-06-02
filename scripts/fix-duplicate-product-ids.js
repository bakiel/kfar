const fs = require('fs');
const path = require('path');

// Function to fix duplicate IDs in a catalog
function fixDuplicateIds(catalogPath, vendorPrefix) {
  try {
    const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    const seenIds = new Set();
    const duplicates = [];
    let idCounter = 1;
    
    // First pass: identify duplicates
    catalog.products.forEach((product, index) => {
      if (seenIds.has(product.id)) {
        duplicates.push({ index, oldId: product.id });
      } else {
        seenIds.add(product.id);
        // Extract the numeric part for counter
        const match = product.id.match(/\d+$/);
        if (match) {
          const num = parseInt(match[0]);
          if (num >= idCounter) {
            idCounter = num + 1;
          }
        }
      }
    });
    
    // Second pass: fix duplicates
    duplicates.forEach(dup => {
      const newId = `${vendorPrefix}-${String(idCounter).padStart(3, '0')}`;
      console.log(`  Fixing duplicate ID: ${dup.oldId} -> ${newId}`);
      catalog.products[dup.index].id = newId;
      idCounter++;
    });
    
    // Save if changes were made
    if (duplicates.length > 0) {
      fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
      console.log(`  ✅ Fixed ${duplicates.length} duplicate IDs`);
    } else {
      console.log(`  ✅ No duplicate IDs found`);
    }
    
    return duplicates.length;
  } catch (error) {
    console.error(`  ❌ Error processing ${catalogPath}:`, error.message);
    return 0;
  }
}

// Function to check all vendor catalogs
function checkAllCatalogs() {
  const catalogDir = path.join(__dirname, '../lib/data');
  const vendors = [
    { file: 'queens-cuisine-complete-catalog.json', prefix: 'qc' },
    { file: 'teva-deli-complete-catalog.json', prefix: 'td' },
    { file: 'people-store-complete-catalog.json', prefix: 'ps' },
    { file: 'gahn-delight-complete-catalog.json', prefix: 'gd' },
    { file: 'vop-shop-complete-catalog.json', prefix: 'vs' },
    { file: 'garden-of-light-complete-catalog.json', prefix: 'gl' },
    { file: 'quintessence-complete-catalog.json', prefix: 'qt' }
  ];
  
  let totalFixed = 0;
  
  console.log('🔍 Checking for duplicate product IDs...\n');
  
  vendors.forEach(vendor => {
    const catalogPath = path.join(catalogDir, vendor.file);
    if (fs.existsSync(catalogPath)) {
      console.log(`Checking ${vendor.file}...`);
      const fixed = fixDuplicateIds(catalogPath, vendor.prefix);
      totalFixed += fixed;
    } else {
      console.log(`⚠️  ${vendor.file} not found`);
    }
    console.log('');
  });
  
  console.log(`\n📊 Summary: Fixed ${totalFixed} duplicate IDs total`);
}

// Also create a function to verify all products have unique IDs across the entire system
function verifyGlobalUniqueness() {
  const catalogDir = path.join(__dirname, '../lib/data');
  const allIds = new Map(); // Map of ID to vendor
  const globalDuplicates = [];
  
  const catalogs = [
    'queens-cuisine-complete-catalog.json',
    'teva-deli-complete-catalog.json',
    'people-store-complete-catalog.json',
    'gahn-delight-complete-catalog.json',
    'vop-shop-complete-catalog.json',
    'garden-of-light-complete-catalog.json',
    'quintessence-complete-catalog.json'
  ];
  
  console.log('\n🌍 Verifying global ID uniqueness...\n');
  
  catalogs.forEach(catalogFile => {
    const catalogPath = path.join(catalogDir, catalogFile);
    if (fs.existsSync(catalogPath)) {
      try {
        const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
        const vendorName = catalogFile.replace('-complete-catalog.json', '');
        
        catalog.products.forEach(product => {
          if (allIds.has(product.id)) {
            globalDuplicates.push({
              id: product.id,
              vendor1: allIds.get(product.id),
              vendor2: vendorName,
              productName: product.name
            });
          } else {
            allIds.set(product.id, vendorName);
          }
        });
      } catch (error) {
        console.error(`Error reading ${catalogFile}:`, error.message);
      }
    }
  });
  
  if (globalDuplicates.length > 0) {
    console.log('❌ Found cross-vendor duplicate IDs:');
    globalDuplicates.forEach(dup => {
      console.log(`  ID "${dup.id}" used by both ${dup.vendor1} and ${dup.vendor2} (${dup.productName})`);
    });
  } else {
    console.log('✅ All product IDs are globally unique');
  }
  
  console.log(`\nTotal unique products: ${allIds.size}`);
}

// Main execution
console.log('🔧 Fixing Duplicate Product IDs\n');
console.log('=' . repeat(50));

// First fix duplicates within each catalog
checkAllCatalogs();

console.log('\n' + '=' . repeat(50));

// Then verify global uniqueness
verifyGlobalUniqueness();

console.log('\n✅ Duplicate ID check complete!');