const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateGameInFile,
  getUserGamesFiles,
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
    const fileState = new Map(
      gameFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; editor: string }[] = [];
    let updatedCount = 0;

    for (const rawGame of games) {
      const title = normalizeString(rawGame?.title, 'title');
      const editor = normalizeString(rawGame?.editor, 'editor');
      if (!title || !editor) {
        res.status(400).json({ error: 'Missing title or editor' });
        return;
      }

      const payload = {
        title,
        editor,
        timesFinished: normalizeNumber(rawGame?.timesFinished, 'timesFinished'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateGameInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Game not found') {
            throw error;
          }
        }
      }

      if (!updated) {
        missing.push({ title, editor });
      }
    }

    for (const [filePath, state] of fileState.entries()) {
      const stateObject = state as { content: string; dirty: boolean };
      if (!stateObject.dirty) continue;
      fs.writeFileSync(filePath, stateObject.content, 'utf8');
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
