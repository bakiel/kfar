#!/usr/bin/env python3
"""
Automated Image Fix System - No manual intervention required
Analyzes images based on filename patterns and known issues to fix mappings
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
import hashlib

class AutomatedImageFixer:
    def __init__(self):
        self.image_dir = Path("public/images/vendors/teva-deli")
        self.catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
        self.known_patterns = self.load_known_patterns()
        self.fixes = []
        
    def load_known_patterns(self):
        """Load known patterns from previous analysis and user feedback"""
        return {
            # Based on user screenshots and previous fixes
            'okara_images': ['21', '22', '23'],  # Green box OKARA products
            'shawarma_kebab_range': list(range(31, 44)),  # Shawarma and kebab products
            'tofu_specific': ['10', '12', '13', '14', '15'],  # Images showing tofu
            'schnitzel_range': ['01', '02', '25', '30'],  # Actual schnitzel images
            'burger_range': ['24', '26', '27', '29'],  # Actual burger images
            'specialty_mixed': list(range(3, 10)),  # Mixed specialty items
            
            # Known mismatches from user reports
            'confirmed_issues': {
                'td-009': {
                    'problem': 'Shows OKARA green box instead of schnitzel strips',
                    'should_use': 'schnitzel or strips image'
                },
                'td-004': {
                    'problem': 'Was using tofu image for skewers',
                    'fixed_to': '32'  # Already fixed
                },
                'td-008': {
                    'problem': 'Was using tofu image for mixed grill',
                    'fixed_to': '38'  # Already fixed
                },
                'td-010': {
                    'problem': 'Was using wrong image for shawarma',
                    'fixed_to': '35'  # Already fixed
                }
            }
        }
    
    def analyze_product_name(self, name, name_he):
        """Analyze product name to determine what type of product it is"""
        name_lower = name.lower()
        categories = {
            'schnitzel': ['schnitzel', 'breaded', 'cutlet'],
            'burger': ['burger', 'patty', 'patties'],
            'okara': ['okara', 'אוקרה'],
            'tofu': ['tofu', 'טופו'],
            'seitan': ['seitan', 'סייטן'],
            'shawarma': ['shawarma', 'שווארמה'],
            'kebab': ['kebab', 'קבב', 'skewer'],
            'sausage': ['sausage', 'hot dog', 'נקניק'],
            'kubeh': ['kubeh', 'קובה'],
            'deli': ['pastrami', 'slices', 'bologna']
        }
        
        detected = []
        for category, keywords in categories.items():
            if any(keyword in name_lower or (name_he and keyword in name_he) for keyword in keywords):
                detected.append(category)
        
        return detected[0] if detected else 'specialty'
    
    def find_best_image(self, product):
        """Find the best image for a product based on automated analysis"""
        product_type = self.analyze_product_name(product['name'], product.get('nameHe', ''))
        current_image_num = re.search(r'_(\d+)_', product['image'])
        current_num = current_image_num.group(1) if current_image_num else None
        
        # Decision logic based on product type
        best_image = None
        confidence = 0.0
        reason = ""
        
        if product_type == 'okara':
            # OKARA products should use images 21-23
            if current_num not in self.known_patterns['okara_images']:
                best_image = f"teva_deli_vegan_specialty_product_{self.known_patterns['okara_images'][0]}_burger_schnitzel_plant_based_deli.jpg"
                confidence = 0.9
                reason = "OKARA products use green box images (21-23)"
        
        elif product_type == 'schnitzel':
            # Schnitzel products should not use OKARA or tofu images
            if current_num in self.known_patterns['okara_images'] + self.known_patterns['tofu_specific']:
                # Find a schnitzel image
                for num in self.known_patterns['schnitzel_range']:
                    best_image = f"teva_deli_vegan_specialty_product_{num}_plant_based_meat_alternative_israeli_cuisine.jpg"
                    confidence = 0.8
                    reason = f"Schnitzel product moved from {current_num} to schnitzel range"
                    break
        
        elif product_type == 'shawarma' or product_type == 'kebab':
            # Shawarma/kebab should use 31-43 range
            if current_num and int(current_num) not in self.known_patterns['shawarma_kebab_range']:
                best_num = str(self.known_patterns['shawarma_kebab_range'][0])
                best_image = f"teva_deli_vegan_specialty_product_{best_num}_shawarma_kebab_middle_eastern_plant_based.jpg"
                confidence = 0.85
                reason = "Shawarma/kebab products use images 31-43"
        
        elif product_type == 'tofu':
            # Tofu products should use tofu-specific images
            if current_num not in self.known_patterns['tofu_specific'] and 'tofu' not in product['image']:
                best_image = f"teva_deli_vegan_specialty_product_{self.known_patterns['tofu_specific'][0]}_plant_based_meat_alternative_israeli_cuisine.jpg"
                confidence = 0.8
                reason = "Tofu product should use tofu-specific image"
        
        elif product_type == 'burger':
            # Burger products should not use schnitzel or tofu images
            if current_num in self.known_patterns['schnitzel_range'] + self.known_patterns['tofu_specific']:
                for num in self.known_patterns['burger_range']:
                    best_image = f"teva_deli_vegan_specialty_product_{num}_burger_schnitzel_plant_based_deli.jpg"
                    confidence = 0.8
                    reason = f"Burger product moved to burger range"
                    break
        
        # Check for known issues
        if product['id'] in self.known_patterns['confirmed_issues']:
            issue = self.known_patterns['confirmed_issues'][product['id']]
            if 'fixed_to' in issue:
                # Already fixed, skip
                return None, 0, "Already fixed"
            elif product['id'] == 'td-009':  # Schnitzel Strips showing OKARA
                # Find a good schnitzel strips image
                best_image = "teva_deli_vegan_specialty_product_09_plant_based_meat_alternative_israeli_cuisine.jpg"
                confidence = 0.9
                reason = "Fixing known issue: was showing OKARA box"
        
        return best_image, confidence, reason
    
    def load_products(self):
        """Load all products from the catalog"""
        with open(self.catalog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        products = []
        # Enhanced regex to capture all fields
        pattern = r"\{\s*id:\s*'([^']+)'[^}]*?name:\s*'([^']+)'[^}]*?nameHe:\s*'([^']+)'[^}]*?category:\s*'([^']+)'[^}]*?image:\s*'([^']+)'"
        
        for match in re.finditer(pattern, content, re.DOTALL):
            products.append({
                'id': match.group(1),
                'name': match.group(2),
                'nameHe': match.group(3),
                'category': match.group(4),
                'image': match.group(5),
                'image_filename': match.group(5).split('/')[-1]
            })
        
        return products
    
    def analyze_all_products(self):
        """Analyze all products and generate fixes"""
        products = self.load_products()
        print(f"🔍 Analyzing {len(products)} products...\n")
        
        for product in products:
            best_image, confidence, reason = self.find_best_image(product)
            
            if best_image and confidence > 0.5:
                current_image = product['image_filename']
                if current_image != best_image:
                    self.fixes.append({
                        'id': product['id'],
                        'name': product['name'],
                        'category': product['category'],
                        'current_image': current_image,
                        'new_image': best_image,
                        'confidence': confidence,
                        'reason': reason
                    })
        
        return self.fixes
    
    def generate_fix_script(self):
        """Generate JavaScript to apply all fixes"""
        if not self.fixes:
            print("✅ No fixes needed - all images appear to be correctly mapped!")
            return
        
        script = f"""#!/usr/bin/env node
