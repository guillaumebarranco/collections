import { Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import {
  TopFiveByEntity,
  TopFiveEntityType,
  createEmptyTopFive,
  UserTopFive,
} from '../models/top-five-model';
import {
  fetchTopFiveFromApi,
  saveTopFiveToApi,
} from '../facades/top-five/api-top-five.facade';

const STORAGE_KEY = 'makya_top_five';

@Injectable({
  providedIn: 'root',
})
export class TopFiveService {
  private readonly storage = new LocalStorageService();

  /** Cache en mémoire par userId (exposé pour réactivité dans les composants) */
  readonly cache = signal<UserTopFive>({});

  /** Récupère le Top 5 pour un utilisateur (5 slots par type d'entité) */
  getTopFive(userId: string): TopFiveByEntity {
    const all = this.cache();
    if (all[userId]) {
      return all[userId];
    }
    const stored = this.storage.getItem<UserTopFive>(STORAGE_KEY);
    if (stored?.[userId]) {
      return this.normalize(stored[userId]);
    }
    return createEmptyTopFive();
  }

  /** Définit le rang (1-5) pour une entité. rank 0 ou null = retirer du top 5 */
  setRank(
    userId: string,
    entityType: TopFiveEntityType,
    entityKey: string,
    rank: number | null
  ): void {
    const topFive = { ...this.getTopFive(userId) };
    const slots = [...(topFive[entityType] ?? ['', '', '', '', ''])];

    // Retirer l'entité de son ancien slot si déjà présente
    const prevIndex = slots.findIndex((k) => k === entityKey);
    if (prevIndex !== -1) {
      slots[prevIndex] = '';
    }

    if (rank !== null && rank >= 1 && rank <= 5) {
      const index = rank - 1;
      slots[index] = entityKey;
    }

    topFive[entityType] = slots;
    this.saveUserTopFive(userId, topFive);
  }

  /** Retourne le rang (1-5) d'une entité ou null si pas dans le top 5 */
  getRank(
    userId: string,
    entityType: TopFiveEntityType,
    entityKey: string
  ): number | null {
    const slots = this.getTopFive(userId)[entityType] ?? [];
    const index = slots.indexOf(entityKey);
    if (index === -1) return null;
    return index + 1;
  }

  /** Charge le cache depuis le localStorage (à appeler au démarrage ou après navigation) */
  loadFromStorage(): void {
    const stored = this.storage.getItem<UserTopFive>(STORAGE_KEY);
    this.cache.set(stored ?? {});
  }

  /**
   * Charge le Top 5 d'un utilisateur depuis l'API et met à jour le cache.
   * À appeler au chargement du dashboard (ou après navigation) pour synchroniser avec le serveur.
   */
  async loadFromApi(userId: string): Promise<void> {
    if (!userId) return;
    try {
      const data = await fetchTopFiveFromApi(userId);
      const all = { ...this.cache() };
      all[userId] = this.normalize(data);
      this.cache.set(all);
      this.storage.setItem(STORAGE_KEY, all);
    } catch {
      // En cas d'erreur (réseau, API indisponible), on garde le cache localStorage
    }
  }

  private normalize(data: TopFiveByEntity): TopFiveByEntity {
    const result = createEmptyTopFive();
    (Object.keys(result) as TopFiveEntityType[]).forEach((type) => {
      const arr = data[type];
      if (Array.isArray(arr)) {
        result[type] = [
          arr[0] ?? '',
          arr[1] ?? '',
          arr[2] ?? '',
          arr[3] ?? '',
          arr[4] ?? '',
        ];
      }
    });
    return result;
  }

  private saveUserTopFive(userId: string, topFive: TopFiveByEntity): void {
    const normalized = this.normalize(topFive);
    const all = { ...this.cache() };
    all[userId] = normalized;
    this.cache.set(all);
    this.storage.setItem(STORAGE_KEY, all);
    saveTopFiveToApi(userId, normalized).catch(() => {
      // Persistance API en arrière-plan ; en cas d'échec, les données restent en localStorage
    });
  }
}
