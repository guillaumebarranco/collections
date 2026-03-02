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

const SCORES_FILE = path.join(USERS_ROOT_DIR, 'users-quizz-scores.json');

type ScoreEntry = {
  entityType: string;
  entityTitle: string;
  creator: string;
  level: number;
  correct: number;
  total: number;
  completedAt: string;
};

function normalizeString(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

function getScoreKey(entry: ScoreEntry): string {
  return `${entry.entityType}|${entry.entityTitle}|${entry.creator}|${entry.level}`;
}

function loadScores(): Record<string, ScoreEntry[]> {
  if (!fs.existsSync(SCORES_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(SCORES_FILE, 'utf8');
    const data = JSON.parse(content);
    if (typeof data !== 'object' || data === null) return {};
    const result: Record<string, ScoreEntry[]> = {};
    for (const [key, val] of Object.entries(data)) {
      const k = normalizeString(key);
      if (!k) continue;
      result[k] = Array.isArray(val)
        ? (val as ScoreEntry[]).filter(
            (e) =>
              e &&
              typeof e.entityType === 'string' &&
              typeof e.entityTitle === 'string' &&
              typeof e.creator === 'string' &&
              typeof e.correct === 'number' &&
              typeof e.total === 'number'
          )
        : [];
    }
    return result;
  } catch {
    return {};
  }
}

function saveScores(data: Record<string, ScoreEntry[]>): void {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getScoresForUser(userId: string): ScoreEntry[] {
  const normalized = normalizeString(userId);
  if (!normalized) return [];
  const all = loadScores();
  const list = all[normalized];
  return Array.isArray(list) ? [...list] : [];
}

function addOrUpdateScore(userId: string, entry: ScoreEntry): ScoreEntry[] {
  const user = normalizeString(userId);
  if (!user) return [];
  const entryNorm: ScoreEntry = {
    entityType: String(entry.entityType ?? ''),
    entityTitle: String(entry.entityTitle ?? ''),
    creator: String(entry.creator ?? ''),
    level: Number(entry.level) || 1,
    correct: Number(entry.correct) || 0,
    total: Number(entry.total) || 0,
    completedAt:
      typeof entry.completedAt === 'string' && entry.completedAt
        ? entry.completedAt
        : new Date().toISOString(),
  };
  const data = loadScores();
  if (!data[user]) data[user] = [];
  const key = getScoreKey(entryNorm);
  const existingIndex = data[user].findIndex((e) => getScoreKey(e) === key);
  if (existingIndex >= 0) {
    data[user][existingIndex] = entryNorm;
  } else {
    data[user].push(entryNorm);
  }
  saveScores(data);
  return getScoresForUser(user);
}

module.exports = {
  getScoresForUser,
  addOrUpdateScore,
  normalizeString,
};

export {};
