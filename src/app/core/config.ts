/**
 * Environnement dev (ng serve) : localhost, 127.0.0.1 ou ::1.
 * Inclut 127.0.0.1 car `origin.includes('localhost')` est faux pour http://127.0.0.1:4200,
 * ce qui pointait l’API vers le port du front (404).
 */
export function isLocalhost(): boolean {
  if (typeof document === 'undefined') return false;
  const h = document.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
}

export function getApiBaseUrl(): string {
  if (isLocalhost()) {
    const proto = document.location.protocol;
    const host = document.location.hostname;
    return `${proto}//${host}:3001/api`;
  }
  return `${document.location.origin}/api`;
}

export function isBaseEntityView(): boolean {
  return document.location.pathname.includes('/admin');
}
