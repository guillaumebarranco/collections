import { BaseMovie } from '../../../models/movie-model';

export const baseMoviesApi: BaseMovie[] = [
  {
    title: "A Ghost Story",
    director: " David Lowery",
    actors: [
      {
        name: "Rooney Mara",
      },
      {
        name: "Casey Affleck",
      },
    ],
    coverUrl: "https://www.iletaitunefoislecinema.com/wp-content/uploads/2011/12/6ce6a07f637dc5e89503cfc9839277f4.jpg-r_1920_1080-f_jpg-q_x-xxyxx.jpg",
    releaseDate: "2017-07-07",
    length: 92,
    genre: ['Fantastique'],
    saga: "",
    description: "",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: "The Punisher: One Last Kill",
    director: " Reinaldo Marcus Green",
    actors: [
      {
        name: "Jon Bernthal",
      },
    ],
    coverUrl: "https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/the_punisher_one_last_kill_1.jpg",
    releaseDate: "2026-05-12",
    length: 51,
    genre: ['Action'],
    saga: "Marvel Cinematic Universe",
    description: "",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: "Michael",
    director: "Antoine Fuqua",
    actors: [
      {
        name: "Jaafar Jackson",
      },
      {
        name: "Miles Teller",
      },
      {
        name: "Colman Domingo",
      },
    ],
    coverUrl: "https://m.media-amazon.com/images/M/MV5BNzllNmRlN2EtMDQyOC00ODJjLTg4OWQtZDNmNGU3YzlkNjc1XkEyXkFqcGc@._V1_.jpg",
    releaseDate: "2026-04-22",
    length: 127,
    genre: ['Biographie'],
    saga: "",
    description: "",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
];
