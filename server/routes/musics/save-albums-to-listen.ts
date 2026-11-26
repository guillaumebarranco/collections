const express = require('express');
const {
  normalizeString,
  addAlbumsToListen,
  removeAlbumToListen,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.post('/albums-to-listen/remove', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    const artist = normalizeString(input.artist, 'artist');
    const album = normalizeString(input.album, 'album');
    if (!userId || !artist || !album) {
      res.status(400).json({ error: 'Missing userId, artist or album' });
      return;
    }
    removeAlbumToListen(userId, artist, album);
    res.json({ ok: true, artist, album });
  } catch (error: any) {
    if (error.message === 'Album not found') {
      res.status(404).json({ error: 'Album not found' });
      return;
    }
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.post('/albums-to-listen', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const albums = (Array.isArray(input.albums) ? input.albums : [])
      .map((album: any) => ({
        artist: normalizeString(album?.artist, 'artist'),
        album: normalizeString(album?.album, 'album'),
      }))
      .filter(
        (album: {
          artist?: string;
          album?: string;
        }): album is { artist: string; album: string } =>
          !!album.artist && !!album.album
      );
    if (albums.length === 0) {
      res.status(400).json({ error: 'Missing albums' });
      return;
    }
    const saved = addAlbumsToListen(userId, albums);
    res.json({ ok: true, added: albums.length, total: saved.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
