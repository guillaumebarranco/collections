import { getApiBaseUrl } from '../../core/config';
import { BaseGame, UserGame } from '../../models/game-model';

export async function fetchUserGamesFromApi(
  userId: string
): Promise<UserGame[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/games/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Games API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.games || [];
}

export async function fetchGamelistGamesFromApi(
  userId: string
): Promise<UserGame[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/games/gamelist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Games gamelist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.games || [];
}

export async function fetchBaseGamesFromApi(): Promise<BaseGame[]> {
  const response = await fetch(`${getApiBaseUrl()}/games/entities`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Games entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.games || [];
}

export type OtherUserGameRating = {
  title: string;
  editor: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersGamesRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserGameRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/games/others-users-games-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Games others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.games || [];
}