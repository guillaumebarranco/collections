export interface MobileViewCover {
  coverUrl: string;
  title: string;
}

export interface MobileViewCoverSource {
  key: string;
  coverUrl: string;
  title: string;
}

/** Une couverture différente par section, dans l'ordre des vues affichées. */
export function pickMobileViewCovers<V extends string>(
  options: readonly { value: V }[],
  itemsForView: (view: V) => readonly MobileViewCoverSource[]
): Map<V, MobileViewCover> {
  const used = new Set<string>();
  const previews = new Map<V, MobileViewCover>();

  for (const option of options) {
    for (const item of itemsForView(option.value)) {
      const coverUrl = item.coverUrl?.trim();
      if (!coverUrl || used.has(item.key)) continue;
      used.add(item.key);
      previews.set(option.value, { coverUrl, title: item.title });
      break;
    }
  }

  return previews;
}

export function mergeUniqueByKey<T>(
  groups: readonly (readonly T[])[],
  keyOf: (item: T) => string
): T[] {
  const seen = new Set<string>();
  const merged: T[] = [];
  for (const group of groups) {
    for (const item of group) {
      const key = keyOf(item);
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(item);
    }
  }
  return merged;
}
