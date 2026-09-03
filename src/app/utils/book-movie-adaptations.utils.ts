import { BaseMovie } from '../models/movie-model';
import { getAllBaseMovies } from '../facades/movies/movies.facade';
import { normalizeSearchText } from './normalize-search-text';

function sourceBookKey(title: string, author: string): string {
  return `${normalizeSearchText(title.trim())}|${normalizeSearchText(author.trim())}`;
}

function sourceBookTitleKey(title: string): string {
  return `title:${normalizeSearchText(title.trim())}`;
}

function addMovieToIndex(
  map: Map<string, BaseMovie[]>,
  key: string,
  movie: BaseMovie
): void {
  const current = map.get(key);
  if (!current) {
    map.set(key, [movie]);
    return;
  }
  const alreadyPresent = current.some(
    (item) => item.title === movie.title && item.director === movie.director
  );
  if (!alreadyPresent) {
    current.push(movie);
  }
}

function buildMoviesBySourceBookIndex(
  movies: BaseMovie[]
): Map<string, BaseMovie[]> {
  const map = new Map<string, BaseMovie[]>();
  for (const movie of movies) {
    const fromEntity = movie.fromEntity;
    if (!fromEntity || fromEntity.entityType !== 'book') continue;
    const title = fromEntity.title?.trim() ?? '';
    if (!title) continue;
    const author = fromEntity.secondEntityKey?.trim() ?? '';
    addMovieToIndex(map, sourceBookKey(title, author), movie);
    addMovieToIndex(map, sourceBookTitleKey(title), movie);
  }
  return map;
}

let indexPromise: Promise<Map<string, BaseMovie[]>> | null = null;

function getMoviesBySourceBookIndex(): Promise<Map<string, BaseMovie[]>> {
  if (!indexPromise) {
    indexPromise = getAllBaseMovies().then(buildMoviesBySourceBookIndex);
  }
  return indexPromise;
}

function lookupInspiredMovies(
  map: Map<string, BaseMovie[]>,
  title: string,
  author: string
): BaseMovie[] {
  const exact = map.get(sourceBookKey(title, author));
  if (exact?.length) return exact;
  return map.get(sourceBookTitleKey(title)) ?? [];
}

/** Films du catalogue adaptés de ce livre (titre + auteur, repli sur le titre). */
export async function getMoviesInspiredByBook(
  title: string,
  author: string
): Promise<BaseMovie[]> {
  const map = await getMoviesBySourceBookIndex();
  return lookupInspiredMovies(map, title, author);
}

export async function bookHasInspiredMovies(
  title: string,
  author: string
): Promise<boolean> {
  const movies = await getMoviesInspiredByBook(title, author);
  return movies.length > 0;
}
