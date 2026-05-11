const fs = require('fs');

const file = process.argv[2];
const threshold = parseInt(process.argv[3] || '3', 10);
if (!file) {
  console.error('Usage: node list-few-actors-per-file.js <file> [threshold]');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');

// Split based on `title:` occurrences - each movie has one
// Use simple regex to find each movie block
const movieBlocks = [];
const titleRegex = /title:\s*['"](.*?)['"]/g;
let match;
const positions = [];
while ((match = titleRegex.exec(content)) !== null) {
  positions.push(match.index);
}

for (let i = 0; i < positions.length; i++) {
  const start = positions[i];
  const end = i + 1 < positions.length ? positions[i + 1] : content.length;
  movieBlocks.push(content.substring(start, end));
}

const results = [];
for (const block of movieBlocks) {
  const titleMatch = block.match(/title:\s*['"](.*?)['"]/);
  const directorMatch = block.match(/director:\s*['"](.*?)['"]/);
  if (!titleMatch || !directorMatch) continue;
  const actorsMatch = block.match(/actors:\s*\[([\s\S]*?)\],/);
  if (!actorsMatch) continue;
  const actorNames = [...actorsMatch[1].matchAll(/name:\s*['"](.*?)['"]/g)].map((m) => m[1]);
  if (actorNames.length <= threshold) {
    results.push({ title: titleMatch[1], director: directorMatch[1], actors: actorNames });
  }
}
console.log(JSON.stringify(results, null, 2));
console.log(`\nTotal: ${results.length} films avec <= ${threshold} acteurs`);
