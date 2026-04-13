import type { Movie } from '../models/movie-model';
import type { BadgeThresholdStatKey } from './users/badges';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import { computeNextTierProgressRow } from './badge-follow-up-tier.utils';
import {
  buildBadgeThresholdStatsFromCollections,
  itemMatchesGenreTokens,
} from './badge-threshold-stats.collections';

const SF_TOKENS = [
  'science-fiction',
  'science fiction',
  'scifi',
  'sci fi',
] as const;

const MOVIE_FOLLOW_UP_GENRE_RULES: {
  statKey: BadgeThresholdStatKey;
  tokens: readonly string[];
  unitLabel: string;
}[] = [
  {
    statKey: 'moviesRomanceWatched',
    tokens: ['romance'],
    unitLabel: 'films romance',
  },
  {
    statKey: 'moviesScienceFictionWatched',
    tokens: [...SF_TOKENS],
    unitLabel: 'films de science-fiction',
  },
  {
    statKey: 'moviesThrillerWatched',
    tokens: ['thriller'],
    unitLabel: 'films thriller',
  },
  {
    statKey: 'moviesHorreurWatched',
    tokens: ['horreur', 'horror'],
    unitLabel: "films d'horreur",
  },
  {
    statKey: 'moviesComedieWatched',
    tokens: ['comedie', 'comedy'],
    unitLabel: 'films comédie',
  },
  { statKey: 'moviesActionWatched', tokens: ['action'], unitLabel: 'films action' },
];

/** Lignes à afficher après watchlist → vu (cinéphile + genres concernés). */
export function buildMovieWatchFollowUpProgress(
  movie: Movie,
  allUserMovies: Movie[]
): EntityBadgeProgressRow[] {
  const stats = buildBadgeThresholdStatsFromCollections({
    books: [],
    movies: allUserMovies,
    games: [],
    series: [],
    mangas: [],
    manwhas: [],
    comics: [],
    bds: [],
  });

  const rows: EntityBadgeProgressRow[] = [];
  const cine = computeNextTierProgressRow(stats.moviesWatched, 'moviesWatched');
  if (cine) {
    rows.push({ ...cine, unitLabel: 'films' });
  }

  for (const rule of MOVIE_FOLLOW_UP_GENRE_RULES) {
    if (!itemMatchesGenreTokens(movie, rule.tokens)) {
      continue;
    }
    const row = computeNextTierProgressRow(stats[rule.statKey], rule.statKey);
    if (row) {
      rows.push({ ...row, unitLabel: rule.unitLabel });
    }
  }
  return rows;
}
