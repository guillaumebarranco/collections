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
    const favorite =
      input.favorite === undefined || input.favorite === null
        ? undefined
        : input.favorite === true || input.favorite === 'true'
          ? true
          : input.favorite === false || input.favorite === 'false'
            ? false
            : null;
    if (!userId || !artist || !album) {
      res.status(400).json({ error: 'Missing userId, artist or album' });
      return;
    }
    if (rating === undefined && favorite === undefined) {
      res.status(400).json({ error: 'Missing rating or favorite' });
      return;
    }
    if (favorite === null) {
      res.status(400).json({ error: 'Invalid favorite' });
      return;
    }
    if (
      rating !== undefined &&
      (!Number.isFinite(rating) || rating < 0 || rating > 5)
    ) {
      res.status(400).json({ error: 'Invalid rating' });
      return;
    }

    saveAlbumNote(userId, artist, album, {
      ...(rating !== undefined ? { rating } : {}),
      ...(favorite !== undefined ? { favorite } : {}),
    });
    res.json({ ok: true, artist, album, rating, favorite });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
