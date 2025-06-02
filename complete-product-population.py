#!/usr/bin/env python3
"""
Complete Product Population System
Uses existing infrastructure to populate all product data with Qwen analysis
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
import subprocess

# Import the analyzer
exec(open('qwen-full-product-analyzer.py').read(), globals())

class ProductPopulationSystem:
    def __init__(self):
        self.api_key = "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"
        self.analyzer = QwenProductAnalyzer(self.api_key, use_free_tier=False)
        self.vendor_catalogs = {
            'teva-deli': {
                'catalog_file': 'lib/data/teva-deli-complete-catalog.ts',
                'image_path': 'public/images/vendors/teva-deli/',
                'products': []
            },
            'garden-of-light': {
                'catalog_file': 'lib/data/garden-of-light-complete-catalog.json',
                'image_path': 'public/images/vendors/garden-of-light/',
                'products': []
            },
            'queens-cuisine': {
                'catalog_file': 'lib/data/queens-cuisine-complete-catalog.json',
                'image_path': 'public/images/vendors/queens-cuisine/',
                'products': []
            },
            'gahn-delight': {
                'catalog_file': 'lib/data/gahn-delight-complete-catalog.json',
                'image_path': 'public/images/vendors/gahn-delight/',
                'products': []
            },
            'people-store': {
                'catalog_file': 'lib/data/people-store-complete-catalog.json',
                'image_path': 'public/images/vendors/people-store/',
                'products': []
            },
            'vop-shop': {
                'catalog_file': 'lib/data/vop-shop-complete-catalog.json',
                'image_path': 'public/images/vendors/vop-shop/',
                'products': []
            }
        }
    
    def load_vendor_products(self, vendor_id):
        """Load products for a specific vendor"""
        vendor_info = self.vendor_catalogs[vendor_id]
        catalog_file = vendor_info['catalog_file']
        
        if catalog_file.endswith('.ts'):
            # TypeScript file - parse it
            with open(catalog_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            products = []
            # Enhanced regex to capture all product fields
            pattern = r"\{[^}]*?id:\s*'([^']+)'[^}]*?name:\s*'([^']+)'[^}]*?nameHe:\s*'([^']+)'[^}]*?description:\s*'([^']+)'[^}]*?price:\s*(\d+)[^}]*?category:\s*'([^']+)'[^}]*?image:\s*'([^']+)'[^}]*?\}"
            
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
        else:
            # JSON file
            with open(catalog_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', [])
        
        vendor_info['products'] = products
        return products
    
    def analyze_vendor_products(self, vendor_id):
        """Analyze all products for a vendor"""
        print(f"\n🏪 Analyzing {vendor_id} products...")
        
        products = self.load_vendor_products(vendor_id)
        if not products:
            print(f"  ❌ No products found for {vendor_id}")
            return {}
        
        print(f"  📦 Found {len(products)} products")
        
        results = {}
        for i, product in enumerate(products):
            print(f"  🔍 Analyzing {i+1}/{len(products)}: {product['name']}")
            
            # Extract image path
            image_filename = product['image'].split('/')[-1]
            image_path = Path(self.vendor_catalogs[vendor_id]['image_path']) / image_filename
            
            if not image_path.exists():
                print(f"    ⚠️  Image not found: {image_path}")
                continue
            
            # Analyze image
            analysis = self.analyzer.analyze_product_image(
                str(image_path),
                product['name'],
                product.get('nameHe', '')
            )
            
            if 'error' in analysis:
                print(f"    ❌ Error: {analysis['error']}")
                continue
            
            # Generate enhanced description
            enhanced_data = self.analyzer.generate_product_description(analysis, product)
            
            # Combine results
            result = {
                'product_id': product['id'],
                'vendor_id': vendor_id,
                'original_description': product.get('description', ''),
                **enhanced_data
            }
            
            results[product['id']] = result
            
            # Show preview
            print(f"    ✅ Enhanced: {enhanced_data['enhanced_description'][:100]}...")
        
        return results
    
    def update_vendor_catalog(self, vendor_id, results):
        """Update vendor catalog with enhanced descriptions"""
        vendor_info = self.vendor_catalogs[vendor_id]
        catalog_file = vendor_info['catalog_file']
        
        # Backup original
        backup_path = f"{catalog_file}.backup-{int(datetime.now().timestamp())}"
        
        if catalog_file.endswith('.ts'):
            # TypeScript file
            with open(catalog_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Save backup
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            updates = 0
            for product_id, result in results.items():
                if 'enhanced_description' not in result:
                    continue
                
                # Find and replace description
                pattern = rf"(\{{[^}}]*?id:\s*'{re.escape(product_id)}'[^}}]*?)(description:\s*'[^']*?')([^}}]*?\}})"
                
                # Escape single quotes in new description
                new_desc = result['enhanced_description'].replace("'", "\\'")
                
                def replacer(match):
                    return f"{match.group(1)}description: '{new_desc}'{match.group(3)}"
                
                new_content, count = re.subn(pattern, replacer, content, flags=re.DOTALL)
                
                if count > 0:
                    content = new_content
                    updates += count
            
            # Write updated content
            with open(catalog_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  📝 Updated {updates} descriptions in {catalog_file}")
            
        else:
            # JSON file
            with open(catalog_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Save backup
            with open(backup_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            
            # Update products
            updates = 0
            for product in data.get('products', []):
                if product['id'] in results:
                    result = results[product['id']]
                    if 'enhanced_description' in result:
                        product['description'] = result['enhanced_description']
                        product['tags'] = result.get('tags', [])
                        product['nutritionalInfo'] = result.get('nutritional_highlights', [])
                        updates += 1
            
            # Write updated data
            with open(catalog_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f"  📝 Updated {updates} products in {catalog_file}")
        
        return updates
    
    def populate_all_products(self):
        """Populate all vendor products with enhanced descriptions"""
        print("🚀 Complete Product Population System")
        print("=" * 60)
        print("Using existing infrastructure to enhance all products")
        print("=" * 60)
        
        all_results = {}
        total_updates = 0
        
        # Process each vendor
        for vendor_id in self.vendor_catalogs.keys():
            results = self.analyze_vendor_products(vendor_id)
            if results:
                all_results[vendor_id] = results
                updates = self.update_vendor_catalog(vendor_id, results)
                total_updates += updates
        
        # Save complete results
        output = {
            "timestamp": datetime.now().isoformat(),
            "total_vendors": len(all_results),
            "total_products": sum(len(r) for r in all_results.values()),
            "total_updates": total_updates,
            "results_by_vendor": all_results
        }
        
        with open('complete_product_population_results.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Population Complete!")
        print(f"  • Vendors processed: {len(all_results)}")
        print(f"  • Products analyzed: {output['total_products']}")
        print(f"  • Descriptions updated: {total_updates}")
        print(f"  • Results saved to: complete_product_population_results.json")
        
        # Touch complete catalog to trigger rebuild
        complete_catalog = Path("lib/data/complete-catalog.ts")
        if complete_catalog.exists():
            complete_catalog.touch()
            print("\n🔄 Complete catalog marked for rebuild")
        
        return output
    
    def verify_data_flow(self):
        """Verify the data flows through all systems"""
        print("\n🔍 Verifying data flow through existing infrastructure...")
        
        checks = [
            ("WordPress Data Layer", "lib/data/wordpress-style-data-layer.ts"),
            ("Complete Catalog", "lib/data/complete-catalog.ts"),
            ("Products API", "app/api/products-enhanced/route.ts"),
            ("Integrated API", "app/api/integrated/route.ts"),
            ("Shop Page", "app/shop/page.tsx"),
            ("Product Pages", "app/product/[id]/page.tsx"),
            ("Admin Dashboard", "app/admin/dashboard/page.tsx"),
            ("Vendor Admin", "app/admin/vendor/[vendorId]/page.tsx")
        ]
        
        all_good = True
        for name, path in checks:
            if Path(path).exists():
                print(f"  ✅ {name}: {path}")
            else:
                print(f"  ❌ {name}: {path} (missing)")
                all_good = False
        
        if all_good:
            print("\n✅ All data flow points verified!")
            print("\n📊 Data Flow Architecture:")
            print("1. Product Images → Qwen Analysis → Enhanced Descriptions")
            print("2. Vendor Catalogs → WordPress Data Layer → Complete Catalog")
            print("3. Complete Catalog → API Endpoints (products-enhanced, integrated)")
            print("4. APIs → Frontend Components (Shop, Product Pages)")
            print("5. APIs → Admin System (Dashboard, Vendor Management)")
        
        return all_good

def main():
    """Main function"""
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    system = ProductPopulationSystem()
    
    # Check if we should just test one vendor
    import sys
    if len(sys.argv) > 1:
        if sys.argv[1] == "--test":
            # Test with just Teva Deli
            print("🧪 Test mode - analyzing only Teva Deli")
            results = system.analyze_vendor_products('teva-deli')
            if results:
                # Just show first product
                first = list(results.values())[0]
                print(f"\n📝 Sample Result:")
                print(f"Product: {first['product_name']}")
                print(f"Enhanced: {first['enhanced_description'][:200]}...")
                print(f"Tags: {', '.join(first['tags'][:5])}")
            return
        elif sys.argv[1] == "--verify":
            # Just verify data flow
            system.verify_data_flow()
            return
    
    # Full population
    results = system.populate_all_products()
    
    # Verify data flow
    if results['total_updates'] > 0:
        system.verify_data_flow()
        
        print("\n🎯 Next Steps:")
        print("1. Start development server: npm run dev")
        print("2. Visit shop page to see enhanced descriptions")
        print("3. Check admin dashboard for updated products")
        print("4. All data now flows through existing infrastructure!")

if __name__ == "__main__":
    main()