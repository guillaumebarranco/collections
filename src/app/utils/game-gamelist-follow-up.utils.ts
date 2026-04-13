import type { Game } from '../models/game-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import { computeNextTierProgressRow } from './badge-follow-up-tier.utils';
import { buildBadgeThresholdStatsFromCollections } from './badge-threshold-stats.collections';

/** Progression après passage gamelist → joué (aligné sur check-badges). */
export function buildGameGamelistFollowUpProgress(
  _game: Game,
  allUserGames: Game[]
): EntityBadgeProgressRow[] {
  const stats = buildBadgeThresholdStatsFromCollections({
    books: [],
    movies: [],
    games: allUserGames,
    series: [],
    mangas: [],
    manwhas: [],
    comics: [],
    bds: [],
  });
  const rows: EntityBadgeProgressRow[] = [];
  const p = computeNextTierProgressRow(stats.gamesPlayed, 'gamesPlayed');
  if (p) {
    rows.push({ ...p, unitLabel: 'jeux' });
  }
  const f = computeNextTierProgressRow(stats.gamesFinished, 'gamesFinished');
  if (f) {
    rows.push({ ...f, unitLabel: 'jeux terminés' });
  }
  return rows;
}
