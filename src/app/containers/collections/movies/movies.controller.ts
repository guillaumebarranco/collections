import { getApiBaseUrl } from '../../../core/config';
import { Movie } from '../../../models/movie-model';

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
    const today = new Date().toISOString().split('T')[0];
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
        seenAtCinema: movie.seenAtCinema,
        owned: movie.owned,
        wantToSeeAgain: false,
        watchPriority: movie.watchPriority ?? 0,
        ratingComment: movie.ratingComment ?? '',
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
