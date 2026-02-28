import { getApiBaseUrl } from '../../core/config';
import { BaseSerie, UserSerie } from '../../models/serie-model';

export async function fetchUserSeriesFromApi(
  userId: string
): Promise<UserSerie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/series/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Series API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.series || [];
}

export async function fetchWatchlistSeriesFromApi(
  userId: string
): Promise<UserSerie[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/series/watchlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Series watchlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.series || [];
}

export async function fetchBaseSeriesFromApi(): Promise<BaseSerie[]> {
  const response = await fetch(`${getApiBaseUrl()}/series/entities`);
  if (!response.ok) {
    throw new Error('Series entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.series || [];
}

export type OtherUserSerieRating = {
  title: string;
  director: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersSeriesRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserSerieRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/series/others-users-series-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Series others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.series || [];
}