const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserMusicsFiles,
  parseUserMusicsFromFile,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.get('/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const musicFiles = getUserMusicsFiles(userId);
    const musics = musicFiles.flatMap((musicFile: string) => {
      const fileContent = fs.readFileSync(musicFile, 'utf8');
      return parseUserMusicsFromFile(fileContent);
    });

    res.json(musics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
