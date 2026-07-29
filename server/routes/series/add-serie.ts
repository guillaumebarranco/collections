const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeSerieGenreInput,
  formatSerieGenreArrayTs,
  escapeString,
  formatOtherViewedDatesTs,
  appendObjectToArrayFile,
  baseSerieExists,
  BASE_SERIES_API_FILE,
} = require('../../utils/series/series-utils');
const { normalizeWatchPriority } = require('../../utils/watch-priority-utils');

const router = express.Router();

function formatBaseSerie(entity: any): string {
  const actors = Array.isArray(entity.actors) ? entity.actors : [];
  const actorsLines = actors
    .map(
      (name: string) => `      {
        name: "${escapeString(name)}",
      },`
    )
    .join('\n');
  const seasonsData = Array.isArray(entity.seasonsData)
    ? entity.seasonsData
    : [];
  const seasonsLines = seasonsData
    .map(
      (season: any) => `      {
        seasonNumber: ${season.seasonNumber},
        nbEpisodes: ${season.nbEpisodes},
        totalLength: ${season.totalLength},
      },`
    )
    .join('\n');

  return `  {
    title: "${escapeString(entity.title)}",
    director: "${escapeString(entity.director)}",
    actors: [
${actorsLines || "      { name: 'Inconnu' },"}
    ],
    coverUrl: "${escapeString(entity.coverUrl || '')}",
    releaseDate: "${escapeString(entity.releaseDate || '')}",
    endDate: "${escapeString(entity.endDate || '')}",
    genre: ${formatSerieGenreArrayTs(normalizeSerieGenreInput(entity.genre))},
    seasonsData: [
${seasonsLines}
    ],
    description: "${escapeString(entity.description ?? '')}",
    countryOrigin: "${escapeString(entity.countryOrigin ?? '')}",
    saga: "${escapeString(entity.saga ?? '')}",
    fromEntity: null,
  },`;
}

function formatUserSerie(user: any): string {
  const seasonsPayload = Array.isArray(user.seasons) ? user.seasons : [];
  const seasons =
    seasonsPayload.length > 0
      ? seasonsPayload.map(
          (season: any) => `      {
        seasonNumber: ${season.seasonNumber},
        seasonRating: ${season.seasonRating},
        watching: ${season.watching === true},
        seasonTimesWatched: ${season.seasonTimesWatched},
        firstViewedDate: "${escapeString(season.firstViewedDate || '')}",
        lastViewedDate: "${escapeString(season.lastViewedDate || '')}",
        otherViewedDates: ${formatOtherViewedDatesTs(season.otherViewedDates)},
      }`
        )
      : Array.from(
          { length: Math.max(0, Number(user.seasonsCount) || 0) },
          (_, index) => `      {
        seasonNumber: ${index + 1},
        seasonRating: 0,
        watching: false,
        seasonTimesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
        otherViewedDates: [],
      }`
        );

  const seasonsBlock = `    seasons: [\n${seasons.join(',\n')}\n    ],`;
  return `  {
    title: "${escapeString(user.title)}",
    director: "${escapeString(user.director)}",
${seasonsBlock}
    owned: ${user.owned ?? false},
    watchPriority: ${normalizeWatchPriority(user.watchPriority) ?? 1},
    wantToWatchAgain: ${user.wantToWatchAgain ?? false},
    ratingComment: "${escapeString(user.ratingComment ?? '')}",
    borrowed: "${escapeString(user.borrowed ?? '')}",
    loaned: "${escapeString(user.loaned ?? '')}",
  },`;
}

