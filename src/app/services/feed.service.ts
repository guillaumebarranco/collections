import { Injectable, signal } from '@angular/core';
import { getFeedFromApi } from '../facades/feed/feed.facade';
import type { FeedResponse } from '../models/feed-model';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  /** Cache: userId -> feed (données des utilisateurs suivis). */
  readonly cache = signal<Record<string, FeedResponse>>({});

  getFeed(userId: string): FeedResponse {
    const all = this.cache();
    return all[userId] ?? { feed: [] };
  }

  async loadFromApi(userId: string): Promise<FeedResponse> {
    if (!userId) return { feed: [] };
    try {
      const data = await getFeedFromApi(userId);
      this.cache.update((prev) => ({ ...prev, [userId]: data }));
      return data;
    } catch {
      return { feed: [] };
    }
  }
}
