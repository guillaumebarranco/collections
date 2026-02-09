import { Movie } from '../../../models/movie-model';

export type MovieView =
  | 'watched'
  | 'cinema'
  | 'watchlist'
  | 'owned'
  | 'toReWatch'
  | 'sagas'
  | 'actors'
  | 'directors'
  | 'recommendations';
export type OptionalMovieView = Exclude<MovieView, 'watched' | 'watchlist'>;

export const allYearsSince2000 = [
  2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
  2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
  2000,
];

export const moviesSortOptions = (
  selectedView: MovieView
): { value: string; label: string }[] => {
  if (
    selectedView === 'watched' ||
    selectedView === 'cinema' ||
    selectedView === 'toReWatch' ||
    selectedView === 'owned'
  ) {
    return viewedMoviesSortOptions;
  }

  if (selectedView === 'watchlist') {
    return [];
  }

  if (selectedView === 'actors') {
    return actorsMoviesSortOptions;
  }

  if (selectedView === 'directors') {
    return directorsMoviesSortOptions;
  }

  if (selectedView === 'sagas') {
    return sagasMoviesSortOptions;
  }

  return [];
};

export const actorsMoviesSortOptions: { value: string; label: string }[] = [
  { value: 'actor-count', label: 'Nombre de films' },
  { value: 'actor-user-rating', label: 'Acteur le mieux noté par vous' },
  {
    value: 'actor-global-rating',
    label: 'Acteur le mieux noté par les utilisateurs',
  },
  {
    value: 'actor-seen-count',
    label: 'Acteur avec le plus de films vus par vous',
  },
  {
    value: 'actor-rewatched-count',
    label: 'Acteur avec le plus de films revus par vous',
  },
];

export const directorsMoviesSortOptions: { value: string; label: string }[] = [
  { value: 'director-count', label: 'Nombre de films' },
  {
    value: 'director-user-rating',
    label: 'Réalisateur le mieux noté par vous',
  },
  {
    value: 'director-global-rating',
    label: 'Réalisateur le mieux noté par les utilisateurs',
  },
  {
    value: 'director-seen-count',
    label: 'Réalisateur avec le plus de films vus par vous',
  },
  {
    value: 'director-rewatched-count',
    label: 'Réalisateur avec le plus de films revus par vous',
  },
];

export const sagasMoviesSortOptions: { value: string; label: string }[] = [
  { value: 'saga-count', label: 'Nombre de films' },
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
    label: 'Saga avec le plus de films vus par vous',
  },
  {
    value: 'saga-rewatched-count',
    label: 'Saga avec le plus de films revus par vous',
  },
];

export const viewedMoviesSortOptions: { value: string; label: string }[] = [
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
  { value: 'toReWatch', label: 'Films à revoir' },
  { value: 'sagas', label: 'Voir les sagas' },
  { value: 'actors', label: 'Voir les acteurs' },
  { value: 'directors', label: 'Voir les réalisateurs' },
  { value: 'recommendations', label: 'Recommandations' },
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
    case 'watchPriority':
      return movies.sort((a, b) => b.watchPriority - a.watchPriority);
    default:
      return movies.sort((a, b) => a.title.localeCompare(b.title));
  }
};

export type MoviesByActorGroup = {
  actor: string;
  seenMovies: Movie[];
  missingMovies: Movie[];
};

export type MoviesByDirectorGroup = {
  director: string;
  seenMovies: Movie[];
  missingMovies: Movie[];
};

const getMovieIdentityKey = (movie: Movie): string => {
  return `${movie.title}|${movie.director}`;
};

