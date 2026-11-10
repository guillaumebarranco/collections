import { Anime } from '../../../models/anime-model';
import {
  getAnimeAverageRating,
  getAnimeLatestSeasonLastViewedTime,
  getAnimeSeasonsCount,
  getAnimeTotalEpisodes,
  getAnimeTotalLengthMinutes,
  getAnimeTotalTimesWatched,
} from '../../../utils/animes.utils';

export type AnimeView =
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

export type OptionalAnimeView = Exclude<
  AnimeView,
  'finished' | 'watchlist' | 'watchingInProgress'
>;

export const animesSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
  { value: 'seasonLastViewed', label: 'Date de visionnage (récent)' },
  { value: 'seasonLastViewed-asc', label: 'Date de visionnage (ancien)' },
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

export const animeViewOptions: { value: AnimeView; label: string }[] = [
  { value: 'finished', label: 'Animés vues' },
  { value: 'watchlist', label: 'Animés à voir' },
  { value: 'watchingInProgress', label: 'En cours' },
  { value: 'owned', label: 'Animés possédées' },
  { value: 'borrowed', label: 'Animés empruntées' },
  { value: 'loaned', label: 'Animés prêtées' },
  { value: 'toReWatch', label: 'À revoir' },
  { value: 'sagas', label: 'Voir par saga' },
  { value: 'countries', label: 'Voir par pays' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const sagasAnimesSortOptions: { value: string; label: string }[] = [
  { value: 'saga-count', label: 'Nombre de animés' },
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
    label: 'Saga avec le plus de animés vues par vous',
  },
  {
    value: 'saga-rewatched-count',
    label: 'Saga avec le plus de animés revues par vous',
  },
];

export const countriesAnimesSortOptions: { value: string; label: string }[] = [
  { value: 'country-count', label: 'Nombre de animés' },
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
    label: 'Pays avec le plus de animés vues par vous',
  },
  {
    value: 'country-rewatched-count',
    label: 'Pays avec le plus de animés revues par vous',
  },
];

export const getAnimesSortOptions = (
  selectedView: AnimeView
): { value: string; label: string }[] => {
  if (selectedView === 'sagas') {
    return sagasAnimesSortOptions;
  }
  if (selectedView === 'countries') {
    return countriesAnimesSortOptions;
  }
  return animesSortOptions;
};

export type AnimesByCountryGroup = {
  country: string;
  seenAnimes: Anime[];
  missingAnimes: Anime[];
};

export type AnimesBySagaGroup = {
  saga: string;
  seenAnimes: Anime[];
  missingAnimes: Anime[];
};

const getAnimeIdentityKey = (anime: Anime): string =>
  `${anime.title}|${anime.director}`;

