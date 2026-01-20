const express = require('express');
const fs = require('fs');
const {
  getBaseMusicsFiles,
  parseBaseMusicsFullFromFile,
  getSoundtracksData,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.get('/entities', (_req: any, res: any) => {
  try {
    const baseFiles = getBaseMusicsFiles();
    const musics = baseFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseBaseMusicsFullFromFile(content);
    });

    const soundtrackData = getSoundtracksData();
    const soundtrackBase = soundtrackData.map((item: any) => ({
      title: item.title,
      artist: item.artist,
      album: 'Films/Séries/Jeux/Animés',
      coverUrl: '',
      releaseDate: '',
      duration: parseDurationToSeconds(item.duration),
      genre: 'Soundtrack',
    }));

    const existingKeys = new Set(
      musics.map(
        (music: any) =>
          `${music.title}`.toLowerCase() + '|' + `${music.artist}`.toLowerCase()
      )
    );
    const merged = [
      ...musics,
      ...soundtrackBase.filter(
        (music: any) =>
          !existingKeys.has(
            `${music.title}`.toLowerCase() +
              '|' +
              `${music.artist}`.toLowerCase()
          )
      ),
    ];

    res.json(merged);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

function parseDurationToSeconds(duration: string): number {
  if (!duration) return 0;
  const parts = duration.split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

module.exports = router;

export {};
