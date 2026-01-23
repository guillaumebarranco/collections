const express = require('express');
const {
  normalizeBoolean,
  normalizeString,
  updateGameInFile,
  getUserGamesFiles,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.post('/batch-owned', (req: any, res: any) => {
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

    const files = getUserGamesFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User games not found' });
      return;
    }

    const missing: { title: string; editor: string }[] = [];
    let updatedCount = 0;

    games.forEach((rawGame: any) => {
      const title = normalizeString(rawGame?.title, 'title');
      const editor = normalizeString(rawGame?.editor, 'editor');
      if (!title || !editor) {
        return;
      }

      const payload = {
        title,
        editor,
        owned: normalizeBoolean(rawGame?.owned, 'owned'),
      };

      let updated = false;
      for (const filePath of files) {
        if (updateGameInFile(filePath, payload)) {
          updated = true;
          updatedCount += 1;
          break;
        }
      }

      if (!updated) {
        missing.push({ title, editor });
      }
    });

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
