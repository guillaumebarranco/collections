const fs = require('fs');
const path = require('path');

const rawUsername = process.argv[2];
if (!rawUsername) {
  console.error('Usage: node scripts/create-user-files.js <username>');
  process.exit(1);
}

const username = rawUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
if (!username) {
  console.error('Invalid username. Use letters and numbers only.');
  process.exit(1);
}

const baseDir = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'utils',
  'users',
  username
);

const entities = [
  { name: 'books', model: 'book', type: 'UserBook', suffix: 'Books' },
  {
    name: 'children-books',
    model: 'children-book',
    type: 'UserChildrenBook',
    suffix: 'ChildrenBooks',
  },
  { name: 'games', model: 'game', type: 'UserGame', suffix: 'Games' },
  { name: 'comics', model: 'comic', type: 'UserComic', suffix: 'Comics' },
  { name: 'bds', model: 'bd', type: 'UserBd', suffix: 'Bds' },
  { name: 'mangas', model: 'manga', type: 'UserManga', suffix: 'Mangas' },
  { name: 'manwhas', model: 'manwha', type: 'UserManwha', suffix: 'Manwhas' },
  { name: 'movies', model: 'movie', type: 'UserMovie', suffix: 'Movies' },
  { name: 'series', model: 'serie', type: 'UserSerie', suffix: 'Series' },
];

const extraLists = [
  {
    name: 'books',
    model: 'book',
    type: 'UserBook',
    fileSuffix: 'readlist_books',
    exportSuffix: 'ReadListBooks',
  },
  {
    name: 'children-books',
    model: 'children-book',
    type: 'UserChildrenBook',
    fileSuffix: 'readlist_children_books',
    exportSuffix: 'ReadListChildrenBooks',
  },
  {
    name: 'comics',
    model: 'comic',
    type: 'UserComic',
    fileSuffix: 'readlist_comics',
    exportSuffix: 'ReadListComics',
  },
  {
    name: 'bds',
    model: 'bd',
    type: 'UserBd',
    fileSuffix: 'readlist_bds',
    exportSuffix: 'ReadListBds',
  },
  {
    name: 'mangas',
    model: 'manga',
    type: 'UserManga',
    fileSuffix: 'readlist_mangas',
    exportSuffix: 'ReadListMangas',
  },
  {
    name: 'manwhas',
    model: 'manwha',
    type: 'UserManwha',
    fileSuffix: 'readlist_manwhas',
    exportSuffix: 'ReadListManwhas',
  },
  {
    name: 'movies',
    model: 'movie',
    type: 'UserMovie',
    fileSuffix: 'watchlist_movies',
    exportSuffix: 'WatchListMovies',
  },
  {
    name: 'series',
    model: 'serie',
    type: 'UserSerie',
    fileSuffix: 'watchlist_series',
    exportSuffix: 'WatchListSeries',
  },
  {
    name: 'games',
    model: 'game',
    type: 'UserGame',
    fileSuffix: 'gamelist_games',
    exportSuffix: 'GameListGames',
  },
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function buildFileContent(type, model, exportName) {
  return `import { ${type} } from '../../../../models/${model}-model';

export const ${exportName}: ${type}[] = [];
`;
}

ensureDir(baseDir);

entities.forEach((entity) => {
  const entityDir = path.join(baseDir, entity.name);
  ensureDir(entityDir);

  const fileName = `${username}_${entity.name}.ts`;
  const filePath = path.join(entityDir, fileName);
  const exportName = `${username}${entity.suffix}`;

  if (fs.existsSync(filePath)) {
    console.warn(`Skip existing: ${filePath}`);
    return;
  }

  const content = buildFileContent(entity.type, entity.model, exportName);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

extraLists.forEach((entry) => {
  const entityDir = path.join(baseDir, entry.name);
  ensureDir(entityDir);

  const fileName = `${username}_${entry.fileSuffix}.ts`;
  const filePath = path.join(entityDir, fileName);
  const exportName = `${username}${entry.exportSuffix}`;

  if (fs.existsSync(filePath)) {
    console.warn(`Skip existing: ${filePath}`);
    return;
  }

  const content = buildFileContent(entry.type, entry.model, exportName);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

