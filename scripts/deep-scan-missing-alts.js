#!/usr/bin/env node

// Deep scan for Image components without alt attributes
// This will check for all possible patterns

const fs = require('fs');
const path = require('path');

console.log('🔍 Deep scanning for Image components without alt attributes...\n');

const issues = [];

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip imports and type definitions
      if (line.includes('import') || line.includes('interface') || line.includes('type ')) {
        continue;
      }
      
      // Check if line contains <Image
      if (line.includes('<Image')) {
        // Build the complete tag
        let tagContent = '';
        let startLine = i;
        let j = i;
        
        // Collect lines until we find the closing >
        while (j < lines.length && !tagContent.includes('>')) {
          tagContent += lines[j] + '\n';
          j++;
        }
        
        // Check if this tag has alt attribute
        if (!tagContent.includes('alt=')) {
          // Extract context
          const contextStart = Math.max(0, i - 2);
          const contextEnd = Math.min(lines.length - 1, j + 2);
          const context = lines.slice(contextStart, contextEnd).join('\n');
          
          issues.push({
            file: filePath,
            line: startLine + 1,
            content: tagContent.trim(),
            context: context
          });
        }
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (entry.isFile() && /\.(tsx?|jsx?)$/.test(entry.name)) {
        scanFile(fullPath);
      }
    }
  } catch (error) {
    // Ignore errors
  }
}

// Scan all directories
scanDirectory(path.join(__dirname, '../app'));
scanDirectory(path.join(__dirname, '../components'));

if (issues.length > 0) {
  console.log(`Found ${issues.length} Image components without alt attributes:\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${path.relative(process.cwd(), issue.file)}:${issue.line}`);
    console.log('   Content:', issue.content.replace(/\n/g, ' ').substring(0, 80) + '...');
    console.log('   Context:');
    console.log(issue.context.split('\n').map(l => '     ' + l).join('\n'));
    console.log();
  });
  
  // Save detailed report
  const reportPath = path.join(__dirname, '../missing-alt-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(issues, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
} else {
  console.log('✅ No Image components without alt attributes found!');
}
