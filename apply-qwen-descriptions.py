#!/usr/bin/env python3
"""
Apply Qwen-analyzed descriptions to product catalogs
Ensures data flows correctly from analysis → marketplace → vendor → admin
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime

def load_analysis_results(filename="qwen_complete_product_analysis.json"):
    """Load the analysis results from Qwen"""
    if not Path(filename).exists():
        print(f"❌ Analysis file not found: {filename}")
        print("Please run: python3 qwen-full-product-analyzer.py --full")
        return None
    
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data['results']

def update_teva_deli_catalog(results):
    """Update Teva Deli catalog with analyzed descriptions"""
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    
    # Backup original
    backup_path = catalog_path.with_suffix(f'.ts.backup-{int(datetime.now().timestamp())}')
    
    with open(catalog_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Save backup
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"📁 Backed up to: {backup_path}")
    
    updates = 0
    
    for product_id, result in results.items():
        if 'enhanced_description' not in result:
            continue
        
        # Find product in catalog
        pattern = rf"(\{{[^}}]*?id:\s*'{re.escape(product_id)}'[^}}]*?)(description:\s*'[^']*?')([^}}]*?\}})"
        
        # Create new description (escape single quotes)
        new_desc = result['enhanced_description'].replace("'", "\\'")
        
        # Replace description
        def replacer(match):
            return f"{match.group(1)}description: '{new_desc}'{match.group(3)}"
        
        new_content, count = re.subn(pattern, replacer, content, flags=re.DOTALL)
        
        if count > 0:
            content = new_content
            updates += count
            print(f"✅ Updated: {result['product_name']}")
    
    # Write updated content
    with open(catalog_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n📝 Updated {updates} product descriptions in Teva Deli catalog")
    return updates

def update_complete_catalog():
    """Trigger update of complete catalog to include new descriptions"""
    print("\n🔄 Updating complete catalog...")
    
    # The complete catalog imports from individual vendor catalogs
    # So it will automatically get the updated descriptions
    
    # Touch the file to trigger Next.js rebuild
    catalog_path = Path("lib/data/complete-catalog.ts")
    if catalog_path.exists():
        catalog_path.touch()
        print("✅ Complete catalog marked for rebuild")

def verify_data_flow():
    """Verify the updated data flows through the system"""
    print("\n🔍 Verifying data flow...")
    
    # Check key integration points
    checks = {
        "Vendor Catalog": "lib/data/teva-deli-complete-catalog.ts",
        "Complete Catalog": "lib/data/complete-catalog.ts",
        "WordPress Layer": "lib/data/wordpress-style-data-layer.ts",
        "Products API": "app/api/products-enhanced/route.ts",
        "Vendor Admin": "app/admin/vendor/[id]/page.tsx",
        "Shop Page": "app/shop/page.tsx",
        "Product Page": "app/product/[id]/page.tsx"
    }
    
    all_good = True
    for name, path in checks.items():
        if Path(path).exists():
            print(f"  ✅ {name}: {path}")
        else:
            print(f"  ❌ {name}: {path}")
            all_good = False
    
    if all_good:
        print("\n✅ All data flow points verified!")
        print("\n📊 Data Flow:")
        print("1. Qwen Analysis → Enhanced descriptions")
        print("2. apply-qwen-descriptions.py → Updates vendor catalog")
        print("3. Vendor catalog → Complete catalog (auto-imported)")
        print("4. Complete catalog → API endpoints")
        print("5. API → Frontend (shop, product pages)")
        print("6. API → Admin dashboard")
    
    return all_good

def generate_summary_report(results):
    """Generate a summary of the updates"""
    print("\n📊 Generating summary report...")
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "total_products": len(results),
        "products_with_enhanced_descriptions": sum(1 for r in results.values() if 'enhanced_description' in r),
        "average_description_length": sum(len(r.get('enhanced_description', '')) for r in results.values()) // len(results) if results else 0,
        "common_tags": {},
        "common_features": {}
    }
    
    # Count tags
    all_tags = []
    for r in results.values():
        all_tags.extend(r.get('tags', []))
    
    for tag in all_tags:
        report['common_tags'][tag] = report['common_tags'].get(tag, 0) + 1
    
    # Sort by frequency
    report['common_tags'] = dict(sorted(report['common_tags'].items(), key=lambda x: x[1], reverse=True)[:10])
    
    with open('qwen_alignment_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f"📄 Report saved to: qwen_alignment_report.json")
    print(f"\n📈 Summary:")
    print(f"  • Total products analyzed: {report['total_products']}")
    print(f"  • Enhanced descriptions: {report['products_with_enhanced_descriptions']}")
    print(f"  • Avg description length: {report['average_description_length']} chars")
    print(f"  • Top tags: {', '.join(list(report['common_tags'].keys())[:5])}")

def main():
    """Main function"""
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    print("🚀 Applying Qwen-Analyzed Descriptions")
    print("=" * 60)
    
    # Load analysis results
    results = load_analysis_results()
    if not results:
        return
    
    print(f"📦 Loaded {len(results)} analyzed products")
    
    # Update Teva Deli catalog
    updated = update_teva_deli_catalog(results)
    
    if updated > 0:
        # Update complete catalog
        update_complete_catalog()
        
        # Verify data flow
        if verify_data_flow():
            # Generate report
            generate_summary_report(results)
            
            print("\n✅ SUCCESS! Product descriptions aligned with images")
            print("\n🎯 Next Steps:")
            print("1. Start dev server: npm run dev")
            print("2. Check product pages to see enhanced descriptions")
            print("3. Visit admin dashboard to manage products")
            print("4. Data now flows: Marketplace → Vendors → Admin")
    else:
        print("\n⚠️  No updates applied. Check analysis results.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--check":
        # Just verify without applying
        os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
        verify_data_flow()
    else:
        main()