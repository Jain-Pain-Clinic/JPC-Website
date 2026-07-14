import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
const blockedPatterns = [
  '"@type":"Physician"',
  '"@type":"MedicalOrganization"',
  '"honorificPrefix"',
  '"jobTitle"',
  '"affiliation"',
  '"worksFor"',
  '"hasCredential"',
];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return walk(fullPath);
    }

    return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
  });
}

if (!fs.existsSync(outDir)) {
  console.warn("Skipping structured data check because out/ does not exist.");
  process.exit(0);
}

const failures = [];

for (const filePath of walk(outDir)) {
  const html = fs.readFileSync(filePath, "utf8");

  for (const pattern of blockedPatterns) {
    if (html.includes(pattern)) {
      failures.push(`${path.relative(process.cwd(), filePath)} contains ${pattern}`);
    }
  }
}

if (failures.length) {
  console.error("Structured data check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("Structured data check passed.");
