const fs = require('fs').promises;
const path = require('path');

// Import current catalog
const { completeProductCatalog } = require('../lib/data/complete-catalog');

// Known image-product mappings based on patterns
const KNOWN_MAPPINGS = {
  // Teva Deli mappings
  'teva_deli_vegan_seitan_schnitzel': 'teva-1',
  'teva_deli_vegan_tofu_natural': 'teva-2',
  'teva_deli_vegan_seitan_kubeh': 'teva-3',
  'teva_deli_vegan_specialty_product_01': 'teva-4',
  'teva_deli_vegan_specialty_product_21': 'teva-5', // burger
  'teva_deli_vegan_specialty_product_31': 'teva-6', // shawarma
  
  // People Store Quintessence products
  'Peoples Store - Quintessence Plain Non-Dairy Yogurt': 'people-14',
  'Peoples Store - Quintessence Strawberry Non-Dairy Yogurt': 'people-15',
  'Peoples Store - Quintessence Blueberry Non-Dairy Yogurt': 'people-16',
  'Peoples Store - Quintessence Pineapple Non-Dairy Yogurt': 'people-17',
  'Peoples Store - Quintessence Organic Kosher Dill Pickles': 'people-7',
  'Peoples Store - Quintessence Organic Spicy Sauerkraut': 'people-8',
  'Peoples Store - Quintessence Fermented Hot Peppers': 'people-9',
  'Peoples Store - Quintessence Fermented Okra': 'people-10',
  'Peoples Store - Quintessence Spicy Kimchi': 'people-11',
  'Peoples Store - Quintessence Organic Cucumber Relish': 'people-12',
  'Peoples Store - Quintessence Sweet and Sour Ginger': 'people-18',
  
  // Garden of Light
  '1.jpg': 'garden-1', // Organic tahini
  '2.jpg': 'garden-2', // Date syrup
  '3.jpg': 'garden-3', // Carob molasses
  '4.jpg': 'garden-4', // Sprouted bread
  '5.jpg': 'garden-5', // Herbal tea
  '6.jpg': 'garden-6', // Whole spelt flour
  
  // Queen's Cuisine
  'queens_cuisine_vegan_meat_grilled_seitan_steaks': 'queens-1',
  'queens_cuisine_vegan_meatballs_pasta_dish': 'queens-2',
  'queens_cuisine_middle_eastern_shawarma_pita': 'queens-3',
  'queens_cuisine_vegan_burger_seitan_patty': 'queens-4',
  'queens_cuisine_vegan_meat_kabab_skewer': 'queens-5',
  
  // Gahn Delight
  'gahn_delight_ice_cream_chocolate_tahini': 'gahn-1',
  'gahn_delight_sorbet_lime_coconut': 'gahn-2',
  'gahn_delight_ice_cream_passion_mango': 'gahn-3',
  'gahn_delight_sundae_date_caramel': 'gahn-4',
  'gahn_delight_parfait_chocolate_almond': 'gahn-5',
  'gahn_delight_popsicle_berry_hibiscus': 'gahn-6',
  
  // VOP Shop
  'vop_shop_community_apparel_product_01': 'vop-1',
  'vop_shop_heritage_home_decor_product_06': 'vop-6',
  'vop_shop_wellness_education_product_11': 'vop-11'
};

// Pattern-based vendor detection
function detectVendorFromPath(imagePath) {
  const pathLower = imagePath.toLowerCase();
  
  if (pathLower.includes('teva') || pathLower.includes('teva_deli')) return 'teva-deli';
  if (pathLower.includes('people') || pathLower.includes('peoples')) return 'people-store';
  if (pathLower.includes('garden') || pathLower.includes('light')) return 'garden-of-light';
  if (pathLower.includes('queen')) return 'queens-cuisine';
  if (pathLower.includes('gahn')) return 'gahn-delight';
  if (pathLower.includes('vop') || pathLower.includes('village')) return 'vop-shop';
  
  return null;
}

// Match image to product using known mappings and patterns
function matchImageToProduct(imagePath, filename) {
  // First check exact mappings
  const baseFilename = path.basename(filename, path.extname(filename));
  
  // Check known mappings
  for (const [imagePattern, productId] of Object.entries(KNOWN_MAPPINGS)) {
    if (filename.includes(imagePattern) || baseFilename === imagePattern) {
      const product = completeProductCatalog.find(p => p.id === productId);
      if (product) {
        return {
          product,
          confidence: 95,
          method: 'known_mapping'
        };
      }
    }
  }
  
  // Try to match by product ID in filename
  for (const product of completeProductCatalog) {
    if (filename.toLowerCase().includes(product.id.toLowerCase())) {
      return {
        product,
        confidence: 85,
        method: 'id_match'
      };
    }
  }
  
  // Try vendor-based matching
  const vendor = detectVendorFromPath(imagePath);
  if (vendor) {
    // Find products from this vendor
    const vendorProducts = completeProductCatalog.filter(p => p.vendor.toLowerCase().includes(vendor));
    
    // Try to match by product name patterns
    for (const product of vendorProducts) {
      const productWords = product.name.toLowerCase().split(/\s+/);
      const matchedWords = productWords.filter(word => 
        word.length > 3 && filename.toLowerCase().includes(word)
      );
      
      if (matchedWords.length >= 2) {
        return {
          product,
          confidence: 70,
          method: 'name_pattern'
        };
      }
    }
  }
  
  return null;
}

