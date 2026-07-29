import { getApiBaseUrl } from '../../core/config';
import { BaseChildrenBook, UserChildrenBook } from '../../models/children-book-model';

export async function fetchUserChildrenBooksFromApi(
  userId: string
): Promise<UserChildrenBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Children books API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data['children-books'] || [];
}

export async function fetchReadlistChildrenBooksFromApi(
  userId: string
): Promise<UserChildrenBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/readlist/${encodeURIComponent(userId)}`
  );
  if (!response.ok) {
    throw new Error('Children books readlist API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data['children-books'] || [];
}

/** Collection user déjà fusionnée (sans télécharger /entities côté client). */
export async function fetchMergedUserChildrenBooksFromApi(
  userId: string
): Promise<import('../../models/children-book-model').ChildrenBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Children books merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMergedReadlistChildrenBooksFromApi(
  userId: string
): Promise<import('../../models/children-book-model').ChildrenBook[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/readlist/${encodeURIComponent(userId)}/merged`
  );
  if (!response.ok) {
    throw new Error('Children books readlist merged API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchBaseChildrenBooksFromApi(): Promise<BaseChildrenBook[]> {
  const response = await fetch(`${getApiBaseUrl()}/children-books/entities`);
  if (!response.ok) {
    throw new Error('Children books entities API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data['children-books'] || [];
}

/** Catalogue allégé pour les pages select. */
export async function fetchBaseChildrenBooksLightFromApi(): Promise<
  import('../../models/entity-light.model').LightBook[]
> {
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/entities/light`
  );
  if (!response.ok) {
    throw new Error('Children books entities light API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data['children-books'] || [];
}

export type OtherUserChildrenBookRating = {
  title: string;
  author: string;
  rating: number;
  userId: string;
};

export async function fetchOtherUsersChildrenBooksRatedFromApi(
  userId: string,
  minRating = 4,
  followedUserIds: string[] = []
): Promise<OtherUserChildrenBookRating[]> {
  const params = new URLSearchParams({
    userId,
    minRating: String(minRating),
  });
  if (followedUserIds.length > 0) {
    params.set('followedUserIds', followedUserIds.join(','));
  }
  const response = await fetch(
    `${getApiBaseUrl()}/children-books/others-users-children-books-rated?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error('Children books others-rated API error');
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data['children-books'] || [];
}