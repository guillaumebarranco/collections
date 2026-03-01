import { Injectable, signal, computed } from '@angular/core';

const STORAGE_KEY = 'makya-menu-config';

/** Clés des entrées de menu configurables (Home/dashboard exclu, toujours affiché). */
export const CONFIGURABLE_MENU_KEYS = [
  'books',
  'movies',
  'series',
  'games',
  'mangas',
  'manwhas',
  'comics',
  'bds',
  'musics',
  'mix',
  'quizzs',
] as const;

export type MenuConfigKey = (typeof CONFIGURABLE_MENU_KEYS)[number];

function readStored(): Set<string> {
  if (typeof window === 'undefined') {
    return new Set(CONFIGURABLE_MENU_KEYS);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(CONFIGURABLE_MENU_KEYS);
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set(CONFIGURABLE_MENU_KEYS);
    const valid = arr.filter((k) =>
      CONFIGURABLE_MENU_KEYS.includes(k as MenuConfigKey)
    );
    const storedSet = new Set(valid);
    // Clé "mix" ajoutée après coup : l’afficher par défaut si absente du storage
    for (const key of ['mix', 'quizzs'] as const) {
      if (!storedSet.has(key)) {
        storedSet.add(key);
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...storedSet].filter((k) =>
              CONFIGURABLE_MENU_KEYS.includes(k as MenuConfigKey)
            ))
          );
        } catch {
          // ignore
        }
      }
    }
    return storedSet;
  } catch {
    return new Set(CONFIGURABLE_MENU_KEYS);
  }
}

function writeStored(enabled: Set<string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...enabled].filter((k) => CONFIGURABLE_MENU_KEYS.includes(k as MenuConfigKey)))
    );
  } catch {
    // ignore
  }
}

@Injectable({ providedIn: 'root' })
export class MenuConfigService {
  private readonly enabledSet = signal<Set<string>>(readStored());

  /** Set des clés activées pour l'affichage dans le menu. */
  readonly enabledKeys = computed(() => this.enabledSet());

  /** Vérifie si une entrée de menu (par clé) est affichée. */
  isEnabled(key: string): boolean {
    if (key === 'dashboard') return true;
    return this.enabledSet().has(key);
  }

  /** Met à jour les entrées activées et persiste. */
  setEnabled(keys: Set<string>): void {
    const valid = new Set(
      [...keys].filter((k) => CONFIGURABLE_MENU_KEYS.includes(k as MenuConfigKey))
    );
    this.enabledSet.set(valid);
    writeStored(valid);
  }

  /** Active ou désactive une clé. */
  setKeyEnabled(key: string, enabled: boolean): void {
    if (!CONFIGURABLE_MENU_KEYS.includes(key as MenuConfigKey)) return;
    const next = new Set(this.enabledSet());
    if (enabled) next.add(key);
    else next.delete(key);
    this.enabledSet.set(next);
    writeStored(next);
  }

  /** Réinitialise à tout afficher (sauf Home qui est toujours affiché). */
  resetToDefault(): void {
    this.enabledSet.set(new Set(CONFIGURABLE_MENU_KEYS));
    writeStored(this.enabledSet());
  }
}
