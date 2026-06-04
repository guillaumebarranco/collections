import type { OfflineCachePayload } from './offline-cache.model';
import { readOfflineCachePayload } from './offline-mode.storage';
import { isOfflineDataMode } from './offline-mode.utils';

export function getActiveOfflineCache(): OfflineCachePayload | null {
  if (!isOfflineDataMode()) return null;
  return readOfflineCachePayload();
}

export function canServeOfflineUser(requestedUserId: string): boolean {
  const cache = getActiveOfflineCache();
  if (!cache) return false;
  return cache.userId.toLowerCase() === requestedUserId.trim().toLowerCase();
}
