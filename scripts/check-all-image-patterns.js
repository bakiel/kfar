#!/usr/bin/env node

// Check for Image components in all possible patterns

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking all Image patterns for missing alt...\n');

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fileName = path.basename(filePath);
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip imports and types
      if (line.includes('import') || line.includes('interface') || line.includes('type ')) {
        continue;
      }
      
      // Check for Image component
      if (line.includes('<Image')) {
        // Get full tag
        let fullTag = line;
        let j = i;
        
        // If tag doesn't close on this line
        while (j < lines.length - 1 && !fullTag.includes('>')) {
          j++;
          fullTag += ' ' + lines[j].trim();
        }
        
        // Check if alt is missing
        if (!fullTag.includes('alt=')) {
          console.log(`\nFound in ${fileName}:${i + 1}`);
          console.log('Line:', line.trim());
          console.log('Full tag:', fullTag.substring(0, 150) + '...');
          
          // Check if it's in a conditional
          if (i > 0 && lines[i-1].includes('{') && lines[i-1].includes('&&')) {
            console.log('⚠️  This is in a conditional render');
          }
        }
      }
    }
  } catch (error) {
    // Ignore
  }
}

// Check main pages
const pages = [
  'app/page.tsx',
  'app/marketplace/page.tsx',
  'app/vendors/page.tsx',
  'app/product/[id]/page.tsx',
  'app/cart/page.tsx'
];

// Check components
const components = [
  'components/ui/HeroSection.tsx',
  'components/ui/FeaturedProducts.tsx',
  'components/layout/Header.tsx',
  'components/layout/HeaderSystem.tsx',
  'components/ui/FloatingNavigation.tsx'
];

[...pages, ...components].forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    checkFile(fullPath);
  }
});

// Also check any JSX returns that might have Image
console.log('\n\nChecking for Image in JSX returns...\n');

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for return statements with Image
      const returnMatches = content.match(/return\s*\([^)]*<Image[^>]*>/g) || [];
      
      returnMatches.forEach(match => {
        if (!match.includes('alt=')) {
          console.log(`Potential issue in ${path.relative(process.cwd(), fullPath)}:`);
          console.log(match.substring(0, 100) + '...');
        }
      });
    }
  });
}
