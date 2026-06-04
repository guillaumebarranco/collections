import { isLocalhost } from '../config';
import { readOfflinePrefs } from './offline-mode.storage';

/** Utilise uniquement le cache localStorage (pas d’appels API collections). */
export function isOfflineDataMode(): boolean {
  if (isLocalhost()) return false;
  return readOfflinePrefs().offlineModeActive;
}

/** Fonctionnalités basées sur les données d’autres utilisateurs (feed, reco, communauté…). */
export function isOfflineModeBlockingOtherUsers(): boolean {
  return isOfflineDataMode();
}

export function isOfflineCacheEnabled(): boolean {
  return readOfflinePrefs().cacheEnabled;
}
