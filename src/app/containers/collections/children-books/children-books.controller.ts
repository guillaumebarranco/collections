import { getApiBaseUrl } from '../../../core/config';
import { ChildrenBook } from '../../../models/children-book-model';
import {
  normalizeActivityExtraDates,
  shiftPreviousLastDateToExtras,
  todayIsoDate,
} from '../../../utils/activity-extra-dates.utils';

export async function addChildrenBookToReadlist(
  childrenBook: ChildrenBook,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        'children-books': [childrenBook],
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
export async function addChildrenBookAsRead(
  childrenBook: ChildrenBook,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        'children-books': [childrenBook],
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

export async function markChildrenBookAsWantToReRead(
  childrenBook: ChildrenBook,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: childrenBook.title,
        author: childrenBook.author,
        rating: childrenBook.rating,
        readTimes: childrenBook.readTimes,
        firstReadDate: childrenBook.firstReadDate,
        lastReadDate: childrenBook.lastReadDate,
        owned: childrenBook.owned,
        readPriority: childrenBook.readPriority ?? 0,
        wantToReadAgain: true,
        ratingComment: childrenBook.ratingComment ?? '',
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

export async function markChildrenBookAsReRead(
  childrenBook: ChildrenBook,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const today = todayIsoDate();
    const firstReadDate = (childrenBook.firstReadDate ?? '').trim();
    const previousLastReadDate = (childrenBook.lastReadDate ?? '').trim();
    const shouldArchivePreviousLastDate =
      Boolean(firstReadDate) &&
      Boolean(previousLastReadDate) &&
      firstReadDate !== previousLastReadDate;
    const otherReadDates = shouldArchivePreviousLastDate
      ? shiftPreviousLastDateToExtras(
          childrenBook.lastReadDate,
          childrenBook.otherReadDates,
          today
        )
      : normalizeActivityExtraDates(childrenBook.otherReadDates);
    const response = await fetch(`${getApiBaseUrl()}/children-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: childrenBook.title,
        author: childrenBook.author,
        rating: childrenBook.rating,
        reading: false,
        readTimes: (childrenBook.readTimes ?? 0) + 1,
        firstReadDate: childrenBook.firstReadDate,
        lastReadDate: today,
        otherReadDates,
        owned: childrenBook.owned,
        readPriority: childrenBook.readPriority ?? 0,
        wantToReadAgain: false,
        ratingComment: childrenBook.ratingComment ?? '',
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
export async function markReadChildrenBookAsReadingInProgress(
  childrenBook: ChildrenBook,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: childrenBook.title,
        author: childrenBook.author,
        rating: childrenBook.rating ?? 0,
        reading: true,
        readTimes: childrenBook.readTimes ?? 1,
        firstReadDate: childrenBook.firstReadDate ?? '',
        lastReadDate: childrenBook.lastReadDate ?? '',
        owned: childrenBook.owned ?? false,
        borrowed: childrenBook.borrowed ?? '',
        loaned: childrenBook.loaned ?? '',
        readPriority: childrenBook.readPriority ?? 1,
        wantToReadAgain: childrenBook.wantToReadAgain ?? false,
        ratingComment: childrenBook.ratingComment ?? '',
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
export async function markReadlistChildrenBookAsStarted(
  childrenBook: ChildrenBook,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title: childrenBook.title,
        author: childrenBook.author,
        rating: childrenBook.rating ?? 0,
        reading: true,
        readTimes: 0,
        firstReadDate: childrenBook.firstReadDate ?? '',
        lastReadDate: childrenBook.lastReadDate ?? '',
        owned: childrenBook.owned ?? false,
        borrowed: childrenBook.borrowed ?? '',
        loaned: childrenBook.loaned ?? '',
        readPriority: childrenBook.readPriority ?? 1,
        wantToReadAgain: childrenBook.wantToReadAgain ?? false,
        ratingComment: childrenBook.ratingComment ?? '',
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
    childrenBook: ChildrenBook;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/children-books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.childrenBook.title,
        author: data.childrenBook.author,
        rating: data.childrenBook.rating,
        readTimes: data.childrenBook.readTimes,
        firstReadDate: data.childrenBook.firstReadDate,
        lastReadDate: data.childrenBook.lastReadDate,
        owned: data.childrenBook.owned,
        readPriority: data.priority,
        wantToReadAgain: data.childrenBook.wantToReadAgain ?? false,
        ratingComment: data.childrenBook.ratingComment ?? '',
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
