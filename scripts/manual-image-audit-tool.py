#!/usr/bin/env python3
"""
Manual Image Audit Tool - Interactive solution for fixing image mappings
This tool helps manually audit and fix product-image relationships
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, List, Optional
import webbrowser
from datetime import datetime
import hashlib
from PIL import Image
import re

class ManualImageAuditor:
    def __init__(self, image_dir: str = "public/images/vendors/teva-deli"):
        self.image_dir = Path(image_dir)
        self.audit_data = self.load_audit_data()
        self.products = []
        
    def load_audit_data(self) -> Dict:
        """Load existing audit data or create new"""
        audit_file = Path("manual_image_audit.json")
        if audit_file.exists():
            with open(audit_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {
            "images": {},
            "mappings": {},
            "timestamp": datetime.now().isoformat()
        }
    
    def save_audit_data(self):
        """Save audit data"""
        self.audit_data["timestamp"] = datetime.now().isoformat()
        with open("manual_image_audit.json", 'w', encoding='utf-8') as f:
            json.dump(self.audit_data, f, indent=2, ensure_ascii=False)
    
    def generate_audit_html(self):
        """Generate interactive HTML for manual auditing"""
        images = sorted(self.image_dir.glob("*.jpg")) + sorted(self.image_dir.glob("*.png"))
        
        html = """<!DOCTYPE html>
