const fs = require('fs');
const path = require('path');

const USERS_ROOT_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);

const SLOT_COUNT = 5;

const ENTITY_TYPES = [
  'books',
  'children-books',
  'movies',
  'series',
  'animes',
  'games',
  'musics',
  'comics',
  'bds',
  'mangas',
  'manwhas',
];

function validationError(message: string): Error {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = 400;
  return error;
}

function createEmptyShowcase(): { slots: Array<null> } {
  return { slots: Array.from({ length: SLOT_COUNT }, () => null) };
}

function getShowcaseFilePath(userId: string): string {
  return path.join(USERS_ROOT_DIR, userId, 'user-showcase.json');
}

function getTopFiveFilePath(userId: string): string {
  return path.join(USERS_ROOT_DIR, userId, 'top-five.json');
}

function readTopFiveRaw(userId: string): Record<string, unknown> {
  const filePath = getTopFiveFilePath(userId);
  if (!fs.existsSync(filePath)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function sanitizeCoverUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().slice(0, 500);
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

function normalizeStoredSlot(raw: unknown): {
  entityType: string;
  key: string;
  title: string;
  coverUrl: string;
} | null {
  if (!raw || typeof raw !== 'object') return null;
  const slot = raw as {
    entityType?: unknown;
    key?: unknown;
    title?: unknown;
    coverUrl?: unknown;
  };
  if (typeof slot.entityType !== 'string' || !ENTITY_TYPES.includes(slot.entityType)) {
    return null;
  }
  if (typeof slot.key !== 'string' || !slot.key.trim()) return null;
  return {
    entityType: slot.entityType,
    key: slot.key.trim().slice(0, 500),
    title: typeof slot.title === 'string' ? slot.title.trim().slice(0, 300) : '',
    coverUrl: sanitizeCoverUrl(slot.coverUrl),
  };
}

function getUserShowcase(userId: string): {
  slots: Array<{
    entityType: string;
    key: string;
    title: string;
    coverUrl: string;
  } | null>;
} {
  const filePath = getShowcaseFilePath(userId);
  if (!fs.existsSync(filePath)) return createEmptyShowcase();
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const slotsIn = Array.isArray(data?.slots) ? data.slots : [];
    const slots: Array<{
      entityType: string;
      key: string;
      title: string;
      coverUrl: string;
    } | null> = [];
    for (let i = 0; i < SLOT_COUNT; i++) {
      slots.push(normalizeStoredSlot(slotsIn[i]));
    }
    return { slots };
  } catch {
    return createEmptyShowcase();
  }
}

function assertSlotInTopFive(
  topFive: Record<string, unknown>,
  entityType: string,
  key: string
): void {
  const pool = topFive[entityType];
  if (!Array.isArray(pool) || !pool.includes(key)) {
    throw validationError(
      'Chaque œuvre doit déjà figurer dans le top 5 d’une collection'
    );
  }
}

function normalizeShowcaseForSave(
  body: unknown,
  userId: string
): {
  slots: Array<{
    entityType: string;
    key: string;
    title: string;
    coverUrl: string;
  } | null>;
} {
  if (!body || typeof body !== 'object' || !Array.isArray((body as { slots?: unknown }).slots)) {
    throw validationError('Cinq emplacements sont attendus');
  }
  const slotsIn = (body as { slots: unknown[] }).slots;
  if (slotsIn.length !== SLOT_COUNT) {
    throw validationError('Cinq emplacements sont attendus');
  }
  const topFive = readTopFiveRaw(userId);
  const seen = new Set<string>();
  const slots = slotsIn.map((raw) => {
    if (raw === null || raw === undefined) return null;
    const slot = normalizeStoredSlot(raw);
    if (!slot) {
      throw validationError('Œuvre invalide');
    }
    assertSlotInTopFive(topFive, slot.entityType, slot.key);
    const id = `${slot.entityType}::${slot.key}`;
    if (seen.has(id)) {
      throw validationError('Une œuvre ne peut occuper qu’un seul emplacement');
    }
    seen.add(id);
    return slot;
  });
  return { slots };
}

function saveUserShowcase(
  userId: string,
  showcase: { slots: unknown[] }
): void {
  const userDir = path.join(USERS_ROOT_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  fs.writeFileSync(
    getShowcaseFilePath(userId),
    JSON.stringify(showcase, null, 2),
    'utf8'
  );
}

function normalizeString(value: unknown, _field: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

module.exports = {
  getUserShowcase,
  saveUserShowcase,
  normalizeShowcaseForSave,
  normalizeString,
};

export {};
