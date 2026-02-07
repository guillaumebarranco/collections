import { Book } from '../../../models/book-model';

export type BookView =
  | 'read'
  | 'readlist'
  | 'owned'
  | 'authors'
  | 'sagas'
  | 'recommendations';

export const booksSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'author', label: 'Auteur (A-Z)' },
  { value: 'author-desc', label: 'Auteur (Z-A)' },
  { value: 'readDate', label: 'Date de lecture (récent)' },
  { value: 'readDate-asc', label: 'Date de lecture (ancien)' },
  { value: 'releaseDate', label: 'Date de parution (récent)' },
  { value: 'releaseDate-asc', label: 'Date de parution (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'readTimes', label: 'Relectures (élevé)' },
  { value: 'readTimes-asc', label: 'Relectures (faible)' },
  { value: 'pages', label: 'Pages (élevé)' },
  { value: 'pages-asc', label: 'Pages (faible)' },
  { value: 'genre', label: 'Genre (A-Z)' },
  { value: 'genre-desc', label: 'Genre (Z-A)' },
];

export const yearFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: 'before2024', label: 'Avant 2024' },
];

export const groupByOptions: { value: string; label: string }[] = [
  { value: 'none', label: 'Aucun' },
  { value: 'author', label: 'Auteur' },
  { value: 'genre', label: 'Genre' },
];

export const bookViewOptions: { value: BookView; label: string }[] = [
  { value: 'read', label: 'Livres lus' },
  { value: 'readlist', label: 'Livres à lire' },
  { value: 'owned', label: 'Livres possédés' },
  { value: 'authors', label: 'Voir les auteurs' },
  { value: 'sagas', label: 'Voir les sagas' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedBooks = (books: Book[], selectedSort: string): Book[] => {
  switch (selectedSort) {
    case 'title':
      return books.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return books.sort((a, b) => b.title.localeCompare(a.title));
    case 'author':
      return books.sort((a, b) => a.author.localeCompare(b.author));
    case 'author-desc':
      return books.sort((a, b) => b.author.localeCompare(a.author));
    case 'readDate':
      return books.sort((a, b) => {
        if (!a.readDate && !b.readDate) return 0;
        if (!a.readDate) return 1;
        if (!b.readDate) return -1;
        return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      });
    case 'readDate-asc':
      return books.sort((a, b) => {
        if (!a.readDate && !b.readDate) return 0;
        if (!a.readDate) return 1;
        if (!b.readDate) return -1;
        return new Date(a.readDate).getTime() - new Date(b.readDate).getTime();
      });
    case 'releaseDate':
      return books.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      });
    case 'releaseDate-asc':
      return books.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
      });
    case 'rating':
      return books.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        const readTimesA = a.readTimes || 0;
        const readTimesB = b.readTimes || 0;
        return readTimesB - readTimesA;
      });
    case 'rating-asc':
      return books.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) {
          return ratingA - ratingB;
        }
        const readTimesA = a.readTimes || 0;
        const readTimesB = b.readTimes || 0;
        return readTimesB - readTimesA;
      });
    case 'readTimes':
      return books.sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0));
    case 'readTimes-asc':
      return books.sort((a, b) => (a.readTimes || 0) - (b.readTimes || 0));
    case 'pages':
      return books.sort((a, b) => (b.pages || 0) - (a.pages || 0));
    case 'pages-asc':
      return books.sort((a, b) => (a.pages || 0) - (b.pages || 0));
    case 'genre':
      return books.sort((a, b) => a.genre.localeCompare(b.genre));
    case 'genre-desc':
      return books.sort((a, b) => b.genre.localeCompare(a.genre));
    case 'readPriority':
      return books.sort((a, b) => {
        const priorityA = a.readPriority ?? 0;
        const priorityB = b.readPriority ?? 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
    default:
      return books.sort((a, b) => {
        if (!a.readDate && !b.readDate) return 0;
        if (!a.readDate) return 1;
        if (!b.readDate) return -1;
        return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      });
  }
};

export type BooksByAuthorGroup = {
  author: string;
  seenBooks: Book[];
  missingBooks: Book[];
};

