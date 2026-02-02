import { Music } from '../../../models/music-model';

export const MIN_SONGS_PER_ALBUM = 8;
export const TIMES_LISTENED_FOR_POPULAR = 9;

export const musicFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Afficher tout' },
  {
    value: 'more_than_once',
    label: "Afficher les musiques écoutées plus d'une fois",
  },
  {
    value: 'popular',
    label: 'Afficher les plus écoutés (au-delà de 10 fois)',
  },
];

export const musicSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'artist', label: 'Artiste (A-Z)' },
  { value: 'artist-desc', label: 'Artiste (Z-A)' },
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'timesListened', label: 'Écoutes (élevé)' },
  { value: 'timesListened-asc', label: 'Écoutes (faible)' },
  { value: 'duration', label: 'Durée (long)' },
  { value: 'duration-asc', label: 'Durée (court)' },
];

export const musicViewOptions: { value: string; label: string }[] = [
  { value: 'albums', label: 'Grouper par album' },
  { value: 'all', label: 'Afficher toutes les musiques' },
];

export const getSortedMusics = (
  musics: Music[],
  selectedSort: string
): Music[] => {
  switch (selectedSort) {
    case 'title':
      return musics.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return musics.sort((a, b) => b.title.localeCompare(a.title));
    case 'artist':
      return musics.sort((a, b) => a.artist.localeCompare(b.artist));
    case 'artist-desc':
      return musics.sort((a, b) => b.artist.localeCompare(a.artist));
    case 'releaseDate':
      return musics.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return musics.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() -
          new Date(b.releaseDate).getTime()
      );
    case 'rating':
      return musics.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.timesListened - a.timesListened;
      });
    case 'rating-asc':
      return musics.sort((a, b) => {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        return b.timesListened - a.timesListened;
      });
    case 'timesListened':
      return musics.sort((a, b) => b.timesListened - a.timesListened);
    case 'timesListened-asc':
      return musics.sort((a, b) => a.timesListened - b.timesListened);
    case 'duration':
      return musics.sort((a, b) => b.duration - a.duration);
    case 'duration-asc':
      return musics.sort((a, b) => a.duration - b.duration);
    default:
      return musics.sort((a, b) => a.title.localeCompare(b.title));
  }
};
