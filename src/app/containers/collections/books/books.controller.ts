import { getApiBaseUrl } from '../../../core/config';
import { Book } from '../../../models/book-model';

export async function addBookToReadlist(
  book: Book,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        books: [book],
        readlist: true,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        "Échec de l'ajout batch des livres :",
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Erreur réseau lors de l'ajout batch des livres.", error);
    return false;
  }
}

export async function markBookAsWantToReRead(
  book: Book,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: book.title,
        author: book.author,
        rating: book.rating,
        readTimes: book.readTimes,
        readDate: book.readDate,
        owned: book.owned,
        readPriority: book.readPriority ?? 0,
        wantToReadAgain: true,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour du livre :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors de la mise à jour du livre.',
      error
    );
    return false;
  }
}

export async function markBookAsReRead(
  book: Book,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: book.title,
        author: book.author,
        rating: book.rating,
        readTimes: (book.readTimes ?? 0) + 1,
        readDate: book.readDate,
        owned: book.owned,
        readPriority: book.readPriority ?? 0,
        wantToReadAgain: false,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour du livre :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors de la mise à jour du livre.',
      error
    );
    return false;
  }
}

export async function updateReadPriority(
  data: {
    book: Book;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.book.title,
        author: data.book.author,
        rating: data.book.rating,
        readTimes: data.book.readTimes,
        readDate: data.book.readDate,
        owned: data.book.owned,
        readPriority: data.priority,
        wantToReadAgain: data.book.wantToReadAgain ?? false,
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
