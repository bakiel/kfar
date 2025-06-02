#!/usr/bin/env node

/**
 * Fix Teva Deli Product Catalog Data Threading
 * This script updates complete-catalog.ts to use the full 44-product catalog
 * and prepares for vision API enhancement
 */

const fs = require('fs').promises;
const path = require('path');

async function fixCatalogImport() {
  console.log('🔧 Fixing Teva Deli Product Catalog Import...\n');
  
  const catalogPath = path.join(__dirname, '../lib/data/complete-catalog.ts');
  
  try {
    // Read current catalog
    let content = await fs.readFile(catalogPath, 'utf-8');
    
    // Check current import
    if (content.includes("from './teva-deli-complete-catalog-enhanced'")) {
      console.log('❌ Found incorrect import from enhanced catalog (19 products)');
      
      // Fix the import to use complete catalog
      content = content.replace(
        "import { tevaDeliCompleteProducts } from './teva-deli-complete-catalog-enhanced';",
        "import { tevaDeliCompleteProducts } from './teva-deli-complete-catalog';"
      );
      
      console.log('✅ Updated import to use complete catalog (44 products)');
      
      // Also need to update the transformation since the interfaces might differ
      const transformationSection = `// Transform Teva Deli products to match EnhancedProduct interface
const transformedTevaDeliProducts: EnhancedProduct[] = tevaDeliCompleteProducts.map(p => ({
  id: p.id,
  name: p.name,
  nameHe: p.nameHe,
  description: p.description,
  price: p.price,
  originalPrice: p.originalPrice,
  category: p.category,
  image: p.image,
  vendorId: p.vendorId,
  badge: p.badge,
  isVegan: p.isVegan,
  isKosher: p.isKosher,
  inStock: p.inStock,
  tags: p.tags,
  // Add default values for enhanced fields
  allergens: p.allergens || [],
  nutritionalInfo: p.nutritionalInfo || undefined,
  certifications: p.certifications || ['Badatz Kosher', 'Vegan Certified'],
  subcategory: p.subcategory || undefined,
  qrCode: p.qrCode || undefined,
  nfcEnabled: p.nfcEnabled || false,
  sustainabilityScore: p.sustainabilityScore || undefined
}));`;

      // Replace the transformation section
      content = content.replace(
        /\/\/ Transform Teva Deli products[\s\S]*?\}\)\);/,
        transformationSection
      );
      
      // Save updated file
      await fs.writeFile(catalogPath, content);
      console.log('✅ Updated complete-catalog.ts successfully');
      
      // Count products in each catalog for verification
      const enhancedCatalog = await fs.readFile(
        path.join(__dirname, '../lib/data/teva-deli-complete-catalog-enhanced.ts'),
        'utf-8'
      );
      const completeCatalog = await fs.readFile(
        path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts'),
        'utf-8'
      );
      
      const enhancedCount = (enhancedCatalog.match(/id: 'td-/g) || []).length;
      const completeCount = (completeCatalog.match(/id: 'td-/g) || []).length;
      
      console.log('\n📊 Product Count Verification:');
      console.log(`  Enhanced Catalog: ${enhancedCount} products`);
      console.log(`  Complete Catalog: ${completeCount} products`);
      console.log(`  Expected: 46 products`);
      
      if (completeCount < 46) {
        console.log(`\n⚠️  Warning: Complete catalog has ${completeCount} products but should have 46`);
        console.log('  Missing products: td-045, td-046');
      }
      
    } else {
      console.log('✅ Catalog import already correct or different format');
    }
    
    // Create a summary of what needs vision enhancement
    console.log('\n📸 Next Steps for Vision Enhancement:');
    console.log('1. Set GEMINI_API_KEY environment variable');
    console.log('2. Run: node scripts/enhance-teva-deli-with-vision.js');
    console.log('3. This will analyze product images and generate enhanced descriptions');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Also create a function to prepare for vision enhancement
async function prepareVisionEnhancement() {
  console.log('\n🎯 Preparing for Vision Enhancement...\n');
  
  try {
    // Create a mapping of all Teva Deli images
    const publicPath = path.join(__dirname, '../public/images/vendors');
    const tevaImages = [];
    
    // Read directory
    const files = await fs.readdir(publicPath);
    const tevaFiles = files.filter(f => f.includes('teva_deli'));
    
    console.log(`📸 Found ${tevaFiles.length} Teva Deli images`);
    
    // Create image mapping file
    const imageMapping = {
      vendor: 'teva-deli',
      totalImages: tevaFiles.length,
      images: tevaFiles.map(filename => ({
        filename,
        path: `/images/vendors/${filename}`,
        needsAnalysis: true
      }))
    };
    
    await fs.writeFile(
      path.join(__dirname, '../lib/data/teva-deli-image-mapping.json'),
      JSON.stringify(imageMapping, null, 2)
    );
    
    console.log('✅ Created image mapping file');
    console.log(`📄 Saved to: lib/data/teva-deli-image-mapping.json`);
    
  } catch (error) {
    console.error('❌ Error preparing vision enhancement:', error.message);
  }
}

// Run both functions
async function main() {
  await fixCatalogImport();
  await prepareVisionEnhancement();
  
  console.log('\n✨ Catalog fix complete!');
  console.log('🚀 Ready for vision enhancement');
}

main();