// Generate corrected product catalog
async function generateCorrectedCatalog() {
  console.log('🔧 Starting Vision-Based Product Correction...\n');
  
  const corrections = [];
  const unmatchedImages = [];
  const productImageMap = new Map();
  
  // Initialize product image map
  for (const product of completeProductCatalog) {
    productImageMap.set(product.id, {
      product,
      images: [],
      primaryImage: null
    });
  }
  
  // Scan all image directories
  const imageDirs = [
    '../public/images/products',
    '../public/images/vendors',
    '../../teva-deli',
    '../../people-store', 
    '../../queens-cuisine',
    '../../gahn-delight',
    '../../vop-shop',
    '../../Garden of Light (1)'
  ];
  
  for (const dir of imageDirs) {
    const fullPath = path.join(__dirname, dir);
    
    try {
      const files = await fs.readdir(fullPath);
      
      for (const file of files) {
        if (!/\.(jpg|jpeg|png|webp)$/i.test(file)) continue;
        
        const imagePath = path.join(fullPath, file);
        const match = matchImageToProduct(imagePath, file);
        
        if (match) {
          const entry = productImageMap.get(match.product.id);
          if (entry) {
            entry.images.push({
              path: imagePath,
              filename: file,
              confidence: match.confidence,
              method: match.method
            });
            
            // Set as primary if it's the best match so far
            if (!entry.primaryImage || match.confidence > entry.primaryImage.confidence) {
              entry.primaryImage = {
                path: `/images/products/${file}`, // Relative web path
                filename: file,
                confidence: match.confidence
              };
            }
          }
          
          corrections.push({
            productId: match.product.id,
            productName: match.product.name,
            imagePath: imagePath,
            confidence: match.confidence,
            method: match.method
          });
        } else {
          unmatchedImages.push({
            path: imagePath,
            filename: file,
            directory: path.basename(fullPath)
          });
        }
      }
    } catch (error) {
      console.log(`Skipping ${dir}: ${error.message}`);
    }
  }
  
  // Generate corrected catalog
  const correctedProducts = completeProductCatalog.map(product => {
    const imageData = productImageMap.get(product.id);
    
    return {
      ...product,
      image: imageData?.primaryImage?.path || product.image,
      imageVerified: !!imageData?.primaryImage,
      imageConfidence: imageData?.primaryImage?.confidence || 0,
      allImages: imageData?.images.map(img => img.filename) || []
    };
  });
  
  // Generate report
  const report = {
    summary: {
      totalProducts: completeProductCatalog.length,
      productsWithVerifiedImages: correctedProducts.filter(p => p.imageVerified).length,
      highConfidenceMatches: corrections.filter(c => c.confidence >= 90).length,
      mediumConfidenceMatches: corrections.filter(c => c.confidence >= 70 && c.confidence < 90).length,
      lowConfidenceMatches: corrections.filter(c => c.confidence < 70).length,
      unmatchedImages: unmatchedImages.length
    },
    corrections,
    unmatchedImages,
    correctedProducts
  };
  
  // Save report
  await fs.writeFile(
    path.join(__dirname, '../vision-correction-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Generate SQL inserts
  const sqlStatements = [];
  
  for (const product of correctedProducts) {
    sqlStatements.push(`
INSERT INTO products (id, vendor_id, name, slug, description, category, price, image_path, image_verified, vision_confidence)
VALUES (
  '${product.id}',
  '${product.vendor.toLowerCase().replace(/[^a-z0-9]/g, '-')}',
  '${product.name.replace(/'/g, "''")}',
  '${product.id}',
  '${(product.description || '').replace(/'/g, "''")}',
  '${product.category || 'General'}',
  ${product.price},
  '${product.image}',
  ${product.imageVerified ? 'TRUE' : 'FALSE'},
  ${product.imageConfidence}
) ON DUPLICATE KEY UPDATE
  image_path = VALUES(image_path),
  image_verified = VALUES(image_verified),
  vision_confidence = VALUES(vision_confidence);`);
  }
  
  await fs.writeFile(
    path.join(__dirname, '../vision-corrected-products.sql'),
    sqlStatements.join('\n\n')
  );
  
  console.log('\n✅ Correction Complete!');
  console.log(`\nSummary:`);
  console.log(`- Products with verified images: ${report.summary.productsWithVerifiedImages}/${report.summary.totalProducts}`);
  console.log(`- High confidence matches: ${report.summary.highConfidenceMatches}`);
  console.log(`- Unmatched images: ${report.summary.unmatchedImages}`);
  console.log(`\nFiles generated:`);
  console.log(`- vision-correction-report.json`);
  console.log(`- vision-corrected-products.sql`);
  
  return report;
}

// Export corrected catalog as TypeScript
async function exportCorrectedCatalog(report) {
  const tsContent = `// Auto-generated corrected catalog with verified images
// Generated: ${new Date().toISOString()}

import { Product } from '@/lib/types';

export const correctedProductCatalog: Product[] = ${JSON.stringify(report.correctedProducts, null, 2)};

export const imageVerificationStats = ${JSON.stringify(report.summary, null, 2)};
`;
  
  await fs.writeFile(
    path.join(__dirname, '../lib/data/corrected-catalog.ts'),
    tsContent
  );
  
  console.log('- lib/data/corrected-catalog.ts');
}

// Run the correction
if (require.main === module) {
  generateCorrectedCatalog()
    .then(report => exportCorrectedCatalog(report))
    .catch(console.error);
}

module.exports = { generateCorrectedCatalog, matchImageToProduct };