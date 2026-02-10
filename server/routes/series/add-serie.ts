const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseSerieExists,
  BASE_SERIES_API_FILE,
} = require('../../utils/series/series-utils');

const router = express.Router();

function formatBaseSerie(entity: any): string {
  const actors = Array.isArray(entity.actors) ? entity.actors : [];
  const actorsLines = actors
    .map(
      (name: string) => `      {
        name: '${escapeString(name)}',
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
    title: '${escapeString(entity.title)}',
    director: '${escapeString(entity.director)}',
    actors: [
${actorsLines || "      { name: 'Inconnu' },"}
    ],
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    releaseDate: '${escapeString(entity.releaseDate || '')}',
    endDate: '${escapeString(entity.endDate || '')}',
    genre: '${escapeString(entity.genre || '')}',
    seasonsData: [
${seasonsLines}
    ],
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
        seasonTimesWatched: ${season.seasonTimesWatched},
        lastViewedDate: '${escapeString(season.lastViewedDate || '')}',
      }`
        )
      : Array.from(
          { length: Math.max(0, Number(user.seasonsCount) || 0) },
          (_, index) => `      {
        seasonNumber: ${index + 1},
        seasonRating: 0,
        seasonTimesWatched: 0,
        lastViewedDate: '',
      }`
        );

  const seasonsBlock = `    seasons: [\n${seasons.join(',\n')}\n    ],`;
  return `  {
    title: '${escapeString(user.title)}',
    director: '${escapeString(user.director)}',
${seasonsBlock}
    owned: ${user.owned ?? false},
    watchPriority: ${user.watchPriority ?? 1},
    wantToWatchAgain: ${user.wantToWatchAgain ?? false},
  },`;
}

function getUserSeriesTargetFile(userId: string) {
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

  const preferred = files.find((file: string) =>
    file.includes(`${userId}_series`)
  );
  const selected = preferred || files.sort()[0];
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
      genre: normalizeString(entity.genre, 'genre') || '',
      seasonsData,
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
          seasonTimesWatched:
            normalizeNumber(season.seasonTimesWatched, 'seasonTimesWatched') ||
            0,
          lastViewedDate:
            normalizeString(season.lastViewedDate, 'lastViewedDate') || '',
        };
      }
    );

    const userPayload = {
      title,
      director,
      seasonsCount,
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      seasons: normalizedUserSeasons,
      watchPriority: normalizeNumber(user.watchPriority, 'watchPriority') ?? 1,
      wantToWatchAgain:
        normalizeBoolean(user.wantToWatchAgain, 'wantToWatchAgain') ?? false,
    };

    const baseSerieContent = appendObjectToArrayFile(
      BASE_SERIES_API_FILE,
      formatBaseSerie(entityPayload)
    );
    fs.writeFileSync(BASE_SERIES_API_FILE, baseSerieContent, 'utf8');

    const userSeriesFile = getUserSeriesTargetFile(userId);
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
