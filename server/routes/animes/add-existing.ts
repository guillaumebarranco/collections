const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseAnimesFromFile,
  getUserAllAnimesFiles,
  findBaseAnime,
} = require('../../utils/animes/animes-utils');

const router = express.Router();

const usersRootDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const createUserScript = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'create-user-files.js'
);

function ensureUserExists(userId: string) {
  const userDir = path.join(usersRootDir, userId);
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function buildSeasons(seasonsCount: number) {
  const count = Math.max(0, Number(seasonsCount) || 0);
  return Array.from({ length: count }, (_, index) => ({
    seasonNumber: index + 1,
    seasonRating: 0,
    watching: false,
    seasonTimesWatched: 0,
    firstViewedDate: '',
    lastViewedDate: '',
    otherViewedDates: [],
  }));
}

function formatSeasons(seasons: any[]) {
  const lines = seasons.map(
    (season: any) => `      {
        seasonNumber: ${season.seasonNumber},
        seasonRating: ${season.seasonRating},
        watching: ${season.watching === true},
        seasonTimesWatched: ${season.seasonTimesWatched},
        firstViewedDate: "${escapeString(season.firstViewedDate || '')}",
        lastViewedDate: "${escapeString(season.lastViewedDate || '')}",
        otherViewedDates: [],
      }`
  );
  return `    seasons: [\n${lines.join(',\n')}\n    ],`;
}

function formatUserAnime(anime: any) {
  const seasons = buildSeasons(anime.seasonsCount);
  return `  {
    title: "${escapeString(anime.title)}",
    director: "${escapeString(anime.director)}",
${formatSeasons(seasons)}
    owned: false,
    watchPriority: 1,
    wantToWatchAgain: false,
    ratingComment: '',
    borrowed: '',
    loaned: '',
    quotes: [],
  },`;
}

function formatWatchlistAnime(anime: any) {
  const seasons = buildSeasons(anime.seasonsCount);
  return `  {
    title: "${escapeString(anime.title)}",
    director: "${escapeString(anime.director)}",
${formatSeasons(seasons)}
    owned: false,
    watchPriority: 1,
    wantToWatchAgain: false,
    ratingComment: '',
    borrowed: '',
    loaned: '',
    quotes: [],
  },`;
}

function getUserAnimesTargetFile(userId: string, isWatchlist: boolean) {
  const userDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'animes'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User animes directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts');

  const scopedFiles = files.filter((file: string) =>
    isWatchlist ? file.includes('watchlist') : !file.includes('watchlist')
  );

  const preferred = scopedFiles.find((file: string) =>
    isWatchlist
      ? file.includes(`${userId}_watchlist_animes`)
      : file.includes(`${userId}_animes`)
  );
  const selected = preferred || scopedFiles.sort()[0];
  if (!selected) {
    throw new Error(`User animes file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const animes = Array.isArray(input.animes) ? input.animes : [];
    const isWatchlist = normalizeBoolean(input.watchlist, 'watchlist') ?? false;
    const normalizedAnimes = animes
      .map((anime: any) => ({
        title: normalizeString(anime.title, 'title'),
        director: normalizeString(anime.director, 'director'),
        seasonsCount: 0,
      }))
      .filter((anime: any) => anime.title && anime.director);

    if (normalizedAnimes.length === 0) {
      res.status(400).json({ error: 'Missing animes' });
      return;
    }

    const userFiles = getUserAllAnimesFiles(userId);
    const existing = userFiles.flatMap((animeFile: string) => {
      const fileContent = fs.readFileSync(animeFile, 'utf8');
      return parseAnimesFromFile(fileContent).map((anime: any) => ({
        title: anime.title,
        director: anime.director,
      }));
    });

    const existingSet = new Set(
      existing.map((anime: any) => `${anime.title}|${anime.director}`)
    );

    const toAdd = normalizedAnimes
      .filter(
        (anime: any) => !existingSet.has(`${anime.title}|${anime.director}`)
      )
      .map((anime: any) => {
        const baseAnime = findBaseAnime(anime.title, anime.director);
        const seasonsCount = baseAnime?.seasonsData?.length ?? 0;
        return {
          ...anime,
          seasonsCount,
        };
      });

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Animes already exist for user' });
      return;
    }

    const userFile = getUserAnimesTargetFile(userId, isWatchlist);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const formatAnime = isWatchlist ? formatWatchlistAnime : formatUserAnime;
    for (const anime of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatAnime(anime));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    res.json({
      ok: true,
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
