const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
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
    .map((name: string) => `      {
        name: '${escapeString(name)}',
      },`)
    .join('\n');

  return `  {
    title: '${escapeString(entity.title)}',
    director: '${escapeString(entity.director)}',
    actors: [
${
    actorsLines || "      { name: 'Inconnu' },"
  }
    ],
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    releaseDate: '${escapeString(entity.releaseDate || '')}',
    endDate: '${escapeString(entity.endDate || '')}',
    totalLength: ${entity.totalLength || 0},
    genre: '${escapeString(entity.genre || '')}',
    nbSeasons: ${entity.nbSeasons || 0},
    nbEpisodesTotal: ${entity.nbEpisodesTotal || 0},
  },`;
}

function formatUserSerie(user: any): string {
  const seasons = Array.from(
    { length: Math.max(0, Number(user.nbSeasons) || 0) },
    (_, index) => `      {
        seasonNumber: ${index + 1},
        seasonRating: 0,
        seasonTimesWatched: 0,
      }`
  );

  const seasonsBlock = `    seasons: [\n${seasons.join(',\n')}\n    ],`;
  return `  {
    title: '${escapeString(user.title)}',
    director: '${escapeString(user.director)}',
${seasonsBlock}
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
    .filter(
      (file: string) => file.endsWith('.ts') && file !== 'index.ts'
    );

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

    const entityPayload = {
      title,
      director,
      actors,
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      releaseDate: normalizeString(entity.releaseDate, 'releaseDate') || '',
      endDate: normalizeString(entity.endDate, 'endDate') || '',
      totalLength: normalizeNumber(entity.totalLength, 'totalLength') || 0,
      genre: normalizeString(entity.genre, 'genre') || '',
      nbSeasons: normalizeNumber(entity.nbSeasons, 'nbSeasons') || 0,
      nbEpisodesTotal:
        normalizeNumber(entity.nbEpisodesTotal, 'nbEpisodesTotal') || 0,
    };

    const userPayload = {
      title,
      director,
      nbSeasons: entityPayload.nbSeasons || 0,
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
