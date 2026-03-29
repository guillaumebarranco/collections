import { BADGE_DEFINITIONS } from './users/badges';
import type { Game } from '../models/game-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';

/** Badges « avoir joué à N jeux » (sessions non vides). */
export const GAMES_PLAYED_TIERS: { id: string; threshold: number }[] = [
  { id: 'joueur-du-dimanche', threshold: 20 },
  { id: 'petit-joueur', threshold: 50 },
  { id: 'gamer', threshold: 100 },
  { id: 'nerd', threshold: 150 },
  { id: 'no-life', threshold: 200 },
];

/** Badges « avoir terminé N jeux ». */
export const GAMES_FINISHED_TIERS: { id: string; threshold: number }[] = [
  { id: 'joueur-capable', threshold: 50 },
  { id: 'champion-du-joystick', threshold: 100 },
  { id: 'virtuose-de-la-manette', threshold: 200 },
];

function badgeMeta(id: string): { name: string; image: string } {
  const def = BADGE_DEFINITIONS.find((b) => b.id === id);
  return {
    name: def?.name ?? id,
    image: def?.image ?? '/badges/games/Toad.png',
  };
}

export function countPlayedGames(games: Game[]): number {
  return games.filter((g) => (g.sessions?.length ?? 0) > 0).length;
}

export function countFinishedGames(games: Game[]): number {
  return games.filter((g) => (g.timesFinished ?? 0) > 0).length;
}

function getNextTierProgress(
  current: number,
  tiers: { id: string; threshold: number }[]
): EntityBadgeProgressRow | null {
  const tier = tiers.find((t) => current < t.threshold);
  if (!tier) {
    const last = tiers[tiers.length - 1];
    const meta = badgeMeta(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current,
      target: last.threshold,
      complete: current >= last.threshold,
    };
  }
  const meta = badgeMeta(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current,
    target: tier.threshold,
    complete: false,
  };
}

/** Progression après passage gamelist → joué. */
export function buildGameGamelistFollowUpProgress(
  _game: Game,
  allUserGames: Game[]
): EntityBadgeProgressRow[] {
  const played = countPlayedGames(allUserGames);
  const finished = countFinishedGames(allUserGames);
  const rows: EntityBadgeProgressRow[] = [];
  const p = getNextTierProgress(played, GAMES_PLAYED_TIERS);
  if (p) rows.push({ ...p, unitLabel: 'jeux' });
  const f = getNextTierProgress(finished, GAMES_FINISHED_TIERS);
  if (f) rows.push({ ...f, unitLabel: 'jeux terminés' });
  return rows;
}
