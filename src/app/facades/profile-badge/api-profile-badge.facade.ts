import { getApiBaseUrl } from '../../core/config';
import type { ProfileBadgeResponse } from '../../models/badge-model';

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const j = JSON.parse(text) as { error?: string };
    if (j?.error && typeof j.error === 'string') {
      return j.error;
    }
  } catch {
    /* ignore */
  }
  if (text) return text.slice(0, 200);
  return `HTTP ${response.status}`;
}

export async function fetchProfileBadgeFromApi(
  userId: string
): Promise<string | null> {
  const url = `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/profile-badge`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Réseau indisponible';
    throw new Error(
      `API badge de profil inaccessible (${msg}). Le serveur Makya tourne-t-il sur le port 3001 ?`
    );
  }
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  const data = (await response.json()) as ProfileBadgeResponse;
  if (data?.badgeId === null || data?.badgeId === undefined) {
    return null;
  }
  return typeof data.badgeId === 'string' ? data.badgeId : null;
}

export async function saveProfileBadgeToApi(
  userId: string,
  badgeId: string | null
): Promise<void> {
  const url = `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/profile-badge`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badgeId }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Réseau indisponible';
    throw new Error(
      `API badge de profil inaccessible (${msg}). Démarrez le serveur : port 3001.`
    );
  }
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}
