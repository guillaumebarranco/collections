/**
 * Clone the series stack into animes, then move catalogue and user rows
 * whose genre contains "Animation".
 *
 * Usage: node scripts/split-series-animes.js [--write]
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const write = process.argv.includes('--write');

const copyRoots = [
  'src/app/facades/series',
  'src/app/components/collections/serie',
  'src/app/containers/collections/series',
  'src/app/containers/admin-collections/series',
  'src/app/containers/edit/edit-serie',
  'src/app/containers/edit/edit-serie-seasons',
  'src/app/containers/add/add-serie',
  'src/app/containers/selection/series',
  'server/routes/series',
  'server/utils/series',
];

const copyFiles = [
  'src/app/models/serie-model.ts',
  'src/app/utils/series.utils.ts',
  'src/app/utils/series-season-chart.utils.ts',
  'src/app/utils/badges/series-badges.ts',
  'scripts/facades/local-series.facade.ts',
];

function renameRel(rel) {
  return rel
    .replace(/series/g, 'animes')
    .replace(/Series/g, 'Animes')
    .replace(/serie/g, 'anime')
    .replace(/Serie/g, 'Anime');
}

function transformCode(content) {
  const kept = [];
  let text = content.replace(/series_pictures/g, () => {
    kept.push('series_pictures');
    return `__KEEP_SERIES_PICTURES_${kept.length - 1}__`;
  });
  text = text
    .replace(/series/g, 'animes')
    .replace(/Series/g, 'Animes')
    .replace(/serie/g, 'anime')
    .replace(/Serie/g, 'Anime')
    .replace(/SERIES_/g, 'ANIMES_')
    .replace(/EntityType\.SERIE/g, 'EntityType.ANIME');
  text = text
    .replace(/sériethèque/g, 'animéthèque')
    .replace(/Sériethèque/g, 'Animéthèque')
    .replace(/cette série/g, 'cet animé')
    .replace(/Cette série/g, 'Cet animé')
    .replace(/une série/g, 'un animé')
    .replace(/Une série/g, 'Un animé')
    .replace(/la série/g, "l'animé")
    .replace(/La série/g, "L'animé")
    .replace(/de la série/g, "de l'animé")
    .replace(/séries terminées/g, 'animés terminés')
    .replace(/série terminée/g, 'animé terminé')
    .replace(/Séries/g, 'Animés')
    .replace(/séries/g, 'animés')
    .replace(/Série/g, 'Animé')
    .replace(/série/g, 'animé')
    .replace(/animés distinctes/g, 'animés distincts');
  text = text.replace(/__KEEP_SERIES_PICTURES_(\d+)__/g, () => 'series_pictures');
  return text;
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function cloneCode() {
  const jobs = [];
  for (const rel of copyRoots) {
    const abs = path.join(root, rel);
    for (const file of walkFiles(abs)) {
      jobs.push(path.relative(root, file));
    }
  }
  jobs.push(...copyFiles);

  let copied = 0;
  for (const rel of jobs) {
    const destRel = renameRel(rel.split(path.sep).join('/')).split('/').join(path.sep);
    const src = path.join(root, rel);
    const dest = path.join(root, destRel);
    if (!fs.existsSync(src)) {
      console.warn('missing source', rel);
      continue;
    }
    if (!write) {
      copied += 1;
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const raw = fs.readFileSync(src);
    if (src.endsWith('.ts') || src.endsWith('.html') || src.endsWith('.scss') || src.endsWith('.js')) {
      fs.writeFileSync(dest, transformCode(raw.toString('utf8')));
    } else {
      fs.writeFileSync(dest, raw);
    }
    copied += 1;
  }

  const badgesSrc = path.join(root, 'public', 'badges', 'series');
  const badgesDest = path.join(root, 'public', 'badges', 'animes');
  if (write && fs.existsSync(badgesSrc)) {
    fs.mkdirSync(badgesDest, { recursive: true });
    for (const name of fs.readdirSync(badgesSrc)) {
      fs.copyFileSync(path.join(badgesSrc, name), path.join(badgesDest, name));
    }
  }
  console.log(`${write ? 'copied' : 'would copy'} ${copied} code files`);
}

function matchingBracket(content, openIndex, openChar, closeChar) {
  let depth = 0;
  let quote = null;
  let i = openIndex;
  while (i < content.length) {
    const c = content[i];
    if (quote) {
      if (c === '\\') {
        i += 2;
        continue;
      }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      i += 1;
      continue;
    }
    if (c === '/' && content[i + 1] === '/') {
      i = content.indexOf('\n', i);
      if (i === -1) return -1;
      continue;
    }
    if (c === '/' && content[i + 1] === '*') {
      i = content.indexOf('*/', i + 2);
      if (i === -1) return -1;
      i += 2;
      continue;
    }
    if (c === openChar) depth += 1;
    else if (c === closeChar) {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  return -1;
}

