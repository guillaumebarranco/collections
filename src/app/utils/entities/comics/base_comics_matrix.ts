import { BaseComic } from '../../../models/comic-model';

/**
 * Recueils The Matrix Comics (web puis Burlyman Entertainment).
 * Histoires courtes par divers auteurs, dont les Wachowski.
 */
export const baseComicsMatrix: BaseComic[] = [
  {
    title: 'The Matrix Comics, volume 1',
    writer: 'Collectif',
    designer: 'Collectif',
    coverUrl: '/comics_pictures/71Ki2nOwDHL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2003-01-01',
    pages: 280,
    genre: 'Science-fiction',
    saga: 'Matrix',
    sagaOrder: 1,
    description:
      'Premier recueil papier des histoires publiées sur le site officiel (dont Neil Gaiman, Bill Sienkiewicz, etc.).',
  },
  {
    title: 'The Matrix Comics, volume 2',
    writer: 'Collectif',
    designer: 'Collectif',
    coverUrl:
      '/comics_pictures/97a2d8881627.jpg',
    releaseDate: '2004-01-01',
    pages: 272,
    genre: 'Science-fiction',
    saga: 'Matrix',
    sagaOrder: 2,
    description:
      'Second volume Burlyman Entertainment, histoires inédites et reprises du web.',
  },
  {
    title: 'The Matrix Comics: 20th Anniversary Edition',
    writer: 'Collectif',
    designer: 'Collectif',
    coverUrl: '/comics_pictures/ee017ac22591.jpg',
    releaseDate: '2019-01-01',
    pages: 448,
    genre: 'Science-fiction',
    saga: 'Matrix',
    sagaOrder: 3,
    description:
      'Édition anniversaire regroupant la quasi-totalité des récits + quatre histoires nouvelles en volume.',
  },
];
