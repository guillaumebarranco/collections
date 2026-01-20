const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  getUserMusicsFiles,
  parseUserMusicsFromFile,
  getSoundtracksData,
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

    if (userId === 'ronan') {
      const extra = getSoundtracksData().map((item: any) => ({
        title: item.title,
        artist: item.artist,
        rating: 0,
        timesListened: 1,
      }));
      const existingKeys = new Set(
        musics.map(
          (music: any) =>
            `${music.title}`.toLowerCase() + '|' + `${music.artist}`.toLowerCase()
        )
      );
      const merged = [
        ...musics,
        ...extra.filter(
          (music: any) =>
            !existingKeys.has(
              `${music.title}`.toLowerCase() +
                '|' +
                `${music.artist}`.toLowerCase()
            )
        ),
      ];
      res.json(merged);
      return;
    }

    res.json(musics);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
