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
const extensions = ['.tsx', '.jsx'];
const excludeDirs = ['node_modules', '.next', '.git', 'dist', 'build'];

let totalFixed = 0;
let filesFixed = 0;

function fixDuplicateAltInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fixCount = 0;
  
  // Pattern to find Image components with duplicate alt attributes
  // This matches <Image alt="" ... alt="something" />
  const duplicateAltPattern = /<Image\s+alt\s*=\s*["'][^"']*["']([^>]*)\salt\s*=\s*["']([^"']*?)["']/g;
  
  // Fix duplicate alt attributes - keep the second one (usually has meaningful text)
  content = content.replace(duplicateAltPattern, (match, middle, altText) => {
    fixCount++;
    return `<Image${middle} alt="${altText}"`;
  });
  
  // Also check for the reverse pattern (alt after other props)
  const reversePattern = /<Image([^>]*)\salt\s*=\s*["'][^"']*["']([^>]*)\salt\s*=\s*["']([^"']*?)["']/g;
  content = content.replace(reversePattern, (match, before, middle, altText) => {
    fixCount++;
    return `<Image${before}${middle} alt="${altText}"`;
  });
  
  // Special case: Image on multiple lines with duplicate alt
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<Image') && lines[i].includes('alt=""')) {
      // Check next few lines for another alt attribute
      for (let j = 1; j <= 5 && i + j < lines.length; j++) {
        if (lines[i + j].includes('alt=')) {
          // Found duplicate alt, remove the empty one
          lines[i] = lines[i].replace(' alt=""', '');
          fixCount++;
          break;
        }
      }
    }
  }
  content = lines.join('\n');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed += fixCount;
    filesFixed++;
    return fixCount;
  }
  
  return 0;
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
        const fixes = fixDuplicateAltInFile(filePath);
        if (fixes > 0) {
          results.push({
            file: filePath,
            fixes
          });
        }
      }
    }
  }
  
  walk(dir);
  return results;
}

// Run the fix
console.log(`${colors.blue}Fixing all duplicate alt attributes...${colors.reset}\n`);

const results = scanDirectory('.');

if (results.length === 0) {
  console.log(`${colors.green}✓ No duplicate alt attributes found!${colors.reset}`);
} else {
  console.log(`${colors.green}✓ Fixed ${totalFixed} duplicate alt attributes in ${filesFixed} files:${colors.reset}\n`);
  
  for (const result of results) {
    console.log(`  ${colors.yellow}${result.file}${colors.reset} - ${result.fixes} fixes`);
  }
}

// Also fix any new Image() without alt
console.log(`\n${colors.blue}Checking for new Image() without alt attributes...${colors.reset}`);

const qrFiles = [
  './components/qr/SmartQRGenerator.tsx',
  './components/qr/SmartQRGeneratorCompact.tsx'
];

for (const file of qrFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Add alt to new Image() if not present
    content = content.replace(/const (\w+) = new Image\(\);(?!\s*\1\.alt)/g, (match, varName) => {
      return `const ${varName} = new Image();\n      ${varName}.alt = '${varName === 'qrImg' ? 'QR Code' : 'Logo'}';`;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`  ${colors.green}✓${colors.reset} Fixed new Image() in ${file}`);
    }
  }
}

console.log(`\n${colors.green}✓ All duplicate alt attributes have been fixed!${colors.reset}`);