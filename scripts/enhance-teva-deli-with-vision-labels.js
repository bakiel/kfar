const fs = require('fs').promises;
const path = require('path');
const { TEVA_DELI_LABEL_DATA, generateEnhancedDescription } = require('./teva-deli-label-reader');

// Map image names to catalog IDs
const IMAGE_TO_PRODUCT_MAP = {
  'teva_deli_vegan_seitan_schnitzel': 'td-001',
  'teva_deli_vegan_tofu_natural': 'td-008',
  'teva_deli_vegan_seitan_kubeh': 'td-006',
  'teva_deli_mediterranean_seitan_skewers': 'td-025',
  'teva_deli_stuffed_seitan_rolls': 'td-026',
  'teva_deli_black_bean_burger': 'td-034',
  'teva_deli_mushroom_burger': 'td-035',
  'teva_deli_shawarma_deluxe': 'td-041',
  'teva_deli_kebab_koobideh': 'td-044',
  'teva_deli_smoked_tofu': 'td-030',
  'teva_deli_quinoa_beet_burger': 'td-039'
};

async function enhanceTevaDeliCatalog() {
  console.log('🔍 Enhancing Teva Deli catalog with label data...\n');
  
  const catalogPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let catalogContent = await fs.readFile(catalogPath, 'utf-8');
  
  // Parse existing products
  const productsMatch = catalogContent.match(/export const tevaDeliCompleteProducts[^=]*=\s*(\[[^;]+\]);/s);
  if (!productsMatch) {
    console.error('Could not find products array');
    return;
  }
  
  // Parse TypeScript to JSON - be careful with quotes
  const productsStr = productsMatch[1];
  
  const products = JSON.parse(productsStr);
  
  // Enhance products with label data
  let enhancedCount = 0;
  products.forEach(product => {
    // Find matching label data
    const imageKey = Object.keys(IMAGE_TO_PRODUCT_MAP).find(key => IMAGE_TO_PRODUCT_MAP[key] === product.id);
    if (imageKey && TEVA_DELI_LABEL_DATA[imageKey]) {
      const labelData = TEVA_DELI_LABEL_DATA[imageKey];
      
      // Update product with enhanced data
      product.nameHe = labelData.productNameHe;
      product.description = generateEnhancedDescription(labelData);
      
      // Add nutritional info if available
      if (labelData.nutritionalPer100g) {
        product.nutritionalInfo = labelData.nutritionalPer100g;
      }
      
      // Add preparation instructions
      if (labelData.cookingInstructions) {
        product.preparationInstructions = {
          he: labelData.cookingInstructions,
          en: labelData.cookingInstructionsEn
        };
      }
      
      // Add ingredients
      product.ingredients = {
        he: labelData.ingredients,
        en: labelData.ingredientsEn
      };
      
      // Add kosher certification
      product.kosherCertification = labelData.kosherCertification;
      
      // Add tags based on features
      product.tags = product.tags || [];
      if (labelData.unique && labelData.uniqueEn.includes('High protein')) {
        product.tags.push('high-protein');
      }
      if (labelData.ingredients.includes('אורגני')) {
        product.tags.push('organic');
      }
      if (labelData.allergens === 'ללא גלוטן') {
        product.tags.push('gluten-free');
      }
      
      enhancedCount++;
      console.log(`✅ Enhanced ${product.id}: ${product.name}`);
    }
  });
  
  // Generate new catalog content with enhanced interface
  const newCatalogContent = `// Teva Deli Complete Product Catalog - VISION ENHANCED VERSION
// Now includes Hebrew label data and nutritional information

export interface TevaDeliProduct {
  id: string;
  name: string;
  nameHe: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  vendorId: string;
  inStock: boolean;
  isVegan: boolean;
  isKosher: boolean;
  badge?: string;
  tags?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    calcium?: number;
    iron?: number;
  };
  ingredients?: {
    he: string;
    en: string;
  };
  preparationInstructions?: {
    he: string;
    en: string;
  };
  kosherCertification?: string;
}

export const tevaDeliCompleteProducts: TevaDeliProduct[] = ${JSON.stringify(products, null, 2)};

// Product categories
export const tevaDeliCategories = [
  'schnitzels',
  'burgers',
  'shawarma',
  'kebabs',
  'tofu',
  'seitan',
  'specialty',
  'ready-meals'
];

// Export count for vendor info
export const tevaDeliProductCount = ${products.length};
`;
  
  await fs.writeFile(catalogPath, newCatalogContent);
  console.log(`\n✅ Enhanced ${enhancedCount} products with label data`);
  
  return { products, enhancedCount };
}