function extractTopLevelObjects(body) {
  const objects = [];
  let i = 0;
  while (i < body.length) {
    const c = body[i];
    if (c === '"' || c === "'") {
      const q = c;
      i += 1;
      while (i < body.length) {
        if (body[i] === '\\') {
          i += 2;
          continue;
        }
        if (body[i] === q) {
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }
    if (c === '/' && body[i + 1] === '/') {
      const nl = body.indexOf('\n', i);
      i = nl === -1 ? body.length : nl + 1;
      continue;
    }
    if (c === '/' && body[i + 1] === '*') {
      const end = body.indexOf('*/', i + 2);
      i = end === -1 ? body.length : end + 2;
      continue;
    }
    if (c === '{') {
      const end = matchingBracket(body, i, '{', '}');
      if (end === -1) break;
      objects.push(body.slice(i, end + 1));
      i = end + 1;
      continue;
    }
    i += 1;
  }
  return objects;
}

function parseStringField(objectText, key) {
  const regex = new RegExp(
    `["']?${key}["']?\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`
  );
  const match = objectText.match(regex);
  if (!match) return null;
  const quote = match[1];
  const raw = match[2];
  return quote === '"'
    ? raw.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
    : raw.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
}

function parseStringArrayField(objectText, key) {
  const keyMatch = new RegExp(`\\n\\s*${key}\\s*:`).exec(objectText);
  if (!keyMatch) return [];
  const afterKey = objectText.slice(keyMatch.index);
  const bracketStart = afterKey.indexOf('[');
  if (bracketStart === -1) return [];
  const abs = keyMatch.index + bracketStart;
  const end = matchingBracket(objectText, abs, '[', ']');
  if (end === -1) return [];
  const inner = objectText.slice(abs + 1, end);
  const regex = /(['"])((?:\\.|(?!\1).)*)\1/g;
  const result = [];
  let match = regex.exec(inner);
  while (match) {
    const quote = match[1];
    const raw = match[2];
    result.push(
      quote === '"'
        ? raw.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        : raw.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
    );
    match = regex.exec(inner);
  }
  return result;
}

function isAnimation(objectText) {
  return parseStringArrayField(objectText, 'genre').some((genre) => {
    const value = genre.trim().toLowerCase();
    return value === 'animation' || value === 'anime' || value === 'animé';
  });
}

function identityKey(objectText) {
  const title = parseStringField(objectText, 'title');
  const director = parseStringField(objectText, 'director');
  if (!title || !director) return null;
  return `${title.trim().toLowerCase()}|${director.trim().toLowerCase()}`;
}

function splitArrayFile(content) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) return null;
  const equalsIndex = content.indexOf('=', exportIndex);
  const arrayStart = content.indexOf('[', equalsIndex === -1 ? exportIndex : equalsIndex);
  if (arrayStart === -1) return null;
  const arrayEnd = matchingBracket(content, arrayStart, '[', ']');
  if (arrayEnd === -1) return null;
  const objects = extractTopLevelObjects(content.slice(arrayStart + 1, arrayEnd));
  return {
    header: content.slice(0, arrayStart + 1),
    footer: content.slice(arrayEnd),
    objects,
  };
}

function rebuild(header, objects, footer) {
  if (objects.length === 0) {
    return `${header}\n${footer}`;
  }
  return `${header}\n${objects.join(',\n')},\n${footer}`;
}

function transformHeader(header) {
  return transformCode(header);
}

function migrateData() {
  const baseDir = path.join(root, 'src', 'app', 'utils', 'entities', 'series');
  const animeBaseDir = path.join(root, 'src', 'app', 'utils', 'entities', 'animes');
  const animeObjects = [];
  const keys = new Set();
  let baseKept = 0;

  for (const file of fs.readdirSync(baseDir).filter((name) => name.endsWith('.ts'))) {
    const full = path.join(baseDir, file);
    const parsed = splitArrayFile(fs.readFileSync(full, 'utf8'));
    if (!parsed) {
      console.warn('skip base file', file);
      continue;
    }
    const kept = [];
    for (const objectText of parsed.objects) {
      if (isAnimation(objectText)) {
        animeObjects.push(objectText);
        const key = identityKey(objectText);
        if (key) keys.add(key);
      } else {
        kept.push(objectText);
      }
    }
    baseKept += kept.length;
    console.log(
      `${file}: ${parsed.objects.length} → ${kept.length} séries, ${parsed.objects.length - kept.length} animés`
    );
    if (!write) continue;
    if (kept.length === 0 && file.includes('anime')) {
      fs.unlinkSync(full);
    } else {
      fs.writeFileSync(full, rebuild(parsed.header, kept, parsed.footer));
    }
  }

  if (write) {
    fs.mkdirSync(animeBaseDir, { recursive: true });
    const header = `import { BaseAnime } from '../../../models/anime-model';\n\nexport const baseAnimes: BaseAnime[] = [`;
    fs.writeFileSync(
      path.join(animeBaseDir, 'base_animes.ts'),
      rebuild(header, animeObjects, '];\n')
    );
  }
  console.log(`base animes: ${animeObjects.length}, base series left: ${baseKept}, keys: ${keys.size}`);

  const usersDir = path.join(root, 'src', 'app', 'utils', 'users');
  let userMoved = 0;
  let userKept = 0;
  for (const userId of fs.readdirSync(usersDir)) {
    const seriesDir = path.join(usersDir, userId, 'series');
    if (!fs.existsSync(seriesDir) || !fs.statSync(seriesDir).isDirectory()) continue;
    const animesDir = path.join(usersDir, userId, 'animes');
    const files = fs.readdirSync(seriesDir).filter((name) => name.endsWith('.ts') && name !== 'index.ts');
    let wroteCollection = false;
    let wroteWatchlist = false;
    for (const file of files) {
      const full = path.join(seriesDir, file);
      const content = fs.readFileSync(full, 'utf8');
      const parsed = splitArrayFile(content);
      if (!parsed) {
        console.warn('skip user file', userId, file);
        continue;
      }
      const kept = [];
      const moved = [];
      for (const objectText of parsed.objects) {
        const key = identityKey(objectText);
        if (key && keys.has(key)) moved.push(objectText);
        else kept.push(objectText);
      }
      userMoved += moved.length;
      userKept += kept.length;
      const isWatchlist = file.includes('watchlist');
      if (isWatchlist) wroteWatchlist = true;
      else wroteCollection = true;
      if (!write) continue;
      fs.writeFileSync(full, rebuild(parsed.header, kept, parsed.footer));
      fs.mkdirSync(animesDir, { recursive: true });
      const destName = file.replace(/series/g, 'animes');
      const destHeader = transformHeader(parsed.header);
      fs.writeFileSync(
        path.join(animesDir, destName),
        rebuild(destHeader, moved, parsed.footer)
      );
    }
    if (write) {
      fs.mkdirSync(animesDir, { recursive: true });
      if (!wroteCollection) {
        fs.writeFileSync(
          path.join(animesDir, `${userId}_animes.ts`),
          `import { UserAnimes } from '../../../../models/anime-model';\n\nexport const ${userId}Animes: UserAnimes = [\n];\n`
        );
      }
      if (!wroteWatchlist) {
        fs.writeFileSync(
          path.join(animesDir, `${userId}_watchlist_animes.ts`),
          `import { UserAnimes } from '../../../../models/anime-model';\n\nexport const ${userId}WatchlistAnimes: UserAnimes = [\n];\n`
        );
      }
    }
  }
  console.log(`user rows moved: ${userMoved}, kept as series: ${userKept}`);

  if (!write) return keys;

  let retargeted = 0;
  const scanDirs = [
    path.join(root, 'src', 'app', 'utils', 'entities'),
    path.join(root, 'src', 'app', 'utils', 'users'),
  ];
  for (const dir of scanDirs) {
    for (const file of walkFiles(dir)) {
      if (!file.endsWith('.ts')) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (!content.includes("entityType: 'serie'") && !content.includes('entityType: "serie"')) {
        continue;
      }
      const next = retargetFromEntity(content, keys);
      if (next !== content) {
        fs.writeFileSync(file, next);
        retargeted += 1;
      }
    }
  }
  console.log(`fromEntity files retargeted: ${retargeted}`);
  return keys;
}

function retargetFromEntity(content, keys) {
  const regex = /entityType:\s*(['"])serie\1/g;
  let match = regex.exec(content);
  const replacements = [];
  while (match) {
    const typeIndex = match.index;
    let depth = 0;
    let start = -1;
    for (let i = typeIndex; i >= 0; i -= 1) {
      const c = content[i];
      if (c === '}') depth += 1;
      else if (c === '{') {
        if (depth === 0) {
          start = i;
          break;
        }
        depth -= 1;
      }
    }
    if (start !== -1) {
      const end = matchingBracket(content, start, '{', '}');
      if (end !== -1) {
        const objectText = content.slice(start, end + 1);
        const title = parseStringField(objectText, 'title');
        const second =
          parseStringField(objectText, 'secondEntityKey') ||
          parseStringField(objectText, 'director');
        if (title && second) {
          const key = `${title.trim().toLowerCase()}|${second.trim().toLowerCase()}`;
          if (keys.has(key)) {
            replacements.push([
              typeIndex,
              match[0].length,
              match[0].replace('serie', 'anime'),
            ]);
          }
        }
      }
    }
    match = regex.exec(content);
  }
  if (replacements.length === 0) return content;
  let next = content;
  for (const [index, length, value] of replacements.reverse()) {
    next = next.slice(0, index) + value + next.slice(index + length);
  }
  return next;
}

cloneCode();
migrateData();
