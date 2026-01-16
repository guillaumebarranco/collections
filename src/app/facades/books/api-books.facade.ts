import { getApiBaseUrl } from '../../core/config';
import { UserBook } from '../../models/book-model';

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
