const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeMovieGenreInput,
  normalizeMovieCountryOriginInput,
  formatMovieGenreArrayTs,
  formatMovieCountryOriginArrayTs,
  escapeString,
  appendObjectToArrayFile,
  baseMovieExists,
  BASE_MOVIES_API_FILE,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

function formatBaseMovie(entity: any): string {
  const actors = Array.isArray(entity.actors) ? entity.actors : [];
  const actorsLines = actors
    .map(
      (name: string) =>
        `      {\n        name: "${escapeString(name)}",\n      },`
    )
    .join('\n');

  return `  {\n    title: "${escapeString(
    entity.title
  )}",\n    director: "${escapeString(entity.director)}",\n    actors: [\n${
    actorsLines || '      { name: "Inconnu" },'
  }\n    ],\n    coverUrl: "${escapeString(
    entity.coverUrl || ''
  )}",\n    releaseDate: "${escapeString(
    entity.releaseDate || ''
  )}",\n    length: ${entity.length ?? 0},\n    genre: ${formatMovieGenreArrayTs(
    normalizeMovieGenreInput(entity.genre)
  )},\n    saga: "${escapeString(
    entity.saga || ''
  )}",\n    description: "${escapeString(
    entity.description ?? ''
  )}",\n    fromEntity: null,\n    countryOrigin: ${formatMovieCountryOriginArrayTs(
    normalizeMovieCountryOriginInput(entity.countryOrigin)
  )},\n    selectDisplayOrder: ${entity.selectDisplayOrder ?? 0},\n  },`;
}

function formatUserMovie(user: any): string {
  return `  {\n    title: "${escapeString(
    user.title
  )}",\n    director: "${escapeString(user.director)}",\n    rating: ${
    user.rating ?? 0
  },\n    timesWatched: ${
    user.timesWatched ?? 0
  },\n    firstViewedDate: "${escapeString(
    user.firstViewedDate || ''
  )}",\n    lastViewedDate: "${escapeString(
    user.lastViewedDate || ''
  )}",\n    seenAtCinema: ${user.seenAtCinema ?? false},\n    owned: ${
    user.owned ?? false
  },\n    wantToSeeAgain: ${
    user.wantToSeeAgain ?? false
  },\n    watchPriority: ${
    user.watchPriority ?? 1
  },\n    ratingComment: "${escapeString(
    user.ratingComment ?? ''
  )}",\n    inList: ${
    Array.isArray(user.inList) && user.inList.length > 0
      ? '[' +
        user.inList.map((s: any) => '"' + escapeString(s) + '"').join(', ') +
        ']'
      : '[]'
  },\n    borrowed: "${escapeString(user.borrowed ?? '')}",\n    loaned: "${escapeString(user.loaned ?? '')}",\n  },`;
}

function getUserMoviesTargetFile(userId: string) {
  const userFile = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'movies',
    `${userId}_movies.ts`
  );
  if (!fs.existsSync(userFile)) {
    throw new Error(`User movies file not found: ${userId}`);
  }
  return userFile;
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

    if (baseMovieExists(title)) {
      res.status(409).json({ error: 'Movie already exists in entities' });
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
      length: normalizeNumber(entity.length, 'length') || 0,
      genre: normalizeMovieGenreInput(entity.genre),
      saga: normalizeString(entity.saga, 'saga') || '',
      description: normalizeString(entity.description, 'description') ?? '',
      countryOrigin: normalizeMovieCountryOriginInput(entity.countryOrigin),
    };

    const userPayload = {
      title,
      director,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      timesWatched: normalizeNumber(user.timesWatched, 'timesWatched') ?? 0,
      firstViewedDate:
        normalizeString(user.firstViewedDate, 'firstViewedDate') || '',
      lastViewedDate:
        normalizeString(user.lastViewedDate, 'lastViewedDate') || '',
      seenAtCinema:
        normalizeBoolean(user.seenAtCinema, 'seenAtCinema') ?? false,
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      wantToSeeAgain:
        normalizeBoolean(user.wantToSeeAgain, 'wantToSeeAgain') ?? false,
      watchPriority: normalizeNumber(user.watchPriority, 'watchPriority') ?? 1,
      ratingComment: normalizeString(user.ratingComment, 'ratingComment') ?? '',
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
    };

    const baseMovieContent = appendObjectToArrayFile(
      BASE_MOVIES_API_FILE,
      formatBaseMovie(entityPayload)
    );
    fs.writeFileSync(BASE_MOVIES_API_FILE, baseMovieContent, 'utf8');

    if (userId !== 'admin') {
      const userMoviesFile = getUserMoviesTargetFile(userId);
      const userMovieContent = appendObjectToArrayFile(
        userMoviesFile,
        formatUserMovie(userPayload)
      );
      fs.writeFileSync(userMoviesFile, userMovieContent, 'utf8');

      res.json({
        ok: true,
        entityFile: BASE_MOVIES_API_FILE,
        userFile: userMoviesFile,
      });
    } else {
      res.json({
        ok: true,
        entityFile: BASE_MOVIES_API_FILE,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
