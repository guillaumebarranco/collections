import { Serie } from '../../../models/serie-model';
import {
  getSerieAverageRating,
  getSerieSeasonsCount,
  getSerieTotalEpisodes,
  getSerieTotalLengthMinutes,
  getSerieTotalTimesWatched,
} from '../../../utils/series.utils';

export type SerieView = 'finished' | 'watchlist' | 'owned' | 'toReWatch' | 'recommendations';

export const seriesSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'timesWatched', label: 'Visionnages (élevé)' },
  { value: 'timesWatched-asc', label: 'Visionnages (faible)' },
  { value: 'totalLength', label: 'Durée (long)' },
  { value: 'totalLength-asc', label: 'Durée (court)' },
  { value: 'nbSeasons', label: 'Saisons (élevé)' },
  { value: 'nbSeasons-asc', label: 'Saisons (faible)' },
  { value: 'nbEpisodesTotal', label: 'Épisodes (élevé)' },
  { value: 'nbEpisodesTotal-asc', label: 'Épisodes (faible)' },
];

export const serieViewOptions: { value: SerieView; label: string }[] = [
  { value: 'finished', label: 'Séries finies' },
  { value: 'watchlist', label: 'Séries à voir' },
  { value: 'owned', label: 'Séries possédées' },
  { value: 'toReWatch', label: 'À revoir' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedSeries = (
  series: Serie[],
  selectedSort: string
): Serie[] => {
  switch (selectedSort) {
    case 'title':
      return series.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return series.sort((a, b) => b.title.localeCompare(a.title));
    case 'releaseDate':
      return series.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() -
          new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return series.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() -
          new Date(b.releaseDate).getTime()
      );
    case 'rating':
      return series.sort((a, b) => {
        const ratingA = getSerieAverageRating(a);
        const ratingB = getSerieAverageRating(b);
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a);
      });
    case 'rating-asc':
      return series.sort((a, b) => {
        const ratingA = getSerieAverageRating(a);
        const ratingB = getSerieAverageRating(b);
        if (ratingA !== ratingB) {
          return ratingA - ratingB;
        }
        return getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a);
      });
    case 'timesWatched':
      return series.sort(
        (a, b) => getSerieTotalTimesWatched(b) - getSerieTotalTimesWatched(a)
      );
    case 'timesWatched-asc':
      return series.sort(
        (a, b) => getSerieTotalTimesWatched(a) - getSerieTotalTimesWatched(b)
      );
    case 'totalLength':
      return series.sort(
        (a, b) =>
          getSerieTotalLengthMinutes(b) - getSerieTotalLengthMinutes(a)
      );
    case 'totalLength-asc':
      return series.sort(
        (a, b) =>
          getSerieTotalLengthMinutes(a) - getSerieTotalLengthMinutes(b)
      );
    case 'nbSeasons':
      return series.sort(
        (a, b) => getSerieSeasonsCount(b) - getSerieSeasonsCount(a)
      );
    case 'nbSeasons-asc':
      return series.sort(
        (a, b) => getSerieSeasonsCount(a) - getSerieSeasonsCount(b)
      );
    case 'nbEpisodesTotal':
      return series.sort(
        (a, b) => getSerieTotalEpisodes(b) - getSerieTotalEpisodes(a)
      );
    case 'nbEpisodesTotal-asc':
      return series.sort(
        (a, b) => getSerieTotalEpisodes(a) - getSerieTotalEpisodes(b)
      );
    case 'watchPriority':
      return series.sort((a, b) => {
        const priorityA = a.watchPriority ?? 0;
        const priorityB = b.watchPriority ?? 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
    default:
      return series.sort((a, b) => a.title.localeCompare(b.title));
  }
};
