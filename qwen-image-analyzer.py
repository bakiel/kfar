#!/usr/bin/env python3
"""
Qwen2.5 VL 72B Image Analysis Tool
Automated image analysis for KFAR Marketplace using Qwen Vision model
"""

import os
import json
import base64
import requests
from pathlib import Path
from typing import Dict, List, Optional
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class QwenImageAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.siliconflow.cn/v1/chat/completions"
        self.model = "Qwen/Qwen2.5-VL-72B-Instruct"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        self.analysis_cache = {}
        
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze_image(self, image_path: str, prompt: str = None) -> Dict:
        """Analyze a single image using Qwen VL model"""
        if prompt is None:
            prompt = """Analyze this food product image and provide detailed information:

1. What type of food product is shown? (e.g., schnitzel, burger, tofu, etc.)
2. Describe the packaging (color, type, text visible)
3. Is there Hebrew text? If yes, what does it say?
4. What is the dominant color of the packaging?
5. Based on visual appearance, what category would this belong to?

Respond in JSON format:
{
    "product_type": "main type of product shown",
    "packaging": {
        "type": "box/tray/wrapper/none",
        "color": "dominant color",
        "text_visible": "any text you can see"
    },
    "hebrew_text": "Hebrew text if visible",
    "suggested_category": "schnitzels/burgers/tofu/etc",
    "confidence": 0.0-1.0,
    "description": "detailed description"
}"""
        
        image_base64 = self.encode_image(image_path)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            "temperature": 0.1,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Try to parse as JSON
            try:
                parsed = json.loads(content)
                return parsed
            except json.JSONDecodeError:
                # Return as text if not JSON
                return {
                    "raw_response": content,
                    "product_type": "unknown",
                    "confidence": 0.5
                }
                
        except Exception as e:
            logger.error(f"Error analyzing {image_path}: {str(e)}")
            return {
                "error": str(e),
                "product_type": "error",
                "confidence": 0.0
            }
    
    def analyze_all_images(self, image_dir: str) -> Dict[str, Dict]:
        """Analyze all images in a directory"""
        image_dir = Path(image_dir)
        results = {}
        
        # Get all image files
        image_files = list(image_dir.glob("*.jpg")) + list(image_dir.glob("*.png"))
        logger.info(f"Found {len(image_files)} images to analyze")
        
        for i, image_path in enumerate(image_files):
            logger.info(f"Analyzing image {i+1}/{len(image_files)}: {image_path.name}")
            
            # Check cache
            if image_path.name in self.analysis_cache:
                results[image_path.name] = self.analysis_cache[image_path.name]
                continue
            
            # Analyze image
            analysis = self.analyze_image(str(image_path))
            results[image_path.name] = analysis
            self.analysis_cache[image_path.name] = analysis
            
            # Save progress
            if (i + 1) % 5 == 0:
                self.save_results(results, "qwen_analysis_progress.json")
        
        return results
    
    def save_results(self, results: Dict, filename: str):
        """Save analysis results to JSON"""
        output = {
            "timestamp": datetime.now().isoformat(),
            "model": self.model,
            "total_images": len(results),
            "results": results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved results to {filename}")
    
    def generate_fix_mapping(self, analysis_results: Dict, products: List[Dict]) -> List[Dict]:
        """Generate product-to-image mappings based on analysis"""
        fixes = []
        
        for product in products:
            product_name = product['name'].lower()
            current_image = product['image'].split('/')[-1]
            
            # Find best matching image based on analysis
            best_match = None
            best_score = 0
            
            for image_name, analysis in analysis_results.items():
                if 'error' in analysis:
                    continue
                    
                score = 0
                product_type = analysis.get('product_type', '').lower()
                
                # Score based on product type match
                if 'schnitzel' in product_name and 'schnitzel' in product_type:
                    score += 0.5
                elif 'burger' in product_name and 'burger' in product_type:
                    score += 0.5
                elif 'tofu' in product_name and 'tofu' in product_type:
                    score += 0.5
                elif 'okara' in product_name and 'okara' in analysis.get('description', '').lower():
                    score += 0.6
                elif 'shawarma' in product_name and 'shawarma' in product_type:
                    score += 0.5
                
                # Check packaging color for OKARA (green box)
                if 'okara' in product_name:
                    packaging = analysis.get('packaging', {})
                    if 'green' in packaging.get('color', '').lower():
                        score += 0.3
                
                # Hebrew text matching
                hebrew_text = analysis.get('hebrew_text', '')
                if hebrew_text and product.get('nameHe'):
                    if any(word in hebrew_text for word in product['nameHe'].split()):
                        score += 0.2
                
                if score > best_score:
                    best_score = score
                    best_match = image_name
            
            # Create fix if needed
            if best_match and best_match != current_image and best_score > 0.3:
                fixes.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'current_image': current_image,
                    'suggested_image': best_match,
                    'confidence': best_score,
                    'reason': f"Qwen VL analysis match (score: {best_score:.2f})"
                })
        
        return fixes

def main():
    """Main function to run Qwen image analysis"""
    # Use the provided API key
    API_KEY = "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"
    
    # Change to correct directory
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    print("🤖 Qwen2.5 VL 72B Image Analysis System")
    print("=" * 60)
    print("Using advanced vision model for accurate image analysis")
    print("=" * 60)
    
    analyzer = QwenImageAnalyzer(API_KEY)
    
    # Analyze all Teva Deli images
    image_dir = "public/images/vendors/teva-deli"
    print(f"\n📸 Analyzing images in: {image_dir}")
    
    results = analyzer.analyze_all_images(image_dir)
    
    # Save full analysis
    analyzer.save_results(results, "qwen_image_analysis.json")
    
    # Load products and generate fixes
    print("\n🔧 Generating fix recommendations...")
    
    # Simple product loader (you can enhance this)
    products = []
    catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
    if catalog_path.exists():
        with open(catalog_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Basic extraction (enhance as needed)
        import re
        pattern = r"id: '([^']+)'.*?name: '([^']+)'.*?nameHe: '([^']+)'.*?image: '([^']+)'"
        matches = re.findall(pattern, content, re.DOTALL)
        
        for match in matches:
            products.append({
                'id': match[0],
                'name': match[1],
                'nameHe': match[2],
                'image': match[3]
            })
    
    fixes = analyzer.generate_fix_mapping(results, products)
    
    # Save fixes
    with open('qwen_fix_recommendations.json', 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'total_fixes': len(fixes),
            'fixes': fixes
        }, f, indent=2)
    
    print(f"\n✅ Analysis complete!")
    print(f"📊 Analyzed {len(results)} images")
    print(f"🔧 Generated {len(fixes)} fix recommendations")
    print(f"\n📄 Results saved to:")
    print(f"   - qwen_image_analysis.json (full analysis)")
    print(f"   - qwen_fix_recommendations.json (recommended fixes)")

if __name__ == "__main__":
    main()