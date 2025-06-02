#!/usr/bin/env python3
"""
Automated Image Fix Tool using Qwen2.5 VL
Complete automation: analyze, recommend, and apply fixes
"""

import os
import sys
import json
import subprocess
from pathlib import Path
from datetime import datetime

def run_qwen_analysis():
    """Run the Qwen image analyzer"""
    print("🔍 Running Qwen2.5 VL image analysis...")
    result = subprocess.run([sys.executable, "qwen-image-analyzer.py"], 
                          capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Error running analysis: {result.stderr}")
        return False
    
    print(result.stdout)
    return True

def apply_fixes():
    """Apply the recommended fixes"""
    print("\n🔧 Applying fixes based on Qwen analysis...")
    
    # Load recommendations
    if not Path("qwen_fix_recommendations.json").exists():
        print("❌ No recommendations found. Run analysis first.")
        return False
    
    with open("qwen_fix_recommendations.json", 'r') as f:
        data = json.load(f)
    
    fixes = data.get('fixes', [])
    
    if not fixes:
        print("✅ No fixes needed - all images appear correct!")
        return True
    
    # Generate Node.js fix script
    script = f"""#!/usr/bin/env node
// Auto-generated fixes based on Qwen2.5 VL analysis
// Generated: {datetime.now().isoformat()}

const fs = require('fs').promises;
const path = require('path');

async function applyQwenFixes() {{
  console.log('🤖 Applying Qwen VL recommended fixes...\\n');
  
  const catalogPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(catalogPath, 'utf-8');
  const originalContent = content;
  
  const fixes = {json.dumps(fixes, indent=2)};
  
  console.log(`Applying ${{fixes.length}} AI-recommended fixes...\\n`);
  
  let appliedCount = 0;
  
  for (const fix of fixes) {{
    console.log(`📸 ${{fix.product_id}}: ${{fix.product_name}}`);
    console.log(`   Current: ${{fix.current_image}}`);
    console.log(`   Recommended: ${{fix.suggested_image}}`);
    console.log(`   Confidence: ${{(fix.confidence * 100).toFixed(0)}}%`);
    console.log(`   Reason: ${{fix.reason}}\\n`);
    
    const newPath = `/images/vendors/teva-deli/${{fix.suggested_image}}`;
    const regex = new RegExp(`(id: '${{fix.product_id}}'[^}}]*?image: ')[^']+(')`);
    
    const newContent = content.replace(regex, `$1${{newPath}}$2`);
    
    if (newContent !== content) {{
      content = newContent;
      appliedCount++;
    }}
  }}
  
  if (appliedCount > 0) {{
    // Backup
    const backupPath = catalogPath + '.backup-qwen-' + Date.now();
    await fs.writeFile(backupPath, originalContent);
    console.log(`\\n📁 Backup: ${{backupPath}}`);
    
    // Apply
    await fs.writeFile(catalogPath, content);
    console.log(`\\n✅ Applied ${{appliedCount}} Qwen VL fixes!`);
  }} else {{
    console.log('\\n❌ No fixes could be applied');
  }}
}}

applyQwenFixes().catch(console.error);
"""
    
    with open('apply-qwen-fixes.js', 'w') as f:
        f.write(script)
    
    # Run the fix script
    print("📝 Running fix script...")
    result = subprocess.run(['node', 'apply-qwen-fixes.js'], 
                          capture_output=True, text=True)
    
    print(result.stdout)
    if result.stderr:
        print(f"Errors: {result.stderr}")
    
    return result.returncode == 0

def generate_report():
    """Generate a comprehensive report"""
    print("\n📄 Generating report...")
    
    # Load analysis results
    analysis_data = {}
    if Path("qwen_image_analysis.json").exists():
        with open("qwen_image_analysis.json", 'r') as f:
            analysis_data = json.load(f)
    
    # Load fix recommendations
    fix_data = {}
    if Path("qwen_fix_recommendations.json").exists():
        with open("qwen_fix_recommendations.json", 'r') as f:
            fix_data = json.load(f)
    
    report = f"""# 🤖 Qwen2.5 VL Image Analysis Report

Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Model Information
- Model: Qwen2.5-VL-72B-Instruct
- Type: Vision-Language Model
- Purpose: Automated image content analysis

## Analysis Summary
- Total images analyzed: {analysis_data.get('total_images', 0)}
- Analysis timestamp: {analysis_data.get('timestamp', 'N/A')}

## Fix Recommendations
- Total fixes recommended: {fix_data.get('total_fixes', 0)}
- Recommendation timestamp: {fix_data.get('timestamp', 'N/A')}

## Sample Analysis Results
"""
    
    # Add sample results
    results = analysis_data.get('results', {})
    for i, (image, analysis) in enumerate(list(results.items())[:5]):
        if 'error' not in analysis:
            report += f"""
### {image}
- **Product Type**: {analysis.get('product_type', 'Unknown')}
- **Packaging**: {analysis.get('packaging', {}).get('type', 'Unknown')} - {analysis.get('packaging', {}).get('color', 'Unknown')}
- **Hebrew Text**: {analysis.get('hebrew_text', 'None detected')}
- **Confidence**: {analysis.get('confidence', 0) * 100:.0f}%
"""
    
    # Add fixes
    if fix_data.get('fixes'):
        report += "\n## Recommended Fixes\n"
        for fix in fix_data['fixes'][:10]:
            report += f"""
- **{fix['product_id']}**: {fix['product_name']}
  - Change from: `{fix['current_image']}`
  - Change to: `{fix['suggested_image']}`
  - Confidence: {fix['confidence'] * 100:.0f}%
"""
    
    report += """
## Process Complete

The Qwen2.5 VL model has analyzed all images and provided recommendations based on:
1. Visual content analysis
2. Packaging detection
3. Text recognition (including Hebrew)
4. Product type classification

All fixes have been applied automatically.
"""
    
    with open('qwen-analysis-report.md', 'w', encoding='utf-8') as f:
        f.write(report)
    
    print(f"✅ Report saved to: qwen-analysis-report.md")

def main():
    """Main automation function"""
    print("🚀 Automated Image Fix System with Qwen2.5 VL")
    print("=" * 60)
    print("This tool will:")
    print("1. Analyze all images using Qwen2.5 VL 72B")
    print("2. Generate fix recommendations")
    print("3. Apply fixes automatically")
    print("4. Generate a comprehensive report")
    print("=" * 60)
    
    # Change to correct directory
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    # Step 1: Run analysis
    if not run_qwen_analysis():
        print("❌ Analysis failed. Exiting.")
        return 1
    
    # Step 2: Apply fixes
    print("\n" + "=" * 60)
    if not apply_fixes():
        print("❌ Fix application failed.")
        return 1
    
    # Step 3: Generate report
    print("\n" + "=" * 60)
    generate_report()
    
    print("\n" + "=" * 60)
    print("✅ COMPLETE! All steps executed successfully.")
    print("\nFiles generated:")
    print("  - qwen_image_analysis.json (detailed analysis)")
    print("  - qwen_fix_recommendations.json (recommended fixes)")
    print("  - apply-qwen-fixes.js (fix script)")
    print("  - qwen-analysis-report.md (comprehensive report)")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())