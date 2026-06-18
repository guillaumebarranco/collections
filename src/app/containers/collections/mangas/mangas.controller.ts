import { getApiBaseUrl } from '../../../core/config';
import { Manga } from '../../../models/manga-model';

function clampPriority(
  priority: number | null | undefined
): number {
  const n =
    typeof priority === 'number' && Number.isFinite(priority) ? priority : 1;
  return Math.min(3, Math.max(1, n));
}

export async function updateReadPriority(
  data: {
    manga: Manga;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.manga.title,
        author: data.manga.author,
        rating: data.manga.rating,
        readTimes: data.manga.readTimes,
        readDate: data.manga.readDate,
        owned: data.manga.owned,
        readPriority: clampPriority(data.priority),
        wantToReadAgain: data.manga.wantToReadAgain ?? false,
        ratingComment: data.manga.ratingComment ?? '',
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

export async function markMangaAsWantToReRead(
  manga: Manga,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: manga.title,
        author: manga.author,
        rating: manga.rating,
        readTimes: manga.readTimes,
        readDate: manga.readDate,
        owned: manga.owned,
        readPriority: clampPriority(manga.readPriority),
        wantToReadAgain: true,
        ratingComment: manga.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à relire:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer manga à relire.', error);
    return false;
  }
}

export async function markMangaAsReRead(
  manga: Manga,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: manga.title,
        author: manga.author,
        rating: manga.rating,
        readTimes: manga.readTimes,
        readDate: manga.readDate,
        owned: manga.owned,
        readPriority: clampPriority(manga.readPriority),
        wantToReadAgain: false,
        ratingComment: manga.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer relu:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer manga relu.', error);
    return false;
  }
}

/** Readlist : marque le manga comme commencé (reading = true), reste dans la readlist. */
export async function markReadlistMangaAsStarted(
  manga: Manga,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: manga.title,
        author: manga.author,
        rating: manga.rating ?? 0,
        reading: true,
        readTimes: 0,
        readDate: manga.readDate ?? '',
        owned: manga.owned ?? false,
        borrowed: manga.borrowed ?? '',
        loaned: manga.loaned ?? '',
        readPriority: clampPriority(manga.readPriority),
        wantToReadAgain: manga.wantToReadAgain ?? false,
        ratingComment: manga.ratingComment ?? '',
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

export async function addMangaToReadlist(
  manga: Manga,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mangas: [manga], readlist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout manga à la readlist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout manga à la readlist.", error);
    return false;
  }
}

/** Ajoute le manga parmi les mangas lus de l'utilisateur (readlist: false). */
export async function addMangaAsRead(
  manga: Manga,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/mangas/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, mangas: [manga], readlist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout manga en « lu »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout manga en « lu ».", error);
    return false;
  }
}
