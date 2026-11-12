import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {
  createEmptyUserShowcase,
  normalizeUserShowcase,
  type UserShowcase,
} from '../models/user-showcase.model';
import {
  fetchUserShowcaseFromApi,
  saveUserShowcaseToApi,
} from '../facades/user-showcase/api-user-showcase.facade';

const STORAGE_KEY = 'makya_user_showcase';

type UserShowcaseMap = Record<string, UserShowcase>;

/**
 * Œuvres phares du tableau de bord : 5 emplacements par utilisateur.
 * Fichier serveur `src/app/utils/users/<userId>/user-showcase.json`.
 * Le localStorage sert de cache après une lecture ou un enregistrement réussi.
 */
@Injectable({
  providedIn: 'root',
})
export class UserShowcaseService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire par userId (lu par les computed du dashboard). */
  readonly cache = signal<UserShowcaseMap>({});

  getShowcase(userId: string): UserShowcase {
    const id = userId.trim().toLowerCase();
    if (!id) return createEmptyUserShowcase();
    const all = this.cache();
    if (all[id]) return all[id];
    const stored = this.storage.getItem<UserShowcaseMap>(STORAGE_KEY);
    if (stored?.[id]) return normalizeUserShowcase(stored[id]);
    return createEmptyUserShowcase();
  }

  /** Écrit d'abord sur le serveur, puis met à jour le cache. */
  async saveShowcase(userId: string, showcase: UserShowcase): Promise<void> {
    const id = userId.trim().toLowerCase();
    if (!id) return;
    const saved = await saveUserShowcaseToApi(id, normalizeUserShowcase(showcase));
    this.applyToCacheAndStorage(id, saved);
  }

  loadFromStorage(): void {
    const stored = this.storage.getItem<UserShowcaseMap>(STORAGE_KEY) ?? {};
    const normalized: UserShowcaseMap = {};
    for (const [userId, showcase] of Object.entries(stored)) {
      normalized[userId] = normalizeUserShowcase(showcase);
    }
    this.cache.set(normalized);
  }

  async loadFromApi(userId: string): Promise<void> {
    const id = userId.trim().toLowerCase();
    if (!id) return;
    try {
      const showcase = await fetchUserShowcaseFromApi(id);
      this.applyToCacheAndStorage(id, showcase);
    } catch {
      // Conserve le cache local si l'API est indisponible.
    }
  }

  private applyToCacheAndStorage(userId: string, showcase: UserShowcase): void {
    const all = { ...this.cache() };
    all[userId] = showcase;
    this.cache.set(all);
    this.storage.setItem(STORAGE_KEY, all);
  }
}
