import { Music } from '../../../models/music-model';

export const TIMES_LISTENED_FOR_POPULAR = 9;
/** Au-delà de ce nombre de morceaux, le filtre « plus de 10 écoutes » peut être le défaut. */
export const POPULAR_FILTER_MIN_MUSICS = 1000;
/** Nombre minimum de morceaux dont le nombre d'écoutes est renseigné pour ce défaut. */
export const POPULAR_FILTER_MIN_WITH_LISTENS = 100;

/** Filtre d'ouverture : « plus de 10 écoutes » seulement si la collection est grande et assez renseignée. */
export function defaultMusicFilter(musics: Music[]): 'popular' | 'all' {
  const withListens = musics.filter((music) => music.timesListened > 0).length;
  if (
    musics.length > POPULAR_FILTER_MIN_MUSICS &&
    withListens >= POPULAR_FILTER_MIN_WITH_LISTENS
  ) {
    return 'popular';
  }
  return 'all';
}

/**
 * Un album est regroupé si l'utilisateur en possède plus de la moitié des morceaux
 * du catalogue. Un album entier (y compris 5 ou 6 titres) est donc toujours affiché.
 * À 50 % ou moins, les morceaux restent dans la liste des musiques.
 */
export function ownsAlbumMajority(
  ownedCount: number,
  catalogCount: number
): boolean {
  return catalogCount > 0 && ownedCount / catalogCount > 0.5;
}

/** Ordre des morceaux dans une modale d'album : piste si elle est renseignée, sinon titre. */
export function sortAlbumTracks<T extends { title: string; albumTrackId?: number }>(
  musics: T[]
): T[] {
  const hasTrackOrder = musics.some((music) => (music.albumTrackId ?? 0) > 0);
  return [...musics].sort((a, b) => {
    if (!hasTrackOrder) {
      return a.title.localeCompare(b.title);
    }
    const aId = a.albumTrackId ?? 0;
    const bId = b.albumTrackId ?? 0;
    if (aId !== bId) {
      if (aId === 0) return 1;
      if (bId === 0) return -1;
      return aId - bId;
    }
    return a.title.localeCompare(b.title);
  });
}

export const musicFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Tout' },
  {
    value: 'more_than_once',
    label: "Plus d'une écoute",
  },
  {
    value: 'popular',
    label: 'Plus de 10 écoutes',
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
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return musics.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
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
