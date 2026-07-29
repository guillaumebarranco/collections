import { getApiBaseUrl } from '../../core/config';
import type {
  EntityAddRequest,
  EntityAddRequestType,
} from '../../models/entity-add-request.model';

export async function createEntityAddRequest(payload: {
  entityType: EntityAddRequestType;
  title: string;
  secondaryKey: string;
  requestedBy: string;
}): Promise<EntityAddRequest> {
  const response = await fetch(`${getApiBaseUrl()}/entity-add-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === 'string' ? data.error : 'Erreur lors de la demande'
    );
  }
  return data.request as EntityAddRequest;
}

export async function getEntityAddRequests(
  adminUserId: string
): Promise<EntityAddRequest[]> {
  const response = await fetch(
    `${getApiBaseUrl()}/entity-add-requests?userId=${encodeURIComponent(adminUserId)}`
  );
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return Array.isArray(data?.requests) ? data.requests : [];
}

export async function clearEntityAddRequests(
  adminUserId: string
): Promise<number> {
  const response = await fetch(
    `${getApiBaseUrl()}/entity-add-requests?userId=${encodeURIComponent(adminUserId)}`,
    { method: 'DELETE' }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      typeof data?.error === 'string' ? data.error : 'Erreur lors du vidage'
    );
  }
  return Number(data?.cleared ?? 0);
}
