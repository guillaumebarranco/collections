import { getApiBaseUrl } from '../../../core/config';
import { Serie, UserSerieSeason } from '../../../models/serie-model';
import { getNextSeasonNumberForNewSeasonStarted } from '../../../utils/series.utils';

function buildWatchlistSeasonsWithHalfWatched(serie: Serie): {
  seasonNumber: number;
  seasonRating: number;
  seasonTimesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
}[] {
  const fromUser =
    serie.seasons && serie.seasons.length > 0
      ? serie.seasons
      : (serie.seasonsData ?? []).map((sd) => ({
          seasonNumber: sd.seasonNumber,
          seasonRating: 0,
          seasonTimesWatched: 0,
          firstViewedDate: '',
          lastViewedDate: '',
        }));
  return fromUser.map((s) => ({
    seasonNumber: s.seasonNumber,
    seasonRating: s.seasonRating ?? 0,
    seasonTimesWatched: 0.5,
    firstViewedDate: s.firstViewedDate ?? '',
    lastViewedDate: s.lastViewedDate ?? '',
  }));
}

export async function updateWatchPriority(
  data: {
    serie: Serie;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/series`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.serie.title,
        director: data.serie.director,
        seasons: data.serie.seasons,
        owned: data.serie.owned,
        watchPriority: data.priority,
        wantToWatchAgain: data.serie.wantToWatchAgain ?? false,
        ratingComment: data.serie.ratingComment ?? '',
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

export async function markSerieAsWantToReWatch(
  serie: Serie,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: serie.title,
        director: serie.director,
        seasons: serie.seasons,
        owned: serie.owned,
        watchPriority: serie.watchPriority ?? 1,
        wantToWatchAgain: true,
        ratingComment: serie.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à revoir:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer série à revoir.', error);
    return false;
  }
}

export async function markSerieAsReWatched(
  serie: Serie,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: serie.title,
        director: serie.director,
        seasons: serie.seasons,
        owned: serie.owned,
        watchPriority: serie.watchPriority ?? 1,
        wantToWatchAgain: false,
        ratingComment: serie.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer revu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer série revue.', error);
    return false;
  }
}

export async function addSerieToWatchlist(
  serie: Serie,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/series/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, series: [serie], watchlist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout série à la watchlist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout série à la watchlist.", error);
    return false;
  }
}

function buildWatchedSeasonsWithNextSeasonAtHalf(serie: Serie): UserSerieSeason[] | null {
  const next = getNextSeasonNumberForNewSeasonStarted(serie);
  if (next === null) {
    return null;
  }
  const count = serie.seasonsData?.length ?? 0;
  if (count < next) {
    return null;
  }

  const byNum = new Map<number, UserSerieSeason>();
  for (const s of serie.seasons ?? []) {
    byNum.set(s.seasonNumber, { ...s });
  }

  const result: UserSerieSeason[] = [];
  for (let sn = 1; sn <= count; sn++) {
    const prev = byNum.get(sn);
    const row: UserSerieSeason =
      prev ??
      ({
        seasonNumber: sn,
        seasonRating: 0,
        seasonTimesWatched: 0,
        firstViewedDate: '',
        lastViewedDate: '',
      } as UserSerieSeason);

    if (sn === next) {
      result.push({
        ...row,
        seasonNumber: sn,
        seasonTimesWatched: 0.5,
      });
    } else {
      result.push({
        ...row,
        seasonNumber: sn,
      });
    }
  }
  return result;
}

/** Fichier vus : saison N+1 (après dernière vue complète) → 0.5. */
export async function markWatchedSerieNextSeasonAsStarted(
  serie: Serie,
  userId: string
): Promise<boolean> {
  const seasons = buildWatchedSeasonsWithNextSeasonAtHalf(serie);
  if (!seasons?.length) {
    return false;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: serie.title,
        director: serie.director,
        seasons,
        owned: serie.owned ?? false,
        watchPriority: serie.watchPriority ?? 1,
        wantToWatchAgain: serie.wantToWatchAgain ?? false,
        ratingComment: serie.ratingComment ?? '',
        borrowed: serie.borrowed ?? '',
        loaned: serie.loaned ?? '',
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

/** Watchlist : chaque saison à seasonTimesWatched = 0.5 (équivalent readTimes 0.5 côté livres). */
export async function markWatchlistSerieAsStarted(
  serie: Serie,
  userId: string
): Promise<boolean> {
  const seasons = buildWatchlistSeasonsWithHalfWatched(serie);
  if (seasons.length === 0) {
    return false;
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/series`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: serie.title,
        director: serie.director,
        seasons,
        owned: serie.owned ?? false,
        watchPriority: serie.watchPriority ?? 1,
        wantToWatchAgain: serie.wantToWatchAgain ?? false,
        ratingComment: serie.ratingComment ?? '',
        borrowed: serie.borrowed ?? '',
        loaned: serie.loaned ?? '',
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

export async function addSerieAsWatched(
  serie: Serie,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/series/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, series: [serie], watchlist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout série en « vue »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout série en « vue ».", error);
    return false;
  }
}
