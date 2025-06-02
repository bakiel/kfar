#!/usr/bin/env python3
"""
OpenRouter Image Analysis Tool for KFAR Marketplace
Using Gemini 2.5 Flash for vision analysis
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

class OpenRouterImageAnalyzer:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://openrouter.ai/api/v1/chat/completions"
        self.model = "google/gemini-2.5-flash-preview"  # Vision-capable model
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kfar-marketplace.com",
            "X-Title": "KFAR Image Analysis"
        }
        self.analysis_cache = {}
        
    def encode_image(self, image_path: str) -> str:
        """Encode image to base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    
    def analyze_image(self, image_path: str) -> Dict:
        """Analyze a single image using Gemini via OpenRouter"""
        logger.info(f"Analyzing: {Path(image_path).name}")
        
        image_base64 = self.encode_image(image_path)
        
        prompt = """Analyze this food product image and provide detailed information:

1. What type of food product is shown? (e.g., schnitzel, burger, tofu, OKARA, etc.)
2. Describe the packaging (color, type, any text visible)
3. Is there Hebrew text? If yes, what does it say?
4. What is the dominant color of the packaging?
5. Is this an OKARA product (green box packaging)?
6. Based on visual appearance, what category would this belong to?

Respond in JSON format:
{
    "product_type": "main type of product shown",
    "packaging": {
        "type": "box/tray/wrapper/none",
        "color": "dominant color",
        "is_green_box": true/false
    },
    "hebrew_text": "Hebrew text if visible or null",
    "is_okara": true/false,
    "suggested_category": "schnitzels/burgers/tofu/etc",
    "confidence": 0.0-1.0,
    "description": "detailed visual description"
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
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(self.api_url, headers=self.headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            content = result['choices'][0]['message']['content']
            
            # Try to parse as JSON
            try:
                # Extract JSON from response if wrapped in markdown
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
                return {
                    "raw_response": content,
                    "product_type": "unknown",
                    "confidence": 0.5
                }
                
        except Exception as e:
            logger.error(f"Error analyzing {Path(image_path).name}: {str(e)}")
            return {
                "error": str(e),
                "product_type": "error",
                "confidence": 0.0
            }
    
    def analyze_all_images(self, image_dir: str, limit: int = None) -> Dict[str, Dict]:
        """Analyze all images in a directory"""
        image_dir = Path(image_dir)
        results = {}
        
        # Get all image files
        image_files = list(image_dir.glob("*.jpg")) + list(image_dir.glob("*.png"))
        
        if limit:
            image_files = image_files[:limit]
            
        logger.info(f"Found {len(image_files)} images to analyze")
        
        for i, image_path in enumerate(image_files):
            logger.info(f"Processing {i+1}/{len(image_files)}: {image_path.name}")
            
            # Check cache
            if image_path.name in self.analysis_cache:
                results[image_path.name] = self.analysis_cache[image_path.name]
                continue
            
            # Analyze image
            analysis = self.analyze_image(str(image_path))
            results[image_path.name] = analysis
            self.analysis_cache[image_path.name] = analysis
            
            # Save progress every 5 images
            if (i + 1) % 5 == 0:
                self.save_results(results, "openrouter_analysis_progress.json")
        
        return results
    
    def save_results(self, results: Dict, filename: str):
        """Save analysis results"""
        output = {
            "timestamp": datetime.now().isoformat(),
            "model": self.model,
            "total_images": len(results),
            "results": results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved results to {filename}")
    
    def generate_fixes(self, analysis_results: Dict, products: List[Dict]) -> List[Dict]:
        """Generate product-to-image fixes based on analysis"""
        fixes = []
        
        for product in products:
            product_name = product['name'].lower()
            current_image = product['image'].split('/')[-1]
            
            # Find best matching image
            best_match = None
            best_score = 0
            best_reason = ""
            
            for image_name, analysis in analysis_results.items():
                if 'error' in analysis:
                    continue
                    
                score = 0
                reasons = []
                
                # Check for OKARA products
                if 'okara' in product_name:
                    if analysis.get('is_okara') or analysis.get('packaging', {}).get('is_green_box'):
                        score += 0.7
                        reasons.append("OKARA product matches green box image")
                
                # Product type matching
                product_type = analysis.get('product_type', '').lower()
                
                if 'schnitzel' in product_name and 'schnitzel' in product_type:
                    score += 0.5
                    reasons.append("Schnitzel type match")
                elif 'burger' in product_name and 'burger' in product_type:
                    score += 0.5
                    reasons.append("Burger type match")
                elif 'tofu' in product_name and 'tofu' in product_type:
                    score += 0.5
                    reasons.append("Tofu type match")
                elif 'shawarma' in product_name and 'shawarma' in product_type:
                    score += 0.5
                    reasons.append("Shawarma type match")
                
                # Hebrew text matching
                hebrew_text = analysis.get('hebrew_text', '')
                if hebrew_text and product.get('nameHe'):
                    if any(word in hebrew_text for word in product['nameHe'].split()):
                        score += 0.3
                        reasons.append("Hebrew text match")
                
                if score > best_score:
                    best_score = score
                    best_match = image_name
                    best_reason = "; ".join(reasons)
            
            # Create fix if needed
            if best_match and best_match != current_image and best_score > 0.4:
                fixes.append({
                    'product_id': product['id'],
                    'product_name': product['name'],
                    'current_image': current_image,
                    'suggested_image': best_match,
                    'confidence': best_score,
                    'reason': best_reason or "AI vision analysis"
                })
        
        return fixes

def main():
    """Main function"""
    # Use the working API key
    API_KEY = "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"
    
    os.chdir('/Users/mac/Downloads/kfar-final/kfar-marketplace-app')
    
    print("🤖 OpenRouter Image Analysis System")
    print("Using Gemini 2.5 Flash for vision analysis")
    print("=" * 60)
    
    analyzer = OpenRouterImageAnalyzer(API_KEY)
    
    # Test with a few images first
    print("\n📸 Starting with 5 images to test...")
    
    image_dir = "public/images/vendors/teva-deli"
    results = analyzer.analyze_all_images(image_dir, limit=5)
    
    # Save test results
    analyzer.save_results(results, "openrouter_test_results.json")
    
    print(f"\n✅ Test complete! Analyzed {len(results)} images")
    print("Check openrouter_test_results.json for details")
    
    # Ask to continue
    print("\n🤔 Results look good?")
    print("Run full analysis with: python3 openrouter-image-analyzer.py --full")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--full":
        # Full analysis mode
        API_KEY = "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"
        analyzer = OpenRouterImageAnalyzer(API_KEY)
        
        print("Running full analysis on all images...")
        results = analyzer.analyze_all_images("public/images/vendors/teva-deli")
        analyzer.save_results(results, "openrouter_full_analysis.json")
        
        print(f"\n✅ Complete! Analyzed {len(results)} images")
    else:
        main()