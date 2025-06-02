#!/usr/bin/env python3
"""
Resume Product Analysis from where it left off
"""

import os
import json
import subprocess
import sys
from pathlib import Path
from datetime import datetime
import re

def check_existing_progress():
    """Check what's already been analyzed"""
    progress_file = "qwen_product_analysis_progress.json"
    if Path(progress_file).exists():
        with open(progress_file, 'r') as f:
            data = json.load(f)
        analyzed_ids = list(data['results'].keys())
        print(f"✅ Found existing progress: {len(analyzed_ids)} products already analyzed")
        return analyzed_ids
    return []

def load_all_products():
    """Load all products from catalog"""
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    with open(catalog_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    products = []
    pattern = r"\{\s*id:\s*'([^']+)'[^}]*?name:\s*'([^']+)'[^}]*?nameHe:\s*'([^']+)'[^}]*?description:\s*'([^']+)'[^}]*?price:\s*(\d+)[^}]*?category:\s*'([^']+)'[^}]*?image:\s*'([^']+)'"
    
    for match in re.finditer(pattern, content, re.DOTALL):
        products.append({
            'id': match.group(1),
            'name': match.group(2),
            'nameHe': match.group(3),
            'description': match.group(4),
            'price': int(match.group(5)),
            'category': match.group(6),
            'image': match.group(7)
        })
    
    return products

def create_resume_script(remaining_products):
    """Create a modified analyzer that only processes remaining products"""
    
    script = f'''#!/usr/bin/env python3
"""
Resume Analysis - Only process remaining products
"""

import os
import json
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from qwen_full_product_analyzer import QwenProductAnalyzer, generate_product_description
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Products to analyze
remaining_products = {json.dumps(remaining_products, indent=2)}

# Load existing results
existing_results = {{}}
if Path("qwen_product_analysis_progress.json").exists():
    with open("qwen_product_analysis_progress.json", 'r') as f:
        data = json.load(f)
        existing_results = data['results']

print(f"📊 Resuming analysis...")
print(f"✅ Already analyzed: {{len(existing_results)}} products")
print(f"📦 Remaining to analyze: {{len(remaining_products)}} products")

# Initialize analyzer with PAID tier
API_KEY = "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"
analyzer = QwenProductAnalyzer(API_KEY, use_free_tier=False)

# Copy existing results
results = existing_results.copy()

# Analyze remaining products
for i, product in enumerate(remaining_products):
    print(f"\\nProcessing {{i+1}}/{{len(remaining_products)}}: {{product['name']}}")
    
    # Skip if already analyzed
    if product['id'] in results:
        print(f"  ✓ Already analyzed, skipping...")
        continue
    
    # Extract image path
    image_filename = product['image'].split('/')[-1]
    image_path = f"public/images/vendors/teva-deli/{{image_filename}}"
    
    if not Path(image_path).exists():
        print(f"  ⚠️  Image not found: {{image_path}}")
        continue
    
    # Analyze image
    analysis = analyzer.analyze_product_image(
        image_path, 
        product['name'], 
        product.get('nameHe', '')
    )
    
    # Generate enhanced description
    enhanced_data = analyzer.generate_product_description(analysis, product)
    
    # Combine with original product data
    result = {{
        'product_id': product['id'],
        'product_name': product['name'],
        'product_name_he': product.get('nameHe', ''),
        'current_description': product.get('description', ''),
        'category': product['category'],
        'price': product.get('price', 0),
        'image': product['image'],
        'analysis': analysis,
        **enhanced_data
    }}
    
    results[product['id']] = result
    
    # Save progress every 5 products
    if (i + 1) % 5 == 0:
        analyzer.save_results(results, "qwen_product_analysis_progress.json")
        print(f"  💾 Progress saved ({{len(results)}} total)")

# Save final results
analyzer.save_results(results, "qwen_complete_product_analysis.json")
print(f"\\n✅ Analysis complete! Total products analyzed: {{len(results)}}")
'''
    
    with open('resume_analysis.py', 'w') as f:
        f.write(script)
    
    os.chmod('resume_analysis.py', 0o755)

def main():
    print("🔄 Resume Product Analysis System")
    print("=" * 60)
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    # Check existing progress
    analyzed_ids = check_existing_progress()
    
    # Load all products
    all_products = load_all_products()
    print(f"📦 Total products in catalog: {len(all_products)}")
    
    # Find remaining products
    remaining_products = [p for p in all_products if p['id'] not in analyzed_ids]
    print(f"📋 Remaining to analyze: {len(remaining_products)}")
    
    if not remaining_products:
        print("\n✅ All products have been analyzed!")
        print("Run the complete update system to generate reports and apply changes.")
        return
    
    # Create resume script
    create_resume_script(remaining_products)
    
    print("\n🚀 Starting resumed analysis...")
    
    # Run the resume script
    result = subprocess.run([sys.executable, 'resume_analysis.py'], 
                           capture_output=True, text=True)
    
    if result.returncode == 0:
        print(result.stdout)
        print("\n✅ Resume completed successfully!")
        
        # Check if all products are now analyzed
        if Path("qwen_complete_product_analysis.json").exists():
            print("\n🎉 All products have been analyzed!")
            print("Next steps:")
            print("1. Run: python3 complete-product-update-system.py")
            print("   (Skip step 1, go directly to step 2)")
    else:
        print(f"❌ Error during resume: {result.stderr}")

if __name__ == "__main__":
    main()