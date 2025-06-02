#!/bin/bash
# OpenRouter Gemini 2.5 Flash Image Fix Tool

echo "🤖 OpenRouter + Gemini 2.5 Flash Image Analysis"
echo "=============================================="
echo ""

# Make scripts executable
chmod +x openrouter-image-analyzer.py

# Test with 5 images first
echo "📸 Testing with 5 images first..."
python3 openrouter-image-analyzer.py

# Check if test results exist
if [ -f "openrouter_test_results.json" ]; then
    echo ""
    echo "✅ Test complete! Check openrouter_test_results.json"
    echo ""
    echo "To analyze ALL images, run:"
    echo "  python3 openrouter-image-analyzer.py --full"
    echo ""
    echo "This will:"
    echo "  1. Analyze all 48 Teva Deli images"
    echo "  2. Use Gemini 2.5 Flash vision AI"
    echo "  3. Generate fix recommendations"
    echo "  4. Save results to openrouter_full_analysis.json"
else
    echo "❌ Test failed - check errors above"
fi