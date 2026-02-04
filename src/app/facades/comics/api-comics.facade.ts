import { getApiBaseUrl } from '../../core/config';
import { BaseComic, UserComic } from '../../models/comic-model';

export async function fetchUserComicsFromApi(
  userId: string
): Promise<UserComic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Comics API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

export async function fetchReadlistComicsFromApi(
  userId: string
): Promise<UserComic[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/comics/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Comics readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

export async function fetchBaseComicsFromApi(): Promise<BaseComic[]> {
  const response = await fetch(`${getApiBaseUrl()}/comics/entities`);
  if (!response.ok) {
    throw new Error('Comics entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}

export type OtherUserComicRating = {
  title: string;
  writer: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersComicsRatedFromApi(
  userId: string,
  minRating = 4
): Promise<OtherUserComicRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  const response = await fetch(
    `${getApiBaseUrl()}/comics/others-users-comics-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Comics others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.comics || [];
}