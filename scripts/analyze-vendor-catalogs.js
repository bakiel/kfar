#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define catalog files to check
const catalogFiles = [
  { name: 'Teva Deli', file: 'teva-deli-complete-catalog.ts', isTypeScript: true },
  { name: 'Garden of Light', file: 'garden-of-light-complete-catalog.json', isTypeScript: false },
  { name: 'Queens Cuisine', file: 'queens-cuisine-complete-catalog.json', isTypeScript: false },
  { name: 'Gahn Delight', file: 'gahn-delight-complete-catalog.json', isTypeScript: false },
  { name: 'VOP Shop', file: 'vop-shop-complete-catalog.json', isTypeScript: false },
  { name: 'People Store', file: 'people-store-complete-catalog.json', isTypeScript: false }
];

const dataDir = path.join(__dirname, '../lib/data');
let totalProductCount = 0;
const vendorReports = [];
const allProductIds = new Set();
const duplicateIds = [];

// Required fields for each product
const requiredFields = ['id', 'name', 'price', 'vendorId', 'image', 'description'];

// Function to parse TypeScript file
function parseTypeScriptCatalog(content) {
  // Extract the array content between [ and ];
  const match = content.match(/tevaDeliCompleteProducts:\s*TevaDeliProduct\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not parse TypeScript catalog');
  }
  
  // Parse the array content as JSON5
  const arrayContent = match[1];
  // Convert TypeScript object notation to JSON
  const jsonContent = arrayContent
    .replace(/(\w+):/g, '"$1":') // Add quotes to keys
    .replace(/,\s*}/g, '}') // Remove trailing commas
    .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays
  
  try {
    return JSON.parse('[' + jsonContent + ']');
  } catch (e) {
    // Fallback: count products manually
    const idMatches = content.match(/"id":\s*"[^"]+"/g);
    return idMatches ? idMatches.map((match, index) => {
      const id = match.match(/"id":\s*"([^"]+)"/)[1];
      return { id, _parseError: true };
    }) : [];
  }
}

// Analyze each catalog
catalogFiles.forEach(catalog => {
  const filePath = path.join(dataDir, catalog.file);
  console.log(`\nAnalyzing ${catalog.name} (${catalog.file})...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let products;
    
    if (catalog.isTypeScript) {
      products = parseTypeScriptCatalog(content);
    } else {
      const json = JSON.parse(content);
      products = json.products || [];
    }
    
    const report = {
      vendor: catalog.name,
      file: catalog.file,
      productCount: products.length,
      issues: [],
      productDetails: []
    };
    
    // Check each product
    products.forEach((product, index) => {
      if (product._parseError) {
        report.productDetails.push({
          id: product.id,
          status: 'Parse Error - Could not fully parse product'
        });
        return;
      }
      
      const productIssues = [];
      
      // Check for duplicate IDs
      if (allProductIds.has(product.id)) {
        duplicateIds.push({ id: product.id, vendor: catalog.name });
        productIssues.push('Duplicate ID across vendors');
      }
      allProductIds.add(product.id);
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!product[field]) {
          productIssues.push(`Missing ${field}`);
        }
      });
      
      // Check price validity
      if (product.price !== undefined) {
        if (typeof product.price !== 'number') {
          productIssues.push(`Price is not a number (${typeof product.price})`);
        } else if (product.price <= 0) {
          productIssues.push(`Invalid price: ${product.price}`);
        }
      }
      
      // Check vendorId matches
      if (product.vendorId) {
        const expectedVendorId = catalog.file.replace('-complete-catalog.json', '').replace('-complete-catalog.ts', '');
        if (product.vendorId !== expectedVendorId) {
          productIssues.push(`VendorId mismatch: ${product.vendorId} (expected: ${expectedVendorId})`);
        }
      }
      
      // Check image path
      if (product.image) {
        if (!product.image.startsWith('/')) {
          productIssues.push(`Image path doesn't start with /: ${product.image}`);
        }
        if (!product.image.includes('/images/vendors/')) {
          productIssues.push(`Non-standard image path: ${product.image}`);
        }
      }
      
      report.productDetails.push({
        id: product.id,
        name: product.name,
        price: product.price,
        issues: productIssues
      });
      
      if (productIssues.length > 0) {
        report.issues.push({
          productId: product.id,
          productName: product.name,
          issues: productIssues
        });
      }
    });
    
    vendorReports.push(report);
    totalProductCount += products.length;
    
    console.log(`✓ Found ${products.length} products`);
    if (report.issues.length > 0) {
      console.log(`⚠ Found ${report.issues.length} products with issues`);
    }
    
  } catch (error) {
    console.error(`✗ Error reading ${catalog.file}:`, error.message);
    vendorReports.push({
      vendor: catalog.name,
      file: catalog.file,
      error: error.message
    });
  }
});

// Generate summary report
console.log('\n' + '='.repeat(80));
console.log('VENDOR CATALOG ANALYSIS REPORT');
console.log('='.repeat(80));

console.log('\n📊 PRODUCT COUNT SUMMARY:');
console.log('-'.repeat(40));
vendorReports.forEach(report => {
  if (report.error) {
    console.log(`${report.vendor.padEnd(20)} ERROR: ${report.error}`);
  } else {
    console.log(`${report.vendor.padEnd(20)} ${report.productCount} products`);
  }
});
console.log('-'.repeat(40));
console.log(`TOTAL PRODUCTS:      ${totalProductCount}`);
console.log(`Expected:            94`);
console.log(`Difference:          ${totalProductCount - 94}`);

// Report duplicate IDs
if (duplicateIds.length > 0) {
  console.log('\n⚠️  DUPLICATE PRODUCT IDS:');
  console.log('-'.repeat(40));
  duplicateIds.forEach(dup => {
    console.log(`ID: ${dup.id} (found in ${dup.vendor})`);
  });
}

// Report issues by vendor
console.log('\n🔍 DETAILED ISSUES BY VENDOR:');
vendorReports.forEach(report => {
  if (report.error) return;
  if (report.issues.length === 0) return;
  
  console.log(`\n${report.vendor}:`);
  console.log('-'.repeat(40));
  report.issues.forEach(issue => {
    console.log(`Product: ${issue.productId} - ${issue.productName}`);
    issue.issues.forEach(i => console.log(`  - ${i}`));
  });
});

// Summary statistics
console.log('\n📈 DATA INTEGRITY SUMMARY:');
console.log('-'.repeat(40));
let totalIssues = 0;
vendorReports.forEach(report => {
  if (!report.error && report.issues) {
    totalIssues += report.issues.length;
  }
});
console.log(`Total products with issues: ${totalIssues}`);
console.log(`Duplicate IDs found: ${duplicateIds.length}`);
console.log(`Data integrity: ${((totalProductCount - totalIssues) / totalProductCount * 100).toFixed(1)}%`);

// Write detailed report to file
const reportPath = path.join(__dirname, '../vendor-catalog-analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalProducts: totalProductCount,
    expectedProducts: 94,
    difference: totalProductCount - 94,
    totalIssues: totalIssues,
    duplicateIds: duplicateIds.length,
    dataIntegrity: ((totalProductCount - totalIssues) / totalProductCount * 100).toFixed(1) + '%'
  },
  vendorReports,
  duplicateIds
}, null, 2));

console.log(`\n✅ Detailed report saved to: vendor-catalog-analysis-report.json`);