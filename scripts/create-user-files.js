const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const rawUsername = process.argv[2];
const shouldBuild =
  process.argv.includes('--build') ||
  process.env.MAKYA_BUILD === 'true' ||
  process.env.NODE_ENV === 'production';
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

const configPath = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'core',
  'config.ts'
);

const facadeUpdates = [
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'books',
      'local-books.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Books`,
        path: `../../utils/users/${user}/books/${user}_books`,
      },
      {
        name: `${user}ReadListBooks`,
        path: `../../utils/users/${user}/books/${user}_readlist_books`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalBooksByUser',
        returnValue: (user) => `[...${user}Books]`,
      },
      {
        functionName: 'getLocalReadlistByUser',
        returnValue: (user) => `[...${user}ReadListBooks]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'books',
      'books.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllBooks',
        entry: (user) =>
          `${user}: getAllBooksData(getLocalBooksByUser('${user}'))`,
      },
      {
        functionName: 'getAllReadlistBooks',
        entry: (user) =>
          `${user}: getAllBooksData(getLocalReadlistByUser('${user}'))`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'games',
      'local-games.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Games`,
        path: `../../utils/users/${user}/games/${user}_games`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalGamesByUser',
        returnValue: (user) => `[...${user}Games]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'games',
      'games.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllGames',
        entry: (user) =>
          `${user}: getAllGamesData(getLocalGamesByUser('${user}'))`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'movies',
      'local-movies.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Movies`,
        path: `../../utils/users/${user}/movies/${user}_movies`,
      },
      {
        name: `${user}WatchListMovies`,
        path: `../../utils/users/${user}/movies/${user}_watchlist_movies`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalMoviesByUser',
        returnValue: (user) => `[...${user}Movies]`,
      },
      {
        functionName: 'getLocalWatchlistByUser',
        returnValue: (user) => `[...${user}WatchListMovies]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'movies',
      'movies.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllMovies',
        entry: (user) =>
          `${user}: getAllMoviesData(getLocalMoviesByUser('${user}'))`,
      },
      {
        functionName: 'getAllWatchlistMovies',
        entry: (user) =>
          `${user}: getAllMoviesData(getLocalWatchlistByUser('${user}'))`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'series',
      'local-series.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Series`,
        path: `../../utils/users/${user}/series/${user}_series`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalSeriesByUser',
        returnValue: (user) => `[...${user}Series]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'series',
      'series.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllSeries',
        entry: (user) =>
          `${user}: getAllSeriesData(getLocalSeriesByUser('${user}'))`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'mangas',
      'local-mangas.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Mangas`,
        path: `../../utils/users/${user}/mangas/${user}_mangas`,
      },
      {
        name: `${user}ReadListMangas`,
        path: `../../utils/users/${user}/mangas/${user}_readlist_mangas`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalMangasByUser',
        returnValue: (user) => `[...${user}Mangas]`,
      },
      {
        functionName: 'getLocalReadlistByUser',
        returnValue: (user) => `[...${user}ReadListMangas]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'mangas',
      'mangas.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllMangas',
        entry: (user) =>
          `${user}: getAllMangasData(getLocalMangasByUser('${user}'))`,
      },
      {
        functionName: 'getAllReadlistMangas',
        entry: (user) =>
          `${user}: getAllMangasData(getLocalReadlistByUser('${user}'))`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'manwhas',
      'local-manwhas.facade.ts'
    ),
    imports: (user) => [
      {
        name: `${user}Manwhas`,
        path: `../../utils/users/${user}/manwhas/${user}_manwhas`,
      },
      {
        name: `${user}ReadListManwhas`,
        path: `../../utils/users/${user}/manwhas/${user}_readlist_manwhas`,
      },
    ],
    switches: [
      {
        functionName: 'getLocalManwhasByUser',
        returnValue: (user) => `[...${user}Manwhas]`,
      },
      {
        functionName: 'getLocalReadlistByUser',
        returnValue: (user) => `[...${user}ReadListManwhas]`,
      },
    ],
  },
  {
    file: path.join(
      __dirname,
      '..',
      'src',
      'app',
      'facades',
      'manwhas',
      'manwhas.facade.ts'
    ),
    localhostMaps: [
      {
        functionName: 'getAllManwhas',
        entry: (user) =>
          `${user}: getAllManwhasData(getLocalManwhasByUser('${user}'))`,
      },
      {
        functionName: 'getAllReadlistManwhas',
        entry: (user) =>
          `${user}: getAllManwhasData(getLocalReadlistByUser('${user}'))`,
      },
    ],
  },
];

const entities = [
  { name: 'books', model: 'book', type: 'UserBook', suffix: 'Books' },
  { name: 'games', model: 'game', type: 'UserGame', suffix: 'Games' },
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

function insertImport(content, importName, importPath) {
  if (content.includes(`{ ${importName} }`) && content.includes(importPath)) {
    return content;
  }
  const importLine = `import { ${importName} } from '${importPath}';`;
  const lines = content.split('\n');
  const lastImportIndex = lines.reduce((acc, line, idx) => {
    if (line.startsWith('import ') && line.includes('utils/users')) {
      return idx;
    }
    return acc;
  }, -1);

  const insertAt = lastImportIndex >= 0 ? lastImportIndex + 1 : 0;
  lines.splice(insertAt, 0, importLine);
  return lines.join('\n');
}

function addSwitchCase(content, functionName, userId, returnValue) {
  if (content.includes(`case '${userId}':`)) {
    return content;
  }
  const fnIndex = content.indexOf(`function ${functionName}`);
  if (fnIndex === -1) return content;

  const switchIndex = content.indexOf('switch (userId)', fnIndex);
  if (switchIndex === -1) return content;

  const defaultIndex = content.indexOf('default:', switchIndex);
  if (defaultIndex === -1) return content;

  const insertion =
    `    case '${userId}':\n` +
    `      return ${returnValue};\n`;
  return (
    content.slice(0, defaultIndex) +
    insertion +
    content.slice(defaultIndex)
  );
}

function addLocalhostMapEntry(content, functionName, entry) {
  if (content.includes(`${entry},`) || content.includes(`${entry}\n`)) {
    return content;
  }
  const fnIndex = content.indexOf(`function ${functionName}`);
  if (fnIndex === -1) return content;

  const ifIndex = content.indexOf('if (isLocalhost())', fnIndex);
  if (ifIndex === -1) return content;

  const returnIndex = content.indexOf('return {', ifIndex);
  if (returnIndex === -1) return content;

  const blockEnd = content.indexOf('};', returnIndex);
  if (blockEnd === -1) return content;

  const before = content.slice(0, blockEnd);
  const after = content.slice(blockEnd);
  return `${before}      ${entry},\n${after}`;
}

function updateFacades(userId) {
  facadeUpdates.forEach((update) => {
    if (!fs.existsSync(update.file)) {
      console.warn(`Facade not found: ${update.file}`);
      return;
    }
    let content = fs.readFileSync(update.file, 'utf8');

    if (update.imports) {
      update.imports(userId).forEach((imp) => {
        content = insertImport(content, imp.name, imp.path);
      });
    }

    if (update.switches) {
      update.switches.forEach((sw) => {
        content = addSwitchCase(
          content,
          sw.functionName,
          userId,
          sw.returnValue(userId)
        );
      });
    }

    if (update.localhostMaps) {
      update.localhostMaps.forEach((map) => {
        const entry = map.entry(userId);
        content = addLocalhostMapEntry(content, map.functionName, entry);
      });
    }

    fs.writeFileSync(update.file, content, 'utf8');
    console.log(`Updated facade: ${update.file}`);
  });
}

function updateDefaultUserIds(userId) {
  if (!fs.existsSync(configPath)) {
    console.warn(`Config not found: ${configPath}`);
    return;
  }

  const content = fs.readFileSync(configPath, 'utf8');
  const match = content.match(
    /export const DEFAULT_USER_IDS\s*=\s*\[([\s\S]*?)\];/
  );
  if (!match) {
    console.warn('DEFAULT_USER_IDS not found in config.ts');
    return;
  }

  const listBody = match[1];
  const existing = listBody
    .split(',')
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);

  if (existing.includes(userId)) {
    console.log(`DEFAULT_USER_IDS already contains ${userId}`);
    return;
  }

  const nextList = [...existing, userId]
    .map((value) => `  '${value}'`)
    .join(',\n');
  const updated = content.replace(
    /export const DEFAULT_USER_IDS\s*=\s*\[[\s\S]*?\];/,
    `export const DEFAULT_USER_IDS = [\n${nextList},\n];`
  );
  fs.writeFileSync(configPath, updated, 'utf8');
  console.log(`Updated DEFAULT_USER_IDS with ${userId}`);
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

updateFacades(username);
updateDefaultUserIds(username);

if (shouldBuild) {
  try {
    execFileSync('npx', ['ng', 'build', '--configuration', 'production'], {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Build failed:', error.message || error);
    process.exitCode = 1;
  }
}
