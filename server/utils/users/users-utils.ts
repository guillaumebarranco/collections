const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

type StoredUser = {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  admin: boolean;
};

const USERS_FILE = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users',
  'users.ts'
);

function parseStringField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`);
  const match = objectText.match(regex);
  if (!match) return null;
  const quote = match[1];
  return match[2].replace(new RegExp(`\\\\${quote}`, 'g'), quote);
}

function parseBooleanField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(true|false)`);
  const match = objectText.match(regex);
  if (!match) return null;
  return match[1] === 'true';
}

function parseUsersFromFile(content: string): StoredUser[] {
  const exportIndex = content.indexOf('export const users');
  if (exportIndex === -1) return [];
  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) return [];

  const users: StoredUser[] = [];
  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const username = parseStringField(objectText, 'username');
        if (username) {
          users.push({
            username,
            passwordHash: parseStringField(objectText, 'passwordHash') || '',
            passwordSalt: parseStringField(objectText, 'passwordSalt') || '',
            admin: parseBooleanField(objectText, 'admin') ?? false,
          });
        }
      }
    }
    i += 1;
  }

  return users;
}

function loadUsers(): StoredUser[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  const content = fs.readFileSync(USERS_FILE, 'utf8');
  return parseUsersFromFile(content);
}

function saveUsers(users: StoredUser[]) {
  const body = users
    .map(
      (user) => `  {
    username: "${escapeString(user.username)}",
    passwordHash: "${escapeString(user.passwordHash || '')}",
    passwordSalt: "${escapeString(user.passwordSalt || '')}",
    admin: ${user.admin ? 'true' : 'false'},
  }`
    )
    .join(',\n');

  const content = `export const users = [\n${body}\n];\n`;
  fs.writeFileSync(USERS_FILE, content, 'utf8');
}

function normalizeUsername(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase();
}

function findUser(username: string) {
  const normalized = normalizeUsername(username);
  const users = loadUsers();
  const user = users.find((u) => normalizeUsername(u.username) === normalized);
  return { user, users, normalized };
}

function isAdminUser(username: string) {
  const { user } = findUser(username);
  return Boolean(user && user.admin);
}

module.exports = {
  USERS_FILE,
  loadUsers,
  saveUsers,
  findUser,
  isAdminUser,
  normalizeUsername,
};

export {};
