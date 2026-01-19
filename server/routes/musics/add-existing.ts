const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  appendObjectToArrayFile,
  parseUserMusicsFromFile,
  getUserMusicsFiles,
  getUserMusicsTargetFile,
  escapeString,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

function formatUserMusic(music: any) {
  return `  {\n    title: '${escapeString(
    music.title
  )}',\n    artist: '${escapeString(
    music.artist
  )}',\n    rating: 0,\n    timesListened: 1,\n  },`;
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const musics = Array.isArray(input.musics) ? input.musics : [];
    const normalizedMusics = musics
      .map((music: any) => ({
        title: normalizeString(music.title, 'title'),
        artist: normalizeString(music.artist, 'artist'),
      }))
      .filter((music: any) => music.title && music.artist);

    if (normalizedMusics.length === 0) {
      res.status(400).json({ error: 'Missing musics' });
      return;
    }

    const userFiles = getUserMusicsFiles(userId);
    const existing = userFiles.flatMap((musicFile: string) => {
      const fileContent = fs.readFileSync(musicFile, 'utf8');
      return parseUserMusicsFromFile(fileContent).map((music: any) => ({
        title: music.title,
        artist: music.artist,
      }));
    });

    const existingSet = new Set(
      existing.map((music: any) => `${music.title}|${music.artist}`)
    );

    const toAdd = normalizedMusics.filter(
      (music: any) => !existingSet.has(`${music.title}|${music.artist}`)
    );

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Musics already exist for user' });
      return;
    }

    const userFile = getUserMusicsTargetFile(userId);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    for (const music of toAdd) {
      nextContent = appendObjectToArrayFile(userFile, formatUserMusic(music));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    res.json({
      ok: true,
      added: toAdd.length,
      file: userFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
