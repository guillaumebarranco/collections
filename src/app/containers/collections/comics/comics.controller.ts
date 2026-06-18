import { getApiBaseUrl } from '../../../core/config';
import { Comic } from '../../../models/comic-model';

function clampPriority(
  priority: number | null | undefined
): number {
  const n =
    typeof priority === 'number' && Number.isFinite(priority) ? priority : 1;
  return Math.min(3, Math.max(1, n));
}

export async function updateReadPriority(
  data: {
    comic: Comic;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/comics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.comic.title,
        writer: data.comic.writer,
        rating: data.comic.rating,
        readTimes: data.comic.readTimes,
        readDate: data.comic.readDate,
        owned: data.comic.owned,
        readPriority: clampPriority(data.priority),
        wantToReadAgain: data.comic.wantToReadAgain ?? false,
        ratingComment: data.comic.ratingComment ?? '',
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

export async function markComicAsWantToReRead(
  comic: Comic,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/comics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: comic.title,
        writer: comic.writer,
        rating: comic.rating,
        readTimes: comic.readTimes,
        readDate: comic.readDate,
        owned: comic.owned,
        readPriority: clampPriority(comic.readPriority),
        wantToReadAgain: true,
        ratingComment: comic.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à relire:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer comic à relire.', error);
    return false;
  }
}

export async function markComicAsReRead(
  comic: Comic,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/comics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: comic.title,
        writer: comic.writer,
        rating: comic.rating,
        readTimes: comic.readTimes,
        readDate: comic.readDate,
        owned: comic.owned,
        readPriority: clampPriority(comic.readPriority),
        wantToReadAgain: false,
        ratingComment: comic.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer relu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer comic relu.', error);
    return false;
  }
}

export async function addComicToReadlist(
  comic: Comic,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/comics/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comics: [comic], readlist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout comic à la readlist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout comic à la readlist.", error);
    return false;
  }
}

export async function addComicAsRead(
  comic: Comic,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/comics/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comics: [comic], readlist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout comic en « lu »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout comic en « lu ».", error);
    return false;
  }
}
