import { ChildrenBook } from '../../../models/children-book-model';

function childrenBookGenreSortKey(genre: string[]): string {
  return genre.join(', ');
}

export type ChildrenBookView =
  | 'read'
  | 'readlist'
  | 'readingInProgress'
  | 'owned'
  | 'borrowed'
  | 'loaned'
  | 'toReRead'
  | 'authors'
  | 'sagas'
  | 'countries'
  | 'recommendations';

export type OptionalChildrenBookView = Exclude<
  ChildrenBookView,
  'read' | 'readlist' | 'readingInProgress'
>;

export const childrenBooksSortOptions: { value: string; label: string }[] = [
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

/** Tris pour « À lire » et « En cours » : pas de dates/notes/relectures (livre pas encore lu comme tel). */
export const childrenBooksReadlistSortOptions: { value: string; label: string }[] = [
  { value: 'readPriority', label: 'Priorité de lecture' },
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'author', label: 'Auteur (A-Z)' },
  { value: 'author-desc', label: 'Auteur (Z-A)' },
  { value: 'releaseDate', label: 'Date de parution (récent)' },
  { value: 'releaseDate-asc', label: 'Date de parution (ancien)' },
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

export const childrenBookViewOptions: { value: ChildrenBookView; label: string }[] = [
  { value: 'read', label: 'Lus' },
  { value: 'readlist', label: 'À lire' },
  { value: 'readingInProgress', label: 'En cours' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'owned', label: 'Possédés' },
  { value: 'borrowed', label: 'Livres pour enfants empruntés' },
  { value: 'loaned', label: 'Livres pour enfants prêtés' },
  { value: 'authors', label: 'Voir par auteurs' },
  { value: 'sagas', label: 'Voir par sagas' },
  { value: 'countries', label: 'Voir par pays' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const countriesChildrenBooksSortOptions: { value: string; label: string }[] = [
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

export const getChildrenBooksSortOptions = (
  selectedView: ChildrenBookView
): { value: string; label: string }[] => {
  if (selectedView === 'countries') {
    return countriesChildrenBooksSortOptions;
  }
  if (selectedView === 'readlist' || selectedView === 'readingInProgress') {
    return childrenBooksReadlistSortOptions;
  }
  return childrenBooksSortOptions;
};

/** Tri par défaut selon la vue (URL / état initial). */
export const getDefaultChildrenBooksSortForView = (view: ChildrenBookView): string =>
  view === 'readlist' || view === 'readingInProgress'
    ? 'readPriority'
    : 'readDate';

export const getSortedChildrenBooks = (childrenBooks: ChildrenBook[], selectedSort: string): ChildrenBook[] => {
  switch (selectedSort) {
    case 'title':
      return childrenBooks.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return childrenBooks.sort((a, b) => b.title.localeCompare(a.title));
    case 'author':
      return childrenBooks.sort((a, b) => a.author.localeCompare(b.author));
    case 'author-desc':
      return childrenBooks.sort((a, b) => b.author.localeCompare(a.author));
    case 'readDate': {
      const d = (x: ChildrenBook) => x.lastReadDate || x.firstReadDate || '';
      return childrenBooks.sort((a, b) => {
        const da = d(a);
        const db = d(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(db).getTime() - new Date(da).getTime();
      });
    }
    case 'readDate-asc': {
      const d = (x: ChildrenBook) => x.lastReadDate || x.firstReadDate || '';
      return childrenBooks.sort((a, b) => {
        const da = d(a);
        const db = d(b);
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(da).getTime() - new Date(db).getTime();
      });
    }
    case 'releaseDate':
      return childrenBooks.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      });
    case 'releaseDate-asc':
      return childrenBooks.sort((a, b) => {
        if (!a.releaseDate && !b.releaseDate) return 0;
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        return (
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
      });
    case 'rating':
      return childrenBooks.sort((a, b) => {
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
      return childrenBooks.sort((a, b) => {
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
      return childrenBooks.sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0));
    case 'readTimes-asc':
      return childrenBooks.sort((a, b) => (a.readTimes || 0) - (b.readTimes || 0));
    case 'pages':
      return childrenBooks.sort((a, b) => (b.pages || 0) - (a.pages || 0));
    case 'pages-asc':
      return childrenBooks.sort((a, b) => (a.pages || 0) - (b.pages || 0));
    case 'genre':
      return childrenBooks.sort((a, b) =>
        childrenBookGenreSortKey(a.genre).localeCompare(childrenBookGenreSortKey(b.genre))
      );
    case 'genre-desc':
      return childrenBooks.sort((a, b) =>
        childrenBookGenreSortKey(b.genre).localeCompare(childrenBookGenreSortKey(a.genre))
      );
    case 'readPriority':
      return childrenBooks.sort((a, b) => {
        const priorityA = a.readPriority ?? 0;
        const priorityB = b.readPriority ?? 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
    default: {
      const d = (x: ChildrenBook) => x.lastReadDate || x.firstReadDate || '';
      return childrenBooks.sort((a, b) => {
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

export type ChildrenBooksByAuthorGroup = {
  author: string;
  readChildrenBooks: ChildrenBook[];
  missingChildrenBooks: ChildrenBook[];
};

const getChildrenBookIdentityKey = (childrenBook: ChildrenBook): string => {
  return `${childrenBook.title}|${childrenBook.author}`;
};

export const getChildrenBooksByAuthor = ({
  sortedChildrenBooks,
  allChildrenBooks,
  baseChildrenBooks,
  selectedSort,
}: {
  sortedChildrenBooks: ChildrenBook[];
  allChildrenBooks: ChildrenBook[];
  baseChildrenBooks: ChildrenBook[];
  selectedSort: string;
}): ChildrenBooksByAuthorGroup[] => {
  const authorMap = new Map<string, ChildrenBook[]>();
  for (const childrenBook of sortedChildrenBooks) {
    const authorName = childrenBook.author?.trim();
    if (!authorName) continue;
    const list = authorMap.get(authorName) ?? [];
    list.push(childrenBook);
    authorMap.set(authorName, list);
  }

  const seenKeys = new Set(allChildrenBooks.map((childrenBook) => getChildrenBookIdentityKey(childrenBook)));
  const baseByAuthor = new Map<string, ChildrenBook[]>();
  for (const childrenBook of baseChildrenBooks) {
    if (seenKeys.has(getChildrenBookIdentityKey(childrenBook))) continue;
    const authorName = childrenBook.author?.trim();
    if (!authorName) continue;
    const list = baseByAuthor.get(authorName) ?? [];
    list.push(childrenBook);
    baseByAuthor.set(authorName, list);
  }

  const groups = Array.from(authorMap.entries()).map(([author, readChildrenBooks]) => {
    const missing = getSortedChildrenBooks(
      [...(baseByAuthor.get(author) ?? [])],
      selectedSort
    );
    return {
      author,
      readChildrenBooks,
      missingChildrenBooks: missing,
    };
  });

  groups.sort((a, b) => {
    const countA = a.readChildrenBooks.length + a.missingChildrenBooks.length;
    const countB = b.readChildrenBooks.length + b.missingChildrenBooks.length;
    if (countB !== countA) {
      return countB - countA;
    }
    return a.author.localeCompare(b.author);
  });

  return groups;
};

export type ChildrenBooksBySagaGroup = {
  saga: string;
  isSagaFinished: boolean;
  readChildrenBooks: ChildrenBook[];
  missingChildrenBooks: ChildrenBook[];
};

export const getChildrenBooksBySaga = ({
  sortedChildrenBooks,
  allChildrenBooks,
  baseChildrenBooks,
  selectedSort,
}: {
  sortedChildrenBooks: ChildrenBook[];
  allChildrenBooks: ChildrenBook[];
  baseChildrenBooks: ChildrenBook[];
  selectedSort: string;
}): ChildrenBooksBySagaGroup[] => {
  const sagaMap = new Map<string, ChildrenBook[]>();
  for (const childrenBook of sortedChildrenBooks) {
    const sagaName = childrenBook.saga?.trim();
    if (!sagaName) continue;
    const list = sagaMap.get(sagaName) ?? [];
    list.push(childrenBook);
    sagaMap.set(sagaName, list);
  }

  const seenKeys = new Set(allChildrenBooks.map((childrenBook) => getChildrenBookIdentityKey(childrenBook)));
  const baseBySaga = new Map<string, ChildrenBook[]>();
  for (const childrenBook of baseChildrenBooks) {
    if (seenKeys.has(getChildrenBookIdentityKey(childrenBook))) continue;
    const sagaName = childrenBook.saga?.trim();
    if (!sagaName) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(childrenBook);
    baseBySaga.set(sagaName, list);
  }

  const allSagaNames = new Set<string>([
    ...sagaMap.keys(),
    ...baseBySaga.keys(),
  ]);

  const groups = Array.from(allSagaNames).map((saga) => {
    const readChildrenBooks = sagaMap.get(saga) ?? [];
    // Trier les livres lus par sagaOrder, puis par le tri sélectionné
    const sortedreadChildrenBooks = [...readChildrenBooks].sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Si même sagaOrder, utiliser le tri sélectionné
      const sorted = getSortedChildrenBooks([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    const missingChildrenBooks = [...(baseBySaga.get(saga) ?? [])];

    // Trier les livres manquants par sagaOrder, puis par le tri sélectionné
    const sortedMissingChildrenBooks = missingChildrenBooks.sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      // Si même sagaOrder, utiliser le tri sélectionné
      const sorted = getSortedChildrenBooks([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    return {
      saga,
      isSagaFinished:
        sortedreadChildrenBooks.length > 0 &&
        sortedreadChildrenBooks.every((childrenBook) => childrenBook.sagaFinished),
      readChildrenBooks: sortedreadChildrenBooks,
      missingChildrenBooks: sortedMissingChildrenBooks,
    };
  });

  groups.sort((a, b) => {
    const countA = a.readChildrenBooks.length + a.missingChildrenBooks.length;
    const countB = b.readChildrenBooks.length + b.missingChildrenBooks.length;
    if (countB !== countA) {
      return countB - countA;
    }
    return a.saga.localeCompare(b.saga);
  });

  return groups;
};

export type ChildrenBooksByCountryGroup = {
  country: string;
  readChildrenBooks: ChildrenBook[];
  missingChildrenBooks: ChildrenBook[];
};

export const getChildrenBooksByCountry = ({
  sortedChildrenBooks,
  allChildrenBooks,
  baseChildrenBooks,
  selectedSort,
}: {
  sortedChildrenBooks: ChildrenBook[];
  allChildrenBooks: ChildrenBook[];
  baseChildrenBooks: ChildrenBook[];
  selectedSort: string;
}): ChildrenBooksByCountryGroup[] => {
  const countryMap = new Map<string, ChildrenBook[]>();
  for (const childrenBook of sortedChildrenBooks) {
    const countryName = (childrenBook.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    const list = countryMap.get(countryName) ?? [];
    list.push(childrenBook);
    countryMap.set(countryName, list);
  }

  const seenKeys = new Set(allChildrenBooks.map((childrenBook) => getChildrenBookIdentityKey(childrenBook)));
  const baseByCountry = new Map<string, ChildrenBook[]>();
  for (const childrenBook of baseChildrenBooks) {
    const countryName = (childrenBook.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    if (seenKeys.has(getChildrenBookIdentityKey(childrenBook))) continue;
    const list = baseByCountry.get(countryName) ?? [];
    list.push(childrenBook);
    baseByCountry.set(countryName, list);
  }

  const countryGroups = Array.from(countryMap.entries()).map(
    ([country, readChildrenBooks]) => {
      const missing = getSortedChildrenBooks(
        [...(baseByCountry.get(country) ?? [])],
        'releaseDate-asc'
      );
      return {
        country,
        readChildrenBooks: getSortedChildrenBooks(readChildrenBooks, 'readDate'),
        missingChildrenBooks: missing,
      };
    }
  );

  const filteredCountryGroups =
    selectedSort === 'country-user-rating' ||
    selectedSort === 'country-global-rating'
      ? countryGroups.filter((group) => {
          const ratedChildrenBooks = group.readChildrenBooks.filter(
            (childrenBook) => childrenBook.rating && childrenBook.rating > 0
          );
          return ratedChildrenBooks.length >= 0;
        })
      : countryGroups.filter(
          (group) => group.readChildrenBooks.length + group.missingChildrenBooks.length > 0
        );

  filteredCountryGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'country-count': {
        const countA = a.readChildrenBooks.length + a.missingChildrenBooks.length;
        const countB = b.readChildrenBooks.length + b.missingChildrenBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-user-rating':
      case 'country-global-rating': {
        const ratedChildrenBooksA = a.readChildrenBooks.filter(
          (childrenBook) => childrenBook.rating && childrenBook.rating > 0
        );
        const ratedChildrenBooksB = b.readChildrenBooks.filter(
          (childrenBook) => childrenBook.rating && childrenBook.rating > 0
        );
        const avgRatingA =
          ratedChildrenBooksA.reduce((sum, childrenBook) => sum + (childrenBook.rating || 0), 0) /
          (ratedChildrenBooksA.length || 1);
        const avgRatingB =
          ratedChildrenBooksB.reduce((sum, childrenBook) => sum + (childrenBook.rating || 0), 0) /
          (ratedChildrenBooksB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-seen-count': {
        const countA = a.readChildrenBooks.length;
        const countB = b.readChildrenBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
      case 'country-reread-count': {
        const rereadCountA = a.readChildrenBooks.filter(
          (childrenBook) => childrenBook.readTimes && childrenBook.readTimes > 1
        ).length;
        const rereadCountB = b.readChildrenBooks.filter(
          (childrenBook) => childrenBook.readTimes && childrenBook.readTimes > 1
        ).length;
        if (rereadCountB !== rereadCountA) {
          return rereadCountB - rereadCountA;
        }
        return a.country.localeCompare(b.country);
      }
      default: {
        const countA = a.readChildrenBooks.length + a.missingChildrenBooks.length;
        const countB = b.readChildrenBooks.length + b.missingChildrenBooks.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.country.localeCompare(b.country);
      }
    }
  });

  return filteredCountryGroups;
};
