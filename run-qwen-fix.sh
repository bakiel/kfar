#!/bin/bash
# Complete AI fix using Qwen2.5 VL 72B via OpenRouter

echo "🤖 Qwen2.5 VL 72B Image Analysis System"
echo "Advanced AI with Hebrew text recognition"
echo "========================================"
echo ""

# Make scripts executable
chmod +x qwen-openrouter-analyzer.py

# Check if we should run test or full
if [ "$1" == "--full" ]; then
    echo "🚀 Running FULL analysis on all 48 images..."
    echo "This may take a few minutes..."
    echo ""
    
    python3 qwen-openrouter-analyzer.py --full
    
    if [ -f "qwen_full_analysis.json" ]; then
        echo ""
        echo "✅ Analysis complete!"
        echo ""
        echo "📊 Results:"
        images=$(grep -c "product_type" qwen_full_analysis.json || echo "0")
        okara=$(grep -c '"is_okara": true' qwen_full_analysis.json || echo "0")
        echo "  - Images analyzed: ~$((images/2))"
        echo "  - OKARA products found: $okara"
        echo ""
        echo "📄 Full results: qwen_full_analysis.json"
    fi
    
else
    echo "📸 Running test with 3 images..."
    echo ""
    
    python3 qwen-openrouter-analyzer.py
    
    echo ""
    echo "💡 Test complete! To analyze ALL images:"
    echo ""
    echo "  ./run-qwen-fix.sh --full"
    echo ""
    echo "Qwen2.5 VL 72B features:"
    echo "  ✅ Advanced vision understanding"
    echo "  ✅ Hebrew text recognition"
    echo "  ✅ OKARA product detection"
    echo "  ✅ 72 billion parameters"
fi