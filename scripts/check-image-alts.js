#!/usr/bin/env node

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
    const lines = content.split('\n');
    
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
      const altMatch = line.match(/alt=\{([^}]+)\}/);
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
    console.error(`Error checking ${file}:`, error.message);
  }
});

console.log(`\nTotal issues found: ${totalIssues}`);
console.log('\nProblems:');
problems.forEach(problem => {
  console.log(`  - ${problem.file}:${problem.line} - ${problem.issue || 'Missing alt'}`);
  console.log(`    ${problem.content}`);
});

if (totalIssues === 0) {
  console.log('\n✅ All Image components have proper alt attributes!');
} else {
  console.log('\n❌ Found Image components with missing or empty alt attributes.');
  console.log('Run npm run fix:alt to automatically fix these issues.');
}
