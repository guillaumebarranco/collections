import { getApiBaseUrl } from '../../core/config';

export async function getUsersListFromApi(): Promise<string[]> {
  const response = await fetch(`${getApiBaseUrl()}/users/list`);
  if (!response.ok) {
    throw new Error('Users list API error');
  }
  const data = await response.json();
  return Array.isArray(data?.users) ? data.users : [];
}

export async function getFollowsFromApi(userId: string): Promise<string[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/follows`
  );
  if (!response.ok) {
    throw new Error('Follows API error');
  }
  const data = await response.json();
  return Array.isArray(data?.follows) ? data.follows : [];
}

export async function addFollowToApi(
  userId: string,
  followUserId: string
): Promise<string[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/follows`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followUserId: followUserId.trim().toLowerCase() }),
    }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error ?? 'Add follow API error');
  }
  const data = await response.json();
  return Array.isArray(data?.follows) ? data.follows : [];
}

export async function removeFollowFromApi(
  userId: string,
  followUserId: string
): Promise<string[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/follows/${encodeURIComponent(followUserId.trim().toLowerCase())}`,
    { method: 'DELETE' }
  );
  if (!response.ok) {
    throw new Error('Remove follow API error');
  }
  const data = await response.json();
  return Array.isArray(data?.follows) ? data.follows : [];
}
