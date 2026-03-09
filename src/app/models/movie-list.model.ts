/** Élément d'une liste de films (nom + style affichage). */
export interface UserMovieListItem {
  name: string;
  icon: string;
  color: string;
}

export type UserMovieListItems = UserMovieListItem[];
