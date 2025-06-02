# 🤖 Automated Image Fix Report

Generated: 2025-06-02 10:28:51

## Summary
- Total products analyzed: 46
- Issues found: 3
- Confidence threshold: 50%

## Detected Issues and Fixes

### Tofu product should use tofu-specific image (2 products)

- **td-003**: Crispy Tofu Bites
  - Current: `teva_deli_vegan_specialty_product_03_plant_based_meat_alternative_israeli_cuisine.jpg`
  - New: `teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg`
  - Confidence: 80%

- **td-005**: Marinated Tofu Strips
  - Current: `teva_deli_vegan_specialty_product_05_plant_based_meat_alternative_israeli_cuisine.jpg`
  - New: `teva_deli_vegan_specialty_product_10_plant_based_meat_alternative_israeli_cuisine.jpg`
  - Confidence: 80%

### Shawarma/kebab products use images 31-43 (1 products)

- **td-044**: Shawarma Laffa Wrap Kit
  - Current: `teva_deli_vegan_specialty_product_44_shawarma_kebab_middle_eastern_plant_based.jpg`
  - New: `teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg`
  - Confidence: 85%


## How to Apply Fixes

1. Review the fixes above
2. Run the generated script:
   ```bash
   node apply-automated-fixes.js
   ```
3. Test the website to ensure images are correct
4. If any issues remain, they may require manual review

## Automation Logic

This automated fix is based on:
1. Product name analysis (Hebrew and English)
2. Known image number ranges for different product types
3. Previously identified issues from user feedback
4. Pattern matching to detect mismatches

---
*This report was generated automatically without manual intervention.*
