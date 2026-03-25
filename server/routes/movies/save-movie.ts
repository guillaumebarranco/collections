const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateMovieInFile,
  updateMovieIdentityInFile,
  updateBaseMovieInFiles,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
} = require('../../utils/movies/movies-utils');
const { isAdminUser, loadUsers } = require('../../utils/users/users-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};

    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const director = normalizeString(input.director, 'director');
    if (!title || !director) {
      res.status(400).json({ error: 'Missing title or director' });
      return;
    }

    const payload = {
      title,
      director,
      rating: normalizeNumber(input.rating, 'rating'),
      timesWatched: normalizeNumber(input.timesWatched, 'timesWatched'),
      firstViewedDate: normalizeString(
        input.firstViewedDate,
        'firstViewedDate'
      ),
      lastViewedDate: normalizeString(input.lastViewedDate, 'lastViewedDate'),
      seenAtCinema: normalizeBoolean(input.seenAtCinema, 'seenAtCinema'),
      owned: normalizeBoolean(input.owned, 'owned'),
      wantToSeeAgain: normalizeBoolean(input.wantToSeeAgain, 'wantToSeeAgain'),
      watchPriority: normalizeNumber(input.watchPriority, 'watchPriority'),
      ratingComment:
        normalizeString(input.ratingComment, 'ratingComment') ?? '',
      inList: Array.isArray(input.inList)
        ? input.inList.filter((s: any) => typeof s === 'string')
        : [],
      borrowed: normalizeString(input.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(input.loaned, 'loaned') ?? '',
    };

    const entityPayload = input.entity || null;
    const entityOnly = Boolean(input.entityOnly);
    if ((entityPayload || entityOnly) && !isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required to edit entity data' });
      return;
    }
    if (entityPayload && !entityOnly) {
      res.status(400).json({
        error: 'Entity updates are only allowed from admin view',
      });
      return;
    }

    let updatedFile: string | null = null;

    if (!entityOnly) {
      const movieFiles = [
        ...getUserMoviesFiles(userId),
        ...getUserWatchlistMoviesFiles(userId),
      ];
      for (const movieFile of movieFiles) {
        const fileContent = fs.readFileSync(movieFile, 'utf8');
        try {
          const updatedContent = updateMovieInFile(fileContent, payload);
          fs.writeFileSync(movieFile, updatedContent, 'utf8');
          updatedFile = movieFile;
          break;
        } catch (error: any) {
          if (error.message !== 'Movie not found') {
            throw error;
          }
        }
      }

      if (!updatedFile) {
        res.status(404).json({ error: 'Movie not found' });
        return;
      }
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      const originalTitle = normalizeString(
        input.originalTitle,
        'originalTitle'
      );
      const originalDirector = normalizeString(
        input.originalDirector,
        'originalDirector'
      );
      baseUpdatedFile = updateBaseMovieInFiles({
        title,
        director,
        matchTitle: originalTitle || title,
        matchDirector: originalDirector || director,
        actors: Array.isArray(entityPayload.actors)
          ? entityPayload.actors
          : undefined,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        releaseDate: normalizeString(entityPayload.releaseDate, 'releaseDate'),
        length: normalizeNumber(entityPayload.length, 'length'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        saga: normalizeString(entityPayload.saga, 'saga'),
        description:
          normalizeString(entityPayload.description, 'description') ?? '',
        countryOrigin:
          normalizeString(entityPayload.countryOrigin, 'countryOrigin') ?? '',
        fromEntity:
          entityPayload.fromEntity === null ||
          entityPayload.fromEntity === undefined
            ? null
            : typeof entityPayload.fromEntity === 'object' &&
              entityPayload.fromEntity?.title != null &&
              entityPayload.fromEntity?.secondEntityKey != null
            ? {
                entityType: String(
                  entityPayload.fromEntity.entityType || 'book'
                ),
                title: String(entityPayload.fromEntity.title),
                secondEntityKey: String(
                  entityPayload.fromEntity.secondEntityKey
                ),
              }
            : undefined,
      });

      if (originalTitle || originalDirector) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchDirector = originalDirector || director;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserMoviesFiles(user.username),
              ...getUserWatchlistMoviesFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              try {
                const updated = updateMovieIdentityInFile(fileContent, {
                  matchTitle,
                  matchDirector,
                  title,
                  director,
                });
                fs.writeFileSync(filePath, updated, 'utf8');
              } catch (error: any) {
                if (error.message !== 'Movie not found') {
                  throw error;
                }
              }
            });
          } catch (error: any) {
            if (!String(error.message || '').includes('not found')) {
              throw error;
            }
          }
        });
      }
    }

    res.json({
      ok: true,
      movie: { title: payload.title, director: payload.director },
      file: updatedFile,
      baseFile: baseUpdatedFile,
    });

    console.log(
      'movie:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        director: payload.director,
        rating: payload.rating,
        timesWatched: payload.timesWatched,
        firstViewedDate: payload.firstViewedDate,
        lastViewedDate: payload.lastViewedDate,
        seenAtCinema: payload.seenAtCinema,
        owned: payload.owned,
        wantToSeeAgain: payload.wantToSeeAgain,
        watchPriority: payload.watchPriority,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
