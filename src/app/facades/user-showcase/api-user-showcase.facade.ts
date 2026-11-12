import { getApiBaseUrl } from '../../core/config';
import {
  normalizeUserShowcase,
  type UserShowcase,
} from '../../models/user-showcase.model';

async function readErrorMessage(response: Response): Promise<string> {
  const text = await response.text();
  try {
    const body = JSON.parse(text) as { error?: string };
    if (body?.error && typeof body.error === 'string') {
      return body.error;
    }
  } catch {
    /* corps non JSON */
  }
  if (text) return text.slice(0, 200);
  return `HTTP ${response.status}`;
}

/** Récupère les 5 œuvres phares d'un utilisateur. */
export async function fetchUserShowcaseFromApi(
  userId: string
): Promise<UserShowcase> {
  const response = await fetch(
    `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/user-showcase`
  );
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return normalizeUserShowcase(await response.json());
}

/** Enregistre les 5 œuvres phares. Le serveur vérifie qu'elles sont dans un top 5. */
export async function saveUserShowcaseToApi(
  userId: string,
  showcase: UserShowcase
): Promise<UserShowcase> {
  let response: Response;
  try {
    response = await fetch(
      `${getApiBaseUrl()}/users/${encodeURIComponent(userId)}/user-showcase`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(showcase),
      }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Réseau indisponible';
    throw new Error(
      `Enregistrement impossible (${msg}). Le serveur Makya est-il démarré ?`
    );
  }
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return normalizeUserShowcase(await response.json());
}
