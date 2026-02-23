const fs = require('fs');
const path = require('path');

const USERS_BADGES_FILE = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users',
  'users-badges.ts'
);

function getUsersBadges(): Record<string, string[]> {
  if (!fs.existsSync(USERS_BADGES_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(USERS_BADGES_FILE, 'utf8');
    const eq = content.indexOf(' = ');
    if (eq === -1) return {};
    const jsonStart = eq + 3;
    const semi = content.lastIndexOf(';');
    const jsonStr = (semi > jsonStart ? content.slice(jsonStart, semi) : content.slice(jsonStart)).trim();
    const data = JSON.parse(jsonStr);
    return typeof data === 'object' && data !== null ? data : {};
  } catch {
    return {};
  }
}

function getBadgesForUser(userId: string): string[] {
  const all = getUsersBadges();
  const ids = all[userId];
  return Array.isArray(ids) ? ids : [];
}

module.exports = {
  getUsersBadges,
  getBadgesForUser,
};

export {};
