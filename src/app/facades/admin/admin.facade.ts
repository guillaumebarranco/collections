import { getApiBaseUrl } from '../../core/config';

export type AdminUser = {
  username: string;
};

export type AdminUsersResponse = {
  count: number;
  users: AdminUser[];
};

export async function getAdminUsers(
  userId: string
): Promise<AdminUsersResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/admin/users?userId=${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    return { count: 0, users: [] };
  }
  const payload = await response.json();
  return {
    count: Number(payload?.count ?? 0),
    users: Array.isArray(payload?.users) ? payload.users : [],
  };
}
