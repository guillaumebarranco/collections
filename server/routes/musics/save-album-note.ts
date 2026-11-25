const express = require('express');
const {
  normalizeNumber,
  normalizeString,
  saveAlbumNote,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.post('/album-note', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    const artist = normalizeString(input.artist, 'artist');
    const album = normalizeString(input.album, 'album');
    const rating = normalizeNumber(input.rating, 'rating');
    if (!userId || !artist || !album || rating === undefined) {
      res.status(400).json({ error: 'Missing userId, artist, album or rating' });
      return;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      res.status(400).json({ error: 'Invalid rating' });
      return;
    }

    saveAlbumNote(userId, artist, album, rating);
    res.json({ ok: true, artist, album, rating });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
