import { getApiBaseUrl } from '../../core/config';
import { BaseManwha, UserManwha } from '../../models/manwha-model';

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

export async function fetchReadlistManwhasFromApi(
  userId: string
): Promise<UserManwha[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/manwhas/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Manwhas readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}

export async function fetchBaseManwhasFromApi(): Promise<BaseManwha[]> {
  const response = await fetch(`${getApiBaseUrl()}/manwhas/entities`);
  if (!response.ok) {
    throw new Error('Manwhas entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}
