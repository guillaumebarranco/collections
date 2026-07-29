const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const REQUESTS_FILE = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entity-add-requests',
  'entity-add-requests.json'
);

const ALLOWED_TYPES = new Set([
  'movie',
  'serie',
  'book',
  'children-book',
  'manga',
  'manwha',
  'comic',
  'bd',
  'game',
]);

const SECONDARY_FIELD_BY_TYPE: Record<string, string> = {
  movie: 'director',
  serie: 'director',
  book: 'author',
  'children-book': 'author',
  manga: 'author',
  manwha: 'author',
  comic: 'writer',
  bd: 'writer',
  game: 'editor',
};

function loadRequests(): any[] {
  if (!fs.existsSync(REQUESTS_FILE)) {
    return [];
  }
  try {
    const content = fs.readFileSync(REQUESTS_FILE, 'utf8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveRequests(requests: any[]): void {
  const dir = path.dirname(REQUESTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2), 'utf8');
}

function getEntityAddRequests(): any[] {
  return loadRequests();
}

function addEntityAddRequest(payload: {
  entityType: string;
  title: string;
  secondaryKey: string;
  requestedBy: string;
}): any {
  const entityType = String(payload.entityType || '').trim();
  const title = String(payload.title || '').trim();
  const secondaryKey = String(payload.secondaryKey || '').trim();
  const requestedBy = String(payload.requestedBy || '')
    .trim()
    .toLowerCase();

  if (!ALLOWED_TYPES.has(entityType)) {
    throw new Error('Invalid entityType');
  }
  if (!title) {
    throw new Error('Missing title');
  }
  if (!secondaryKey) {
    throw new Error('Missing secondaryKey');
  }
  if (!requestedBy) {
    throw new Error('Missing requestedBy');
  }

  const request = {
    id: crypto.randomUUID(),
    entityType,
    title,
    secondaryKey,
    secondaryKeyField: SECONDARY_FIELD_BY_TYPE[entityType],
    requestedBy,
    requestedAt: new Date().toISOString(),
  };

  const requests = loadRequests();
  requests.push(request);
  saveRequests(requests);
  return request;
}

function clearEntityAddRequests(): number {
  const previous = loadRequests();
  saveRequests([]);
  return previous.length;
}

module.exports = {
  getEntityAddRequests,
  addEntityAddRequest,
  clearEntityAddRequests,
};

export {};
