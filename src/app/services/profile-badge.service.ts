import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {
  fetchProfileBadgeFromApi,
  saveProfileBadgeToApi,
} from '../facades/profile-badge/api-profile-badge.facade';

const STORAGE_KEY = 'makya_profile_badge';

export type UserProfileBadgeMap = Record<string, string | null>;

@Injectable({
  providedIn: 'root',
})
export class ProfileBadgeService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire : userId → id du badge affiché en avatar (ou null). */
  readonly cache = signal<UserProfileBadgeMap>({});

  getProfileBadgeId(userId: string): string | null {
    const all = this.cache();
    if (Object.prototype.hasOwnProperty.call(all, userId)) {
      return all[userId] ?? null;
    }
    const stored = this.storage.getItem<UserProfileBadgeMap>(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(stored, userId)) {
      return stored[userId] ?? null;
    }
    return null;
  }

  setProfileBadge(userId: string, badgeId: string | null): void {
    const all = { ...this.cache() };
    all[userId] = badgeId;
    this.cache.set(all);
    this.storage.setItem(STORAGE_KEY, all);
    saveProfileBadgeToApi(userId, badgeId).catch(() => {});
  }

  loadFromStorage(): void {
    const stored = this.storage.getItem<UserProfileBadgeMap>(STORAGE_KEY);
    this.cache.set(stored ?? {});
  }

  async loadFromApi(userId: string): Promise<void> {
    if (!userId) return;
    try {
      const badgeId = await fetchProfileBadgeFromApi(userId);
      const all = { ...this.cache() };
      all[userId] = badgeId;
      this.cache.set(all);
      this.storage.setItem(STORAGE_KEY, all);
    } catch {
      // Conserve le cache localStorage
    }
  }
}
