/** Types allégés pour les grilles select (catalogue). */

export type LightMovie = {
  title: string;
  director: string;
  coverUrl: string;
  releaseDate: string;
  selectDisplayOrder: number;
};

export type LightBook = {
  title: string;
  author: string;
  coverUrl: string;
  saga: string;
  selectDisplayOrder: number;
};

export type LightSerie = {
  title: string;
  director: string;
  coverUrl: string;
  releaseDate: string;
  seasonsCount: number;
};

export type LightGame = {
  title: string;
  editor: string;
  coverUrl: string;
  releaseDate: string;
};

export type LightManga = {
  title: string;
  author: string;
  coverUrl: string;
};

export type LightManwha = {
  title: string;
  author: string;
  coverUrl: string;
};

export type LightComic = {
  title: string;
  writer: string;
  designer: string;
  coverUrl: string;
};

export type LightBd = {
  title: string;
  writer: string;
  designer: string;
  coverUrl: string;
};
