const fs = require('fs').promises;
const path = require('path');

async function ultraFinalCheck() {
  console.log('🔍 ULTRA FINAL CHECK - Verifying every single product...\n');
  
  const issues = [];
  let totalProducts = 0;
  
  // Check each vendor's catalog
  const vendors = [
    { id: 'teva-deli', name: 'Teva Deli', file: '../lib/data/teva-deli-complete-catalog.ts', type: 'ts' },
    { id: 'people-store', name: 'People\'s Store', file: '../lib/data/people-store-complete-catalog.json', type: 'json' },
    { id: 'garden-of-light', name: 'Garden of Light', file: '../lib/data/garden-of-light-complete-catalog.json', type: 'json' },
    { id: 'queens-cuisine', name: 'Queens Cuisine', file: '../lib/data/queens-cuisine-complete-catalog.json', type: 'json' },
    { id: 'gahn-delight', name: 'Gahn Delight', file: '../lib/data/gahn-delight-complete-catalog.json', type: 'json' },
    { id: 'vop-shop', name: 'VOP Shop', file: '../lib/data/vop-shop-complete-catalog.json', type: 'json' }
  ];
  
  for (const vendor of vendors) {
    console.log(`\n=== ${vendor.name.toUpperCase()} ===`);
    
    try {
      let products;
      
      if (vendor.type === 'json') {
        const data = JSON.parse(await fs.readFile(path.join(__dirname, vendor.file), 'utf-8'));
        products = data.products;
      } else {
        // For TypeScript file, parse it differently
        const content = await fs.readFile(path.join(__dirname, vendor.file), 'utf-8');
        // Extract products array
        const match = content.match(/export const tevaDeliCompleteProducts[^=]*=\s*\[([\s\S]*)\];/);
        if (match) {
          // Parse the array content
          const productsStr = '[' + match[1] + ']';
          try {
            products = eval(productsStr);
          } catch (e) {
            console.log('Could not parse TypeScript file, checking line by line...');
            products = [];
            
            // Extract products manually
            const lines = content.split('\n');
            let currentProduct = null;
            let inProduct = false;
            
            for (const line of lines) {
              if (line.includes('"id":')) {
                if (currentProduct) products.push(currentProduct);
                currentProduct = {};
                inProduct = true;
              }
              
              if (inProduct && currentProduct) {
                // Extract fields
                const idMatch = line.match(/"id":\s*"([^"]+)"/);
                if (idMatch) currentProduct.id = idMatch[1];
                
                const nameMatch = line.match(/"name":\s*"([^"]+)"/);
                if (nameMatch) currentProduct.name = nameMatch[1];
                
                const imageMatch = line.match(/"image":\s*"([^"]+)"/);
                if (imageMatch) currentProduct.image = imageMatch[1];
                
                const categoryMatch = line.match(/"category":\s*"([^"]+)"/);
                if (categoryMatch) currentProduct.category = categoryMatch[1];
                
                const priceMatch = line.match(/"price":\s*(\d+)/);
                if (priceMatch) currentProduct.price = parseInt(priceMatch[1]);
              }
              
              if (line.includes('},') && currentProduct) {
                if (currentProduct.id) products.push(currentProduct);
                currentProduct = null;
                inProduct = false;
              }
            }
            if (currentProduct && currentProduct.id) products.push(currentProduct);
          }
        }
      }
      
      if (!products || products.length === 0) {
        issues.push(`${vendor.name}: No products found!`);
        continue;
      }
      
      console.log(`Found ${products.length} products`);
      totalProducts += products.length;
      
      // Check for common issues
      const idSet = new Set();
      const vendorIssues = [];
      
      products.forEach((product, index) => {
        // Check for duplicate IDs
        if (idSet.has(product.id)) {
          vendorIssues.push(`Duplicate ID: ${product.id}`);
        }
        idSet.add(product.id);
        
        // Check for missing required fields
        if (!product.name) vendorIssues.push(`${product.id}: Missing name`);
        if (!product.image) vendorIssues.push(`${product.id}: Missing image`);
        if (!product.price || product.price <= 0) vendorIssues.push(`${product.id}: Invalid price`);
        if (!product.vendorId) vendorIssues.push(`${product.id}: Missing vendorId`);
        
        // Check for image mismatches
        if (product.image) {
          const imageName = product.image.split('/').pop().toLowerCase();
          const productName = product.name.toLowerCase();
          
          // Specific checks for Teva Deli
          if (vendor.id === 'teva-deli') {
            if (imageName.includes('burger') && !productName.includes('burger') && 
                !productName.includes('okara') && !productName.includes('ground') && 
                !productName.includes('kubeh')) {
              vendorIssues.push(`${product.id}: "${product.name}" uses burger image but isn't burger/okara/ground`);
            }
            
            if (imageName.includes('schnitzel') && !productName.includes('schnitzel') && 
                !productName.includes('okara') && !productName.includes('strips')) {
              vendorIssues.push(`${product.id}: "${product.name}" uses schnitzel image but isn't schnitzel`);
            }
          }
        }
      });
      
      if (vendorIssues.length > 0) {
        console.log('⚠️  Issues found:');
        vendorIssues.forEach(issue => {
          console.log(`   - ${issue}`);
          issues.push(`${vendor.name}: ${issue}`);
        });
      } else {
        console.log('✅ No issues found');
      }
      
      // Show sample products
      console.log('\nSample products:');
      const samples = products.slice(0, 3);
      samples.forEach(p => {
        console.log(`  ${p.id}: ${p.name}`);
        if (p.image) {
          console.log(`    → ${p.image.split('/').pop()}`);
        }
      });
      
    } catch (error) {
      console.log(`❌ Error reading ${vendor.name}: ${error.message}`);
      issues.push(`${vendor.name}: Error reading file`);
    }
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Products: ${totalProducts}`);
  console.log(`Total Issues: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n❌ ALL ISSUES:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('\n✅ PERFECT! No issues found in any vendor catalog.');
  }
  
  // Create a detailed report
  const report = {
    timestamp: new Date().toISOString(),
    totalProducts,
    totalIssues: issues.length,
    vendorSummary: {},
    issues
  };
  
  await fs.writeFile(
    path.join(__dirname, '../ULTRA_FINAL_CHECK_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\nReport saved to ULTRA_FINAL_CHECK_REPORT.json');
}

// Run the ultra final check
if (require.main === module) {
  ultraFinalCheck()
    .catch(error => {
      console.error('❌ Critical error:', error);
    });
}