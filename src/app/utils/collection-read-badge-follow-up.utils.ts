import type { Serie } from '../models/serie-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import { computeNextTierProgressRow } from './badge-follow-up-tier.utils';
import { countSeriesSeenForBadges } from './series.utils';

export function buildMangaReadlistFollowUpProgress(
  allUserMangas: { length: number }
): EntityBadgeProgressRow[] {
  const row = computeNextTierProgressRow(allUserMangas.length, 'mangasRead');
  return row ? [{ ...row, unitLabel: 'mangas' }] : [];
}

export function buildManwhaReadlistFollowUpProgress(
  allUserManwhas: { length: number }
): EntityBadgeProgressRow[] {
  const row = computeNextTierProgressRow(allUserManwhas.length, 'manwhasRead');
  return row ? [{ ...row, unitLabel: 'manhwas' }] : [];
}

export function buildComicReadlistFollowUpProgress(
  allUserComics: { length: number }
): EntityBadgeProgressRow[] {
  const row = computeNextTierProgressRow(allUserComics.length, 'comicsRead');
  return row ? [{ ...row, unitLabel: 'comics' }] : [];
}

export function buildBdReadlistFollowUpProgress(
  allUserBds: { length: number }
): EntityBadgeProgressRow[] {
  const row = computeNextTierProgressRow(allUserBds.length, 'bdsRead');
  return row ? [{ ...row, unitLabel: 'BD' }] : [];
}

export function buildSeriesWatchFollowUpProgress(
  allUserSeries: Serie[]
): EntityBadgeProgressRow[] {
  const n = countSeriesSeenForBadges(allUserSeries);
  const row = computeNextTierProgressRow(n, 'seriesWatched');
  return row ? [{ ...row, unitLabel: 'séries' }] : [];
}
