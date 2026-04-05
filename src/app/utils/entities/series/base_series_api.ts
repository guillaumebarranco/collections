import { BaseSerie } from '../../../models/serie-model';

export const baseSeriesApi: BaseSerie[] = [
  {
    title: 'His & Hers',
    director: 'William Oldroyd',
    actors: [
      {
        name: 'Tessa Thompson',
      },
      {
        name: 'Jon Bernthal',
      },
    ],
    coverUrl: '/series_pictures/his-hers.jpg',
    releaseDate: '2026-01-08',
    endDate: '2026-01-08',
    genre: ['Thriller'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 259,
      },
    ],
    description: '',
    saga: '',
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: 'Fallout',
    director: 'Geneva Robertson-Dworet, Graham Wagner',
    actors: [
      {
        name: 'Ella Purnell',
      },
      {
        name: 'Aaron Moten',
      },
      {
        name: 'Walton Goggins',
      },
    ],
    coverUrl: '/series_pictures/fallout.jpg',
    releaseDate: '2024-04-10',
    endDate: '',
    genre: ['Post-apocalyptique'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 446,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 8,
        totalLength: 440,
      },
    ],
    description: '',
    saga: '',
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Dexter: New Blood',
    director: 'Clyde Phillips',
    actors: [
      {
        name: 'Michael C. Hall',
      },
      {
        name: 'Jack Alcott',
      },
      {
        name: 'Julia Jones',
      },
    ],
    coverUrl: '/series_pictures/dexter-new-blood.jpg',
    releaseDate: '2021-11-07',
    endDate: '2022-01-09',
    genre: [''],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 527,
      },
    ],
    description: '',
    saga: 'Dexter',
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Dexter: Resurrection',
    director: 'Clyde Phillips',
    actors: [
      {
        name: 'Michael C. Hall',
      },
      {
        name: 'Uma Thurman',
      },
      {
        name: 'Jack Alcott',
      },
      {
        name: 'David Zayas',
      },
    ],
    coverUrl: '/series_pictures/dexter-resurrection.jpg',
    releaseDate: '2025-07-11',
    endDate: '2025-09-05',
    genre: ['Thriller'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 514,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 0,
        totalLength: 550,
      },
    ],
    description: '',
    saga: 'Dexter',
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Wonder Man',
    director: 'Destin Daniel Cretton, Andrew Guest',
    actors: [
      {
        name: 'Yahya Abdul-Mateen II',
      },
      {
        name: 'Ben Kingsley',
      },
    ],
    coverUrl: '/series_pictures/wonder-man.jpg',
    releaseDate: '2026-01-28',
    endDate: '',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 267,
      },
    ],
    description: '',
    saga: 'Marvel Cinematic Universe',
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Dune : Prophecy',
    director: 'Diane Ademu-John, Alison Schapker',
    actors: [
      {
        name: 'Travis Fimmel',
      },
      {
        name: 'Emily Watson',
      },
      {
        name: 'Mark Strong',
      },
    ],
    coverUrl: '/series_pictures/dune-prophecy.jpg',
    releaseDate: '2024-11-17',
    endDate: '2024-12-23',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 391,
      },
    ],
    description: '',
    saga: 'Dune',
    countryOrigin: 'États-Unis',
  },

  {
    title: 'A Knight of the Seven Kingdoms',
    director: 'Ira Parker,George R. R. Martin',
    actors: [
      {
        name: "Peter Claffey",
      },
      {
        name: "Dexter Sol Ansell",
      },
      {
        name: "Daniel Ings",
      }
    ],
    coverUrl: "/series_pictures/aa879c773348.jpg",
    releaseDate: "2026-01-18",
    endDate: "",
    genre: ['Fantasy'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 208,
      }
    ],
    description: "",
    countryOrigin: "États-Unis",
    saga: "Game of Thrones",
      fromEntity: { entityType: "book", title: "Le Trône de fer, L'Intégrale Tome 1", secondEntityKey: "George R.R. Martin" },
  },

  {
    title: 'Bref',
    director: 'Kyan Khojandi, Bruno Muschio',
    actors: [
      {
        name: 'Kyan Khojandi',
      },
      {
        name: 'Alice David',
      },
      {
        name: 'Baptiste Lecaplain',
      },
      {
        name: 'Bérengère Krief',
      },
    ],
    coverUrl: '/series_pictures/2348ce2f74ce.jpg',
    releaseDate: '2011-08-29',
    endDate: '2012-07-12',
    genre: ['Comédie'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 82,
        totalLength: 143.5,
      },
    ],
    description: '',
    countryOrigin: 'France',
    saga: 'Bref',
  },

  {
    title: 'Bref.2',
    director: 'Kyan Khojandi, Bruno Muschio',
    actors: [
      {
        name: 'Kyan Khojandi',
      },
      {
        name: 'Alice David',
      },
      {
        name: 'Baptiste Lecaplain',
      },
      {
        name: 'Bérengère Krief',
      },
      {
        name: 'Laura Felpin',
      },
    ],
    coverUrl: '/series_pictures/7039f237b2fb.png',
    releaseDate: '2025-02-14',
    endDate: '2025-02-14',
    genre: ['Comédie'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 216,
      },
    ],
    description: '',
    countryOrigin: 'France',
    saga: 'Bref',
  },

  {
    title: 'Serge le Mytho',
    director: 'Kyan Khojandi, Bruno Muschio',
    actors: [
      {
        name: 'Jonathan Cohen',
      },
      {
        name: 'Izïa Higelin',
      },
      {
        name: 'Jérémie Galan',
      },
    ],
    coverUrl: '/series_pictures/94ee62679472.jpg',
    releaseDate: '2016-10-07',
    endDate: '2017-06-28',
    genre: ['Comédie'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 30,
        totalLength: 159,
      },
    ],
    description: '',
    countryOrigin: 'France',
    saga: 'Bref',
  },

  {
    title: 'The Mandalorian',
    director: 'Jon Favreau',
    actors: [
      {
        name: 'Pedro Pascal',
      },
      {
        name: 'Gina Carano',
      },
      {
        name: 'Carl Weathers',
      },
    ],
    coverUrl: '/series_pictures/4a4a05942f4e.jpg',
    releaseDate: '2020-04-07',
    endDate: '',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 315,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 8,
        totalLength: 323,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 8,
        totalLength: 340,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Star Wars',
  },

  {
    title: 'Le Livre de Boba Fett',
    director: 'Jon Favreau',
    actors: [
      {
        name: 'Temuera Morrison',
      },
      {
        name: 'Ming-Na Wen',
      },
    ],
    coverUrl: '/series_pictures/0e96afd1c0c5.jpg',
    releaseDate: '2021-12-29',
    endDate: '2022-02-09',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 7,
        totalLength: 330,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Star Wars',
  },

  {
    title: 'Andor',
    director: 'Tony Gilroy',
    actors: [
      {
        name: 'Diego Luna',
      },
      {
        name: 'Stellan Skarsgård',
      },
      {
        name: 'Adria Arjona',
      },
      {
        name: "Genevieve O'Reilly",
      },
      {
        name: 'Kyle Soller',
      },
      {
        name: 'Denise Gough',
      },
    ],
    coverUrl: '/series_pictures/fd6245f48daf.jpg',
    releaseDate: '2022-09-21',
    endDate: '2025-05-14',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 12,
        totalLength: 555,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 12,
        totalLength: 595,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Star Wars',
  },

  {
    title: 'The Acolyte',
    director: 'Leslye Headland',
    actors: [
      {
        name: 'Lee Jung-jae',
      },
      {
        name: 'Amandla Stenberg',
      },
      {
        name: 'Manny Jacinto',
      },
      {
        name: 'Dafne Keen',
      },
      {
        name: 'Charlie Barnett',
      },
    ],
    coverUrl: '/series_pictures/08789709d713.jpg',
    releaseDate: '2024-06-05',
    endDate: '2024-07-17',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 304,
      },
    ],
    description: '',
    countryOrigin: '',
    saga: 'Star Wars',
  },

  {
    title: 'Skeleton Crew',
    director: 'Christopher Ford, Jon Watts',
    actors: [
      {
        name: 'Jude Law',
      },
      {
        name: 'Ravi Cabot-Conyers',
      },
      {
        name: 'Ryan Kiera Armstrong',
      },
      {
        name: 'Nick Frost',
      },
    ],
    coverUrl: '/series_pictures/6ea7944ddfac.jpg',
    releaseDate: '2024-12-03',
    endDate: '2025-01-15',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 295,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Star Wars',
  },

  {
    title: 'House of the Dragon',
    director: 'Ryan Condal, George R.R. Martin',
    actors: [
      {
        name: 'Matt Smith',
      },
      {
        name: "Emma D'Arcy",
      },
      {
        name: 'Olivia Cooke',
      },
    ],
    coverUrl: '/series_pictures/4204abe8e2c3.jpg',
    releaseDate: '2022-08-22',
    endDate: '',
    genre: ['Fantasy'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 615,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 8,
        totalLength: 511,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 0,
        totalLength: 0,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Game of Thrones',
  },

  {
    title: 'Supergirl',
    director: 'Greg Berlanti, Ali Adler',
    actors: [
      {
        name: 'Melissa Benoist',
      },
      {
        name: 'Chyler Leigh',
      },
      {
        name: 'David Harewood',
      },
      {
        name: 'Katie McGrath',
      },
    ],
    coverUrl: '/series_pictures/c018872a5ca6.jpg',
    releaseDate: '2015-10-26',
    endDate: '2021-11-09',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 20,
        totalLength: 858,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 22,
        totalLength: 954,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 23,
        totalLength: 957,
      },
      {
        seasonNumber: 4,
        nbEpisodes: 22,
        totalLength: 903,
      },
      {
        seasonNumber: 5,
        nbEpisodes: 19,
        totalLength: 789,
      },
      {
        seasonNumber: 6,
        nbEpisodes: 20,
        totalLength: 866,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: "DC's Legends of Tomorrow",
    director: 'Greg Berlanti, Marc Guggenheim',
    actors: [
      {
        name: 'Caity Lotz',
      },
      {
        name: 'Dominic Purcell',
      },
      {
        name: 'Nick Zano',
      },
      {
        name: 'Brandon Routh',
      },
    ],
    coverUrl: '/series_pictures/3363a5d92a66.jpg',
    releaseDate: '2016-09-17',
    endDate: '2022-03-02',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 14,
        totalLength: 702,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 17,
        totalLength: 751,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 18,
        totalLength: 756,
      },
      {
        seasonNumber: 4,
        nbEpisodes: 16,
        totalLength: 685,
      },
      {
        seasonNumber: 5,
        nbEpisodes: 15,
        totalLength: 644,
      },
      {
        seasonNumber: 6,
        nbEpisodes: 15,
        totalLength: 651,
      },
      {
        seasonNumber: 7,
        nbEpisodes: 13,
        totalLength: 561,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: 'Black Lightning',
    director: ' Salim Akil',
    actors: [
      {
        name: 'Cress Williams',
      },
      {
        name: 'Nafessa Williams',
      },
      {
        name: 'Christine Adams',
      },
      {
        name: 'China Anne McClain',
      },
      {
        name: 'James Remar',
      },
      {
        name: 'Marvin Jones III',
      },
    ],
    coverUrl: '/series_pictures/6751c3ccfbcf.jpg',
    releaseDate: '2018-01-23',
    endDate: '2021-05-24',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 13,
        totalLength: 561,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 16,
        totalLength: 691,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 16,
        totalLength: 688,
      },
      {
        seasonNumber: 4,
        nbEpisodes: 13,
        totalLength: 558,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: 'Batwoman',
    director: 'Caroline Dries',
    actors: [
      {
        name: 'Ruby Rose',
      },
      {
        name: 'Camrus Johnson',
      },
      {
        name: 'Rachel Skarsten',
      },
      {
        name: 'Javicia Leslie',
      },
    ],
    coverUrl: '/series_pictures/a4454dca92f6.jpg',
    releaseDate: '2020-11-05',
    endDate: '2022-03-02',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 20,
        totalLength: 861,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 18,
        totalLength: 774,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 13,
        totalLength: 559,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: 'Vixen',
    director: 'Greg Berlanti, Marc Guggenheim, Andrew Kreisberg',
    actors: [
      {
        name: 'Megalyn Echikunwoke',
      },
      {
        name: 'Stephen Amell',
      },
      {
        name: 'Grant Gustin',
      },
    ],
    coverUrl: '/series_pictures/c4c90ce91341.jpg',
    releaseDate: '2015-08-25',
    endDate: '2016-11-18',
    genre: ['Science Fiction'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 36,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 6,
        totalLength: 38,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: 'Freedom Fighters: The Ray',
    director: 'Greg Berlanti, Marc Guggenheim',
    actors: [
      {
        name: 'Russell Tovey',
      },
      {
        name: 'Jason Mitchell',
      },
      {
        name: 'Melissa Benoist',
      },
    ],
    coverUrl: '/series_pictures/8b8a69990a65.jpg',
    releaseDate: '2017-12-08',
    endDate: '2018-07-18',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 42,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 6,
        totalLength: 37,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'ArrowVerse',
  },

  {
    title: 'Dragon Ball Z Kai',
    director: 'Yashuhiro Nowata',
    actors: [
      {
        name: 'Masako Nozawa',
      },
      {
        name: 'Ryo Horikawa',
      },
      {
        name: 'Toshio Furukawa',
      },
      {
        name: 'Mayumi Tanaka',
      },
      {
        name: 'Hiromi Tsuru',
      },
    ],
    coverUrl: '/series_pictures/1b5747fc3f46.jpg',
    releaseDate: '2009-06-05',
    endDate: '2015-06-28',
    genre: ['Anime'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 98,
        totalLength: 2269,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 69,
        totalLength: 1594,
      },
    ],
    description: '',
    countryOrigin: 'Japon',
    saga: 'Dragon Ball',
  },

  {
    title: 'Percy Jackson & les Olympiens',
    director: 'Jonathan E. Steinberg, Rick Riordan',
    actors: [
      {
        name: 'Walker Scobell',
      },
      {
        name: 'Leah Sava Jeffries',
      },
      {
        name: 'Aryan Simhadri',
      },
      {
        name: 'Charlie Bushnell',
      },
    ],
    coverUrl: '/series_pictures/2e1bec5c30eb.jpg',
    releaseDate: '2023-12-20',
    endDate: '',
    genre: ['Fantasy'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 313,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 8,
        totalLength: 325,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Percy Jackson',
  },

  {
    title: 'Dexter : Les Origines',
    director: 'Clyde Philips, Scott Reynolds',
    actors: [
      {
        name: 'Patrick Gibson',
      },
      {
        name: 'Michael C. Hall',
      },
      {
        name: 'Christian Slater',
      },
      {
        name: 'Sarah Michelle Gellar',
      },
      {
        name: 'Patrick Dempsey',
      },
    ],
    coverUrl: '/series_pictures/64ff1ce4e54f.jpg',
    releaseDate: '2024-12-15',
    endDate: '2025-02-16',
    genre: ['Thriller'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 508,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Dexter',
  },

  {
    title: 'Ms. Marvel',
    director: 'Bisha K. Ali',
    actors: [
      {
        name: 'Iman Vellani',
      },
      {
        name: 'Matt Lintz',
      },
      {
        name: 'Zenobia Shroff',
      },
      {
        name: 'Mohan Kapur',
      },
    ],
    coverUrl: '/series_pictures/f0c30ee33d1e.jpg',
    releaseDate: '2022-06-08',
    endDate: '2022-07-13',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 6,
        totalLength: 271,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Your Friendly Neighborhood Spider-Man',
    director: 'Melchior Zwyer',
    actors: [
      {
        name: 'Hudson Thames',
      },
      {
        name: 'Kari Wahlgren',
      },
      {
        name: 'Eugene Byrd',
      },
      {
        name: 'Colman Domingo',
      },
      {
        name: 'Grace Song',
      },
      {
        name: 'Zeno Robinson',
      },
    ],
    coverUrl: '/series_pictures/sggdgf.jpg',
    releaseDate: '2025-01-28',
    endDate: '',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 10,
        totalLength: 308,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'What if...?',
    director: 'A.C. Bradley',
    actors: [
      {
        name: 'Jeffrey Wright',
      },
      {
        name: 'Hayley Atwell',
      },
      {
        name: 'Samuel L. Jackson',
      },
    ],
    coverUrl: '/series_pictures/6210e65ef16b.jpg',
    releaseDate: '2021-08-11',
    endDate: '2024-12-28',
    genre: ['Super-héro'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 9,
        totalLength: 289,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 9,
        totalLength: 281,
      },
      {
        seasonNumber: 3,
        nbEpisodes: 8,
        totalLength: 235,
      },
    ],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Agatha All Along',
    director: 'Jac Schaeffer',
    actors: [
      { name: 'Kathryn Hahn' },
      { name: 'Joe Locke' },
      { name: 'Aubrey Plaza' },
      { name: 'Patti LuPone' },
      { name: 'Sasheer Zamata' },
    ],
    coverUrl: '/series_pictures/9a488008ad3f58fe87d17f9874c44fee.jpg',
    releaseDate: '2024-09-18',
    endDate: '2024-11-13',
    genre: ['Super-héro, Comédie noire'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 9, totalLength: 405 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Wakanda',
    director: 'Ryan Coogler',
    actors: [],
    coverUrl: '/series_pictures/Wakanda-Marvel-1.jpg',
    releaseDate: '2026-01-01',
    endDate: '',
    genre: ['Super-héro, Action'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 0, totalLength: 0 }],
    description:
      'Série live-action se déroulant au royaume de Wakanda, en développement.',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Moon Knight',
    director: 'Mohamed Diab',
    actors: [
      { name: 'Oscar Isaac' },
      { name: 'May Calamawy' },
      { name: 'Ethan Hawke' },
      { name: 'F. Murray Abraham' },
    ],
    coverUrl: '/series_pictures/76878CA2-F591-4025-AC3D-B37858B12B76.webp',
    releaseDate: '2022-03-30',
    endDate: '2022-05-04',
    genre: ['Super-héro, Action, Fantastique'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 6, totalLength: 270 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: "Je s'appelle Groot",
    director: 'Kirsten Lepore',
    actors: [{ name: 'Vin Diesel' }, { name: 'Bradley Cooper' }],
    coverUrl: '/series_pictures/F0664142-9116-4107-ABDD-E4DA70A72796.webp',
    releaseDate: '2022-08-10',
    endDate: '2023-09-06',
    genre: ['Super-héro, Animation, Comédie'],
    seasonsData: [
      { seasonNumber: 1, nbEpisodes: 5, totalLength: 22 },
      { seasonNumber: 2, nbEpisodes: 5, totalLength: 22 },
    ],
    description: 'Court-métrages animés mettant en scène Bébé Groot.',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'She-Hulk : Attorney at Law',
    director: 'Jessica Gao',
    actors: [
      { name: 'Tatiana Maslany' },
      { name: 'Mark Ruffalo' },
      { name: 'Tim Roth' },
      { name: 'Jameela Jamil' },
      { name: 'Charlie Cox' },
    ],
    coverUrl: '/series_pictures/5375583.jpg',
    releaseDate: '2022-08-18',
    endDate: '2022-10-13',
    genre: ['Super-héro, Comédie'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 9, totalLength: 270 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Secret Invasion',
    director: 'Kyle Bradstreet',
    actors: [
      { name: 'Samuel L. Jackson' },
      { name: 'Ben Mendelsohn' },
      { name: 'Cobie Smulders' },
      { name: 'Emilia Clarke' },
      { name: 'Olivia Colman' },
      { name: 'Don Cheadle' },
    ],
    coverUrl: '/series_pictures/2191412.jpg',
    releaseDate: '2023-06-21',
    endDate: '2023-07-26',
    genre: ['Super-héro, Espionnage, Thriller'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 6, totalLength: 300 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Echo',
    director: 'Sydney Freeland',
    actors: [
      { name: 'Alaqua Cox' },
      { name: 'Chaske Spencer' },
      { name: 'Tantoo Cardinal' },
      { name: 'Charlie Cox' },
      { name: "Vincent D'Onofrio" },
      { name: 'Devery Jacobs' },
    ],
    coverUrl: '/series_pictures/4992840.jpg',
    releaseDate: '2024-01-09',
    endDate: '2024-01-09',
    genre: ['Super-héro, Action, Drame'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 5, totalLength: 250 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Ironheart',
    director: 'Chinaka Hodge',
    actors: [
      { name: 'Dominique Thorne' },
      { name: 'Anthony Ramos' },
      { name: 'Lyric Ross' },
      { name: 'Alden Ehrenreich' },
    ],
    coverUrl: '/series_pictures/245af9e9f4e7684f57cb5312d9f58045.jpg',
    releaseDate: '2025-06-24',
    endDate: '2025-07-01',
    genre: ['Super-héro, Action, Science-fiction'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 6, totalLength: 270 }],
    description: '',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Eyes of Wakanda',
    director: 'Todd Harris',
    actors: [
      { name: 'Winnie Harlow' },
      { name: 'Cress Williams' },
      { name: 'Lynn Whitfield' },
      { name: 'Anika Noni Rose' },
    ],
    coverUrl: '/series_pictures/404feaa27463cc5ec8b471f74e8c225b.jpg',
    releaseDate: '2025-08-01',
    endDate: '2025-08-01',
    genre: ['Super-héro, Animation'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 4, totalLength: 128 }],
    description:
      "Série animée suivant les guerriers Hatut Zaraze à travers l'histoire du Wakanda.",
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Marvel Zombies',
    director: 'Zeb Wells',
    actors: [
      { name: 'Elizabeth Olsen' },
      { name: 'Paul Rudd' },
      { name: 'Florence Pugh' },
      { name: 'David Harbour' },
      { name: 'Iman Vellani' },
      { name: 'Dominique Thorne' },
    ],
    coverUrl: '/series_pictures/7257bbee93e9b6f529950d1017cdb723.webp',
    releaseDate: '2025-09-24',
    endDate: '2025-09-24',
    genre: ['Super-héro, Animation, Horreur'],
    seasonsData: [{ seasonNumber: 1, nbEpisodes: 4, totalLength: 128 }],
    description:
      'Les Avengers sont contaminés par une épidémie zombie ; des survivants tentent de sauver le monde.',
    countryOrigin: 'États-Unis',
    saga: 'Marvel Cinematic Universe',
  },

  {
    title: 'Star Wars: Visions',
    director: 'James Waugh',
    actors: [],
    coverUrl: '/series_pictures/doc_sw_visions_1.webp',
    releaseDate: '2021-09-22',
    endDate: '2025-10-29',
    genre: ['Science-fiction, Animation, Anthologie'],
    seasonsData: [
      { seasonNumber: 1, nbEpisodes: 9, totalLength: 162 },
      { seasonNumber: 2, nbEpisodes: 9, totalLength: 162 },
      { seasonNumber: 3, nbEpisodes: 9, totalLength: 162 },
    ],
    description:
      "Anthologie animée de courts métrages dans l'univers Star Wars, par des studios japonais et internationaux.",
    countryOrigin: 'États-Unis',
    saga: 'Star Wars',
  },

  {
    title: 'Love Death & Robots',
    director: 'Tim Miller',
    actors: [],
    coverUrl: '/series_pictures/3274407.webp',
    releaseDate: '2019-03-15',
    endDate: '2025-05-15',
    genre: ['Animation, Science-fiction, Anthologie'],
    seasonsData: [
      { seasonNumber: 1, nbEpisodes: 18, totalLength: 270 },
      { seasonNumber: 2, nbEpisodes: 8, totalLength: 120 },
      { seasonNumber: 3, nbEpisodes: 9, totalLength: 135 },
      { seasonNumber: 4, nbEpisodes: 10, totalLength: 150 },
    ],
    description:
      'Anthologie animée pour adultes : épisodes courts mêlant science-fiction, horreur et comédie, créée par Tim Miller et David Fincher.',
    countryOrigin: 'États-Unis',
    saga: '',
  },

  {
    title: 'Furies',
    director: 'Jean-Yves Arnaud',
    actors: [
      {
        name: 'Marina Foïs',
      },
      {
        name: 'Lina El Arabi',
      },
      {
        name: 'Steve Tientcheu',
      },
      {
        name: 'Jeremy Nadeau',
      },
      {
        name: 'Quentin Faure',
      },
      {
        name: 'Sandor Funtek',
      },
    ],
    coverUrl: 'https://media.senscritique.com/media/000021948209/0/furies.jpg',
    releaseDate: '2024-03-01',
    endDate: '',
    genre: ['Action'],
    seasonsData: [
      {
        seasonNumber: 1,
        nbEpisodes: 8,
        totalLength: 358,
      },
      {
        seasonNumber: 2,
        nbEpisodes: 6,
        totalLength: 273,
      },
    ],
    description: '',
    countryOrigin: 'France',
    saga: '',
  },
];