// Automated Image Fixes - Generated {datetime.now().isoformat()}
// Based on automated analysis of product names and known patterns

const fs = require('fs').promises;
const path = require('path');

async function applyAutomatedFixes() {{
  console.log('🤖 Applying automated image fixes...\\n');
  
  const catalogPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(catalogPath, 'utf-8');
  let originalContent = content;
  
  const fixes = {json.dumps(self.fixes, indent=2, ensure_ascii=False)};
  
  console.log(`Found ${{fixes.length}} products that need image updates\\n`);
  
  let appliedCount = 0;
  
  for (const fix of fixes) {{
    console.log(`📸 ${{fix.id}}: ${{fix.name}}`);
    console.log(`   Category: ${{fix.category}}`);
    console.log(`   Current: ${{fix.current_image}}`);
    console.log(`   New: ${{fix.new_image}}`);
    console.log(`   Confidence: ${{(fix.confidence * 100).toFixed(0)}}%`);
    console.log(`   Reason: ${{fix.reason}}\\n`);
    
    // Create regex to find and replace the image
    const regex = new RegExp(
      `(id:\\\\s*'${{fix.id}}'[^}}]*?image:\\\\s*')[^']+(')`
    );
    
    const newImagePath = `/images/vendors/teva-deli/${{fix.new_image}}`;
    const newContent = content.replace(regex, `$1${{newImagePath}}$2`);
    
    if (newContent !== content) {{
      content = newContent;
      appliedCount++;
    }} else {{
      console.log(`   ⚠️  Could not apply fix - pattern not found\\n`);
    }}
  }}
  
  if (appliedCount > 0) {{
    // Create backup
    const backupPath = catalogPath + '.backup-' + Date.now();
    await fs.writeFile(backupPath, originalContent);
    console.log(`\\n📁 Created backup: ${{backupPath}}`);
    
    // Write updated content
    await fs.writeFile(catalogPath, content);
    console.log(`\\n✅ Successfully applied ${{appliedCount}} fixes!`);
  }} else {{
    console.log('\\n❌ No fixes could be applied');
  }}
}}