function getUserSeriesTargetFile(userId: string, isWatchlist: boolean) {
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
    'series'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User series directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts');

  const scopedFiles = files.filter((file: string) =>
    isWatchlist ? file.includes('watchlist') : !file.includes('watchlist')
  );

  const preferred = scopedFiles.find((file: string) =>
    isWatchlist
      ? file.includes(`${userId}_watchlist_series`)
      : file.includes(`${userId}_series`)
  );
  const selected = preferred || scopedFiles.sort()[0];
  if (!selected) {
    throw new Error(`User series file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const entity = input.entity || {};
    const user = input.user || {};
    const isWatchlist = normalizeBoolean(input.watchlist, 'watchlist') ?? false;

    const title = normalizeString(entity.title, 'title');
    const director = normalizeString(entity.director, 'director');
    if (!title || !director) {
      res.status(400).json({ error: 'Missing title or director' });
      return;
    }

    if (baseSerieExists(title, director)) {
      res.status(409).json({ error: 'Serie already exists in entities' });
      return;
    }

    const rawActors = Array.isArray(entity.actors) ? entity.actors : [];
    const actors = rawActors
      .map((name: string) => normalizeString(name, 'actor'))
      .filter((name: string | undefined) => Boolean(name));

    const seasonsData = Array.isArray(entity.seasonsData)
      ? entity.seasonsData
          .map((season: any, index: number) => ({
            seasonNumber:
              normalizeNumber(season.seasonNumber, 'seasonNumber') || index + 1,
            nbEpisodes: normalizeNumber(season.nbEpisodes, 'nbEpisodes') || 0,
            totalLength:
              normalizeNumber(season.totalLength, 'seasonLength') || 0,
          }))
          .sort((a: any, b: any) => a.seasonNumber - b.seasonNumber)
      : [];

    const entityPayload = {
      title,
      director,
      actors,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      releaseDate: normalizeString(entity.releaseDate, 'releaseDate') || '',
      endDate: normalizeString(entity.endDate, 'endDate') || '',
      genre: normalizeSerieGenreInput(entity.genre),
      seasonsData,
      description: normalizeString(entity.description, 'description') ?? '',
      countryOrigin: normalizeString(entity.countryOrigin, 'countryOrigin') ?? '',
      saga: normalizeString(entity.saga, 'saga') ?? '',
    };

    const rawUserSeasons = Array.isArray(user.seasons) ? user.seasons : [];
    const seasonsCount = entityPayload.seasonsData.length;
    const normalizedUserSeasons = Array.from(
      { length: seasonsCount },
      (_, index) => {
        const season = rawUserSeasons[index] || {};
        return {
          seasonNumber: index + 1,
          seasonRating:
            normalizeNumber(season.seasonRating, 'seasonRating') || 0,
          seasonTimesWatched: isWatchlist
            ? 0
            : normalizeNumber(season.seasonTimesWatched, 'seasonTimesWatched') ||
              0,
          firstViewedDate:
            normalizeString(season.firstViewedDate, 'firstViewedDate') || '',
          lastViewedDate:
            normalizeString(season.lastViewedDate, 'lastViewedDate') || '',
          otherViewedDates: Array.isArray(season.otherViewedDates)
            ? season.otherViewedDates.filter(
                (d: unknown) => typeof d === 'string' && d.trim()
              )
            : [],
        };
      }
    );

    const userPayload = {
      title,
      director,
      seasonsCount,
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      seasons: normalizedUserSeasons,
      watchPriority:
        normalizeWatchPriority(
          normalizeNumber(user.watchPriority, 'watchPriority')
        ) ?? 1,
      wantToWatchAgain:
        normalizeBoolean(user.wantToWatchAgain, 'wantToWatchAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
    };

    const baseSerieContent = appendObjectToArrayFile(
      BASE_SERIES_API_FILE,
      formatBaseSerie(entityPayload)
    );
    fs.writeFileSync(BASE_SERIES_API_FILE, baseSerieContent, 'utf8');

    const userSeriesFile = getUserSeriesTargetFile(userId, isWatchlist);
    const userSerieContent = appendObjectToArrayFile(
      userSeriesFile,
      formatUserSerie(userPayload)
    );
    fs.writeFileSync(userSeriesFile, userSerieContent, 'utf8');

    res.json({
      ok: true,
      entityFile: BASE_SERIES_API_FILE,
      userFile: userSeriesFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
