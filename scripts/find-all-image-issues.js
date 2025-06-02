const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Files to check
const extensions = ['.tsx', '.jsx', '.ts', '.js'];
const excludeDirs = ['node_modules', '.next', '.git', 'dist', 'build'];

// Patterns to find
const patterns = {
  // Next.js Image without alt
  imageWithoutAlt: /<Image(?![^>]*\salt\s*=)[^>]*>/g,
  // Next.js Image with empty alt
  imageEmptyAlt: /<Image[^>]*\salt\s*=\s*["'][\s]*["'][^>]*>/g,
  // Next.js Image with duplicate alt
  imageDuplicateAlt: /<Image[^>]*\salt\s*=\s*["'][^"']*["'][^>]*\salt\s*=/g,
  // Dynamic Image creation
  newImage: /new\s+Image\s*\(\s*\)/g,
  // Image without alt in JSX return
  conditionalImage: /\{[^}]*&&[^}]*<Image(?![^>]*\salt\s*=)[^>]*>/g,
  // Map rendering Images
  mapImage: /\.map\s*\([^)]*\)\s*=>\s*[^{]*{[^}]*<Image(?![^>]*\salt\s*=)/g
};

function findInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Check each pattern
  for (const [patternName, pattern] of Object.entries(patterns)) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      // Get line number
      const lines = content.substring(0, match.index).split('\n');
      const lineNumber = lines.length;
      const line = content.split('\n')[lineNumber - 1];
      
      issues.push({
        type: patternName,
        line: lineNumber,
        content: line.trim(),
        match: match[0]
      });
    }
  }
  
  // Special check for Image imports without corresponding alt
  if (content.includes("from 'next/image'") || content.includes('from "next/image"')) {
    // Find all <Image components
    const imageComponents = content.matchAll(/<Image\s[^>]*>/g);
    for (const imageMatch of imageComponents) {
      const imageTag = imageMatch[0];
      // Check if it has alt attribute
      if (!imageTag.includes(' alt=')) {
        const lines = content.substring(0, imageMatch.index).split('\n');
        const lineNumber = lines.length;
        issues.push({
          type: 'missingAlt',
          line: lineNumber,
          content: imageTag,
          match: imageTag
        });
      }
    }
  }
  
  return issues;
}

function scanDirectory(dir) {
  const results = [];
  
  function walk(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!excludeDirs.includes(file)) {
          walk(filePath);
        }
      } else if (extensions.includes(path.extname(file))) {
        const issues = findInFile(filePath);
        if (issues.length > 0) {
          results.push({
            file: filePath,
            issues
          });
        }
      }
    }
  }
  
  walk(dir);
  return results;
}

// Run the scan
console.log(`${colors.blue}Scanning for Image components with alt issues...${colors.reset}\n`);

const results = scanDirectory('.');

if (results.length === 0) {
  console.log(`${colors.green}✓ No Image alt issues found!${colors.reset}`);
} else {
  console.log(`${colors.red}Found ${results.length} files with potential Image alt issues:${colors.reset}\n`);
  
  // Group by issue type
  const byType = {};
  let totalIssues = 0;
  
  for (const result of results) {
    console.log(`${colors.yellow}${result.file}:${colors.reset}`);
    for (const issue of result.issues) {
      console.log(`  Line ${issue.line}: ${colors.red}${issue.type}${colors.reset}`);
      console.log(`    ${issue.content}`);
      
      byType[issue.type] = (byType[issue.type] || 0) + 1;
      totalIssues++;
    }
    console.log('');
  }
  
  console.log(`${colors.blue}Summary:${colors.reset}`);
  console.log(`Total issues: ${colors.red}${totalIssues}${colors.reset}`);
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }
}

// Focus on checkout-related files
console.log(`\n${colors.blue}Checking checkout-specific files...${colors.reset}`);
const checkoutFiles = results.filter(r => 
  r.file.includes('checkout') || 
  r.file.includes('cart') || 
  r.file.includes('qr') ||
  r.file.includes('QR')
);

if (checkoutFiles.length > 0) {
  console.log(`\n${colors.yellow}Checkout-related files with issues:${colors.reset}`);
  for (const file of checkoutFiles) {
    console.log(`\n${file.file}:`);
    for (const issue of file.issues) {
      console.log(`  Line ${issue.line}: ${issue.type}`);
    }
  }
}