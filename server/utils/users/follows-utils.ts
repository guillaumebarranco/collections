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

const FOLLOWS_FILE = path.join(USERS_ROOT_DIR, 'users-follows.json');

function normalizeUsername(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

function loadFollows(): Record<string, string[]> {
  if (!fs.existsSync(FOLLOWS_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(FOLLOWS_FILE, 'utf8');
    const data = JSON.parse(content);
    if (typeof data !== 'object' || data === null) return {};
    const result: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(data)) {
      const k = normalizeUsername(key);
      if (!k) continue;
      result[k] = Array.isArray(val)
        ? (val as unknown[]).map((v) => normalizeUsername(v)).filter(Boolean)
        : [];
    }
    return result;
  } catch {
    return {};
  }
}

function saveFollows(data: Record<string, string[]>): void {
  fs.writeFileSync(
    FOLLOWS_FILE,
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

function getFollowedUserIds(userId: string): string[] {
  const normalized = normalizeUsername(userId);
  if (!normalized) return [];
  const all = loadFollows();
  const list = all[normalized];
  return Array.isArray(list) ? [...list] : [];
}

function addFollow(userId: string, followUserId: string): void {
  const user = normalizeUsername(userId);
  const toFollow = normalizeUsername(followUserId);
  if (!user || !toFollow || user === toFollow) return;
  const data = loadFollows();
  if (!data[user]) data[user] = [];
  if (data[user].includes(toFollow)) return;
  data[user].push(toFollow);
  data[user].sort();
  saveFollows(data);
}

function removeFollow(userId: string, followUserId: string): void {
  const user = normalizeUsername(userId);
  const toUnfollow = normalizeUsername(followUserId);
  if (!user || !toUnfollow) return;
  const data = loadFollows();
  if (!data[user]) return;
  data[user] = data[user].filter((id) => id !== toUnfollow);
  if (data[user].length === 0) delete data[user];
  saveFollows(data);
}

module.exports = {
  loadFollows,
  saveFollows,
  getFollowedUserIds,
  addFollow,
  removeFollow,
  normalizeUsername,
};

export {};
