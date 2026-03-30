import { getApiBaseUrl } from '../../core/config';
import type { ProfileBadgeResponse } from '../../models/badge-model';

export async function fetchProfileBadgeFromApi(
  userId: string
): Promise<string | null> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/profile-badge`
  );
  if (!response.ok) {
    throw new Error('Profile badge API error');
  }
  const data = (await response.json()) as ProfileBadgeResponse;
  if (data?.badgeId === null || data?.badgeId === undefined) {
    return null;
  }
  return typeof data.badgeId === 'string' ? data.badgeId : null;
}

export async function saveProfileBadgeToApi(
  userId: string,
  badgeId: string | null
): Promise<void> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/profile-badge`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badgeId }),
    }
  );
  if (!response.ok) {
    throw new Error('Profile badge save API error');
  }
}
