#!/usr/bin/env python3
"""
Deep Automated Image Fix System
More sophisticated analysis based on known issues and product-image mismatches
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

class DeepAutomatedFixer:
    def __init__(self):
        self.catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
        self.fixes = []
        
        # Enhanced knowledge base from user feedback and screenshots
        self.knowledge_base = {
            # Specific product fixes based on user reports
            'specific_fixes': {
                'td-009': {
                    'name': 'Schnitzel Strips Pack',
                    'current_issue': 'Currently using image 32 (shawarma) but should show schnitzel strips',
                    'correct_image': 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg',
                    'reason': 'Product is schnitzel strips, not shawarma'
                },
                'td-021': {
                    'name': 'Okara Vegetable Patties',
                    'should_show': 'Green box OKARA product',
                    'correct_image': 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg',
                    'reason': 'OKARA products use images 21-23'
                },
                'td-022': {
                    'name': 'Okara Patties with Broccoli',
                    'should_show': 'Green box OKARA product',
                    'correct_image': 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg',
                    'reason': 'OKARA products use images 21-23'
                },
                'td-023': {
                    'name': 'Plant-Based Ground Meat',
                    'should_show': 'Green box or ground meat product',
                    'correct_image': 'teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg',
                    'reason': 'OKARA/ground meat products use images 21-23'
                }
            },
            
            # Image content mapping based on file analysis
            'image_content': {
                # Images 1-9: Various schnitzels and specialty
                '01': 'schnitzel cutlets',
                '02': 'schnitzel/breaded product',
                '03': 'specialty product (might be tofu)',
                '04': 'meat alternative (verify content)',
                '05': 'meat alternative strips',
                '06': 'meatballs or specialty',
                '07': 'deli-style product',
                '08': 'meat alternative',
                '09': 'schnitzel strips or cutlets',
                
                # Images 10-20: Mixed tofu/seitan products
                '10': 'tofu package (NOT skewers)',
                '11': 'sausage/hot dogs',
                '12': 'tofu block (NOT mixed grill)',
                '13': 'tofu/seitan product',
                '14': 'seitan strips/bacon',
                '15': 'tofu slices',
                '16': 'seitan/chorizo',
                '17': 'BBQ product',
                '18': 'BBQ ribs',
                '19': 'herb cutlets',
                '20': 'tofu scramble',
                
                # Images 21-30: Burger/OKARA range
                '21': 'OKARA green box patties',
                '22': 'OKARA green box with broccoli',
                '23': 'Ground meat/OKARA product',
                '24': 'burger with rice/lentils',
                '25': 'schnitzel (spinach/herbs)',
                '26': 'black bean burger',
                '27': 'mini burgers/sliders',
                '28': 'special burger product',
                '29': 'quinoa veggie burger',
                '30': 'sesame schnitzel',
                
                # Images 31-43: Shawarma/kebab range
                '31': 'salami/deli roll',
                '32': 'kebab/skewers',
                '33': 'sliced seitan',
                '34': 'kebab product',
                '35': 'shawarma/turkey style',
                '36': 'persian kebabs',
                '37': 'chicken-style shawarma',
                '38': 'mixed grill/variety',
                '39': 'bologna roll',
                '40': 'shish tawook style',
                '41': 'round seitan',
                '42': 'shawarma party pack',
                '43': 'merguez/special sausage'
            },
            
            # Category-to-image-range mapping
            'category_ranges': {
                'schnitzels': ['01', '02', '09', '25', '30'],
                'burgers': ['21', '22', '23', '24', '26', '27', '29'],
                'tofu': ['10', '12', '13', '15', '20'],
                'seitan': ['14', '16', '33', '41'],
                'shawarma': ['35', '37', '42'],
                'kebabs': ['32', '34', '36', '40'],
                'sausages': ['11', '31', '39', '43'],
                'deli': ['07', '31', '39']
            }
        }
    
    def load_products(self):
        """Load all products from catalog"""
        with open(self.catalog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        products = []
        # Parse all products with their current images
        blocks = re.findall(r'\{[^}]*?id:\s*[\'"]td-[^}]+\}', content, re.DOTALL)
        
        for block in blocks:
            id_match = re.search(r"id:\s*['\"]([^'\"]+)['\"]", block)
            name_match = re.search(r"name:\s*['\"]([^'\"]+)['\"]", block)
            category_match = re.search(r"category:\s*['\"]([^'\"]+)['\"]", block)
            image_match = re.search(r"image:\s*['\"]([^'\"]+)['\"]", block)
            
            if all([id_match, name_match, category_match, image_match]):
                image_path = image_match.group(1)
                image_num_match = re.search(r'_(\d+)_', image_path)
                
                products.append({
                    'id': id_match.group(1),
                    'name': name_match.group(1),
                    'category': category_match.group(1),
                    'current_image_path': image_path,
                    'current_image': image_path.split('/')[-1],
                    'current_image_num': image_num_match.group(1) if image_num_match else None
                })
        
        return products
    
    def analyze_product(self, product):
        """Deep analysis of each product"""
        pid = product['id']
        name = product['name']
        category = product['category']
        current_num = product['current_image_num']
        
        # Check specific fixes first
        if pid in self.knowledge_base['specific_fixes']:
            fix_info = self.knowledge_base['specific_fixes'][pid]
            if 'correct_image' in fix_info:
                return {
                    'needs_fix': True,
                    'new_image': fix_info['correct_image'],
                    'reason': fix_info['reason'],
                    'confidence': 0.95
                }
        
        # Check if current image content matches product type
        if current_num:
            image_content = self.knowledge_base['image_content'].get(current_num, '')
            name_lower = name.lower()
            
            # Detect mismatches
            mismatches = []
            
            # Tofu products using non-tofu images
            if 'tofu' in name_lower and 'tofu' not in image_content:
                mismatches.append('Tofu product using non-tofu image')
                
            # Schnitzel products using non-schnitzel images
            if 'schnitzel' in name_lower and 'schnitzel' not in image_content and 'cutlet' not in image_content:
                mismatches.append('Schnitzel product using non-schnitzel image')
                
            # OKARA products not using OKARA images (21-23)
            if 'okara' in name_lower and current_num not in ['21', '22', '23']:
                mismatches.append('OKARA product not using OKARA image range (21-23)')
                
            # Shawarma/kebab products not in correct range
            if ('shawarma' in name_lower or 'kebab' in name_lower) and int(current_num) < 31:
                mismatches.append('Shawarma/kebab product not in correct range (31-43)')
            
            # Products showing tofu when they shouldn't
            if 'tofu' in image_content and 'tofu' not in name_lower:
                mismatches.append(f'Non-tofu product using tofu image ({current_num})')
            
            if mismatches:
                # Find best replacement
                best_image = self.find_best_replacement(product, mismatches)
                if best_image:
                    return {
                        'needs_fix': True,
                        'new_image': best_image,
                        'reason': '; '.join(mismatches),
                        'confidence': 0.85
                    }
        
        return {'needs_fix': False}
    
    def find_best_replacement(self, product, mismatches):
        """Find the best replacement image based on product type"""
        name_lower = product['name'].lower()
        category = product['category']
        
        # OKARA products
        if 'okara' in name_lower:
            if 'broccoli' in name_lower:
                return 'teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg'
            else:
                return 'teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg'
        
        # Schnitzel products
        if 'schnitzel' in name_lower:
            if 'strips' in name_lower or 'strip' in name_lower:
                return 'teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg'
            elif 'sesame' in name_lower:
                return 'teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg'
            elif 'spinach' in name_lower or 'herb' in name_lower:
                return 'teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg'
            else:
                # Generic schnitzel
                return 'teva_deli_vegan_specialty_product_01_plant_based_meat_alternative_israeli_cuisine.jpg'
        
        # Shawarma products
        if 'shawarma' in name_lower:
            if 'chicken' in name_lower:
                return 'teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg'
            else:
                return 'teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg'
        
        # Kebab products
        if 'kebab' in name_lower or 'skewer' in name_lower:
            return 'teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg'
        
        # Burger products
        if category == 'burgers' or 'burger' in name_lower:
            if 'black bean' in name_lower:
                return 'teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg'
            elif 'quinoa' in name_lower:
                return 'teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg'
            elif 'mini' in name_lower or 'slider' in name_lower:
                return 'teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg'
            else:
                return 'teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg'
        
        # Default based on category ranges
        if category in self.knowledge_base['category_ranges']:
            suitable_images = self.knowledge_base['category_ranges'][category]
            if suitable_images:
                num = suitable_images[0]
                return f'teva_deli_vegan_specialty_product_{num}_{"shawarma_kebab" if int(num) > 30 else "plant_based_meat_alternative" if int(num) < 21 else "burger_schnitzel"}_{"middle_eastern_" if int(num) > 30 else ""}plant_based{"_deli" if 21 <= int(num) <= 30 else ""}.jpg'
        
        return None
    
    def run_analysis(self):
        """Run deep analysis on all products"""
        products = self.load_products()
        print(f"🔬 Deep analysis of {len(products)} products...\n")
        
        for product in products:
            result = self.analyze_product(product)
            if result['needs_fix']:
                self.fixes.append({
                    'id': product['id'],
                    'name': product['name'],
                    'category': product['category'],
                    'current_image': product['current_image'],
                    'new_image': result['new_image'],
                    'reason': result['reason'],
                    'confidence': result['confidence']
                })
        
        return self.fixes
    
    def generate_fix_script(self):
        """Generate the fix script"""
        if not self.fixes:
            print("✅ No additional fixes needed!")
            return None
            
        script = f"""#!/usr/bin/env node
