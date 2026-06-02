const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserSeriesFiles,
  parseSeriesFromFile,
} = require('../../utils/series/series-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type {
  UserSerie,
  UserSerieSeason,
} from '../../../src/app/models/serie-model';

type SerieWatcherSeasonRow = {
  seasonNumber: number;
  seasonRating: number;
  seasonTimesWatched: number;
  watching: boolean;
};

type SerieWatcherRow = {
  userId: string;
  rating: number;
  timesWatched: number;
  seasons: SerieWatcherSeasonRow[];
};

const router = express.Router();

const USERS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);

function serieWatchCount(serie: UserSerie): number {
  return (serie.seasons ?? []).reduce(
    (acc: number, se: { seasonTimesWatched?: number }) =>
      acc + Math.max(0, Math.floor(se.seasonTimesWatched ?? 0)),
    0
  );
}

function serieAvgRating(serie: UserSerie): number {
  const seasons = serie.seasons ?? [];
  const rated = seasons.filter(
    (se: { seasonTimesWatched?: number; seasonRating?: number }) =>
      (se.seasonTimesWatched ?? 0) >= 1 && (se.seasonRating ?? 0) > 0
  );
  if (rated.length === 0) return 0;
  const total = rated.reduce(
    (a: number, se: { seasonRating?: number }) => a + (se.seasonRating ?? 0),
    0
  );
  return Math.round((total / rated.length) * 2) / 2;
}

function mapSeasonsForResponse(
  seasons: UserSerieSeason[]
): SerieWatcherSeasonRow[] {
  return [...(seasons ?? [])]
    .filter(
      (se) =>
        se.watching === true ||
        (se.seasonTimesWatched ?? 0) > 0
    )
    .sort((a, b) => a.seasonNumber - b.seasonNumber)
    .map((se) => ({
      seasonNumber: se.seasonNumber,
      seasonRating: se.seasonRating ?? 0,
      seasonTimesWatched: se.seasonTimesWatched ?? 0,
      watching: Boolean(se.watching),
    }));
}

router.get('/serie-watchers', (req: any, res: any) => {
  try {
    const title = normalizeString(req.query.title, 'title');
    const director = normalizeString(req.query.director, 'director');
    if (!title?.trim() || !director?.trim()) {
      return res
        .status(400)
        .json({ error: 'Query params title and director are required' });
    }

    const targetTitle = title.trim();
    const targetDirector = director.trim();
    const results: SerieWatcherRow[] = [];

    if (!fs.existsSync(USERS_DIR)) {
      return res.json(results);
    }

    const entries = fs.readdirSync(USERS_DIR, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const rawUserId = ent.name;
      try {
        const files = getUserSeriesFiles(rawUserId);
        const series: UserSerie[] = files.flatMap((f: string) =>
          parseSeriesFromFile(fs.readFileSync(f, 'utf8'))
        );
        const match = series.find(
          (s) => s.title === targetTitle && s.director === targetDirector
        );
        if (!match) continue;
        const tw = serieWatchCount(match);
        if (tw <= 0) continue;
        results.push({
          userId: normalizeUsername(rawUserId),
          rating: serieAvgRating(match),
          timesWatched: tw,
          seasons: mapSeasonsForResponse(match.seasons ?? []),
        });
      } catch (error: any) {
        if (!String(error.message || '').includes('not found')) {
          throw error;
        }
      }
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
