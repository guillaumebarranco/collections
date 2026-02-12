import { getApiBaseUrl } from '../../../core/config';
import { Comic } from '../../../models/comic-model';

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
        readPriority: data.priority,
        wantToReadAgain: data.comic.wantToReadAgain ?? false,
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
        readPriority: comic.readPriority ?? 1,
        wantToReadAgain: true,
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
        readPriority: comic.readPriority ?? 1,
        wantToReadAgain: false,
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