<html>
<head>
    <title>Manual Image Audit Tool - KFAR Marketplace</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { 
            background: linear-gradient(135deg, #478c0b, #f6af0d); 
            color: white; 
            padding: 30px; 
            border-radius: 12px; 
            text-align: center;
            margin-bottom: 30px;
        }
        .progress { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .progress-bar {
            background: #e0e0e0;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
        }
        .progress-fill {
            background: #478c0b;
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }
        .controls {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .image-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .current-image {
            text-align: center;
            margin-bottom: 20px;
        }
        .current-image img {
            max-width: 600px;
            max-height: 400px;
            border: 3px solid #ddd;
            border-radius: 8px;
        }
        .form-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
        }
        input[type="text"], select, textarea {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        input[type="text"]:focus, select:focus, textarea:focus {
            border-color: #478c0b;
            outline: none;
        }
        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        .checkbox-group label {
            font-weight: normal;
            display: flex;
            align-items: center;
            cursor: pointer;
        }
        .checkbox-group input[type="checkbox"] {
            margin-right: 8px;
        }
        .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
        }
        button {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-primary {
            background: #478c0b;
            color: white;
        }
        .btn-primary:hover {
            background: #3a7009;
        }
        .btn-secondary {
            background: #666;
            color: white;
        }
        .btn-warning {
            background: #f6af0d;
            color: white;
        }
        .btn-danger {
            background: #c23c09;
            color: white;
        }
        .saved-data {
            background: #e8f5e9;
            padding: 15px;
            border-radius: 4px;
            margin-top: 10px;
        }
        .category-tags {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        .tag {
            background: #478c0b;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 14px;
        }
        .shortcuts {
            background: #fff3e0;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .shortcuts h3 {
            margin-top: 0;
        }
        .shortcut-key {
            background: #333;
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🖼️ Manual Image Audit Tool</h1>
        <p>Systematically audit and categorize all Teva Deli product images</p>
    </div>
    
    <div class="progress">
        <h3>Progress: <span id="progressText">0 / """ + str(len(images)) + """</span></h3>
        <div class="progress-bar">
            <div class="progress-fill" id="progressBar"></div>
        </div>
    </div>
    
    <div class="shortcuts">
        <h3>⌨️ Keyboard Shortcuts</h3>
        <p>
            <span class="shortcut-key">→</span> Next Image &nbsp;&nbsp;
            <span class="shortcut-key">←</span> Previous Image &nbsp;&nbsp;
            <span class="shortcut-key">S</span> Save Current &nbsp;&nbsp;
            <span class="shortcut-key">Enter</span> Save & Next
        </p>
    </div>
    
    <div class="controls">
        <div class="button-group">
            <button class="btn-secondary" onclick="previousImage()">← Previous</button>
            <button class="btn-primary" onclick="saveAndNext()">Save & Next →</button>
            <button class="btn-warning" onclick="skipImage()">Skip</button>
            <button class="btn-danger" onclick="exportData()">Export Results</button>
        </div>
    </div>
    
    <div class="image-container">
        <div class="current-image">
            <h2 id="imageName">Loading...</h2>
            <img id="currentImage" src="" alt="Current image">
        </div>
        
        <div class="form-section">
            <h3>Image Analysis</h3>
            
            <div class="form-group">
                <label>What does this image actually show?</label>
                <select id="actualContent" onchange="updateSuggestions()">
                    <option value="">-- Select --</option>
                    <option value="schnitzel">Schnitzel (breaded cutlet)</option>
                    <option value="burger">Burger patties</option>
                    <option value="okara">OKARA products (green box)</option>
                    <option value="tofu">Tofu (block/package)</option>
                    <option value="seitan">Seitan products</option>
                    <option value="shawarma">Shawarma</option>
                    <option value="kebab">Kebab/skewers</option>
                    <option value="sausage">Sausage/hot dogs</option>
                    <option value="ground">Ground meat substitute</option>
                    <option value="deli">Deli slices</option>
                    <option value="mixed">Mixed products/variety</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Packaging Type</label>
                <select id="packagingType">
                    <option value="">-- Select --</option>
                    <option value="box">Box</option>
                    <option value="tray">Tray</option>
                    <option value="wrapper">Wrapper/package</option>
                    <option value="vacuum">Vacuum sealed</option>
                    <option value="none">No packaging (product only)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Color Scheme</label>
                <input type="text" id="colorScheme" placeholder="e.g., green box, brown package, white label">
            </div>
            
            <div class="form-group">
                <label>Hebrew Text (if visible)</label>
                <input type="text" id="hebrewText" placeholder="Type any Hebrew text you see" style="direction: rtl;">
            </div>
            
            <div class="form-group">
                <label>Brand/Logo Visible</label>
                <input type="text" id="brandVisible" placeholder="e.g., Teva Deli, other brand, none">
            </div>
            
            <div class="form-group">
                <label>Suggested Product Types (check all that apply)</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="schnitzels"> Schnitzels</label>
                    <label><input type="checkbox" value="burgers"> Burgers</label>
                    <label><input type="checkbox" value="tofu"> Tofu Products</label>
                    <label><input type="checkbox" value="seitan"> Seitan Products</label>
                    <label><input type="checkbox" value="shawarma"> Shawarma</label>
                    <label><input type="checkbox" value="kebabs"> Kebabs</label>
                    <label><input type="checkbox" value="sausages"> Sausages</label>
                    <label><input type="checkbox" value="deli-meats"> Deli Meats</label>
                    <label><input type="checkbox" value="specialty"> Specialty Items</label>
                    <label><input type="checkbox" value="ready-meals"> Ready Meals</label>
                </div>
            </div>
            
            <div class="form-group">
                <label>Additional Notes</label>
                <textarea id="notes" rows="3" placeholder="Any additional observations..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Confidence Level</label>
                <select id="confidence">
                    <option value="1.0">High - Very certain</option>
                    <option value="0.8">Medium - Fairly certain</option>
                    <option value="0.5">Low - Uncertain</option>
                </select>
            </div>
        </div>
        
        <div id="savedIndicator" class="saved-data" style="display: none;">
            ✅ Data saved for this image
        </div>
    </div>
    
    <script>
        const images = """ + json.dumps([str(img.name) for img in images]) + """;
        let currentIndex = 0;
        let auditData = {};
        
        // Load saved data
        const savedData = localStorage.getItem('imageAuditData');
        if (savedData) {
            auditData = JSON.parse(savedData);
        }
        
        function loadImage(index) {
            if (index < 0 || index >= images.length) return;
            
            currentIndex = index;
            const imageName = images[index];
            
            document.getElementById('imageName').textContent = imageName;
            document.getElementById('currentImage').src = '/images/vendors/teva-deli/' + imageName;
            
            // Update progress
            const completed = Object.keys(auditData).length;
            document.getElementById('progressText').textContent = completed + ' / ' + images.length;
            document.getElementById('progressBar').style.width = (completed / images.length * 100) + '%';
            
            // Load saved data if exists
            if (auditData[imageName]) {
                const data = auditData[imageName];
                document.getElementById('actualContent').value = data.actualContent || '';
                document.getElementById('packagingType').value = data.packagingType || '';
                document.getElementById('colorScheme').value = data.colorScheme || '';
                document.getElementById('hebrewText').value = data.hebrewText || '';
                document.getElementById('brandVisible').value = data.brandVisible || '';
                document.getElementById('notes').value = data.notes || '';
                document.getElementById('confidence').value = data.confidence || '0.8';
                
                // Set checkboxes
                document.querySelectorAll('.checkbox-group input').forEach(cb => {
                    cb.checked = data.suggestedTypes && data.suggestedTypes.includes(cb.value);
                });
                
                document.getElementById('savedIndicator').style.display = 'block';
            } else {
                // Clear form
                document.getElementById('actualContent').value = '';
                document.getElementById('packagingType').value = '';
                document.getElementById('colorScheme').value = '';
                document.getElementById('hebrewText').value = '';
                document.getElementById('brandVisible').value = '';
                document.getElementById('notes').value = '';
                document.getElementById('confidence').value = '0.8';
                document.querySelectorAll('.checkbox-group input').forEach(cb => cb.checked = false);
                document.getElementById('savedIndicator').style.display = 'none';
            }
        }
        
        function saveCurrentImage() {
            const imageName = images[currentIndex];
            const suggestedTypes = [];
            document.querySelectorAll('.checkbox-group input:checked').forEach(cb => {
                suggestedTypes.push(cb.value);
            });
            
            auditData[imageName] = {
                actualContent: document.getElementById('actualContent').value,
                packagingType: document.getElementById('packagingType').value,
                colorScheme: document.getElementById('colorScheme').value,
                hebrewText: document.getElementById('hebrewText').value,
                brandVisible: document.getElementById('brandVisible').value,
                notes: document.getElementById('notes').value,
                confidence: document.getElementById('confidence').value,
                suggestedTypes: suggestedTypes,
                timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('imageAuditData', JSON.stringify(auditData));
            document.getElementById('savedIndicator').style.display = 'block';
            
            // Update progress
            const completed = Object.keys(auditData).length;
            document.getElementById('progressText').textContent = completed + ' / ' + images.length;
            document.getElementById('progressBar').style.width = (completed / images.length * 100) + '%';
        }
        
        function saveAndNext() {
            saveCurrentImage();
            setTimeout(() => nextImage(), 100);
        }
        
        function nextImage() {
            if (currentIndex < images.length - 1) {
                loadImage(currentIndex + 1);
            }
        }
        
        function previousImage() {
            if (currentIndex > 0) {
                loadImage(currentIndex - 1);
            }
        }
        
        function skipImage() {
            nextImage();
        }
        
        function updateSuggestions() {
            const content = document.getElementById('actualContent').value;
            const checkboxes = document.querySelectorAll('.checkbox-group input');
            
            // Auto-suggest based on content
            checkboxes.forEach(cb => cb.checked = false);
            
            switch(content) {
                case 'schnitzel':
                    document.querySelector('input[value="schnitzels"]').checked = true;
                    break;
                case 'burger':
                    document.querySelector('input[value="burgers"]').checked = true;
                    break;
                case 'tofu':
                    document.querySelector('input[value="tofu"]').checked = true;
                    break;
                case 'shawarma':
                    document.querySelector('input[value="shawarma"]').checked = true;
                    document.querySelector('input[value="ready-meals"]').checked = true;
                    break;
                case 'kebab':
                    document.querySelector('input[value="kebabs"]').checked = true;
                    break;
                case 'sausage':
                    document.querySelector('input[value="sausages"]').checked = true;
                    break;
                case 'deli':
                    document.querySelector('input[value="deli-meats"]').checked = true;
                    break;
                case 'okara':
                    document.querySelector('input[value="specialty"]').checked = true;
                    break;
            }
        }
        
        function exportData() {
            const dataStr = JSON.stringify(auditData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'image_audit_data.json';
            link.click();
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 's':
                case 'S':
                    saveCurrentImage();
                    break;
                case 'Enter':
                    if (!e.target.matches('textarea')) {
                        e.preventDefault();
                        saveAndNext();
                    }
                    break;
            }
        });
        
        // Load first image
        loadImage(0);
    </script>
</body>
</html>"""
        
        output_path = Path("manual_image_audit.html")
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        print(f"✅ Generated manual audit tool: {output_path}")
        print(f"📸 Total images to audit: {len(images)}")
        return str(output_path.absolute())
    
    def process_audit_results(self, audit_json_path: str):
        """Process the manual audit results and create fixes"""
        with open(audit_json_path, 'r', encoding='utf-8') as f:
            audit_results = json.load(f)
        
        # Load product data
        products = self.load_products()
        
        # Create mapping recommendations
        mappings = []
        
        for product in products:
            best_match = self.find_best_match(product, audit_results)
            mappings.append({
                'product_id': product['id'],
                'product_name': product['name'],
                'current_image': product['image'].split('/')[-1],
                'recommended_image': best_match['image'],
                'confidence': best_match['confidence'],
                'reason': best_match['reason']
            })
        
        # Generate fix script
        self.generate_fixes(mappings)
        
        return mappings
    
    def load_products(self) -> List[Dict]:
        """Load products from TypeScript catalog"""
        catalog_path = Path("lib/data/teva-deli-complete-catalog.ts")
        with open(catalog_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        products = []
        # Simple regex extraction
        pattern = r"id: '([^']+)'.*?name: '([^']+)'.*?nameHe: '([^']+)'.*?category: '([^']+)'.*?image: '([^']+)'"
        
        for match in re.finditer(pattern, content, re.DOTALL):
            products.append({
                'id': match.group(1),
                'name': match.group(2),
                'nameHe': match.group(3),
                'category': match.group(4),
                'image': match.group(5)
            })
        
        return products
    
    def find_best_match(self, product: Dict, audit_results: Dict) -> Dict:
        """Find best image match based on audit data"""
        best_score = 0
        best_image = product['image'].split('/')[-1]
        best_reason = "Default (no better match)"
        
        for image_name, audit_data in audit_results.items():
            if not audit_data.get('actualContent'):
                continue
                
            score = 0
            reasons = []
            
            # Category matching
            if product['category'] in audit_data.get('suggestedTypes', []):
                score += 0.4
                reasons.append(f"Category match: {product['category']}")
            
            # Content type matching
            product_lower = product['name'].lower()
            actual_content = audit_data.get('actualContent', '').lower()
            
            if actual_content in product_lower:
                score += 0.3
                reasons.append(f"Content match: {actual_content}")
            
            # Hebrew text matching
            if audit_data.get('hebrewText') and product['nameHe']:
                if any(word in audit_data['hebrewText'] for word in product['nameHe'].split()):
                    score += 0.2
                    reasons.append("Hebrew text match")
            
            # Special cases
            if 'okara' in product_lower and actual_content == 'okara':
                score += 0.5
                reasons.append("OKARA product confirmed")
            
            if score > best_score:
                best_score = score
                best_image = image_name
                best_reason = "; ".join(reasons)
        
        return {
            'image': best_image,
            'confidence': min(best_score, 1.0),
            'reason': best_reason
        }
    
    def generate_fixes(self, mappings: List[Dict]):
        """Generate JavaScript fix file"""
        fixes = [m for m in mappings if m['current_image'] != m['recommended_image'] and m['confidence'] > 0.5]
        
        script = f"""// Auto-generated fixes based on manual image audit
// Generated: {datetime.now().isoformat()}

const fs = require('fs').promises;
const path = require('path');

async function applyManualAuditFixes() {{
  console.log('🎯 Applying manual audit fixes...\\n');
  
  const tevaPath = path.join(__dirname, 'lib/data/teva-deli-complete-catalog.ts');
  let content = await fs.readFile(tevaPath, 'utf-8');
  
  const fixes = {json.dumps(fixes, indent=2)};
  
  console.log(`Applying ${{fixes.length}} fixes...\\n`);
  
  fixes.forEach(fix => {{
    console.log(`${{fix.product_id}}: ${{fix.product_name}}`);
    console.log(`  Current: ${{fix.current_image}}`);
    console.log(`  New: ${{fix.recommended_image}}`);
    console.log(`  Confidence: ${{(fix.confidence * 100).toFixed(0)}}%`);
    console.log(`  Reason: ${{fix.reason}}\\n`);
    
    const newPath = `/images/vendors/teva-deli/${{fix.recommended_image}}`;
    const regex = new RegExp(`(id: '${{fix.product_id}}',[\\\\s\\\\S]*?)image: '[^']*'`);
    content = content.replace(regex, `$1image: '${{newPath}}'`);
  }});
  
  await fs.writeFile(tevaPath, content);
  console.log('✅ All fixes applied!');
}}

applyManualAuditFixes().catch(console.error);"""
        
        with open('apply-manual-audit-fixes.js', 'w') as f:
            f.write(script)
        
        print(f"✅ Generated fix script with {len(fixes)} fixes")

def main():
    print("🚀 Manual Image Audit Tool\n")
    
    auditor = ManualImageAuditor()
    
    print("Select option:")
    print("1. Generate manual audit HTML tool")
    print("2. Process audit results and create fixes")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        html_path = auditor.generate_audit_html()
        print(f"\n✅ Success! Open this file in your browser:")
        print(f"   {html_path}")
        print("\nInstructions:")
        print("1. Open the HTML file in your browser")
        print("2. Go through each image and fill in the details")
        print("3. Use keyboard shortcuts for faster auditing")
        print("4. Export the results when done")
        
    elif choice == "2":
        json_path = input("Enter path to audit JSON file: ").strip()
        if os.path.exists(json_path):
            mappings = auditor.process_audit_results(json_path)
            print(f"\n✅ Processed {len(mappings)} products")
            print("Generated: apply-manual-audit-fixes.js")
            print("\nRun: node apply-manual-audit-fixes.js")
        else:
            print("❌ File not found")

if __name__ == "__main__":
    main()