export function createCachedFetcher<T>(fetcher: () => Promise<T>) {
  let cache: T | null = null;
  let pending: Promise<T> | null = null;

  return async () => {
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
}
