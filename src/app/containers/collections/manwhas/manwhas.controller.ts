import { getApiBaseUrl } from '../../../core/config';
import { Manwha } from '../../../models/manwha-model';

export async function updateReadPriority(
  data: {
    manwha: Manwha;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.manwha.title,
        author: data.manwha.author,
        rating: data.manwha.rating,
        readTimes: data.manwha.readTimes,
        readDate: data.manwha.readDate,
        owned: data.manwha.owned,
        readPriority: data.priority,
        wantToReadAgain: data.manwha.wantToReadAgain ?? false,
        ratingComment: data.manwha.ratingComment ?? '',
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

export async function markManwhaAsWantToReRead(
  manwha: Manwha,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: manwha.title,
        author: manwha.author,
        rating: manwha.rating,
        readTimes: manwha.readTimes,
        readDate: manwha.readDate,
        owned: manwha.owned,
        readPriority: manwha.readPriority ?? 1,
        wantToReadAgain: true,
        ratingComment: manwha.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à relire:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer manwha à relire.', error);
    return false;
  }
}

export async function markManwhaAsReRead(
  manwha: Manwha,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: manwha.title,
        author: manwha.author,
        rating: manwha.rating,
        readTimes: manwha.readTimes,
        readDate: manwha.readDate,
        owned: manwha.owned,
        readPriority: manwha.readPriority ?? 1,
        wantToReadAgain: false,
        ratingComment: manwha.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer relu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer manwha relu.', error);
    return false;
  }
}

/** Readlist : marque le manwha comme commencé (readTimes = 0.5), reste dans la readlist. */
export async function markReadlistManwhaAsStarted(
  manwha: Manwha,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: manwha.title,
        author: manwha.author,
        rating: manwha.rating ?? 0,
        readTimes: 0.5,
        readDate: manwha.readDate ?? '',
        owned: manwha.owned ?? false,
        borrowed: manwha.borrowed ?? '',
        loaned: manwha.loaned ?? '',
        readPriority: manwha.readPriority ?? 1,
        wantToReadAgain: manwha.wantToReadAgain ?? false,
        ratingComment: manwha.ratingComment ?? '',
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec du marquage « en cours de lecture » :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors du marquage « en cours de lecture ».',
      error
    );
    return false;
  }
}

export async function addManwhaToReadlist(
  manwha: Manwha,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, manwhas: [manwha], readlist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout manwha à la readlist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout manwha à la readlist.", error);
    return false;
  }
}

export async function addManwhaAsRead(
  manwha: Manwha,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/manwhas/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, manwhas: [manwha], readlist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout manwha en « lu »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout manwha en « lu ».", error);
    return false;
  }
}