export const getAnimesByCountry = ({
  sortedAnimes,
  allAnimes,
  baseAnimes,
  selectedSort,
}: {
  sortedAnimes: Anime[];
  allAnimes: Anime[];
  baseAnimes: Anime[];
  selectedSort: string;
}): AnimesByCountryGroup[] => {
  const countryMap = new Map<string, Anime[]>();
  for (const anime of sortedAnimes) {
    const countryName = (anime.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    const list = countryMap.get(countryName) ?? [];
    list.push(anime);
    countryMap.set(countryName, list);
  }

  const seenKeys = new Set(
    allAnimes.map((anime) => getAnimeIdentityKey(anime))
  );
  const baseByCountry = new Map<string, Anime[]>();
  for (const anime of baseAnimes) {
    const countryName = (anime.countryOrigin ?? '').toString().trim();
    if (!countryName) continue;
    if (seenKeys.has(getAnimeIdentityKey(anime))) continue;
    const list = baseByCountry.get(countryName) ?? [];
    list.push(anime);
    baseByCountry.set(countryName, list);
  }

  const countryGroups = Array.from(countryMap.entries()).map(
    ([country, seenAnimes]) => {
      const missing = getSortedAnimes(
        [...(baseByCountry.get(country) ?? [])],
        'releaseDate-asc'
      );
      return {
        country,
        seenAnimes: getSortedAnimes(seenAnimes, 'releaseDate-asc'),
        missingAnimes: missing,
      };
    }
  );

  const filteredCountryGroups =
    selectedSort === 'country-user-rating' ||
    selectedSort === 'country-global-rating'
      ? countryGroups.filter((group) => {
          const ratedAnimes = group.seenAnimes.filter(
            (anime) => getAnimeAverageRating(anime) > 0
          );
          return ratedAnimes.length >= 5;
        })
      : countryGroups.filter(
          (group) => group.seenAnimes.length + group.missingAnimes.length > 3
        );

  filteredCountryGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'country-count': {
        const countA = a.seenAnimes.length + a.missingAnimes.length;
        const countB = b.seenAnimes.length + b.missingAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
      case 'country-user-rating':
      case 'country-global-rating': {
        const ratedA = a.seenAnimes.filter((s) => getAnimeAverageRating(s) > 0);
        const ratedB = b.seenAnimes.filter((s) => getAnimeAverageRating(s) > 0);
        const avgA =
          ratedA.reduce((sum, s) => sum + getAnimeAverageRating(s), 0) /
          (ratedA.length || 1);
        const avgB =
          ratedB.reduce((sum, s) => sum + getAnimeAverageRating(s), 0) /
          (ratedB.length || 1);
        if (Math.abs(avgB - avgA) > 0.01) return avgB - avgA;
        return a.country.localeCompare(b.country);
      }
      case 'country-seen-count': {
        const countA = a.seenAnimes.length;
        const countB = b.seenAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
      case 'country-rewatched-count': {
        const rewatchedA = a.seenAnimes.filter(
          (s) => getAnimeTotalTimesWatched(s) > 1
        ).length;
        const rewatchedB = b.seenAnimes.filter(
          (s) => getAnimeTotalTimesWatched(s) > 1
        ).length;
        if (rewatchedB !== rewatchedA) return rewatchedB - rewatchedA;
        return a.country.localeCompare(b.country);
      }
      default: {
        const countA = a.seenAnimes.length + a.missingAnimes.length;
        const countB = b.seenAnimes.length + b.missingAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.country.localeCompare(b.country);
      }
    }
  });

  return filteredCountryGroups;
};

export const getAnimesBySaga = ({
  sortedAnimes,
  allAnimes,
  baseAnimes,
  selectedSort,
}: {
  sortedAnimes: Anime[];
  allAnimes: Anime[];
  baseAnimes: Anime[];
  selectedSort: string;
}): AnimesBySagaGroup[] => {
  const sagaMap = new Map<string, Anime[]>();
  for (const anime of sortedAnimes) {
    const sagaName = (anime.saga ?? '').trim();
    const sagaKey = sagaName || 'Sans saga';
    const list = sagaMap.get(sagaKey) ?? [];
    list.push(anime);
    sagaMap.set(sagaKey, list);
  }

  const seenKeys = new Set(allAnimes.map((s) => getAnimeIdentityKey(s)));
  const baseBySaga = new Map<string, Anime[]>();
  for (const anime of baseAnimes) {
    const sagaName = (anime.saga ?? '').trim();
    if (!sagaName) continue;
    if (seenKeys.has(getAnimeIdentityKey(anime))) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(anime);
    baseBySaga.set(sagaName, list);
  }

  const allSagaNames = new Set<string>([
    ...sagaMap.keys(),
    ...baseBySaga.keys(),
  ]);

  const sagaGroups = Array.from(allSagaNames).map((saga) => {
    const seenAnimes = sagaMap.get(saga) ?? [];
    const missing =
      saga === 'Sans saga'
        ? []
        : getSortedAnimes([...(baseBySaga.get(saga) ?? [])], 'releaseDate-asc');
    return {
      saga,
      seenAnimes: getSortedAnimes(seenAnimes, 'releaseDate-asc'),
      missingAnimes: missing,
    };
  });

  sagaGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'saga-count': {
        const countA = a.seenAnimes.length + a.missingAnimes.length;
        const countB = b.seenAnimes.length + b.missingAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-user-rating':
      case 'saga-global-rating': {
        const ratedA = a.seenAnimes.filter((s) => getAnimeAverageRating(s) > 0);
        const ratedB = b.seenAnimes.filter((s) => getAnimeAverageRating(s) > 0);
        const avgA =
          ratedA.reduce((sum, s) => sum + getAnimeAverageRating(s), 0) /
          (ratedA.length || 1);
        const avgB =
          ratedB.reduce((sum, s) => sum + getAnimeAverageRating(s), 0) /
          (ratedB.length || 1);
        if (Math.abs(avgB - avgA) > 0.01) return avgB - avgA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-seen-count': {
        const countA = a.seenAnimes.length;
        const countB = b.seenAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-rewatched-count': {
        const rewatchedA = a.seenAnimes.filter(
          (s) => getAnimeTotalTimesWatched(s) > 1
        ).length;
        const rewatchedB = b.seenAnimes.filter(
          (s) => getAnimeTotalTimesWatched(s) > 1
        ).length;
        if (rewatchedB !== rewatchedA) return rewatchedB - rewatchedA;
        return a.saga.localeCompare(b.saga);
      }
      default: {
        const countA = a.seenAnimes.length + a.missingAnimes.length;
        const countB = b.seenAnimes.length + b.missingAnimes.length;
        if (countB !== countA) return countB - countA;
        return a.saga.localeCompare(b.saga);
      }
    }
  });

  return sagaGroups;
};

