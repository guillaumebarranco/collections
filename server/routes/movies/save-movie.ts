const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeMovieGenreInput,
  normalizeMovieCountryOriginInput,
  updateMovieInFile,
  updateMovieIdentityInFile,
  updateBaseMovieInFiles,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
} = require('../../utils/movies/movies-utils');
const { isAdminUser, loadUsers } = require('../../utils/users/users-utils');

/** Payload passé à updateMovieInFile (champs optionnels seulement si présents dans le body). */
interface SaveMovieUserPayload {
  title: string;
  director: string;
  rating: number | undefined;
  timesWatched: number | undefined;
  firstViewedDate: string | undefined;
  lastViewedDate: string | undefined;
  otherSeenDates?: string[];
  seenAtCinema: boolean | undefined;
  owned: boolean | undefined;
  wantToSeeAgain: boolean | undefined;
  watchPriority: number | undefined;
  ratingComment?: string;
  inList?: string[];
  borrowed?: string;
  loaned?: string;
}

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

    const payload: SaveMovieUserPayload = {
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
    };
    if (Object.prototype.hasOwnProperty.call(input, 'ratingComment')) {
      payload.ratingComment =
        normalizeString(input.ratingComment, 'ratingComment') ?? '';
    }
    if (Array.isArray(input.inList)) {
      payload.inList = input.inList.filter((s: any) => typeof s === 'string');
    }
    if (Object.prototype.hasOwnProperty.call(input, 'borrowed')) {
      payload.borrowed = normalizeString(input.borrowed, 'borrowed') ?? '';
    }
    if (Object.prototype.hasOwnProperty.call(input, 'loaned')) {
      payload.loaned = normalizeString(input.loaned, 'loaned') ?? '';
    }
    if (Array.isArray(input.otherSeenDates)) {
      payload.otherSeenDates = input.otherSeenDates.filter(
        (d: unknown) => typeof d === 'string'
      );
    }

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
        genre: Object.prototype.hasOwnProperty.call(entityPayload, 'genre')
          ? normalizeMovieGenreInput(entityPayload.genre)
          : undefined,
        saga: normalizeString(entityPayload.saga, 'saga'),
        description:
          normalizeString(entityPayload.description, 'description') ?? '',
        countryOrigin: Object.prototype.hasOwnProperty.call(
          entityPayload,
          'countryOrigin'
        )
          ? normalizeMovieCountryOriginInput(entityPayload.countryOrigin)
          : undefined,
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
