import { Comic } from '../../../models/comic-model';

export type ComicView = 'read' | 'readlist' | 'owned' | 'toReRead' | 'recommendations';

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
  { value: 'nbTomes', label: 'Nombre de tomes (élevé)' },
  { value: 'nbTomes-asc', label: 'Nombre de tomes (faible)' },
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
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedComics = (
  comics: Comic[],
  selectedSort: string
): Comic[] => {
  switch (selectedSort) {
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
