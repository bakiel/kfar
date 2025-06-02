#!/usr/bin/env python3
"""
Direct Resume Analysis - Continue from where we left off
"""

import os
import json
import base64
import requests
from pathlib import Path
from datetime import datetime
import logging
import time

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QwenProductAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "qwen/qwen2.5-vl-72b-instruct"  # PAID tier
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kfar-marketplace.com",
            "X-Title": "KFAR Product Analysis"
        }
        
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze_product_image(self, image_path: str, product_name: str = "", product_name_he: str = "") -> dict:
        """Analyze product image"""
        logger.info(f"Deep analysis: {Path(image_path).name}")
        
        image_base64 = self.encode_image(image_path)
        
        prompt = f"""You are analyzing a vegan food product image for an Israeli marketplace. 
Product name hint: {product_name}
Hebrew name hint: {product_name_he}

Please provide a comprehensive analysis in JSON format:
{{
    "product_type": "specific type",
    "main_ingredients": ["ingredient1", "ingredient2"],
    "visual_description": "detailed appearance description",
    "texture": "texture description",
    "color": "color description",
    "packaging": {{
        "type": "box/tray/wrapper",
        "color": "packaging colors",
        "is_green_box": true/false,
        "is_okara": true/false
    }},
    "hebrew_text": {{
        "product_name": "main Hebrew product name",
        "description": "Hebrew description text",
        "ingredients": "Hebrew ingredients if visible",
        "other": "any other Hebrew text"
    }},
    "english_text": "any English text visible",
    "nutritional_highlights": ["highlight1", "highlight2"],
    "preparation_method": "how to prepare",
    "serving_suggestions": ["suggestion1", "suggestion2"],
    "cuisine_style": "cuisine type",
    "meal_type": ["breakfast", "lunch", "dinner", "snack"],
    "key_features": ["feature1", "feature2", "feature3"],
    "health_benefits": ["benefit1", "benefit2"],
    "certifications": ["vegan", "kosher", "other"],
    "marketing_angle": "main marketing message",
    "cultural_context": "cultural significance",
    "target_audience": "who would buy this",
    "shelf_life": "if mentioned",
    "storage": "storage instructions if visible",
    "weight": "package weight if visible",
    "servings": "number of servings if mentioned",
    "confidence": 0.0-1.0
}}"""
        
        payload = {
            "model": self.model,
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                ]
            }],
            "temperature": 0.2,
            "max_tokens": 2000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=45)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Parse JSON
            if "```json" in content:
                json_start = content.find("```json") + 7
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
            elif "```" in content:
                json_start = content.find("```") + 3
                json_end = content.find("```", json_start)
                content = content[json_start:json_end].strip()
            
            return json.loads(content)
            
        except Exception as e:
            logger.error(f"Error analyzing {Path(image_path).name}: {str(e)}")
            return {"error": str(e)}
    
    def generate_product_description(self, analysis: dict, product_info: dict) -> dict:
        """Generate enhanced description from analysis"""
        
        product_type = analysis.get('product_type', 'plant-based product')
        visual_desc = analysis.get('visual_description', '')
        texture = analysis.get('texture', '')
        ingredients = analysis.get('main_ingredients', [])
        key_features = analysis.get('key_features', [])
        health_benefits = analysis.get('health_benefits', [])
        serving_suggestions = analysis.get('serving_suggestions', [])
        cuisine_style = analysis.get('cuisine_style', 'Israeli')
        cultural_context = analysis.get('cultural_context', '')
        
        # Build description
        description_parts = []
        
        if analysis.get('packaging', {}).get('is_okara'):
            description_parts.append(f"Premium OKARA {product_type} made from nutrient-rich soy pulp.")
        else:
            description_parts.append(f"Authentic {cuisine_style} {product_type} made with plant-based ingredients.")
        
        if visual_desc:
            description_parts.append(visual_desc)
        if texture:
            description_parts.append(f"Features a {texture} texture.")
        
        if ingredients:
            description_parts.append(f"Made with {', '.join(ingredients[:3])}.")
        
        if cultural_context:
            description_parts.append(cultural_context)
        
        if health_benefits:
            description_parts.append(f"Rich in {', '.join(health_benefits[:2])}.")
        
        prep_method = analysis.get('preparation_method', '')
        if prep_method:
            description_parts.append(f"Simply {prep_method}.")
        
        if serving_suggestions:
            description_parts.append(f"Perfect {serving_suggestions[0]}.")
        
        enhanced_description = ' '.join(description_parts)
        
        # Generate tags
        tags = ['vegan', 'kosher']
        
        if analysis.get('packaging', {}).get('is_okara'):
            tags.extend(['okara', 'fiber-rich', 'eco-friendly'])
        
        if 'protein' in str(health_benefits).lower():
            tags.append('protein-rich')
            
        if 'organic' in str(analysis).lower():
            tags.append('organic')
            
        if ingredients:
            for ingredient in ingredients[:3]:
                if ingredient.lower() not in ['water', 'salt', 'oil']:
                    tags.append(ingredient.lower())
        
        # Remove duplicates
        tags = list(dict.fromkeys(tags))[:15]
        
        return {
            'enhanced_description': enhanced_description,
            'short_description': ' '.join(description_parts[:2]),
            'key_features': key_features[:5],
            'health_benefits': health_benefits[:3],
            'serving_suggestions': serving_suggestions[:3],
            'ingredients_detected': ingredients,
            'tags': tags,
            'weight': analysis.get('weight', ''),
            'servings': analysis.get('servings', ''),
            'nutritional_highlights': analysis.get('nutritional_highlights', []),
            'cuisine_style': cuisine_style,
            'preparation_method': prep_method,
            'storage': analysis.get('storage', ''),
            'certifications': analysis.get('certifications', ['vegan', 'kosher']),
            'is_okara': analysis.get('packaging', {}).get('is_okara', False),
            'hebrew_product_name': analysis.get('hebrew_text', {}).get('product_name', ''),
            'confidence': analysis.get('confidence', 0.8)
        }

