import { Injectable, signal } from '@angular/core';
import {
  getFollowsFromApi,
  addFollowToApi,
  removeFollowFromApi,
} from '../facades/follows/follows.facade';

@Injectable({
  providedIn: 'root',
})
export class FollowsService {
  /** Cache: userId -> liste des usernames suivis */
  readonly cache = signal<Record<string, string[]>>({});

  getFollows(userId: string): string[] {
    const all = this.cache();
    return all[userId] ?? [];
  }

  async loadFromApi(userId: string): Promise<string[]> {
    const list = await getFollowsFromApi(userId);
    this.cache.update((prev) => ({ ...prev, [userId]: list }));
    return list;
  }

  async addFollow(userId: string, followUserId: string): Promise<string[]> {
    const list = await addFollowToApi(userId, followUserId);
    this.cache.update((prev) => ({ ...prev, [userId]: list }));
    return list;
  }

  async removeFollow(userId: string, followUserId: string): Promise<string[]> {
    const list = await removeFollowFromApi(userId, followUserId);
    this.cache.update((prev) => ({ ...prev, [userId]: list }));
    return list;
  }
}
