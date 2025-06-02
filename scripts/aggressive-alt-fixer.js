#!/usr/bin/env node

// Aggressive Image alt fixer - finds and fixes ALL patterns

const fs = require('fs');
const path = require('path');

console.log('🔧 Running aggressive Image alt attribute fix...\n');

let totalFixed = 0;
const fixedFiles = [];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let modified = false;
    
    // Fix pattern 1: <Image on its own line
    content = content.replace(
      /(<Image)\s*\n/g,
      (match, p1) => {
        if (!match.includes('alt=')) {
          modified = true;
          return `${p1} alt=""\n`;
        }
        return match;
      }
    );
    
    // Fix pattern 2: <Image with props but no alt
    content = content.replace(
      /<Image\s+(?![^>]*\balt\s*=)([^>]*?)(\s*\/?>)/g,
      (match) => {
        modified = true;
        return match.replace('<Image', '<Image alt=""');
      }
    );
    
    // Fix pattern 3: Multi-line Image components
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<Image') && !lines[i].includes('alt=')) {
        // Check next 10 lines for alt
        let hasAlt = false;
        let closeIndex = i;
        
        for (let j = i; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[j].includes('/>') || lines[j].includes('</Image>')) {
            closeIndex = j;
            break;
          }
        }
        
        if (!hasAlt && closeIndex > i) {
          // Add alt to the Image line
          lines[i] = lines[i].replace('<Image', '<Image alt=""');
          modified = true;
        }
      }
    }
    
    if (modified) {
      content = lines.join('\n');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${path.relative(process.cwd(), filePath)}`);
      fixedFiles.push(filePath);
      totalFixed++;
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
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
            !entry.name.includes('.git') &&
            !entry.name.includes('scripts')) {
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

// Scan all directories
scanDirectory(path.join(process.cwd(), 'app'));
scanDirectory(path.join(process.cwd(), 'components'));
scanDirectory(path.join(process.cwd(), 'lib'));

console.log(`\n✨ Total files fixed: ${totalFixed}`);

if (fixedFiles.length > 0) {
  console.log('\nFiles modified:');
  fixedFiles.forEach(file => {
    console.log(`  - ${path.relative(process.cwd(), file)}`);
  });
}

// Now verify all files
console.log('\n🔍 Verifying all Image components have alt attributes...\n');

let remainingIssues = 0;

function verifyFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('<Image') && !lines[i].includes('ImageGallery')) {
        let hasAlt = false;
        
        // Check this line and next 10 lines
        for (let j = i; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[j].includes('/>')) {
            break;
          }
        }
        
        if (!hasAlt) {
          console.log(`⚠️  Still missing alt in ${path.relative(process.cwd(), filePath)}:${i + 1}`);
          remainingIssues++;
        }
      }
    }
  } catch (error) {
    // Ignore
  }
}

function verifyDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!entry.name.includes('node_modules') && 
            !entry.name.includes('.next') && 
            !entry.name.includes('.git')) {
          verifyDirectory(fullPath);
        }
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        verifyFile(fullPath);
      }
    }
  } catch (error) {
    // Ignore
  }
}

verifyDirectory(path.join(process.cwd(), 'app'));
verifyDirectory(path.join(process.cwd(), 'components'));

if (remainingIssues === 0) {
  console.log('✅ All Image components now have alt attributes!');
} else {
  console.log(`\n⚠️  ${remainingIssues} Image components still need alt attributes.`);
}

console.log('\n📌 Next steps:');
console.log('1. Clear your browser cache (Cmd+Shift+R)');
console.log('2. Restart the Next.js dev server if needed');
console.log('3. The error should be resolved');
