const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeSerieGenreInput,
  updateSerieInFile,
  updateSerieIdentityInFile,
  updateBaseSerieInFiles,
  getUserSeriesFiles,
  getUserWatchlistSeriesFiles,
} = require('../../utils/series/series-utils');
const { normalizeWatchPriority } = require('../../utils/watch-priority-utils');
const { isAdminUser, loadUsers } = require('../../utils/users/users-utils');

const router = express.Router();

const FROM_ENTITY_TYPES = new Set([
  'book',
  'bd',
  'game',
  'comic',
  'manga',
  'manwha',
  'movie',
  'serie',
]);

function normalizeFromEntity(raw: unknown) {
  if (raw === undefined) {
    return undefined;
  }
  if (raw === null) {
    return null;
  }
  if (typeof raw !== 'object' || raw === null) {
    return undefined;
  }
  const o = raw as Record<string, unknown>;
  const entityType = String(o['entityType'] ?? '').trim();
  const title = String(o['title'] ?? '').trim();
  const secondEntityKey = String(o['secondEntityKey'] ?? '').trim();
  if (!title || !secondEntityKey) {
    return null;
  }
  if (!FROM_ENTITY_TYPES.has(entityType)) {
    return null;
  }
  return { entityType, title, secondEntityKey };
}

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
      seasons: Array.isArray(input.seasons) ? input.seasons : undefined,
      owned: normalizeBoolean(input.owned, 'owned'),
      watchPriority: normalizeWatchPriority(
        normalizeNumber(input.watchPriority, 'watchPriority')
      ),
      wantToWatchAgain:
        normalizeBoolean(input.wantToWatchAgain, 'wantToWatchAgain') ?? false,
      rating: normalizeNumber(input.rating, 'rating'),
      ratingComment: normalizeString(input.ratingComment, 'ratingComment') ?? '',
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
      const serieFiles = [
        ...getUserSeriesFiles(userId),
        ...getUserWatchlistSeriesFiles(userId),
      ];
      for (const serieFile of serieFiles) {
        const fileContent = fs.readFileSync(serieFile, 'utf8');
        try {
          const updatedContent = updateSerieInFile(fileContent, payload);
          fs.writeFileSync(serieFile, updatedContent, 'utf8');
          updatedFile = serieFile;
          break;
        } catch (error: any) {
          if (error.message !== 'Serie not found') {
            throw error;
          }
        }
      }

      if (!updatedFile) {
        res.status(404).json({ error: 'Serie not found' });
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
      baseUpdatedFile = updateBaseSerieInFiles({
        title,
        director,
        matchTitle: originalTitle || title,
        matchDirector: originalDirector || director,
        actors: Array.isArray(entityPayload.actors)
          ? entityPayload.actors
          : undefined,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        releaseDate: normalizeString(entityPayload.releaseDate, 'releaseDate'),
        endDate: normalizeString(entityPayload.endDate, 'endDate'),
        genre: Object.prototype.hasOwnProperty.call(entityPayload, 'genre')
          ? normalizeSerieGenreInput(entityPayload.genre)
          : undefined,
        seasonsData: Array.isArray(entityPayload.seasonsData)
          ? entityPayload.seasonsData
          : undefined,
        description: normalizeString(entityPayload.description, 'description') ?? '',
        countryOrigin: normalizeString(entityPayload.countryOrigin, 'countryOrigin') ?? '',
        saga: normalizeString(entityPayload.saga, 'saga') ?? '',
        ...(Object.prototype.hasOwnProperty.call(entityPayload, 'fromEntity')
          ? {
              fromEntity: normalizeFromEntity(entityPayload.fromEntity),
            }
          : {}),
      });

      if (originalTitle || originalDirector) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchDirector = originalDirector || director;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserSeriesFiles(user.username),
              ...getUserWatchlistSeriesFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              try {
                const updated = updateSerieIdentityInFile(fileContent, {
                  matchTitle,
                  matchDirector,
                  title,
                  director,
                });
                fs.writeFileSync(filePath, updated, 'utf8');
              } catch (error: any) {
                if (error.message !== 'Serie not found') {
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
      serie: { title: payload.title, director: payload.director },
      file: updatedFile,
      baseFile: baseUpdatedFile,
    });

    console.log(
      'serie:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        director: payload.director,
        owned: payload.owned,
        watchPriority: payload.watchPriority,
        wantToWatchAgain: payload.wantToWatchAgain,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
