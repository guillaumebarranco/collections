import { BADGE_DEFINITIONS } from './users/badges';
import type { Movie } from '../models/movie-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';

export type MovieBadgeProgressRow = EntityBadgeProgressRow;

/** Paliers badges « nombre de films vus » (ordre croissant). */
export const CINEPHILE_MOVIE_TIERS: { id: string; threshold: number }[] = [
  { id: 'cinephile-herbe', threshold: 100 },
  { id: 'cinephile-amateur', threshold: 300 },
  { id: 'cinephile-passionne', threshold: 500 },
  { id: 'cinephile-devoué', threshold: 800 },
  { id: 'cinephile-inconditionnel', threshold: 1000 },
];

/** Paliers badges « films de romance vus » — aligné avec movies-badges.ts. */
export const ROMANCE_MOVIE_TIERS: { id: string; threshold: number }[] = [
  { id: 'amour-jeunesse', threshold: 50 },
  { id: 'un-amour-de-cinema', threshold: 100 },
  { id: 'passion-vacances', threshold: 150 },
  { id: 'grand-amour-movies', threshold: 200 },
  { id: 'amour-eternel-movies', threshold: 300 },
];

function badgeMeta(id: string): { name: string; image: string } {
  const def = BADGE_DEFINITIONS.find((b) => b.id === id);
  return {
    name: def?.name ?? id,
    image: def?.image ?? '/badges/movies/Kevin_McCallister.png',
  };
}

/** Un film compte comme « vu » s'il a au moins un visionnage enregistré. */
export function countWatchedMovies(movies: Movie[]): number {
  return movies.filter((m) => (m.timesWatched ?? 0) > 0).length;
}

export function isRomanceMovieGenre(
  genre: string | string[] | undefined
): boolean {
  const parts = Array.isArray(genre)
    ? genre
    : genre?.trim()
      ? [genre]
      : [];
  return parts.some((p) => {
    const g = p.trim().toLowerCase();
    return g.includes('romance') || g.includes('romantique');
  });
}

export function countRomanceWatchedMovies(movies: Movie[]): number {
  return movies.filter(
    (m) => (m.timesWatched ?? 0) > 0 && isRomanceMovieGenre(m.genre)
  ).length;
}

/** Prochain palier cinéphile : ex. 456 / 500 pour « Cinéphile passionné ». */
export function getNextCinephileProgress(
  totalWatched: number
): EntityBadgeProgressRow | null {
  const tier = CINEPHILE_MOVIE_TIERS.find((t) => totalWatched < t.threshold);
  if (!tier) {
    const last = CINEPHILE_MOVIE_TIERS[CINEPHILE_MOVIE_TIERS.length - 1];
    const meta = badgeMeta(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current: totalWatched,
      target: last.threshold,
      complete: totalWatched >= last.threshold,
    };
  }
  const meta = badgeMeta(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current: totalWatched,
    target: tier.threshold,
    complete: false,
  };
}

export function getNextRomanceMovieProgress(
  romanceWatched: number
): EntityBadgeProgressRow | null {
  const tier = ROMANCE_MOVIE_TIERS.find((t) => romanceWatched < t.threshold);
  if (!tier) {
    const last = ROMANCE_MOVIE_TIERS[ROMANCE_MOVIE_TIERS.length - 1];
    const meta = badgeMeta(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current: romanceWatched,
      target: last.threshold,
      complete: romanceWatched >= last.threshold,
    };
  }
  const meta = badgeMeta(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current: romanceWatched,
    target: tier.threshold,
    complete: false,
  };
}

/** Lignes à afficher dans le suivi post-visionnage (watchlist → vu). */
export function buildMovieWatchFollowUpProgress(
  movie: Movie,
  allUserMovies: Movie[]
): EntityBadgeProgressRow[] {
  const total = countWatchedMovies(allUserMovies);
  const rows: EntityBadgeProgressRow[] = [];
  const cine = getNextCinephileProgress(total);
  if (cine) rows.push(cine);
  if (isRomanceMovieGenre(movie.genre)) {
    const romanceCount = countRomanceWatchedMovies(allUserMovies);
    const rom = getNextRomanceMovieProgress(romanceCount);
    if (rom) rows.push(rom);
  }
  return rows;
}
