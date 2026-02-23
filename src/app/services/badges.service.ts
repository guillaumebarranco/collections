import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import type { UserBadgeIds, UserBadgesByUser } from '../models/badge-model';
import { getLocalBadgesByUser } from '../facades/badges/local-badges.facade';
import { fetchUserBadgesFromApi } from '../facades/badges/api-badges.facade';
import { isLocalhost } from '../core/config';

const STORAGE_KEY = 'makya_user_badges';

@Injectable({
  providedIn: 'root',
})
export class BadgesService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire par userId (exposé pour réactivité, utilisé hors localhost). */
  readonly cache = signal<UserBadgesByUser>({});

  /** Récupère les ids de badges débloqués pour un utilisateur. En local : données du fichier ; sinon : cache ou localStorage. */
  getBadges(userId: string): UserBadgeIds {
    if (isLocalhost()) {
      return getLocalBadgesByUser(userId);
    }
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

  /** Charge le cache depuis le localStorage (hors localhost). */
  loadFromStorage(): void {
    if (isLocalhost()) return;
    const stored = this.storage.getItem<UserBadgesByUser>(STORAGE_KEY);
    this.cache.set(stored ?? {});
  }

  /**
   * En local : ne fait rien (les badges viennent de users-badges.ts).
   * Hors local : charge les badges depuis l'API et met à jour le cache.
   */
  async loadFromApi(userId: string): Promise<void> {
    if (!userId) return;
    if (isLocalhost()) return;
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
