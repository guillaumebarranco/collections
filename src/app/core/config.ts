export function isLocalhost(): boolean {
  // return document.location.origin.includes('localhost');
  return false;
}

export function getApiBaseUrl(): string {
  // if (isLocalhost()) {
  return 'http://localhost:3001/api';
  // }
  // return `${document.location.origin}/api`;
}

export function isBaseEntityView(): boolean {
  return document.location.pathname.includes('/admin');
}