const getBookIdentityKey = (book: Book): string => {
  return `${book.title}|${book.author}`;
};

export const getBooksByAuthor = ({
  sortedBooks,
  allBooks,
  baseBooks,
  selectedSort,
  isAdminView,
}: {
  sortedBooks: Book[];
  allBooks: Book[];
  baseBooks: Book[];
  selectedSort: string;
  isAdminView: boolean;
}): BooksByAuthorGroup[] => {
  const authorMap = new Map<string, Book[]>();
  for (const book of sortedBooks) {
    const authorName = book.author?.trim();
    if (!authorName) continue;
    const list = authorMap.get(authorName) ?? [];
    list.push(book);
    authorMap.set(authorName, list);
  }

  const seenKeys = new Set(allBooks.map((book) => getBookIdentityKey(book)));
  const baseByAuthor = new Map<string, Book[]>();
  for (const book of baseBooks) {
    if (seenKeys.has(getBookIdentityKey(book))) continue;
    const authorName = book.author?.trim();
    if (!authorName) continue;
    const list = baseByAuthor.get(authorName) ?? [];
    list.push(book);
    baseByAuthor.set(authorName, list);
  }

  const groups = Array.from(authorMap.entries()).map(([author, seenBooks]) => {
    const missing = isAdminView
      ? []
      : getSortedBooks([...(baseByAuthor.get(author) ?? [])], selectedSort);
    return {
      author,
      seenBooks,
      missingBooks: missing,
    };
  });

  groups.sort((a, b) => {
    const countA = a.seenBooks.length + a.missingBooks.length;
    const countB = b.seenBooks.length + b.missingBooks.length;
    if (countB !== countA) {
      return countB - countA;
    }
    return a.author.localeCompare(b.author);
  });

  return groups;
};

export type BooksBySagaGroup = {
  saga: string;
  isSagaFinished: boolean;
  seenBooks: Book[];
  missingBooks: Book[];
};

export const getBooksBySaga = ({
  sortedBooks,
  allBooks,
  baseBooks,
  selectedSort,
  isAdminView,
}: {
  sortedBooks: Book[];
  allBooks: Book[];
  baseBooks: Book[];
  selectedSort: string;
  isAdminView: boolean;
}): BooksBySagaGroup[] => {
  const sagaMap = new Map<string, Book[]>();
  for (const book of sortedBooks) {
    const sagaName = book.saga?.trim();
    if (!sagaName) continue;
    const list = sagaMap.get(sagaName) ?? [];
    list.push(book);
    sagaMap.set(sagaName, list);
  }

  const seenKeys = new Set(allBooks.map((book) => getBookIdentityKey(book)));
  const baseBySaga = new Map<string, Book[]>();
  for (const book of baseBooks) {
    if (seenKeys.has(getBookIdentityKey(book))) continue;
    const sagaName = book.saga?.trim();
    if (!sagaName) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(book);
    baseBySaga.set(sagaName, list);
  }

  const groups = Array.from(sagaMap.entries()).map(([saga, seenBooks]) => {
    // Trier les livres lus par sagaOrder, puis par le tri sélectionné
    const sortedSeenBooks = [...seenBooks].sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Si même sagaOrder, utiliser le tri sélectionné
      const sorted = getSortedBooks([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    const missingBooks = isAdminView ? [] : [...(baseBySaga.get(saga) ?? [])];

    // Trier les livres manquants par sagaOrder, puis par le tri sélectionné
    const sortedMissingBooks = missingBooks.sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Si même sagaOrder, utiliser le tri sélectionné
      const sorted = getSortedBooks([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    return {
      saga,
      isSagaFinished: sortedSeenBooks.every((book) => book.sagaFinished),
      seenBooks: sortedSeenBooks,
      missingBooks: sortedMissingBooks,
    };
  });

  groups.sort((a, b) => {
    const countA = a.seenBooks.length + a.missingBooks.length;
    const countB = b.seenBooks.length + b.missingBooks.length;
    if (countB !== countA) {
      return countB - countA;
    }
    return a.saga.localeCompare(b.saga);
  });

  return groups;
};
