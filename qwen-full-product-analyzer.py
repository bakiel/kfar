#!/usr/bin/env python3
"""
Complete Product Description System using Qwen2.5 VL 72B FREE
Analyzes images and generates rich product descriptions
"""

import os
import json
import base64
import requests
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime
import re
import time

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QwenProductAnalyzer:
    def __init__(self, api_key: str, use_free_tier: bool = False):
        self.api_key = api_key
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        # Use paid version for no rate limits
        self.model = "qwen/qwen2.5-vl-72b-instruct" if not use_free_tier else "qwen/qwen2.5-vl-72b-instruct:free"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kfar-marketplace.com",
            "X-Title": "KFAR Product Analysis"
        }
        self.analysis_cache = {}
        
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze_product_image(self, image_path: str, product_name: str = "", product_name_he: str = "") -> Dict:
        """Deep analysis for product description generation"""
        logger.info(f"Deep analysis: {Path(image_path).name}")
        
        image_base64 = self.encode_image(image_path)
        
        # Enhanced prompt for full product analysis
        prompt = f"""You are analyzing a vegan food product image for an Israeli marketplace. 
Product name hint: {product_name}
Hebrew name hint: {product_name_he}

Please provide a comprehensive analysis:

1. **Product Identification**:
   - What specific type of food product is this?
   - What are the main ingredients visible or indicated?
   - Is this an OKARA product (green box packaging)?

2. **Visual Description**:
   - Describe the appearance of the food in detail
   - Color, texture, shape, size
   - How is it presented (cooked, raw, packaged)?
   - Any garnishes or accompaniments shown?

3. **Packaging Analysis**:
   - Type and color of packaging
   - All Hebrew text visible (transcribe exactly)
   - English text if any
   - Nutritional highlights mentioned
   - Serving suggestions shown

4. **Culinary Information**:
   - How would this product be prepared/served?
   - What cuisine style does it represent?
   - Suggested uses or recipes
   - Target meal type (breakfast, lunch, dinner, snack)

5. **Marketing Points**:
   - Key selling features visible
   - Health benefits indicated
   - Certifications (vegan, kosher, organic)
   - Any "new" or "improved" labels

6. **Cultural Context**:
   - Israeli/Middle Eastern culinary tradition
   - Modern vegan interpretation of classic dishes
   - Family or lifestyle positioning

Please respond in JSON format:
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
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        }
                    ]
                }
            ],
            "temperature": 0.2,  # Lower for more consistent descriptions
            "max_tokens": 2000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=45)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Parse JSON response
            try:
                if "```json" in content:
                    json_start = content.find("```json") + 7
                    json_end = content.find("```", json_start)
                    content = content[json_start:json_end].strip()
                elif "```" in content:
                    json_start = content.find("```") + 3
                    json_end = content.find("```", json_start)
                    content = content[json_start:json_end].strip()
                
                parsed = json.loads(content)
                return parsed
                
            except json.JSONDecodeError:
                logger.warning(f"Could not parse JSON for {Path(image_path).name}")
                return {"error": "JSON parse error", "raw_response": content}
                
        except Exception as e:
            logger.error(f"Error analyzing {Path(image_path).name}: {str(e)}")
            return {"error": str(e)}
    
    def generate_product_description(self, analysis: Dict, product_info: Dict) -> Dict:
        """Generate enhanced product description from analysis"""
        
        # Extract key information
        product_type = analysis.get('product_type', 'plant-based product')
        visual_desc = analysis.get('visual_description', '')
        texture = analysis.get('texture', '')
        ingredients = analysis.get('main_ingredients', [])
        key_features = analysis.get('key_features', [])
        health_benefits = analysis.get('health_benefits', [])
        serving_suggestions = analysis.get('serving_suggestions', [])
        cuisine_style = analysis.get('cuisine_style', 'Israeli')
        cultural_context = analysis.get('cultural_context', '')
        
        # Build enhanced description
        description_parts = []
        
        # Opening statement
        if analysis.get('packaging', {}).get('is_okara'):
            description_parts.append(f"Premium OKARA {product_type} made from nutrient-rich soy pulp.")
        else:
            description_parts.append(f"Authentic {cuisine_style} {product_type} made with plant-based ingredients.")
        
        # Visual and texture
        if visual_desc:
            description_parts.append(visual_desc)
        if texture:
            description_parts.append(f"Features a {texture} texture.")
        
        # Ingredients
        if ingredients:
            description_parts.append(f"Made with {', '.join(ingredients[:3])}.")
        
        # Cultural significance
        if cultural_context:
            description_parts.append(cultural_context)
        
        # Health benefits
        if health_benefits:
            description_parts.append(f"Rich in {', '.join(health_benefits[:2])}.")
        
        # Preparation
        prep_method = analysis.get('preparation_method', '')
        if prep_method:
            description_parts.append(f"Simply {prep_method}.")
        
        # Serving suggestions
        if serving_suggestions:
            description_parts.append(f"Perfect {serving_suggestions[0]}.")
        
        enhanced_description = ' '.join(description_parts)
        
        # Generate tags
        tags = ['vegan', 'kosher']
        
        # Add specific tags based on analysis
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
        
        # Add cuisine tags
        cuisine_tags = {
            'Israeli': ['israeli', 'middle-eastern'],
            'Mediterranean': ['mediterranean', 'healthy'],
            'Middle Eastern': ['middle-eastern', 'traditional'],
            'Asian': ['asian-inspired', 'oriental']
        }
        
        for cuisine, ctags in cuisine_tags.items():
            if cuisine.lower() in cuisine_style.lower():
                tags.extend(ctags)
        
        # Meal type tags
        meal_types = analysis.get('meal_type', [])
        for meal in meal_types:
            if meal.lower() in ['breakfast', 'lunch', 'dinner', 'snack']:
                tags.append(meal.lower())
        
        # Remove duplicates and limit
        tags = list(dict.fromkeys(tags))[:15]
        
        # Extract weight/servings
        weight = analysis.get('weight', '')
        servings = analysis.get('servings', '')
        
        # Nutritional highlights
        nutritional = analysis.get('nutritional_highlights', [])
        
        return {
            'enhanced_description': enhanced_description,
            'short_description': ' '.join(description_parts[:2]),
            'key_features': key_features[:5],
            'health_benefits': health_benefits[:3],
            'serving_suggestions': serving_suggestions[:3],
            'ingredients_detected': ingredients,
            'tags': tags,
            'weight': weight,
            'servings': servings,
            'nutritional_highlights': nutritional,
            'cuisine_style': cuisine_style,
            'preparation_method': prep_method,
            'storage': analysis.get('storage', ''),
            'certifications': analysis.get('certifications', ['vegan', 'kosher']),
            'is_okara': analysis.get('packaging', {}).get('is_okara', False),
            'hebrew_product_name': analysis.get('hebrew_text', {}).get('product_name', ''),
            'confidence': analysis.get('confidence', 0.8)
        }
    
    def analyze_all_products(self, products: List[Dict], limit: int = None) -> Dict:
        """Analyze all products and generate descriptions"""
        results = {}
        
        if limit:
            products = products[:limit]
            
        logger.info(f"Analyzing {len(products)} products with Qwen2.5 VL 72B")
        
        for i, product in enumerate(products):
            logger.info(f"Processing {i+1}/{len(products)}: {product['name']}")
            
            # Extract image path
            image_filename = product['image'].split('/')[-1]
            image_path = f"public/images/vendors/teva-deli/{image_filename}"
            
            if not Path(image_path).exists():
                logger.warning(f"Image not found: {image_path}")
                continue
            
            # Check cache
            cache_key = f"{product['id']}_{image_filename}"
            if cache_key in self.analysis_cache:
                results[product['id']] = self.analysis_cache[cache_key]
                continue
            
            # Analyze image
            analysis = self.analyze_product_image(
                image_path, 
                product['name'], 
                product.get('nameHe', '')
            )
            
            # Generate enhanced description
            enhanced_data = self.generate_product_description(analysis, product)
            
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
            self.analysis_cache[cache_key] = result
            
            # Save progress every 5 products
            if (i + 1) % 5 == 0:
                self.save_results(results, "qwen_product_analysis_progress.json")
                # No delay needed for paid tier
        
        return results
    
    def save_results(self, results: Dict, filename: str):
        """Save analysis results"""
        output = {
            "timestamp": datetime.now().isoformat(),
            "model": self.model,
            "total_products": len(results),
            "results": results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved results to {filename}")

def load_products():
    """Load all products from catalog"""
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    with open(catalog_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    products = []
    
    # More comprehensive regex to capture all fields
    pattern = r"\{[^}]*?id:\s*'([^']+)'[^}]*?name:\s*'([^']+)'[^}]*?nameHe:\s*'([^']+)'[^}]*?description:\s*'([^']+)'[^}]*?price:\s*(\d+)[^}]*?category:\s*'([^']+)'[^}]*?image:\s*'([^']+)'[^}]*?\}"
    
    for match in re.finditer(pattern, content, re.DOTALL):
        products.append({
            'id': match.group(1),
            'name': match.group(2),
            'nameHe': match.group(3),
            'description': match.group(4),
            'price': int(match.group(5)),
            'category': match.group(6),
            'image': match.group(7)
        })
    
    return products

def main():
    """Main function"""
    API_KEY = "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"
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    print("🚀 Qwen2.5 VL 72B Complete Product Analysis System")
    print("=" * 60)
    print("Generating rich descriptions for all products")
    print("Using PAID tier for faster processing")
    print("=" * 60)
    
    # Load products
    products = load_products()
    print(f"\n📦 Found {len(products)} products to analyze")
    
    # Initialize analyzer with paid tier
    analyzer = QwenProductAnalyzer(API_KEY, use_free_tier=False)
    
    # Test mode - analyze first 3 products
    print("\n🧪 Testing with first 3 products...")
    test_results = analyzer.analyze_all_products(products, limit=3)
    
    # Save test results
    analyzer.save_results(test_results, "qwen_product_test.json")
    
    # Show sample
    if test_results:
        first = list(test_results.values())[0]
        print(f"\n📝 Sample Enhanced Description:")
        print(f"Product: {first['product_name']}")
        print(f"Enhanced: {first['enhanced_description'][:200]}...")
        print(f"Tags: {', '.join(first['tags'][:5])}")
        print(f"Key Features: {', '.join(first['key_features'][:3])}")
    
    print("\n✅ Test complete!")
    print("\nTo analyze ALL products, run:")
    print("python3 qwen-full-product-analyzer.py --full")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--full":
        # Full analysis mode
        API_KEY = "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"
        
        os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
        
        print("🚀 FULL Product Analysis Starting...")
        print("Using PAID tier - fast processing without rate limits")
        print("Analyzing all 46 products...")
        
        products = load_products()
        analyzer = QwenProductAnalyzer(API_KEY, use_free_tier=False)  # Use paid tier
        
        # Analyze all
        results = analyzer.analyze_all_products(products)
        
        # Save final results
        analyzer.save_results(results, "qwen_complete_product_analysis.json")
        
        print(f"\n✅ Complete! Analyzed {len(results)} products")
        print("Results saved to: qwen_complete_product_analysis.json")
    else:
        main()