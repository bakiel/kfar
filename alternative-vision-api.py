#!/usr/bin/env python3
"""
Alternative Vision API Solutions
Free and accessible options for image analysis
"""

import base64
import json
from pathlib import Path

def create_local_vision_analyzer():
    """Create a local solution using image filenames and patterns"""
    
    print("🔍 Local Vision Analysis System")
    print("=" * 50)
    print("Analyzing images based on filenames and patterns...\n")
    
    image_dir = Path("public/images/vendors/teva-deli")
    
    # Known patterns from filenames
    patterns = {
        'burger_schnitzel': ['burger', 'schnitzel', 'patty', 'cutlet'],
        'shawarma_kebab': ['shawarma', 'kebab', 'skewer', 'grill'],
        'seitan_tofu': ['seitan', 'tofu', 'protein'],
        'specialty': ['kubeh', 'meatball', 'special'],
        'meat_alternative': ['meat', 'alternative', 'vegan']
    }
    
    # Specific knowledge about image numbers
    image_knowledge = {
        '01': 'schnitzel cutlets',
        '02': 'schnitzel product',
        '03': 'crispy/specialty item',
        '04': 'meat alternative',
        '05': 'strips/sliced product',
        '06': 'meatballs/round items',
        '07': 'deli product',
        '08': 'meat alternative',
        '09': 'schnitzel strips',
        '10': 'tofu package',
        '11': 'sausage/hot dogs',
        '12': 'tofu block',
        '13': 'tofu/seitan product',
        '14': 'seitan bacon/strips',
        '15': 'tofu slices',
        '16': 'seitan sausage',
        '17': 'BBQ product',
        '18': 'BBQ ribs',
        '19': 'herb cutlets',
        '20': 'tofu scramble',
        '21': 'OKARA green box',
        '22': 'OKARA with broccoli',
        '23': 'OKARA/ground product',
        '24': 'burger with grains',
        '25': 'herb schnitzel',
        '26': 'black bean burger',
        '27': 'mini burgers',
        '28': 'special burger',
        '29': 'quinoa burger',
        '30': 'sesame schnitzel',
        '31': 'salami/deli roll',
        '32': 'kebab/skewers',
        '33': 'sliced seitan',
        '34': 'kebab product',
        '35': 'shawarma',
        '36': 'persian kebabs',
        '37': 'chicken-style shawarma',
        '38': 'mixed grill',
        '39': 'bologna',
        '40': 'shish tawook',
        '41': 'round seitan',
        '42': 'party pack',
        '43': 'merguez sausage'
    }
    
    results = {}
    
    for image_path in image_dir.glob("*.jpg"):
        filename = image_path.name
        
        # Extract number from filename
        import re
        num_match = re.search(r'_(\d+)_', filename)
        num = num_match.group(1) if num_match else None
        
        # Determine category from filename
        category = 'unknown'
        for pattern, keywords in patterns.items():
            if any(keyword in filename.lower() for keyword in keywords):
                category = pattern
                break
        
        # Get specific knowledge
        product_type = image_knowledge.get(num, 'unknown')
        
        # Special cases
        is_okara = num in ['21', '22', '23']
        is_tofu = num in ['10', '12', '13', '15', '20'] or 'tofu' in product_type
        is_schnitzel = num in ['01', '02', '09', '25', '30'] or 'schnitzel' in product_type
        is_shawarma_kebab = int(num) >= 31 if num else False
        
        results[filename] = {
            'number': num,
            'category_from_filename': category,
            'known_content': product_type,
            'is_okara': is_okara,
            'is_tofu': is_tofu,
            'is_schnitzel': is_schnitzel,
            'is_shawarma_kebab': is_shawarma_kebab,
            'packaging_hint': 'green box' if is_okara else 'standard'
        }
    
    # Save results
    with open('local_vision_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"✅ Analyzed {len(results)} images")
    print("\n📊 Summary:")
    print(f"  - OKARA products: {sum(1 for r in results.values() if r['is_okara'])}")
    print(f"  - Tofu products: {sum(1 for r in results.values() if r['is_tofu'])}")
    print(f"  - Schnitzel products: {sum(1 for r in results.values() if r['is_schnitzel'])}")
    print(f"  - Shawarma/Kebab: {sum(1 for r in results.values() if r['is_shawarma_kebab'])}")
    
    return results

def generate_fixes_from_local_analysis():
    """Generate fixes based on local analysis"""
    
    # Load local analysis
    with open('local_vision_analysis.json', 'r') as f:
        analysis = json.load(f)
    
    # Load products (simplified)
    from pathlib import Path
    import re
    
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    with open(catalog_path, 'r') as f:
        content = f.read()
    
    # Extract products
    products = []
    pattern = r"id: '([^']+)'.*?name: '([^']+)'.*?image: '([^']+)'"
    matches = re.findall(pattern, content, re.DOTALL)
    
    for match in matches:
        products.append({
            'id': match[0],
            'name': match[1],
            'current_image': match[2].split('/')[-1]
        })
    
    # Generate fixes
    fixes = []
    
    for product in products:
        name_lower = product['name'].lower()
        current_image = product['current_image']
        current_analysis = analysis.get(current_image, {})
        
        # Check for mismatches
        if 'okara' in name_lower and not current_analysis.get('is_okara'):
            # Find an OKARA image
            for img, data in analysis.items():
                if data['is_okara'] and img != current_image:
                    fixes.append({
                        'product_id': product['id'],
                        'product_name': product['name'],
                        'current': current_image,
                        'suggested': img,
                        'reason': 'OKARA product should use OKARA image (green box)'
                    })
                    break
        
        elif 'schnitzel' in name_lower and not current_analysis.get('is_schnitzel'):
            # Find a schnitzel image
            for img, data in analysis.items():
                if data['is_schnitzel'] and img != current_image:
                    fixes.append({
                        'product_id': product['id'],
                        'product_name': product['name'],
                        'current': current_image,
                        'suggested': img,
                        'reason': 'Schnitzel product should use schnitzel image'
                    })
                    break
    
    # Save fixes
    with open('local_vision_fixes.json', 'w') as f:
        json.dump({
            'timestamp': str(Path('').stat().st_mtime),
            'method': 'local pattern analysis',
            'fixes': fixes
        }, f, indent=2)
    
    print(f"\n🔧 Generated {len(fixes)} fix recommendations")
    print("Saved to: local_vision_fixes.json")

def main():
    print("🤖 Alternative Vision Analysis System")
    print("Using local pattern matching since API keys are invalid\n")
    
    # Run local analysis
    results = create_local_vision_analyzer()
    
    # Generate fixes
    generate_fixes_from_local_analysis()
    
    print("\n✅ Complete! Check local_vision_analysis.json for details")
    print("\n💡 Note: This uses filename patterns and known image content")
    print("For true vision analysis, you'll need:")
    print("1. Valid SiliconFlow API key for Qwen")
    print("2. Or use Google Cloud Vision API")
    print("3. Or use OpenAI Vision API")
    print("4. Or use Anthropic Claude Vision API")

if __name__ == "__main__":
    main()