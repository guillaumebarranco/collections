import { Manga } from '../../../models/manga-model';

export type MangaView = 'read' | 'readlist' | 'owned' | 'toReRead' | 'recommendations';

export const mangasSortOptions: { value: string; label: string }[] = [
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
  { value: 'nbTomes', label: 'Nombre de tomes (élevé)' },
  { value: 'nbTomes-asc', label: 'Nombre de tomes (faible)' },
  { value: 'genre', label: 'Genre (A-Z)' },
  { value: 'genre-desc', label: 'Genre (Z-A)' },
  { value: 'readPriority', label: 'Priorité (élevée)' },
  { value: 'readPriority-asc', label: 'Priorité (faible)' },
];

export const mangaViewOptions: { value: MangaView; label: string }[] = [
  { value: 'read', label: 'Mangas lus' },
  { value: 'readlist', label: 'Mangas à lire' },
  { value: 'owned', label: 'Mangas possédés' },
  { value: 'toReRead', label: 'À relire' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedMangas = (
  mangas: Manga[],
  selectedSort: string
): Manga[] => {
  switch (selectedSort) {
    case 'title':
      return mangas.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return mangas.sort((a, b) => b.title.localeCompare(a.title));
    case 'author':
      return mangas.sort((a, b) => a.author.localeCompare(b.author));
    case 'author-desc':
      return mangas.sort((a, b) => b.author.localeCompare(a.author));
    case 'readDate':
      return mangas.sort(
        (a, b) => new Date(b.readDate).getTime() - new Date(a.readDate).getTime()
      );
    case 'readDate-asc':
      return mangas.sort(
        (a, b) => new Date(a.readDate).getTime() - new Date(b.readDate).getTime()
      );
    case 'rating':
      return mangas.sort((a, b) => {
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
      return mangas.sort((a, b) => {
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
      return mangas.sort((a, b) => (b.readTimes || 0) - (a.readTimes || 0));
    case 'readTimes-asc':
      return mangas.sort((a, b) => (a.readTimes || 0) - (b.readTimes || 0));
    case 'nbTomes':
      return mangas.sort((a, b) => (b.nbTomes || 0) - (a.nbTomes || 0));
    case 'nbTomes-asc':
      return mangas.sort((a, b) => (a.nbTomes || 0) - (b.nbTomes || 0));
    case 'genre':
      return mangas.sort((a, b) => a.genre.localeCompare(b.genre));
    case 'genre-desc':
      return mangas.sort((a, b) => b.genre.localeCompare(a.genre));
    case 'readPriority':
      return mangas.sort((a, b) => (b.readPriority || 0) - (a.readPriority || 0));
    case 'readPriority-asc':
      return mangas.sort((a, b) => (a.readPriority || 0) - (b.readPriority || 0));
    default:
      return mangas.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
};
