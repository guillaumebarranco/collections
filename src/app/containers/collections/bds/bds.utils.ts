import { Bd } from '../../../models/bd-model';

export type BdView =
  | 'read'
  | 'readlist'
  | 'owned'
  | 'borrowed'
  | 'loaned'
  | 'toReRead'
  | 'sagas'
  | 'recommendations';

export type OptionalBdView = Exclude<BdView, 'read' | 'readlist'>;

export const bdsSortOptions: { value: string; label: string }[] = [
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

export const bdViewOptions: { value: BdView; label: string }[] = [
  { value: 'read', label: 'BD lues' },
  { value: 'readlist', label: 'BD à lire' },
  { value: 'owned', label: 'BD possédées' },
  { value: 'borrowed', label: 'BD empruntées' },
  { value: 'loaned', label: 'BD prêtées' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'sagas', label: 'Voir par saga' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedBds = (bds: Bd[], selectedSort: string): Bd[] => {
  const sortKey =
    selectedSort === 'nbTomes'
      ? 'sagaOrder'
      : selectedSort === 'nbTomes-asc'
        ? 'sagaOrder-asc'
        : selectedSort;
  switch (sortKey) {
    case 'title':
      return bds.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return bds.sort((a, b) => b.title.localeCompare(a.title));
    case 'designer':
      return bds.sort((a, b) => a.designer.localeCompare(b.designer));
    case 'designer-desc':
      return bds.sort((a, b) => b.designer.localeCompare(a.designer));
    case 'readDate':
      return bds.sort(
        (a, b) =>
          new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
      );
    case 'readDate-asc':
      return bds.sort(
        (a, b) =>
          new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
      );
    case 'rating':
      return bds.sort((a, b) => {
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
      return bds.sort((a, b) => {
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
      return bds.sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0));
    case 'readTimes-asc':
      return bds.sort((a, b) => (a.readTimes || 0) - (b.readTimes || 0));
    case 'saga':
      return bds.sort((a, b) =>
        (a.saga || '').localeCompare(b.saga || '', undefined, {
          sensitivity: 'base',
        })
      );
    case 'saga-desc':
      return bds.sort((a, b) =>
        (b.saga || '').localeCompare(a.saga || '', undefined, {
          sensitivity: 'base',
        })
      );
    case 'sagaOrder':
      return bds.sort((a, b) => {
        const diff = (b.sagaOrder || 0) - (a.sagaOrder || 0);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
      });
    case 'sagaOrder-asc':
      return bds.sort((a, b) => {
        const diff = (a.sagaOrder || 0) - (b.sagaOrder || 0);
        if (diff !== 0) return diff;
        return a.title.localeCompare(b.title);
      });
    case 'genre':
      return bds.sort((a, b) => a.genre.localeCompare(b.genre));
    case 'genre-desc':
      return bds.sort((a, b) => b.genre.localeCompare(a.genre));
    case 'readPriority':
      return bds.sort((a, b) => (b.readPriority || 0) - (a.readPriority || 0));
    case 'readPriority-asc':
      return bds.sort((a, b) => (a.readPriority || 0) - (b.readPriority || 0));
    default:
      return bds.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};

const getBdIdentityKey = (bd: Pick<Bd, 'title' | 'writer'>): string =>
  `${bd.title}__${bd.writer}`;

export type BdsBySagaGroup = {
  saga: string;
  readBds: Bd[];
  missingBds: Bd[];
};

export const getBdsBySaga = ({
  sortedBds,
  allBds,
  baseBds,
  selectedSort,
}: {
  sortedBds: Bd[];
  allBds: Bd[];
  baseBds: Bd[];
  selectedSort: string;
}): BdsBySagaGroup[] => {
  const sagaMap = new Map<string, Bd[]>();
  for (const bd of sortedBds) {
    const sagaName = bd.saga?.trim();
    if (!sagaName) continue;
    const list = sagaMap.get(sagaName) ?? [];
    list.push(bd);
    sagaMap.set(sagaName, list);
  }

  const seenKeys = new Set(allBds.map((bd) => getBdIdentityKey(bd)));
  const baseBySaga = new Map<string, Bd[]>();
  for (const bd of baseBds) {
    const sagaName = bd.saga?.trim();
    if (!sagaName) continue;
    if (seenKeys.has(getBdIdentityKey(bd))) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(bd);
    baseBySaga.set(sagaName, list);
  }

  const allSagaNames = new Set<string>([
    ...sagaMap.keys(),
    ...baseBySaga.keys(),
  ]);

  const groups = Array.from(allSagaNames).map((saga) => {
    const readBds = sagaMap.get(saga) ?? [];
    // Trier par sagaOrder, puis fallback sur le tri sélectionné
    const sortedRead = [...readBds].sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const sorted = getSortedBds([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    const missing = [...(baseBySaga.get(saga) ?? [])];
    const sortedMissing = missing.sort((a, b) => {
      const orderA = a.sagaOrder ?? 0;
      const orderB = b.sagaOrder ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      const sorted = getSortedBds([a, b], selectedSort);
      return sorted[0] === a ? -1 : 1;
    });

    return { saga, readBds: sortedRead, missingBds: sortedMissing };
  });

  groups.sort((a, b) => {
    const countA = a.readBds.length + a.missingBds.length;
    const countB = b.readBds.length + b.missingBds.length;
    if (countB !== countA) return countB - countA;
    return a.saga.localeCompare(b.saga);
  });

  return groups;
};