export const getMoviesBySaga = ({
  sortedMovies,
  allMovies,
  baseMovies,
  selectedSort,
  isAdminView,
}: {
  sortedMovies: Movie[];
  allMovies: Movie[];
  baseMovies: Movie[];
  selectedSort: string;
  isAdminView: boolean;
}): { saga: string; seenMovies: Movie[]; missingMovies: Movie[] }[] => {
  const sagaMap = new Map<string, Movie[]>();
  for (const movie of sortedMovies) {
    const sagaName = movie.saga?.trim();
    if (!sagaName && !isAdminView) {
      continue;
    }
    const sagaKey = sagaName || 'Sans saga';
    const list = sagaMap.get(sagaKey) ?? [];
    list.push(movie);
    sagaMap.set(sagaKey, list);
  }

  const seenKeys = new Set(
    allMovies.map((movie: any) => getMovieIdentityKey(movie))
  );
  const baseBySaga = new Map<string, Movie[]>();
  for (const movie of baseMovies) {
    const sagaName = movie.saga?.trim();
    if (!sagaName) continue;
    if (seenKeys.has(getMovieIdentityKey(movie))) continue;
    const list = baseBySaga.get(sagaName) ?? [];
    list.push(movie);
    baseBySaga.set(sagaName, list);
  }

  const sagaGroups = Array.from(sagaMap.entries()).map(([saga, seenMovies]) => {
    const missing =
      isAdminView || saga === 'Sans saga'
        ? []
        : getSortedMovies([...(baseBySaga.get(saga) ?? [])], 'releaseDate-asc');
    return {
      saga,
      seenMovies: getSortedMovies(seenMovies, 'releaseDate-asc'),
      missingMovies: missing,
    };
  });

  // Filtrer les sagas avec au moins 5 films notés pour les tris basés sur les notes
  const filteredSagaGroups =
    selectedSort === 'saga-user-rating' || selectedSort === 'saga-global-rating'
      ? sagaGroups.filter((group) => {
          const ratedMovies = group.seenMovies.filter(
            (movie) => movie.rating && movie.rating > 0
          );
          return ratedMovies.length >= 5;
        })
      : sagaGroups.filter(
          (group) => group.seenMovies.length + group.missingMovies.length > 3
        );

  // Appliquer le tri selon selectedSort
  filteredSagaGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'saga-count': {
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-user-rating':
      case 'saga-global-rating': {
        const ratedMoviesA = a.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const ratedMoviesB = b.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const avgRatingA =
          ratedMoviesA.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesA.length || 1);
        const avgRatingB =
          ratedMoviesB.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-seen-count': {
        const countA = a.seenMovies.length;
        const countB = b.seenMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.saga.localeCompare(b.saga);
      }
      case 'saga-rewatched-count': {
        const rewatchedCountA = a.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        const rewatchedCountB = b.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        if (rewatchedCountB !== rewatchedCountA) {
          return rewatchedCountB - rewatchedCountA;
        }
        return a.saga.localeCompare(b.saga);
      }
      default: {
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.saga.localeCompare(b.saga);
      }
    }
  });

  return filteredSagaGroups;
};

export const getMoviesByActor = ({
  sortedMovies,
  allMovies,
  baseMovies,
  selectedSort,
  isAdminView,
}: {
  sortedMovies: Movie[];
  allMovies: Movie[];
  baseMovies: Movie[];
  selectedSort: string;
  isAdminView: boolean;
}): MoviesByActorGroup[] => {
  const actorMap = new Map<string, Movie[]>();
  for (const movie of sortedMovies) {
    const actors =
      movie.actors?.map((actor) => actor.name).filter(Boolean) || [];
    if (actors.length === 0) continue;
    for (const actorName of actors) {
      const list = actorMap.get(actorName) ?? [];
      list.push(movie);
      actorMap.set(actorName, list);
    }
  }

  const seenKeys = new Set(
    allMovies.map((movie) => getMovieIdentityKey(movie))
  );
  const baseByActor = new Map<string, Movie[]>();
  for (const movie of baseMovies) {
    if (seenKeys.has(getMovieIdentityKey(movie))) continue;
    const actors =
      movie.actors?.map((actor) => actor.name).filter(Boolean) || [];
    if (actors.length === 0) continue;
    for (const actorName of actors) {
      const list = baseByActor.get(actorName) ?? [];
      list.push(movie);
      baseByActor.set(actorName, list);
    }
  }

  const groups = Array.from(actorMap.entries())
    .map(([actor, seenMovies]) => {
      const missing = isAdminView
        ? []
        : getSortedMovies(
            [...(baseByActor.get(actor) ?? [])],
            'releaseDate-asc'
          );
      return {
        actor,
        seenMovies: getSortedMovies(seenMovies, 'releaseDate-asc'),
        missingMovies: missing,
      };
    })
    .filter((group) => group.seenMovies.length > 1);

  // Filtrer les acteurs avec au moins 5 films notés pour les tris basés sur les notes
  const filteredGroups =
    selectedSort === 'actor-user-rating' ||
    selectedSort === 'actor-global-rating'
      ? groups.filter((group) => {
          const ratedMovies = group.seenMovies.filter(
            (movie) => movie.rating && movie.rating > 0
          );
          return ratedMovies.length >= 5;
        })
      : groups.filter(
          (group) => group.seenMovies.length + group.missingMovies.length > 4
        );

  // Appliquer le tri selon selectedSort
  filteredGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'actor-count': {
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.actor.localeCompare(b.actor);
      }
      case 'actor-user-rating': {
        // Calculer la moyenne des notes de l'utilisateur pour chaque acteur
        // (seulement pour les films notés)
        const ratedMoviesA = a.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const ratedMoviesB = b.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const avgRatingA =
          ratedMoviesA.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesA.length || 1);
        const avgRatingB =
          ratedMoviesB.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.actor.localeCompare(b.actor);
      }
      case 'actor-global-rating': {
        // Pour l'instant, utiliser la même logique que actor-user-rating
        // (peut être amélioré plus tard avec les notes des autres utilisateurs)
        // (seulement pour les films notés)
        const ratedMoviesA = a.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const ratedMoviesB = b.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const avgRatingA =
          ratedMoviesA.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesA.length || 1);
        const avgRatingB =
          ratedMoviesB.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.actor.localeCompare(b.actor);
      }
      case 'actor-seen-count': {
        // Trier par le nombre de films vus par l'utilisateur
        const countA = a.seenMovies.length;
        const countB = b.seenMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.actor.localeCompare(b.actor);
      }
      case 'actor-rewatched-count': {
        // Trier par le nombre de films revus (timesWatched > 1)
        const rewatchedCountA = a.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        const rewatchedCountB = b.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        if (rewatchedCountB !== rewatchedCountA) {
          return rewatchedCountB - rewatchedCountA;
        }
        return a.actor.localeCompare(b.actor);
      }
      default: {
        // Tri par défaut : nombre de films puis ordre alphabétique
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.actor.localeCompare(b.actor);
      }
    }
  });

  return filteredGroups;
};

