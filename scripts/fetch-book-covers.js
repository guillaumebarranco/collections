/**
 * Script pour récupérer les vraies couvertures depuis Open Library
 * et mettre à jour base_books_from_dantes.ts.
 * Usage: node scripts/fetch-book-covers.js
 */

const fs = require('fs');
const path = require('path');

const PLACEHOLDER_URL = 'https://placehold.co/200x300/e8e8e8/999?text=Couverture';
const OPEN_LIBRARY_COVER_BASE = 'https://covers.openlibrary.org/b/id';

async function fetchCoverUrl(title, author, titleOnly = false) {
  const q = titleOnly ? title : [title, author].filter(Boolean).join(' ');
  const url = `https://openlibrary.org/search.json?${new URLSearchParams({ q }).toString()}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const doc = data.docs && data.docs[0];
    if (doc && doc.cover_i) {
      return `${OPEN_LIBRARY_COVER_BASE}/${doc.cover_i}-M.jpg`;
    }
  } catch (e) {
    if (!titleOnly) console.warn(`  Erreur API pour "${title}" / "${author}":`, e.message);
  }
  return null;
}

function extractTitle(line) {
  const m = line.match(/title:\s*"([^"]*)"/) || line.match(/title:\s*'([^']*)'/);
  return m ? m[1].trim() : null;
}

function extractAuthor(line) {
  const m = line.match(/author:\s*"([^"]*)"/) || line.match(/author:\s*'([^']*)'/);
  return m ? m[1].trim() : null;
}

function isPlaceholderCoverLine(line) {
  return line.includes("coverUrl: 'https://placehold.co/");
}

async function main() {
  const filePath = path.join(__dirname, '../src/app/utils/entities/books/base_books_from_dantes.ts');
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  let lastTitle = null;
  let lastAuthor = null;
  const replacements = [];
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = extractTitle(line);
    if (t !== null) lastTitle = t;
    const a = extractAuthor(line);
    if (a !== null) lastAuthor = a;

    if (isPlaceholderCoverLine(line)) {
      index++;
      let coverUrl = await fetchCoverUrl(lastTitle, lastAuthor);
      if (!coverUrl && lastTitle) coverUrl = await fetchCoverUrl(lastTitle, null, true);
      const newUrl = coverUrl || PLACEHOLDER_URL;
      const newLine = line.replace(PLACEHOLDER_URL, newUrl);
      replacements.push({ i, line: newLine, title: lastTitle, found: !!coverUrl });
      if (index % 10 === 0) console.log(`  Traité ${index} livres...`);
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  for (const { i, line } of replacements) {
    lines[i] = line;
  }

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

  const found = replacements.filter((r) => r.found).length;
  console.log(`Terminé: ${found}/${replacements.length} couvertures trouvées.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
