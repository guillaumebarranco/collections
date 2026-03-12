import { getApiBaseUrl } from '../../../core/config';
import { Serie } from '../../../models/serie-model';

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
