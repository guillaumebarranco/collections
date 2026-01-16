export function isLocalhost(): boolean {
  return document.location.origin.includes('localhost');
}

export function getApiBaseUrl(): string {
  if (isLocalhost()) {
    return 'http://localhost:3001/api';
  }
  return `${document.location.origin}/api`;
}

export const DEFAULT_USER_IDS = [
  'guillaume',
  'william',
  'kevin',
  'amandine',
  'ronan',
];
