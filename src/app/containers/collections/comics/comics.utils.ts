import { Comic } from '../../../models/comic-model';

export type ComicView =
  | 'read'
  | 'readlist'
  | 'owned'
  | 'toReRead'
  | 'sagas'
  | 'recommendations';

export type OptionalComicView = Exclude<ComicView, 'read' | 'readlist'>;

export const comicsSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'designer', label: 'Designer (A-Z)' },
  { value: 'designer-desc', label: 'Designer (Z-A)' },
  { value: 'readDate', label: 'Date de lecture (récent)' },
  { value: 'readDate-asc', label: 'Date de lecture (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'readTimes', label: 'Relectures (élevé)' },
  { value: 'readTimes-asc', label: 'Relectures (faible)' },
  { value: 'saga', label: 'Saga (A-Z)' },
  { value: 'saga-desc', label: 'Saga (Z-A)' },
  { value: 'sagaOrder', label: 'Ordre dans la saga (élevé)' },
  { value: 'sagaOrder-asc', label: 'Ordre dans la saga (faible)' },
  { value: 'genre', label: 'Genre (A-Z)' },
  { value: 'genre-desc', label: 'Genre (Z-A)' },
  { value: 'readPriority', label: 'Priorité (élevée)' },
  { value: 'readPriority-asc', label: 'Priorité (faible)' },
];

export const comicViewOptions: { value: ComicView; label: string }[] = [
  { value: 'read', label: 'Comics lus' },
  { value: 'readlist', label: 'Comics à lire' },
  { value: 'owned', label: 'Comics possédés' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'sagas', label: 'Voir par saga' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedComics = (
  comics: Comic[],
  selectedSort: string
): Comic[] => {
  const sortKey =
    selectedSort === 'nbTomes'
      ? 'sagaOrder'
      : selectedSort === 'nbTomes-asc'
        ? 'sagaOrder-asc'
        : selectedSort;
  switch (sortKey) {
    case 'title':
      return comics.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return comics.sort((a, b) => b.title.localeCompare(a.title));
    case 'designer':
      return comics.sort((a, b) => a.designer.localeCompare(b.designer));
    case 'designer-desc':
      return comics.sort((a, b) => b.designer.localeCompare(a.designer));
    case 'readDate':
      return comics.sort(
        (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
      );
    case 'readDate-asc':
      return comics.sort(
        (a, b) => new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
      );
    case 'rating':
      return comics.sort((a, b) => {
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
      return comics.sort((a, b) => {
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
      return comics.sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0));
    case 'readTimes-asc':
      return comics.sort((a, b) => (a.readTimes || 0) - (b.readTimes || 0));
    case 'saga':
      return comics.sort((a, b) =>
        (a.saga || '').localeCompare(b.saga || '', undefined, {
          sensitivity: 'base',
        })
      );
    case 'saga-desc':
      return comics.sort((a, b) =>
        (b.saga || '').localeCompare(a.saga || '', undefined, {
          sensitivity: 'base',
        })
      );
    case 'sagaOrder':
      return comics.sort((a, b) => {
        const diff = (b.sagaOrder || 0) - (a.sagaOrder || 0);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
      });
    case 'sagaOrder-asc':
      return comics.sort((a, b) => {
        const diff = (a.sagaOrder || 0) - (b.sagaOrder || 0);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
      });
    case 'genre':
      return comics.sort((a, b) => a.genre.localeCompare(b.genre));
    case 'genre-desc':
      return comics.sort((a, b) => b.genre.localeCompare(a.genre));
    case 'readPriority':
      return comics.sort((a, b) => (b.readPriority || 0) - (a.readPriority || 0));
    case 'readPriority-asc':
      return comics.sort((a, b) => (a.readPriority || 0) - (b.readPriority || 0));
    default:
      return comics.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};

const getComicIdentityKey = (comic: Pick<Comic, 'title' | 'writer'>): string =>
  `${comic.title}__${comic.writer}`;

export type ComicsBySagaGroup = {
  saga: string;
  readComics: Comic[];
  missingComics: Comic[];
};

export const getComicsBySaga = ({
  sortedComics,
  allComics,
  baseComics,
  selectedSort,
}: {
  sortedComics: Comic[];
  allComics: Comic[];
  baseComics: Comic[];
  selectedSort: string;
}): ComicsBySagaGroup[] => {
  const sagaMap = new Map<string, Comic[]>();
  for (const comic of sortedComics) {
    const sagaName = comic.saga?.trim();
    if (!sagaName) continue;
    const list = sagaMap.get(sagaName) ?? [];
    list.push(comic);
    sagaMap.set(sagaName, list);
  }

  const seenKeys = new Set(allComics.map((c) => getComicIdentityKey(c)));
  const baseBySaga = new Map<string, Comic[]>();
  for (const comic of baseComics) {
    const sagaName = comic.saga?.trim();
    if (!sagaName) continue;
    if (seenKeys.has(getComicIdentityKey(comic))) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(comic);
    baseBySaga.set(sagaName, list);
  }

  const groups = Array.from(sagaMap.entries()).map(([saga, readComics]) => {
    const sortedRead = [...readComics].sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const sorted = getSortedComics([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    const missing = [...(baseBySaga.get(saga) ?? [])];
    const sortedMissing = missing.sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const sorted = getSortedComics([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    return { saga, readComics: sortedRead, missingComics: sortedMissing };
  });

  groups.sort((a, b) => {
    const countA = a.readComics.length + a.missingComics.length;
    const countB = b.readComics.length + b.missingComics.length;
    if (countB !== countA) return countB - countA;
    return a.saga.localeCompare(b.saga);
  });

  return groups;
};