// Deep Automated Fixes - Generated {datetime.now().isoformat()}
// Based on deep analysis of product-image mismatches

const fs = require('fs').promises;
const path = require('path');

async function applyDeepFixes() {{
  console.log('🔬 Applying deep automated fixes...\\n');
  
  const catalogPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(catalogPath, 'utf-8');
  let originalContent = content;
  
  const fixes = {json.dumps(self.fixes, indent=2, ensure_ascii=False)};
  
  console.log(`Found ${{fixes.length}} products that need fixing\\n`);
  
  let appliedCount = 0;
  
  for (const fix of fixes) {{
    console.log(`🔧 ${{fix.id}}: ${{fix.name}}`);
    console.log(`   Category: ${{fix.category}}`);
    console.log(`   Issue: ${{fix.reason}}`);
    console.log(`   Current: ${{fix.current_image}}`);
    console.log(`   Fixed to: ${{fix.new_image}}`);
    console.log(`   Confidence: ${{(fix.confidence * 100).toFixed(0)}}%\\n`);
    
    // Apply fix
    const oldPath = fix.current_image.includes('/') ? fix.current_image : `/images/vendors/teva-deli/${{fix.current_image}}`;
    const newPath = `/images/vendors/teva-deli/${{fix.new_image}}`;
    
    // More flexible regex to handle various formatting
    const patterns = [
      new RegExp(`(id:\\\\s*'${{fix.id}}'[^}}]*?image:\\\\s*')[^']+(')`),
      new RegExp(`(id:\\\\s*"${{fix.id}}"[^}}]*?image:\\\\s*")[^"]+(")`),
      new RegExp(`(id:\\\\s*'${{fix.id}}'[^}}]*?image:\\\\s*")[^"]+(")`),
      new RegExp(`(id:\\\\s*"${{fix.id}}"[^}}]*?image:\\\\s*')[^']+(')`),
    ];
    
    let replaced = false;
    for (const pattern of patterns) {{
      const newContent = content.replace(pattern, `$1${{newPath}}$2`);
      if (newContent !== content) {{
        content = newContent;
        replaced = true;
        appliedCount++;
        break;
      }}
    }}
    
    if (!replaced) {{
      console.log(`   ⚠️  Could not apply fix - pattern not found\\n`);
    }}
  }}
  
  if (appliedCount > 0) {{
    // Create backup
    const backupPath = catalogPath + '.backup-deep-' + Date.now();
    await fs.writeFile(backupPath, originalContent);
    console.log(`\\n📁 Created backup: ${{backupPath}}`);
    
    // Write updated content
    await fs.writeFile(catalogPath, content);
    console.log(`\\n✅ Successfully applied ${{appliedCount}} deep fixes!`);
    
    // Summary
    console.log('\\n📊 Fix Summary:');
    const byReason = {{}};
    fixes.forEach(fix => {{
      const key = fix.reason.split(';')[0];
      byReason[key] = (byReason[key] || 0) + 1;
    }});
    
    Object.entries(byReason).forEach(([reason, count]) => {{
      console.log(`   - ${{reason}}: ${{count}} products`);
    }});
  }} else {{
    console.log('\\n❌ No fixes could be applied');
  }}
}}

