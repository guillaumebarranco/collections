const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateGameInFile,
  getUserGamesFiles,
  parseGamesFromFile,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.post('/batch-times-finished', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const games = Array.isArray(input.games) ? input.games : [];
    if (games.length === 0) {
      res.status(400).json({ error: 'Missing games' });
      return;
    }

    const gameFiles = getUserGamesFiles(userId);
    const missing = [];
    let updatedCount = 0;

    for (const rawGame of games) {
      const title = normalizeString(rawGame?.title, 'title');
      const editor = normalizeString(rawGame?.editor, 'editor');
      if (!title || !editor) {
        res.status(400).json({ error: 'Missing title or editor' });
        return;
      }

      let updated = false;
      for (const filePath of gameFiles) {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileGames = parseGamesFromFile(content);
        const index = fileGames.findIndex(
          (g) => g.title === title && g.editor === editor
        );
        if (index === -1) continue;
        const game = fileGames[index];
        const sessions = Array.isArray(game.sessions) ? [...game.sessions] : [];
        const count = normalizeNumber(rawGame?.timesFinished, 'timesFinished') ?? 1;
        for (let i = 0; i < count; i++) {
          sessions.push({
            finishedGame: true,
            finishedGameWithHundredPercent: false,
            platinedGame: false,
            additionnalEstimatedTime: 0,
          });
        }
        const payload = {
          title,
          editor,
          rating: game.rating ?? 0,
          owned: game.owned ?? false,
          gamelistPriority: game.gamelistPriority ?? 1,
          wantToPlayAgain: game.wantToPlayAgain ?? false,
          sessions,
        };
        if (updateGameInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }
      if (!updated) missing.push({ title, editor });
    }

    res.json({
      ok: true,
      updatedCount,
      missing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
