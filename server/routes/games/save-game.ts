const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateGameInFile,
  updateGameIdentityInFile,
  updateBaseGameInFiles,
  getUserGamesFiles,
  getUserGamelistFiles,
} = require('../../utils/games/games-utils');
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

    const games = Array.isArray(input.games) ? input.games : [input];
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

    const payload = games.map((game: any) => {
      const sessions = Array.isArray(game.sessions)
        ? game.sessions.map((s: any) => ({
            finishedGame: normalizeBoolean(s.finishedGame, 'finishedGame') ?? false,
            finishedGameWithHundredPercent:
              normalizeBoolean(s.finishedGameWithHundredPercent, 'finishedGameWithHundredPercent') ?? false,
            platinedGame: normalizeBoolean(s.platinedGame, 'platinedGame') ?? false,
            additionnalEstimatedTime:
              normalizeNumber(s.additionnalEstimatedTime, 'additionnalEstimatedTime') ?? 0,
          }))
        : [];
      return {
        title: normalizeString(game.title, 'title'),
        editor: normalizeString(game.editor, 'editor'),
        rating: normalizeNumber(game.rating, 'rating') ?? 0,
        owned: normalizeBoolean(game.owned, 'owned') ?? false,
        gamelistPriority:
          normalizeNumber(game.gamelistPriority, 'gamelistPriority') ?? 1,
        wantToPlayAgain:
          normalizeBoolean(game.wantToPlayAgain, 'wantToPlayAgain') ?? false,
        sessions,
      };
    });

    let updatedCount = 0;
    if (!entityOnly) {
      const files = [
        ...getUserGamesFiles(userId),
        ...getUserGamelistFiles(userId),
      ];
      if (!files.length) {
        res.status(404).json({ error: 'User games not found' });
        return;
      }

      for (const filePath of files) {
        payload.forEach((game: any) => {
          if (game.title && game.editor) {
            if (updateGameInFile(filePath, game)) {
              updatedCount += 1;
            }
          }
        });
      }
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload && payload.length > 0) {
      const target = payload[0];
      const originalTitle = normalizeString(
        input.originalTitle,
        'originalTitle'
      );
      const originalEditor = normalizeString(
        input.originalEditor,
        'originalEditor'
      );
      const hero = normalizeString(entityPayload.hero, 'hero');
      const coverUrl = normalizeString(entityPayload.coverUrl, 'coverUrl');
      const releaseDate = normalizeString(
        entityPayload.releaseDate,
        'releaseDate'
      );
      const averageTimeToFinish = normalizeNumber(
        entityPayload.averageTimeToFinish,
        'averageTimeToFinish'
      );
      const averageTimeToHundredPercent = normalizeNumber(
        entityPayload.averageTimeToHundredPercent,
        'averageTimeToHundredPercent'
      );
      const platform = normalizeString(entityPayload.platform, 'platform');
      const saga = normalizeString(entityPayload.saga, 'saga');
      const platineTime = normalizeNumber(
        entityPayload.platineTime,
        'platineTime'
      );
      const baseUpdate: Record<string, any> = {
        title: target.title,
        editor: target.editor,
        matchTitle: originalTitle || target.title,
        matchEditor: originalEditor || target.editor,
      };
      if (hero !== undefined) baseUpdate['hero'] = hero;
      if (coverUrl !== undefined) baseUpdate['coverUrl'] = coverUrl;
      if (releaseDate !== undefined) baseUpdate['releaseDate'] = releaseDate;
      if (averageTimeToFinish !== undefined)
        baseUpdate['averageTimeToFinish'] = averageTimeToFinish;
      if (averageTimeToHundredPercent !== undefined)
        baseUpdate['averageTimeToHundredPercent'] = averageTimeToHundredPercent;
      if (platform !== undefined) baseUpdate['platform'] = platform;
      if (saga !== undefined) baseUpdate['saga'] = saga;
      if (platineTime !== undefined) baseUpdate['platineTime'] = platineTime;
      baseUpdatedFile = updateBaseGameInFiles(baseUpdate);

      if (originalTitle || originalEditor) {
        const users = loadUsers();
        const matchTitle = originalTitle || target.title;
        const matchEditor = originalEditor || target.editor;
        users.forEach((user: any) => {
          try {
            const files = getUserGamesFiles(user.username);
            files.forEach((filePath: string) => {
              updateGameIdentityInFile(filePath, {
                matchTitle,
                matchEditor,
                title: target.title,
                editor: target.editor,
              });
            });
          } catch (error: any) {
            if (!String(error.message || '').includes('not found')) {
              throw error;
            }
          }
        });
      }
    }

    res.json({ ok: true, updated: updatedCount, baseFile: baseUpdatedFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