// Generate vision-enhanced visual report
async function generateEnhancedVisualReport(products) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Teva Deli - Vision Enhanced Catalog</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 0; 
      padding: 20px; 
      background: #f5f5f5;
      direction: rtl;
    }
    .header {
      background: linear-gradient(135deg, #2E7D32, #66BB6A);
      color: white;
      padding: 40px;
      text-align: center;
      border-radius: 20px;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 10s infinite;
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.3; }
      100% { transform: scale(1); opacity: 0.5; }
    }
    h1 { margin: 0; font-size: 36px; position: relative; z-index: 1; }
    .subtitle { font-size: 20px; margin-top: 10px; position: relative; z-index: 1; }
    .enhanced-badge {
      background: #FFD700;
      color: #333;
      padding: 10px 20px;
      border-radius: 30px;
      font-weight: bold;
      display: inline-block;
      margin-top: 20px;
      position: relative;
      z-index: 1;
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 30px;
      direction: ltr;
    }
    .product-card {
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      transition: all 0.3s;
      position: relative;
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    .enhanced-label {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #4CAF50;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      font-weight: bold;
      z-index: 10;
    }
    .product-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
    }
    .product-content {
      padding: 20px;
      text-align: right;
    }
    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }
    .product-names {
      flex: 1;
    }
    .product-id {
      color: #2E7D32;
      font-weight: bold;
      font-size: 14px;
      background: #e8f5e9;
      padding: 3px 8px;
      border-radius: 10px;
    }
    .product-name-he {
      font-size: 20px;
      font-weight: bold;
      margin: 5px 0;
      color: #2E7D32;
    }
    .product-name-en {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
    .label-info {
      background: #f8f8f8;
      padding: 15px;
      border-radius: 12px;
      margin: 15px 0;
    }
    .label-section {
      margin-bottom: 10px;
    }
    .label-title {
      font-weight: bold;
      color: #2E7D32;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .label-content {
      font-size: 13px;
      line-height: 1.5;
    }
    .hebrew-text {
      direction: rtl;
      color: #333;
    }
    .english-text {
      direction: ltr;
      color: #666;
      font-style: italic;
      font-size: 12px;
    }
    .nutritional-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 10px;
    }
    .nutritional-item {
      text-align: center;
      background: white;
      padding: 8px;
      border-radius: 8px;
    }
    .nutritional-value {
      font-size: 18px;
      font-weight: bold;
      color: #2E7D32;
    }
    .nutritional-label {
      font-size: 11px;
      color: #666;
    }
    .tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .tag {
      background: #e8f5e9;
      color: #2E7D32;
      padding: 4px 10px;
      border-radius: 15px;
      font-size: 12px;
    }
    .price {
      font-size: 24px;
      color: #2E7D32;
      font-weight: bold;
      text-align: center;
      margin-top: 15px;
    }
    .kosher-badge {
      background: #FFD700;
      color: #333;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      margin-top: 8px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>טבע דלי - קטלוג מוצרים משודרג</h1>
    <h1 style="font-size: 24px;">Teva Deli - Vision Enhanced Catalog</h1>
    <div class="subtitle">מידע תזונתי ורכיבים מתוך תוויות המוצרים</div>
    <div class="enhanced-badge">✨ כולל ניתוח תוויות בעברית</div>
  </div>
  
  <div class="product-grid">
    ${products.map(product => {
      const isEnhanced = product.ingredients || product.nutritionalInfo;
      return `
        <div class="product-card">
          ${isEnhanced ? '<div class="enhanced-label">משודרג!</div>' : ''}
          <img src="${product.image}" alt="${product.nameHe}" class="product-image">
          <div class="product-content">
            <div class="product-header">
              <div class="product-names">
                <div class="product-name-he">${product.nameHe}</div>
                <div class="product-name-en">${product.name}</div>
              </div>
              <div class="product-id">${product.id}</div>
            </div>
            
            ${product.ingredients ? `
              <div class="label-info">
                <div class="label-section">
                  <div class="label-title">רכיבים</div>
                  <div class="label-content hebrew-text">${product.ingredients.he}</div>
                  <div class="label-content english-text">${product.ingredients.en}</div>
                </div>
                
                ${product.preparationInstructions ? `
                  <div class="label-section">
                    <div class="label-title">אופן הכנה</div>
                    <div class="label-content hebrew-text">${product.preparationInstructions.he}</div>
                    <div class="label-content english-text">${product.preparationInstructions.en}</div>
                  </div>
                ` : ''}
                
                ${product.nutritionalInfo ? `
                  <div class="label-section">
                    <div class="label-title">ערכים תזונתיים ל-100 גרם</div>
                    <div class="nutritional-grid">
                      <div class="nutritional-item">
                        <div class="nutritional-value">${product.nutritionalInfo.calories}</div>
                        <div class="nutritional-label">קלוריות</div>
                      </div>
                      <div class="nutritional-item">
                        <div class="nutritional-value">${product.nutritionalInfo.protein}g</div>
                        <div class="nutritional-label">חלבון</div>
                      </div>
                      <div class="nutritional-item">
                        <div class="nutritional-value">${product.nutritionalInfo.fat}g</div>
                        <div class="nutritional-label">שומן</div>
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : `
              <div class="label-info">
                <div class="label-content" style="text-align: center; color: #999;">
                  מידע תזונתי מפורט יתווסף בקרוב
                </div>
              </div>
            `}
            
            ${product.tags && product.tags.length > 0 ? `
              <div class="tags">
                ${product.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            ` : ''}
            
            <div class="price">₪${product.price}</div>
            
            ${product.kosherCertification ? `
              <div style="text-align: center;">
                <div class="kosher-badge">${product.kosherCertification}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('')}
  </div>
  
  <div style="margin-top: 40px; padding: 30px; background: white; border-radius: 20px; text-align: center;">
    <h2 style="color: #2E7D32;">📊 סיכום שיפורי הקטלוג</h2>
    <p>• ${products.filter(p => p.ingredients).length} מוצרים עם מידע תזונתי מלא</p>
    <p>• ${products.filter(p => p.nutritionalInfo).length} מוצרים עם טבלת ערכים תזונתיים</p>
    <p>• ${products.filter(p => p.kosherCertification).length} מוצרים עם פרטי כשרות</p>
    <p>• כל המוצרים כוללים שמות בעברית מדויקים</p>
  </div>
</body>
</html>`;
  
  await fs.writeFile(
    path.join(__dirname, '../public/teva-deli-vision-enhanced.html'),
    html
  );
  
  console.log('✅ Created enhanced visual report: /public/teva-deli-vision-enhanced.html');
}

async function main() {
  console.log('🚀 Teva Deli Vision Enhancement System\n');
  console.log('This will enhance product data using Hebrew label analysis\n');
  
  try {
    const { products, enhancedCount } = await enhanceTevaDeliCatalog();
    await generateEnhancedVisualReport(products);
    
    console.log('\n✨ SUCCESS!');
    console.log(`✅ Enhanced ${enhancedCount} products with label data`);
    console.log(`✅ Total products in catalog: ${products.length}`);
    console.log('\n📋 View results:');
    console.log('1. Enhanced catalog: http://localhost:3001/teva-deli-vision-enhanced.html');
    console.log('2. Label analysis: http://localhost:3001/teva-deli-label-analysis.html');
    console.log('\n🎯 Next steps:');
    console.log('1. Run actual vision AI on remaining products');
    console.log('2. Update marketplace display to show nutritional info');
    console.log('3. Add Hebrew/English toggle for ingredients');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { enhanceTevaDeliCatalog };