#!/usr/bin/env python3
"""
Resume Analysis - Only process remaining products
"""

import os
import json
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from qwen_full_product_analyzer import QwenProductAnalyzer, generate_product_description
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Products to analyze
remaining_products = [
  {
    "id": "td-018",
    "name": "BBQ Seitan Ribs",
    "nameHe": "\u05e6\u05dc\u05e2\u05d5\u05ea \u05e1\u05d9\u05d9\u05d8\u05df \u05d1\u05e8\u05d1\u05d9\u05e7\u05d9\u05d5",
    "description": "Smoky BBQ-glazed seitan ribs for grilling",
    "price": 52,
    "category": "ready-meals",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_18_seitan_tofu_based_protein_alternative.jpg"
  },
  {
    "id": "td-037",
    "name": "Chicken-Style Shawarma",
    "nameHe": "\u05e9\u05d5\u05d5\u05d0\u05e8\u05de\u05d4 \u05d1\u05e1\u05d2\u05e0\u05d5\u05df \u05e2\u05d5\u05e3",
    "description": "Light colored shawarma with poultry spices",
    "price": 46,
    "category": "ready-meals",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-038",
    "name": "Mixed Grill Platter",
    "nameHe": "\u05de\u05d2\u05e9 \u05de\u05e2\u05d5\u05e8\u05d1 \u05e6\u05de\u05d7\u05d5\u05e0\u05d9",
    "description": "Assorted kebabs and shawarma platter",
    "price": 85,
    "category": "ready-meals",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-042",
    "name": "Shawarma Party Pack",
    "nameHe": "\u05de\u05d2\u05e9 \u05e9\u05d5\u05d5\u05d0\u05e8\u05de\u05d4 \u05dc\u05de\u05e1\u05d9\u05d1\u05d5\u05ea",
    "description": "Bulk shawarma for events and gatherings",
    "price": 145,
    "category": "ready-meals",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_42_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-021",
    "name": "Okara Vegetable Patties",
    "nameHe": "\u05e7\u05e6\u05d9\u05e6\u05d5\u05ea \u05d0\u05d5\u05e7\u05e8\u05d4",
    "description": "Nutritious patties made from okara (soy pulp) mixed with fresh herbs and vegetables. Rich in fiber and protein, these patties offer a lighter alternative with 400g per package. Perfect for health-conscious diners.",
    "price": 52,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-022",
    "name": "Okara Patties with Broccoli",
    "nameHe": "\u05e7\u05e6\u05d9\u05e6\u05d5\u05ea \u05d0\u05d5\u05e7\u05e8\u05d4 \u05e2\u05dd \u05d1\u05e8\u05d5\u05e7\u05d5\u05dc\u05d9",
    "description": "Okara (soy pulp) patties with broccoli and grains. Green box, 400g serves 8.",
    "price": 54,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-023",
    "name": "Plant-Based Ground Meat",
    "nameHe": "\u05d8\u05d5\u05d7\u05d5\u05df \u05de\u05d4\u05e6\u05d5\u05de\u05d7",
    "description": "Plant-based ground for making patties and burgers. 500g with 15% protein.",
    "price": 58,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-026",
    "name": "Tex-Mex Black Bean Burger",
    "nameHe": "\u05d4\u05de\u05d1\u05d5\u05e8\u05d2\u05e8 \u05e9\u05e2\u05d5\u05e2\u05d9\u05ea \u05e9\u05d7\u05d5\u05e8\u05d4",
    "description": "Southwestern-spiced black bean patties",
    "price": 46,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-027",
    "name": "Mini Slider Patties",
    "nameHe": "\u05de\u05d9\u05e0\u05d9 \u05d4\u05de\u05d1\u05d5\u05e8\u05d2\u05e8\u05d9\u05dd",
    "description": "Perfect-sized patties for sliders",
    "price": 48,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-029",
    "name": "Quinoa Veggie Burger",
    "nameHe": "\u05d4\u05de\u05d1\u05d5\u05e8\u05d2\u05e8 \u05e7\u05d9\u05e0\u05d5\u05d0\u05d4 \u05d5\u05d9\u05e8\u05e7\u05d5\u05ea",
    "description": "Protein-packed quinoa and vegetable patties",
    "price": 50,
    "category": "burgers",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-013",
    "name": "Vegan Hot Dogs",
    "nameHe": "\u05e0\u05e7\u05e0\u05d9\u05e7\u05d9\u05d5\u05ea \u05d8\u05d1\u05e2\u05d5\u05e0\u05d9\u05d5\u05ea",
    "description": "Classic American-style vegan hot dogs",
    "price": 38,
    "category": "sausages",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_11_seitan_tofu_based_protein_alternative.jpg"
  },
  {
    "id": "td-031",
    "name": "Italian Style Vegan Salami",
    "nameHe": "\u05e1\u05dc\u05de\u05d9 \u05d0\u05d9\u05d8\u05dc\u05e7\u05d9 \u05d1\u05e1\u05d2\u05e0\u05d5\u05df",
    "description": "Premium Italian-style salami made from tofu, wheat protein and soy protein. Seasoned with traditional spices for authentic deli flavor. 400g roll perfect for sandwiches, pizzas, or antipasto platters.",
    "price": 48,
    "category": "sausages",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-016",
    "name": "Seitan Chorizo",
    "nameHe": "\u05e6\u05f3\u05d5\u05e8\u05d9\u05e1\u05d5 \u05e1\u05d9\u05d9\u05d8\u05df",
    "description": "Spicy Spanish-style seitan sausage",
    "price": 38,
    "category": "sausages",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_16_seitan_tofu_based_protein_alternative.jpg"
  },
  {
    "id": "td-043",
    "name": "Merguez Sausage",
    "nameHe": "\u05e0\u05e7\u05e0\u05d9\u05e7\u05d9\u05d5\u05ea \u05de\u05e8\u05d2\u05d6",
    "description": "Spicy North African style sausages",
    "price": 54,
    "category": "sausages",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_43_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-032",
    "name": "Spicy Harissa Kebabs",
    "nameHe": "\u05e7\u05d1\u05d1 \u05d7\u05e8\u05d9\u05e1\u05d4 \u05d7\u05e8\u05d9\u05e3",
    "description": "North African spiced kebabs with harissa",
    "price": 52,
    "category": "kebabs",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-034",
    "name": "Turkish Adana Kebabs",
    "nameHe": "\u05e7\u05d1\u05d1 \u05d0\u05d3\u05e0\u05d4 \u05d8\u05d5\u05e8\u05e7\u05d9",
    "description": "Spicy Turkish-style minced kebabs",
    "price": 50,
    "category": "kebabs",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-036",
    "name": "Persian Koobideh Kebabs",
    "nameHe": "\u05e7\u05d1\u05d1 \u05e7\u05d5\u05d1\u05d9\u05d3\u05d4 \u05e4\u05e8\u05e1\u05d9",
    "description": "Traditional Persian ground meat kebabs",
    "price": 56,
    "category": "kebabs",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-040",
    "name": "Shish Tawook Style",
    "nameHe": "\u05e9\u05d9\u05e9 \u05d8\u05d0\u05d5\u05d5\u05e7 \u05d8\u05d1\u05e2\u05d5\u05e0\u05d9",
    "description": "Lebanese marinated chicken-style kebabs",
    "price": 52,
    "category": "kebabs",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-007",
    "name": "Vegan Pastrami Slices",
    "nameHe": "\u05e4\u05e1\u05d8\u05e8\u05de\u05d4 \u05d8\u05d1\u05e2\u05d5\u05e0\u05d9\u05ea \u05e4\u05e8\u05d5\u05e1\u05d4",
    "description": "Deli-style smoked pastrami slices",
    "price": 48,
    "category": "deli-meats",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_07_plant_based_meat_alternative_israeli_cuisine.jpg"
  },
  {
    "id": "td-024",
    "name": "Plant Burger with Rice and Lentils",
    "nameHe": "\u05d1\u05d5\u05e8\u05d2\u05e8 \u05e2\u05dd \u05d0\u05d5\u05e8\u05d6 \u05de\u05dc\u05d0 \u05d5\u05e2\u05d3\u05e9\u05d9\u05dd",
    "description": "Plant-based burger with whole rice, lentils and almonds. Black box, 400g contains 4 burgers.",
    "price": 32,
    "category": "deli-meats",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg"
  },
  {
    "id": "td-035",
    "name": "Turkey-Style Slices",
    "nameHe": "\u05e4\u05e8\u05d5\u05e1\u05d5\u05ea \u05d1\u05e1\u05d2\u05e0\u05d5\u05df \u05d4\u05d5\u05d3\u05d5",
    "description": "Light deli slices with turkey-like texture",
    "price": 44,
    "category": "deli-meats",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-039",
    "name": "Bologna-Style Roll",
    "nameHe": "\u05e0\u05e7\u05e0\u05d9\u05e7 \u05d1\u05d5\u05dc\u05d5\u05e0\u05d9\u05d4 \u05d8\u05d1\u05e2\u05d5\u05e0\u05d9",
    "description": "Classic deli bologna made plant-based",
    "price": 42,
    "category": "deli-meats",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_39_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-020",
    "name": "Tofu Scramble Mix",
    "nameHe": "\u05ea\u05e2\u05e8\u05d5\u05d1\u05ea \u05d8\u05d5\u05e4\u05d5 \u05de\u05e7\u05d5\u05e9\u05e7\u05e9",
    "description": "Seasoned crumbled tofu for breakfast scrambles",
    "price": 25,
    "category": "breakfast",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_20_seitan_tofu_based_protein_alternative.jpg"
  },
  {
    "id": "td-044",
    "name": "Shawarma Laffa Wrap Kit",
    "nameHe": "\u05e2\u05e8\u05db\u05ea \u05dc\u05d0\u05e4\u05d4 \u05e9\u05d5\u05d5\u05d0\u05e8\u05de\u05d4",
    "description": "Complete shawarma meal kit with laffa bread",
    "price": 65,
    "category": "meal-kits",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-045",
    "name": "Complete Shabbat Meal Kit",
    "nameHe": "\u05e2\u05e8\u05db\u05ea \u05d0\u05e8\u05d5\u05d7\u05ea \u05e9\u05d1\u05ea \u05de\u05d5\u05e9\u05dc\u05de\u05ea",
    "description": "All-in-one vegan Shabbat dinner kit including challah, wine-style grape juice, main course, and sides. Perfect for traditional celebration with modern plant-based twist.",
    "price": 180,
    "category": "meal-kits",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_43_shawarma_kebab_middle_eastern_plant_based.jpg"
  },
  {
    "id": "td-046",
    "name": "Holiday Feast Box",
    "nameHe": "\u05d0\u05e8\u05d2\u05d6 \u05d7\u05d2\u05d9\u05d2\u05ea \u05d4\u05d7\u05d2",
    "description": "Premium holiday meal collection featuring variety of Teva Deli favorites. Includes schnitzels, kebabs, sides, and festive additions for special occasions.",
    "price": 250,
    "category": "meal-kits",
    "image": "/images/vendors/teva-deli/teva_deli_vegan_specialty_product_42_shawarma_kebab_middle_eastern_plant_based.jpg"
  }
]

