import { getApiBaseUrl } from '../../core/config';
import type { FeedResponse } from '../../models/feed-model';

/**
 * Récupère le feed (films/livres/séries récents des utilisateurs suivis) depuis l'API.
 * Les données sont limitées au dernier mois et à 5 éléments max par catégorie et par utilisateur.
 */
export async function getFeedFromApi(
  userId: string
): Promise<FeedResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/feed`
  );
  if (!response.ok) {
    throw new Error('Feed API error');
  }
  const data = await response.json();
  if (!data?.feed || !Array.isArray(data.feed)) {
    return { feed: [] };
  }
  return data as FeedResponse;
}