// Run the fixes
applyAutomatedFixes().catch(err => {{
  console.error('❌ Error applying fixes:', err);
  process.exit(1);
}});
"""
        
        fix_script_path = Path("apply-automated-fixes.js")
        with open(fix_script_path, 'w') as f:
            f.write(script)
        
        print(f"✅ Generated fix script: {fix_script_path}")
        print(f"📊 Total fixes to apply: {len(self.fixes)}")
        
        return str(fix_script_path)
    
    def generate_report(self):
        """Generate a detailed report of all fixes"""
        report = f"""# 🤖 Automated Image Fix Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary
- Total products analyzed: {len(self.load_products())}
- Issues found: {len(self.fixes)}
- Confidence threshold: 50%

## Detected Issues and Fixes

"""
        
        # Group fixes by reason
        by_reason = {}
        for fix in self.fixes:
            reason = fix['reason']
            if reason not in by_reason:
                by_reason[reason] = []
            by_reason[reason].append(fix)
        
        for reason, fixes in by_reason.items():
            report += f"### {reason} ({len(fixes)} products)\n\n"
            for fix in fixes:
                report += f"- **{fix['id']}**: {fix['name']}\n"
                report += f"  - Current: `{fix['current_image']}`\n"
                report += f"  - New: `{fix['new_image']}`\n"
                report += f"  - Confidence: {fix['confidence']*100:.0f}%\n\n"
        
        report += """
## How to Apply Fixes

1. Review the fixes above
2. Run the generated script:
   ```bash
   node apply-automated-fixes.js
   ```
3. Test the website to ensure images are correct
4. If any issues remain, they may require manual review

## Automation Logic

This automated fix is based on:
1. Product name analysis (Hebrew and English)
2. Known image number ranges for different product types
3. Previously identified issues from user feedback
4. Pattern matching to detect mismatches

---
*This report was generated automatically without manual intervention.*
"""
        
        report_path = Path("automated-fix-report.md")
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"📄 Generated report: {report_path}")
        
        return report

def main():
    print("🤖 Automated Image Fix System")
    print("=" * 50)
    print("This system will automatically:")
    print("1. Analyze all Teva Deli products")
    print("2. Detect image mismatches")
    print("3. Generate fixes based on patterns")
    print("4. Create a script to apply fixes")
    print("=" * 50)
    print()
    
    # Change to correct directory
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    fixer = AutomatedImageFixer()
    
    # Run analysis
    fixes = fixer.analyze_all_products()
    
    if fixes:
        print(f"\n🎯 Found {len(fixes)} products with potential image issues\n")
        
        # Show preview
        print("Preview of fixes:")
        print("-" * 80)
        for i, fix in enumerate(fixes[:5]):  # Show first 5
            print(f"{fix['id']}: {fix['name']}")
            print(f"  Reason: {fix['reason']}")
            print(f"  Confidence: {fix['confidence']*100:.0f}%")
            print()
        
        if len(fixes) > 5:
            print(f"... and {len(fixes) - 5} more fixes\n")
        
        # Generate outputs
        script_path = fixer.generate_fix_script()
        report = fixer.generate_report()
        
        print("\n✅ Automation complete!")
        print("\n📋 Next steps:")
        print("1. Review the report: automated-fix-report.md")
        print("2. Apply the fixes: node apply-automated-fixes.js")
        print("\nThe fixes are ready to apply automatically!")
        
    else:
        print("\n✅ No issues detected - all images appear to be correctly mapped!")

if __name__ == "__main__":
    main()