# Load existing results
existing_results = {}
if Path("qwen_product_analysis_progress.json").exists():
    with open("qwen_product_analysis_progress.json", 'r') as f:
        data = json.load(f)
        existing_results = data['results']

print(f"📊 Resuming analysis...")
print(f"✅ Already analyzed: {len(existing_results)} products")
print(f"📦 Remaining to analyze: {len(remaining_products)} products")

# Initialize analyzer with PAID tier
API_KEY = "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"
analyzer = QwenProductAnalyzer(API_KEY, use_free_tier=False)

# Copy existing results
results = existing_results.copy()

# Analyze remaining products
for i, product in enumerate(remaining_products):
    print(f"\nProcessing {i+1}/{len(remaining_products)}: {product['name']}")
    
    # Skip if already analyzed
    if product['id'] in results:
        print(f"  ✓ Already analyzed, skipping...")
        continue
    
    # Extract image path
    image_filename = product['image'].split('/')[-1]
    image_path = f"public/images/vendors/teva-deli/{image_filename}"
    
    if not Path(image_path).exists():
        print(f"  ⚠️  Image not found: {image_path}")
        continue
    
    # Analyze image
    analysis = analyzer.analyze_product_image(
        image_path, 
        product['name'], 
        product.get('nameHe', '')
    )
    
    # Generate enhanced description
    enhanced_data = analyzer.generate_product_description(analysis, product)
    
    # Combine with original product data
    result = {
        'product_id': product['id'],
        'product_name': product['name'],
        'product_name_he': product.get('nameHe', ''),
        'current_description': product.get('description', ''),
        'category': product['category'],
        'price': product.get('price', 0),
        'image': product['image'],
        'analysis': analysis,
        **enhanced_data
    }
    
    results[product['id']] = result
    
    # Save progress every 5 products
    if (i + 1) % 5 == 0:
        analyzer.save_results(results, "qwen_product_analysis_progress.json")
        print(f"  💾 Progress saved ({len(results)} total)")

# Save final results
analyzer.save_results(results, "qwen_complete_product_analysis.json")
print(f"\n✅ Analysis complete! Total products analyzed: {len(results)}")
