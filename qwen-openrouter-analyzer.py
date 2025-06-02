#!/usr/bin/env python3
"""
Qwen2.5 VL 72B Image Analysis via OpenRouter
Advanced vision-language model with Hebrew support
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

class QwenOpenRouterAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "qwen/qwen2.5-vl-72b-instruct:free"  # Free Qwen VL model
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kfar-marketplace.com",
            "X-Title": "KFAR Qwen Analysis"
        }
        self.analysis_cache = {}
        
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze_image(self, image_path: str) -> Dict:
        """Analyze image using Qwen2.5 VL 72B"""
        logger.info(f"Analyzing with Qwen VL: {Path(image_path).name}")
        
        image_base64 = self.encode_image(image_path)
        
        # Enhanced prompt for Qwen
        prompt = """Please analyze this food product image in detail:

1. Product Type: What specific type of food product is shown? (e.g., schnitzel, burger, tofu, OKARA, seitan)
2. Packaging Analysis: 
   - Type of packaging (box, tray, wrapper, vacuum sealed, none)
   - Main color of packaging
   - Is this a green box (OKARA product)?
3. Text Recognition:
   - Any Hebrew text visible? Please transcribe it exactly
   - Brand name visible?
   - Product name in Hebrew?
4. Visual Details:
   - Describe what the actual food looks like
   - Any special features or characteristics
5. Category Suggestion: Based on the visual evidence, what product category does this belong to?

