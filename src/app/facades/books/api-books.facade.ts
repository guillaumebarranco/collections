import { getApiBaseUrl } from '../../core/config';
import { BaseBook, UserBook } from '../../models/book-model';

export async function fetchUserBooksFromApi(
  userId: string
): Promise<UserBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/books/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Books API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.books || [];
}

export async function fetchReadlistBooksFromApi(
  userId: string
): Promise<UserBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/books/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Books readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.books || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserBooksFromApi(
  userId: string
): Promise<import('../../models/book-model').Book[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/books/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Books merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistBooksFromApi(
  userId: string
): Promise<import('../../models/book-model').Book[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/books/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Books readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseBooksFromApi(): Promise<BaseBook[]> {
  const response = await fetch(`${getApiBaseUrl()}/books/entities`);
  if (!response.ok) {
    throw new Error('Books entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.books || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseBooksLightFromApi(): Promise<
  import('../../models/entity-light.model').LightBook[]
> {
  const response = await fetch(`${getApiBaseUrl()}/books/entities/light`);
  if (!response.ok) {
    throw new Error('Books entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.books || [];
}

export type OtherUserBookRating = {
  title: string;
  author: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersBooksRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserBookRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/books/others-users-books-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Books others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.books || [];
}