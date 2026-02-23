import { Manwha } from '../../../models/manwha-model';

export type ManwhaView = 'read' | 'readlist' | 'owned' | 'toReRead' | 'recommendations';

export type OptionalManwhaView = Exclude<ManwhaView, 'read' | 'readlist'>;

export const manwhasSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'author', label: 'Auteur (A-Z)' },
  { value: 'author-desc', label: 'Auteur (Z-A)' },
  { value: 'readDate', label: 'Date de lecture (récent)' },
  { value: 'readDate-asc', label: 'Date de lecture (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'readTimes', label: 'Relectures (élevé)' },
  { value: 'readTimes-asc', label: 'Relectures (faible)' },
  { value: 'nbChapters', label: 'Nombre de tomes (élevé)' },
  { value: 'nbChapters-asc', label: 'Nombre de tomes (faible)' },
  { value: 'genre', label: 'Genre (A-Z)' },
  { value: 'genre-desc', label: 'Genre (Z-A)' },
  { value: 'readPriority', label: 'Priorité (élevée)' },
  { value: 'readPriority-asc', label: 'Priorité (faible)' },
];

export const manwhaViewOptions: { value: ManwhaView; label: string }[] = [
  { value: 'read', label: 'Manwhas lus' },
  { value: 'readlist', label: 'Manwhas à lire' },
  { value: 'owned', label: 'Manwhas possédés' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedManwhas = (
  manwhas: Manwha[],
  selectedSort: string
): Manwha[] => {
  switch (selectedSort) {
    case 'title':
      return manwhas.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return manwhas.sort((a, b) => b.title.localeCompare(a.title));
    case 'author':
      return manwhas.sort((a, b) => a.author.localeCompare(b.author));
    case 'author-desc':
      return manwhas.sort((a, b) => b.author.localeCompare(a.author));
    case 'readDate':
      return manwhas.sort(
        (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
      );
    case 'readDate-asc':
      return manwhas.sort(
        (a, b) => new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
      );
    case 'rating':
      return manwhas.sort((a, b) => {
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
      return manwhas.sort((a, b) => {
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
      return manwhas.sort(
        (a, b) => (b.readTimes || 0) - (a.readTimes || 0)
      );
    case 'readTimes-asc':
      return manwhas.sort(
        (a, b) => (a.readTimes || 0) - (b.readTimes || 0)
      );
    case 'nbChapters':
      return manwhas.sort(
        (a, b) => (b.nbChapters || 0) - (a.nbChapters || 0)
      );
    case 'nbChapters-asc':
      return manwhas.sort(
        (a, b) => (a.nbChapters || 0) - (b.nbChapters || 0)
      );
    case 'genre':
      return manwhas.sort((a, b) => a.genre.localeCompare(b.genre));
    case 'genre-desc':
      return manwhas.sort((a, b) => b.genre.localeCompare(a.genre));
    case 'readPriority':
      return manwhas.sort((a, b) => (b.readPriority || 0) - (a.readPriority || 0));
    case 'readPriority-asc':
      return manwhas.sort((a, b) => (a.readPriority || 0) - (b.readPriority || 0));
    default:
      return manwhas.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};
