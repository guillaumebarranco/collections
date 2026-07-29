import { getApiBaseUrl } from '../../core/config';
import type { DashboardOverview } from '../../models/dashboard-overview.model';
import { getActiveOfflineCache } from '../../core/offline/offline-entity-access';

export async function fetchDashboardOverviewFromApi(
  userId: string
): Promise<DashboardOverview> {
  const response = await fetch(
    `${getApiBaseUrl()}/dashboard/${encodeURIComponent(userId)}/overview`
  );
  if (!response.ok) {
    throw new Error('Dashboard overview API error');
  }
  return response.json();
}

/**
 * Vue d'ensemble légère. En mode offline, retourne null pour basculer
 * sur le chargement local via les facades classiques.
 */
export async function getDashboardOverview(
  userId: string
): Promise<DashboardOverview | null> {
  if (getActiveOfflineCache()) {
    return null;
  }
  try {
    return await fetchDashboardOverviewFromApi(userId);
  } catch {
    return null;
  }
}
