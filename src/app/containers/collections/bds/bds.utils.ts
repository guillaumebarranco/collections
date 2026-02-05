import { Bd } from '../../../models/bd-model';

export type BdView = 'read' | 'readlist' | 'owned' | 'recommendations';

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
  { value: 'nbTomes', label: 'Nombre de tomes (élevé)' },
  { value: 'nbTomes-asc', label: 'Nombre de tomes (faible)' },
  { value: 'genre', label: 'Genre (A-Z)' },
  { value: 'genre-desc', label: 'Genre (Z-A)' },
  { value: 'readPriority', label: 'Priorité (élevée)' },
  { value: 'readPriority-asc', label: 'Priorité (faible)' },
];

export const bdViewOptions: { value: BdView; label: string }[] = [
  { value: 'read', label: 'BD lues' },
  { value: 'readlist', label: 'BD à lire' },
  { value: 'owned', label: 'BD possédées' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedBds = (bds: Bd[], selectedSort: string): Bd[] => {
  switch (selectedSort) {
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
    case 'nbTomes':
      return bds.sort((a, b) => (b.nbTomes || 0) - (a.nbTomes || 0));
    case 'nbTomes-asc':
      return bds.sort((a, b) => (a.nbTomes || 0) - (b.nbTomes || 0));
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
