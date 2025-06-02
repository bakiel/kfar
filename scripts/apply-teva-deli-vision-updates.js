const fs = require('fs').promises;
const path = require('path');

// Enhanced label data from vision analysis
const VISION_ENHANCEMENTS = [
  {
    id: 'td-001',
    nameHe: 'שניצל סייטן אמרנט',
    description: 'Seitan Amerant Schnitzel (שניצל סייטן אמרנט) - Made with wheat flour, wheat protein (gluten), amaranth flour, canola oil, salt, spices. Heat in pan with oil 3-4 minutes each side or bake at 180°C for 12-15 minutes.',
    nutritionalInfo: { calories: 220, protein: 18, carbs: 22, fat: 8, fiber: 3, sodium: 420 },
    ingredients: { he: 'קמח חיטה, חלבון חיטה (גלוטן), קמח אמרנט, שמן קנולה, מלח, תבלינים', en: 'Wheat flour, wheat protein (gluten), amaranth flour, canola oil, salt, spices' },
    preparationInstructions: { he: 'לחמם במחבת עם מעט שמן 3-4 דקות מכל צד או בתנור 180°C למשך 12-15 דקות', en: 'Heat in pan with oil 3-4 minutes each side or bake at 180°C for 12-15 minutes' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-006',
    nameHe: 'קובה בורגול עם סייטן אמרנט',
    description: 'Bulgur Kubeh with Seitan Amerant (קובה בורגול עם סייטן אמרנט) - Made with bulgur, wheat protein, onion, parsley, mint, middle eastern spices, olive oil. Ready to eat after heating. Recommended to serve with tahini and lemon',
    ingredients: { he: 'בורגול, חלבון חיטה, בצל, פטרוזיליה, נענע, תבלינים מזרחיים, שמן זית', en: 'Bulgur, wheat protein, onion, parsley, mint, Middle Eastern spices, olive oil' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-008',
    nameHe: 'טופו טבעי אורגני',
    description: 'Natural Organic Tofu (טופו טבעי אורגני) - Made with organic soybeans, water, calcium salts. Keep refrigerated at 4°C. After opening consume within 3 days',
    nutritionalInfo: { calories: 144, protein: 15, carbs: 3, fat: 9, calcium: 350 },
    ingredients: { he: 'פולי סויה אורגניים, מים, מלחי סידן', en: 'Organic soybeans, water, calcium salts' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה',
    tags: ['organic']
  },
  {
    id: 'td-025',
    nameHe: 'שיפודי סייטן ים תיכוני',
    description: 'Mediterranean Seitan Skewers (שיפודי סייטן ים תיכוני) - Made with wheat protein, onion, bell peppers, cherry tomatoes, olive oil, oregano, basil, sea salt. Serve with pita, Greek salad and vegan tzatziki',
    nutritionalInfo: { calories: 190, protein: 16, carbs: 15, fat: 8, fiber: 4, sodium: 380 },
    ingredients: { he: 'חלבון חיטה, בצל, פלפל צבעוני, עגבניות שרי, שמן זית, אורגנו, בזיליקום, מלח ים', en: 'Wheat protein, onion, bell peppers, cherry tomatoes, olive oil, oregano, basil, sea salt' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-026',
    nameHe: 'גלילי סייטן ממולאים',
    description: 'Stuffed Seitan Rolls (גלילי סייטן ממולאים) - Made with wheat protein, brown rice, mushrooms, onion, carrot, parsley, spices. Bake at 180°C for 20 minutes or steam for 15 minutes',
    ingredients: { he: 'חלבון חיטה, אורז מלא, פטריות, בצל, גזר, פטרוזיליה, תבלינים', en: 'Wheat protein, brown rice, mushrooms, onion, carrot, parsley, spices' },
    preparationInstructions: { he: 'לחמם בתנור 180°C למשך 20 דקות או לאדות 15 דקות', en: 'Bake at 180°C for 20 minutes or steam for 15 minutes' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-030',
    nameHe: 'טופו מעושן בעץ אלון',
    description: 'Oak-Smoked Tofu (טופו מעושן בעץ אלון) - Naturally smoked with oak wood. Made with organic soybeans, water, calcium salts, natural smoke. Keep refrigerated. After opening consume within 5 days',
    nutritionalInfo: { calories: 155, protein: 16, carbs: 4, fat: 9, calcium: 400 },
    ingredients: { he: 'פולי סויה אורגניים, מים, מלחי סידן, עישון טבעי', en: 'Organic soybeans, water, calcium salts, natural smoke' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה',
    tags: ['organic']
  },
  {
    id: 'td-034',
    nameHe: 'המבורגר שעועית שחורה חריף',
    description: 'Spicy Black Bean Burger (המבורגר שעועית שחורה חריף) - High fiber - 8g per patty. Made with black beans, quinoa, corn, chili, cumin, cilantro, garlic, onion. ',
    nutritionalInfo: { calories: 185, protein: 12, carbs: 28, fat: 4, fiber: 8, sodium: 380 },
    ingredients: { he: 'שעועית שחורה, קינואה, תירס, צ\'ילי, כמון, כוסברה, שום, בצל', en: 'Black beans, quinoa, corn, chili, cumin, cilantro, garlic, onion' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-035',
    nameHe: 'המבורגר פטריות גורמה',
    description: 'Gourmet Mushroom Burger (המבורגר פטריות גורמה) - Rich umami flavor. Made with portobello mushrooms, shiitake mushrooms, oats, walnuts, caramelized onion, thyme. ',
    nutritionalInfo: { calories: 175, protein: 10, carbs: 20, fat: 7, fiber: 5, sodium: 350 },
    ingredients: { he: 'פטריות פורטובלו, פטריות שיטאקי, שיבולת שועל, אגוזי מלך, בצל מקורמל, תימין', en: 'Portobello mushrooms, shiitake mushrooms, oats, walnuts, caramelized onion, thyme' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  },
  {
    id: 'td-039',
    nameHe: 'המבורגר קינואה וסלק',
    description: 'Quinoa Beet Burger (המבורגר קינואה וסלק) - Natural purple-red color from beets. Made with quinoa, roasted beets, carrot, onion, garlic, coriander, ground flax seeds. ',
    nutritionalInfo: { calories: 170, protein: 8, carbs: 26, fat: 5, fiber: 6, iron: 3.5 },
    ingredients: { he: 'קינואה, סלק צלוי, גזר, בצל, שום, כוסברה, זרעי פשתן טחונים', en: 'Quinoa, roasted beets, carrot, onion, garlic, coriander, ground flax seeds' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה',
    tags: ['gluten-free']
  },
  {
    id: 'td-041',
    nameHe: 'שווארמה דלוקס במארז משפחתי',
    description: 'Deluxe Shawarma Family Pack (שווארמה דלוקס במארז משפחתי) - Made with wheat protein, soy protein, spice blend (cumin, turmeric, paprika, cinnamon, cardamom), olive oil. Serves 6-8. Perfect for entertaining',
    nutritionalInfo: { calories: 210, protein: 22, carbs: 18, fat: 7, fiber: 4, sodium: 450 },
    ingredients: { he: 'חלבון חיטה, חלבון סויה, תערובת תבלינים (כמון, כורכום, פפריקה, קינמון, הל), שמן זית', en: 'Wheat protein, soy protein, spice blend (cumin, turmeric, paprika, cinnamon, cardamom), olive oil' },
    kosherCertification: 'כשר פרווה למהדרין',
    tags: ['high-protein']
  },
  {
    id: 'td-044',
    nameHe: 'קבב קובידה פרסי',
    description: 'Persian Koobideh Kebab (קבב קובידה פרסי) - Made with soy protein, bulgur, onion, sumac, parsley, mint, saffron. Grill or pan-fry 4-5 minutes per side',
    ingredients: { he: 'חלבון סויה, בורגול, בצל, סומק, פטרוזיליה, נענע, זעפרן', en: 'Soy protein, bulgur, onion, sumac, parsley, mint, saffron' },
    preparationInstructions: { he: 'לצלות על גריל או במחבת פסים 4-5 דקות מכל צד', en: 'Grill or pan-fry 4-5 minutes per side' },
    kosherCertification: 'כשר פרווה בהשגחת הרבנות דימונה'
  }
];

async function applyVisionEnhancements() {
  console.log('🔍 Applying vision enhancements to Teva Deli catalog...\n');
  
  // Read the current catalog
  const catalogPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let catalogContent = await fs.readFile(catalogPath, 'utf-8');
  
  // Parse products from the TypeScript file
  const productsMatch = catalogContent.match(/export const tevaDeliCompleteProducts[^=]*=\s*(\[[^;]+\]);/s);
  if (!productsMatch) {
    console.error('Could not find products array');
    return;
  }
  
  // Extract and parse the products array
  const productsStr = productsMatch[1];
  let products;
  try {
    // Use eval to parse the TypeScript array (safe since we control the content)
    products = eval(productsStr);
  } catch (e) {
    console.error('Failed to parse products:', e);
    return;
  }
  
  // Apply enhancements
  let enhancedCount = 0;
  VISION_ENHANCEMENTS.forEach(enhancement => {
    const product = products.find(p => p.id === enhancement.id);
    if (product) {
      // Apply all enhancements
      Object.assign(product, enhancement);
      enhancedCount++;
      console.log(`✅ Enhanced ${product.id}: ${product.name}`);
    }
  });
  
  // Generate the enhanced interface
  const interfaceDefinition = `export interface TevaDeliProduct {
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
}`;

  // Generate new catalog content
  const newCatalogContent = `// Teva Deli Complete Product Catalog - VISION ENHANCED VERSION
// Now includes Hebrew label data and nutritional information from product images

${interfaceDefinition}

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
  
  // Write the updated catalog
  await fs.writeFile(catalogPath, newCatalogContent);
  console.log(`\n✅ Enhanced ${enhancedCount} products with vision data`);
  
  // Create summary report
  await createEnhancementSummary(products, enhancedCount);
}

async function createEnhancementSummary(products, enhancedCount) {
  const summary = `# Teva Deli Vision Enhancement Summary

## Overview
Successfully enhanced ${enhancedCount} out of ${products.length} products with Hebrew label data extracted from product images.

## Enhanced Products

${VISION_ENHANCEMENTS.map(e => `### ${e.id}: ${e.nameHe}
- **English Name**: ${products.find(p => p.id === e.id)?.name}
- **Kosher**: ${e.kosherCertification}
- **Key Features**: ${e.nutritionalInfo ? `${e.nutritionalInfo.protein}g protein, ${e.nutritionalInfo.calories} calories` : 'Detailed nutritional info'}
${e.tags ? `- **Tags**: ${e.tags.join(', ')}` : ''}
`).join('\n')}

## Next Steps
1. Run vision AI on remaining ${products.length - enhancedCount} products
2. Update marketplace UI to display nutritional information
3. Add Hebrew/English toggle for ingredients display
4. Implement dietary filters based on tags

## Files Updated
- \`/lib/data/teva-deli-complete-catalog.ts\` - Enhanced with vision data
- Created visual reports in \`/public/\`
`;

  await fs.writeFile(
    path.join(__dirname, '../TEVA_DELI_VISION_ENHANCEMENT_SUMMARY.md'),
    summary
  );
  
  console.log('✅ Created enhancement summary');
}

async function main() {
  console.log('🚀 Teva Deli Vision Enhancement Application\n');
  
  try {
    await applyVisionEnhancements();
    
    console.log('\n✨ Vision Enhancement Complete!');
    console.log('\n📋 View results:');
    console.log('- Summary: TEVA_DELI_VISION_ENHANCEMENT_SUMMARY.md');
    console.log('- Visual catalog: http://localhost:3001/teva-deli-vision-enhanced.html');
    console.log('- Label analysis: http://localhost:3001/teva-deli-label-analysis.html');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  main();
}

module.exports = { applyVisionEnhancements };