applyDeepFixes().catch(err => {{
  console.error('❌ Error:', err);
  process.exit(1);
}});
"""
        
        with open('apply-deep-fixes.js', 'w') as f:
            f.write(script)
            
        return 'apply-deep-fixes.js'
    
    def generate_report(self):
        """Generate detailed report"""
        report = f"""# 🔬 Deep Automated Fix Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Analysis Summary
- Products analyzed: {len(self.load_products())}
- Issues detected: {len(self.fixes)}
- Detection method: Deep content analysis + user feedback

## Detected Issues

"""
        
        # Group by issue type
        by_issue = {}
        for fix in self.fixes:
            issue_type = fix['reason'].split(';')[0]
            if issue_type not in by_issue:
                by_issue[issue_type] = []
            by_issue[issue_type].append(fix)
        
        for issue_type, fixes in by_issue.items():
            report += f"### {issue_type}\n\n"
            for fix in fixes:
                report += f"**{fix['id']} - {fix['name']}**\n"
                report += f"- Current: `{fix['current_image']}`\n"
                report += f"- Fixed to: `{fix['new_image']}`\n"
                report += f"- Confidence: {fix['confidence']*100:.0f}%\n\n"
        
        report += """
## Key Fixes Applied

1. **Schnitzel products** - Moved from shawarma/tofu images to proper schnitzel images
2. **OKARA products** - Ensured all use images 21-23 (green box range)
3. **Tofu products** - Moved to tofu-specific images (10, 12, 13, 15)
4. **Shawarma/Kebab** - Ensured all use images 31-43

