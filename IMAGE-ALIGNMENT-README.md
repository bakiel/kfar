# KFAR Marketplace - Image-Description Alignment

## Overview
This system ensures all product images match their catalog descriptions accurately.

## Quick Start

1. **Check Current Issues**
   ```bash
   node scripts/quick-image-check.js
   ```

2. **Run Full Analysis**
   ```bash
   node scripts/image-alignment-checker.js
   ```

3. **Apply Fixes**
   ```bash
   node scripts/image-alignment-fixer.js
   ```

4. **Visual Review**
   ```bash
   # Start local server
   cd kfar-marketplace-app
   python -m http.server 8080
   # Open http://localhost:8080/image-alignment-visual-tool.html
   ```

## Current Issues Summary

### 🔴 Critical Fixes Needed

1. **Garden of Light**
   - Product gol-002: Fix spelling "Kalbono" → "Kelbone"
   - Product gol-003: Verify if duplicate of product 2
   - Product gol-012: Missing product image (shows logo)

2. **Teva Deli**
   - 43 specialty product images need mapping to product IDs
   - Already identified:
     - specialty_01 = Seitan Amaranth (td-001)
     - specialty_11 = Vegetarian Hot Dogs
     - specialty_21 = Okara Patties

3. **Gahn Delight**
   - Missing 8 product images (gd-008 through gd-015)

## Using Vision Analysis

For unmapped Teva Deli products:

```bash
# Example using Gemini Vision
gemini_vision --image_path "/path/to/image.jpg" --prompt "Identify this Teva Deli product"
```

## Files Generated

- `image-alignment-report.json` - Full analysis report
- `image-alignment-summary.md` - Human-readable summary
- `teva-deli-image-mapping.json` - Image to product ID mappings
- `missing-images-report.md` - List of missing images
- `vision-analysis-results.json` - Results from AI vision analysis

## Database Updates

After running the fixer, the following will be updated:
- Garden of Light catalog: Spelling corrections
- Teva Deli mappings: Image to product ID associations
- Missing images list: For vendor communication

## Next Steps

1. Complete vision analysis for remaining Teva Deli products
2. Request missing images from vendors
3. Update database with corrected mappings
4. Re-run verification to ensure 100% accuracy
