import { getApiBaseUrl } from '../../../core/config';
import { Anime, UserAnimeSeason } from '../../../models/anime-model';
import { getNextSeasonNumberForNewSeasonStarted } from '../../../utils/animes.utils';

function buildWatchlistSeasonsWatching(anime: Anime): UserAnimeSeason[] {
  const fromUser =
    anime.seasons && anime.seasons.length > 0
      ? anime.seasons
      : (anime.seasonsData ?? []).map((sd) => ({
          seasonNumber: sd.seasonNumber,
          seasonRating: 0,
          seasonTimesWatched: 0,
          watching: false,
          firstViewedDate: '',
          lastViewedDate: '',
          otherViewedDates: [],
        }));
  return fromUser.map((s) => ({
    seasonNumber: s.seasonNumber,
    seasonRating: s.seasonRating ?? 0,
    seasonTimesWatched: 0,
    watching: true,
    firstViewedDate: s.firstViewedDate ?? '',
    lastViewedDate: s.lastViewedDate ?? '',
    otherViewedDates: s.otherViewedDates ?? [],
  }));
}

function clampPriority(
  priority: number | null | undefined
): number {
  const n =
    typeof priority === 'number' && Number.isFinite(priority) ? priority : 1;
  return Math.min(3, Math.max(1, n));
}

export async function updateWatchPriority(
  data: {
    anime: Anime;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.anime.title,
        director: data.anime.director,
        seasons: data.anime.seasons,
        owned: data.anime.owned,
        watchPriority: clampPriority(data.priority),
        wantToWatchAgain: data.anime.wantToWatchAgain ?? false,
        ratingComment: data.anime.ratingComment ?? '',
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour de la priorité :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors de la mise à jour de la priorité.',
      error
    );
    return false;
  }
}

export async function markAnimeAsWantToReWatch(
  anime: Anime,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: anime.title,
        director: anime.director,
        seasons: anime.seasons,
        owned: anime.owned,
        watchPriority: clampPriority(anime.watchPriority),
        wantToWatchAgain: true,
        ratingComment: anime.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à revoir:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer animé à revoir.', error);
    return false;
  }
}

export async function markAnimeAsReWatched(
  anime: Anime,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: anime.title,
        director: anime.director,
        seasons: anime.seasons,
        owned: anime.owned,
        watchPriority: clampPriority(anime.watchPriority),
        wantToWatchAgain: false,
        ratingComment: anime.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer revu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer animé revue.', error);
    return false;
  }
}

export async function addAnimeToWatchlist(
  anime: Anime,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, animes: [anime], watchlist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout animé à la watchlist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout animé à la watchlist.", error);
    return false;
  }
}

function buildWatchedSeasonsWithNextSeasonWatching(anime: Anime): UserAnimeSeason[] | null {
  const next = getNextSeasonNumberForNewSeasonStarted(anime);
  if (next === null) {
    return null;
  }
  const count = anime.seasonsData?.length ?? 0;
  if (count < next) {
    return null;
  }

  const byNum = new Map<number, UserAnimeSeason>();
  for (const s of anime.seasons ?? []) {
    byNum.set(s.seasonNumber, { ...s });
  }

  const result: UserAnimeSeason[] = [];
  for (let sn = 1; sn <= count; sn++) {
    const prev = byNum.get(sn);
    const row: UserAnimeSeason =
      prev ??
      ({
        seasonNumber: sn,
        seasonRating: 0,
        seasonTimesWatched: 0,
        watching: false,
        firstViewedDate: '',
        lastViewedDate: '',
        otherViewedDates: [],
      } as UserAnimeSeason);

    if (sn === next) {
      result.push({
        ...row,
        seasonNumber: sn,
        seasonTimesWatched: 0,
        watching: true,
      });
    } else {
      result.push({
        ...row,
        seasonNumber: sn,
        watching: false,
      });
    }
  }
  return result;
}

/** Fichier vus : saison N+1 (après dernière vue complète) → watching. */
export async function markWatchedAnimeNextSeasonAsStarted(
  anime: Anime,
  userId: string
): Promise<boolean> {
  const seasons = buildWatchedSeasonsWithNextSeasonWatching(anime);
  if (!seasons?.length) {
    return false;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: anime.title,
        director: anime.director,
        seasons,
        owned: anime.owned ?? false,
        watchPriority: clampPriority(anime.watchPriority),
        wantToWatchAgain: anime.wantToWatchAgain ?? false,
        ratingComment: anime.ratingComment ?? '',
        borrowed: anime.borrowed ?? '',
        loaned: anime.loaned ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec du marquage « nouvelle saison en cours » :',
        payload?.error || response.statusText
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors du marquage « nouvelle saison en cours ».',
      error
    );
    return false;
  }
}

/** Watchlist : chaque saison en watching (équivalent reading côté livres). */
export async function markWatchlistAnimeAsStarted(
  anime: Anime,
  userId: string
): Promise<boolean> {
  const seasons = buildWatchlistSeasonsWatching(anime);
  if (seasons.length === 0) {
    return false;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: anime.title,
        director: anime.director,
        seasons,
        owned: anime.owned ?? false,
        watchPriority: clampPriority(anime.watchPriority),
        wantToWatchAgain: anime.wantToWatchAgain ?? false,
        ratingComment: anime.ratingComment ?? '',
        borrowed: anime.borrowed ?? '',
        loaned: anime.loaned ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec du marquage « en cours de visionnage » :',
        payload?.error || response.statusText
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors du marquage « en cours de visionnage ».',
      error
    );
    return false;
  }
}

export async function addAnimeAsWatched(
  anime: Anime,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/animes/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, animes: [anime], watchlist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout animé en « vue »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout animé en « vue ».", error);
    return false;
  }
}
