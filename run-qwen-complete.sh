#!/bin/bash
# Complete Qwen2.5 VL 72B FREE automated image fix

echo "🤖 Qwen2.5 VL 72B Image Fix System (FREE)"
echo "=========================================="
echo "✅ Using FREE tier with your API key"
echo "✅ 72 billion parameter vision model"
echo "✅ Hebrew text recognition"
echo "✅ OKARA product detection"
echo ""

# Make scripts executable
chmod +x qwen-openrouter-analyzer.py
chmod +x qwen-auto-fix.py

# Run complete automation
echo "🚀 Starting automated analysis and fix..."
echo ""

python3 qwen-auto-fix.py

# Summary
echo ""
echo "📊 Process Summary:"
echo "==================="

if [ -f "qwen_full_analysis.json" ]; then
    images=$(grep -c "product_type" qwen_full_analysis.json 2>/dev/null || echo "0")
    okara=$(grep -c '"is_okara": true' qwen_full_analysis.json 2>/dev/null || echo "0")
    echo "✅ Images analyzed: ~$((images/2))"
    echo "✅ OKARA products found: $okara"
fi

if [ -f "qwen_fixes.json" ]; then
    fixes=$(grep -c "product_id" qwen_fixes.json 2>/dev/null || echo "0")
    echo "🔧 Fixes applied: $fixes"
fi

echo ""
echo "📄 Reports generated:"
echo "  - qwen_full_analysis.json (detailed AI analysis)"
echo "  - qwen_fixes.json (recommended fixes)"
echo "  - qwen-analysis-report.md (summary report)"
echo ""
echo "✨ Qwen2.5 VL 72B FREE analysis complete!"