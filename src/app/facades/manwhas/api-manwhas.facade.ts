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

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserManwhasFromApi(
  userId: string
): Promise<import('../../models/manwha-model').Manwha[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/manwhas/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Manwhas merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistManwhasFromApi(
  userId: string
): Promise<import('../../models/manwha-model').Manwha[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/manwhas/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Manwhas readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseManwhasFromApi(): Promise<BaseManwha[]> {
  const response = await fetch(`${getApiBaseUrl()}/manwhas/entities`);
  if (!response.ok) {
    throw new Error('Manwhas entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseManwhasLightFromApi(): Promise<
  import('../../models/entity-light.model').LightManwha[]
> {
  const response = await fetch(`${getApiBaseUrl()}/manwhas/entities/light`);
  if (!response.ok) {
    throw new Error('Manwhas entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}

export type OtherUserManwhaRating = {
  title: string;
  author: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersManwhasRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserManwhaRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/manwhas/others-users-manwhas-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Manwhas others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.manwhas || [];
}