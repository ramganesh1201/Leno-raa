const fs = require('fs');
const path = require('path');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const files = getAllFiles('./src');
const maxMdMatches = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match both className="..." and template literals className={`...`}
  // Note: parsing template literals perfectly with regex is hard, this is naive.
  const regex = /className=(?:["']([^"']+)["']|\{`([^`]+)`\})/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const classStr = match[1] || match[2];
    if (classStr && classStr.includes('max-md:')) {
      maxMdMatches.push(classStr);
    }
  }
}

fs.writeFileSync('max-md-classes.json', JSON.stringify(maxMdMatches, null, 2));
console.log('Found ' + maxMdMatches.length + ' class strings with max-md:');
