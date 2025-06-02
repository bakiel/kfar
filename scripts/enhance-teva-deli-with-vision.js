#!/usr/bin/env node

/**
 * Enhance Teva Deli Product Catalog with Gemini Vision API
 * This script analyzes product images to generate accurate descriptions
 */

const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API (you'll need to set GEMINI_API_KEY in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Import the complete catalog
const catalogPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');

// Product image directory
const imageBasePath = path.join(__dirname, '../public/images/vendors');

/**
 * Vision prompt for analyzing Teva Deli products
 */
const VISION_PROMPT = `
You are analyzing a product image from Teva Deli, an Israeli vegan food manufacturer specializing in plant-based meat alternatives.

Please analyze this image and provide:
1. Detailed product description (what you see)
2. Key ingredients visible on packaging
3. Nutritional highlights if visible
4. Cooking suggestions based on the product type
5. Cultural significance (Israeli/Middle Eastern context)
6. Target meal occasions

Format your response as JSON with these fields:
{
  "enhancedDescription": "detailed description",
  "visibleIngredients": ["ingredient1", "ingredient2"],
  "nutritionalHighlights": "protein content, calories, etc",
  "cookingSuggestions": "how to prepare",
  "culturalContext": "Israeli/Middle Eastern relevance",
  "mealOccasions": ["occasion1", "occasion2"],
  "packagingDetails": "what's visible on package"
}
`;

/**
 * Analyze a single product image with Gemini Vision
 */
async function analyzeProductImage(imagePath, productName) {
  try {
    // Check if image exists
    const fullImagePath = path.join(__dirname, '../public', imagePath);
    try {
      await fs.access(fullImagePath);
    } catch {
      console.log(`⚠️  Image not found: ${imagePath}`);
      return null;
    }

    console.log(`🔍 Analyzing: ${productName}`);
    
    // Read image file
    const imageData = await fs.readFile(fullImagePath);
    const base64Image = imageData.toString('base64');

    // Use Gemini Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const result = await model.generateContent([
      VISION_PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    try {
      return JSON.parse(text);
    } catch (e) {
      console.log(`⚠️  Failed to parse JSON for ${productName}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error analyzing ${productName}:`, error.message);
    return null;
  }
}

/**
 * Load and parse the TypeScript catalog file
 */
async function loadCatalog() {
  const content = await fs.readFile(catalogPath, 'utf-8');
  
  // Extract the products array (simple regex-based extraction)
  const productsMatch = content.match(/export const tevaDeliCompleteProducts.*?= \[([\s\S]*?)\];/);
  if (!productsMatch) {
    throw new Error('Could not find products array in catalog');
  }
  
  // This is a simplified approach - in production, use a proper TS parser
  // For now, we'll manually process the most important products
  return [
    {
      id: 'td-001',
      name: 'Classic Seitan Schnitzel',
      image: '/images/vendors/teva_deli_vegan_seitan_schnitzel_breaded_cutlet_plant_based_meat_alternative_israeli_comfort_food.jpg'
    },
    {
      id: 'td-002',
      name: 'Spicy Seitan Kubeh',
      image: '/images/vendors/teva_deli_vegan_seitan_kubeh_middle_eastern_specialty_plant_based_meat_alternative_israeli_cuisine.jpg'
    },
    {
      id: 'td-003',
      name: 'Natural Organic Tofu Block',
      image: '/images/vendors/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'
    },
    // Add more key products here
  ];
}

/**
 * Generate enhanced catalog with vision data
 */
async function generateEnhancedCatalog() {
  console.log('🚀 Starting Teva Deli Vision Enhancement...\n');
  
  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please set: export GEMINI_API_KEY="your-api-key"');
    return;
  }
  
  try {
    // Load product catalog
    const products = await loadCatalog();
    console.log(`📦 Found ${products.length} products to analyze\n`);
    
    // Analyze each product
    const enhancedProducts = [];
    for (const product of products) {
      const visionData = await analyzeProductImage(product.image, product.name);
      
      if (visionData) {
        enhancedProducts.push({
          ...product,
          visionAnalysis: visionData,
          enhancedDescription: visionData.enhancedDescription,
          ingredients: visionData.visibleIngredients,
          nutritionalHighlights: visionData.nutritionalHighlights,
          cookingSuggestions: visionData.cookingSuggestions,
          culturalContext: visionData.culturalContext,
          mealOccasions: visionData.mealOccasions
        });
        
        console.log(`✅ Enhanced: ${product.name}`);
      } else {
        enhancedProducts.push(product);
      }
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Save enhanced catalog
    const outputPath = path.join(__dirname, '../lib/data/teva-deli-vision-enhanced.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify(enhancedProducts, null, 2)
    );
    
    console.log(`\n✨ Vision enhancement complete!`);
    console.log(`📄 Results saved to: ${outputPath}`);
    
    // Show sample enhancement
    if (enhancedProducts.length > 0 && enhancedProducts[0].visionAnalysis) {
      console.log('\n📋 Sample Enhancement:');
      console.log(JSON.stringify(enhancedProducts[0].visionAnalysis, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the enhancement
generateEnhancedCatalog();