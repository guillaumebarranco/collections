import { BaseManga } from '../../../models/manga-model';

export const baseMangasApi: BaseManga[] = [
  {
    title: 'Fairy Tail',
    author: 'Hiro Mashima',
    coverUrl: '/mangas_pictures/fairy_tail_01.webp',
    genre: 'Shonen',
    nbTomes: 61,
    isFinished: true,
    startDate: '2006-08-02',
    endDate: '2017-07-26',
    saga: '',
    description: '',
    fromEntity: null,
  },

  {
    title: "Zatchbell (Konjiki no Gash !!)",
    author: "Makoto Raiku",
    coverUrl: "https://www.manga-news.com/public/images/series/.Gash_Bell_perfect_1_large.webp",
    genre: "Shonen",
    nbTomes: 33,
    isFinished: false,
    startDate: "",
    endDate: "",
    saga: "",
    description: "",
  },

  {
    title: "Gachiakuta",
    author: "Kei Urana",
    coverUrl: "https://www.manga-news.com/public/images/series/Gachiakuta_1_pika.webp",
    genre: "Shônen nekketsu",
    nbTomes: 18,
    isFinished: true,
    startDate: "",
    endDate: "",
    saga: "",
    description: "",
  },
];
