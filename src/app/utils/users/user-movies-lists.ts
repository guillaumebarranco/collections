/**
 * Listes de films par utilisateur.
 * Chaque liste a name, icon, color. Les films sont associés aux listes via UserMovie.inList (noms de listes).
 * Mis à jour via les API : GET/POST/DELETE /api/users/:userId/movies-lists
 */

import type { UserMovieListItem } from '../../models/movie-list.model';

export const usersMoviesLists: Record<string, UserMovieListItem[]> = {
  "guillaume": [
    {
      "name": "Mes classiques",
      "icon": "⭐",
      "color": "#ca8a04"
    },
    {
      "name": "Mes romances",
      "icon": "📋",
      "color": "#6b7280"
    }
  ],
  "ronan": [],
  "emmanuelle": [],
  "william": [],
  "amandine": [],
  "bastien": [],
  "cassandre": [],
  "kevin": [],
  "xeryth": [],
  "marina": [],
  "dantes": [],
  "unho": []
};
