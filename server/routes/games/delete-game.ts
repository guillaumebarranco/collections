const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeGameFromFile,
  getUserAllGamesFiles,
} = require('../../utils/games/games-utils');

const router = express.Router();

router.post('/delete', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const editor = normalizeString(input.editor, 'editor');
    if (!title || !editor) {
      res.status(400).json({ error: 'Missing title or editor' });
      return;
    }

    const gameFiles = getUserAllGamesFiles(userId);
    let updatedFile: string | null = null;

    for (const gameFile of gameFiles) {
      const fileContent = fs.readFileSync(gameFile, 'utf8');
      try {
        const updatedContent = removeGameFromFile(fileContent, { title, editor });
        fs.writeFileSync(gameFile, updatedContent, 'utf8');
        updatedFile = gameFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Game not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Game not found' });
      return;
    }

    res.json({
      ok: true,
      game: { title, editor },
      file: updatedFile,
    });

    console.log(
      'game:delete',
      JSON.stringify({ file: updatedFile, title, editor })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
