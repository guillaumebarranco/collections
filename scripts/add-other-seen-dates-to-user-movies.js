/**
 * Insère `otherSeenDates: []` après chaque ligne lastViewedDate,
 * sans modifier aucune autre propriété.
 */
const fs = require('fs');
const path = require('path');

const usersRoot = path.join(__dirname, '..', 'src', 'app', 'utils', 'users');

const INSERT_PATTERN =
  /(lastViewedDate:\s*[^,\r\n]+,)(\r?\n)(\s*seenAtCinema:)/g;

function listMovieFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listMovieFiles(full, out);
    } else if (
      entry.name.endsWith('.ts') &&
      entry.name !== 'index.ts' &&
      full.includes(`${path.sep}movies${path.sep}`)
    ) {
      out.push(full);
    }
  }
  return out;
}

function addOtherSeenDates(content) {
  if (content.includes('otherSeenDates:')) {
    return { content, changed: false, reason: 'already-present' };
  }
  if (!INSERT_PATTERN.test(content)) {
    INSERT_PATTERN.lastIndex = 0;
    return { content, changed: false, reason: 'no-movie-objects' };
  }
  INSERT_PATTERN.lastIndex = 0;

  const next = content.replace(
    INSERT_PATTERN,
    (match, lastViewedLine, newline, seenAtCinemaLine) =>
      `${lastViewedLine}${newline}    otherSeenDates: [],${newline}${seenAtCinemaLine}`
  );

  return { content: next, changed: next !== content, reason: 'updated' };
}

let updated = 0;
let skipped = 0;

for (const filePath of listMovieFiles(usersRoot)) {
  const original = fs.readFileSync(filePath, 'utf8');
  const { content, changed, reason } = addOtherSeenDates(original);

  if (!changed) {
    skipped += 1;
    continue;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  updated += 1;
  console.log('OK', path.relative(usersRoot, filePath));
}

console.log(`Done: ${updated} updated, ${skipped} skipped.`);
