#!/usr/bin/env python3
"""
Comprehensive Image Audit and Mapping Solution for KFAR Marketplace
This script uses AI vision analysis to automatically audit all product images
and create proper mappings based on actual content.
"""

import os
import json
import base64
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import requests
from PIL import Image
import anthropic
from dataclasses import dataclass, asdict
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class ImageAnalysis:
    """Store image analysis results"""
    filename: str
    path: str
    actual_content: str
    product_type: str
    visual_description: str
    hebrew_text: Optional[str]
    brand_visible: Optional[str]
    packaging_type: Optional[str]
    color_scheme: str
    confidence: float
    suggested_products: List[str]
    hash: str

@dataclass
class ProductMapping:
    """Store product to image mapping"""
    product_id: str
    product_name: str
    product_name_he: str
    category: str
    current_image: str
    suggested_image: str
    confidence: float
    reason: str

class ImageAuditSystem:
    def __init__(self, api_key: str, image_dir: str = "public/images/vendors/teva-deli"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.image_dir = Path(image_dir)
        self.analysis_results: Dict[str, ImageAnalysis] = {}
        self.product_mappings: List[ProductMapping] = []
        
    def encode_image(self, image_path: Path) -> str:
        """Encode image to base64 for API"""
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode('utf-8')
    
    def get_image_hash(self, image_path: Path) -> str:
        """Get hash of image for deduplication"""
        with open(image_path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    
    def analyze_image(self, image_path: Path) -> ImageAnalysis:
        """Analyze a single image using Claude Vision"""
        logger.info(f"Analyzing image: {image_path.name}")
        
        image_data = self.encode_image(image_path)
        
        prompt = """Analyze this food product image and provide detailed information:

1. What is the actual content of this image? (e.g., tofu block, schnitzel, burger patties, etc.)
2. What type of product category does this belong to?
3. Describe the visual appearance in detail
4. Is there any Hebrew text visible? If yes, what does it say?
5. Is any brand name visible?
6. What type of packaging is shown? (box, wrapper, none, etc.)
7. What is the dominant color scheme?
8. Based on the content, what products would this image be suitable for?

Respond in JSON format with these exact keys:
{
    "actual_content": "what the image actually shows",
    "product_type": "category like tofu, schnitzel, burger, etc",
    "visual_description": "detailed description",
    "hebrew_text": "any Hebrew text or null",
    "brand_visible": "brand name or null",
    "packaging_type": "box, wrapper, tray, none, etc",
    "color_scheme": "dominant colors",
    "confidence": 0.0-1.0,
    "suggested_products": ["list", "of", "suitable", "product", "types"]
}"""
        
        try:
            response = self.client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                messages=[{
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": image_data
                            }
                        }
                    ]
                }]
            )
            
            # Parse the JSON response
            result = json.loads(response.content[0].text)
            
            return ImageAnalysis(
                filename=image_path.name,
                path=str(image_path),
                hash=self.get_image_hash(image_path),
                **result
            )
            
        except Exception as e:
            logger.error(f"Error analyzing {image_path.name}: {str(e)}")
            # Return a basic analysis on error
            return ImageAnalysis(
                filename=image_path.name,
                path=str(image_path),
                hash=self.get_image_hash(image_path),
                actual_content="unknown",
                product_type="unknown",
                visual_description="Analysis failed",
                hebrew_text=None,
                brand_visible=None,
                packaging_type="unknown",
                color_scheme="unknown",
                confidence=0.0,
                suggested_products=[]
            )
    
    def audit_all_images(self) -> None:
        """Audit all images in the directory"""
        image_files = list(self.image_dir.glob("*.jpg")) + list(self.image_dir.glob("*.png"))
        logger.info(f"Found {len(image_files)} images to analyze")
        
        for image_path in image_files:
            if image_path.name not in self.analysis_results:
                analysis = self.analyze_image(image_path)
                self.analysis_results[image_path.name] = analysis
                
                # Save progress after each image
                self.save_analysis_results()
    
    def load_product_data(self, catalog_path: str) -> List[Dict]:
        """Load product data from TypeScript catalog"""
        with open(catalog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract products using regex (simplified - in production use proper parser)
        import re
        products = []
        
        # Pattern to match product objects
        pattern = r'{\s*id:\s*[\'"]([^\'"]*)[\'"]\s*,\s*name:\s*[\'"]([^\'"]*)[\'"]\s*,\s*nameHe:\s*[\'"]([^\'"]*)[\'"]\s*,.*?category:\s*[\'"]([^\'"]*)[\'"]\s*,.*?image:\s*[\'"]([^\'"]*)[\'"]\s*,'
        
        matches = re.finditer(pattern, content, re.DOTALL)
        for match in matches:
            products.append({
                'id': match.group(1),
                'name': match.group(2),
                'nameHe': match.group(3),
                'category': match.group(4),
                'image': match.group(5)
            })
        
        return products
    
    def create_smart_mappings(self, products: List[Dict]) -> None:
        """Create intelligent product-to-image mappings"""
        logger.info("Creating smart product mappings...")
        
        for product in products:
            best_match = self.find_best_image_match(product)
            
            current_image = product['image'].split('/')[-1]
            
            mapping = ProductMapping(
                product_id=product['id'],
                product_name=product['name'],
                product_name_he=product['nameHe'],
                category=product['category'],
                current_image=current_image,
                suggested_image=best_match['filename'],
                confidence=best_match['confidence'],
                reason=best_match['reason']
            )
            
            self.product_mappings.append(mapping)
    
    def find_best_image_match(self, product: Dict) -> Dict:
        """Find the best image match for a product"""
        product_name_lower = product['name'].lower()
        category = product['category']
        
        best_match = None
        best_score = 0
        best_reason = ""
        
        for filename, analysis in self.analysis_results.items():
            score = 0
            reasons = []
            
            # Category matching
            if category == 'schnitzels' and 'schnitzel' in analysis.actual_content.lower():
                score += 0.3
                reasons.append("Category match: schnitzel")
            elif category == 'burgers' and 'burger' in analysis.actual_content.lower():
                score += 0.3
                reasons.append("Category match: burger")
            elif category == 'tofu' and 'tofu' in analysis.actual_content.lower():
                score += 0.3
                reasons.append("Category match: tofu")
            
            # Product name matching
            if 'okara' in product_name_lower and 'okara' in analysis.actual_content.lower():
                score += 0.4
                reasons.append("Okara product match")
            elif 'schnitzel' in product_name_lower and 'schnitzel' in analysis.actual_content.lower():
                score += 0.3
                reasons.append("Schnitzel product match")
            elif 'burger' in product_name_lower and 'burger' in analysis.actual_content.lower():
                score += 0.3
                reasons.append("Burger product match")
            
            # Hebrew text matching
            if analysis.hebrew_text and product['nameHe']:
                if any(word in analysis.hebrew_text for word in product['nameHe'].split()):
                    score += 0.2
                    reasons.append("Hebrew text match")
            
            # Color scheme matching
            if 'green' in product_name_lower and 'green' in analysis.color_scheme.lower():
                score += 0.1
                reasons.append("Green color match")
            
            # Packaging type matching
            if 'pack' in product_name_lower and analysis.packaging_type in ['box', 'package']:
                score += 0.1
                reasons.append("Packaging type match")
            
            # Suggested products matching
            for suggested in analysis.suggested_products:
                if suggested.lower() in product_name_lower:
                    score += 0.2
                    reasons.append(f"Suggested for: {suggested}")
                    break
            
            if score > best_score:
                best_score = score
                best_match = analysis
                best_reason = "; ".join(reasons) if reasons else "Default assignment"
        
        if not best_match:
            # Fallback to current image
            current_image = product['image'].split('/')[-1]
            if current_image in self.analysis_results:
                best_match = self.analysis_results[current_image]
                best_reason = "Keeping current image (no better match found)"
            else:
                # Ultimate fallback
                best_match = list(self.analysis_results.values())[0]
                best_reason = "Fallback assignment"
                best_score = 0.1
        
        return {
            'filename': best_match.filename,
            'confidence': min(best_score, 1.0),
            'reason': best_reason
        }
    
    def save_analysis_results(self) -> None:
        """Save analysis results to JSON"""
        output = {
            'timestamp': datetime.now().isoformat(),
            'total_images': len(self.analysis_results),
            'images': {k: asdict(v) for k, v in self.analysis_results.items()}
        }
        
        with open('image_analysis_results.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved analysis results for {len(self.analysis_results)} images")
    
    def save_mapping_results(self) -> None:
        """Save mapping results to JSON"""
        output = {
            'timestamp': datetime.now().isoformat(),
            'total_mappings': len(self.product_mappings),
            'mappings': [asdict(m) for m in self.product_mappings]
        }
        
        with open('product_mapping_results.json', 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Saved mapping results for {len(self.product_mappings)} products")
    
    def generate_fix_script(self) -> None:
        """Generate JavaScript to fix the catalog"""
        fixes = []
        
        for mapping in self.product_mappings:
            if mapping.current_image != mapping.suggested_image and mapping.confidence > 0.5:
                fixes.append({
                    'id': mapping.product_id,
                    'name': mapping.product_name,
                    'current': mapping.current_image,
                    'suggested': mapping.suggested_image,
                    'confidence': mapping.confidence,
                    'reason': mapping.reason
                })
        
        script = """const fs = require('fs').promises;
const path = require('path');

async function applyImageFixes() {
  console.log('🎯 Applying AI-generated image fixes...\\n');
  
  const tevaPath = path.join(__dirname, '../lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  const fixes = """ + json.dumps(fixes, indent=2) + """;
  
  console.log(`Found ${fixes.length} images to fix\\n`);
  
  fixes.forEach(fix => {
    console.log(`${fix.id}: ${fix.name}`);
    console.log(`  Current: ${fix.current}`);
    console.log(`  Suggested: ${fix.suggested}`);
    console.log(`  Confidence: ${(fix.confidence * 100).toFixed(0)}%`);
    console.log(`  Reason: ${fix.reason}\\n`);
    
    // Apply the fix
    const oldPath = `/images/vendors/teva-deli/${fix.current}`;
    const newPath = `/images/vendors/teva-deli/${fix.suggested}`;
    
    content = content.replace(
      new RegExp(`(id: '${fix.id}',[\\\\s\\\\S]*?)image: '[^']*'`),
      `$1image: '${newPath}'`
    );
  });
  
  await fs.writeFile(tevaPath, content);
  console.log('✅ All fixes applied!');
}

applyImageFixes().catch(console.error);
"""
        
        with open('apply-ai-image-fixes.js', 'w') as f:
            f.write(script)
        
        logger.info(f"Generated fix script for {len(fixes)} images")
    
    def generate_visual_report(self) -> None:
        """Generate HTML visual report"""
        html = """<!DOCTYPE html>
<html>
<head>
    <title>Image Audit Report - KFAR Marketplace</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #478c0b; color: white; padding: 20px; border-radius: 8px; }
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
        .image-card { border: 2px solid #ddd; border-radius: 8px; padding: 10px; }
        .image-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; }
        .actual-content { background: #e8f5e9; padding: 8px; border-radius: 4px; margin: 10px 0; }
        .suggested-for { background: #fff3e0; padding: 8px; border-radius: 4px; }
        .hebrew-text { direction: rtl; background: #f3e5f5; padding: 8px; border-radius: 4px; margin: 5px 0; }
        .confidence { font-weight: bold; color: #478c0b; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Image Audit Report</h1>
        <p>AI-powered analysis of all Teva Deli product images</p>
    </div>
    
    <div class="image-grid">
"""
        
        for filename, analysis in sorted(self.analysis_results.items()):
            html += f"""
        <div class="image-card">
            <img src="/images/vendors/teva-deli/{filename}" alt="{filename}">
            <h3>{filename}</h3>
            <div class="actual-content">
                <strong>Actually shows:</strong> {analysis.actual_content}
            </div>
            <p><strong>Type:</strong> {analysis.product_type}</p>
            <p><strong>Description:</strong> {analysis.visual_description}</p>
            {f'<div class="hebrew-text"><strong>Hebrew text:</strong> {analysis.hebrew_text}</div>' if analysis.hebrew_text else ''}
            <p><strong>Packaging:</strong> {analysis.packaging_type}</p>
            <p><strong>Colors:</strong> {analysis.color_scheme}</p>
            <div class="suggested-for">
                <strong>Suitable for:</strong> {', '.join(analysis.suggested_products)}
            </div>
            <p class="confidence">Confidence: {int(analysis.confidence * 100)}%</p>
        </div>
"""
        
        html += """
    </div>
</body>
</html>"""
        
        with open('image_audit_report.html', 'w', encoding='utf-8') as f:
            f.write(html)
        
        logger.info("Generated visual HTML report")

def main():
    # Initialize the system
    API_KEY = os.environ.get('ANTHROPIC_API_KEY', 'your-api-key-here')
    auditor = ImageAuditSystem(API_KEY)
    
    # Step 1: Audit all images
    logger.info("Starting image audit...")
    auditor.audit_all_images()
    
    # Step 2: Load product data
    logger.info("Loading product catalog...")
    products = auditor.load_product_data('lib/data/teva-deli-complete-catalog.ts')
    
    # Step 3: Create smart mappings
    auditor.create_smart_mappings(products)
    
    # Step 4: Save all results
    auditor.save_analysis_results()
    auditor.save_mapping_results()
    
    # Step 5: Generate outputs
    auditor.generate_fix_script()
    auditor.generate_visual_report()
    
    logger.info("✅ Audit complete! Check the generated files:")
    logger.info("  - image_analysis_results.json")
    logger.info("  - product_mapping_results.json")
    logger.info("  - apply-ai-image-fixes.js")
    logger.info("  - image_audit_report.html")

if __name__ == "__main__":
    main()