Please respond in JSON format:
{
    "product_type": "specific type of product",
    "packaging": {
        "type": "box/tray/wrapper/vacuum/none",
        "color": "main color(s)",
        "is_green_box": true/false,
        "is_okara": true/false
    },
    "text": {
        "hebrew_text": "exact Hebrew text or null",
        "brand": "brand name or null",
        "product_name_hebrew": "product name in Hebrew or null"
    },
    "visual_description": "detailed description of the food item",
    "suggested_category": "schnitzels/burgers/tofu/seitan/shawarma/kebabs/sausages/deli/specialty",
    "confidence": 0.0-1.0,
    "special_notes": "any special observations"
}"""
        
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
            "temperature": 0.1,
            "max_tokens": 1500
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Parse JSON response
            try:
                # Clean up response if needed
                if "```json" in content:
                    json_start = content.find("```json") + 7
                    json_end = content.find("```", json_start)
                    content = content[json_start:json_end].strip()
                elif "```" in content:
                    json_start = content.find("```") + 3
                    json_end = content.find("```", json_start)
                    content = content[json_start:json_end].strip()
                
                parsed = json.loads(content)
                
                # Ensure backward compatibility
                if 'is_okara' not in parsed and 'packaging' in parsed:
                    parsed['is_okara'] = parsed['packaging'].get('is_okara', False)
                if 'hebrew_text' not in parsed and 'text' in parsed:
                    parsed['hebrew_text'] = parsed['text'].get('hebrew_text')
                    
                return parsed
                
            except json.JSONDecodeError:
                logger.warning(f"Could not parse JSON for {Path(image_path).name}")
                return {
                    "raw_response": content,
                    "product_type": "unknown",
                    "confidence": 0.5,
                    "error": "JSON parse error"
                }
                
        except Exception as e:
            logger.error(f"Error analyzing {Path(image_path).name}: {str(e)}")
            return {
                "error": str(e),
                "product_type": "error",
                "confidence": 0.0
            }
    
    def analyze_all_images(self, image_dir: str, limit: int = None) -> Dict[str, Dict]:
        """Analyze all images in directory"""
        image_dir = Path(image_dir)
        results = {}
        
        # Get all images
        image_files = list(image_dir.glob("*.jpg")) + list(image_dir.glob("*.png"))
        
        if limit:
            image_files = image_files[:limit]
            
        logger.info(f"Analyzing {len(image_files)} images with Qwen2.5 VL 72B")
        
        for i, image_path in enumerate(image_files):
            logger.info(f"Processing {i+1}/{len(image_files)}: {image_path.name}")
            
            # Check cache
            if image_path.name in self.analysis_cache:
                results[image_path.name] = self.analysis_cache[image_path.name]
                continue
            
            # Analyze
            analysis = self.analyze_image(str(image_path))
            results[image_path.name] = analysis
            self.analysis_cache[image_path.name] = analysis
            
            # Save progress
            if (i + 1) % 5 == 0:
                self.save_results(results, "qwen_analysis_progress.json")
        
        return results
    
    def save_results(self, results: Dict, filename: str):
        """Save analysis results"""
        output = {
            "timestamp": datetime.now().isoformat(),
            "model": self.model,
            "provider": "OpenRouter",
            "total_images": len(results),
            "results": results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved results to {filename}")
    
    def generate_fix_recommendations(self, analysis_results: Dict, products: List[Dict]) -> List[Dict]:
        """Generate fix recommendations based on Qwen analysis"""
        fixes = []
        
        for product in products:
            product_name = product['name'].lower()
            product_name_he = product.get('nameHe', '')
            current_image = product['image'].split('/')[-1]
            
            # Get current image analysis
            current_analysis = analysis_results.get(current_image, {})
            
            # Find issues and better matches
            best_match = None
            best_score = 0
            best_reason = ""
            
            # Check for OKARA mismatch
            if 'okara' in product_name:
                if not current_analysis.get('is_okara') and not current_analysis.get('packaging', {}).get('is_okara'):
                    # Find OKARA image
                    for img_name, analysis in analysis_results.items():
                        if analysis.get('is_okara') or analysis.get('packaging', {}).get('is_okara'):
                            best_match = img_name
                            best_score = 0.9
                            best_reason = "OKARA product needs green box image"
                            break
            
            # Check Hebrew text matching
            elif product_name_he and current_analysis.get('text', {}).get('hebrew_text'):
                hebrew_text = current_analysis['text']['hebrew_text']
                if not any(word in hebrew_text for word in product_name_he.split()):
                    # Find better Hebrew match
                    for img_name, analysis in analysis_results.items():
                        img_hebrew = analysis.get('text', {}).get('hebrew_text', '') or analysis.get('hebrew_text', '')
                        if img_hebrew and any(word in img_hebrew for word in product_name_he.split()):
                            if img_name != current_image:
                                best_match = img_name
                                best_score = 0.85
                                best_reason = "Hebrew text matches product name"
                                break
            
            # Check product type mismatch
            current_type = current_analysis.get('product_type', '').lower()
            
            if 'schnitzel' in product_name and 'schnitzel' not in current_type:
                for img_name, analysis in analysis_results.items():
                    if 'schnitzel' in analysis.get('product_type', '').lower():
                        if img_name != current_image:
                            best_match = img_name
                            best_score = 0.8
                            best_reason = "Product type mismatch - needs schnitzel image"
                            break
            
            # Create fix if needed
            if best_match and best_score > 0.5:
                fixes.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'current_image': current_image,
                    'suggested_image': best_match,
                    'confidence': best_score,
                    'reason': best_reason,
                    'ai_model': 'Qwen2.5 VL 72B'
                })
        
        return fixes

def main():
    """Main function"""
    API_KEY = "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"
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    print("🤖 Qwen2.5 VL 72B Analysis via OpenRouter (FREE)")
    print("=" * 60)
    print("Advanced vision-language model with Hebrew support")
    print("Using FREE tier with your API key")
    print("=" * 60)
    
    analyzer = QwenOpenRouterAnalyzer(API_KEY)
    
    # Test mode
    print("\n📸 Testing with 3 images first...")
    
    image_dir = "public/images/vendors/teva-deli"
    results = analyzer.analyze_all_images(image_dir, limit=3)
    
    # Save test results
    analyzer.save_results(results, "qwen_test_results.json")
    
    print(f"\n✅ Test complete! Analyzed {len(results)} images")
    print("Check qwen_test_results.json for details")
    
    # Show sample result
    if results:
        first_result = list(results.values())[0]
        print("\nSample analysis:")
        print(f"Product type: {first_result.get('product_type')}")
        if 'text' in first_result:
            print(f"Hebrew text: {first_result['text'].get('hebrew_text', 'None detected')}")
        print(f"Confidence: {first_result.get('confidence', 0) * 100:.0f}%")
    
    print("\n🚀 To run full analysis:")
    print("python3 qwen-openrouter-analyzer.py --full")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--full":
        # Full analysis mode
        API_KEY = "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"
        analyzer = QwenOpenRouterAnalyzer(API_KEY)
        
        print("🚀 Running full Qwen2.5 VL 72B analysis on all images...")
        results = analyzer.analyze_all_images("public/images/vendors/teva-deli")
        analyzer.save_results(results, "qwen_full_analysis.json")
        
        print(f"\n✅ Complete! Analyzed {len(results)} images with Qwen VL")
        print("Results saved to: qwen_full_analysis.json")
    else:
        main()