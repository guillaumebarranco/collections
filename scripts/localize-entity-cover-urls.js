/**
 * Script réutilisable : repère tous les liens HTTP (images) dans utils/entities,
 * les télécharge et met à jour les coverUrl (ou propriétés similaires) avec des chemins locaux.
 *
 * Usage: node scripts/localize-entity-cover-urls.js [--dry-run]
 *
 * Options:
 *   --dry-run   Affiche les URLs trouvées et les chemins locaux sans télécharger ni modifier les fichiers.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const ENTITIES_DIR = path.join(ROOT_DIR, 'src', 'app', 'utils', 'entities');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
const DRY_RUN = process.argv.includes('--dry-run');

/** Regex pour trouver une URL http(s) entre guillemets simples ou doubles (sur une ou deux lignes). */
const URL_IN_QUOTES_REGEX = /['"](https?:\/\/[^'"]+)['"]/g;

/** Détermine le sous-dossier public selon le type d'entité (movies, series, books, etc.). */
function getPublicSubdir(relativeFilePath) {
  const parts = path.relative(ENTITIES_DIR, relativeFilePath).split(path.sep);
  const entityType = parts[0] || 'entities'; // movies, series, books, ...
  const folderMap = {
    movies: 'movies_pictures',
    series: 'series_pictures',
    books: 'books_pictures',
    'children-books': 'children_books_pictures',
    bds: 'bds_pictures',
    comics: 'comics_pictures',
    mangas: 'mangas_pictures',
    manwhas: 'manwhas_pictures',
    games: 'games_pictures',
    musics: 'musics_pictures',
  };
  return folderMap[entityType] || 'entities_covers';
}

/** Vérifie si l'URL ressemble à une image (extension ou patterns connus). */
function isLikelyImageUrl(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    const ext = path.extname(p).split('?')[0];
    if (IMAGE_EXTENSIONS.has(ext)) return true;
    if (p.includes('cover') || p.includes('image') || p.includes('img') || p.includes('picture')) return true;
    return false;
  } catch {
    return false;
  }
}

/** Extension à partir de l'URL ou du Content-Type. */
function getExtensionFromUrl(url) {
  try {
    const p = new URL(url).pathname;
    const ext = path.extname(p).split('?')[0].toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) return ext;
  } catch {}
  return '.jpg';
}

/** Nom de fichier local unique et sûr à partir de l'URL. */
function localFilename(url) {
  const ext = getExtensionFromUrl(url);
  const hash = crypto.createHash('sha256').update(url).digest('hex').slice(0, 12);
  return `${hash}${ext}`;
}

/** Liste tous les fichiers .ts sous un répertoire. */
function listTsFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listTsFiles(full, files);
    else if (e.isFile() && e.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

/** Extrait toutes les URLs http(s) entre guillemets dans le contenu. */
function extractHttpUrls(content) {
  const urls = new Set();
  let m;
  const re = new RegExp(URL_IN_QUOTES_REGEX.source, 'g');
  while ((m = re.exec(content)) !== null) {
    const url = m[1];
    if (url.startsWith('http://') || url.startsWith('https://')) urls.add(url);
  }
  return [...urls];
}

/** Télécharge une URL et retourne le buffer (ou null en cas d'erreur). */
async function downloadImage(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': 'Makya-LocalizeCovers/1.0' },
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.startsWith('image/') && buf.length > 0) {
      const ext = getExtensionFromUrl(url);
      if (!IMAGE_EXTENSIONS.has(ext)) return null;
    }
    return buf;
  } catch (err) {
    console.warn(`  Erreur téléchargement ${url.slice(0, 60)}... :`, err.message);
    return null;
  }
}

/** Sauvegarde le buffer dans public/<subdir>/<filename>. */
function saveToPublic(subdir, filename, buffer) {
  const dir = path.join(PUBLIC_DIR, subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return path.join('/', subdir, filename).replace(/\\/g, '/');
}

async function main() {
  console.log('Scan de', ENTITIES_DIR, 'pour les URLs HTTP (images)...');
  const tsFiles = listTsFiles(ENTITIES_DIR);
  const urlToMeta = new Map(); // url -> { subdir, localPath, files: [ { filePath, fullUrlPattern } ] }

  for (const filePath of tsFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relPath = path.relative(ROOT_DIR, filePath);
    const subdir = getPublicSubdir(filePath);
    const urls = extractHttpUrls(content);
    for (const url of urls) {
      if (!isLikelyImageUrl(url)) continue;
      const key = url;
      if (!urlToMeta.has(key)) {
        urlToMeta.set(key, {
          subdir,
          localPath: null,
          files: [],
        });
      }
      urlToMeta.get(key).files.push({ filePath, relPath });
    }
  }

  const totalUrls = urlToMeta.size;
  const totalRefs = [...urlToMeta.values()].reduce((acc, m) => acc + m.files.length, 0);
  console.log(`${totalUrls} URL(s) HTTP (images) trouvées, ${totalRefs} occurrence(s) dans les fichiers.`);

  if (totalUrls === 0) {
    console.log('Rien à faire.');
    return;
  }

  if (DRY_RUN) {
    console.log('\n[--dry-run] Aperçu (aucun téléchargement, aucun fichier modifié):');
    for (const [url, meta] of urlToMeta) {
      const filename = localFilename(url);
      const localPath = `/${meta.subdir}/${filename}`;
      console.log(`  ${url.slice(0, 70)}...`);
      console.log(`    -> ${localPath} (${meta.files.length} occurrence(s))`);
    }
    return;
  }

  let downloaded = 0;
  let failed = 0;
  const replacementsByFile = new Map(); // filePath -> [ { from: url, to: localPath } ]

  for (const [url, meta] of urlToMeta) {
    const filename = localFilename(url);
    const buffer = await downloadImage(url);
    if (!buffer) {
      failed++;
      continue;
    }
    const localPath = saveToPublic(meta.subdir, filename, buffer);
    meta.localPath = localPath;
    downloaded++;
    for (const { filePath } of meta.files) {
      if (!replacementsByFile.has(filePath)) replacementsByFile.set(filePath, []);
      replacementsByFile.get(filePath).push({ from: url, to: localPath });
    }
    if (downloaded % 10 === 0) console.log(`  Téléchargé ${downloaded}/${totalUrls}...`);
  }

  console.log(`\nTéléchargé: ${downloaded}, échecs: ${failed}.`);

  let filesUpdated = 0;
  for (const [filePath, replacements] of replacementsByFile) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const { from, to } of replacements) {
      const quotedUrl1 = `'${from}'`;
      const quotedUrl2 = `"${from}"`;
      if (content.includes(quotedUrl1)) {
        content = content.split(quotedUrl1).join(`'${to}'`);
        changed = true;
      }
      if (content.includes(quotedUrl2)) {
        content = content.split(quotedUrl2).join(`"${to}"`);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
    }
  }

  console.log(`Fichiers .ts mis à jour: ${filesUpdated}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
