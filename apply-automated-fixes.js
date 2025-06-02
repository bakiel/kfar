#!/usr/bin/env node
// Automated Image Fixes - Generated 2025-06-02T10:28:51.335906
// Based on automated analysis of product names and known patterns

const fs = require('fs').promises;
const path = require('path');

async function applyAutomatedFixes() {
  console.log('🤖 Applying automated image fixes...\n');
  
  const catalogPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(catalogPath, 'utf-8');
  let originalContent = content;
  
  const fixes = [
  {
    "id": "td-003",
    "name": "Crispy Tofu Bites",
    "category": "seitan-tofu",
    "current_image": "teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg",
    "new_image": "teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg",
    "confidence": 0.8,
    "reason": "Tofu product should use tofu-specific image"
  },
  {
    "id": "td-005",
    "name": "Marinated Tofu Strips",
    "category": "seitan-tofu",
    "current_image": "teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg",
    "new_image": "teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg",
    "confidence": 0.8,
    "reason": "Tofu product should use tofu-specific image"
  },
  {
    "id": "td-044",
    "name": "Shawarma Laffa Wrap Kit",
    "category": "meal-kits",
    "current_image": "teva_deli_vegan_specialty_product_44_shawarma_kebab_middle_eastern_plant_based.jpg",
    "new_image": "teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg",
    "confidence": 0.85,
    "reason": "Shawarma/kebab products use images 31-43"
  }
];
  
  console.log(`Found ${fixes.length} products that need image updates\n`);
  
  let appliedCount = 0;
  
  for (const fix of fixes) {
    console.log(`📸 ${fix.id}: ${fix.name}`);
    console.log(`   Category: ${fix.category}`);
    console.log(`   Current: ${fix.current_image}`);
    console.log(`   New: ${fix.new_image}`);
    console.log(`   Confidence: ${(fix.confidence * 100).toFixed(0)}%`);
    console.log(`   Reason: ${fix.reason}\n`);
    
    // Create regex to find and replace the image
    const regex = new RegExp(
      `(id:\\s*'${fix.id}'[^}]*?image:\\s*')[^']+(')`
    );
    
    const newImagePath = `/images/vendors/teva-deli/${fix.new_image}`;
    const newContent = content.replace(regex, `$1${newImagePath}$2`);
    
    if (newContent !== content) {
      content = newContent;
      appliedCount++;
    } else {
      console.log(`   ⚠️  Could not apply fix - pattern not found\n`);
    }
  }
  
  if (appliedCount > 0) {
    // Create backup
    const backupPath = catalogPath + '.backup-' + Date.now();
    await fs.writeFile(backupPath, originalContent);
    console.log(`\n📁 Created backup: ${backupPath}`);
    
    // Write updated content
    await fs.writeFile(catalogPath, content);
    console.log(`\n✅ Successfully applied ${appliedCount} fixes!`);
  } else {
    console.log('\n❌ No fixes could be applied');
  }
}

// Run the fixes
applyAutomatedFixes().catch(err => {
  console.error('❌ Error applying fixes:', err);
  process.exit(1);
});
