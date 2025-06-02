#!/usr/bin/env python3
"""
Final Automated Fix - Corrects image paths and remaining issues
"""

import os
import re
from pathlib import Path

def fix_all_issues():
    print("🔧 Final Automated Fix System\n")
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    with open(catalog_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    fixes_applied = []
    
    # Fix 1: Correct image path for td-009 (missing -deli/)
    print("1. Fixing td-009 image path...")
    old_path = "image: '/images/vendors/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg'"
    new_path = "image: '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg'"
    
    if old_path in content:
        content = content.replace(old_path, new_path)
        fixes_applied.append("Fixed td-009 image path (was missing -deli/)")
        print("   ✅ Fixed missing -deli/ in path")
    
    # Fix 2: Based on user feedback - td-009 should NOT use shawarma image
    # Check if td-009 is using a shawarma image
    td009_match = re.search(r"id: 'td-009'[^}]*?image: '([^']+)'", content, re.DOTALL)
    if td009_match:
        current_image = td009_match.group(1)
        if 'shawarma' in current_image or 'kebab' in current_image:
            print("2. Fixing td-009 using shawarma image...")
            # Replace with proper schnitzel strips image
            pattern = r"(id: 'td-009'[^}]*?image: ')[^']+(')"
            replacement = r"\1/images/vendors/teva-deli/teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg\2"
            content = re.sub(pattern, replacement, content)
            fixes_applied.append("Fixed td-009 from shawarma to schnitzel strips image")
            print("   ✅ Changed from shawarma to schnitzel strips image")
    
    # Fix 3: Ensure all OKARA products use correct images
    print("\n3. Verifying OKARA products...")
    okara_products = [
        ('td-021', 'Okara Vegetable Patties', '21'),
        ('td-022', 'Okara Patties with Broccoli', '22'),
        ('td-023', 'Plant-Based Ground Meat', '23')
    ]
    
    for pid, name, img_num in okara_products:
        pattern = rf"(id: '{pid}'[^}}]*?image: ')([^']+)(')"
        match = re.search(pattern, content, re.DOTALL)
        if match:
            current = match.group(2)
            expected = f"/images/vendors/teva-deli/teva_deli_vegan_specialty_product_{img_num}_burger_schnitzel_plant_based_deli.jpg"
            if current != expected:
                content = re.sub(pattern, rf"\1{expected}\3", content)
                fixes_applied.append(f"Fixed {pid} ({name}) to use OKARA image {img_num}")
                print(f"   ✅ Fixed {pid} to use correct OKARA image")
    
    # Fix 4: Check for any remaining path issues (missing teva-deli/)
    print("\n4. Checking for path issues...")
    bad_paths = re.findall(r"image: '/images/vendors/teva_deli_", content)
    if bad_paths:
        content = re.sub(r"image: '/images/vendors/teva_deli_", "image: '/images/vendors/teva-deli/teva_deli_", content)
        fixes_applied.append(f"Fixed {len(bad_paths)} image paths missing -deli/")
        print(f"   ✅ Fixed {len(bad_paths)} paths missing -deli/")
    
    # Fix 5: Specific fixes based on known issues
    print("\n5. Applying specific fixes...")
    specific_fixes = [
        {
            'id': 'td-003',
            'name': 'Crispy Tofu Bites',
            'should_not_be': '10',  # Image 10 shows plain tofu, not crispy bites
            'should_be': '03'  # Back to original crispy product image
        },
        {
            'id': 'td-005', 
            'name': 'Marinated Tofu Strips',
            'should_not_be': '10',  # Image 10 shows plain tofu package
            'should_be': '05'  # Back to strips image
        }
    ]
    
    for fix in specific_fixes:
        pattern = rf"(id: '{fix['id']}'[^}}]*?image: '[^']*?)_{fix['should_not_be']}_([^']+)(')"
        if re.search(pattern, content):
            replacement = rf"\1_{fix['should_be']}_\2\3"
            content = re.sub(pattern, replacement, content)
            fixes_applied.append(f"Fixed {fix['id']} ({fix['name']}) from image {fix['should_not_be']} to {fix['should_be']}")
            print(f"   ✅ Fixed {fix['id']} to use more appropriate image")
    
    # Save if changes were made
    if content != original_content:
        # Create backup
        backup_path = catalog_path.parent / f"{catalog_path.name}.backup-final-{int(Path('').stat().st_mtime)}"
        with open(backup_path, 'w', encoding='utf-8') as f:
            f.write(original_content)
        
        # Write updated content
        with open(catalog_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"\n✅ Applied {len(fixes_applied)} fixes!")
        print("\n📋 Fixes applied:")
        for i, fix in enumerate(fixes_applied, 1):
            print(f"   {i}. {fix}")
        print(f"\n📁 Backup saved to: {backup_path}")
        
        # Generate verification script
        generate_verification_script()
        
    else:
        print("\n✅ No fixes needed - all images appear correct!")

def generate_verification_script():
    """Generate a script to verify the fixes"""
    script = """#!/usr/bin/env node
// Verify image fixes

const fs = require('fs');
const path = require('path');

const catalog = fs.readFileSync(path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts'), 'utf-8');

// Check specific products
const checks = [
  { id: 'td-009', name: 'Schnitzel Strips', shouldNotContain: ['shawarma', 'kebab', '32'] },
  { id: 'td-021', name: 'Okara Patties', shouldContain: ['21', 'burger_schnitzel'] },
  { id: 'td-022', name: 'Okara Broccoli', shouldContain: ['22', 'burger_schnitzel'] },
  { id: 'td-023', name: 'Ground Meat', shouldContain: ['23', 'burger_schnitzel'] },
  { id: 'td-003', name: 'Crispy Tofu', shouldContain: ['03'], shouldNotContain: ['10'] },
  { id: 'td-005', name: 'Tofu Strips', shouldContain: ['05'], shouldNotContain: ['10'] }
];

console.log('🔍 Verifying image fixes...\\n');

let allGood = true;

checks.forEach(check => {
  const regex = new RegExp(`id: '${check.id}'[^}]*?image: '([^']+)'`, 's');
  const match = catalog.match(regex);
  
  if (match) {
    const imagePath = match[1];
    let status = '✅';
    let issues = [];
    
    if (check.shouldContain) {
      check.shouldContain.forEach(term => {
        if (!imagePath.includes(term)) {
          status = '❌';
          issues.push(`Missing: ${term}`);
          allGood = false;
        }
      });
    }
    
    if (check.shouldNotContain) {
      check.shouldNotContain.forEach(term => {
        if (imagePath.includes(term)) {
          status = '❌';
          issues.push(`Should not have: ${term}`);
          allGood = false;
        }
      });
    }
    
    console.log(`${status} ${check.id}: ${check.name}`);
    console.log(`   Image: ${imagePath.split('/').pop()}`);
    if (issues.length > 0) {
      console.log(`   Issues: ${issues.join(', ')}`);
    }
    console.log();
  }
});

if (allGood) {
  console.log('✅ All image fixes verified successfully!');
} else {
  console.log('❌ Some issues remain - please check above');
}
"""
    
    with open('verify-fixes.js', 'w') as f:
        f.write(script)
    
    print("\n📝 Generated verification script: verify-fixes.js")
    print("   Run: node verify-fixes.js")

if __name__ == "__main__":
    fix_all_issues()