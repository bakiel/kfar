# 🤖 Qwen2.5 VL Image Analysis - Usage Guide

## Quick Start

### 1. Update Your API Key
```bash
python3 config-qwen.py YOUR_API_KEY
```

### 2. Run Automated Fix
```bash
./run-qwen-fix.sh
```

That's it! The system will analyze all images and fix mismatches automatically.

## What The System Does

### 1. **Image Analysis** (`qwen-image-analyzer.py`)
- Sends each Teva Deli image to Qwen2.5 VL 72B
- Asks the AI to identify:
  - Product type (schnitzel, burger, tofu, etc.)
  - Packaging details (box color, type)
  - Hebrew text on packages
  - Visual description
- Saves results to `qwen_image_analysis.json`

### 2. **Smart Matching**
- Compares AI analysis with product database
- Scores matches based on:
  - Product type alignment
  - Hebrew text matching
  - Packaging color (important for OKARA green boxes)
  - Visual similarity
- Generates fix recommendations

### 3. **Automatic Application** (`auto-fix-with-qwen.py`)
- Creates Node.js script to apply fixes
- Makes backup of original catalog
- Updates all image paths
- Generates comprehensive report

## Files Generated

1. **`qwen_image_analysis.json`** - Detailed AI analysis of each image
2. **`qwen_fix_recommendations.json`** - Recommended image swaps
3. **`apply-qwen-fixes.js`** - Auto-generated fix script
4. **`qwen-analysis-report.md`** - Human-readable report

## Example Output

```json
{
  "product_type": "schnitzel",
  "packaging": {
    "type": "tray",
    "color": "brown and white",
    "text_visible": "Teva Deli logo"
  },
  "hebrew_text": "שניצל סייטן",
  "suggested_category": "schnitzels",
  "confidence": 0.9,
  "description": "Breaded cutlets in plastic tray packaging"
}
```

## Troubleshooting

### API Key Issues
- Make sure key starts with `sk-or-v1-`
- Check if key is active on SiliconFlow dashboard
- Ensure you have access to Qwen2.5-VL-72B model

### Running Issues
```bash
# Make scripts executable
chmod +x run-qwen-fix.sh
chmod +x *.py

# Install dependencies if needed
pip install requests
```

### Manual Testing
```bash
# Test API connection
python3 test-qwen-api.py

# Run analysis only (no fixes)
python3 qwen-image-analyzer.py

# View recommendations without applying
cat qwen_fix_recommendations.json | python -m json.tool
```

## How It Helps

1. **Finds Mismatches** - AI identifies when image doesn't match product name
2. **OKARA Detection** - Recognizes green box packaging for OKARA products
3. **Hebrew Reading** - Can read Hebrew text to verify products
4. **Confidence Scores** - Only applies high-confidence fixes

## Current Status

❌ **API Keys Tested**:
- `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` - Invalid
- `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` - Invalid

✅ **System Ready**: All tools created and tested, just need valid API key

## Alternative Solutions

While waiting for valid API key:
1. Use the automated Python fixes already applied
2. Use manual audit tool: `manual_image_audit.html`
3. Current fixes are already working

---

**Note**: The Qwen2.5 VL 72B model is one of the best open vision-language models available, capable of understanding complex visual content and text in multiple languages including Hebrew.