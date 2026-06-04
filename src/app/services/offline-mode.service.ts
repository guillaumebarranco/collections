import { Injectable, computed, inject, signal } from '@angular/core';
import { isLocalhost } from '../core/config';
import type {
  OfflineCachePayload,
  OfflinePrefs,
} from '../core/offline/offline-cache.model';
import { fetchOfflineCachePayload } from '../core/offline/offline-data.sync';
import { OFFLINE_AUTO_SYNC_MAX_AGE_MS } from '../core/offline/offline-mode.constants';
import {
  clearOfflineCachePayload,
  readOfflinePrefs,
  writeOfflineCachePayload,
  writeOfflinePrefs,
} from '../core/offline/offline-mode.storage';
import {
  isOfflineCacheEnabled,
  isOfflineDataMode,
  isOfflineModeBlockingOtherUsers,
} from '../core/offline/offline-mode.utils';
import { LocalStorageService } from './local-storage.service';
import { TopFiveService } from './top-five.service';

const TOP_FIVE_STORAGE_KEY = 'makya_top_five';

@Injectable({ providedIn: 'root' })
export class OfflineModeService {
  private readonly topFiveService = inject(TopFiveService);
  private readonly storage = inject(LocalStorageService);

  private readonly prefsState = signal<OfflinePrefs>(readOfflinePrefs());

  readonly cacheEnabled = computed(() => this.prefsState().cacheEnabled);
  readonly offlineModeActive = computed(
    () => this.prefsState().offlineModeActive
  );
  readonly lastSavedAt = computed(() => this.prefsState().lastSavedAt);
  readonly cacheUserId = computed(() => this.prefsState().cacheUserId);

  readonly isSyncing = signal(false);
  readonly lastSyncError = signal<string | null>(null);
  readonly lastSyncSuccessAt = signal<string | null>(null);

  isOfflineDataMode(): boolean {
    return isOfflineDataMode();
  }

  isBlockingOtherUsers(): boolean {
    return isOfflineModeBlockingOtherUsers();
  }

  isCacheEnabled(): boolean {
    return isOfflineCacheEnabled();
  }

  setCacheEnabled(enabled: boolean, userId: string | null): void {
    const next: OfflinePrefs = {
      ...this.prefsState(),
      cacheEnabled: enabled,
    };
    this.persistPrefs(next);
    if (enabled && userId && !isLocalhost()) {
      void this.syncOfflineData(userId);
    }
    if (!enabled) {
      clearOfflineCachePayload();
      const cleared: OfflinePrefs = {
        ...this.prefsState(),
        lastSavedAt: null,
        cacheUserId: null,
      };
      this.persistPrefs(cleared);
    }
  }

  setOfflineModeActive(active: boolean): void {
    const next: OfflinePrefs = {
      ...this.prefsState(),
      offlineModeActive: active,
    };
    this.persistPrefs(next);
  }

  /**
   * Resynchronise si le cache est activé, qu’on n’est pas en mode hors-ligne,
   * et que la dernière sauvegarde date de plus d’un jour.
   */
  maybeRefreshCacheOnDashboardVisit(userId: string): void {
    if (isLocalhost()) return;
    const prefs = this.prefsState();
    if (!prefs.cacheEnabled || prefs.offlineModeActive) return;
    if (!userId) return;

    const last = prefs.lastSavedAt
      ? new Date(prefs.lastSavedAt).getTime()
      : 0;
    if (Date.now() - last < OFFLINE_AUTO_SYNC_MAX_AGE_MS) return;

    void this.syncOfflineData(userId);
  }

  async syncOfflineData(userId: string): Promise<boolean> {
    if (isLocalhost()) return false;
    const normalizedId = userId.trim().toLowerCase();
    if (!normalizedId) return false;

    this.isSyncing.set(true);
    this.lastSyncError.set(null);

    const result = await fetchOfflineCachePayload(normalizedId);
    this.isSyncing.set(false);

    if (!result.ok) {
      this.lastSyncError.set(result.error);
      return false;
    }

    writeOfflineCachePayload(result.payload);
    this.applyTopFiveToLocalStorage(normalizedId, result.payload.topFive);
    this.topFiveService.loadFromStorage();

    const next: OfflinePrefs = {
      ...this.prefsState(),
      lastSavedAt: result.payload.savedAt,
      cacheUserId: normalizedId,
    };
    this.persistPrefs(next);
    this.lastSyncSuccessAt.set(result.payload.savedAt);
    return true;
  }

  reloadPrefsFromStorage(): void {
    this.prefsState.set(readOfflinePrefs());
  }

  private persistPrefs(prefs: OfflinePrefs): void {
    this.prefsState.set(prefs);
    writeOfflinePrefs(prefs);
  }

  private applyTopFiveToLocalStorage(
    userId: string,
    topFive: OfflineCachePayload['topFive']
  ): void {
    const stored =
      this.storage.getItem<Record<string, OfflineCachePayload['topFive']>>(
        TOP_FIVE_STORAGE_KEY
      ) ?? {};
    stored[userId] = topFive;
    this.storage.setItem(TOP_FIVE_STORAGE_KEY, stored);
  }
}
