#!/usr/bin/env node

// Find the actual Image component causing the error

const fs = require('fs');
const path = require('path');

console.log('🎯 Finding the exact Image component without alt attribute...\n');

// Most likely pages based on common user flow
const priorityFiles = [
  'app/page.tsx',
  'app/marketplace/page.tsx',
  'app/product/[id]/page.tsx',
  'app/cart/page.tsx',
  'app/vendors/page.tsx',
  'app/vendor/[id]/page.tsx',
  'components/layout/Header.tsx',
  'components/layout/HeaderSystem.tsx',
  'components/ui/HeroSection.tsx',
  'components/ui/FeaturedProducts.tsx'
];

priorityFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Look for Image tags
    lines.forEach((line, index) => {
      if (line.includes('<Image') && !line.includes('ImageCropper') && !line.includes('ImageGallery')) {
        // Check if this line or next few lines have alt
        let hasAlt = false;
        for (let i = 0; i < 5 && (index + i) < lines.length; i++) {
          if (lines[index + i].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[index + i].includes('/>')) {
            break;
          }
        }
        
        if (!hasAlt) {
          console.log(`❌ Found Image without alt in ${file} at line ${index + 1}:`);
          console.log(`   ${line.trim()}`);
          console.log('');
        }
      }
    });
  }
});

console.log('\nChecking for dynamic Image components...\n');

// Check for Images with conditional rendering
const checkPatterns = [
  /<Image[^>]*\{[^}]*\}[^>]*>/g,  // Dynamic props
  /<Image[^>]*\s+(?!alt)[^>]*>/g  // Missing alt
];

priorityFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for Images that might have dynamic alt text issues
    const imageMatches = content.match(/<Image[^>]*>/g) || [];
    
    imageMatches.forEach(match => {
      if (!match.includes('alt=')) {
        console.log(`🔍 Potential issue in ${file}:`);
        console.log(`   ${match}`);
        console.log('');
      }
    });
  }
});
