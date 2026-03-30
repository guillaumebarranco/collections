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

function getProfileBadgeFilePath(userId: string): string {
  return path.join(USERS_ROOT_DIR, userId, 'profile-badge.json');
}

function getProfileBadge(userId: string): string | null {
  const filePath = getProfileBadgeFilePath(userId);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    if (data && typeof data === 'object' && 'badgeId' in data) {
      const id = data.badgeId;
      if (id === null || id === undefined) return null;
      if (typeof id === 'string' && id.trim() !== '') return id.trim();
      return null;
    }
    return null;
  } catch {
    return null;
  }
}

function saveProfileBadge(userId: string, badgeId: string | null): void {
  const userDir = path.join(USERS_ROOT_DIR, userId);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  const filePath = getProfileBadgeFilePath(userId);
  const payload =
    badgeId === null || badgeId === ''
      ? { badgeId: null }
      : { badgeId: String(badgeId).trim() };
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
}

/** Params Express : toujours string, mais on évite de lever une erreur si type inattendu. */
function normalizeString(value: unknown, _field: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

module.exports = {
  getProfileBadge,
  saveProfileBadge,
  normalizeString,
};

export {};
