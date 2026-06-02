/**
 * Ajoute reading: false et watching: false dans les fichiers utilisateur
 * lorsque ces propriétés sont absentes.
 */
import fs from 'fs';
import path from 'path';

const usersDir = path.join(__dirname, '..', 'src', 'app', 'utils', 'users');

function walk(dir: string, files: string[] = []): string[] {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      walk(p, files);
    } else if (name.endsWith('.ts')) {
      files.push(p);
    }
  }
  return files;
}

function eolOf(before: string): string {
  return before.endsWith('\r\n') ? '\r\n' : '\n';
}

function patchFile(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  const isBook = /\/books\//.test(normalized);
  const isManga = /\/mangas\//.test(normalized);
  const isManwha = /\/manwhas\//.test(normalized);
  const isSeries = /\/series\//.test(normalized);

  if (!isBook && !isManga && !isManwha && !isSeries) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  if (isBook || isManga || isManwha) {
    const insertReadingBeforeReadTimes = (
      re: RegExp
    ): void => {
      content = content.replace(re, (match, before: string) => {
        if (/reading:/.test(match)) {
          return match;
        }
        return `${before}    reading: false,${eolOf(before)}    readTimes:`;
      });
    };
    insertReadingBeforeReadTimes(
      /(\r?\n    rating: [^\r\n]+,\r?\n)(?!    reading:)(    readTimes:)/g
    );
    insertReadingBeforeReadTimes(
      /(\r?\n    otherReadDates: [^\r\n]+,\r?\n)(?!    reading:)(    readTimes:)/g
    );
    insertReadingBeforeReadTimes(
      /(\r?\n    readingScanStopDate: [^\r\n]+,\r?\n)(?!    reading:)(    readTimes:)/g
    );
  }

  if (isSeries) {
    content = content.replace(
      /(\r?\n        seasonRating: [^\r\n]+,\r?\n)(?!        watching:)(        seasonTimesWatched:)/g,
      (match, before) =>
        `${before}        watching: false,${eolOf(before)}        seasonTimesWatched:`
    );
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

let count = 0;
for (const file of walk(usersDir)) {
  if (patchFile(file)) {
    console.log('patched', path.relative(usersDir, file));
    count += 1;
  }
}
console.log(`Done: ${count} file(s) updated.`);
