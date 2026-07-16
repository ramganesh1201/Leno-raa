const fs = require("fs");
const crypto = require("crypto");

const filePath = "./src/lib/catalog.ts";
let content = fs.readFileSync(filePath, "utf8");

// Add id to interface
if (!content.includes("id: string;")) {
  content = content.replace(
    "export interface Product {",
    "export interface Product {\n  id: string;",
  );
}

// Find all products and add id if missing
const productRegex = /slug:\s*["']([^"']+)["']/g;
let match;
const products = [];

while ((match = productRegex.exec(content)) !== null) {
  products.push({
    slug: match[1],
    index: match.index,
  });
}

// Process in reverse to not mess up indices
for (let i = products.length - 1; i >= 0; i--) {
  const p = products[i];
  const blockStart = content.lastIndexOf("{", p.index);
  const blockEnd = content.indexOf("}", p.index);
  const block = content.substring(blockStart, blockEnd + 1);

  if (block.includes("slug:") && !block.includes("id:")) {
    const id = crypto.randomUUID();
    const newBlock = block.replace(/(slug:\s*["'][^"']+["'],)/, `$1\n    id: "${id}",`);
    content = content.substring(0, blockStart) + newBlock + content.substring(blockEnd + 1);
  }
}

fs.writeFileSync(filePath, content);
console.log("Updated catalog.ts with UUIDs");
