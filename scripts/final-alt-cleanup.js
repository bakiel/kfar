#!/usr/bin/env node

// Final cleanup for any edge cases

const fs = require('fs');
const path = require('path');

console.log('🧹 Final cleanup for Image alt attributes...\n');

// Specific files that might have issues
const specificFixes = [
  {
    file: '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/app/admin/revenue-feed/page.tsx',
    check: true
  },
  {
    file: '/Users/mac/Downloads/kfar-final/kfar-marketplace-app/components/product/ImageGallery.tsx',
    check: true
  }
];

specificFixes.forEach(({ file, check }) => {
  if (fs.existsSync(file) && check) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
      // Skip TypeScript interfaces
      if (lines[i].includes('<ImageGalleryProps>') || 
          lines[i].includes('interface Image') ||
          lines[i].includes('type Image')) {
        continue;
      }
      
      // Check for actual Image components
      if (lines[i].includes('<Image') && !lines[i].includes('alt=')) {
        // Check next 5 lines for alt
        let hasAlt = false;
        let endLine = i;
        
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          if (lines[j].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[j].includes('/>')) {
            endLine = j;
            break;
          }
        }
        
        if (!hasAlt && lines[i].includes('src=')) {
          console.log(`Found Image without alt in ${path.basename(file)} at line ${i + 1}`);
          // Add alt attribute
          lines[i] = lines[i].replace('<Image', '<Image alt=""');
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(file, lines.join('\n'));
      console.log(`✅ Fixed ${path.basename(file)}`);
    }
  }
});

console.log('\n✨ Final cleanup complete!');
console.log('\n📌 Next steps:');
console.log('1. Restart your Next.js development server');
console.log('2. Clear your browser cache');
console.log('3. The alt attribute errors should be resolved');
