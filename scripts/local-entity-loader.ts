import * as fs from 'fs';
import * as path from 'path';

const APP_UTILS = path.join(__dirname, '..', 'src', 'app', 'utils');
const USERS_ROOT = path.join(APP_UTILS, 'users');
const ENTITIES_ROOT = path.join(APP_UTILS, 'entities');

function collectArraysFromModule(mod: Record<string, unknown>): unknown[] {
  const out: unknown[] = [];
  for (const value of Object.values(mod)) {
    if (Array.isArray(value)) {
      out.push(...value);
    }
  }
  return out;
}

/** Charge tous les tableaux exportés depuis les fichiers `.ts` d'un dossier. */
export function loadArraysFromTsDirectory(
  dirPath: string,
  fileFilter?: (fileName: string) => boolean
): unknown[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file) => !fileFilter || fileFilter(file))
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base', numeric: true }));

  const out: unknown[] = [];
  for (const file of files) {
    const mod = require(path.join(dirPath, file)) as Record<string, unknown>;
    out.push(...collectArraysFromModule(mod));
  }
  return out;
}

export function loadUserEntityArrays(
  userId: string,
  entityFolder: string,
  fileFilter: (fileName: string) => boolean
): unknown[] {
  const dir = path.join(USERS_ROOT, userId, entityFolder);
  return loadArraysFromTsDirectory(dir, fileFilter);
}

export function loadAllBaseEntityArrays(entityFolder: string): unknown[] {
  return loadArraysFromTsDirectory(path.join(ENTITIES_ROOT, entityFolder));
}
