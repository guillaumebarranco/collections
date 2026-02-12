import { getApiBaseUrl } from '../../../core/config';
import { Bd } from '../../../models/bd-model';

export async function updateReadPriority(
  data: { bd: Bd; priority: number },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/bds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.bd.title,
        writer: data.bd.writer,
        rating: data.bd.rating,
        readTimes: data.bd.readTimes,
        readDate: data.bd.readDate,
        owned: data.bd.owned,
        readPriority: data.priority,
        wantToReadAgain: data.bd.wantToReadAgain ?? false,
        ratingComment: data.bd.ratingComment ?? '',
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

export async function markBdAsWantToReRead(
  bd: Bd,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/bds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: bd.title,
        writer: bd.writer,
        rating: bd.rating,
        readTimes: bd.readTimes,
        readDate: bd.readDate,
        owned: bd.owned,
        readPriority: bd.readPriority ?? 1,
        wantToReadAgain: true,
        ratingComment: bd.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à relire:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer BD à relire.', error);
    return false;
  }
}

export async function markBdAsReRead(
  bd: Bd,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/bds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: bd.title,
        writer: bd.writer,
        rating: bd.rating,
        readTimes: bd.readTimes,
        readDate: bd.readDate,
        owned: bd.owned,
        readPriority: bd.readPriority ?? 1,
        wantToReadAgain: false,
        ratingComment: bd.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer relu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer BD relue.', error);
    return false;
  }
}
