const fs = require('fs');
const path = require('path');

const replacements = [
  {
    oldImport: "import ClientOnlyQR from '@/components/qr/ClientOnlyQR'",
    newImport: "import SafeQR from '@/components/qr/SafeQR'"
  },
  {
    oldImport: 'import ClientOnlyQR from "@/components/qr/ClientOnlyQR"',
    newImport: 'import SafeQR from "@/components/qr/SafeQR"'
  },
  {
    oldComponent: '<ClientOnlyQR',
    newComponent: '<SafeQR'
  },
  {
    oldComponent: '</ClientOnlyQR>',
    newComponent: '</SafeQR>'
  }
];

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.startsWith('.')) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(({ oldImport, newImport, oldComponent, newComponent }) => {
    if (oldImport && content.includes(oldImport)) {
      content = content.replace(new RegExp(oldImport, 'g'), newImport);
      modified = true;
    }
    if (oldComponent && content.includes(oldComponent)) {
      content = content.replace(new RegExp(oldComponent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newComponent);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
const rootDir = path.join(__dirname, '..');
const files = findFiles(rootDir);
let updatedCount = 0;

console.log(`Found ${files.length} files to check...`);

files.forEach(file => {
  if (replaceInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✨ Replaced ClientOnlyQR with SafeQR in ${updatedCount} files`);