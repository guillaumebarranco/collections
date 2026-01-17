import { getApiBaseUrl } from '../../core/config';
import { UserManwha } from '../../models/manwha-model';

export async function fetchUserManwhasFromApi(
  userId: string
): Promise<UserManwha[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/manwhas/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Manwhas API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}
