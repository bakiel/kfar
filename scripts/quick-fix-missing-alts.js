#!/usr/bin/env node

// Quick fix for remaining Image components without alt attributes

const fs = require('fs');
const path = require('path');

const filesToCheck = [
  '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/components/ui/FeaturedProducts.tsx',
  '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/components/ui/ReviewsSection.tsx',
  '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/components/layout/HeaderSystem.tsx',
  '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/components/vendor/VendorStorePage.tsx',
  '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/app/vendor/onboarding/page.tsx'
];

console.log('🔍 Checking for Image components without alt attributes...\n');

filesToCheck.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      // Check if line contains <Image but not alt=
      if (lines[i].includes('<Image') && !lines[i].includes('alt=')) {
        // Check next few lines for alt attribute
        let hasAlt = false;
        for (let j = i; j < Math.min(i + 5, lines.length); j++) {
          if (lines[j].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[j].includes('/>') || lines[j].includes('</Image>')) {
            break;
          }
        }
        
        if (!hasAlt) {
          console.log(`Found Image without alt in ${path.basename(filePath)} at line ${i + 1}`);
          // Add alt attribute after <Image
          lines[i] = lines[i].replace('<Image', '<Image alt=""');
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, lines.join('\n'));
      console.log(`✓ Fixed ${path.basename(filePath)}`);
    }
  }
});

console.log('\n✅ Done checking!');