export const getSortedAnimes = (
  animes: Anime[],
  selectedSort: string
): Anime[] => {
  switch (selectedSort) {
    case 'title':
      return animes.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return animes.sort((a, b) => b.title.localeCompare(a.title));
    case 'releaseDate':
      return animes.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return animes.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    case 'seasonLastViewed':
      return animes.sort((a, b) => {
        const ta = getAnimeLatestSeasonLastViewedTime(a);
        const tb = getAnimeLatestSeasonLastViewedTime(b);
        if (ta === 0 && tb === 0) {
          return a.title.localeCompare(b.title);
        }
        if (ta === 0) return 1;
        if (tb === 0) return -1;
        if (tb !== ta) return tb - ta;
        return a.title.localeCompare(b.title);
      });
    case 'seasonLastViewed-asc':
      return animes.sort((a, b) => {
        const ta = getAnimeLatestSeasonLastViewedTime(a);
        const tb = getAnimeLatestSeasonLastViewedTime(b);
        if (ta === 0 && tb === 0) {
          return a.title.localeCompare(b.title);
        }
        if (ta === 0) return 1;
        if (tb === 0) return -1;
        if (ta !== tb) return ta - tb;
        return a.title.localeCompare(b.title);
      });
    case 'rating':
      return animes.sort((a, b) => {
        const ratingA = getAnimeAverageRating(a);
        const ratingB = getAnimeAverageRating(b);
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return getAnimeTotalTimesWatched(b) - getAnimeTotalTimesWatched(a);
      });
    case 'rating-asc':
      return animes.sort((a, b) => {
        const ratingA = getAnimeAverageRating(a);
        const ratingB = getAnimeAverageRating(b);
        if (ratingA !== ratingB) {
          return ratingA - ratingB;
        }
        return getAnimeTotalTimesWatched(b) - getAnimeTotalTimesWatched(a);
      });
    case 'timesWatched':
      return animes.sort(
        (a, b) => getAnimeTotalTimesWatched(b) - getAnimeTotalTimesWatched(a)
      );
    case 'timesWatched-asc':
      return animes.sort(
        (a, b) => getAnimeTotalTimesWatched(a) - getAnimeTotalTimesWatched(b)
      );
    case 'totalLength':
      return animes.sort(
        (a, b) => getAnimeTotalLengthMinutes(b) - getAnimeTotalLengthMinutes(a)
      );
    case 'totalLength-asc':
      return animes.sort(
        (a, b) => getAnimeTotalLengthMinutes(a) - getAnimeTotalLengthMinutes(b)
      );
    case 'nbSeasons':
      return animes.sort(
        (a, b) => getAnimeSeasonsCount(b) - getAnimeSeasonsCount(a)
      );
    case 'nbSeasons-asc':
      return animes.sort(
        (a, b) => getAnimeSeasonsCount(a) - getAnimeSeasonsCount(b)
      );
    case 'nbEpisodesTotal':
      return animes.sort(
        (a, b) => getAnimeTotalEpisodes(b) - getAnimeTotalEpisodes(a)
      );
    case 'nbEpisodesTotal-asc':
      return animes.sort(
        (a, b) => getAnimeTotalEpisodes(a) - getAnimeTotalEpisodes(b)
      );
    case 'watchPriority':
      return animes.sort((a, b) => {
        const priorityA = a.watchPriority ?? 1;
        const priorityB = b.watchPriority ?? 1;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
    default:
      return animes.sort((a, b) => a.title.localeCompare(b.title));
  }
};
