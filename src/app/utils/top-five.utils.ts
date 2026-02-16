import type { TopFiveEntityType } from '../models/top-five-model';
import type { Book } from '../models/book-model';
import type { Movie } from '../models/movie-model';
import type { Serie } from '../models/serie-model';
import type { Game } from '../models/game-model';
import type { Music } from '../models/music-model';
import type { Comic } from '../models/comic-model';
import type { Bd } from '../models/bd-model';
import type { Manga } from '../models/manga-model';
import type { Manwha } from '../models/manwha-model';

export type Entity =
  | Book
  | Movie
  | Serie
  | Game
  | Music
  | Comic
  | Bd
  | Manga
  | Manwha;

/** Construit une clé unique pour une entité (même format que dans les facades / listes) */
export function getEntityKey(
  entityType: TopFiveEntityType,
  entity: Entity
): string {
  const e = entity as any;
  switch (entityType) {
    case 'books':
    case 'mangas':
    case 'manwhas':
      return `${e['title'] ?? ''}|${e['author'] ?? ''}`;
    case 'movies':
    case 'series':
      return `${e['title'] ?? ''}|${e['director'] ?? ''}`;
    case 'games':
      return `${e['title'] ?? ''}|${e['editor'] ?? ''}`;
    case 'musics':
      return `${e['title'] ?? ''}|${e['artist'] ?? ''}`;
    case 'comics':
    case 'bds':
      return `${e['title'] ?? ''}|${e['writer'] ?? ''}`;
    default:
      return `${e['title'] ?? ''}|`;
  }
}

/** Retourne un libellé court pour l’affichage (titre + sous-titre optionnel) */
export function getEntityDisplayLabel(
  entityType: TopFiveEntityType,
  entity: Entity
): string {
  const e = entity as any;
  const title = e['title'] ?? '';
  switch (entityType) {
    case 'musics':
      return [title, e['artist']].filter(Boolean).join(' – ');
    case 'books':
    case 'mangas':
    case 'manwhas':
      return [title, e['author']].filter(Boolean).join(' – ');
    case 'movies':
    case 'series':
      return [title, e['director']].filter(Boolean).join(' – ');
    case 'games':
      return [title, e['editor']].filter(Boolean).join(' – ');
    case 'comics':
    case 'bds':
      return [title, e['writer']].filter(Boolean).join(' – ');
    default:
      return title;
  }
}

/** Trouve une entité dans une liste à partir de sa clé */
export function findEntityByKey<T extends Entity>(
  list: T[],
  entityType: TopFiveEntityType,
  key: string
): T | undefined {
  if (!key) return undefined;
  return list.find((item) => getEntityKey(entityType, item as Entity) === key);
}
