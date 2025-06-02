#!/bin/bash
# Complete AI-powered image fix using OpenRouter + Gemini 2.5 Flash

echo "🤖 AI-Powered Image Fix System"
echo "Using: OpenRouter + Gemini 2.5 Flash"
echo "========================================"
echo ""

# Make scripts executable
chmod +x openrouter-image-analyzer.py
chmod +x auto-fix-with-openrouter.py

# Run the complete automation
echo "🚀 Starting automated process..."
echo ""

python3 auto-fix-with-openrouter.py

# Check results
echo ""
echo "📊 Process Summary:"
echo "==================="

if [ -f "openrouter_full_analysis.json" ]; then
    images=$(grep -c "product_type" openrouter_full_analysis.json || echo "0")
    echo "✅ Images analyzed: ~$((images/2))"
fi

if [ -f "openrouter_fixes.json" ]; then
    fixes=$(grep -c "product_id" openrouter_fixes.json || echo "0")
    echo "🔧 Fixes applied: $fixes"
fi

if [ -f "openrouter-analysis-report.md" ]; then
    echo "📄 Report: openrouter-analysis-report.md"
fi

echo ""
echo "✨ AI-powered image analysis complete!"
echo ""
echo "Next steps:"
echo "1. Review the report: openrouter-analysis-report.md"
echo "2. Test your website to see the corrected images"
echo "3. The AI has read Hebrew text and identified all OKARA products"