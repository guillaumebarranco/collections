import { getApiBaseUrl } from '../../core/config';
import { BaseBd, UserBd } from '../../models/bd-model';

export async function fetchUserBdsFromApi(userId: string): Promise<UserBd[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/bds/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Bds API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}

export async function fetchReadlistBdsFromApi(
  userId: string
): Promise<UserBd[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/bds/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Bds readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserBdsFromApi(
  userId: string
): Promise<import('../../models/bd-model').Bd[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/bds/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Bds merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistBdsFromApi(
  userId: string
): Promise<import('../../models/bd-model').Bd[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/bds/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Bds readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseBdsFromApi(): Promise<BaseBd[]> {
  const response = await fetch(`${getApiBaseUrl()}/bds/entities`);
  if (!response.ok) {
    throw new Error('Bds entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseBdsLightFromApi(): Promise<
  import('../../models/entity-light.model').LightBd[]
> {
  const response = await fetch(`${getApiBaseUrl()}/bds/entities/light`);
  if (!response.ok) {
    throw new Error('Bds entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}

export type OtherUserBdRating = {
  title: string;
  writer: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersBdsRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserBdRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/bds/others-users-bds-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Bds others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}