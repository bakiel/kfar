#!/usr/bin/env node
// Deep Automated Fixes - Generated 2025-06-02T10:32:05.691591
// Based on deep analysis of product-image mismatches

const fs = require('fs').promises;
const path = require('path');

async function applyDeepFixes() {
  console.log('🔬 Applying deep automated fixes...\n');
  
  const catalogPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(catalogPath, 'utf-8');
  let originalContent = content;
  
  const fixes = [
  {
    "id": "td-009",
    "name": "Schnitzel Strips Pack",
    "category": "schnitzels",
    "current_image": "teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg",
    "new_image": "teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg",
    "reason": "Product is schnitzel strips, not shawarma",
    "confidence": 0.95
  },
  {
    "id": "td-021",
    "name": "Okara Vegetable Patties",
    "category": "burgers",
    "current_image": "teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg",
    "new_image": "teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg",
    "reason": "OKARA products use images 21-23",
    "confidence": 0.95
  },
  {
    "id": "td-022",
    "name": "Okara Patties with Broccoli",
    "category": "burgers",
    "current_image": "teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg",
    "new_image": "teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg",
    "reason": "OKARA products use images 21-23",
    "confidence": 0.95
  },
  {
    "id": "td-023",
    "name": "Plant-Based Ground Meat",
    "category": "burgers",
    "current_image": "teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg",
    "new_image": "teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg",
    "reason": "OKARA/ground meat products use images 21-23",
    "confidence": 0.95
  }
];
  
  console.log(`Found ${fixes.length} products that need fixing\n`);
  
  let appliedCount = 0;
  
  for (const fix of fixes) {
    console.log(`🔧 ${fix.id}: ${fix.name}`);
    console.log(`   Category: ${fix.category}`);
    console.log(`   Issue: ${fix.reason}`);
    console.log(`   Current: ${fix.current_image}`);
    console.log(`   Fixed to: ${fix.new_image}`);
    console.log(`   Confidence: ${(fix.confidence * 100).toFixed(0)}%\n`);
    
    // Apply fix
    const oldPath = fix.current_image.includes('/') ? fix.current_image : `/images/vendors/teva-deli/${fix.current_image}`;
    const newPath = `/images/vendors/teva-deli/${fix.new_image}`;
    
    // More flexible regex to handle various formatting
    const patterns = [
      new RegExp(`(id:\\s*'${fix.id}'[^}]*?image:\\s*')[^']+(')`),
      new RegExp(`(id:\\s*"${fix.id}"[^}]*?image:\\s*")[^"]+(")`),
      new RegExp(`(id:\\s*'${fix.id}'[^}]*?image:\\s*")[^"]+(")`),
      new RegExp(`(id:\\s*"${fix.id}"[^}]*?image:\\s*')[^']+(')`),
    ];
    
    let replaced = false;
    for (const pattern of patterns) {
      const newContent = content.replace(pattern, `$1${newPath}$2`);
      if (newContent !== content) {
        content = newContent;
        replaced = true;
        appliedCount++;
        break;
      }
    }
    
    if (!replaced) {
      console.log(`   ⚠️  Could not apply fix - pattern not found\n`);
    }
  }
  
  if (appliedCount > 0) {
    // Create backup
    const backupPath = catalogPath + '.backup-deep-' + Date.now();
    await fs.writeFile(backupPath, originalContent);
    console.log(`\n📁 Created backup: ${backupPath}`);
    
    // Write updated content
    await fs.writeFile(catalogPath, content);
    console.log(`\n✅ Successfully applied ${appliedCount} deep fixes!`);
    
    // Summary
    console.log('\n📊 Fix Summary:');
    const byReason = {};
    fixes.forEach(fix => {
      const key = fix.reason.split(';')[0];
      byReason[key] = (byReason[key] || 0) + 1;
    });
    
    Object.entries(byReason).forEach(([reason, count]) => {
      console.log(`   - ${reason}: ${count} products`);
    });
  } else {
    console.log('\n❌ No fixes could be applied');
  }
}

applyDeepFixes().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
