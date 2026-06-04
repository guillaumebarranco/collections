import type { OfflineCachePayload, OfflinePrefs } from './offline-cache.model';
import {
  OFFLINE_CACHE_STORAGE_KEY,
  OFFLINE_PREFS_STORAGE_KEY,
} from './offline-mode.constants';

const DEFAULT_PREFS: OfflinePrefs = {
  cacheEnabled: false,
  offlineModeActive: false,
  lastSavedAt: null,
  cacheUserId: null,
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function readOfflinePrefs(): OfflinePrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_PREFS };
  const parsed = safeParse<OfflinePrefs>(
    localStorage.getItem(OFFLINE_PREFS_STORAGE_KEY)
  );
  if (!parsed) return { ...DEFAULT_PREFS };
  return {
    cacheEnabled: Boolean(parsed.cacheEnabled),
    offlineModeActive: Boolean(parsed.offlineModeActive),
    lastSavedAt:
      typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : null,
    cacheUserId:
      typeof parsed.cacheUserId === 'string' ? parsed.cacheUserId : null,
  };
}

export function writeOfflinePrefs(prefs: OfflinePrefs): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_PREFS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // quota, mode privé, etc.
  }
}

export function readOfflineCachePayload(): OfflineCachePayload | null {
  if (typeof window === 'undefined') return null;
  return safeParse<OfflineCachePayload>(
    localStorage.getItem(OFFLINE_CACHE_STORAGE_KEY)
  );
}

export function writeOfflineCachePayload(payload: OfflineCachePayload): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // quota, mode privé, etc.
  }
}

export function clearOfflineCachePayload(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OFFLINE_CACHE_STORAGE_KEY);
  } catch {
    // ignore
  }
}
