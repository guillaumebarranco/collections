import { getApiBaseUrl } from '../../core/config';

export async function getAdminUsersCount(userId: string): Promise<number> {
  const response = await fetch(
    `${getApiBaseUrl()}/admin/users/count?userId=${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    return 0;
  }
  const payload = await response.json();
  return Number(payload?.count ?? 0);
}
