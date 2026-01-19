const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateMusicInFile,
  getUserMusicsFiles,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const musics = Array.isArray(input.musics) ? input.musics : [];
    if (musics.length === 0) {
      res.status(400).json({ error: 'Missing musics' });
      return;
    }

    const musicFiles = getUserMusicsFiles(userId);
    const fileState = new Map(
      musicFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; artist: string }[] = [];
    let updatedCount = 0;

    for (const rawMusic of musics) {
      const title = normalizeString(rawMusic?.title, 'title');
      const artist = normalizeString(rawMusic?.artist, 'artist');
      if (!title || !artist) {
        res.status(400).json({ error: 'Missing title or artist' });
        return;
      }

      const payload = {
        title,
        artist,
        rating: normalizeNumber(rawMusic?.rating, 'rating'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateMusicInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Music not found') {
            throw error;
          }
        }
      }

      if (!updated) {
        missing.push({ title, artist });
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
