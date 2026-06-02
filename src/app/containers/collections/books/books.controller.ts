import { getApiBaseUrl } from '../../../core/config';
import { Book } from '../../../models/book-model';
import {
  shiftPreviousLastDateToExtras,
  todayIsoDate,
} from '../../../utils/activity-extra-dates.utils';

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

/** Ajoute le livre parmi les livres lus de l'utilisateur (readlist: false, lu une fois). */
export async function addBookAsRead(
  book: Book,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        books: [book],
        readlist: false,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        "Échec de l'ajout du livre en « lu » :",
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Erreur réseau lors de l'ajout du livre en « lu ».", error);
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
        firstReadDate: book.firstReadDate,
        lastReadDate: book.lastReadDate,
        owned: book.owned,
        readPriority: book.readPriority ?? 0,
        wantToReadAgain: true,
        ratingComment: book.ratingComment ?? '',
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
    const today = todayIsoDate();
    const otherReadDates = shiftPreviousLastDateToExtras(
      book.lastReadDate,
      book.otherReadDates,
      today
    );
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
        firstReadDate: book.firstReadDate,
        lastReadDate: today,
        otherReadDates,
        owned: book.owned,
        readPriority: book.readPriority ?? 0,
        wantToReadAgain: false,
        ratingComment: book.ratingComment ?? '',
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

/** Livre déjà lu (ex. à relire) : relecture en cours (reading = true). */
export async function markReadBookAsReadingInProgress(
  book: Book,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: book.title,
        author: book.author,
        rating: book.rating ?? 0,
        reading: true,
        readTimes: book.readTimes ?? 1,
        firstReadDate: book.firstReadDate ?? '',
        lastReadDate: book.lastReadDate ?? '',
        owned: book.owned ?? false,
        borrowed: book.borrowed ?? '',
        loaned: book.loaned ?? '',
        readPriority: book.readPriority ?? 1,
        wantToReadAgain: book.wantToReadAgain ?? false,
        ratingComment: book.ratingComment ?? '',
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec du marquage « relecture en cours » :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors du marquage « relecture en cours ».',
      error
    );
    return false;
  }
}

/** Readlist : marque le livre comme commencé (reading = true), reste dans la readlist. */
export async function markReadlistBookAsStarted(
  book: Book,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: book.title,
        author: book.author,
        rating: book.rating ?? 0,
        reading: true,
        readTimes: 0,
        firstReadDate: book.firstReadDate ?? '',
        lastReadDate: book.lastReadDate ?? '',
        owned: book.owned ?? false,
        borrowed: book.borrowed ?? '',
        loaned: book.loaned ?? '',
        readPriority: book.readPriority ?? 1,
        wantToReadAgain: book.wantToReadAgain ?? false,
        ratingComment: book.ratingComment ?? '',
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
    console.warn('Erreur réseau lors du marquage « en cours de lecture ».', error);
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
        firstReadDate: data.book.firstReadDate,
        lastReadDate: data.book.lastReadDate,
        owned: data.book.owned,
        readPriority: data.priority,
        wantToReadAgain: data.book.wantToReadAgain ?? false,
        ratingComment: data.book.ratingComment ?? '',
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
