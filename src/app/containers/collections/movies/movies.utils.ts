import { Movie } from '../../../models/movie-model';

export type MovieView = 'watched' | 'cinema' | 'watchlist' | 'owned' | 'sagas';
export type OptionalMovieView = Exclude<MovieView, 'watched' | 'watchlist'>;

export const allYearsSince2000 = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
  2000,
];

export const moviesSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'timesWatched', label: 'Visionnages (élevé)' },
  { value: 'timesWatched-asc', label: 'Visionnages (faible)' },
  { value: 'length', label: 'Durée (long)' },
  { value: 'length-asc', label: 'Durée (court)' },
  { value: 'lastViewedDate', label: 'Dernier visionnage (récent)' },
  { value: 'lastViewedDate-asc', label: 'Dernier visionnage (ancien)' },
];

export const movieViewOptions: { value: MovieView; label: string }[] = [
  { value: 'watched', label: 'Films vus' },
  { value: 'cinema', label: 'Films vus au cinéma' },
  { value: 'watchlist', label: 'Films à voir' },
  { value: 'owned', label: 'Films possédés' },
  { value: 'sagas', label: 'Voir les sagas' },
];

export const yearFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
  { value: '2019', label: '2019' },
  { value: '2018', label: '2018' },
  { value: '2017', label: '2017' },
  { value: '2016', label: '2016' },
  { value: '2015', label: '2015' },
  { value: '2014', label: '2014' },
  { value: '2013', label: '2013' },
  { value: '2012', label: '2012' },
  { value: '2011', label: '2011' },
  { value: '2010', label: '2010' },
  { value: '2009', label: '2009' },
  { value: '2008', label: '2008' },
  { value: '2007', label: '2007' },
  { value: '2006', label: '2006' },
  { value: '2005', label: '2005' },
  { value: '2004', label: '2004' },
  { value: '2003', label: '2003' },
  { value: '2002', label: '2002' },
  { value: 'before2002', label: 'Avant 2002' },
];

export const getSortedMovies = (
  movies: Movie[],
  selectedSort: string
): Movie[] => {
  switch (selectedSort) {
    case 'title':
      return movies.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return movies.sort((a, b) => b.title.localeCompare(a.title));
    case 'releaseDate':
      return movies.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return movies.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    case 'rating':
      return movies.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        return b.timesWatched - a.timesWatched;
      });
    case 'rating-asc':
      return movies.sort((a, b) => {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        return b.timesWatched - a.timesWatched;
      });
    case 'timesWatched':
      return movies.sort((a, b) => b.timesWatched - a.timesWatched);
    case 'timesWatched-asc':
      return movies.sort((a, b) => a.timesWatched - b.timesWatched);
    case 'length':
      return movies.sort((a, b) => b.length - a.length);
    case 'length-asc':
      return movies.sort((a, b) => a.length - b.length);
    case 'lastViewedDate':
      return movies.sort((a, b) => {
        const dateA = a.lastViewedDate
          ? new Date(a.lastViewedDate).getTime()
          : 0;
        const dateB = b.lastViewedDate
          ? new Date(b.lastViewedDate).getTime()
          : 0;
        return dateB - dateA;
      });
    case 'lastViewedDate-asc':
      return movies.sort((a, b) => {
        const dateA = a.lastViewedDate
          ? new Date(a.lastViewedDate).getTime()
          : 0;
        const dateB = b.lastViewedDate
          ? new Date(b.lastViewedDate).getTime()
          : 0;
        return dateA - dateB;
      });
    default:
      return movies.sort((a, b) => a.title.localeCompare(b.title));
  }
};