export const getMoviesByDirector = ({
  sortedMovies,
  allMovies,
  baseMovies,
  selectedSort,
  isAdminView,
}: {
  sortedMovies: Movie[];
  allMovies: Movie[];
  baseMovies: Movie[];
  selectedSort: string;
  isAdminView: boolean;
}): MoviesByDirectorGroup[] => {
  const directorMap = new Map<string, Movie[]>();
  for (const movie of sortedMovies) {
    const directorName = movie.director?.trim();
    if (!directorName) continue;
    const list = directorMap.get(directorName) ?? [];
    list.push(movie);
    directorMap.set(directorName, list);
  }

  const seenKeys = new Set(
    allMovies.map((movie) => getMovieIdentityKey(movie))
  );
  const baseByDirector = new Map<string, Movie[]>();
  for (const movie of baseMovies) {
    if (seenKeys.has(getMovieIdentityKey(movie))) continue;
    const directorName = movie.director?.trim();
    if (!directorName) continue;
    const list = baseByDirector.get(directorName) ?? [];
    list.push(movie);
    baseByDirector.set(directorName, list);
  }

  const groups = Array.from(directorMap.entries()).map(
    ([director, seenMovies]) => {
      const missing = isAdminView
        ? []
        : getSortedMovies(
            [...(baseByDirector.get(director) ?? [])],
            'releaseDate-asc'
          );
      return {
        director,
        seenMovies: getSortedMovies(seenMovies, 'releaseDate-asc'),
        missingMovies: missing,
      };
    }
  );

  // Filtrer les réalisateurs avec au moins 5 films notés pour les tris basés sur les notes
  const filteredGroups =
    selectedSort === 'director-user-rating' ||
    selectedSort === 'director-global-rating'
      ? groups.filter((group) => {
          const ratedMovies = group.seenMovies.filter(
            (movie) => movie.rating && movie.rating > 0
          );
          return ratedMovies.length >= 5;
        })
      : groups.filter(
          (group) => group.seenMovies.length + group.missingMovies.length > 4
        );

  // Appliquer le tri selon selectedSort
  filteredGroups.sort((a, b) => {
    switch (selectedSort) {
      case 'director-count': {
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.director.localeCompare(b.director);
      }
      case 'director-user-rating': {
        // Calculer la moyenne des notes de l'utilisateur pour chaque réalisateur
        // (seulement pour les films notés)
        const ratedMoviesA = a.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const ratedMoviesB = b.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const avgRatingA =
          ratedMoviesA.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesA.length || 1);
        const avgRatingB =
          ratedMoviesB.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.director.localeCompare(b.director);
      }
      case 'director-global-rating': {
        // Pour l'instant, utiliser la même logique que director-user-rating
        // (peut être amélioré plus tard avec les notes des autres utilisateurs)
        // (seulement pour les films notés)
        const ratedMoviesA = a.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const ratedMoviesB = b.seenMovies.filter(
          (movie) => movie.rating && movie.rating > 0
        );
        const avgRatingA =
          ratedMoviesA.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesA.length || 1);
        const avgRatingB =
          ratedMoviesB.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
          (ratedMoviesB.length || 1);
        if (Math.abs(avgRatingB - avgRatingA) > 0.01) {
          return avgRatingB - avgRatingA;
        }
        return a.director.localeCompare(b.director);
      }
      case 'director-seen-count': {
        // Trier par le nombre de films vus par l'utilisateur
        const countA = a.seenMovies.length;
        const countB = b.seenMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.director.localeCompare(b.director);
      }
      case 'director-rewatched-count': {
        // Trier par le nombre de films revus (timesWatched > 1)
        const rewatchedCountA = a.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        const rewatchedCountB = b.seenMovies.filter(
          (movie) => movie.timesWatched && movie.timesWatched > 1
        ).length;
        if (rewatchedCountB !== rewatchedCountA) {
          return rewatchedCountB - rewatchedCountA;
        }
        return a.director.localeCompare(b.director);
      }
      default: {
        // Tri par défaut : nombre de films puis ordre alphabétique
        const countA = a.seenMovies.length + a.missingMovies.length;
        const countB = b.seenMovies.length + b.missingMovies.length;
        if (countB !== countA) {
          return countB - countA;
        }
        return a.director.localeCompare(b.director);
      }
    }
  });

  return filteredGroups.filter((group) => group.seenMovies.length > 1);
};
