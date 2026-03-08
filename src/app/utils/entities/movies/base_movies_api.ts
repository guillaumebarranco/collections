import { BaseMovie } from '../../../models/movie-model';

export const baseMoviesApi: BaseMovie[] = [
  {
    title: 'Casablanca',
    director: 'Michael Curtiz',
    actors: [
      {
        name: 'Humphrey Bogart',
      },
      {
        name: 'Ingrid Bergman',
      },
      {
        name: 'Paul Henreid',
      },
    ],
    coverUrl: '/movies_pictures/casablanca.jpg',
    releaseDate: '1947-05-23',
    length: 102,
    genre: 'Drame',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'The Rip',
    director: 'Joe Carnahan',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Steven Yeun',
      },
    ],
    coverUrl: '/movies_pictures/8318c06373acd968023aa5afab9c2ae6.jpg',
    releaseDate: '2026-01-16',
    length: 115,
    genre: 'Thriller',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Greenland - Le Dernier Refuge',
    director: 'Ric Roman Waugh',
    actors: [
      {
        name: 'Gerard Butler',
      },
      {
        name: 'Morena Baccarin',
      },
      {
        name: 'Roger Dale Floyd',
      },
    ],
    coverUrl: '/movies_pictures/images.webp',
    releaseDate: '2020-07-29',
    length: 120,
    genre: 'Catastrophe',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'La Cité de Dieu',
    director: 'Fernando Meirelles, Kátia Lund',
    actors: [
      {
        name: 'Alexandre Rodrigues',
      },
      {
        name: 'Douglas Silva',
      },
      {
        name: 'Phellipe Haagensen',
      },
      {
        name: 'Alice Braga',
      },
    ],
    coverUrl: '/movies_pictures/citedieu.webp',
    releaseDate: '2002-08-30',
    length: 130,
    genre: 'Drame',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'Brésil',
  },
  {
    title: 'Gourou',
    director: 'Yann Gozlan',
    actors: [
      {
        name: 'Pierre Niney',
      },
      {
        name: 'Marion Barbeau',
      },
    ],
    coverUrl: '/movies_pictures/gourou.jpg',
    releaseDate: '2026-01-28',
    length: 126,
    genre: 'Thriller',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: '28 ans plus tard',
    director: 'Danny Boyle',
    actors: [
      {
        name: 'Aaron Taylor-Johnson',
      },
      {
        name: 'Jodie Comer',
      },
      {
        name: 'Ralph Fiennes',
      },
    ],
    coverUrl: '/movies_pictures/28-ans-plus-tard.jpg',
    releaseDate: '2025-06-18',
    length: 115,
    genre: 'Horreur',
    saga: '28... plus tard',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: "L'Amour, c'est surcoté ",
    director: 'Mourad Winter',
    actors: [
      {
        name: 'Hakim Jemili',
      },
      {
        name: 'Laura Felpin',
      },
    ],
    coverUrl: '/movies_pictures/amour-surcote.jpg',
    releaseDate: '2025-04-23',
    length: 98,
    genre: 'Comédie romantique',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title:
      "Le Seigneur des Anneaux - La Communauté de l'Anneau - Version Longue",
    director: 'Peter Jackson',
    actors: [
      {
        name: 'Elijah Wood',
      },
      {
        name: 'Sean Astin',
      },
      {
        name: 'Ian McKellen',
      },
    ],
    coverUrl: '/movies_pictures/seigneur-anneaux-1.jpg',
    releaseDate: '2002-08-06',
    length: 228,
    genre: 'Fantasy',
    saga: 'Tolkien',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Le Seigneur des Anneaux Tome 1 : La Communauté de l'Anneau",
      secondEntityKey: 'J.R.R. Tolkien',
    },
    countryOrigin: 'Nouvelle-Zélande',
  },
  {
    title: 'Le Seigneur des Anneaux - Les Deux Tours - Version Longue',
    director: 'Peter Jackson',
    actors: [
      {
        name: 'Elijah Wood',
      },
      {
        name: 'Sean Astin',
      },
      {
        name: 'Ian McKellen',
      },
    ],
    coverUrl: '/movies_pictures/seigneur-anneaux-2.jpg',
    releaseDate: '2003-08-26',
    length: 235,
    genre: 'Fantasy',
    saga: 'Tolkien',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Le Seigneur des Anneaux Tome 1 : La Communauté de l'Anneau",
      secondEntityKey: 'J.R.R. Tolkien',
    },
    countryOrigin: 'Nouvelle-Zélande',
  },
  {
    title: 'Le Seigneur des Anneaux - Le Retour du Roi - Version Longue',
    director: 'Peter Jackson',
    actors: [
      {
        name: 'Elijah Wood',
      },
      {
        name: 'Sean Astin',
      },
      {
        name: 'Ian McKellen',
      },
    ],
    coverUrl: '/movies_pictures/seigneur-anneaux-3.jpg',
    releaseDate: '2004-12-14',
    length: 264,
    genre: 'Fantasy',
    saga: 'Tolkien',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Le Seigneur des Anneaux Tome 1 : La Communauté de l'Anneau",
      secondEntityKey: 'J.R.R. Tolkien',
    },
    countryOrigin: 'Nouvelle-Zélande',
  },
  {
    title: 'Sonic 2, le film',
    director: 'Jeff Fowler',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'James Marsden',
      },
    ],
    coverUrl: '/movies_pictures/sonic-2.jpg',
    releaseDate: '2022-03-30',
    length: 122,
    genre: 'Aventure, Famille',
    saga: 'Sonic',
    description: '',
    fromEntity: {
      entityType: 'game',
      title: 'Sonic the Hedgehog',
      secondEntityKey: 'Sega',
    },
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Avignon',
    director: 'Johann Dionnet',
    actors: [
      {
        name: 'Baptiste Lecaplain',
      },
      {
        name: 'Alison Wheeler',
      },
      {
        name: 'Elisa Erka',
      },
    ],
    coverUrl: '/movies_pictures/avignon.jpg',
    releaseDate: '2025-06-18',
    length: 99,
    genre: 'Comédie',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Sonic 3, le film',
    director: 'Jeff Fowler',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'James Marsden',
      },
      {
        name: 'Idris Elba',
      },
      {
        name: 'Keanu Reeves',
      },
    ],
    coverUrl: '/movies_pictures/sonic-3.jpg',
    releaseDate: '2024-12-25',
    length: 110,
    genre: 'Aventure, Famille',
    saga: 'Sonic',
    description: '',
    fromEntity: {
      entityType: 'game',
      title: 'Sonic the Hedgehog',
      secondEntityKey: 'Sega',
    },
    countryOrigin: 'États-Unis',
  },
  {
    title: "N'oublie Jamais",
    director: 'Nick Cassavetes',
    actors: [
      {
        name: 'Ryan Gosling',
      },
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'James Marsden',
      },
    ],
    coverUrl: '/movies_pictures/n-oublie-jamais-film.jpg',
    releaseDate: '2004-09-08',
    length: 121,
    genre: 'Comédie romantique',
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Les pages de notre amour',
      secondEntityKey: 'Nicholas Sparks',
    },
    countryOrigin: 'États-Unis',
  },
  {
    title: 'KPop Demon Hunters',
    director: 'Maggie Kang, Chris Appelhans',
    actors: [
      {
        name: 'Arden Cho',
      },
      {
        name: 'May Hong',
      },
      {
        name: 'Ahn Hyo-seop',
      },
      {
        name: 'Ji-young Yoo',
      },
    ],
    coverUrl: '/movies_pictures/kpop-demon-hunters.jpg',
    releaseDate: '2025-06-20',
    length: 95,
    genre: 'Animation',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Wedding Daze',
    director: 'Michael Ian Black',
    actors: [{ name: 'Jason Biggs' }, { name: 'Isla Fisher' }],
    coverUrl: '/movies_pictures/51tjE6CC0BL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '',
    length: 90,
    genre: '',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: "O'Brother",
    director: 'Ethan Coen, Joel Coen',
    actors: [
      {
        name: 'George Clooney',
      },
      {
        name: 'Tim Blake Nelson',
      },
      {
        name: 'John Turturro',
      },
    ],
    coverUrl: '/movies_pictures/1f14c0e6a8c4.jpg',
    releaseDate: '2000-08-30',
    length: 106,
    genre: 'Comédie, Policier',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Bugonia',
    director: 'Yórgos Lánthimos',
    actors: [
      {
        name: 'Emma Stone',
      },
      {
        name: 'Jesse Plemons',
      },
    ],
    coverUrl: '/movies_pictures/afd8a20d4a52.jpg',
    releaseDate: '2025-11-26',
    length: 119,
    genre: 'Thriller',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Marsupilami',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Philippe Lacheau',
      },
      {
        name: 'Elodie Fontan',
      },
      {
        name: 'Jamel Debbouze',
      },
      {
        name: 'Tarek Boudali',
      },
      {
        name: 'Julien Arruti',
      },
      {
        name: 'Jean Reno',
      },
    ],
    coverUrl: '/movies_pictures/813c13b26a5c.jpg',
    releaseDate: '2026-02-04',
    length: 109,
    genre: 'Comédie',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Kraven the Hunter',
    director: 'J.C Chandor',
    actors: [
      {
        name: 'Aaron Taylor-Johnson',
      },
      {
        name: 'Russell Crowe',
      },
      {
        name: 'Ariana DeBose',
      },
      {
        name: 'Alessandro Nivola',
      },
      {
        name: 'Fred Hechinger',
      },
    ],
    coverUrl: '/movies_pictures/f89b822eddbd.webp',
    releaseDate: '2024-12-18',
    length: 125,
    genre: 'Action',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Nope',
    director: 'Jordan Peele',
    actors: [
      {
        name: 'Daniel Kaluuya',
      },
      {
        name: 'Keke Palmer',
      },
      {
        name: 'Steven Yeun',
      },
    ],
    coverUrl: '/movies_pictures/c5f6e612cd96.jpg',
    releaseDate: '2022-08-10',
    length: 131,
    genre: 'Science Fiction, Horreur',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: "L'Auberge Espagnol",
    director: 'Cédric Klapisch',
    actors: [
      {
        name: 'Romain Duris',
      },
      {
        name: 'Cécile de France',
      },
      {
        name: 'Audrey Tautou',
      },
    ],
    coverUrl: '/movies_pictures/3649f55f5292.jpg',
    releaseDate: '2002-06-19',
    length: 120,
    genre: 'Comédie ',
    saga: 'Trilogie Cédric Klapisch',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Hamnet',
    director: 'Chloé Zhao',
    actors: [
      {
        name: 'Jessie Buckley',
      },
      {
        name: 'Paul Mescal',
      },
    ],
    coverUrl: '/movies_pictures/de3c06c3f4d3.jpg',
    releaseDate: '2026-01-21',
    length: 125,
    genre: 'Drame',
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Hamlet',
      secondEntityKey: 'William Shakespeare',
    },
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: 'Hannah Montana - Le Film',
    director: 'Peter Chelsom',
    actors: [
      {
        name: 'Miley Cyrus',
      },
      {
        name: 'Billy Ray Cyrus',
      },
      {
        name: 'Lucas Till',
      },
    ],
    coverUrl: '/movies_pictures/1bccb06dc7f5.jpg',
    releaseDate: '2009-06-17',
    length: 102,
    genre: 'Comédie musicale',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },
  {
    title: 'Les Poupées Russes',
    director: 'Cédric Klapisch',
    actors: [
      {
        name: 'Romain Duris',
      },
      {
        name: 'Cécile de France',
      },
      {
        name: 'Audrey Tautou',
      },
      {
        name: 'Kelly Reilly',
      },
    ],
    coverUrl: '/movies_pictures/fd3c28640df1.jpg',
    releaseDate: '2005-06-15',
    length: 130,
    genre: 'Comédie',
    saga: 'Trilogie Cédric Klapisch',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Le Coursier',
    director: 'Hervé Renoh',
    actors: [
      {
        name: 'Michaël Youn',
      },
      {
        name: 'Anaïs Demoustier',
      },
      {
        name: 'Grégoire Ludig',
      },
      {
        name: 'Vincent Londeix',
      },
      {
        name: 'Guillaume Gouix',
      },
    ],
    coverUrl: '/movies_pictures/19216690.jpg',
    releaseDate: '2012-02-22',
    length: 89,
    genre: 'Comédie',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Un prophète',
    director: 'Jacques Audiard',
    actors: [
      { name: 'Tahar Rahim' },
      { name: 'Niels Arestrup' },
      { name: 'Adel Bencherif' },
    ],
    coverUrl: '/movies_pictures/19138702.webp',
    releaseDate: '2009-08-26',
    length: 155,
    genre: 'Drame, Thriller',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Grave',
    director: 'Julia Ducournau',
    actors: [
      { name: 'Garance Marillier' },
      { name: 'Ella Rumpf' },
      { name: 'Rabah Nait Oufella' },
    ],
    coverUrl: '/movies_pictures/538324.jpg',
    releaseDate: '2016-09-14',
    length: 99,
    genre: 'Horreur, Drame',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Les Sous-doués',
    director: 'Claude Zidi',
    actors: [
      { name: 'Daniel Auteuil' },
      { name: 'Gérard Jugnot' },
      { name: 'Marie-Anne Chazel' },
      { name: 'Dominique Lavanant' },
    ],
    coverUrl: '/movies_pictures/les_sous_doues.jpg',
    releaseDate: '1980-01-23',
    length: 100,
    genre: 'Comédie',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Case départ',
    director: "Lionel Steketee, Fabrice Éboué, Thomas N'Gijol",
    actors: [
      { name: 'Fabrice Éboué' },
      { name: "Thomas N'Gijol" },
      { name: 'Émilie Caen' },
      { name: 'Noom Diawara' },
    ],
    coverUrl: '/movies_pictures/19760131.jpg',
    releaseDate: '2011-07-06',
    length: 94,
    genre: 'Comédie',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Monty Python - Sacré Graal !',
    director: 'Terry Gilliam, Terry Jones',
    actors: [
      { name: 'Graham Chapman' },
      { name: 'John Cleese' },
      { name: 'Terry Gilliam' },
      { name: 'Eric Idle' },
      { name: 'Terry Jones' },
      { name: 'Michael Palin' },
    ],
    coverUrl: '/movies_pictures/aaxjxifgczdvipqinrb0hwc2ptr-350.jpg',
    releaseDate: '1975-05-25',
    length: 91,
    genre: 'Comédie',
    saga: 'Monty Python',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: 'Orange mécanique',
    director: 'Stanley Kubrick',
    actors: [
      { name: 'Malcolm McDowell' },
      { name: 'Patrick Magee' },
      { name: 'Michael Bates' },
      { name: 'Warren Clarke' },
      { name: 'Adrienne Corri' },
    ],
    coverUrl: '/movies_pictures/a3cineculte.jpg',
    releaseDate: '1971-12-19',
    length: 136,
    genre: 'Science Fiction, Drame',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: 'Arnaques, crimes & botanique',
    director: 'Guy Ritchie',
    actors: [
      { name: 'Jason Flemyng' },
      { name: 'Dexter Fletcher' },
      { name: 'Nick Moran' },
      { name: 'Jason Statham' },
      { name: 'Vinnie Jones' },
    ],
    coverUrl: '/movies_pictures/389231.webp',
    releaseDate: '1998-08-28',
    length: 107,
    genre: 'Comédie, Thriller, Crime',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: 'Le Dernier Pub avant la fin du monde',
    director: 'Edgar Wright',
    actors: [
      { name: 'Simon Pegg' },
      { name: 'Nick Frost' },
      { name: 'Martin Freeman' },
      { name: 'Paddy Considine' },
      { name: 'Eddie Marsan' },
      { name: 'Rosamund Pike' },
    ],
    coverUrl: '/movies_pictures/le_dernier_pub_avant_la_fin_du_monde.jpg',
    releaseDate: '2013-07-19',
    length: 109,
    genre: 'Comédie, Science Fiction',
    saga: 'Trilogie Cornetto',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },

  {
    title: 'Le Rêve Américain',
    director: 'Anthony Marciano',
    actors: [
      {
        name: 'Jean-Pascal Zadi',
      },
      {
        name: 'Raphaël Quenard',
      },
    ],
    coverUrl: '/movies_pictures/05188b045ef2.jpeg',
    releaseDate: '2026-02-18',
    length: 121,
    genre: 'Biopic',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },

  {
    title: 'Scream 7',
    director: 'Kevin Williamson',
    actors: [
      {
        name: 'Neve Campbell',
      },
      {
        name: 'Isabel May',
      },
      {
        name: 'Courteney Cox',
      },
    ],
    coverUrl: '/movies_pictures/9ee7fe56e47a.jpg',
    releaseDate: '2026-02-25',
    length: 114,
    genre: 'Horreur',
    saga: 'Scream',
    description: '',
    fromEntity: null,
    countryOrigin: 'France',
  },
  {
    title: 'Dragonball Evolution',
    director: 'James Wong',
    actors: [
      {
        name: 'Justin Chatwin',
      },
      {
        name: 'James Marsters',
      },
      {
        name: 'Chow Yun-fat',
      },
      {
        name: 'Emmy Rossum',
      },
      {
        name: 'Jamie Chung',
      },
    ],
    coverUrl: '/movies_pictures/19065645.jpg',
    releaseDate: '2009-04-10',
    length: 85,
    genre: 'Action',
    saga: 'Dragon Ball',
    description: '',
    fromEntity: {
      entityType: 'manga',
      title: 'Dragon Ball',
      secondEntityKey: 'Akira Toriyama',
    },
    countryOrigin: 'États-Unis',
  },
  {
    title: 'The Ghost Writer',
    director: 'Roman Polanski',
    actors: [
      { name: 'Ewan McGregor' },
      { name: 'Pierce Brosnan' },
      { name: 'Olivia Williams' },
      { name: 'Kim Cattrall' },
    ],
    coverUrl: '/movies_pictures/912rCOF9d2L._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2010-02-12',
    length: 128,
    genre: 'Thriller',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'Royaume-Uni',
  },
  {
    title: "Chérie, j'ai rétréci les gosses",
    director: 'Joe Johnston',
    actors: [
      { name: 'Rick Moranis' },
      { name: 'Matt Frewer' },
      { name: 'Marcia Strassman' },
      { name: 'Kristine Sutherland' },
    ],
    coverUrl: '/movies_pictures/61BZ-7GX4IL._AC_UF1000,1000_QL80_.jpg',
    releaseDate: '1989-06-23',
    length: 93,
    genre: 'Comédie, Aventure, Famille',
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: 'États-Unis',
  },

  {
    title: 'Dragon Ball : Salut ! Son Goku et ses amis sont de retour !!',
    director: ' Yoshihiro Ueda',
    actors: [
      {
        name: 'Masako Nozawa',
      },
      {
        name: 'Ryō Horikawa',
      },
      {
        name: 'Mayumi Tanaka',
      },
      {
        name: 'Toshio Furukawa',
      },
    ],
    coverUrl: 'https://static.wikia.nocookie.net/dragonball/images/d/d9/Dragon_Ball_Ossu_Son_Gok%C3%BB_et_ses_amis_sont_de_retour.jpg/revision/latest?cb=20180731181819&path-prefix=fr',
    releaseDate: '2008-09-21',
    length: 35,
    genre: 'Anime',
    saga: 'Dragon Ball',
    description: '',
    countryOrigin: 'Japon',
  },
];
