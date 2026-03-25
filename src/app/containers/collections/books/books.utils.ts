import { Book } from '../../../models/book-model';

export type BookView =
  | 'read'
  | 'readlist'
  | 'owned'
  | 'borrowed'
  | 'loaned'
  | 'toReRead'
  | 'authors'
  | 'sagas'
  | 'countries'
  | 'recommendations';

export type OptionalBookView = Exclude<BookView, 'read' | 'readlist'>;

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

export const bookViewOptions: { value: BookView; label: string }[] = [
  { value: 'read', label: 'Lus' },
  { value: 'readlist', label: 'À lire' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'owned', label: 'Possédés' },
  { value: 'borrowed', label: 'Livres empruntés' },
  { value: 'loaned', label: 'Livres prêtés' },
  { value: 'authors', label: 'Voir par auteurs' },
  { value: 'sagas', label: 'Voir par sagas' },
  { value: 'countries', label: 'Voir par pays' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const countriesBooksSortOptions: { value: string; label: string }[] = [
  { value: 'country-count', label: 'Nombre de livres' },
  {
    value: 'country-user-rating',
    label: 'Pays le mieux noté par vous',
  },
  {
    value: 'country-global-rating',
    label: 'Pays le mieux noté par les utilisateurs',
  },
  {
    value: 'country-seen-count',
    label: 'Pays avec le plus de livres lus par vous',
  },
  {
    value: 'country-reread-count',
    label: 'Pays avec le plus de relectures par vous',
  },
];

export const getBooksSortOptions = (
  selectedView: BookView
): { value: string; label: string }[] => {
  if (selectedView === 'countries') {
    return countriesBooksSortOptions;
  }
  return booksSortOptions;
};

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
    case 'readDate': {
      const d = (x: Book) => x.lastReadDate || x.firstReadDate || '';
      return books.sort((a, b) => {
        const da = d(a);
        const db = d(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(db).getTime() - new Date(da).getTime();
      });
    }
    case 'readDate-asc': {
      const d = (x: Book) => x.lastReadDate || x.firstReadDate || '';
      return books.sort((a, b) => {
        const da = d(a);
        const db = d(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(da).getTime() - new Date(db).getTime();
      });
    }
    case 'releaseDate':
      return books.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      });
    case 'releaseDate-asc':
      return books.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return (
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
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
    default: {
      const d = (x: Book) => x.lastReadDate || x.firstReadDate || '';
      return books.sort((a, b) => {
        const da = d(a);
        const db = d(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(db).getTime() - new Date(da).getTime();
      });
    }
  }
};

export type BooksByAuthorGroup = {
  author: string;
  readBooks: Book[];
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
}: {
  sortedBooks: Book[];
  allBooks: Book[];
  baseBooks: Book[];
  selectedSort: string;
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

  const groups = Array.from(authorMap.entries()).map(([author, readBooks]) => {
    const missing = getSortedBooks(
      [...(baseByAuthor.get(author) ?? [])],
      selectedSort
    );
    return {
      author,
      readBooks,
      missingBooks: missing,
    };
  });

  groups.sort((a, b) => {
    const countA = a.readBooks.length + a.missingBooks.length;
    const countB = b.readBooks.length + b.missingBooks.length;
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
  readBooks: Book[];
  missingBooks: Book[];
};

export const getBooksBySaga = ({
  sortedBooks,
  allBooks,
  baseBooks,
  selectedSort,
}: {
  sortedBooks: Book[];
  allBooks: Book[];
  baseBooks: Book[];
  selectedSort: string;
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

  const allSagaNames = new Set<string>([
    ...sagaMap.keys(),
    ...baseBySaga.keys(),
  ]);

  const groups = Array.from(allSagaNames).map((saga) => {
    const readBooks = sagaMap.get(saga) ?? [];
    // Trier les livres lus par sagaOrder, puis par le tri sélectionné
    const sortedreadBooks = [...readBooks].sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Si même sagaOrder, utiliser le tri sélectionné
      const sorted = getSortedBooks([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    const missingBooks = [...(baseBySaga.get(saga) ?? [])];

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
      isSagaFinished:
        sortedreadBooks.length > 0 &&
        sortedreadBooks.every((book) => book.sagaFinished),
      readBooks: sortedreadBooks,
      missingBooks: sortedMissingBooks,
    };
  });

  groups.sort((a, b) => {
    const countA = a.readBooks.length + a.missingBooks.length;
    const countB = b.readBooks.length + b.missingBooks.length;
    if (countB !== countA) {
      return countB - countA;
    }
    return a.saga.localeCompare(b.saga);
  });

  return groups;
};

export type BooksByCountryGroup = {
  country: string;
  readBooks: Book[];
  missingBooks: Book[];
};

export const getBooksByCountry = ({
  sortedBooks,
  allBooks,
  baseBooks,
  selectedSort,
}: {
  sortedBooks: Book[];
  allBooks: Book[];
  baseBooks: Book[];
  selectedSort: string;
}): BooksByCountryGroup[] => {
  const countryMap = new Map<string, Book[]>();
  for (const book of sortedBooks) {
    const countryName = (book.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    const list = countryMap.get(countryName) ?? [];
    list.push(book);
    countryMap.set(countryName, list);
  }

  const seenKeys = new Set(allBooks.map((book) => getBookIdentityKey(book)));
  const baseByCountry = new Map<string, Book[]>();
  for (const book of baseBooks) {
    const countryName = (book.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    if (seenKeys.has(getBookIdentityKey(book))) continue;
    const list = baseByCountry.get(countryName) ?? [];
    list.push(book);
    baseByCountry.set(countryName, list);
  }

  const countryGroups = Array.from(countryMap.entries()).map(
    ([country, readBooks]) => {
      const missing = getSortedBooks(
        [...(baseByCountry.get(country) ?? [])],
        'releaseDate-asc'
      );
      return {
        country,
        readBooks: getSortedBooks(readBooks, 'readDate'),
        missingBooks: missing,
      };
    }
  );

  const filteredCountryGroups =
    selectedSort === 'country-user-rating' ||
    selectedSort === 'country-global-rating'
      ? countryGroups.filter((group) => {
          const ratedBooks = group.readBooks.filter(
            (book) => book.rating && book.rating > 0
          );
          return ratedBooks.length >= 0;
        })
      : countryGroups.filter(
          (group) => group.readBooks.length + group.missingBooks.length > 0
        );

  filteredCountryGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'country-count': {
        const countA = a.readBooks.length + a.missingBooks.length;
        const countB = b.readBooks.length + b.missingBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-user-rating':
      case 'country-global-rating': {
        const ratedBooksA = a.readBooks.filter(
          (book) => book.rating && book.rating > 0
        );
        const ratedBooksB = b.readBooks.filter(
          (book) => book.rating && book.rating > 0
        );
        const avgRatingA =
          ratedBooksA.reduce((sum, book) => sum + (book.rating || 0), 0) /
          (ratedBooksA.length || 1);
        const avgRatingB =
          ratedBooksB.reduce((sum, book) => sum + (book.rating || 0), 0) /
          (ratedBooksB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-seen-count': {
        const countA = a.readBooks.length;
        const countB = b.readBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-reread-count': {
        const rereadCountA = a.readBooks.filter(
          (book) => book.readTimes && book.readTimes > 1
        ).length;
        const rereadCountB = b.readBooks.filter(
          (book) => book.readTimes && book.readTimes > 1
        ).length;
        if (rereadCountB !== rereadCountA) {
          return rereadCountB - rereadCountA;
        }
        return a.country.localeCompare(b.country);
      }
      default: {
        const countA = a.readBooks.length + a.missingBooks.length;
        const countB = b.readBooks.length + b.missingBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
    }
  });

  return filteredCountryGroups;
};
