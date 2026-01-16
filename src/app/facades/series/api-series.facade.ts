import { getApiBaseUrl } from '../../core/config';
import { UserSerie } from '../../models/serie-model';

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
