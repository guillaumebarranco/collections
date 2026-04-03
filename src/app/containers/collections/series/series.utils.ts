import { Serie } from '../../../models/serie-model';
import {
  getSerieAverageRating,
  getSerieSeasonsCount,
  getSerieTotalEpisodes,
  getSerieTotalLengthMinutes,
  getSerieTotalTimesWatched,
} from '../../../utils/series.utils';

export type SerieView =
  | 'finished'
  | 'watchlist'
  | 'watchingInProgress'
  | 'owned'
  | 'borrowed'
  | 'loaned'
  | 'toReWatch'
  | 'sagas'
  | 'countries'
  | 'recommendations';

export type OptionalSerieView = Exclude<
  SerieView,
  'finished' | 'watchlist' | 'watchingInProgress'
>;

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
  { value: 'finished', label: 'Séries vues' },
  { value: 'watchlist', label: 'Séries à voir' },
  { value: 'watchingInProgress', label: 'En cours' },
  { value: 'owned', label: 'Séries possédées' },
  { value: 'borrowed', label: 'Séries empruntées' },
  { value: 'loaned', label: 'Séries prêtées' },
  { value: 'toReWatch', label: 'À revoir' },
  { value: 'sagas', label: 'Voir par saga' },
  { value: 'countries', label: 'Voir par pays' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const sagasSeriesSortOptions: { value: string; label: string }[] = [
  { value: 'saga-count', label: 'Nombre de séries' },
  {
    value: 'saga-user-rating',
    label: 'Saga la mieux notée par vous',
  },
  {
    value: 'saga-global-rating',
    label: 'Saga la mieux notée par les utilisateurs',
  },
  {
    value: 'saga-seen-count',
    label: 'Saga avec le plus de séries vues par vous',
  },
  {
    value: 'saga-rewatched-count',
    label: 'Saga avec le plus de séries revues par vous',
  },
];

export const countriesSeriesSortOptions: { value: string; label: string }[] = [
  { value: 'country-count', label: 'Nombre de séries' },
  {
    value: 'country-user-rating',
    label: 'Pays le mieux noté par vous',
  },
  {
    value: 'country-global-rating',
    label: 'Pays le mieux noté par les utilisateurs',
  },
  {
    value: 'country-seen-count',
    label: 'Pays avec le plus de séries vues par vous',
  },
  {
    value: 'country-rewatched-count',
    label: 'Pays avec le plus de séries revues par vous',
  },
];

export const getSeriesSortOptions = (
  selectedView: SerieView
): { value: string; label: string }[] => {
  if (selectedView === 'sagas') {
    return sagasSeriesSortOptions;
  }
  if (selectedView === 'countries') {
    return countriesSeriesSortOptions;
  }
  return seriesSortOptions;
};

export type SeriesByCountryGroup = {
  country: string;
  seenSeries: Serie[];
  missingSeries: Serie[];
};

export type SeriesBySagaGroup = {
  saga: string;
  seenSeries: Serie[];
  missingSeries: Serie[];
};

const getSerieIdentityKey = (serie: Serie): string =>
  `${serie.title}|${serie.director}`;

export const getSeriesByCountry = ({
  sortedSeries,
  allSeries,
  baseSeries,
  selectedSort,
}: {
  sortedSeries: Serie[];
  allSeries: Serie[];
  baseSeries: Serie[];
  selectedSort: string;
}): SeriesByCountryGroup[] => {
  const countryMap = new Map<string, Serie[]>();
  for (const serie of sortedSeries) {
    const countryName = (serie.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    const list = countryMap.get(countryName) ?? [];
    list.push(serie);
    countryMap.set(countryName, list);
  }

  const seenKeys = new Set(
    allSeries.map((serie) => getSerieIdentityKey(serie))
  );
  const baseByCountry = new Map<string, Serie[]>();
  for (const serie of baseSeries) {
    const countryName = (serie.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    if (seenKeys.has(getSerieIdentityKey(serie))) continue;
    const list = baseByCountry.get(countryName) ?? [];
    list.push(serie);
    baseByCountry.set(countryName, list);
  }

  const countryGroups = Array.from(countryMap.entries()).map(
    ([country, seenSeries]) => {
      const missing = getSortedSeries(
        [...(baseByCountry.get(country) ?? [])],
        'releaseDate-asc'
      );
      return {
        country,
        seenSeries: getSortedSeries(seenSeries, 'releaseDate-asc'),
        missingSeries: missing,
      };
    }
  );

  const filteredCountryGroups =
    selectedSort === 'country-user-rating' ||
    selectedSort === 'country-global-rating'
      ? countryGroups.filter((group) => {
          const ratedSeries = group.seenSeries.filter(
            (serie) => getSerieAverageRating(serie) > 0
          );
          return ratedSeries.length >= 5;
        })
      : countryGroups.filter(
          (group) => group.seenSeries.length + group.missingSeries.length > 3
        );

  filteredCountryGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'country-count': {
        const countA = a.seenSeries.length + a.missingSeries.length;
        const countB = b.seenSeries.length + b.missingSeries.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
      case 'country-user-rating':
      case 'country-global-rating': {
        const ratedA = a.seenSeries.filter((s) => getSerieAverageRating(s) > 0);
        const ratedB = b.seenSeries.filter((s) => getSerieAverageRating(s) > 0);
        const avgA =
          ratedA.reduce((sum, s) => sum + getSerieAverageRating(s), 0) /
          (ratedA.length || 1);
        const avgB =
          ratedB.reduce((sum, s) => sum + getSerieAverageRating(s), 0) /
          (ratedB.length || 1);
        if (Math.abs(avgB - avgA) > 0.01) return avgB - avgA;
        return a.country.localeCompare(b.country);
      }
      case 'country-seen-count': {
        const countA = a.seenSeries.length;
        const countB = b.seenSeries.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
      case 'country-rewatched-count': {
        const rewatchedA = a.seenSeries.filter(
          (s) => getSerieTotalTimesWatched(s) > 1
        ).length;
        const rewatchedB = b.seenSeries.filter(
          (s) => getSerieTotalTimesWatched(s) > 1
        ).length;
        if (rewatchedB !== rewatchedA) return rewatchedB - rewatchedA;
        return a.country.localeCompare(b.country);
      }
      default: {
        const countA = a.seenSeries.length + a.missingSeries.length;
        const countB = b.seenSeries.length + b.missingSeries.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
    }
  });

  return filteredCountryGroups;
};

export const getSeriesBySaga = ({
  sortedSeries,
  allSeries,
  baseSeries,
  selectedSort,
}: {
  sortedSeries: Serie[];
  allSeries: Serie[];
  baseSeries: Serie[];
  selectedSort: string;
}): SeriesBySagaGroup[] => {
  const sagaMap = new Map<string, Serie[]>();
  for (const serie of sortedSeries) {
    const sagaName = (serie.saga ?? '').trim();
    const sagaKey = sagaName || 'Sans saga';
    const list = sagaMap.get(sagaKey) ?? [];
    list.push(serie);
    sagaMap.set(sagaKey, list);
  }

  const seenKeys = new Set(allSeries.map((s) => getSerieIdentityKey(s)));
  const baseBySaga = new Map<string, Serie[]>();
  for (const serie of baseSeries) {
    const sagaName = (serie.saga ?? '').trim();
    if (!sagaName) continue;
    if (seenKeys.has(getSerieIdentityKey(serie))) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(serie);
    baseBySaga.set(sagaName, list);
  }

  const allSagaNames = new Set<string>([
    ...sagaMap.keys(),
    ...baseBySaga.keys(),
  ]);

  const sagaGroups = Array.from(allSagaNames).map((saga) => {
    const seenSeries = sagaMap.get(saga) ?? [];
    const missing =
      saga === 'Sans saga'
        ? []
        : getSortedSeries([...(baseBySaga.get(saga) ?? [])], 'releaseDate-asc');
    return {
      saga,
      seenSeries: getSortedSeries(seenSeries, 'releaseDate-asc'),
      missingSeries: missing,
    };
  });

  sagaGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'saga-count': {
        const countA = a.seenSeries.length + a.missingSeries.length;
        const countB = b.seenSeries.length + b.missingSeries.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-user-rating':
      case 'saga-global-rating': {
        const ratedA = a.seenSeries.filter((s) => getSerieAverageRating(s) > 0);
        const ratedB = b.seenSeries.filter((s) => getSerieAverageRating(s) > 0);
        const avgA =
          ratedA.reduce((sum, s) => sum + getSerieAverageRating(s), 0) /
          (ratedA.length || 1);
        const avgB =
          ratedB.reduce((sum, s) => sum + getSerieAverageRating(s), 0) /
          (ratedB.length || 1);
        if (Math.abs(avgB - avgA) > 0.01) return avgB - avgA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-seen-count': {
        const countA = a.seenSeries.length;
        const countB = b.seenSeries.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-rewatched-count': {
        const rewatchedA = a.seenSeries.filter(
          (s) => getSerieTotalTimesWatched(s) > 1
        ).length;
        const rewatchedB = b.seenSeries.filter(
          (s) => getSerieTotalTimesWatched(s) > 1
        ).length;
        if (rewatchedB !== rewatchedA) return rewatchedB - rewatchedA;
        return a.saga.localeCompare(b.saga);
      }
      default: {
        const countA = a.seenSeries.length + a.missingSeries.length;
        const countB = b.seenSeries.length + b.missingSeries.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
    }
  });

  return sagaGroups;
};

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
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return series.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
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
        (a, b) => getSerieTotalLengthMinutes(b) - getSerieTotalLengthMinutes(a)
      );
    case 'totalLength-asc':
      return series.sort(
        (a, b) => getSerieTotalLengthMinutes(a) - getSerieTotalLengthMinutes(b)
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
