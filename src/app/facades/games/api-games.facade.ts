import { getApiBaseUrl } from '../../core/config';
import { UserGame } from '../../models/game-model';

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
