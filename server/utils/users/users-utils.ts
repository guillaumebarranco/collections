const fs = require('fs');
const path = require('path');

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

function escapeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function parseUsersFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const users');
  if (exportIndex === -1) return [];
  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) return [];

  const users: any[] = [];
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
          });
        }
      }
    }
    i += 1;
  }

  return users;
}

function loadUsers(): any[] {
  if (!fs.existsSync(USERS_FILE)) return [];
  const content = fs.readFileSync(USERS_FILE, 'utf8');
  return parseUsersFromFile(content);
}

function saveUsers(users: any[]) {
  const body = users
    .map(
      (user) => `  {
    username: '${escapeString(user.username)}',
    passwordHash: '${escapeString(user.passwordHash || '')}',
    passwordSalt: '${escapeString(user.passwordSalt || '')}',
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

module.exports = {
  USERS_FILE,
  loadUsers,
  saveUsers,
  findUser,
  normalizeUsername,
};

export {};
