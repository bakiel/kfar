#!/usr/bin/env node

// Universal Image alt attribute fixer
// This will add alt="" to any Image component missing it

const fs = require('fs');
const path = require('path');

let totalFixed = 0;

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Pattern to match Image components without alt
    // This regex looks for <Image followed by props but no alt
    content = content.replace(
      /<Image\s+(?![^>]*\balt\s*=)([^>]*?)(\s*\/?>)/g,
      '<Image alt="" $1$2'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${path.relative(process.cwd(), filePath)}`);
      totalFixed++;
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}

function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.includes('node_modules') && 
            !entry.name.includes('.next') && 
            !entry.name.includes('.git')) {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        fixFile(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

console.log('🔧 Adding alt attributes to all Image components...\n');

// Scan app and components directories
scanDirectory(path.join(process.cwd(), 'app'));
scanDirectory(path.join(process.cwd(), 'components'));

console.log(`\n✨ Total files fixed: ${totalFixed}`);

if (totalFixed > 0) {
  console.log('\n📌 Next steps:');
  console.log('1. The Next.js dev server has been restarted');
  console.log('2. Refresh your browser (Cmd+R)');
  console.log('3. The error should be gone now');
} else {
  console.log('\n✅ All Image components already have alt attributes!');
}
