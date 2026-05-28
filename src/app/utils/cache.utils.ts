export type CachedFetcher<T> = (() => Promise<T>) & {
  invalidate: () => void;
};

export function createCachedFetcher<T>(
  fetcher: () => Promise<T>
): CachedFetcher<T> {
  let cache: T | null = null;
  let pending: Promise<T> | null = null;

  const load = async () => {
    if (cache !== null) {
      return cache;
    }

    if (!pending) {
      pending = fetcher()
        .then((value) => {
          cache = value;
          return value;
        })
        .finally(() => {
          pending = null;
        });
    }

    return pending;
  };

  load.invalidate = () => {
    cache = null;
    pending = null;
  };

  return load;
}
