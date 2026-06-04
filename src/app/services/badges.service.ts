import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { UserBadgeIds, UserBadgesByUser } from '../models/badge-model';
import { fetchUserBadgesFromApi } from '../facades/badges/api-badges.facade';

const STORAGE_KEY = 'makya_user_badges';

@Injectable({
  providedIn: 'root',
})
export class BadgesService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire par userId. */
  readonly cache = signal<UserBadgesByUser>({});

  getBadges(userId: string): UserBadgeIds {
    const all = this.cache();
    if (all[userId]) {
      return all[userId];
    }
    const stored = this.storage.getItem<UserBadgesByUser>(STORAGE_KEY);
    if (stored?.[userId]) {
      return Array.isArray(stored[userId]) ? stored[userId] : [];
    }
    return [];
  }

  loadFromStorage(): void {
    const stored = this.storage.getItem<UserBadgesByUser>(STORAGE_KEY);
    this.cache.set(stored ?? {});
  }

  async loadFromApi(userId: string): Promise<void> {
    if (!userId) return;
    try {
      const data = await fetchUserBadgesFromApi(userId);
      const all = { ...this.cache() };
      all[userId] = Array.isArray(data) ? data : [];
      this.cache.set(all);
      this.storage.setItem(STORAGE_KEY, all);
    } catch {
      // En cas d'erreur, on garde le cache localStorage
    }
  }
}
