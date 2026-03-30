import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {
  fetchProfileBadgeFromApi,
  saveProfileBadgeToApi,
} from '../facades/profile-badge/api-profile-badge.facade';
import { getLocalProfileBadge } from '../facades/profile-badge/local-profile-badge.facade';
import { isLocalhost } from '../core/config';

const STORAGE_KEY = 'makya_profile_badge';

export type UserProfileBadgeMap = Record<string, string | null>;

/**
 * Badge affiché comme avatar : persistance sur le serveur dans
 * `src/app/utils/users/<userId>/profile-badge.json` (écrit par PUT /api/users/.../profile-badge).
 * Le localStorage n’est qu’un cache après succès API pour affichage hors-ligne / perf.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileBadgeService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire : userId → id du badge affiché en avatar (ou null). */
  readonly cache = signal<UserProfileBadgeMap>({});

  getProfileBadgeId(userId: string): string | null {
    const id = userId.trim().toLowerCase();
    if (!id) return null;
    const all = this.cache();
    if (Object.prototype.hasOwnProperty.call(all, id)) {
      return all[id] ?? null;
    }
    const stored = this.storage.getItem<UserProfileBadgeMap>(STORAGE_KEY);
    if (stored && Object.prototype.hasOwnProperty.call(stored, id)) {
      return stored[id] ?? null;
    }
    return null;
  }

  /**
   * Enregistre d’abord sur le serveur (fichier), puis met à jour cache + localStorage.
   * À utiliser après une action utilisateur ; en cas d’échec réseau, rien n’est persisté localement seul.
   */
  async saveProfileBadge(userId: string, badgeId: string | null): Promise<void> {
    const id = userId.trim().toLowerCase();
    if (!id) return;
    await saveProfileBadgeToApi(id, badgeId);
    this.applyToCacheAndStorage(id, badgeId);
  }

  private applyToCacheAndStorage(userId: string, badgeId: string | null): void {
    const all = { ...this.cache() };
    all[userId] = badgeId;
    this.cache.set(all);
    this.storage.setItem(STORAGE_KEY, all);
  }

  loadFromStorage(): void {
    const stored = this.storage.getItem<UserProfileBadgeMap>(STORAGE_KEY);
    this.cache.set(stored ?? {});
  }

  async loadFromApi(userId: string): Promise<void> {
    const id = userId.trim().toLowerCase();
    if (!id) return;
    try {
      const badgeId = await fetchProfileBadgeFromApi(id);
      this.applyToCacheAndStorage(id, badgeId);
    } catch {
      if (isLocalhost()) {
        const local = getLocalProfileBadge(id);
        if (local !== undefined) {
          this.applyToCacheAndStorage(id, local);
        }
      }
      // Sinon : conserve le cache (localStorage) — pas de synchro serveur
    }
  }
}
