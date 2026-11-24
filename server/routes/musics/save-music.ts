const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateMusicInFile,
  getUserMusicsFiles,
} = require('../../utils/musics/musics-utils');
const { normalizeQuotes } = require('../../utils/quotes/quotes-utils');

const router = express.Router();

function normalizeBoolean(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean for ${field}`);
}

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    const title = normalizeString(input.title, 'title');
    const artist = normalizeString(input.artist, 'artist');
    if (!userId || !title || !artist) {
      res.status(400).json({ error: 'Missing userId, title or artist' });
      return;
    }

    const hasQuotes = Array.isArray(input.quotes);
    const timesListened =
      input.timesListened === undefined
        ? undefined
        : normalizeNumber(input.timesListened, 'timesListened');
    const byHeart =
      input.byHeart === undefined
        ? undefined
        : normalizeBoolean(input.byHeart, 'byHeart');

    if (!hasQuotes && timesListened === undefined && byHeart === undefined) {
      res.status(400).json({ error: 'Missing quotes, timesListened or byHeart' });
      return;
    }
    if (
      timesListened !== undefined &&
      (!Number.isInteger(timesListened) || timesListened < 0)
    ) {
      res.status(400).json({ error: 'Invalid timesListened' });
      return;
    }

    const quotes = hasQuotes ? normalizeQuotes(input.quotes) : undefined;

    const musicFiles = getUserMusicsFiles(userId);
    let updatedFile: string | null = null;
    for (const musicFile of musicFiles) {
      const fileContent = fs.readFileSync(musicFile, 'utf8');
      try {
        const updatedContent = updateMusicInFile(fileContent, {
          title,
          artist,
          quotes,
          timesListened,
          byHeart,
        });
        fs.writeFileSync(musicFile, updatedContent, 'utf8');
        updatedFile = musicFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Music not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Music not found' });
      return;
    }

    res.json({
      ok: true,
      title,
      artist,
      ...(hasQuotes ? { quotes } : {}),
      ...(timesListened !== undefined ? { timesListened } : {}),
      ...(byHeart !== undefined ? { byHeart } : {}),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