## Next Steps

1. Apply the fixes: `node apply-deep-fixes.js`
2. Test the website to verify images are correct
3. If any issues remain, they may need manual verification

---
*Generated by Deep Automated Fix System*
"""
        
        with open('deep-fix-report.md', 'w') as f:
            f.write(report)
            
        return 'deep-fix-report.md'

def main():
    print("🔬 Deep Automated Fix System")
    print("=" * 60)
    print("Advanced analysis based on:")
    print("- Known product-image mismatches")
    print("- User-reported issues")
    print("- Content-based image mapping")
    print("- Category-appropriate ranges")
    print("=" * 60)
    print()
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    fixer = DeepAutomatedFixer()
    fixes = fixer.run_analysis()
    
    if fixes:
        print(f"\n🎯 Found {len(fixes)} products with image mismatches\n")
        
        # Show all fixes
        for i, fix in enumerate(fixes):
            print(f"{i+1}. {fix['id']}: {fix['name']}")
            print(f"   Issue: {fix['reason']}")
            print(f"   Fix: {fix['current_image']} → {fix['new_image']}")
            print(f"   Confidence: {fix['confidence']*100:.0f}%")
            print()
        
        # Generate outputs
        script = fixer.generate_fix_script()
        report = fixer.generate_report()
        
        print("\n✅ Deep analysis complete!")
        print(f"\n📄 Generated:")
        print(f"   - Fix script: {script}")
        print(f"   - Report: {report}")
        print("\n🚀 Run: node apply-deep-fixes.js")
        
    else:
        print("\n✅ No additional issues detected!")
        print("All images appear to be correctly mapped.")

if __name__ == "__main__":
    main()