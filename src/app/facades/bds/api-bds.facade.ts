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

export async function fetchBaseBdsFromApi(): Promise<BaseBd[]> {
  const response = await fetch(`${getApiBaseUrl()}/bds/entities`);
  if (!response.ok) {
    throw new Error('Bds entities API error');
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
  minRating = 4
): Promise<OtherUserBdRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  const response = await fetch(
    `${getApiBaseUrl()}/bds/others-users-bds-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Bds others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.bds || [];
}