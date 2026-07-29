/**
 * Projection légère des entités base pour les grilles select
 * (titre, clé secondaire, cover, champs de tri/recherche uniquement).
 */

function toLightMovie(m: any) {
  return {
    title: m.title ?? '',
    director: m.director ?? '',
    coverUrl: m.coverUrl ?? '',
    releaseDate: m.releaseDate ?? '',
    selectDisplayOrder: m.selectDisplayOrder ?? 0,
  };
}

function toLightBook(m: any) {
  return {
    title: m.title ?? '',
    author: m.author ?? '',
    coverUrl: m.coverUrl ?? '',
    saga: m.saga ?? '',
    selectDisplayOrder: m.selectDisplayOrder ?? 0,
  };
}

function toLightSerie(m: any) {
  return {
    title: m.title ?? '',
    director: m.director ?? '',
    coverUrl: m.coverUrl ?? '',
    releaseDate: m.releaseDate ?? '',
    seasonsCount: Array.isArray(m.seasonsData) ? m.seasonsData.length : 0,
  };
}

function toLightGame(m: any) {
  return {
    title: m.title ?? '',
    editor: m.editor ?? '',
    coverUrl: m.coverUrl ?? '',
    releaseDate: m.releaseDate ?? '',
  };
}

function toLightManga(m: any) {
  return {
    title: m.title ?? '',
    author: m.author ?? '',
    coverUrl: m.coverUrl ?? '',
  };
}

function toLightManwha(m: any) {
  return {
    title: m.title ?? '',
    author: m.author ?? '',
    coverUrl: m.coverUrl ?? '',
  };
}

function toLightComic(m: any) {
  return {
    title: m.title ?? '',
    writer: m.writer ?? '',
    designer: m.designer ?? '',
    coverUrl: m.coverUrl ?? '',
  };
}

function toLightBd(m: any) {
  return {
    title: m.title ?? '',
    writer: m.writer ?? '',
    designer: m.designer ?? '',
    coverUrl: m.coverUrl ?? '',
  };
}

module.exports = {
  toLightMovie,
  toLightBook,
  toLightSerie,
  toLightGame,
  toLightManga,
  toLightManwha,
  toLightComic,
  toLightBd,
};

export {};
