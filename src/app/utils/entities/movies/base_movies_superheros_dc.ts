import { BaseMovie, OscarEnum } from '../../../models/movie-model';

export const baseMoviesSuperHerosDc: BaseMovie[] = [
  {
    title: 'Batman : Le Film',
    director: 'Leslie H. Martinson',
    actors: [
      { name: 'Adam West' },
      { name: 'Burt Ward' },
      { name: 'Cesar Romero' },
      { name: 'Lee Meriwether' },
      { name: 'Burgess Meredith' },
      { name: 'Frank Gorshin' },
      { name: 'Alan Napier' },
    ],
    coverUrl: '/movies_pictures/0f33ed902452.jpg',
    releaseDate: '1966-07-30',
    length: 105,
    genre: ['Action', 'Comédie'],
    saga: 'Batman',
    description: 'Batman et Robin affrontent les Quatre Fantastiques du crime dans une comédie camp des années 60.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Green Lantern',
    director: 'Martin Campbell',
    actors: [
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Blake Lively',
      },
      {
        name: 'Mark Strong',
      },
      {
        name: 'Peter Sarsgaard',
      },
      {
        name: 'Temuera Morrison',
      },
      {
        name: 'Tim Robbins',
      },
      {
        name: 'Angela Bassett',
      },
    ],
    coverUrl:
      '/movies_pictures/f6ef7e0937ec.jpg',
    releaseDate: '2011-06-17',
    length: 114,
    genre: ['Action'],
    saga: '',
    description: 'Le pilote Hal Jordan reçoit un anneau alien qui en fait un Green Lantern, gardien de la paix intergalactique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Batman',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Jack Palance',
      },
      {
        name: 'Michael Gough',
      },
      {
        name: 'Robert Wuhl',
      },
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Kim Basinger',
      },
      {
        name: 'Pat Hingle',
      },
    ],
    coverUrl:
      '/movies_pictures/1d03f0f98c3e.jpg',
    releaseDate: '1989-06-23',
    length: 126,
    genre: ['Action'],
    saga: 'Batman',
    description: 'Bruce Wayne devient Batman pour combattre le Joker, criminel psychotique qui terrorise Gotham City.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1990 },
    ],
  },
  {
    title: 'Batman Returns',
    director: 'Tim Burton',
    actors: [
      { name: 'Michael Keaton' },
      { name: 'Michelle Pfeiffer' },
      { name: 'Christopher Walken' },
      { name: 'Danny DeVito' },
    ],
    coverUrl: '/movies_pictures/9eda3f116cb7.jpeg',
    releaseDate: '1992-06-19',
    length: 126,
    genre: ['Action'],
    saga: 'Batman',
    description: 'Batman affronte le Pingouin et la Catwoman dans une Gotham City sombre et gothique.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Batman Forever',
    director: 'Joel Schumacher',
    actors: [
      {
        name: 'Val Kilmer',
      },
      {
        name: 'Tommy Lee Jones',
      },
      {
        name: 'Jim Carrey',
      },
      {
        name: "Chris O'Donnell",
      },
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Drew Barrymore',
      },
      {
        name: 'Debi Mazar',
      },
    ],
    coverUrl:
      '/movies_pictures/40bc70e5ac02.jpg',
    releaseDate: '1995-06-16',
    length: 121,
    genre: ['Action'],
    saga: 'Batman',
    description: 'Batman, avec Robin, affronte le Double-Face et le Sphinx, criminel obsédé par les énigmes.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Batman & Robin',
    director: 'Joel Schumacher',
    actors: [
      {
        name: 'George Clooney',
      },
      {
        name: "Chris O'Donnell",
      },
      {
        name: 'Alicia Silverstone',
      },
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Uma Thurman',
      },
      {
        name: 'Michael Gough',
      },
      {
        name: 'Pat Hingle',
      },
    ],
    coverUrl:
      '/movies_pictures/0cfc249a14b5.jpg',
    releaseDate: '1997-06-20',
    length: 125,
    genre: ['Action'],
    saga: 'Batman',
    description: 'Batman et Robin combattent Mr. Freeze et Poison Ivy qui complotent de geler Gotham City.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Batman Begins',
    director: 'Christopher Nolan',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Liam Neeson',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Gary Oldman',
      },
      {
        name: 'Cillian Murphy',
      },
      {
        name: 'Michael Caine',
      },
    ],
    coverUrl: '/movies_pictures/99b9c64d6eac.jpg',
    releaseDate: '2005-06-15',
    length: 140,
    genre: ['Action'],
    saga: 'The Dark Knight',
    description: 'Origines de Bruce Wayne : entraîné par la Ligue des Ombres, il devient Batman pour sauver Gotham de la corruption.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'The Dark Knight : Le Chevalier Noir',
    director: 'Christopher Nolan',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Gary Oldman',
      },
      {
        name: 'Michael Caine',
      },
      {
        name: 'Heath Ledger',
      },
    ],
    coverUrl: '/movies_pictures/4fc79ac8ba39.jpg',
    releaseDate: '2008-07-18',
    length: 152,
    genre: ['Action'],
    saga: 'The Dark Knight',
    description: 'Batman affronte le Joker, anarchiste qui plonge Gotham dans le chaos pour tester les limites morales du héros.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR, year: 2009 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2009 },
    ],
  },
  {
    title: 'The Dark Knight Rises',
    director: 'Christopher Nolan',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Tom Hardy',
      },
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Gary Oldman',
      },
      {
        name: 'Michael Caine',
      },
    ],
    coverUrl: '/movies_pictures/5138fc727503.jpg',
    releaseDate: '2012-07-20',
    length: 164,
    genre: ['Action'],
    saga: 'The Dark Knight',
    description: 'Batman sort de sa retraite pour affronter Bane, qui veut détruire Gotham avec une bombe nucléaire.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'The Batman',
    director: 'Matt Reeves',
    actors: [
      {
        name: 'Robert Pattinson',
      },
      {
        name: 'Zoë Kravitz',
      },
      {
        name: 'Jeffrey Wright',
      },
      {
        name: 'Andy Serkis',
      },
      {
        name: 'Colin Farrell',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Peter Sarsgaard',
      },
    ],
    coverUrl: '/movies_pictures/fcf6e73c6ccb.jpg',
    releaseDate: '2022-03-04',
    length: 176,
    genre: ['Action'],
    saga: '',
    description: 'Une jeune version de Batman enquête sur des meurtres de figures politiques de Gotham menés par le Sphinx.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Batman v Superman : L'Aube de la Justice",
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Henry Cavill',
      },
      {
        name: 'Jesse Eisenberg',
      },
      {
        name: 'Gal Gadot',
      },
      {
        name: 'Jeremy Irons',
      },
      {
        name: 'Amy Adams',
      },
    ],
    coverUrl: '/movies_pictures/df9028c7f49d.jpg',
    releaseDate: '2016-03-25',
    length: 151,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Batman et Superman s\'affrontent avant de s\'unir contre Lex Luthor qui manipule les deux héros.',
    fromEntity: {
      entityType: 'comic',
      title: 'Batman',
      secondEntityKey: 'Bill Finger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Shazam!',
    director: 'David F. Sandberg',
    actors: [
      {
        name: 'Asher Angel',
      },
      {
        name: 'Zachary Levi',
      },
      {
        name: 'Mark Strong',
      },
      {
        name: 'Djimon Hounsou',
      },
      {
        name: 'Grace Fulton',
      },
      {
        name: 'Jack Dylan Grazer',
      },
      {
        name: 'Ian Chen',
      },
    ],
    coverUrl:
      '/movies_pictures/279411f0d61a.jpg',
    releaseDate: '2019-04-05',
    length: 132,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Le jeune Billy Batson devient un super-héros adulte en prononçant le mot Shazam, affrontant le Dr. Sivana.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Shazam! La Rage des Dieux',
    director: 'David F. Sandberg',
    actors: [
      {
        name: 'Zachary Levi',
      },
      {
        name: 'Asher Angel',
      },
      {
        name: 'Jack Dylan Grazer',
      },
      {
        name: 'Lucy Liu',
      },
      {
        name: 'Helen Mirren',
      },
      {
        name: 'Rachel Zegler',
      },
      {
        name: 'Djimon Hounsou',
      },
    ],
    coverUrl:
      '/movies_pictures/0c575d603736.jpg',
    releaseDate: '2023-03-29',
    length: 130,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Shazam et sa famille de super-héros affrontent les Filles de Atlas, déesses de la mythologie grecque.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Aquaman',
    director: 'James Wan',
    actors: [
      {
        name: 'Jason Momoa',
      },
      {
        name: 'Amber Heard',
      },
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Dolph Lundgren',
      },
      {
        name: 'Patrick Wilson',
      },
      {
        name: 'Willem Dafoe',
      },
      {
        name: 'Yahya Abdul-Mateen II',
      },
    ],
    coverUrl:
      '/movies_pictures/edc2d5337a44.jpg',
    releaseDate: '2018-12-21',
    length: 143,
    genre: ['Action', 'Aventure'],
    saga: 'DCEU',
    description: 'Arthur Curry découvre qu\'il est l\'héritier de l\'Atlantide et doit revendiquer le trône face à son demi-frère Orm.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Aquaman et le Royaume perdu',
    director: 'James Wan',
    actors: [
      {
        name: 'Jason Momoa',
      },
      {
        name: 'Patrick Wilson',
      },
      {
        name: 'Amber Heard',
      },
      {
        name: 'Yahya Abdul-Mateen II',
      },
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Dolph Lundgren',
      },
      {
        name: 'Randall Park',
      },
    ],
    coverUrl:
      '/movies_pictures/6ee89ddb8f35.jpg',
    releaseDate: '2023-12-20',
    length: 124,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Aquaman doit protéger Atlantis et son fils contre Black Manta et un ancien roi emprisonné.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Black Adam',
    director: 'Jaume Collet-Serra',
    actors: [
      {
        name: 'Dwayne Johnson',
      },
      {
        name: 'Sarah Shahi',
      },
      {
        name: 'Aldis Hodge',
      },
      {
        name: 'Noah Centineo',
      },
      {
        name: 'Quintessa Swindell',
      },
      {
        name: 'Pierce Brosnan',
      },
      {
        name: 'Marwan Kenzari',
      },
    ],
    coverUrl:
      '/movies_pictures/3d6380beacea.jpg',
    releaseDate: '2022-10-21',
    length: 125,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Teth-Adam, ancien champion magique libéré après 5000 ans, impose sa justice brutale sur le monde moderne.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Justice League',
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Henry Cavill',
      },
      {
        name: 'Gal Gadot',
      },
      {
        name: 'Amy Adams',
      },
      {
        name: 'Jeremy Irons',
      },
    ],
    coverUrl:
      '/movies_pictures/bdc00735768d.jpg',
    releaseDate: '2017-11-15',
    length: 121,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Batman et Wonder Woman recrutent une équipe de super-héros pour affronter Steppenwolf et ses parademons.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: "Zack Snyder's Justice League",
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Henry Cavill',
      },
      {
        name: 'Gal Gadot',
      },
      {
        name: 'Jeremy Irons',
      },
      {
        name: 'Amy Adams',
      },
    ],
    coverUrl:
      '/movies_pictures/3e2e7fe6514a.jpg',
    releaseDate: '2021-03-18',
    length: 242,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Version étendue où Batman, Wonder Woman, Flash, Aquaman et Cyborg unissent leurs forces contre Darkseid.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Suicide Squad',
    director: 'David Ayer',
    actors: [
      {
        name: 'Jared Leto',
      },
      {
        name: 'Will Smith',
      },
      {
        name: 'Margot Robbie',
      },
      {
        name: 'Adewale Akinnuoye-Agbaje',
      },
      {
        name: 'Jai Courtney',
      },
      {
        name: 'Joel Kinnaman',
      },
      {
        name: 'Cara Delevingne',
      },
    ],
    coverUrl:
      '/movies_pictures/b206f462b01d.jpg',
    releaseDate: '2016-08-05',
    length: 123,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Des super-vilains sont recrutés par le gouvernement pour une mission suicide contre une menace mystique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MAKEUP, year: 2017 },
    ],
  },
  {
    title: 'The Suicide Squad',
    director: 'James Gunn',
    actors: [
      {
        name: 'Margot Robbie',
      },
      {
        name: 'Idris Elba',
      },
      {
        name: 'John Cena',
      },
      {
        name: 'Joel Kinnaman',
      },
      {
        name: 'Sylvester Stallone',
      },
      {
        name: 'Viola Davis',
      },
      {
        name: 'Daniela Melchior',
      },
    ],
    coverUrl:
      '/movies_pictures/ed62b69040e8.jpg',
    releaseDate: '2021-07-28',
    length: 132,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Amanda Waller envoie une nouvelle équipe de criminels sur l\'île de Corto Maltese pour détruire une installation secrète.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Superman',
    director: 'Richard Donner',
    actors: [
      {
        name: 'Marlon Brando',
      },
      {
        name: 'Gene Hackman',
      },
      {
        name: 'Christopher Reeve',
      },
      {
        name: 'Margot Kidder',
      },
      {
        name: 'Jackie Cooper',
      },
      {
        name: 'Ned Beatty',
      },
      {
        name: 'Glenn Ford',
      },
    ],
    coverUrl: '/movies_pictures/Superman_affiche_film_1.webp',
    releaseDate: '1978-12-15',
    length: 143,
    genre: ['Action'],
    saga: 'Superman',
    description: 'Kal-El, dernier fils de Krypton, devient Superman et protège la Terre contre le génie criminel Lex Luthor.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1979 },
    ],
  },
  {
    title: 'Superman II',
    director: 'Richard Lester',
    actors: [
      {
        name: 'Christopher Reeve',
      },
      {
        name: 'Margot Kidder',
      },
      {
        name: 'Gene Hackman',
      },
      {
        name: 'Ned Beatty',
      },
      {
        name: 'Jackie Cooper',
      },
      {
        name: 'Sarah Douglas',
      },
      {
        name: "Jack O'Halloran",
      },
    ],
    coverUrl: '/movies_pictures/61a2Wp8ylUL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1980-12-12',
    length: 127,
    genre: ['Action'],
    saga: 'Superman',
    description: 'Superman affronte les trois criminels kryptoniens libérés de la Zone Fantôme qui veulent conquérir la Terre.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Superman III',
    director: 'Richard Lester',
    actors: [
      {
        name: 'Christopher Reeve',
      },
      {
        name: 'Richard Pryor',
      },
      {
        name: 'Margot Kidder',
      },
      {
        name: 'Annie Ross',
      },
      {
        name: 'Robert Vaughn',
      },
      {
        name: 'Pamela Stephenson',
      },
    ],
    coverUrl: '/movies_pictures/d601724afd5d.jpg',
    releaseDate: '1983-06-17',
    length: 125,
    genre: ['Action'],
    saga: 'Superman',
    description: 'Superman affronte un superordinateur et un homme d\'affaires corrompu qui manipule la technologie contre lui.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Superman IV : Le Face-à-face',
    director: 'Sidney J. Furie',
    actors: [
      {
        name: 'Christopher Reeve',
      },
      {
        name: 'Gene Hackman',
      },
      {
        name: 'Jackie Cooper',
      },
      {
        name: 'Marc McClure',
      },
      {
        name: 'Jon Cryer',
      },
      {
        name: 'Sam Wanamaker',
      },
      {
        name: 'Mariel Hemingway',
      },
    ],
    coverUrl:
      '/movies_pictures/22717ad30430.jpg',
    releaseDate: '1987-10-28',
    length: 90,
    genre: ['Action'],
    saga: 'Superman',
    description: 'Superman crée un Superman nucléaire pour détruire les armes atomiques, mais son clone devient une menace.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Superman Returns',
    director: 'Bryan Singer',
    actors: [
      {
        name: 'Brandon Routh',
      },
      {
        name: 'Kate Bosworth',
      },
      {
        name: 'Kevin Spacey',
      },
      {
        name: 'Frank Langella',
      },
      {
        name: 'Sam Huntington',
      },
      {
        name: 'James Marsden',
      },
      {
        name: 'Parker Posey',
      },
    ],
    coverUrl: '/movies_pictures/18648048.jpg',
    releaseDate: '2006-06-28',
    length: 154,
    genre: ['Action'],
    saga: 'Superman',
    description: 'Superman revient sur Terre après cinq ans d\'absence et découvre que Lex Luthor complote à nouveau.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Man of Steel',
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Henry Cavill',
      },
      {
        name: 'Amy Adams',
      },
      {
        name: 'Laurence Fishburne',
      },
      {
        name: 'Kevin Costner',
      },
      {
        name: 'Russell Crowe',
      },
    ],
    coverUrl: '/movies_pictures/d2286601b68e.jpg',
    releaseDate: '2013-06-14',
    length: 143,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Origines de Clark Kent qui découvre ses pouvoirs kryptoniens et affronte le général Zod sur Terre.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Superman',
    director: 'James Gunn',
    actors: [
      {
        name: 'David Corenswet',
      },
      {
        name: 'Rachel Brosnahan',
      },
      {
        name: 'Nicholas Hoult',
      },
      {
        name: 'Edi Gathegi',
      },
      {
        name: 'Anthony Carrigan',
      },
      {
        name: 'Nathan Fillion',
      },
      {
        name: 'Isabela Merced',
      },
    ],
    coverUrl: '/movies_pictures/superman_2025.jpg',
    releaseDate: '2025-07-11',
    length: 150,
    genre: ['Action'],
    saga: 'DCU',
    description: 'Superman, jeune héros de Metropolis, doit prouver son humanité tout en protégeant la Terre de nouvelles menaces.',
    fromEntity: {
      entityType: 'comic',
      title: 'Superman',
      secondEntityKey: 'Jerry Siegel',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Watchmen : Les Gardiens',
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Billy Crudup',
      },
      {
        name: 'Patrick Wilson',
      },
      {
        name: 'Jackie Earle Haley',
      },
      {
        name: 'Malin Åkerman',
      },
      {
        name: 'Carla Gugino',
      },
      {
        name: 'Matthew Goode',
      },
      {
        name: 'Jeffrey Dean Morgan',
      },
    ],
    coverUrl: '/movies_pictures/6ee97770a455.jpg',
    releaseDate: '2009-03-06',
    length: 162,
    genre: ['Action'],
    saga: '',
    description: 'Dans un monde alternatif des années 80, des justiciers vétérans enquêtent sur le meurtre d\'un de leurs membres.',
    fromEntity: {
      entityType: 'comic',
      title: 'Watchmen',
      secondEntityKey: 'Alan Moore',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Catwoman',
    director: 'Pitof',
    actors: [
      {
        name: 'Halle Berry',
      },
      {
        name: 'Benjamin Bratt',
      },
      {
        name: 'Sharon Stone',
      },
      {
        name: 'Lambert Wilson',
      },
      {
        name: 'Frances Conroy',
      },
      {
        name: 'Alex Borstein',
      },
      {
        name: 'Michael Massee',
      },
    ],
    coverUrl: '/movies_pictures/7be50acab74f.jpg',
    releaseDate: '2004-07-23',
    length: 104,
    genre: ['Action'],
    saga: '',
    description: 'Une employée de bureau ressuscitée par un chat mystique devient Catwoman et affronte un magnat de la beauté corrompu.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Wonder Woman',
    director: 'Patty Jenkins',
    actors: [
      {
        name: 'Lynda Carter',
      },
      {
        name: 'Lyle Waggoner',
      },
      {
        name: 'Norman Burton',
      },
      {
        name: 'Richard Eastham',
      },
      {
        name: 'David Hedison',
      },
      {
        name: 'Stella Stevens',
      },
      {
        name: 'Robert Alda',
      },
    ],
    coverUrl:
      '/movies_pictures/8d968df64832.jpg',
    releaseDate: '2017-06-02',
    length: 141,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Diana, princesse des Amazones, quitte Themyscira pour combattre Ares, dieu de la guerre, pendant la Première Guerre mondiale.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Wonder Woman 1984',
    director: 'Patty Jenkins',
    actors: [
      {
        name: 'Gal Gadot',
      },
      {
        name: 'Kristen Wiig',
      },
      {
        name: 'Pedro Pascal',
      },
      {
        name: 'Chris Pine',
      },
      {
        name: 'Lynda Carter',
      },
      {
        name: 'Sia Alipour',
      },
      {
        name: 'Natasha Rothwell',
      },
    ],
    coverUrl:
      '/movies_pictures/31f21ae46b2d.jpg',
    releaseDate: '2020-12-25',
    length: 151,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Diana affronte Cheetah et Maxwell Lord dans les années 80, alors qu\'un artefact magique exauce les vœux au prix de chaos.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'The Flash',
    director: 'Andy Muschietti',
    actors: [
      {
        name: 'Ezra Miller',
      },
      {
        name: 'Kiersey Clemons',
      },
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Ron Livingston',
      },
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Sasha Calle',
      },
      {
        name: 'Maribel Verdú',
      },
    ],
    coverUrl:
      '/movies_pictures/327e3fb09c95.jpg',
    releaseDate: '2023-06-16',
    length: 144,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Barry Allen utilise ses pouvoirs de vitesse pour voyager dans le temps et sauver sa mère, bouleversant le multivers.',
    fromEntity: {
      entityType: 'comic',
      title: 'Flashpoint : Édition 10 ans',
      secondEntityKey: 'Geoff Johns',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Birds of Prey',
    director: 'Cathy Yan',
    actors: [
      {
        name: 'Ashley Scott',
      },
      {
        name: 'Dina Meyer',
      },
      {
        name: 'Rachel Skarsten',
      },
      {
        name: 'Shemar Moore',
      },
      {
        name: 'Mia Sara',
      },
      {
        name: 'Ian Abercrombie',
      },
    ],
    coverUrl:
      '/movies_pictures/1352883567cc.jpg',
    releaseDate: '2020-02-07',
    length: 109,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Harley Quinn s\'allie à des héroïnes de Gotham pour affronter le criminel Black Mask et son bras droit Zsasz.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
  {
    title: 'Blue Beetle',
    director: 'Angel Manuel Soto',
    actors: [
      {
        name: 'Xolo Maridueña',
      },
      {
        name: 'Bruna Marquezine',
      },
      {
        name: 'Belissa Escobedo',
      },
      {
        name: 'George Lopez',
      },
      {
        name: 'Adriana Barraza',
      },
    ],
    coverUrl:
      '/movies_pictures/6674ca94a968.jpg',
    releaseDate: '2023-08-16',
    length: 127,
    genre: ['Action'],
    saga: 'DCEU',
    description: 'Jaime Reyes fusionne avec une relique alien et devient Blue Beetle, cible d\'une corporation qui veut son scarabée.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 15,
    oscars: [],
  },
];
