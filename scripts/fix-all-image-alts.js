#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files
const files = glob.sync('**/*.tsx', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
});

let totalFixed = 0;
const issues = [];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    let fileFixed = 0;

    // Pattern 1: Image components without alt attribute
    content = content.replace(/<Image\s+([^>]*?)(?<!alt=[^>]*)\/>/g, (match, attrs) => {
      if (!attrs.includes('alt=')) {
        fileFixed++;
        // Extract src to generate a meaningful alt
        const srcMatch = attrs.match(/src=\{([^}]+)\}|src="([^"]+)"/);
        let altText = 'Image';
        if (srcMatch) {
          const srcValue = srcMatch[1] || srcMatch[2];
          // Generate alt from src
          altText = srcValue.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Image';
        }
        return `<Image ${attrs.trim()} alt="${altText}" />`;
      }
      return match;
    });

    // Pattern 2: Image components with empty alt=""
    content = content.replace(/(<Image\s+[^>]*?)alt=""\s*([^>]*?>)/g, (match, before, after) => {
      fileFixed++;
      // Extract src to generate a meaningful alt
      const srcMatch = match.match(/src=\{([^}]+)\}|src="([^"]+)"/);
      let altText = 'Image';
      if (srcMatch) {
        const srcValue = srcMatch[1] || srcMatch[2];
        // Generate alt from src or nearby context
        altText = srcValue.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Image';
      }
      return `${before}alt="${altText}" ${after}`;
    });

    // Pattern 3: Image components with conditional alt that might be empty
    content = content.replace(/(<Image\s+[^>]*?)alt=\{([^}]+)\|\|\s*["']["']\}([^>]*?>)/g, (match, before, condition, after) => {
      fileFixed++;
      return `${before}alt={${condition} || "Image"}${after}`;
    });

    // Pattern 4: Image components with undefined/null alt
    content = content.replace(/(<Image\s+[^>]*?)alt=\{([^}]+)\}([^>]*?>)/g, (match, before, altExpr, after) => {
      // Check if the expression might evaluate to undefined/null
      if (altExpr.includes('?.') || altExpr.includes('undefined') || altExpr.includes('null')) {
        fileFixed++;
        return `${before}alt={${altExpr} || "Image"}${after}`;
      }
      return match;
    });

    // Pattern 5: Multi-line Image components
    const imageRegex = /<Image\s+([\s\S]*?)\/>/g;
    content = content.replace(imageRegex, (match) => {
      if (!match.includes('alt=')) {
        fileFixed++;
        // Extract src for alt text
        const srcMatch = match.match(/src=\{([^}]+)\}|src="([^"]+)"/);
        let altText = 'Image';
        if (srcMatch) {
          const srcValue = srcMatch[1] || srcMatch[2];
          altText = srcValue.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Image';
        }
        // Add alt before the closing />
        return match.replace(/\s*\/>/, ` alt="${altText}" />`);
      }
      return match;
    });

    // Special handling for cart and checkout pages
    if (file.includes('cart/page.tsx') || file.includes('checkout/page.tsx')) {
      // Ensure item.name is always used for alt
      content = content.replace(/alt=\{item\.name\}/g, 'alt={item.name || "Product image"}');
      
      // Fix any Image components in these files that might have dynamic alt
      content = content.replace(/<Image\s+([\s\S]*?)alt=\{([^}]+)\}([\s\S]*?)\/>/g, (match, before, altExpr, after) => {
        if (!altExpr.includes('||')) {
          return `<Image ${before}alt={${altExpr} || "Product image"}${after}/>`;
        }
        return match;
      });
    }

    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      totalFixed += fileFixed;
      issues.push({
        file,
        fixes: fileFixed
      });
      console.log(`Fixed ${fileFixed} issues in ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nTotal fixes applied: ${totalFixed}`);
console.log('\nFiles modified:');
issues.forEach(issue => {
  console.log(`  - ${issue.file}: ${issue.fixes} fixes`);
});

// Also create a comprehensive check script
const checkScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files
const files = glob.sync('**/*.tsx', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
});

let totalIssues = 0;
const problems = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\\n');
    
    lines.forEach((line, index) => {
      // Check for Image components without alt
      if (line.includes('<Image') && !line.includes('alt=')) {
        // Check next few lines for multi-line Image component
        let hasAlt = false;
        for (let i = 1; i <= 5 && index + i < lines.length; i++) {
          if (lines[index + i].includes('alt=')) {
            hasAlt = true;
            break;
          }
          if (lines[index + i].includes('/>') || lines[index + i].includes('>')) {
            break;
          }
        }
        
        if (!hasAlt) {
          totalIssues++;
          problems.push({
            file,
            line: index + 1,
            content: line.trim()
          });
        }
      }
      
      // Check for empty alt attributes
      if (line.includes('alt=""') || line.includes("alt=''")) {
        totalIssues++;
        problems.push({
          file,
          line: index + 1,
          content: line.trim(),
          issue: 'Empty alt attribute'
        });
      }
      
      // Check for potentially undefined alt
      const altMatch = line.match(/alt=\\{([^}]+)\\}/);
      if (altMatch && (altMatch[1].includes('?.') || !altMatch[1].includes('||'))) {
        // This might be undefined
        problems.push({
          file,
          line: index + 1,
          content: line.trim(),
          issue: 'Potentially undefined alt',
          warning: true
        });
      }
    });
  } catch (error) {
    console.error(\`Error checking \${file}:\`, error.message);
  }
});

console.log(\`\\nTotal issues found: \${totalIssues}\`);
console.log('\\nProblems:');
problems.forEach(problem => {
  console.log(\`  - \${problem.file}:\${problem.line} - \${problem.issue || 'Missing alt'}\`);
  console.log(\`    \${problem.content}\`);
});

if (totalIssues === 0) {
  console.log('\\n✅ All Image components have proper alt attributes!');
} else {
  console.log('\\n❌ Found Image components with missing or empty alt attributes.');
  console.log('Run npm run fix:alt to automatically fix these issues.');
}
`;

fs.writeFileSync('scripts/check-image-alts.js', checkScript);
console.log('\nAlso created scripts/check-image-alts.js to check for alt issues.');