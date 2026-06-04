import { isOfflineModeBlockingOtherUsers } from './offline-mode.utils';

/** À appeler au début de `loadRecommendations` dans les vues collections. */
export function shouldBlockRecommendationsOffline(): boolean {
  return isOfflineModeBlockingOtherUsers();
}