# Main execution
print("📊 Direct Resume Analysis")
print("=" * 60)

# Load existing results
existing_results = {}
if Path("qwen_product_analysis_progress.json").exists():
    with open("qwen_product_analysis_progress.json", 'r') as f:
        data = json.load(f)
        existing_results = data['results']

print(f"✅ Already analyzed: {len(existing_results)} products")

# Remaining products (hard-coded based on what we know)
remaining_products = [
    {'id': 'td-021', 'name': 'OKARA Burgers', 'nameHe': 'המבורגר אוקרה', 'category': 'burgers', 'price': 39, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_21_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-022', 'name': 'OKARA Schnitzel with Broccoli', 'nameHe': 'שניצל אוקרה עם ברוקולי', 'category': 'schnitzels', 'price': 42, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_22_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-023', 'name': 'OKARA Mix', 'nameHe': 'תערובת אוקרה', 'category': 'specialty', 'price': 38, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_23_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-024', 'name': 'Veggie Burger Classic', 'nameHe': 'המבורגר ירקות קלאסי', 'category': 'burgers', 'price': 35, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_24_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-025', 'name': 'Quinoa Schnitzel', 'nameHe': 'שניצל קינואה', 'category': 'schnitzels', 'price': 44, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_25_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-026', 'name': 'Lentil Burger', 'nameHe': 'המבורגר עדשים', 'category': 'burgers', 'price': 36, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_26_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-027', 'name': 'Herb Schnitzel', 'nameHe': 'שניצל תבלינים', 'category': 'schnitzels', 'price': 40, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_27_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-028', 'name': 'Black Bean Burger', 'nameHe': 'המבורגר שעועית שחורה', 'category': 'burgers', 'price': 37, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_28_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-029', 'name': 'Corn Schnitzel', 'nameHe': 'שניצל תירס', 'category': 'schnitzels', 'price': 38, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_29_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-030', 'name': 'Sweet Potato Burger', 'nameHe': 'המבורגר בטטה', 'category': 'burgers', 'price': 39, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_30_burger_schnitzel_plant_based_deli.jpg'},
    {'id': 'td-031', 'name': 'Shawarma Style', 'nameHe': 'שווארמה טבעונית', 'category': 'shawarma', 'price': 48, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_31_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-032', 'name': 'Kebab Skewers', 'nameHe': 'שיפודי קבב', 'category': 'kebabs', 'price': 52, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_32_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-033', 'name': 'Shawarma Plate', 'nameHe': 'צלחת שווארמה', 'category': 'shawarma', 'price': 55, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_33_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-034', 'name': 'Grilled Kebab', 'nameHe': 'קבב צלוי', 'category': 'kebabs', 'price': 49, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_34_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-035', 'name': 'Shawarma Wrap Mix', 'nameHe': 'תערובת שווארמה', 'category': 'shawarma', 'price': 46, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_35_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-036', 'name': 'Mini Kebabs', 'nameHe': 'קבב מיני', 'category': 'kebabs', 'price': 42, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_36_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-037', 'name': 'Spicy Shawarma', 'nameHe': 'שווארמה חריפה', 'category': 'shawarma', 'price': 50, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_37_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-038', 'name': 'Herb Kebab', 'nameHe': 'קבב עשבי תיבול', 'category': 'kebabs', 'price': 47, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_38_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-039', 'name': 'Jerusalem Mix Shawarma', 'nameHe': 'שווארמה ירושלמית', 'category': 'shawarma', 'price': 53, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_39_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-040', 'name': 'BBQ Kebab Sticks', 'nameHe': 'מקלות קבב על האש', 'category': 'kebabs', 'price': 45, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_40_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-041', 'name': 'Falafel Shawarma', 'nameHe': 'שווארמה פלאפל', 'category': 'shawarma', 'price': 44, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_41_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-042', 'name': 'Mixed Grill Kebab', 'nameHe': 'מעורב ירושלמי קבב', 'category': 'kebabs', 'price': 58, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_42_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-043', 'name': 'Gyro Style Shawarma', 'nameHe': 'שווארמה בסגנון יווני', 'category': 'shawarma', 'price': 51, 'image': '/images/vendors/teva-deli/teva_deli_vegan_specialty_product_43_shawarma_kebab_middle_eastern_plant_based.jpg'},
    {'id': 'td-044', 'name': 'Vegan Bratwurst', 'nameHe': 'נקניקיה טבעונית', 'category': 'sausages', 'price': 40, 'image': '/images/vendors/teva-deli/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'},
    {'id': 'td-045', 'name': 'Chorizo Style Sausage', 'nameHe': 'נקניק צוריסו', 'category': 'sausages', 'price': 43, 'image': '/images/vendors/teva-deli/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'},
    {'id': 'td-046', 'name': 'Italian Herb Sausage', 'nameHe': 'נקניק איטלקי', 'category': 'sausages', 'price': 41, 'image': '/images/vendors/teva-deli/teva_deli_vegan_tofu_natural_organic_plant_based_protein_block_israeli_made.png'}
]

