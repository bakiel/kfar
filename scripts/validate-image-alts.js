#!/usr/bin/env node

// Validation script to ensure all Image components have alt attributes

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating all Image components have alt attributes...\n');

let totalImages = 0;
let imagesWithAlt = 0;
let imagesWithoutAlt = 0;

function checkDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        checkDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        checkFile(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('<Image') || !content.includes('next/image')) {
      return;
    }
    
    // Count Image components
    const imageMatches = content.match(/<Image[^>]*>/g) || [];
    
    imageMatches.forEach(match => {
      totalImages++;
      if (match.includes('alt=')) {
        imagesWithAlt++;
      } else {
        imagesWithoutAlt++;
        console.log(`❌ Missing alt in ${path.relative(process.cwd(), filePath)}`);
        console.log(`   ${match.substring(0, 50)}...`);
      }
    });
  } catch (error) {
    // Ignore errors
  }
}

// Check app and components directories
checkDirectory(path.join(__dirname, '../app'));
checkDirectory(path.join(__dirname, '../components'));

console.log('\n📊 Validation Results:');
console.log(`Total Image components: ${totalImages}`);
console.log(`Images with alt: ${imagesWithAlt} ✅`);
console.log(`Images without alt: ${imagesWithoutAlt} ${imagesWithoutAlt > 0 ? '❌' : '✅'}`);

if (imagesWithoutAlt === 0) {
  console.log('\n✨ All Image components have alt attributes!');
} else {
  console.log('\n⚠️  Some Image components are still missing alt attributes.');
  console.log('Run: node scripts/comprehensive-alt-fixer.js to fix them.');
}

process.exit(imagesWithoutAlt > 0 ? 1 : 0);
