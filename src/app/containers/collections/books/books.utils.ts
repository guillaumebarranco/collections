import { Book } from '../../../models/book-model';

export type BookView = 'read' | 'readlist' | 'owned';

export const booksSortOptions: { value: string; label: string }[] = [
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
];

export const getSortedBooks = (
  books: Book[],
  selectedSort: string
): Book[] => {
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
    default:
      return books.sort((a, b) => {
        if (!a.readDate && !b.readDate) return 0;
        if (!a.readDate) return 1;
        if (!b.readDate) return -1;
        return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
      });
  }
};
