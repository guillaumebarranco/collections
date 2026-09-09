import { BaseMovie, OscarEnum } from '../../../models/movie-model';

export const baseMoviesSagaScienceFiction: BaseMovie[] = [
  {
    title: 'Star Wars : Épisode 1 - La menace fantôme',
    director: 'George Lucas',
    actors: [
      {
        name: 'Liam Neeson',
      },
      {
        name: 'Ewan McGregor',
      },
      {
        name: 'Natalie Portman',
      },
      {
        name: 'Jake Lloyd',
      },
      {
        name: 'Ian McDiarmid',
      },
      {
        name: 'Pernilla August',
      },
      {
        name: 'Ray Park',
      },
    ],
    coverUrl: '/movies_pictures/ca526fe13a7b.jpg',
    releaseDate: '1999-05-19',
    length: 136,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Jedi et Sith s\'affrontent alors que le jeune Anakin Skywalker, esclave sur Tatooine, est découvert comme un puissant utilisateur de la Force.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: "Star Wars: Episode 2 - L'attaque des clones",
    director: 'George Lucas',
    actors: [
      {
        name: 'Ewan McGregor',
      },
      {
        name: 'Natalie Portman',
      },
      {
        name: 'Hayden Christensen',
      },
      {
        name: 'Christopher Lee',
      },
      {
        name: 'Samuel L. Jackson',
      },
      {
        name: 'Ian McDiarmid',
      },
      {
        name: 'Frank Oz',
      },
    ],
    coverUrl: '/movies_pictures/ca700bcc1b8b.jpg',
    releaseDate: '2002-05-16',
    length: 142,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Anakin et Padmé Amidala fuient des assassins pendant que la République crée une armée de clones et que la guerre civile galactique éclate.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: 'Star Wars : Épisode 3 - La revanche des Sith',
    director: 'George Lucas',
    actors: [
      {
        name: 'Ewan McGregor',
      },
      {
        name: 'Natalie Portman',
      },
      {
        name: 'Hayden Christensen',
      },
      {
        name: 'Ian McDiarmid',
      },
      {
        name: 'Samuel L. Jackson',
      },
      {
        name: 'Christopher Lee',
      },
      {
        name: 'Frank Oz',
      },
    ],
    coverUrl: '/movies_pictures/06247443ac89.jpg',
    releaseDate: '2005-05-19',
    length: 140,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Anakin bascule du côté obscur pour devenir Dark Vador tandis que l\'Empire galactique naît de la chute de la République et de l\'ordre Jedi.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: 'Star Wars : Episode 4 - Un nouvel espoir',
    director: 'George Lucas',
    actors: [
      {
        name: 'Mark Hamill',
      },
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Carrie Fisher',
      },
      {
        name: 'Alec Guinness',
      },
      {
        name: 'Peter Cushing',
      },
      {
        name: 'Anthony Daniels',
      },
      {
        name: 'Kenny Baker',
      },
    ],
    coverUrl: '/movies_pictures/b1cec9c9ab78.jpg',
    releaseDate: '1977-05-25',
    length: 121,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Le jeune Luke Skywalker rejoint la Rébellion pour détruire l\'Étoile Noire impériale et libérer la princesse Leia des griffes de Dark Vador.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1978 },
    ],
  },
  {
    title: "Star Wars : Episode 5 - L'empire contre-attaque",
    director: 'Irvin Kershner',
    actors: [
      {
        name: 'Mark Hamill',
      },
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Carrie Fisher',
      },
      {
        name: 'Billy Dee Williams',
      },
      {
        name: 'Anthony Daniels',
      },
      {
        name: 'David Prowse',
      },
      {
        name: 'Frank Oz',
      },
    ],
    coverUrl: '/movies_pictures/d15f5e4674bb.jpg',
    releaseDate: '1980-05-21',
    length: 124,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Les rebelles subissent une défaite sur Hoth et Luke apprend la vérité sur son père lors d\'un affrontement avec Dark Vador.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1981 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1981 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1981 },
    ],
  },
  {
    title: 'Star Wars : Episode 6 - Le retour du Jedi',
    director: 'Richard Marquand',
    actors: [
      {
        name: 'Mark Hamill',
      },
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Carrie Fisher',
      },
      {
        name: 'Billy Dee Williams',
      },
      {
        name: 'Anthony Daniels',
      },
      {
        name: 'Ian McDiarmid',
      },
      {
        name: 'Frank Oz',
      },
    ],
    coverUrl: '/movies_pictures/ec84b829ebea.jpg',
    releaseDate: '1983-05-25',
    length: 131,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Luke tente de ramener Vador vers le côté lumineux pendant que l\'Alliance rebelle prépare l\'assaut final contre l\'Étoile de la Mort.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1984 }],
  },
  {
    title: 'Star Wars : Episode 7 - Le réveil de la Force',
    director: 'J.J. Abrams',
    actors: [
      {
        name: 'Daisy Ridley',
      },
      {
        name: 'John Boyega',
      },
      {
        name: 'Adam Driver',
      },
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Carrie Fisher',
      },
      {
        name: 'Oscar Isaac',
      },
      {
        name: 'Domhnall Gleeson',
      },
    ],
    coverUrl: '/movies_pictures/c8d02434fd96.jpg',
    releaseDate: '2015-12-18',
    length: 138,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Trente ans après la bataille d\'Endor, Rey découvre la Force et rejoint la Résistance pour affronter le Premier Ordre et Kylo Ren.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: 'Star Wars : Episode 8 - Le dernier Jedi',
    director: 'Rian Johnson',
    actors: [
      {
        name: 'Daisy Ridley',
      },
      {
        name: 'John Boyega',
      },
      {
        name: 'Adam Driver',
      },
      {
        name: 'Mark Hamill',
      },
    ],
    coverUrl: '/movies_pictures/bf2180c057ea.jpg',
    releaseDate: '2017-12-15',
    length: 152,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Rey cherche Luke Skywalker pour être formée tandis que la Résistance subit un siège désespéré face à l\'amiral Holdo et à Kylo Ren.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: "Star Wars : Episode 9 - L'ascension de Skywalker",
    director: 'J.J. Abrams',
    actors: [
      {
        name: 'Daisy Ridley',
      },
      {
        name: 'John Boyega',
      },
      {
        name: 'Adam Driver',
      },
      {
        name: 'Oscar Isaac',
      },
      {
        name: 'Carrie Fisher',
      },
      {
        name: 'Mark Hamill',
      },
      {
        name: 'Ian McDiarmid',
      },
    ],
    coverUrl: '/movies_pictures/e1419bbb3ede.png',
    releaseDate: '2019-12-20',
    length: 142,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Rey affronte l\'Empereur Palpatine ressuscité et découvre ses origines dans un affrontement final qui détermine le destin de la galaxie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 40,
    oscars: [],
  },
  {
    title: 'Solo: A Star Wars Story',
    director: 'Ron Howard',
    actors: [
      {
        name: 'Emilia Clarke',
      },
      {
        name: 'Alden Ehrenreich',
      },
      {
        name: 'Donald Glover',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Joonas Suotamo',
      },
      {
        name: 'Thandiwe Newton',
      },
      {
        name: 'Paul Bettany',
      },
    ],
    coverUrl: '/movies_pictures/525da0d5ccb3.jpg',
    releaseDate: '2018-05-25',
    length: 135,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Avant la Rébellion, le jeune Han Solo s\'engage dans des courses clandestines et rencontre Chewbacca et Lando Calrissian dans une aventure criminelle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Rogue One : A Star Wars Story',
    director: 'Gareth Edwards',
    actors: [
      {
        name: 'Felicity Jones',
      },
      {
        name: 'Diego Luna',
      },
      {
        name: 'Riz Ahmed',
      },
      {
        name: 'Ben Mendelsohn',
      },
      {
        name: 'Donnie Yen',
      },
      {
        name: 'Jiang Wen',
      },
      {
        name: 'Forest Whitaker',
      },
    ],
    coverUrl: '/movies_pictures/87ffedfe2ebd.jpg',
    releaseDate: '2016-12-16',
    length: 133,
    genre: ['Science Fiction'],
    saga: 'Star Wars',
    description: 'Des rebelles volontaires volent les plans de l\'Étoile Noire dans une mission suicide qui précède directement les événements du premier épisode.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Terminator',
    director: 'James Cameron',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Michael Biehn',
      },
      {
        name: 'Linda Hamilton',
      },
      {
        name: 'Paul Winfield',
      },
      {
        name: 'Earl Boen',
      },
      {
        name: 'Lance Henriksen',
      },
      {
        name: 'Rick Rossovich',
      },
    ],
    coverUrl: '/movies_pictures/edda4f33d071.jpg',
    releaseDate: '1984-10-26',
    length: 107,
    genre: ['Science Fiction'],
    saga: 'Terminator',
    description: 'Un cyborg tueur est envoyé de 2029 en 1984 pour assassiner Sarah Connor, mère du futur leader de la résistance humaine contre les machines.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Terminator 2 : Le Jugement dernier',
    director: 'James Cameron',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Edward Furlong',
      },
      {
        name: 'Linda Hamilton',
      },
      {
        name: 'Robert Patrick',
      },
      {
        name: 'Earl Boen',
      },
      {
        name: 'Joe Morton',
      },
      {
        name: 'S. Epatha Merkerson',
      },
    ],
    coverUrl: '/movies_pictures/66a2315e110f.jpg',
    releaseDate: '1991-07-03',
    length: 137,
    genre: ['Action'],
    saga: 'Terminator',
    description: 'Un Terminator reprogrammé protège le jeune John Connor contre un T-1000 liquide envoyé pour l\'éliminer avant le Jugement dernier.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1992 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1992 },
      { type: OscarEnum.OSCAR_BEST_MAKEUP, year: 1992 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1992 },
    ],
  },
  {
    title: 'Terminator 3 : Le Soulèvement des machines',
    director: 'Jonathan Mostow',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Nick Stahl',
      },
      {
        name: 'Claire Danes',
      },
      {
        name: 'Kristanna Loken',
      },
      {
        name: 'Earl Boen',
      },
      {
        name: 'Christopher Lawford',
      },
      {
        name: 'Chris Hardwick',
      },
    ],
    coverUrl: '/movies_pictures/16336a1c0e11.jpg',
    releaseDate: '2003-07-02',
    length: 109,
    genre: ['Action'],
    saga: 'Terminator',
    description: 'John Connor adulte affronte un Terminator féminin T-X alors que Skynet devient autonome et déclenche l\'apocalypse nucléaire.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Terminator Renaissance',
    director: 'McG',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Sam Worthington',
      },
      {
        name: 'Anton Yelchin',
      },
      {
        name: 'Bryce Dallas Howard',
      },
      {
        name: 'Moon Bloodgood',
      },
      {
        name: 'Common',
      },
      {
        name: 'Helena Bonham Carter',
      },
    ],
    coverUrl: '/movies_pictures/2f4847487a69.jpg',
    releaseDate: '2009-05-21',
    length: 115,
    genre: ['Action'],
    saga: 'Terminator',
    description: 'Marcus Wright, condamné à mort, se réveille en 2018 et découvre qu\'il est au cœur d\'un complot de Skynet visant John Connor.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Terminator Genisys',
    director: 'Alan Taylor',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Emilia Clarke',
      },
      {
        name: 'Jason Clarke',
      },
      {
        name: 'Jai Courtney',
      },
      {
        name: 'Lee Byung-hun',
      },
      {
        name: 'Matt Smith',
      },
      {
        name: 'J. K. Simmons',
      },
    ],
    coverUrl: '/movies_pictures/fc64034c401a.jpg',
    releaseDate: '2015-07-01',
    length: 126,
    genre: ['Action'],
    saga: 'Terminator',
    description: 'Les événements de 1984 sont altérés, créant une timeline où Sarah Connor a été élevée par un Terminator protecteur depuis l\'enfance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Terminator: Dark Fate',
    director: 'Tim Miller',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Linda Hamilton',
      },
      {
        name: 'Diego Boneta',
      },
      {
        name: 'Mackenzie Davis',
      },
      {
        name: 'Natalia Reyes',
      },
      {
        name: 'Gabriel Luna',
      },
      {
        name: 'Tom Hopper',
      },
    ],
    coverUrl: '/movies_pictures/6913e2000f99.jpg',
    releaseDate: '2019-11-01',
    length: 128,
    genre: ['Action'],
    saga: 'Terminator',
    description: 'Dani Ramos est traquée par un Rev-9 tandis que Sarah Connor et un Terminator vieillissant protègent la future leader de la résistance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Matrix',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: [
      {
        name: 'Laurence Fishburne',
      },
      {
        name: 'Carrie-Anne Moss',
      },
      {
        name: 'Joe Pantoliano',
      },
      {
        name: 'Hugo Weaving',
      },
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Gloria Foster',
      },
      {
        name: 'Julian Arahanga',
      },
    ],
    coverUrl: '/movies_pictures/13a1fc3bff74.jpg',
    releaseDate: '1999-03-31',
    length: 136,
    genre: ['Science Fiction'],
    saga: 'Matrix',
    description: 'Neo découvre que le monde qu\'il connaît est une simulation et rejoint la résistance pour combattre les machines qui asservissent l\'humanité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2000 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2000 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2000 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2000 },
    ],
  },
  {
    title: 'The Matrix Reloaded',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: [
      {
        name: 'Laurence Fishburne',
      },
      {
        name: 'Carrie-Anne Moss',
      },
      {
        name: 'Hugo Weaving',
      },
      {
        name: 'Gloria Foster',
      },
      {
        name: 'Lambert Wilson',
      },
      {
        name: 'Monica Bellucci',
      },
      {
        name: 'Daniel Bernhardt',
      },
    ],
    coverUrl: '/movies_pictures/48b0ecd2b872.jpg',
    releaseDate: '2003-05-15',
    length: 138,
    genre: ['Science Fiction'],
    saga: 'Matrix',
    description: 'Neo et les rebelles de Zion affrontent une armée de Sentinelles tandis que l\'Architect révèle la véritable nature de la Matrix.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'The Matrix Revolutions',
    director: 'Lana Wachowski, Lilly Wachowski',
    actors: [
      {
        name: 'Laurence Fishburne',
      },
      {
        name: 'Carrie-Anne Moss',
      },
      {
        name: 'Hugo Weaving',
      },
      {
        name: 'Lambert Wilson',
      },
      {
        name: 'Monica Bellucci',
      },
      {
        name: 'Nathaniel Lees',
      },
      {
        name: 'Jada Pinkett Smith',
      },
    ],
    coverUrl: '/movies_pictures/ae6f7378a37b.jpg',
    releaseDate: '2003-11-05',
    length: 129,
    genre: ['Science Fiction'],
    saga: 'Matrix',
    description: 'La guerre entre humains et machines atteint son paroxysme alors que Neo affronte l\'Agent Smith devenu une menace pour les deux mondes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Matrix Resurrections',
    director: 'Lana Wachowski',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Carrie-Anne Moss',
      },
      {
        name: 'Yahya Abdul-Mateen II',
      },
      {
        name: 'Jessica Henwick',
      },
      {
        name: 'Jonathan Groff',
      },
      {
        name: 'Neil Patrick Harris',
      },
      {
        name: 'Jada Pinkett Smith',
      },
    ],
    coverUrl: '/movies_pictures/929ebe08742b.jpg',
    releaseDate: '2021-12-22',
    length: 148,
    genre: ['Science Fiction'],
    saga: 'Matrix',
    description: 'Neo, de retour dans la Matrix sans se souvenir de son passé, doit retrouver Trinity et choisir à nouveau entre réalité et simulation.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien, le huitième passager',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Yaphet Kotto',
      },
      {
        name: 'Veronica Cartwright',
      },
      {
        name: 'Tom Skerritt',
      },
      {
        name: 'Harry Dean Stanton',
      },
      {
        name: 'John Hurt',
      },
      {
        name: 'Sigourney Weaver',
      },
      {
        name: 'Ian Holm',
      },
    ],
    coverUrl: '/movies_pictures/7567cbf283a8.jpg',
    releaseDate: '1979-05-25',
    length: 117,
    genre: ['Science Fiction', 'Horreur'],
    saga: 'Alien',
    description: 'L\'équipage du Nostromo découvre une créature extraterrestre qui les traque un à un dans les entrailles du vaisseau.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1980 }],
  },
  {
    title: 'Aliens, le retour',
    director: 'James Cameron',
    actors: [
      {
        name: 'William Hope',
      },
      {
        name: 'Paul Reiser',
      },
      {
        name: 'Bill Paxton',
      },
      {
        name: 'Jenette Goldstein',
      },
      {
        name: 'Al Matthews',
      },
      {
        name: 'Mark Rolston',
      },
      {
        name: 'Ricco Ross',
      },
    ],
    coverUrl: '/movies_pictures/15eef7bc9065.jpg',
    releaseDate: '1986-07-18',
    length: 137,
    genre: ['Science Fiction'],
    saga: 'Alien',
    description: 'Ripley retourne sur la lune LV-426 avec des marines coloniaux pour affronter une ruche entière de xénomorphes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1987 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1987 },
    ],
  },
  {
    title: 'Alien 3',
    director: 'David Fincher',
    actors: [
      {
        name: 'Sigourney Weaver',
      },
      {
        name: 'Charles S. Dutton',
      },
      {
        name: 'Charles Dance',
      },
      {
        name: 'Brian Glover',
      },
      {
        name: 'Ralph Brown',
      },
      {
        name: 'Paul McGann',
      },
      {
        name: 'Danny Webb',
      },
    ],
    coverUrl: '/movies_pictures/6b8d4505ce1f.jpg',
    releaseDate: '1992-05-22',
    length: 114,
    genre: ['Science Fiction', 'Horreur'],
    saga: 'Alien',
    description: 'Ripley, seule survivante d\'un crash, se retrouve dans une prison pénitentiaire où un alien émerge et décime les détenus.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien : La Résurrection',
    director: 'Jean-Pierre Jeunet',
    actors: [
      { name: 'Sigourney Weaver' },
      { name: 'Winona Ryder' },
      { name: 'Ron Perlman' },
      { name: 'Dominique Pinon' },
      { name: 'Michael Wincott' },
      { name: 'Brad Dourif' },
      { name: 'Dan Hedaya' },
    ],
    coverUrl: '/movies_pictures/39ff0d4211c0.jpg',
    releaseDate: '1997-11-26',
    length: 109,
    genre: ['Science Fiction'],
    saga: 'Alien',
    description: 'Deux cents ans après sa mort, Ripley est clonée avec un xénomorphe à bord et doit empêcher la créature d\'atteindre la Terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Prometheus',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Noomi Rapace',
      },
      {
        name: 'Michael Fassbender',
      },
      {
        name: 'Guy Pearce',
      },
      {
        name: 'Idris Elba',
      },
      {
        name: 'Logan Marshall-Green',
      },
      {
        name: 'Charlize Theron',
      },
      {
        name: 'Rafe Spall',
      },
    ],
    coverUrl: '/movies_pictures/7442901095a0.jpg',
    releaseDate: '2012-06-08',
    length: 124,
    genre: ['Science Fiction'],
    saga: 'Alien',
    description: 'Une équipe d\'explorateurs découvre les origines de l\'humanité sur une lune lointaine et libère une créature biologique mortelle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien: Covenant',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Michael Fassbender',
      },
      {
        name: 'Katherine Waterston',
      },
      {
        name: 'Danny McBride',
      },
      {
        name: 'Billy Crudup',
      },
      {
        name: 'Demián Bichir',
      },
      {
        name: 'Carmen Ejogo',
      },
      {
        name: 'Amy Seimetz',
      },
    ],
    coverUrl: '/movies_pictures/ca278df70117.jpg',
    releaseDate: '2017-05-10',
    length: 122,
    genre: ['Science Fiction', 'Horreur', 'Thriller'],
    saga: 'Alien',
    description: 'L\'équipage du Covenant colonise une planète apparemment paradisiaque où David, l\'androïde de Prometheus, prépare une nouvelle forme de vie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien : Romulus',
    director: 'Fede Alvarez',
    actors: [
      {
        name: 'Cailee Spaeny',
      },
      {
        name: 'David Jonsson',
      },
      {
        name: 'Archie Renaux',
      },
      {
        name: 'Isabela Merced',
      },
      {
        name: 'Spike Fearn',
      },
      {
        name: 'Aileen Wu',
      },
      {
        name: 'Rosie Ede',
      },
    ],
    coverUrl: '/movies_pictures/95e6e7dddc97.jpg',
    releaseDate: '2024-08-16',
    length: 119,
    genre: ['Horreur', 'Science Fiction', 'Thriller'],
    saga: '',
    description: 'De jeunes colons piégés sur une station spatiale délabrée découvrent des expériences horribles liées au programme Weyland-Yutani.',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Predator',
    director: 'John McTiernan',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Carl Weathers',
      },
      {
        name: 'Bill Duke',
      },
      {
        name: 'Kevin Peter Hall',
      },
      {
        name: 'Sonny Landham',
      },
      {
        name: 'Jesse Ventura',
      },
      {
        name: 'Shane Black',
      },
    ],
    coverUrl: '/movies_pictures/19b59d030093.jpg',
    releaseDate: '1987-06-12',
    length: 107,
    genre: ['Action'],
    saga: 'Predator',
    description: 'Un commando américain en mission en Amérique centrale est traqué par un chasseur extraterrestre invisible qui collectionne les crânes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Predator 2',
    director: 'Stephen Hopkins',
    actors: [
      {
        name: 'Danny Glover',
      },
      {
        name: 'Kevin Peter Hall',
      },
      {
        name: 'María Conchita Alonso',
      },
      {
        name: 'Gary Busey',
      },
      {
        name: 'Bill Paxton',
      },
      {
        name: 'Rubén Blades',
      },
      {
        name: 'Adam Baldwin',
      },
    ],
    coverUrl: '/movies_pictures/63b4526e818f.jpg',
    releaseDate: '1990-11-21',
    length: 108,
    genre: ['Action'],
    saga: 'Predator',
    description: 'Un Predator chasse des gangsters et des policiers à Los Angeles pendant une canicule, affrontant un lieutenant déterminé.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Predators',
    director: 'Nimród Antal',
    actors: [
      {
        name: 'Adrien Brody',
      },
      {
        name: 'Topher Grace',
      },
      {
        name: 'Alice Braga',
      },
      {
        name: 'Walton Goggins',
      },
      {
        name: 'Danny Trejo',
      },
      {
        name: 'Oleg Taktarov',
      },
      {
        name: 'Mahershalalhashbaz Ali',
      },
    ],
    coverUrl: '/movies_pictures/16824920babc.jpg',
    releaseDate: '2010-07-09',
    length: 107,
    genre: ['Action'],
    saga: 'Predator',
    description: 'Des guerriers d\'élite de différentes époques se réveillent sur une planète utilisée comme terrain de chasse par les Predators.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },

  {
    title: 'The Predator',
    director: 'Shane Black',
    actors: [
      {
        name: 'Boyd Holbrook',
      },
      {
        name: 'Olivia Munn',
      },
      {
        name: 'Thomas Jane',
      },
      {
        name: 'Jake Busey',
      },
      {
        name: 'Trevante Rhodes',
      },
      {
        name: 'Keegan-Michael Key',
      },
      {
        name: 'Sterling K. Brown',
      },
    ],
    coverUrl: '/movies_pictures/de60c0ece1b1.jpg',
    releaseDate: '2018-09-14',
    length: 107,
    genre: ['Action'],
    saga: 'Predator',
    description: 'Un Predator crashé sur Terre déclenche une chasse impliquant un ancien sniper et un programme militaire secret.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Prey',
    director: 'Dan Trachtenberg',
    actors: [
      {
        name: 'Amber Midthunder',
      },
      {
        name: 'Michelle Thrush',
      },
      {
        name: 'Julian Black Antelope',
      },
      {
        name: 'Dane DiLiegro',
      },
      {
        name: 'Dakota Beavers',
      },
    ],
    coverUrl: '/movies_pictures/4118325816a4.png',
    releaseDate: '2022-08-05',
    length: 100,
    genre: ['Action'],
    saga: 'Predator',
    description: 'En 1719, une guerrière Comanche affronte un Predator qui traque sa tribu dans la forêt nord-américaine.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien vs. Predator',
    director: 'Paul W.S. Anderson',
    actors: [
      {
        name: 'Sanaa Lathan',
      },
      {
        name: 'Lance Henriksen',
      },
      {
        name: 'Raoul Bova',
      },
      {
        name: 'Ewen Bremner',
      },
      {
        name: 'Colin Salmon',
      },
      {
        name: 'Tommy Flanagan',
      },
      {
        name: 'Agathe de La Boulaye',
      },
    ],
    coverUrl: '/movies_pictures/db646c0e3fe4.jpg',
    releaseDate: '2004-08-13',
    length: 101,
    genre: ['Action'],
    saga: 'AlienVsPredator',
    description: 'Des scientifiques découvrent une pyramide sous l\'Antarctique où Predators élèvent des aliens pour leurs rituels de chasse.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Alien vs. Predator : Requiem',
    director: 'Colin Strause, Greg Strause',
    actors: [
      {
        name: 'Steven Pasquale',
      },
      {
        name: 'Reiko Aylesworth',
      },
      {
        name: 'John Ortiz',
      },
      {
        name: 'Johnny Lewis',
      },
      {
        name: 'Ariel Gade',
      },
      {
        name: 'Sam Trammell',
      },
      {
        name: 'Robert Joy',
      },
    ],
    coverUrl: '/movies_pictures/2a4d2ca6720f.jpg',
    releaseDate: '2007-12-25',
    length: 94,
    genre: ['Action'],
    saga: 'AlienVsPredator',
    description: 'Un Predalien hybride sème la terreur dans une petite ville américaine, forçant un Predator solitaire à intervenir.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Men in Black',
    director: 'Barry Sonnenfeld',
    actors: [
      {
        name: 'Tommy Lee Jones',
      },
      {
        name: 'Linda Fiorentino',
      },
      {
        name: "Vincent D'Onofrio",
      },
      {
        name: 'Rip Torn',
      },
      {
        name: 'Tony Shalhoub',
      },
      {
        name: 'Jon Gries',
      },
      {
        name: 'Carel Struycken',
      },
    ],
    coverUrl: '/movies_pictures/60b241ba5a20.jpg',
    releaseDate: '1997-07-02',
    length: 98,
    genre: ['Action', 'Science Fiction'],
    saga: 'Men in Black',
    description: 'Agent J rejoint une agence secrète qui surveille les extraterrestres sur Terre et doit empêcher une créature de détruire la planète.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_MAKEUP, year: 1998 }],
  },
  {
    title: 'Men in Black II',
    director: 'Barry Sonnenfeld',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Lara Flynn Boyle',
      },
      {
        name: 'Johnny Knoxville',
      },
      {
        name: 'Rosario Dawson',
      },
      {
        name: 'Tony Shalhoub',
      },
      {
        name: 'Rip Torn',
      },
      {
        name: 'Patrick Warburton',
      },
    ],
    coverUrl: '/movies_pictures/04b2ffe95e49.jpg',
    releaseDate: '2002-07-03',
    length: 88,
    genre: ['Action', 'Science Fiction'],
    saga: 'Men in Black',
    description: 'Agent K, amnésique, doit être retrouvé pour empêcher une alien séductrice de libérer une entité prisonnière sur Terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Men in Black 3',
    director: 'Barry Sonnenfeld',
    actors: [
      {
        name: 'Tommy Lee Jones',
      },
      {
        name: 'Josh Brolin',
      },
      {
        name: 'Jemaine Clement',
      },
      {
        name: 'Michael Stuhlbarg',
      },
      {
        name: 'Bill Hader',
      },
      {
        name: 'David Rasche',
      },
      {
        name: 'Emma Thompson',
      },
    ],
    coverUrl: '/movies_pictures/568a746c88d8.jpg',
    releaseDate: '2012-05-25',
    length: 106,
    genre: ['Action', 'Science Fiction'],
    saga: 'Men in Black',
    description: 'Agent J voyage en 1969 pour sauver le jeune Agent K et empêcher une invasion extraterrestre orchestrée par le criminel Boris.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Men in Black: International',
    director: 'F. Gary Gray',
    actors: [
      {
        name: 'Chris Hemsworth',
      },
      {
        name: 'Tessa Thompson',
      },
      {
        name: 'Liam Neeson',
      },
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Kumail Nanjiani',
      },
      {
        name: 'Rafe Spall',
      },
      {
        name: 'Rebecca Ferguson',
      },
    ],
    coverUrl: '/movies_pictures/95f46301c698.jpg',
    releaseDate: '2019-06-12',
    length: 115,
    genre: ['Action', 'Science Fiction'],
    saga: 'Men in Black',
    description: 'Deux agents novices enquêtent sur des assassinats d\'extraterrestres à travers le monde et découvrent une conspiration au sein du MIB.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Independence Day',
    director: 'Roland Emmerich',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Mary McDonnell',
      },
      {
        name: 'Vivica A. Fox',
      },
      {
        name: 'Margaret Colin',
      },
      {
        name: 'Harry Connick',
      },
      {
        name: 'Bill Pullman',
      },
    ],
    coverUrl: '/movies_pictures/3e5e47e8e662.jpg',
    releaseDate: '1996-07-03',
    length: 145,
    genre: ['Science Fiction'],
    saga: 'Independence Day',
    description: 'Des vaisseaux aliens attaquent la Terre le 4 juillet et des pilotes, scientifiques et présidents unissent leurs forces pour contre-attaquer.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1997 }],
  },
  {
    title: 'Independence Day 2',
    director: 'Roland Emmerich',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Mary McDonnell',
      },
      {
        name: 'Vivica A. Fox',
      },
      {
        name: 'Margaret Colin',
      },
      {
        name: 'Harry Connick',
      },
      {
        name: 'Bill Pullman',
      },
    ],
    coverUrl: '/movies_pictures/877b550e24ba.jpg',
    releaseDate: '1996-07-03',
    length: 145,
    genre: ['Science Fiction'],
    saga: 'Independence Day',
    description: 'Vingt ans après la première invasion, une reine alien mène une nouvelle offensive contre la Terre fortifiée par la technologie récupérée.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Retour vers le futur',
    director: 'Robert Zemeckis',
    actors: [
      {
        name: 'Christopher Lloyd',
      },
      {
        name: 'Lea Thompson',
      },
      {
        name: 'Crispin Glover',
      },
      {
        name: 'Michael J. Fox',
      },
      {
        name: 'Thomas F. Wilson',
      },
      {
        name: 'Marc McClure',
      },
      {
        name: 'Wendie Jo Sperber',
      },
    ],
    coverUrl: '/movies_pictures/40901a235a68.jpg',
    releaseDate: '1985-07-03',
    length: 116,
    genre: ['Science Fiction'],
    saga: 'Retour vers le futur',
    description: 'Le lycéen Marty McFly voyage par accident en 1955 et doit s\'assurer que ses parents se rencontrent pour pouvoir retourner à son époque.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1986 }],
  },
  {
    title: 'Retour vers le futur 2',
    director: 'Robert Zemeckis',
    actors: [
      {
        name: 'Michael J. Fox',
      },
      {
        name: 'Christopher Lloyd',
      },
      {
        name: 'Lea Thompson',
      },
      {
        name: 'Thomas F. Wilson',
      },
      {
        name: 'Elisabeth Shue',
      },
      {
        name: 'James Tolkan',
      },
      {
        name: 'Michael Balzary',
      },
    ],
    coverUrl: '/movies_pictures/c4c0f02c8c6e.jpg',
    releaseDate: '1989-11-22',
    length: 108,
    genre: ['Science Fiction'],
    saga: 'Retour vers le futur',
    description: 'Marty et Doc voyagent en 2015 puis dans un 1985 alternatif corrompu par Biff Tannen, avant de devoir sauver le Doc en 1885.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Retour vers le futur 3',
    director: 'Robert Zemeckis',
    actors: [
      {
        name: 'Michael J. Fox',
      },
      {
        name: 'Christopher Lloyd',
      },
      {
        name: 'Mary Steenburgen',
      },
      {
        name: 'Lea Thompson',
      },
      {
        name: 'Thomas F. Wilson',
      },
      {
        name: 'Elisabeth Shue',
      },
      {
        name: 'James Tolkan',
      },
    ],
    coverUrl: '/movies_pictures/e81704368233.jpg',
    releaseDate: '1990-05-25',
    length: 118,
    genre: ['Science Fiction'],
    saga: 'Retour vers le futur',
    description: 'Marty rejoint Doc en 1885 dans le Far West et doit réparer le DeLorean tout en empêchant le Doc de tomber amoureux et rester dans le passé.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le Labyrinthe',
    director: 'Wes Ball',
    actors: [
      {
        name: "Dylan O'Brien",
      },
      {
        name: 'Thomas Sangster',
      },
      {
        name: 'Kaya Scodelario',
      },
      {
        name: 'Will Poulter',
      },
      {
        name: 'Aml Ameen',
      },
      {
        name: 'Patricia Clarkson',
      },
      {
        name: 'Jacob Latimore',
      },
    ],
    coverUrl: '/movies_pictures/274122be9558.jpg',
    releaseDate: '2014-09-19',
    length: 113,
    genre: ['Action', 'Dystopie', 'Science Fiction'],
    saga: 'Le Labyrinthe',
    description: 'Thomas se réveille sans mémoire dans un labyrinthe géant où des adolescents survivent en évitant les créatures appelées Griever.',
    fromEntity: {
      entityType: 'book',
      title: 'Le Labyrinthe',
      secondEntityKey: 'James Dashner',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le Labyrinthe 2 : La Terre Brûlée',
    director: 'Wes Ball',
    actors: [
      {
        name: "Dylan O'Brien",
      },
      {
        name: 'Thomas Sangster',
      },
      {
        name: 'Ki Hong Lee',
      },
      {
        name: 'Kaya Scodelario',
      },
      {
        name: 'Rosa Salazar',
      },
      {
        name: 'Giancarlo Esposito',
      },
      {
        name: 'Aidan Gillen',
      },
    ],
    coverUrl: '/movies_pictures/1fe95ad7d845.jpg',
    releaseDate: '2015-09-18',
    length: 131,
    genre: ['Action', 'Dystopie', 'Science Fiction'],
    saga: 'Le Labyrinthe',
    description: 'Thomas et les Gladers traversent un désert post-apocalyptique pour rejoindre la Résistance face à l\'organisation WCKD.',
    fromEntity: {
      entityType: 'book',
      title: 'Le Labyrinthe',
      secondEntityKey: 'James Dashner',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le Labyrinthe 3 : Le remède mortel',
    director: 'Wes Ball',
    actors: [
      { name: "Dylan O'Brien" },
      { name: 'Kaya Scodelario' },
      { name: 'Thomas Brodie-Sangster' },
      { name: 'Ki Hong Lee' },
      { name: 'Aidan Gillen' },
      { name: 'Patricia Clarkson' },
      { name: 'Walton Goggins' },
    ],
    coverUrl: '/movies_pictures/490429f278fd.jpg',
    releaseDate: '2018-01-26',
    length: 143,
    genre: ['Action', 'Dystopie', 'Science Fiction'],
    saga: 'Le Labyrinthe',
    description: 'Thomas mène un assaut final contre les installations de WCKD pour sauver ses amis infectés et mettre fin aux expériences.',
    fromEntity: {
      entityType: 'book',
      title: 'Le Labyrinthe',
      secondEntityKey: 'James Dashner',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Hunger Games',
    director: 'Gary Ross',
    actors: [
      {
        name: 'Josh Hutcherson',
      },
      {
        name: 'Liam Hemsworth',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Lenny Kravitz',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Willow Shields',
      },
      {
        name: 'Isabelle Fuhrman',
      },
    ],
    coverUrl: '/movies_pictures/bf81bf1f8b5d.jpg',
    releaseDate: '2012-03-23',
    length: 142,
    genre: ['Action', 'Science Fiction'],
    saga: 'Hunger Games',
    description: 'Katniss Everdeen se porte volontaire aux Hunger Games, télé-réalité mortelle où des adolescents s\'affrontent pour le divertissement du Capitol.',
    fromEntity: {
      entityType: 'book',
      title: 'Hunger Games',
      secondEntityKey: 'Suzanne Collins',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Hunger Games : L'Embrasement",
    director: 'Francis Lawrence',
    actors: [
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Josh Hutcherson',
      },
      {
        name: 'Liam Hemsworth',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Sam Claflin',
      },
      {
        name: 'Philip Seymour Hoffman',
      },
    ],
    coverUrl: '/movies_pictures/2471f6dfb37a.jpg',
    releaseDate: '2013-11-27',
    length: 146,
    genre: ['Science Fiction'],
    saga: 'Hunger Games',
    description: 'Katniss devient le symbole d\'une rébellion naissante après avoir survécu aux Jeux et découvre un complot pour l\'éliminer.',
    fromEntity: {
      entityType: 'book',
      title: "L'Embrasement",
      secondEntityKey: 'Suzanne Collins',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Hunger Games : La Révolte - Partie 1',
    director: 'Francis Lawrence',
    actors: [
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Josh Hutcherson',
      },
      {
        name: 'Liam Hemsworth',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Philip Seymour Hoffman',
      },
      {
        name: 'Jeffrey Wright',
      },
    ],
    coverUrl: '/movies_pictures/b0e7a474a419.jpg',
    releaseDate: '2014-11-21',
    length: 123,
    genre: ['Action', 'Science Fiction'],
    saga: 'Hunger Games',
    description: 'Katniss devient la Mockingjay de la rébellion et tourne des propagandes tandis que le Capitol bombarde le District 13.',
    fromEntity: {
      entityType: 'book',
      title: 'La Révolte',
      secondEntityKey: 'Suzanne Collins',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Hunger Games : La Révolte, partie 2',
    director: 'Francis Lawrence',
    actors: [
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Josh Hutcherson',
      },
      {
        name: 'Liam Hemsworth',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Julianne Moore',
      },
      {
        name: 'Donald Sutherland',
      },
    ],
    coverUrl: '/movies_pictures/0166d849bb58.jpg',
    releaseDate: '2015-11-18',
    length: 137,
    genre: ['Action', 'Science Fiction'],
    saga: 'Hunger Games',
    description: 'Katniss mène l\'assaut final sur le Capitol pour renverser le Président Snow et libérer Panem une fois pour toutes.',
    fromEntity: {
      entityType: 'book',
      title: 'La Révolte',
      secondEntityKey: 'Suzanne Collins',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Hunger Games : La Ballade du serpent et de l'oiseau chanteur",
    director: 'Francis Lawrence',
    actors: [
      {
        name: 'Tom Blyth',
      },
      {
        name: 'Rachel Zegler',
      },
      {
        name: 'Peter Dinklage',
      },
      {
        name: 'Hunter Schafer',
      },
      {
        name: 'Jason Schwartzman',
      },
    ],
    coverUrl: '/movies_pictures/c3fbe0745069.jpg',
    releaseDate: '2023-11-15',
    length: 157,
    genre: ['Action', 'Science Fiction'],
    saga: 'Hunger Games',
    description: 'Soixante-quatre ans avant Katniss, le jeune Coriolanus Snow devient mentor d\'une tribut du District 12 lors de la dixième édition des Hunger Games.',
    fromEntity: {
      entityType: 'book',
      title: "La Ballade du serpent et de l'oiseau chanteur",
      secondEntityKey: 'Suzanne Collins',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Divergente',
    director: 'Neil Burger',
    actors: [
      {
        name: 'Ansel Elgort',
      },
      {
        name: 'Ashley Judd',
      },
      {
        name: 'Ben Lloyd-Hughes',
      },
      {
        name: 'Jai Courtney',
      },
      {
        name: 'Kate Winslet',
      },
      {
        name: 'Maggie Q',
      },
      {
        name: 'Mekhi Phifer',
      },
    ],
    coverUrl: '/movies_pictures/3243beb68870.jpg',
    releaseDate: '2014-03-21',
    length: 139,
    genre: ['Action', 'Science Fiction'],
    saga: 'Divergente',
    description: 'Dans un Chicago futuriste divisé en factions, Tris Prior découvre qu\'elle est Divergente, une anomalie menaçant l\'ordre établi.',
    fromEntity: {
      entityType: 'book',
      title: 'Divergente',
      secondEntityKey: 'Veronica Roth',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: "Divergente 2 : L'Insurrection",
    director: 'Robert Schwentke',
    actors: [
      {
        name: 'Shailene Woodley',
      },
      {
        name: 'Kate Winslet',
      },
      {
        name: 'Jai Courtney',
      },
      {
        name: 'Mekhi Phifer',
      },
      {
        name: 'Theo James',
      },
      {
        name: 'Ansel Elgort',
      },
      {
        name: 'Miles Teller',
      },
    ],
    coverUrl: '/movies_pictures/5eb167269261.jpg',
    releaseDate: '2015-03-20',
    length: 119,
    genre: ['Action', 'Science Fiction'],
    saga: 'Divergente',
    description: 'Tris et Four découvrent que leur société est une expérience et s\'allient aux sans-faction pour renverser les fondateurs.',
    fromEntity: {
      entityType: 'book',
      title: "Divergente Tome 2 : L'Insurrection",
      secondEntityKey: 'Veronica Roth',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Divergente 3 : Au-delà du Mur',
    director: 'Robert Schwentke',
    actors: [
      {
        name: 'Shailene Woodley',
      },
      {
        name: 'Theo James',
      },
      {
        name: 'Octavia Spencer',
      },
      {
        name: 'Ray Stevenson',
      },
      {
        name: 'Zoë Kravitz',
      },
      {
        name: 'Miles Teller',
      },
      {
        name: 'Ansel Elgort',
      },
    ],
    coverUrl: '/movies_pictures/77896d73fd3f.jpg',
    releaseDate: '2016-03-18',
    length: 121,
    genre: ['Action', 'Science Fiction'],
    saga: 'Divergente',
    description: 'Tris et son groupe traversent le mur entourant Chicago et découvrent une civilisation extérieure impliquée dans leur destin.',
    fromEntity: {
      entityType: 'book',
      title: 'Divergente Tome 3 : Allégeance',
      secondEntityKey: 'Veronica Roth',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Transformers',
    director: 'Michael Bay',
    actors: [
      {
        name: 'Shia LaBeouf',
      },
      {
        name: 'Tyrese Gibson',
      },
      {
        name: 'Josh Duhamel',
      },
      {
        name: 'Anthony Anderson',
      },
      {
        name: 'Megan Fox',
      },
      {
        name: 'Rachael Taylor',
      },
      {
        name: 'John Turturro',
      },
    ],
    coverUrl: '/movies_pictures/qsfsfsefefe.webp',
    releaseDate: '2007-07-03',
    length: 144,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Sam Witwicky découvre que son ancêtre possédait des coordonnées menant au AllSpark, convoité par Autobots et Decepticons sur Terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Transformers 2 : La Revanche',
    director: 'Michael Bay',
    actors: [
      {
        name: 'Shia LaBeouf',
      },
      {
        name: 'Megan Fox',
      },
      {
        name: 'Josh Duhamel',
      },
      {
        name: 'John Turturro',
      },
      {
        name: 'Ramón Rodríguez',
      },
      {
        name: 'Tyrese Gibson',
      },
      {
        name: 'Kevin Dunn',
      },
    ],
    coverUrl: '/movies_pictures/e860623824bf.jpg',
    releaseDate: '2009-06-24',
    length: 150,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Sam possède des symboles anciens dans son esprit qui mènent à une machine énergétique capable de détruire le soleil.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Transformers 3 : La Face Cachée de la Lune',
    director: 'Michael Bay',
    actors: [
      {
        name: 'Shia LaBeouf',
      },
      {
        name: 'Rosie Huntington-Whiteley',
      },
      {
        name: 'Josh Duhamel',
      },
      {
        name: 'John Turturro',
      },
      {
        name: 'Tyrese Gibson',
      },
      {
        name: 'John Malkovich',
      },
      {
        name: 'Patrick Dempsey',
      },
    ],
    coverUrl: '/movies_pictures/01c2b5732238.jpg',
    releaseDate: '2011-06-29',
    length: 154,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Les Autobots découvrent que la NASA a caché un vaisseau Cybertronien sur la Lune, convoité par les Decepticons.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Transformers 4 : L'Âge de l'Extinction",
    director: 'Michael Bay',
    actors: [
      {
        name: 'Mark Wahlberg',
      },
      {
        name: 'Nicola Peltz',
      },
      {
        name: 'Jack Reynor',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Kelsey Grammer',
      },
      {
        name: 'Titus Welliver',
      },
      {
        name: 'Sophia Myles',
      },
    ],
    coverUrl: '/movies_pictures/ffa09a88560d.jpg',
    releaseDate: '2014-07-16',
    length: 165,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Cinq ans après Chicago, une prime est mise sur Optimus Prime et de nouveaux Transformers menacent l\'humanité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Transformers: The Last Knight',
    director: 'Michael Bay',
    actors: [
      {
        name: 'Mark Wahlberg',
      },
      {
        name: 'Anthony Hopkins',
      },
      {
        name: 'Laura Haddock',
      },
      {
        name: 'Jerrod Carmichael',
      },
      {
        name: 'Isabela Merced',
      },
      {
        name: 'Josh Duhamel',
      },
      {
        name: 'Stanley Tucci',
      },
    ],
    coverUrl:
      '/movies_pictures/aHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvL29yaWdpbmFsLy9vR3c1T1ZkR0h4OTFmNzBNcUpQQ3E0SmxQTjguanBn.webp',
    releaseDate: '2017-06-28',
    length: 154,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Optimus Prime retourne sur Cybertron tandis que Merlin, les chevaliers et une alliance humaine tentent de sauver la Terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Bumblebee',
    director: 'Travis Knight',
    actors: [
      {
        name: 'Hailee Steinfeld',
      },
      {
        name: 'John Cena',
      },
      {
        name: 'Jorge Lendeborg Jr.',
      },
      {
        name: 'John Ortiz',
      },
      {
        name: 'Jason Drucker',
      },
      {
        name: 'Pamela Adlon',
      },
      {
        name: 'Stephen Schneider',
      },
    ],
    coverUrl: '/movies_pictures/27f5035ae03f.jpg',
    releaseDate: '2018-12-26',
    length: 114,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'En 1987, l\'Autobot Bumblebee, amnésique, se cache dans un garage californien et se lie à une adolescente en fuite.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Transformers: Rise of the Beasts',
    director: 'Steven Caple Jr.',
    actors: [
      {
        name: 'Anthony Ramos',
      },
      {
        name: 'Dominique Fishback',
      },
      {
        name: 'Luna Lauren Velez',
      },
      {
        name: 'Dean Scott Vazquez',
      },
      {
        name: 'Peter Cullen',
      },
    ],
    coverUrl: '/movies_pictures/65248c4b6e4f.jpg',
    releaseDate: '2023-01-01',
    length: 117,
    genre: ['Action', 'Science Fiction'],
    saga: 'Transformers',
    description: 'Les Autobots s\'allient aux Maximals pour empêcher les Terrorcons de libérer Unicron et détruire la planète.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Dune',
    director: 'Denis Villeneuve',
    actors: [
      {
        name: 'Timothée Chalamet',
      },
      {
        name: 'Rebecca Ferguson',
      },
      {
        name: 'Josh Brolin',
      },
      {
        name: 'Oscar Isaac',
      },
      {
        name: 'Jason Momoa',
      },
      {
        name: 'Javier Bardem',
      },
      {
        name: 'David Bautista',
      },
    ],
    coverUrl: '/movies_pictures/4633954.jpg',
    releaseDate: '2021-10-22',
    length: 155,
    genre: ['Science Fiction'],
    saga: 'Dune',
    description: 'Paul Atreides arrive sur Arrakis, planète désertique source d\'épice, où sa famille est trahie et où il devient le messie des Fremen.',
    fromEntity: {
      entityType: 'book',
      title: 'Dune',
      secondEntityKey: 'Frank Herbert',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2022 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2022 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 2022 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2022 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2022 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2022 },
    ],
  },
  {
    title: 'Dune : Partie 2',
    director: 'Denis Villeneuve',
    actors: [
      {
        name: 'Timothée Chalamet',
      },
      {
        name: 'Zendaya',
      },
      {
        name: 'Rebecca Ferguson',
      },
      {
        name: 'Javier Bardem',
      },
      {
        name: 'Josh Brolin',
      },
      {
        name: 'Austin Butler',
      },
      {
        name: 'Florence Pugh',
      },
    ],
    coverUrl: '/movies_pictures/5392835.jpg',
    releaseDate: '2024-03-01',
    length: 166,
    genre: ['Science Fiction'],
    saga: 'Dune',
    description: 'Paul Atreides s\'unit aux Fremen pour mener la guerre sainte contre les Harkonnen et les Sardaukar, au prix de visions apocalyptiques.',
    fromEntity: {
      entityType: 'book',
      title: 'Dune',
      secondEntityKey: 'Frank Herbert',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2025 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2025 },
    ],
  },
  {
    title: 'Resident Evil',
    director: 'Paul W.S. Anderson',
    actors: [
      {
        name: 'Michelle Rodríguez',
      },
      {
        name: 'Eric Mabius',
      },
      {
        name: 'James Purefoy',
      },
      {
        name: 'Martin Crewes',
      },
      {
        name: 'Colin Salmon',
      },
      {
        name: 'Joseph May',
      },
      {
        name: 'Ryan McCluskey',
      },
    ],
    coverUrl: '/movies_pictures/resident_evil.jpg',
    releaseDate: '2002-03-15',
    length: 100,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Alice se réveille dans un manoir où une équipe paramilitaire doit contenir un virus mortel qui transforme les humains en zombies.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Apocalypse',
    director: 'Alexander Witt',
    actors: [
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Sienna Guillory',
      },
      {
        name: 'Oded Fehr',
      },
      {
        name: 'Thomas Kretschmann',
      },
      {
        name: 'Jared Harris',
      },
      {
        name: 'Mike Epps',
      },
      {
        name: 'Sophie Vavasseur',
      },
    ],
    coverUrl:
      '/movies_pictures/50957-resident-evil-apocalypse-0-150-0-225-crop.jpg',
    releaseDate: '2004-09-10',
    length: 94,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Raccoon City est quarantinée après l\'épidémie T-Virus et Alice doit fuir la ville avant qu\'Umbrella ne la détruise.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Extinction',
    director: 'Russell Mulcahy',
    actors: [
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Oded Fehr',
      },
      {
        name: 'Ali Larter',
      },
      {
        name: 'Iain Glen',
      },
      {
        name: 'Ashanti',
      },
      {
        name: 'Mike Epps',
      },
      {
        name: 'Christopher Egan',
      },
    ],
    coverUrl:
      '/movies_pictures/47979-resident-evil-extinction-0-150-0-225-crop.jpg',
    releaseDate: '2007-09-21',
    length: 94,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Dans un monde post-apocalyptique, Alice rejoint des survivants traversant le désert américain vers un refuge supposé en Alaska.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Afterlife',
    director: 'Paul W.S. Anderson',
    actors: [
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Ali Larter',
      },
      {
        name: 'Wentworth Miller',
      },
      {
        name: 'Sienna Guillory',
      },
      {
        name: 'Kim Coates',
      },
      {
        name: 'Shawn Roberts',
      },
      {
        name: 'Spencer Locke',
      },
    ],
    coverUrl: '/movies_pictures/19486570.jpg',
    releaseDate: '2010-09-10',
    length: 97,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Alice atterrit en Alaska et rejoint des survivants piégés dans un centre commercial de Los Angeles infesté de morts-vivants.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Retribution',
    director: 'Paul W.S. Anderson',
    actors: [
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Michelle Rodríguez',
      },
      {
        name: 'Kevin Durand',
      },
      {
        name: 'Sienna Guillory',
      },
      {
        name: 'Shawn Roberts',
      },
      {
        name: 'Aryana Engineer',
      },
      {
        name: 'Colin Salmon',
      },
    ],
    coverUrl: '/movies_pictures/20204615.jpg',
    releaseDate: '2012-09-14',
    length: 95,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Alice se réveille dans une base Umbrella sous-marine où des simulations de villes servent à tester le T-Virus sur des clones.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Chapitre final',
    director: 'Paul W.S. Anderson',
    actors: [
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Ali Larter',
      },
      {
        name: 'Shawn Roberts',
      },
      {
        name: 'Ruby Rose',
      },
      {
        name: 'Eoin Macken',
      },
      {
        name: 'Iain Glen',
      },
      {
        name: 'William Levy',
      },
    ],
    coverUrl: '/movies_pictures/2814ac811b45.jpg',
    releaseDate: '2017-01-25',
    length: 106,
    genre: ['Action', 'Science Fiction', 'Horreur'],
    saga: 'Resident Evil',
    description: 'Alice retourne à Raccoon City pour affronter le Dr. Isaacs et détruire le Hive, dernière forteresse d\'Umbrella.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Resident Evil : Bienvenue à Raccoon City',
    director: 'Johannes Roberts',
    actors: [
      {
        name: 'Kaya Scodelario',
      },
      {
        name: 'Hannah John-Kamen',
      },
      {
        name: 'Robbie Amell',
      },
      {
        name: 'Tom Hopper',
      },
      {
        name: 'Avan Jogia',
      },
      {
        name: 'Neal McDonough',
      },
      {
        name: 'Donal Logue',
      },
    ],
    coverUrl: '/movies_pictures/96e6d30993bc.jpg',
    releaseDate: '2021-11-24',
    length: 107,
    genre: ['Action', 'Horreur', 'Science Fiction'],
    saga: 'Resident Evil',
    description: 'Des habitants de Raccoon City découvrent la vérité sur Umbrella Corporation lorsque le T-Virus transforme la ville en enfer.',
    fromEntity: {
      entityType: 'game',
      title: 'Resident Evil',
      secondEntityKey: 'Capcom',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Avatar',
    director: 'James Cameron',
    actors: [
      {
        name: 'Sam Worthington',
      },
      {
        name: 'Zoe Saldana',
      },
      {
        name: 'Sigourney Weaver',
      },
      {
        name: 'Stephen Lang',
      },
      {
        name: 'Michelle Rodriguez',
      },
      {
        name: 'Giovanni Ribisi',
      },
      {
        name: 'Joel David Moore',
      },
    ],
    coverUrl: '/movies_pictures/5e0542820037.jpg',
    releaseDate: '2009-12-18',
    length: 162,
    genre: ['Science Fiction', 'Aventure'],
    saga: 'Avatar',
    description: 'Jake Sully, paraplégique, rejoint le programme Avatar sur Pandora et s\'unit aux Na\'vi contre la corporation minière RDA.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2010 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2010 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2010 },
    ],
  },
  {
    title: "Avatar : La Voie de l'Eau",
    director: 'James Cameron',
    actors: [
      {
        name: 'Sam Worthington',
      },
      {
        name: 'Zoë Saldaña',
      },
      {
        name: 'Sigourney Weaver',
      },
      {
        name: 'Joel Moore',
      },
      {
        name: 'Stephen Lang',
      },
      {
        name: 'Kate Winslet',
      },
      {
        name: 'Cliff Curtis',
      },
    ],
    coverUrl:
      '/movies_pictures/63058-avatar-the-way-of-water-0-150-0-225-crop.jpg',
    releaseDate: '2022-12-16',
    length: 192,
    genre: ['Science Fiction'],
    saga: 'Avatar',
    description: 'Jake et Neytiri fuient avec leur famille vers les clans aquatiques de Pandora, traqués par le colonel Quaritch ressuscité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2023 }],
  },
  {
    title: 'Avatar : De feu et de cendres',
    director: 'James Cameron',
    actors: [
      {
        name: 'Sam Worthington',
      },
      {
        name: 'Zoe Saldana',
      },
      {
        name: 'Sigourney Weaver',
      },
      {
        name: 'Stephen Lang',
      },
      {
        name: 'Kate Winslet',
      },
    ],
    coverUrl: '/movies_pictures/avatar_de_feu_et_de_cendres.jpg',
    releaseDate: '2025-12-17',
    length: 195,
    genre: ['Science Fiction'],
    saga: 'Avatar',
    description: 'Les Na\'vi affrontent une nouvelle menace humaine sur Pandora alors que Jake et Neytiri protègent leur clan face à un peuple volcanique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2026 }],
  },
  {
    title: 'Jurassic Park',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Richard Attenborough',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Samuel L. Jackson',
      },
      {
        name: 'Sam Neill',
      },
      {
        name: 'Laura Dern',
      },
      {
        name: 'Ariana Richards',
      },
      {
        name: 'Wayne Knight',
      },
    ],
    coverUrl: '/movies_pictures/jurassic_park.jpg',
    releaseDate: '1993-06-11',
    length: 127,
    genre: ['Aventure', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Un parc d\'attractions avec des dinosaures clonés tourne au chaos quand les créatures s\'échappent et menacent les visiteurs.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1994 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1994 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1994 },
    ],
  },
  {
    title: 'Le Monde perdu : Jurassic Park',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Julianne Moore',
      },
      {
        name: 'Pete Postlethwaite',
      },
      {
        name: 'Vince Vaughn',
      },
      {
        name: 'Richard Schiff',
      },
      {
        name: 'Peter Stormare',
      },
      {
        name: 'Vanessa Lee Chester',
      },
    ],
    coverUrl: '/movies_pictures/the_lost_world_jurassic_park.jpg',
    releaseDate: '1997-10-22',
    length: 129,
    genre: ['Action', 'Aventure', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Une équipe retourne sur Isla Sorna pour documenter les dinosaures, mais un chasseur capture un T-Rex pour le ramener à San Diego.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Jurassic Park 3',
    director: 'Joe Johnston',
    actors: [
      {
        name: 'Sam Neill',
      },
      {
        name: 'William H. Macy',
      },
      {
        name: 'Téa Leoni',
      },
      {
        name: 'Alessandro Nivola',
      },
      {
        name: 'Trevor Morgan',
      },
      {
        name: 'Michael Jeter',
      },
      {
        name: 'Laura Dern',
      },
    ],
    coverUrl: '/movies_pictures/Jurassic_Park_III_poster.jpg',
    releaseDate: '2001-07-18',
    length: 92,
    genre: ['Aventure', 'Action', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Des parents désespérés engagent Alan Grant pour retrouver leur fils disparu sur l\'île aux dinosaures, piégés par un Spinosaurus.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Jurassic World',
    director: 'Colin Trevorrow',
    actors: [
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Bryce Dallas Howard',
      },
      {
        name: 'Irfan Khan',
      },
      {
        name: "Vincent D'Onofrio",
      },
      {
        name: 'Ty Simpkins',
      },
      {
        name: 'Omar Sy',
      },
      {
        name: 'Jake Johnson',
      },
    ],
    coverUrl: '/movies_pictures/422000.webp',
    releaseDate: '2015-06-12',
    length: 124,
    genre: ['Action', 'Aventure', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Un parc thématique fonctionnel voit son nouveau dinosaure hybride Indominus rex s\'échapper et semer la terreur.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Jurassic World: Fallen Kingdom',
    director: 'J.A. Bayona',
    actors: [
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Bryce Dallas Howard',
      },
      {
        name: 'B. D. Wong',
      },
      {
        name: 'James Cromwell',
      },
      {
        name: 'Ted Levine',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Toby Jones',
      },
    ],
    coverUrl: '/movies_pictures/Jurassic_World_Fallen_Kingdom.png',
    releaseDate: '2018-06-22',
    length: 128,
    genre: ['Action', 'Aventure', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Des dinosaures menacés d\'extinction sur Isla Nublar sont secourus, mais certains sont vendus sur le marché noir.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: "Jurassic World : Le Monde d'après",
    director: 'Colin Trevorrow',
    actors: [
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Bryce Dallas Howard',
      },
      {
        name: 'Laura Dern',
      },
      {
        name: 'Sam Neill',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'DeWanda Wise',
      },
      {
        name: 'Mamoudou Athie',
      },
    ],
    coverUrl: '/movies_pictures/jurassic_world_le_monde_dapres.jpg',
    releaseDate: '2022-06-08',
    length: 146,
    genre: ['Action', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Quatre ans après, des dinosaures vivent librement dans le monde et une jeune fille possède un ADN crucial pour un locuste génétique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Jurassic World : Renaissance',
    director: 'Gareth Edwards',
    actors: [
      {
        name: 'Margot Robbie',
      },
      {
        name: 'Colin Farrell',
      },
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Phoebe Waller-Bridge',
      },
      {
        name: 'Jodie Turner-Smith',
      },
      {
        name: 'Scarlett Johansson',
      },
    ],
    coverUrl: '/movies_pictures/jurassic_world_renaissance.jpg',
    releaseDate: '2025-07-04',
    length: 134,
    genre: ['Action', 'Science Fiction'],
    saga: 'Jurassic',
    description: 'Une équipe infiltre une installation secrète contenant les dinosaures les plus dangereux pour en extraire de l\'ADN vital.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Star Trek',
    director: 'J.J. Abrams',
    actors: [
      {
        name: 'Chris Pine',
      },
      {
        name: 'Zachary Quinto',
      },
      {
        name: 'Leonard Nimoy',
      },
      {
        name: 'Eric Bana',
      },
      {
        name: 'Karl Urban',
      },
      {
        name: 'Zoe Saldana',
      },
      {
        name: 'Simon Pegg',
      },
    ],
    coverUrl: '/movies_pictures/star_trek.jpg',
    releaseDate: '2009-05-06',
    length: 127,
    genre: ['Science Fiction'],
    saga: 'Star Trek',
    description: 'James T. Kirk et Spock s\'unissent à bord de l\'Enterprise pour empêcher le Romulien Nero de détruire la Fédération.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [{ type: OscarEnum.OSCAR_BEST_MAKEUP, year: 2010 }],
  },
  {
    title: 'Star Trek Into Darkness',
    director: 'J.J. Abrams',
    actors: [
      {
        name: 'Chris Pine',
      },
      {
        name: 'Zachary Quinto',
      },
      {
        name: 'Benedict Cumberbatch',
      },
      {
        name: 'Zoe Saldana',
      },
    ],
    coverUrl: '/movies_pictures/star_trek_into_darkness.jpg',
    releaseDate: '2013-06-12',
    length: 130,
    genre: ['Science Fiction'],
    saga: 'Star Trek',
    description: 'L\'équipage traque un terroriste au sein de Starfleet et découvre une conspiration impliquant le généticien Khan.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Star Trek : Sans limites',
    director: 'Justin Lin',
    actors: [
      {
        name: 'Chris Pine',
      },
      {
        name: 'Zachary Quinto',
      },
      {
        name: 'Karl Urban',
      },
      {
        name: 'Zoe Saldana',
      },
    ],
    coverUrl: '/movies_pictures/star_trek_beyond.jpg',
    releaseDate: '2016-08-17',
    length: 123,
    genre: ['Science Fiction'],
    saga: 'Star Trek',
    description: 'L\'Enterprise est attaquée par une force alien et l\'équipage échoué sur une planète doit découvrir qui cherche à détruire la Fédération.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Mad Max',
    director: 'George Miller',
    actors: [
      {
        name: 'Mel Gibson',
      },
      {
        name: 'Steve Bisley',
      },
      {
        name: 'Joanne Samuel',
      },
      {
        name: 'Hugh Keays-Byrne',
      },
      {
        name: 'Roger Ward',
      },
      {
        name: 'Vincent Gil',
      },
      {
        name: 'Paul Johnstone',
      },
    ],
    coverUrl: '/movies_pictures/18943123.webp',
    releaseDate: '1979-01-01',
    length: 88,
    genre: ['Action', 'Science Fiction'],
    saga: 'Mad Max',
    description: 'Dans un monde en déclin, Max Rockatansky affronte un gang de motards qui terrorise les routes australiennes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Mad Max 2',
    director: 'George Miller',
    actors: [
      {
        name: 'Mel Gibson',
      },
      {
        name: 'Michael Preston',
      },
      {
        name: 'Bruce Spence',
      },
      {
        name: 'Vernon Wells',
      },
      {
        name: 'Kjell Nilsson',
      },
      {
        name: 'Virginia Hey',
      },
      {
        name: 'Emil Minty',
      },
    ],
    coverUrl: '/movies_pictures/91qplWiUsQL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1981-01-01',
    length: 96,
    genre: ['Action', 'Science Fiction'],
    saga: 'Mad Max',
    description: 'Max aide une communauté de survivants à défendre leur raffinerie de pétrole contre un gang de mercenaires sur des véhicules.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Mad Max: Fury Road',
    director: 'George Miller',
    actors: [
      {
        name: 'Tom Hardy',
      },
      {
        name: 'Charlize Theron',
      },
      {
        name: 'Nicholas Hoult',
      },
      {
        name: 'Josh Helman',
      },
      {
        name: 'Nathan Jones',
      },
      {
        name: 'Zoë Kravitz',
      },
      {
        name: 'Rosie Huntington-Whiteley',
      },
    ],
    coverUrl: '/movies_pictures/furyroad.png',
    releaseDate: '2015-05-15',
    length: 120,
    genre: ['Action', 'Science Fiction'],
    saga: 'Mad Max',
    description: 'Max et Furiosa fuient à travers le désert dans un camion-citerne, poursuivis par le tyran Immortan Joe et son armée de War Boys.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2016 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2016 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 2016 },
      { type: OscarEnum.OSCAR_BEST_MAKEUP, year: 2016 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2016 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2016 },
    ],
  },
  {
    title: 'Furiosa',
    director: 'George Miller',
    actors: [
      {
        name: 'Anya Taylor-Joy',
      },
      {
        name: 'Chris Hemsworth',
      },
      {
        name: 'Tom Burke',
      },
      {
        name: 'Nathan Jones',
      },
      {
        name: 'Angus Sampson',
      },
      {
        name: 'Daniel Webber',
      },
      {
        name: 'Lachy Hulme',
      },
    ],
    coverUrl: '/movies_pictures/furiosa-une-saga-mad-max-afff.jpg',
    releaseDate: '2024-05-24',
    length: 148,
    genre: ['Action', 'Science Fiction'],
    saga: 'Mad Max',
    description: 'Origines de Furiosa : enlevée de sa terre natale verdoyante, elle devient guerrière dans la Citadelle d\'Immortan Joe.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'La Planète des singes',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Mark Wahlberg',
      },
      {
        name: 'Tim Roth',
      },
      {
        name: 'Helena Bonham Carter',
      },
      {
        name: 'Michael Clarke Duncan',
      },
      {
        name: 'Paul Giamatti',
      },
      {
        name: 'Estella Warren',
      },
      {
        name: 'Cary-Hiroyuki Tagawa',
      },
    ],
    coverUrl: '/movies_pictures/69214709_af.jpg',
    releaseDate: '2001-07-27',
    length: 119,
    genre: ['Science Fiction', 'Aventure'],
    saga: '',
    description: 'Un astronaute américain échoue sur une planète où les singes intelligents dominent et asservissent les humains primitifs.',
    fromEntity: {
      entityType: 'book',
      title: 'La Planète des singes',
      secondEntityKey: 'Pierre Boulle',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'La Planète des singes : Les Origines',
    director: 'Rupert Wyatt',
    actors: [
      {
        name: 'James Franco',
      },
      {
        name: 'Freida Pinto',
      },
      {
        name: 'John Lithgow',
      },
      {
        name: 'Brian Cox',
      },
      {
        name: 'Tom Felton',
      },
      {
        name: 'David Oyelowo',
      },
      {
        name: 'Andy Serkis',
      },
    ],
    coverUrl: '/movies_pictures/52d7845d25b9.jpg',
    releaseDate: '2011-08-10',
    length: 105,
    genre: ['Science Fiction'],
    saga: 'La Planète des Singes',
    description: 'Un chimpanzé augmenté par un traitement expérimental mène une révolte contre les humains, amorçant la chute de la civilisation.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: "La Planète des singes : l'affrontement",
    director: 'Matt Reeves',
    actors: [
      {
        name: 'Andy Serkis',
      },
      {
        name: 'Jason Clarke',
      },
      {
        name: 'Gary Oldman',
      },
      {
        name: 'Keri Russell',
      },
      {
        name: 'Toby Kebbell',
      },
      {
        name: 'Kodi Smit-McPhee',
      },
      {
        name: 'Kirk Acevedo',
      },
    ],
    coverUrl: '/movies_pictures/e0ce2170326e.jpg',
    releaseDate: '2014-07-30',
    length: 131,
    genre: ['Science Fiction'],
    saga: 'La Planète des Singes',
    description: 'César mène sa colonie de singes dans une guerre contre les survivants humains de San Francisco pour le contrôle de la région.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'La Planète des singes : Suprématie',
    director: 'Matt Reeves',
    actors: [
      {
        name: 'Andy Serkis',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Steve Zahn',
      },
      {
        name: 'Karin Konoval',
      },
      {
        name: 'Amiah Miller',
      },
      {
        name: 'Terry Notary',
      },
      {
        name: 'Gabriel Chavarria',
      },
    ],
    coverUrl: '/movies_pictures/84c5e2a3ad35.jpg',
    releaseDate: '2017-08-02',
    length: 140,
    genre: ['Science Fiction'],
    saga: 'La Planète des Singes',
    description: 'César affronte le colonel humain qui massacre les singes et les humains malades dans une guerre sans merci.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'La Planète des Singes : Le Nouveau Royaume',
    director: 'Wes Ball',
    actors: [
      {
        name: 'Owen Teague',
      },
      {
        name: 'Freya Allan',
      },
      {
        name: 'Kevin Durand',
      },
      {
        name: 'Peter Macon',
      },
      {
        name: 'William H. Macy',
      },
    ],
    coverUrl: '/movies_pictures/ae81cf7ce689.jpg',
    releaseDate: '2024-01-01',
    length: 120,
    genre: ['Science Fiction'],
    saga: 'La Planète des Singes',
    description: 'Des générations après César, un jeune chimpanzé part à la recherche d\'un avenir au-delà des frontières imposées par un roi tyrannique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },

  {
    title: 'TRON : Ares',
    director: 'Joachim Rønning',
    actors: [
      {
        name: 'Ariana Grande',
      },
      {
        name: 'Cynthia Erivo',
      },
      {
        name: 'Jonathan Bailey',
      },
      {
        name: 'Ethan Slater',
      },
      {
        name: 'Bowen Yang',
      },
      {
        name: 'Michelle Yeoh',
      },
      {
        name: 'Jeff Goldblum',
      },
    ],
    coverUrl: '/movies_pictures/tron_ares.jpg',
    releaseDate: '2025-10-08',
    length: 119,
    genre: ['Science Fiction'],
    saga: 'Tron',
    description: 'Un programme nommé Ares est envoyé du monde numérique Grid vers le monde réel dans une mission qui bouleverse les deux univers.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
];
