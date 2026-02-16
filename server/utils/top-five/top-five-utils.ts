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

const ENTITY_TYPES = [
  'books',
  'movies',
  'series',
  'games',
  'musics',
  'comics',
  'bds',
  'mangas',
  'manwhas',
];

function emptySlots(): string[] {
  return ['', '', '', '', ''];
}

function createEmptyTopFive(): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  ENTITY_TYPES.forEach((type) => {
    result[type] = emptySlots();
  });
  return result;
}

function normalize(data: Record<string, unknown>): Record<string, string[]> {
  const result = createEmptyTopFive();
  ENTITY_TYPES.forEach((type) => {
    const arr = data[type];
    if (Array.isArray(arr)) {
      result[type] = [
        typeof arr[0] === 'string' ? arr[0] : '',
        typeof arr[1] === 'string' ? arr[1] : '',
        typeof arr[2] === 'string' ? arr[2] : '',
        typeof arr[3] === 'string' ? arr[3] : '',
        typeof arr[4] === 'string' ? arr[4] : '',
      ];
    }
  });
  return result;
}

function getTopFiveFilePath(userId: string): string {
  return path.join(USERS_ROOT_DIR, userId, 'top-five.json');
}

function getTopFive(userId: string): Record<string, string[]> {
  const filePath = getTopFiveFilePath(userId);
  if (!fs.existsSync(filePath)) {
    return createEmptyTopFive();
  }
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    const data = JSON.parse(content);
    return normalize(data);
  } catch {
    return createEmptyTopFive();
  }
}

function saveTopFive(userId: string, data: Record<string, string[]>): void {
  const userDir = path.join(USERS_ROOT_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  const filePath = getTopFiveFilePath(userId);
  const normalized = normalize(data);
  fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2), 'utf8');
}

function normalizeString(value: unknown, field: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') {
    throw new Error(`Invalid string for ${field}`);
  }
  return value.trim().toLowerCase();
}

module.exports = {
  getTopFive,
  saveTopFive,
  createEmptyTopFive,
  normalizeString,
};

export {};