print(f"📋 Remaining to analyze: {len(remaining_products)}")

# Initialize analyzer
API_KEY = "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"
analyzer = QwenProductAnalyzer(API_KEY)

# Copy existing results
results = existing_results.copy()

# Analyze remaining
for i, product in enumerate(remaining_products):
    print(f"\nProcessing {i+1}/{len(remaining_products)}: {product['name']}")
    
    if product['id'] in results:
        print("  ✓ Already analyzed, skipping...")
        continue
    
    image_filename = product['image'].split('/')[-1]
    image_path = f"public/images/vendors/teva-deli/{image_filename}"
    
    if not Path(image_path).exists():
        print(f"  ⚠️  Image not found: {image_path}")
        continue
    
    # Analyze
    analysis = analyzer.analyze_product_image(
        image_path, 
        product['name'], 
        product.get('nameHe', '')
    )
    
    # Generate description
    enhanced_data = analyzer.generate_product_description(analysis, product)
    
    # Combine data
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
    
    # Save progress every 5
    if (i + 1) % 5 == 0:
        output = {
            "timestamp": datetime.now().isoformat(),
            "model": "qwen/qwen2.5-vl-72b-instruct",
            "total_products": len(results),
            "results": results
        }
        with open("qwen_product_analysis_progress.json", 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        print(f"  💾 Progress saved ({len(results)} total)")

# Save final results
output = {
    "timestamp": datetime.now().isoformat(),
    "model": "qwen/qwen2.5-vl-72b-instruct",
    "total_products": len(results),
    "results": results
}

with open("qwen_complete_product_analysis.json", 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Analysis complete! Total products analyzed: {len(results)}")
print("Results saved to: qwen_complete_product_analysis.json")