import { getApiBaseUrl, isLocalhost } from '../../../core/config';
import { Movie } from '../../../models/movie-model';
import {
  shiftPreviousLastDateToExtras,
  todayIsoDate,
} from '../../../utils/activity-extra-dates.utils';
import type { UserMovieListItem } from '../../../models/movie-list.model';
import { usersMoviesLists } from '../../../utils/users/user-movies-lists';

export async function updateWatchPriority(
  data: {
    movie: Movie;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.movie.title,
        director: data.movie.director,
        rating: data.movie.rating,
        timesWatched: data.movie.timesWatched,
        firstViewedDate: data.movie.firstViewedDate,
        lastViewedDate: data.movie.lastViewedDate,
        seenAtCinema: data.movie.seenAtCinema,
        owned: data.movie.owned,
        wantToSeeAgain: data.movie.wantToSeeAgain,
        watchPriority: data.priority,
        ratingComment: data.movie.ratingComment ?? '',
        inList: data.movie.inList ?? [],
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour de la priorité :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Erreur réseau lors de la mise à jour de la priorité.', error);
    return false;
  }
}

export async function markMovieAsReWatched(
  movie: Movie,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const today = todayIsoDate();
    const otherSeenDates = shiftPreviousLastDateToExtras(
      movie.lastViewedDate,
      movie.otherSeenDates,
      today
    );
    const response = await fetch(`${getApiBaseUrl()}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: movie.title,
        director: movie.director,
        rating: movie.rating,
        timesWatched: (movie.timesWatched || 0) + 1,
        firstViewedDate: movie.firstViewedDate,
        lastViewedDate: today,
        otherSeenDates,
        seenAtCinema: movie.seenAtCinema,
        owned: movie.owned,
        wantToSeeAgain: false,
        watchPriority: movie.watchPriority ?? 0,
        ratingComment: movie.ratingComment ?? '',
        inList: movie.inList ?? [],
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour du film :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Erreur réseau lors de la mise à jour du film.', error);
    return false;
  }
}

export async function markMovieAsWantToReWatch(
  movie: Movie,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: movie.title,
        director: movie.director,
        rating: movie.rating,
        timesWatched: movie.timesWatched,
        firstViewedDate: movie.firstViewedDate,
        lastViewedDate: movie.lastViewedDate,
        seenAtCinema: movie.seenAtCinema,
        owned: movie.owned,
        wantToSeeAgain: true,
        watchPriority: movie.watchPriority ?? 0,
        ratingComment: movie.ratingComment ?? '',
        inList: movie.inList ?? [],
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour du film :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn('Erreur réseau lors de la mise à jour du film.', error);
    return false;
  }
}

export async function addMovieToWatchlist(
  movie: Movie,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/movies/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        movies: [movie],
        watchlist: true,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        "Échec de l'ajout batch des films :",
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Erreur réseau lors de l'ajout batch des films.", error);
    return false;
  }
}

/** Ajoute le film parmi les films vus de l'utilisateur (watchlist: false). */
export async function addMovieAsWatched(
  movie: Movie,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/movies/add-existing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        movies: [movie],
        watchlist: false,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        "Échec de l'ajout du film en « vu » :",
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Erreur réseau lors de l'ajout du film en « vu ».", error);
    return false;
  }
}

/** Récupère les listes de films de l'utilisateur (name, icon, color). En local, lit toujours depuis le fichier statique (comme les films). */
export async function getUserMoviesLists(
  userId: string
): Promise<UserMovieListItem[]> {
  if (isLocalhost()) {
    const lists = usersMoviesLists[userId.toLowerCase()];
    return Array.isArray(lists) ? [...lists] : [];
  }
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/movies-lists`
    );
    if (!response.ok) return [];
    const data = await response.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: unknown) => {
      if (item && typeof item === 'object' && 'name' in item && typeof (item as UserMovieListItem).name === 'string') {
        const t = item as UserMovieListItem;
        return { name: t.name, icon: t.icon ?? '📋', color: t.color ?? '#6b7280' };
      }
      if (typeof item === 'string') return { name: item, icon: '📋', color: '#6b7280' };
      return { name: '', icon: '📋', color: '#6b7280' };
    }).filter((x: UserMovieListItem) => x.name.length > 0);
  } catch {
    return [];
  }
}

/** Crée une nouvelle liste de films pour l'utilisateur. Retourne la liste à jour. */
export async function createUserMovieList(
  userId: string,
  listName: string,
  icon?: string,
  color?: string
): Promise<UserMovieListItem[] | null> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/movies-lists`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listName: listName.trim(),
          ...(icon != null && { icon: icon.trim() }),
          ...(color != null && { color: color.trim() }),
        }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data)) return null;
    return data.map((item: unknown) => {
      if (item && typeof item === 'object' && 'name' in item && typeof (item as UserMovieListItem).name === 'string') {
        const t = item as UserMovieListItem;
        return { name: t.name, icon: t.icon ?? '📋', color: t.color ?? '#6b7280' };
      }
      return { name: '', icon: '📋', color: '#6b7280' };
    }).filter((x: UserMovieListItem) => x.name.length > 0);
  } catch {
    return null;
  }
}

/** Supprime une liste de films (et la retire du inList de tous les films concernés). */
export async function deleteUserMovieList(
  userId: string,
  listName: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/movies-lists`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

/** Ajoute un film à une liste (met à jour inList du film). */
export async function addMovieToList(
  movie: Movie,
  listName: string,
  userId: string
): Promise<boolean> {
  try {
    const currentList = movie.inList ?? [];
    if (currentList.includes(listName)) return true;
    const response = await fetch(`${getApiBaseUrl()}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        title: movie.title,
        director: movie.director,
        rating: movie.rating,
        timesWatched: movie.timesWatched,
        firstViewedDate: movie.firstViewedDate,
        lastViewedDate: movie.lastViewedDate,
        seenAtCinema: movie.seenAtCinema,
        owned: movie.owned,
        wantToSeeAgain: movie.wantToSeeAgain,
        watchPriority: movie.watchPriority ?? 0,
        ratingComment: movie.ratingComment ?? '',
        inList: [...currentList, listName],
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec ajout film à la liste:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau ajout film à la liste.', error);
    return false;
  }
}
