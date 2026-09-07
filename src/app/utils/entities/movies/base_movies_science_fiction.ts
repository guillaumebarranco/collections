import { BaseMovie, OscarEnum } from '../../../models/movie-model';

export const baseMoviesScienceFiction: BaseMovie[] = [
  {
    title: 'I, Robot',
    director: 'Alex Proyas',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Bridget Moynahan',
      },
      {
        name: 'Bruce Greenwood',
      },
      {
        name: 'James Cromwell',
      },
      {
        name: 'Chi McBride',
      },
      {
        name: 'Alan Tudyk',
      },
      {
        name: 'Shia LaBeouf',
      },
    ],
    coverUrl: '/movies_pictures/10f95776500c.jpg',
    releaseDate: '2004-12-10',
    length: 115,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Les Robots",
      secondEntityKey: "Isaac Asimov",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Mickey 17',
    director: 'Bong Joon-ho',
    actors: [
      {
        name: 'Robert Pattinson',
      },
      {
        name: 'Steven Yeun',
      },
      {
        name: 'Naomi Ackie',
      },
      {
        name: 'Toni Collette',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Holliday Grainger',
      },
      {
        name: 'Cameron Britton',
      },
    ],
    coverUrl: '/movies_pictures/dc0e0c2ccb36.jpg',
    releaseDate: '2025-01-31',
    length: 137,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Blade Runner',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Edward James Olmos',
      },
      {
        name: 'Rutger Hauer',
      },
      {
        name: 'Sean Young',
      },
      {
        name: 'Daryl Hannah',
      },
      {
        name: 'Brion James',
      },
      {
        name: 'Joanna Cassidy',
      },
    ],
    coverUrl: '/movies_pictures/47d6a459ed78.jpg',
    releaseDate: '1982-09-09',
    length: 117,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Les Androïdes rêvent-ils de moutons électriques ?',
      secondEntityKey: 'Philip K. Dick',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Blade Runner 2049',
    director: 'Denis Villeneuve',
    actors: [
      {
        name: 'Ryan Gosling',
      },
      {
        name: 'Harrison Ford',
      },
      {
        name: 'Ana de Armas',
      },
      {
        name: 'Jared Leto',
      },
      {
        name: 'Robin Wright',
      },
      {
        name: 'Sylvia Hoeks',
      },
      {
        name: 'Dave Bautista',
      },
    ],
    coverUrl: '/movies_pictures/2027848e6a3d.jpg',
    releaseDate: '2017-10-04',
    length: 164,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Les Androïdes rêvent-ils de moutons électriques ?',
      secondEntityKey: 'Philip K. Dick',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2018 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2018 },
    ],
  },
  {
    title: 'La 5ème Vague',
    director: 'J Blakeson',
    actors: [
      { name: 'Chloë Grace Moretz' },
      { name: 'Nick Robinson' },
      { name: 'Alex Roe' },
      { name: 'Maika Monroe' },
      { name: 'Liev Schreiber' },
      { name: 'Maria Bello' },
      { name: 'Ron Livingston' },
    ],
    coverUrl: '/movies_pictures/a0000053.webp',
    releaseDate: '2016-01-22',
    length: 112,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'La 5ème Vague',
      secondEntityKey: 'Rick Yancey',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },

  {
    title: 'Everything Everywhere All at Once',
    director: 'Daniel Kwan, Daniel Scheinert',
    actors: [
      {
        name: 'Michelle Yeoh',
      },
      {
        name: 'Stephanie Hsu',
      },
      {
        name: 'James Hong',
      },
      {
        name: 'Jonathan Ke Quan',
      },
      {
        name: 'Jamie Lee Curtis',
      },
      {
        name: 'Jenny Slate',
      },
      {
        name: 'Harry Shum Jr',
      },
    ],
    coverUrl: '/movies_pictures/acf5609497a9.jpg',
    releaseDate: '2022-03-25',
    length: 139,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 2023 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2023 },
    ],
  },
  {
    title: 'The One',
    director: 'James Wong',
    actors: [
      {
        name: 'Jet Li',
      },
      {
        name: 'Delroy Lindo',
      },
      {
        name: 'Jason Statham',
      },
      {
        name: 'Carla Gugino',
      },
      {
        name: 'James Morrison',
      },
      {
        name: 'Dylan Bruno',
      },
      {
        name: 'Richard Steinmetz',
      },
    ],
    coverUrl: '/movies_pictures/ae553294ebc9.jpg',
    releaseDate: '2001-11-02',
    length: 87,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "A l'aube du 6ème jour",
    director: 'Roger Spottiswoode',
    actors: [
      { name: 'Arnold Schwarzenegger' },
      { name: 'Tony Goldwyn' },
      { name: 'Michael Rapaport' },
      { name: 'Michael Rooker' },
      { name: 'Sarah Wynter' },
      { name: 'Wendy Crewson' },
      { name: 'Robert Duvall' },
    ],
    coverUrl: '/movies_pictures/a_l_aube_du_sixieme_jour.jpg',
    releaseDate: '2000-11-17',
    length: 123,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Premier contact',
    director: 'Denis Villeneuve',
    actors: [
      { name: 'Amy Adams' },
      { name: 'Jeremy Renner' },
      { name: 'Forest Whitaker' },
      { name: 'Michael Stuhlbarg' },
      { name: 'Tzi Ma' },
      { name: "Mark O'Brien" },
      { name: 'Abigail Pniowsky' },
    ],
    coverUrl: '/movies_pictures/109206907.webp',
    releaseDate: '2016-11-11',
    length: 116,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2017 }],
  },
  {
    title: 'Source Code',
    director: 'Duncan Jones',
    actors: [
      { name: 'Jake Gyllenhaal' },
      { name: 'Michelle Monaghan' },
      { name: 'Vera Farmiga' },
      { name: 'Jeffrey Wright' },
      { name: 'Russell Peters' },
      { name: 'Gordon Pinsent' },
      { name: 'Fay Masterson' },
    ],
    coverUrl: '/movies_pictures/81JgsD1EoIL._UF894,1000_QL80_ .jpg',
    releaseDate: '2011-04-01',
    length: 93,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Le Jour d'Après",
    director: 'Roland Emmerich',
    actors: [
      {
        name: 'Dennis Quaid',
      },
      {
        name: 'Jake Gyllenhaal',
      },
      {
        name: 'Emmy Rossum',
      },
      {
        name: 'Ian Holm',
      },
      {
        name: 'Sela Ward',
      },
      {
        name: 'Dash Mihok',
      },
      {
        name: 'Jay O. Sanders',
      },
    ],
    coverUrl: '/movies_pictures/c239526162d8.jpg',
    releaseDate: '2004-05-28',
    length: 124,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Equilibrium',
    director: 'Kurt Wimmer',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Emily Watson',
      },
      {
        name: 'Taye Diggs',
      },
      {
        name: 'Angus Macfadyen',
      },
      {
        name: 'Sean Bean',
      },
      {
        name: 'William Fichtner',
      },
      {
        name: 'Dominic Purcell',
      },
    ],
    coverUrl: '/movies_pictures/equilibrium-0-150-0-225-crop.jpg',
    releaseDate: '2002-12-06',
    length: 107,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Chaos Walking',
    director: 'Doug Liman',
    actors: [
      {
        name: 'Daisy Ridley',
      },
      {
        name: 'Tom Holland',
      },
      {
        name: 'Mads Mikkelsen',
      },
      {
        name: 'Kurt Sutter',
      },
      {
        name: 'Nick Jonas',
      },
      {
        name: 'Demián Bichir',
      },
      {
        name: 'David Oyelowo',
      },
    ],
    coverUrl: '/movies_pictures/346746-chaos-walking-0-150-0-225-crop.jpg',
    releaseDate: '2021-03-05',
    length: 109,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Le Chaos en marche",
      secondEntityKey: "Patrick Ness",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Tenet',
    director: 'Christopher Nolan',
    actors: [
      {
        name: 'John David Washington',
      },
      {
        name: 'Robert Pattinson',
      },
      {
        name: 'Elizabeth Debicki',
      },
      {
        name: 'Dimple Kapadia',
      },
      {
        name: 'Aaron Taylor-Johnson',
      },
      {
        name: 'Clémence Poésy',
      },
      {
        name: 'Michael Caine',
      },
    ],
    coverUrl:
      '/movies_pictures/aCIFMriQh8rvhxpN1IWGgvH0Tlg-0-150-0-225-crop.jpg',
    releaseDate: '2020-09-03',
    length: 150,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2021 }],
  },
  {
    title: 'Minority Report',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Colin Farrell',
      },
      {
        name: 'Samantha Morton',
      },
      {
        name: 'Max von Sydow',
      },
      {
        name: 'Patrick Kilpatrick',
      },
      {
        name: 'Lois Smith',
      },
      {
        name: 'Peter Stormare',
      },
    ],
    coverUrl: '/movies_pictures/minority_report.jpg',
    releaseDate: '2002-06-21',
    length: 145,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Rapport minoritaire",
      secondEntityKey: "Philip K. Dick",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'La guerre des mondes',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Dakota Fanning',
      },
      {
        name: 'Justin Chatwin',
      },
      {
        name: 'Miranda Otto',
      },
      {
        name: 'Tim Robbins',
      },
      {
        name: 'Rick Gonzalez',
      },
      {
        name: 'Lenny Venito',
      },
    ],
    coverUrl: '/movies_pictures/war_of_the_worlds.jpg',
    releaseDate: '2005-06-29',
    length: 117,
    genre: ['Science Fiction'],
    saga: 'La guerre des mondes',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'La guerre des mondes',
      secondEntityKey: 'H.G. Wells',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'La guerre des mondes (1953)',
    director: 'Byron Haskin',
    actors: [
      {
        name: 'Gene Barry',
      },
      {
        name: 'Ann Robinson',
      },
      {
        name: 'Cedric Hardwicke',
      },
      {
        name: 'Les Tremayne',
      },
      {
        name: 'Edgar Barrier',
      },
      {
        name: 'Henry Brandon',
      },
      {
        name: 'Ivan Lebedeff',
      },
    ],
    coverUrl: '/movies_pictures/120db49684c4.jpg',
    releaseDate: '1953-08-26',
    length: 85,
    genre: ['Science Fiction', 'Thriller'],
    saga: 'La guerre des mondes',
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'La guerre des mondes',
      secondEntityKey: 'H.G. Wells',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1954 }],
  },
  {
    title: 'La grande guerre martienne (1913-1917)',
    director: 'Christopher Spencer',
    actors: [{ name: 'Inconnu' }],
    coverUrl: '/movies_pictures/dbff0b0b2567.jpg',
    releaseDate: '2013-12-07',
    length: 47,
    genre: ['Science Fiction', 'Documentaire'],
    saga: 'La guerre des mondes',
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'La guerre des mondes',
      secondEntityKey: 'H.G. Wells',
    },
    countryOrigin: ['Royaume-Uni', 'Canada'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'A.I. Intelligence artificielle',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Haley Joel Osment',
      },
      {
        name: 'Jude Law',
      },
      {
        name: "Frances O'Connor",
      },
      {
        name: 'Brendan Gleeson',
      },
      {
        name: 'William Hurt',
      },
      {
        name: 'Sam Robards',
      },
      {
        name: 'Jake Thomas',
      },
    ],
    coverUrl: '/movies_pictures/69216449_af.webp',
    releaseDate: '2001-06-29',
    length: 146,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Super-Toys Last All Summer Long",
      secondEntityKey: "Brian Aldiss",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'E.T. the Extra-Terrestrial',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Dee Wallace',
      },
      {
        name: 'Peter Coyote',
      },
      {
        name: 'Henry Thomas',
      },
      {
        name: 'Drew Barrymore',
      },
      {
        name: 'Erika Eleniak',
      },
      {
        name: 'C. Thomas Howell',
      },
      {
        name: 'Sean Frye',
      },
    ],
    coverUrl:
      '/movies_pictures/51520-e-t-the-extra-terrestrial-0-150-0-225-crop.jpg',
    releaseDate: '1982-06-11',
    length: 115,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1983 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1983 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1983 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1983 },
    ],
  },
  {
    title: 'Ready Player One',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Olivia Cooke',
      },
      {
        name: 'Ben Mendelsohn',
      },
      {
        name: 'T.J. Miller',
      },
      {
        name: 'Tye Sheridan',
      },
      {
        name: 'Mark Rylance',
      },
      {
        name: 'Lena Waithe',
      },
      {
        name: 'Simon Pegg',
      },
    ],
    coverUrl: '/movies_pictures/543f48eaef14.jpg',
    releaseDate: '2018-03-29',
    length: 140,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Player One',
      secondEntityKey: 'Ernest Cline',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le Cinquième Élément',
    director: 'Luc Besson',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Gary Oldman',
      },
      {
        name: 'Milla Jovovich',
      },
      {
        name: 'Chris Tucker',
      },
      {
        name: 'Ian Holm',
      },
      {
        name: 'Tricky',
      },
      {
        name: 'Lee Evans',
      },
    ],
    coverUrl: '/movies_pictures/620762a07465.jpg',
    releaseDate: '1997-05-07',
    length: 126,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Serenity',
    director: 'Joss Whedon',
    actors: [
      {
        name: 'Nathan Fillion',
      },
      {
        name: 'Gina Torres',
      },
      {
        name: 'Alan Tudyk',
      },
      {
        name: 'Morena Baccarin',
      },
      {
        name: 'Adam Baldwin',
      },
      {
        name: 'Jewel Staite',
      },
      {
        name: 'Sean Maher',
      },
    ],
    coverUrl: '/movies_pictures/serenity-0-150-0-225-crop.jpg',
    releaseDate: '2005-09-30',
    length: 119,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Valérian et la Cité des Mille Planètes',
    director: 'Luc Besson',
    actors: [
      {
        name: 'Dane DeHaan',
      },
      {
        name: 'Cara Delevingne',
      },
      {
        name: 'Clive Owen',
      },
      {
        name: 'Rihanna',
      },
      {
        name: 'Ethan Hawke',
      },
      {
        name: 'Herbie Hancock',
      },
      {
        name: 'Kris Wu',
      },
    ],
    coverUrl:
      '/movies_pictures/269458-valerian-and-the-city-of-a-thousand-planets-0-150-0-225-crop.jpg',
    releaseDate: '2017-07-21',
    length: 137,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Interstellar',
    director: 'Christopher Nolan',
    actors: [
      { name: 'Matthew McConaughey' },
      { name: 'Anne Hathaway' },
      { name: 'Matt Damon' },
      { name: 'Jessica Chastain' },
      { name: 'Michael Caine' },
      { name: 'Casey Affleck' },
      { name: 'John Lithgow' },
    ],
    coverUrl: '/movies_pictures/eb5a5264b9bf.jpg',
    releaseDate: '2014-11-07',
    length: 169,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2015 }],
  },
  {
    title: 'Prédictions',
    director: 'Alex Proyas',
    actors: [
      {
        name: 'Nicolas Cage',
      },
      {
        name: 'Rose Byrne',
      },
      {
        name: 'Chandler Canterbury',
      },
      {
        name: 'Lara Robinson',
      },
      {
        name: 'Ben Mendelsohn',
      },
      {
        name: 'Alethea McGrath',
      },
      {
        name: 'Adrienne Pickering',
      },
    ],
    coverUrl: '/movies_pictures/43577-knowing-0-150-0-225-crop.jpg',
    releaseDate: '2009-03-20',
    length: 121,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Jumper',
    director: 'Doug Liman',
    actors: [
      {
        name: 'Hayden Christensen',
      },
      {
        name: 'Rachel Bilson',
      },
      {
        name: 'Samuel L. Jackson',
      },
      {
        name: 'Jamie Bell',
      },
      {
        name: 'Diane Lane',
      },
      {
        name: 'Michael Rooker',
      },
      {
        name: 'AnnaSophia Robb',
      },
    ],
    coverUrl: '/movies_pictures/47842-jumper-0-150-0-225-crop.jpg',
    releaseDate: '2008-02-14',
    length: 88,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Jumper',
      secondEntityKey: 'Steven Gould',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Je Suis une Légende',
    director: 'Francis Lawrence',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Alice Braga',
      },
      {
        name: 'Charlie Tahan',
      },
      {
        name: 'Salli Richardson-Whitfield',
      },
      {
        name: 'Willow Smith',
      },
      {
        name: 'Dash Mihok',
      },
      {
        name: 'Emma Thompson',
      },
    ],
    coverUrl: '/movies_pictures/ab8bfac00d5b.jpg',
    releaseDate: '2007-12-14',
    length: 101,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Je suis une légende',
      secondEntityKey: 'Richard Matheson',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Push',
    director: 'Paul McGuigan',
    actors: [
      {
        name: 'Chris Evans',
      },
      {
        name: 'Dakota Fanning',
      },
      {
        name: 'Camilla Belle',
      },
      {
        name: 'Djimon Hounsou',
      },
      {
        name: 'Cliff Curtis',
      },
      {
        name: 'Ming-Na Wen',
      },
      {
        name: 'Nate Mooney',
      },
    ],
    coverUrl: '/movies_pictures/19172439e197.jpg',
    releaseDate: '2009-02-06',
    length: 111,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Super 8',
    director: 'J.J. Abrams',
    actors: [
      {
        name: 'Joel Courtney',
      },
      {
        name: 'Elle Fanning',
      },
      {
        name: 'Kyle Chandler',
      },
      {
        name: 'Riley Griffiths',
      },
      {
        name: 'Ryan Lee',
      },
      {
        name: 'Ron Eldard',
      },
      {
        name: 'Noah Emmerich',
      },
    ],
    coverUrl: '/movies_pictures/super_8.jpg',
    releaseDate: '2011-06-10',
    length: 112,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan',
    actors: [
      {
        name: 'Leonardo DiCaprio',
      },
      {
        name: 'Ken Watanabe',
      },
      {
        name: 'Joseph Gordon-Levitt',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Elliot Page',
      },
      {
        name: 'Tom Hardy',
      },
      {
        name: 'Cillian Murphy',
      },
    ],
    coverUrl: '/movies_pictures/1803af67b02e.jpg',
    releaseDate: '2010-07-16',
    length: 148,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2011 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2011 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2011 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2011 },
    ],
  },
  {
    title: 'Mr. Nobody',
    director: 'Jaco Van Dormael',
    actors: [
      {
        name: 'Jared Leto',
      },
      {
        name: 'Sarah Polley',
      },
      {
        name: 'Diane Kruger',
      },
      {
        name: 'Linh-Dan Pham',
      },
      {
        name: 'Rhys Ifans',
      },
      {
        name: 'Natasha Little',
      },
      {
        name: 'Toby Regbo',
      },
    ],
    coverUrl: '/movies_pictures/mr_nobody.jpg',
    releaseDate: '2009-09-12',
    length: 141,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Edge of Tomorrow',
    director: 'Doug Liman',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Bill Paxton',
      },
      {
        name: 'Brendan Gleeson',
      },
      {
        name: 'Charlotte Riley',
      },
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Jonas Armstrong',
      },
      {
        name: 'Noah Taylor',
      },
    ],
    coverUrl: '/movies_pictures/a8e1262e7111.jpg',
    releaseDate: '2014-06-06',
    length: 113,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'manga',
      title: 'All You Need Is Kill',
      secondEntityKey: 'Takeshi Obata',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Gravity',
    director: 'Alfonso Cuarón',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'George Clooney',
      },
      {
        name: 'Ed Harris',
      },
      {
        name: 'Paul Sharma',
      },
      {
        name: 'Amy Warren',
      },
    ],
    coverUrl: '/movies_pictures/21023233_20130729173134181.webp',
    releaseDate: '2013-10-04',
    length: 91,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2014 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2014 },
    ],
  },
  {
    title: 'Elysium',
    director: 'Neill Blomkamp',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Jodie Foster',
      },
      {
        name: 'William Fichtner',
      },
      {
        name: 'Alice Braga',
      },
      {
        name: 'Diego Luna',
      },
      {
        name: 'Michael Shanks',
      },
      {
        name: 'Sharlto Copley',
      },
    ],
    coverUrl: '/movies_pictures/elysium.jpg',
    releaseDate: '2013-08-09',
    length: 109,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'After Earth',
    director: 'M. Night Shyamalan',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Jaden Smith',
      },
      {
        name: 'Zoë Kravitz',
      },
      {
        name: 'Sophie Okonedo',
      },
      {
        name: 'Isabelle Fuhrman',
      },
      {
        name: 'David Denman',
      },
      {
        name: 'Glenn Morshower',
      },
    ],
    coverUrl: '/movies_pictures/after_earth.jpg',
    releaseDate: '2013-05-31',
    length: 100,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Oblivion',
    director: 'Joseph Kosinski',
    actors: [
      { name: 'Tom Cruise' },
      { name: 'Morgan Freeman' },
      { name: 'Andrea Riseborough' },
      { name: 'Olga Kurylenko' },
      { name: 'Melissa Leo' },
      { name: 'Nikolaj Coster-Waldau' },
      { name: 'Zoë Bell' },
    ],
    coverUrl: '/movies_pictures/62108-oblivion-0-150-0-225-crop.jpg',
    releaseDate: '2013-04-19',
    length: 124,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Chronicle',
    director: 'Josh Trank',
    actors: [
      {
        name: 'Dane DeHaan',
      },
      {
        name: 'Michael Kelly',
      },
      {
        name: 'Alex Russell',
      },
      {
        name: 'Michael B. Jordan',
      },
      {
        name: 'Ashley Hinshaw',
      },
      {
        name: 'Anna Wood',
      },
    ],
    coverUrl: '/movies_pictures/chronicles.jpg',
    releaseDate: '2012-02-03',
    length: 84,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Time Out',
    director: 'Andrew Niccol',
    actors: [
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Justin Timberlake',
      },
      {
        name: 'Collins Pennie',
      },
      {
        name: 'Cillian Murphy',
      },
      {
        name: 'Olivia Wilde',
      },
      {
        name: 'Matthew Bomer',
      },
      {
        name: 'Alex Pettyfer',
      },
    ],
    coverUrl: '/movies_pictures/19816803.jpg',
    releaseDate: '2011-10-28',
    length: 109,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Cowboys & Aliens',
    director: 'Jon Favreau',
    actors: [
      {
        name: 'Daniel Craig',
      },
      {
        name: 'Abigail Spencer',
      },
      {
        name: 'Matthew Taylor',
      },
      {
        name: 'Clancy Brown',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Adam Beach',
      },
      {
        name: 'Sam Rockwell',
      },
    ],
    coverUrl: '/movies_pictures/cowboy_and_aliens.jpg',
    releaseDate: '2011-07-29',
    length: 118,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Running Man',
    director: 'Paul Michael Glaser',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'María Conchita Alonso',
      },
      {
        name: 'Yaphet Kotto',
      },
      {
        name: 'Jim Brown',
      },
      {
        name: 'Jesse Ventura',
      },
      {
        name: 'Charles Kalani',
      },
      {
        name: 'Dweezil Zappa',
      },
    ],
    coverUrl: '/movies_pictures/51287-the-running-man-0-150-0-225-crop.jpg',
    releaseDate: '1987-11-13',
    length: 101,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Running man',
      secondEntityKey: 'Stephen King',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Total Recall',
    director: 'Paul Verhoeven',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Ronny Cox',
      },
      {
        name: 'Sharon Stone',
      },
      {
        name: 'Rachel Ticotin',
      },
      {
        name: 'Michael Ironside',
      },
      {
        name: 'Dean Norris',
      },
      {
        name: 'Marshall Bell',
      },
    ],
    coverUrl: '/movies_pictures/51291-total-recall-0-150-0-225-crop.jpg',
    releaseDate: '1990-06-01',
    length: 113,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "We Can Remember It for You Wholesale",
      secondEntityKey: "Philip K. Dick",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1991 }],
  },
  {
    title: 'Adam à travers le temps',
    director: 'Shawn Levy',
    actors: [
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Zoe Saldana',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Jennifer Gardner',
      },
    ],
    coverUrl: '/movies_pictures/4623310.jpg',
    releaseDate: '2022-03-11',
    length: 106,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Electric State',
    director: 'Anthony Russo, Joe Russo',
    actors: [
      {
        name: 'Millie Bobby Brown',
      },
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Jonathan Ke Quan',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Jason Alexander',
      },
      {
        name: 'Giancarlo Esposito',
      },
      {
        name: 'Woody Norman',
      },
    ],
    coverUrl: '/movies_pictures/91d914b62cd0ddfc76c549ccd619abce.webp',
    releaseDate: '2025-01-10',
    length: 128,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Renaissances',
    director: 'Tarsem Singh',
    actors: [
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Ben Kingsley',
      },
      {
        name: 'Matthew Goode',
      },
      {
        name: 'Michelle Dockery',
      },
      {
        name: 'Natalie Martinez',
      },
      {
        name: 'Derek Luke',
      },
      {
        name: 'Victor Garber',
      },
    ],
    coverUrl: '/movies_pictures/510747.jpg',
    releaseDate: '2015-07-29',
    length: 117,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Companion',
    director: 'Drew Hancock',
    actors: [
      {
        name: 'Sophie Thatcher',
      },
      {
        name: 'Jack Quaid',
      },
      {
        name: 'Lukas Gage',
      },
      {
        name: 'Megan Suri',
      },
      {
        name: 'Harvey Guillén',
      },
      {
        name: 'Rupert Friend',
      },
      {
        name: 'Jaboukie Young-White',
      },
    ],
    coverUrl: '/movies_pictures/4ffee73796c73bcc7b7f695ef6a18f61.jpg',
    releaseDate: '2025-01-31',
    length: 97,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Predestination',
    director: 'Michael Spierig, Peter Spierig',
    actors: [
      {
        name: 'Ethan Hawke',
      },
      {
        name: 'Sarah Snook',
      },
      {
        name: 'Noah Taylor',
      },
      {
        name: 'Christopher Kirby',
      },
      {
        name: 'Jim Knobeloch',
      },
    ],
    coverUrl: '/movies_pictures/p11111906_p_v11_av.jpg',
    releaseDate: '2014-08-28',
    length: 97,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "All You Zombies",
      secondEntityKey: "Robert A. Heinlein",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Looper',
    director: 'Rian Johnson',
    actors: [
      {
        name: 'Joseph Gordon-Levitt',
      },
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Piper Perabo',
      },
      {
        name: 'Jeff Daniels',
      },
      {
        name: 'Tracie Thoms',
      },
    ],
    coverUrl: '/movies_pictures/20239211.webp',
    releaseDate: '2012-09-28',
    length: 118,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Seul sur Mars',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Jessica Chastain',
      },
      {
        name: 'Kristen Wiig',
      },
      {
        name: 'Jeff Daniels',
      },
      {
        name: 'Michael Peña',
      },
      {
        name: 'Kate Mara',
      },
      {
        name: 'Sean Bean',
      },
    ],
    coverUrl: '/movies_pictures/305329.jpg',
    releaseDate: '2015-09-30',
    length: 141,
    genre: ['Science Fiction', 'Aventure'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Seul sur Mars",
      secondEntityKey: "Andy Weir",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Seul contre tous',
    director: 'Peter Landesman',
    actors: [
      {
        name: 'Kevin Sorbo',
      },
      {
        name: 'Yvette Nipar',
      },
      {
        name: 'Elizabeth Barondes',
      },
      {
        name: 'Haley Ramm',
      },
      {
        name: 'Rodrigo De la Rosa',
      },
      {
        name: 'Jonny Cruz',
      },
      {
        name: 'Mark W. Johnson',
      },
    ],
    coverUrl: '/movies_pictures/438540.jpg',
    releaseDate: '2007-12-14',
    length: 101,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Fin des temps',
    director: 'Peter Hyams',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Robin Tunney',
      },
      {
        name: 'Gabriel Byrne',
      },
      {
        name: 'Rod Steiger',
      },
      {
        name: 'Kevin Pollak',
      },
      {
        name: 'CCH Pounder',
      },
      {
        name: 'Miriam Margolyes',
      },
    ],
    coverUrl: '/movies_pictures/066451.webp',
    releaseDate: '1999-09-03',
    length: 123,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Armée des 12 singes",
    director: 'Terry Gilliam',
    actors: [
      { name: 'Bruce Willis' },
      { name: 'Brad Pitt' },
      { name: 'Madeleine Stowe' },
      { name: 'Christopher Plummer' },
      { name: 'David Morse' },
      { name: 'Frank Gorshin' },
      { name: 'Joseph Melito' },
    ],
    coverUrl: '/movies_pictures/81xkdqlwzymi3f4idfcep3chngs-175.jpg',
    releaseDate: '1995-12-27',
    length: 129,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Clones',
    director: 'Jonathan Mostow',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Radha Mitchell',
      },
      {
        name: 'Rosamund Pike',
      },
      {
        name: 'Boris Kodjoe',
      },
      {
        name: 'Jack Noseworthy',
      },
      {
        name: 'James Cromwell',
      },
      {
        name: 'Ving Rhames',
      },
    ],
    coverUrl: '/movies_pictures/19169762.jpg',
    releaseDate: '2009-05-22',
    length: 115,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Ad Astra',
    director: 'James Gray',
    actors: [
      {
        name: 'Brad Pitt',
      },
      {
        name: 'Ruth Negga',
      },
      {
        name: 'Jamie Kennedy',
      },
      {
        name: 'Donal Sutherland',
      },
      {
        name: 'Tommy Lee Jones',
      },
      {
        name: 'Kimberly Elise',
      },
      {
        name: 'Loren Dean',
      },
    ],
    coverUrl: '/movies_pictures/ad-astra.jpg',
    releaseDate: '2019-09-20',
    length: 123,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Cloud Atlas',
    director: 'Lana Wachowski, Lilly Wachowski, Tom Tykwer',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Hugh Grant',
      },
      {
        name: 'Halle Berry',
      },
      {
        name: 'Jim Broadbent',
      },
      {
        name: 'Hugo Weaving',
      },
      {
        name: 'Jim Sturgess',
      },
      {
        name: "James D'Arcy",
      },
    ],
    coverUrl: '/movies_pictures/91+OVDe-sGL.jpg',
    releaseDate: '2012-10-26',
    length: 172,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Finch',
    director: 'Miguel Sapochnik',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Caleb Landry Jones',
      },
      {
        name: 'Skeet Ulrich',
      },
      {
        name: 'Oscar Avila',
      },
      {
        name: 'Christopher Farrar',
      },
      {
        name: 'Lora Martinez-Cunningham',
      },
    ],
    coverUrl: '/movies_pictures/3777037.webp',
    releaseDate: '2021-11-05',
    length: 115,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Vanilla Sky',
    director: 'Cameron Crowe',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Penélope Cruz',
      },
      {
        name: 'Cameron Diaz',
      },
      {
        name: 'Kurt Russell',
      },
      {
        name: 'Jason Lee',
      },
      {
        name: 'Noah Taylor',
      },
      {
        name: 'Timothy Spall',
      },
    ],
    coverUrl: '/movies_pictures/vanilla.jpg',
    releaseDate: '2001-12-14',
    length: 136,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Okja',
    director: 'Bong Joon-ho',
    actors: [
      {
        name: 'Ahn Seo-hyeon',
      },
      {
        name: 'Jake Gyllenhaal',
      },
      {
        name: 'Tilda Swinton',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Steven Yeun',
      },
      {
        name: 'Lily Collins',
      },
      {
        name: 'Shirley Henderson',
      },
    ],
    coverUrl: '/movies_pictures/039567.webp',
    releaseDate: '2017-06-28',
    length: 120,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Corée du Sud'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Reminiscence',
    director: 'Lisa Joy',
    actors: [
      {
        name: 'Hugh Jackman',
      },
      {
        name: 'Rebecca Ferguson',
      },
      {
        name: 'Thandiwe Newton',
      },
      {
        name: 'Cliff Curtis',
      },
      {
        name: 'Marina de Tavira',
      },
      {
        name: 'Daniel Wu',
      },
      {
        name: 'Mojean Aria',
      },
    ],
    coverUrl: '/movies_pictures/3991427.webp',
    releaseDate: '2021-08-20',
    length: 116,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'A Scanner Darkly',
    director: 'Richard Linklater',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Robert Downey Jr.',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Winona Ryder',
      },
      {
        name: 'Rory Cochrane',
      },
      {
        name: 'Alex Jones',
      },
      {
        name: 'Jason Douglas',
      },
    ],
    coverUrl: '/movies_pictures/18653553.webp',
    releaseDate: '2006-07-28',
    length: 100,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Spaceman',
    director: 'Johan Renck',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Carey Mulligan',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Kunal Nayyar',
      },
      {
        name: 'Lena Olin',
      },
      {
        name: 'Isabella Rossellini',
      },
    ],
    coverUrl: '/movies_pictures/1465606.jpg',
    releaseDate: '2024-03-01',
    length: 108,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Island',
    director: 'Michael Bay',
    actors: [
      { name: 'Scarlett Johansson' },
      { name: 'Ewan McGregor' },
      { name: 'Djimon Hounsou' },
      { name: 'Sean Bean' },
      { name: 'Steve Buscemi' },
      { name: 'Michael Clarke Duncan' },
      { name: 'Ethan Phillips' },
    ],
    coverUrl: '/movies_pictures/71ugYlYCs0L._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2005-07-22',
    length: 136,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Ghost in the Shell',
    director: 'Rupert Sanders',
    actors: [
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Johan Philip Pilou Asbæk',
      },
      {
        name: 'Michael Pitt',
      },
      {
        name: 'Takeshi Kitano',
      },
      {
        name: 'Juliette Binoche',
      },
      {
        name: 'Kaori Momoi',
      },
      {
        name: 'Chin Han',
      },
    ],
    coverUrl: '/movies_pictures/314818.webp',
    releaseDate: '2017-03-31',
    length: 107,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Final cut',
    director: 'Omar Naim',
    actors: [
      {
        name: 'Robin Williams',
      },
      {
        name: 'Mira Sorvino',
      },
      {
        name: 'Jim Caviezel',
      },
      {
        name: 'Stephanie Romanov',
      },
      {
        name: 'Mimi Kuzyk',
      },
      {
        name: 'Genevieve Buechner',
      },
      {
        name: 'Brendan Fletcher',
      },
    ],
    coverUrl: '/movies_pictures/18403565.jpg',
    releaseDate: '2004-09-10',
    length: 106,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Deep Impact',
    director: 'Mimi Leder',
    actors: [
      {
        name: 'Robert Duvall',
      },
      {
        name: 'Téa Leoni',
      },
      {
        name: 'Elijah Wood',
      },
      {
        name: 'Vanessa Redgrave',
      },
      {
        name: 'Maximilian Schell',
      },
      {
        name: 'James Cromwell',
      },
      {
        name: 'Ron Eldard',
      },
    ],
    coverUrl:
      '/movies_pictures/i-watched-deep-impact-1998-v0-czgltc72dm6d1.webp',
    releaseDate: '1998-05-08',
    length: 120,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Transcendance',
    director: 'Wally Pfister',
    actors: [
      { name: 'Morgan Freeman' },
      { name: 'Johnny Depp' },
      { name: 'Rebecca Ferguson' },
      { name: 'Rebecca Hall' },
      { name: 'Paul Bettany' },
      { name: 'Kate Mara' },
      { name: 'Cillian Murphy' },
    ],
    coverUrl: '/movies_pictures/543364.jpg',
    releaseDate: '2014-04-18',
    length: 119,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Signes',
    director: 'M. Night Shyamalan',
    actors: [
      {
        name: 'Mel Gibson',
      },
      {
        name: 'Joaquin Phoenix',
      },
      {
        name: 'Abigail Breslin',
      },
      {
        name: 'Rory Culkin',
      },
      {
        name: 'Cherry Jones',
      },
      {
        name: 'M. Night Shyamalan',
      },
      {
        name: 'Angela Eckert',
      },
    ],
    coverUrl: '/movies_pictures/fsgdgdfgf.jpg',
    releaseDate: '2002-01-01',
    length: 106,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Annihilation',
    director: 'Alex Garland',
    actors: [
      {
        name: 'Natalie Portman',
      },
      {
        name: 'Jennifer Jason Leigh',
      },
      {
        name: 'Oscar Isaac',
      },
      {
        name: 'Gina Rodriguez',
      },
      {
        name: 'Tessa Thompson',
      },
      {
        name: 'Tuva Novotny',
      },
      {
        name: 'Benedict Wong',
      },
    ],
    coverUrl: '/movies_pictures/5079145.webp',
    releaseDate: '2018-01-01',
    length: 115,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Passengers',
    director: 'Morten Tyldum',
    actors: [
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Michael Sheen',
      },
      {
        name: 'Laurence Fishburne',
      },
      {
        name: 'Andy García',
      },
      {
        name: 'Aurora Perrineau',
      },
      {
        name: 'Fred Melamed',
      },
    ],
    coverUrl: '/movies_pictures/405336.webp',
    releaseDate: '2016-12-21',
    length: 116,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Mutante',
    director: 'Roger Donaldson',
    actors: [
      {
        name: 'Ben Kingsley',
      },
      {
        name: 'Michael Madsen',
      },
      {
        name: 'Alfred Molina',
      },
      {
        name: 'Forest Whitaker',
      },
      {
        name: 'Marg Helgenberger',
      },
      {
        name: 'Natasha Henstridge',
      },
      {
        name: 'Michelle Williams',
      },
    ],
    coverUrl: '/movies_pictures/la-mutante-affiche-VOD.jpg',
    releaseDate: '1995-07-07',
    length: 108,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Anon',
    director: 'Andrew Niccol',
    actors: [
      {
        name: 'Clive Owen',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Colm Feore',
      },
      {
        name: "Mark O'Brien",
      },
      {
        name: 'Sonya Walger',
      },
      {
        name: 'Joe Pingue',
      },
      {
        name: 'Iddo Goldberg',
      },
    ],
    coverUrl: '/movies_pictures/1599322.webp',
    releaseDate: '2018-05-04',
    length: 100,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Seven Sisters',
    director: 'Tommy Wirkola',
    actors: [
      { name: 'Noomi Rapace' },
      { name: 'Glenn Close' },
      { name: 'Willem Dafoe' },
      { name: 'Marwan Kenzari' },
      { name: 'Christian Rubeck' },
      { name: 'Pal Sverre Hagen' },
      { name: 'Clara Read' },
    ],
    coverUrl: '/movies_pictures/162904.webp',
    releaseDate: '2017-08-30',
    length: 123,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "2001 : L'Odyssée de l'espace",
    director: 'Stanley Kubrick',
    actors: [
      {
        name: 'Keir Dullea',
      },
      {
        name: 'Gary Lockwood',
      },
      {
        name: 'William Sylvester',
      },
      {
        name: 'Leonard Rossiter',
      },
      {
        name: 'Margaret Tyzack',
      },
      {
        name: 'Robert Beatty',
      },
      {
        name: 'Sean Sullivan',
      },
    ],
    coverUrl: '/movies_pictures/2001-lodyssee-de-lespace.jpg',
    releaseDate: '2018-07-30',
    length: 149,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Dune',
    director: 'David Lynch',
    actors: [
      {
        name: 'Max von Sydow',
      },
      {
        name: 'Kyle MacLachlan',
      },
      {
        name: 'Francesca Annis',
      },
      {
        name: 'Sting',
      },
      {
        name: 'Leonardo Cimino',
      },
      {
        name: 'Brad Dourif',
      },
      {
        name: 'Linda Hunt',
      },
    ],
    coverUrl: '/movies_pictures/d99e21e694eb.jpeg',
    releaseDate: '1984-12-14',
    length: 137,
    genre: ['Science Fiction', 'Aventure', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Mimic',
    director: 'Guillermo del Toro',
    actors: [
      {
        name: 'Mira Sorvino',
      },
      {
        name: 'Jeremy Northam',
      },
      {
        name: 'Josh Brolin',
      },
      {
        name: 'Charles S. Dutton',
      },
      {
        name: 'Giancarlo Giannini',
      },
      {
        name: 'F. Murray Abraham',
      },
      {
        name: 'Alexander Goodwin',
      },
    ],
    coverUrl: '/movies_pictures/7d89a4ef4932.jpg',
    releaseDate: '1997-08-22',
    length: 105,
    genre: ['Science Fiction', 'Horreur', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'THX 1138',
    director: 'George Lucas',
    actors: [
      {
        name: 'Robert Duvall',
      },
      {
        name: 'Donald Pleasence',
      },
      {
        name: 'Don Pedro Colley',
      },
      {
        name: 'Maggie McOmie',
      },
      {
        name: 'Ian Wolfe',
      },
      {
        name: 'Sid Haig',
      },
      {
        name: 'Matthew Robbins',
      },
    ],
    coverUrl: '/movies_pictures/a2bb0eb07061.jpg',
    releaseDate: '1971-03-11',
    length: 88,
    genre: ['Science Fiction', 'Dystopie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Videodrome',
    director: 'David Cronenberg',
    actors: [
      {
        name: 'James Woods',
      },
      {
        name: 'Sonja Smits',
      },
      {
        name: 'Debbie Harry',
      },
      {
        name: 'Leslie Carlson',
      },
      {
        name: 'Peter Dvorský',
      },
      {
        name: 'Jack Creley',
      },
      {
        name: 'Jayne Eastwood',
      },
    ],
    coverUrl: '/movies_pictures/8c3008eafcbf.jpg',
    releaseDate: '1983-02-04',
    length: 87,
    genre: ['Science Fiction', 'Horreur', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Mouche',
    director: 'David Cronenberg',
    actors: [
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Geena Davis',
      },
      {
        name: 'John Getz',
      },
      {
        name: 'George Chuvalo',
      },
      {
        name: 'David Cronenberg',
      },
    ],
    coverUrl: '/movies_pictures/11f541ce75b9.jpg',
    releaseDate: '1986-08-15',
    length: 96,
    genre: ['Science Fiction', 'Horreur', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis', 'Canada'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_MAKEUP, year: 1987 }],
  },
  {
    title: 'eXistenZ',
    director: 'David Cronenberg',
    actors: [
      {
        name: 'Jennifer Jason Leigh',
      },
      {
        name: 'Jude Law',
      },
      {
        name: 'Ian Holm',
      },
      {
        name: 'Don McKellar',
      },
      {
        name: 'Callum Keith Rennie',
      },
      {
        name: 'Sarah Polley',
      },
      {
        name: 'Christopher Eccleston',
      },
    ],
    coverUrl: '/movies_pictures/fddf2bb65a50.jpg',
    releaseDate: '1999-04-23',
    length: 97,
    genre: ['Science Fiction', 'Thriller', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada', 'Royaume-Uni', 'France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Scanners',
    director: 'David Cronenberg',
    actors: [
      {
        name: 'Stephen Lack',
      },
      {
        name: "Jennifer O'Neill",
      },
      {
        name: 'Patrick McGoohan',
      },
      {
        name: 'Michael Ironside',
      },
      {
        name: 'Heiner Lauterbach',
      },
      {
        name: 'Niels Clausnitzer',
      },
      {
        name: 'Manfred Schott',
      },
    ],
    coverUrl: '/movies_pictures/556b6a1eebb6.jpg',
    releaseDate: '1981-01-14',
    length: 103,
    genre: ['Science Fiction', 'Horreur', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'They Live',
    director: 'John Carpenter',
    actors: [
      {
        name: 'Roddy Piper',
      },
      {
        name: 'Keith David',
      },
      {
        name: 'Meg Foster',
      },
      {
        name: 'Raymond St. Jacques',
      },
      {
        name: 'George Buck Flower',
      },
      {
        name: 'Sy Richardson',
      },
      {
        name: 'Tommy Morrison',
      },
    ],
    coverUrl: '/movies_pictures/c1817fae3f28.jpg',
    releaseDate: '1988-11-23',
    length: 94,
    genre: ['Science Fiction', 'Action', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Snowpiercer',
    director: 'Bong Joon-ho',
    actors: [
      {
        name: 'Jennifer Connelly',
      },
      {
        name: 'Daveed Diggs',
      },
      {
        name: 'Mickey Sumner',
      },
      {
        name: 'Annalise Basso',
      },
      {
        name: 'Alison Wright',
      },
      {
        name: 'Susan Park',
      },
      {
        name: 'Lena Hall',
      },
    ],
    coverUrl: '/movies_pictures/21038075_20130909110053289.jpg',
    releaseDate: '2013-07-29',
    length: 126,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Corée du Sud'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'District 9',
    director: 'Neill Blomkamp',
    actors: [
      {
        name: 'Sharlto Copley',
      },
      {
        name: 'David James',
      },
      {
        name: 'Nathalie Boltt',
      },
      {
        name: 'Sylvaine Strike',
      },
      {
        name: 'John Sumner',
      },
      {
        name: 'Jed Brophy',
      },
      {
        name: 'Vittorio Leonardi',
      },
    ],
    coverUrl: '/movies_pictures/19149593.webp',
    releaseDate: '2009-08-14',
    length: 112,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Gattaca',
    director: 'Andrew Niccol',
    actors: [
      {
        name: 'Uma Thurman',
      },
      {
        name: 'Ethan Hawke',
      },
      {
        name: 'Jude Law',
      },
      {
        name: 'Alan Arkin',
      },
      {
        name: 'Gore Vidal',
      },
      {
        name: 'Ernest Borgnine',
      },
      {
        name: 'Tony Shalhoub',
      },
    ],
    coverUrl: '/movies_pictures/71DgyEsdJML._AC_UF1000,1000_QL80_.jpg',
    releaseDate: '1997-10-24',
    length: 106,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Mars Attacks !',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Lukas Haas',
      },
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Sylvia Sidney',
      },
      {
        name: 'Jim Brown',
      },
      {
        name: 'Pam Grier',
      },
      {
        name: 'Glenn Close',
      },
      {
        name: 'Annette Bening',
      },
    ],
    coverUrl: '/movies_pictures/75325_20130717152336267.webp',
    releaseDate: '1996-12-13',
    length: 106,
    genre: ['Science Fiction', 'Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
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
      {
        name: 'Brandon Perea',
      },
      {
        name: 'Michael Wincott',
      },
      {
        name: 'Keith David',
      },
      {
        name: 'Wrenn Schmidt',
      },
    ],
    coverUrl: '/movies_pictures/c5f6e612cd96.jpg',
    releaseDate: '2022-08-10',
    length: 131,
    genre: ['Science Fiction', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
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
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "L'Orange mécanique",
      secondEntityKey: 'Anthony Burgess',
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Projet Dernière Chance',
    director: 'Phil Lord, Chris Miller',
    actors: [
      {
        name: 'Ryan Gosling',
      },
      {
        name: 'Sandra Hüller',
      },
      {
        name: 'James Ortiz',
      },
      {
        name: 'Lionel Boyce',
      },
      {
        name: 'Milana Vayntrub',
      },
      {
        name: 'Ken Leung',
      },
      {
        name: 'Malachi Kirby',
      },
    ],
    coverUrl: '/movies_pictures/b958c20e3a4a.jpg',
    releaseDate: '2026-03-18',
    length: 156,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },

  {
    title: 'Running Man',
    director: 'Edgar Wright',
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
    coverUrl: '/movies_pictures/running_man.jpg',
    releaseDate: '2025-11-19',
    length: 134,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Running man',
      secondEntityKey: 'Stephen King',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Megalopolis',
    director: 'Francis Ford Coppola',
    actors: [
      {
        name: 'Adam Driver',
      },
      {
        name: 'Giancarlo Esposito',
      },
      {
        name: 'Nathalie Emmanuel',
      },
      {
        name: 'Aubrey Plaza',
      },
      {
        name: 'Shia LaBeouf',
      },
    ],
    coverUrl: '/movies_pictures/megalopolis.jpg',
    releaseDate: '2024-09-25',
    length: 138,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Code 8 : Partie II',
    director: 'Jeff Chan',
    actors: [
      {
        name: 'Robbie Amell',
      },
      {
        name: 'Stephen Amell',
      },
      {
        name: 'Sirena Gulamgaus',
      },
      {
        name: 'Aaron Abrams',
      },
      {
        name: 'Jean Yoon',
      },
    ],
    coverUrl: '/movies_pictures/code_8_partie_ii.jpg',
    releaseDate: '2024-02-28',
    length: 100,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Rebel Moon - Partie 1 : Enfant du feu',
    director: 'Zack Snyder',
    actors: [
      {
        name: 'Sofia Boutella',
      },
      {
        name: 'Djimon Hounsou',
      },
      {
        name: 'Ed Skrein',
      },
      {
        name: 'Michiel Huisman',
      },
      {
        name: 'Doona Bae',
      },
    ],
    coverUrl: '/movies_pictures/rebel_moon_-_partie_1_enfant_du_feu.jpg',
    releaseDate: '2023-12-22',
    length: 133,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'The Creator',
    director: 'Gareth Edwards',
    actors: [
      {
        name: 'John David Washington',
      },
      {
        name: 'Gemma Chan',
      },
      {
        name: 'Ken Watanabe',
      },
      {
        name: 'Allison Janney',
      },
      {
        name: 'Madeleine Yuna Voyles',
      },
    ],
    coverUrl: '/movies_pictures/the_creator.jpg',
    releaseDate: '2023-09-27',
    length: 133,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Le Visiteur du Futur',
    director: 'François Descraques',
    actors: [
      { name: 'Florent Dorin' },
      { name: 'Arnaud Joyet' },
      { name: 'François Descraques' },
      { name: 'Enya Baroux' },
      { name: 'Raphaël Descraques' },
      { name: 'Slimane-Baptiste Berhoun' },
      { name: 'Mathias Mlekuz' },
    ],
    coverUrl: '/movies_pictures/le_visiteur_du_futur.jpg',
    releaseDate: '2022-09-07',
    length: 102,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Code 8',
    director: 'Jeff Chan',
    actors: [
      { name: 'Robbie Amell' },
      { name: 'Stephen Amell' },
      { name: 'Sung Kang' },
      { name: 'Aaron Abrams' },
      { name: 'Kari Matchett' },
      { name: 'Greg Bryk' },
      { name: 'Peter Outerbridge' },
    ],
    coverUrl: '/movies_pictures/code_8.jpg',
    releaseDate: '2019-12-13',
    length: 98,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada'],
    selectDisplayOrder: 5,
    oscars: [],
  },

  {
    title: 'Life : Origine inconnue',
    director: 'Daniel Espinosa',
    actors: [
      { name: 'Jake Gyllenhaal' },
      { name: 'Rebecca Ferguson' },
      { name: 'Ryan Reynolds' },
      { name: 'Hiroyuki Sanada' },
      { name: 'Ariyon Bakare' },
      { name: 'Olga Dihovichnaya' },
    ],
    coverUrl: '/movies_pictures/life.jpg',
    releaseDate: '2017-04-19',
    length: 104,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'À la poursuite de demain',
    director: 'Brad Bird',
    actors: [
      { name: 'George Clooney' },
      { name: 'Britt Robertson' },
      { name: 'Hugh Laurie' },
      { name: 'Raffey Cassidy' },
      { name: 'Tim McGraw' },
      { name: 'Kathryn Hahn' },
      { name: 'Keegan-Michael Key' },
    ],
    coverUrl: '/movies_pictures/tomorrowland.jpg',
    releaseDate: '2015-05-20',
    length: 130,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Chappie',
    director: 'Neill Blomkamp',
    actors: [
      { name: 'Sharlto Copley' },
      { name: 'Dev Patel' },
      { name: 'Hugh Jackman' },
      { name: 'Sigourney Weaver' },
      { name: 'Ninja' },
      { name: 'Yo-Landi Visser' },
      { name: 'Jose Pablo Cantillo' },
    ],
    coverUrl: '/movies_pictures/chappie.jpg',
    releaseDate: '2015-03-04',
    length: 120,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Her',
    director: 'Spike Jonze',
    actors: [
      { name: 'Joaquin Phoenix' },
      { name: 'Scarlett Johansson' },
      { name: 'Amy Adams' },
      { name: 'Rooney Mara' },
      { name: 'Olivia Wilde' },
      { name: 'Chris Pratt' },
      { name: 'Matt Letscher' },
    ],
    coverUrl: '/movies_pictures/her.jpg',
    releaseDate: '2014-03-19',
    length: 126,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 2014 }],
  },
  {
    title: 'Sunshine',
    director: 'Danny Boyle',
    actors: [
      { name: 'Cillian Murphy' },
      { name: 'Rose Byrne' },
      { name: 'Chris Evans' },
      { name: 'Michelle Yeoh' },
      { name: 'Hiroyuki Sanada' },
      { name: 'Cliff Curtis' },
      { name: 'Mark Strong' },
    ],
    coverUrl: '/movies_pictures/sunshine.jpg',
    releaseDate: '2007-04-11',
    length: 108,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: "Les Fils de l'homme",
    director: 'Alfonso Cuarón',
    actors: [
      { name: 'Clive Owen' },
      { name: 'Julianne Moore' },
      { name: 'Michael Caine' },
      { name: 'Chiwetel Ejiofor' },
      { name: 'Clare-Hope Ashitey' },
      { name: 'Charlie Hunnam' },
      { name: 'Pam Ferris' },
    ],
    coverUrl: '/movies_pictures/children_of_men.jpg',
    releaseDate: '2006-10-18',
    length: 109,
    genre: ['Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Ex Machina',
    director: 'Alex Garland',
    actors: [
      { name: 'Alicia Vikander' },
      { name: 'Domhnall Gleeson' },
      { name: 'Oscar Isaac' },
      { name: 'Sonoya Mizuno' },
    ],
    coverUrl: '/movies_pictures/12f6d7568c93.jpg',
    releaseDate: '2014-12-16',
    length: 108,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 2016 }],
  },
  {
    title: 'The Dog Stars',
    director: 'Ridley Scott',
    actors: [
      { name: 'Jacob Elordi' },
      { name: 'Josh Brolin' },
      { name: 'Margaret Qualley' },
      { name: 'Guy Pearce' },
      { name: 'Allison Janney' },
      { name: 'Benedict Wong' },
    ],
    coverUrl:
      '/movies_pictures/fabb3efae133.jpg',
    releaseDate: '2026-08-28',
    length: 118,
    genre: ['Science Fiction', 'Dystopie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'The Dog Stars',
      secondEntityKey: 'Peter Heller',
    },
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Metropolis',
    director: 'Fritz Lang',
    actors: [
      { name: 'Brigitte Helm' },
      { name: 'Gustav Fröhlich' },
      { name: 'Rudolf Klein-Rogge' },
      { name: 'Alfred Abel' },
      { name: 'Heinrich George' },
    ],
    coverUrl: '/movies_pictures/7a2885c5e586.jpg',
    releaseDate: '1927-01-10',
    length: 153,
    genre: ['Science Fiction', 'Dystopie'],
    saga: '',
    description:
      "Dans une ville futuriste coupée en deux, le fils du maître découvre l'enfer des ouvriers et un robot à l'image de Maria.",
    fromEntity: {
      entityType: 'book',
      title: "Metropolis",
      secondEntityKey: "Thea von Harbou",
    },
    countryOrigin: ['Allemagne'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Le Jour où la Terre s'arrêta",
    director: 'Robert Wise',
    actors: [
      { name: 'Michael Rennie' },
      { name: 'Patricia Neal' },
      { name: 'Hugh Marlowe' },
      { name: 'Sam Jaffe' },
      { name: 'Billy Gray' },
    ],
    coverUrl: '/movies_pictures/e6c8685cc9b8.jpg',
    releaseDate: '1951-09-28',
    length: 92,
    genre: ['Science Fiction'],
    saga: '',
    description:
      "Un extraterrestre et son robot atterrissent à Washington pour exiger la paix, sous peine d'anéantir la Terre.",
    fromEntity: {
      entityType: 'book',
      title: 'Farewell to the Master',
      secondEntityKey: 'Harry Bates',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Godzilla',
    director: 'Ishirô Honda',
    actors: [
      { name: 'Akira Takarada' },
      { name: 'Momoko Kôchi' },
      { name: 'Akihiko Hirata' },
      { name: 'Takashi Shimura' },
      { name: 'Fuyuki Murakami' },
    ],
    coverUrl: '/movies_pictures/8625670e5df9.jpg',
    releaseDate: '1954-11-03',
    length: 96,
    genre: ['Science Fiction', 'Horreur', 'Catastrophe'],
    saga: 'Godzilla',
    description:
      'Un dinosaure radioactif émerge du Pacifique et ravage Tokyo, métaphore de Hiroshima et des essais H.',
    fromEntity: null,
    countryOrigin: ['Japon'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Invasion des profanateurs de sépultures",
    director: 'Don Siegel',
    actors: [
      { name: 'Kevin McCarthy' },
      { name: 'Dana Wynter' },
      { name: 'Larry Gates' },
      { name: 'King Donovan' },
      { name: 'Carolyn Jones' },
    ],
    coverUrl: '/movies_pictures/879d7bcba760.jpg',
    releaseDate: '1956-02-05',
    length: 80,
    genre: ['Science Fiction', 'Horreur'],
    saga: '',
    description:
      'Dans une petite ville de Californie, les habitants sont remplacés par des copies nées de cosses.',
    fromEntity: {
      entityType: 'book',
      title: 'The Body Snatchers',
      secondEntityKey: 'Jack Finney',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Planète interdite',
    director: 'Fred M. Wilcox',
    actors: [
      { name: 'Walter Pidgeon' },
      { name: 'Anne Francis' },
      { name: 'Leslie Nielsen' },
      { name: 'Warren Stevens' },
      { name: 'Jack Kelly' },
    ],
    coverUrl: '/movies_pictures/affiche-planete-interdite.jpg',
    releaseDate: '1956-03-15',
    length: 98,
    genre: ['Science Fiction'],
    saga: '',
    description:
      "Un croiseur spatial atterrit sur Altair IV : un savant, sa fille, Robby le robot et le monstre de l'id.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Jetée',
    director: 'Chris Marker',
    actors: [
      { name: 'Davos Hanich' },
      { name: 'Hélène Chatelain' },
      { name: 'Jacques Ledoux' },
      { name: 'André Heinrich' },
      { name: 'Jean Négroni' },
    ],
    coverUrl: '/movies_pictures/1dd0ce014712.jpg',
    releaseDate: '1962-02-16',
    length: 28,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description:
      "Après la troisième guerre mondiale, un homme est envoyé dans le temps, fixé sur le souvenir d'un visage à Orly.",
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Alphaville',
    director: 'Jean-Luc Godard',
    actors: [
      { name: 'Eddie Constantine' },
      { name: 'Anna Karina' },
      { name: 'Akim Tamiroff' },
      { name: 'Howard Vernon' },
      { name: 'László Szabó' },
    ],
    coverUrl: '/movies_pictures/b9ec64538ac8.jpg',
    releaseDate: '1965-05-05',
    length: 99,
    genre: ['Science Fiction', 'Dystopie', 'Thriller'],
    saga: '',
    description:
      "Lemmy Caution arrive dans une ville gouvernée par l'ordinateur Alpha 60, où l'amour est interdit.",
    fromEntity: null,
    countryOrigin: ['France', 'Italie'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Fahrenheit 451',
    director: 'François Truffaut',
    actors: [
      { name: 'Oskar Werner' },
      { name: 'Julie Christie' },
      { name: 'Cyril Cusack' },
      { name: 'Anton Diffring' },
      { name: 'Jeremy Spenser' },
    ],
    coverUrl:
      'https://medias.unifrance.org/medias/103/197/50535/format_page/fahrenheit-451.jpg',
    releaseDate: '1966-09-16',
    length: 112,
    genre: ['Science Fiction', 'Dystopie'],
    saga: '',
    description:
      'Dans un futur où les livres brûlent, un pompier commence à lire, puis fuit vers les hommes-livres.',
    fromEntity: {
      entityType: 'book',
      title: 'Fahrenheit 451',
      secondEntityKey: 'Ray Bradbury',
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Barbarella',
    director: 'Roger Vadim',
    actors: [
      { name: 'Jane Fonda' },
      { name: 'John Phillip Law' },
      { name: 'Anita Pallenberg' },
      { name: "Milo O'Shea" },
      { name: 'David Hemmings' },
    ],
    coverUrl: '/movies_pictures/5169b6f1bd48.jpg',
    releaseDate: '1968-10-10',
    length: 98,
    genre: ['Science Fiction', 'Aventure', 'Comédie'],
    saga: '',
    description:
      "L'agente Barbarella est envoyée retrouver Duran Duran dans une planète de plaisir et de tyrannie.",
    fromEntity: {
      entityType: 'comic',
      title: 'Barbarella',
      secondEntityKey: 'Jean-Claude Forest',
    },
    countryOrigin: ['France', 'Italie'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Je t'aime, je t'aime",
    director: 'Alain Resnais',
    actors: [
      { name: 'Claude Rich' },
      { name: 'Olga Georges-Picot' },
      { name: 'Anouk Ferjac' },
      { name: 'Alain MacMoy' },
      { name: 'Vania Vilers' },
    ],
    coverUrl: '/movies_pictures/af11102496f9.jpg',
    releaseDate: '1968-04-26',
    length: 94,
    genre: ['Science Fiction', 'Drame', 'Romance'],
    saga: '',
    description:
      'Un homme suicidaire est envoyé une minute dans son passé et se retrouve coincé dans des fragments de mémoire.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Planète des singes',
    director: 'Franklin J. Schaffner',
    actors: [
      { name: 'Charlton Heston' },
      { name: 'Roddy McDowall' },
      { name: 'Kim Hunter' },
      { name: 'Maurice Evans' },
      { name: 'Linda Harrison' },
    ],
    coverUrl: '/movies_pictures/2f33146328aa.jpg',
    releaseDate: '1968-02-08',
    length: 112,
    genre: ['Science Fiction', 'Aventure'],
    saga: 'La Planète des singes',
    description:
      "Un astronaute s'échoue sur une planète où les singes asservissent les hommes ; la Statue de la Liberté l'attend.",
    fromEntity: {
      entityType: 'book',
      title: 'La Planète des singes',
      secondEntityKey: 'Pierre Boulle',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1969 }],
  },
  {
    title: 'Soleil vert',
    director: 'Richard Fleischer',
    actors: [
      { name: 'Charlton Heston' },
      { name: 'Edward G. Robinson' },
      { name: 'Leigh Taylor-Young' },
      { name: 'Chuck Connors' },
      { name: 'Joseph Cotten' },
    ],
    coverUrl:
      '/movies_pictures/832aa1e4c4ba.jpg',
    releaseDate: '1973-04-19',
    length: 97,
    genre: ['Science Fiction', 'Dystopie', 'Policier'],
    saga: '',
    description:
      'New York 2022, canicule et pénurie : un flic découvre de quoi est fait le biscuit Soylent Green.',
    fromEntity: {
      entityType: 'book',
      title: 'Make Room! Make Room!',
      secondEntityKey: 'Harry Harrison',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Âge de cristal",
    director: 'Michael Anderson',
    actors: [
      { name: 'Michael York' },
      { name: 'Jenny Agutter' },
      { name: 'Richard Jordan' },
      { name: 'Roscoe Lee Browne' },
      { name: 'Peter Ustinov' },
    ],
    coverUrl:
      '/movies_pictures/903e0e4853fa.jpg',
    releaseDate: '1976-06-23',
    length: 118,
    genre: ['Science Fiction', 'Dystopie', 'Aventure'],
    saga: '',
    description:
      'En 2274, on meurt à trente ans ; Logan, sandman, fuit vers le Sanctuaire avec Jessica.',
    fromEntity: {
      entityType: 'book',
      title: "Logan's Run",
      secondEntityKey: 'William F. Nolan',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1977 }],
  },
  {
    title: "L'Homme qui venait d'ailleurs",
    director: 'Nicolas Roeg',
    actors: [
      { name: 'David Bowie' },
      { name: 'Rip Torn' },
      { name: 'Candy Clark' },
      { name: 'Buck Henry' },
      { name: 'Bernie Casey' },
    ],
    coverUrl: '/movies_pictures/125e05f6c4a7.jpg',
    releaseDate: '1976-03-18',
    length: 139,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description:
      "Un extra-terrestre albino débarque au Nouveau-Mexique, invente des brevets et se noie dans l'alcool terrestre.",
    fromEntity: {
      entityType: 'book',
      title: 'The Man Who Fell to Earth',
      secondEntityKey: 'Walter Tevis',
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Upgrade',
    director: 'Leigh Whannell',
    actors: [
      { name: 'Logan Marshall-Green' },
      { name: 'Betty Gabriel' },
      { name: 'Harrison Gilbertson' },
      { name: 'Benedict Hardie' },
      { name: 'Melanie Vallejo' },
      { name: 'Linda Cropper' },
      { name: 'Simon Maiden' },
    ],
    coverUrl: '/movies_pictures/e0920663d5c5.jpg',
    releaseDate: '2018-06-01',
    length: 100,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Australie'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Empire (2024)",
    director: 'Bruno Dumont',
    actors: [
      { name: 'Lyna Khoudri' },
      { name: 'Anamaria Vartolomei' },
      { name: 'Camille Cottin' },
      { name: 'Fabrice Luchini' },
      { name: 'Brandon Vlieghe' },
      { name: 'Julien Manier' },
      { name: 'Yves Houssais' },
    ],
    coverUrl: '/movies_pictures/2dcf64bd3b74.jpg',
    releaseDate: '2024-02-21',
    length: 111,
    genre: ['Science Fiction', 'Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Attack the Block',
    director: 'Joe Cornish',
    actors: [
      { name: 'John Boyega' },
      { name: 'Jodie Whittaker' },
      { name: 'Alex Esmail' },
      { name: 'Franz Drameh' },
      { name: 'Leeon Jones' },
      { name: 'Luke Treadaway' },
      { name: 'Nick Frost' },
    ],
    coverUrl: '/movies_pictures/e6ffd34a261b.jpg',
    releaseDate: '2011-05-12',
    length: 88,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Stalker',
    director: 'Andrei Tarkovsky',
    actors: [
      { name: 'Aleksandr Kaydanovskiy' },
      { name: 'Alisa Freindlich' },
      { name: 'Anatoliy Solonitsyn' },
      { name: 'Nikolai Grinko' },
      { name: 'Natasha Abramova' },
      { name: 'Faik Yusuf Jafarov' },
      { name: 'Raymo Rendi' },
    ],
    coverUrl: '/movies_pictures/2475083acbb6.jpg',
    releaseDate: '1979-05-01',
    length: 162,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Russie'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Solaris',
    director: 'Andrei Tarkovsky',
    actors: [
      { name: 'Donatas Banionis' },
      { name: 'Natalya Bondarchuk' },
      { name: 'Jüri Järvet' },
      { name: 'Vladislav Dvorzhetskiy' },
      { name: 'Nikolai Grinko' },
      { name: 'Anatoliy Solonitsyn' },
      { name: 'Olga Barnet' },
    ],
    coverUrl: '/movies_pictures/7afab205f887.jpg',
    releaseDate: '1972-05-26',
    length: 167,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Russie'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Midnight Special',
    director: 'Jeff Nichols',
    actors: [
      { name: 'Michael Shannon' },
      { name: 'Joel Edgerton' },
      { name: 'Kirsten Dunst' },
      { name: 'Adam Driver' },
      { name: 'Jaeden Martell' },
      { name: 'Sam Shepard' },
      { name: 'Bill Camp' },
    ],
    coverUrl: '/movies_pictures/1f7ac62b769a.jpg',
    releaseDate: '2016-03-18',
    length: 112,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Event Horizon',
    director: 'Paul W.S. Anderson',
    actors: [
      { name: 'Laurence Fishburne' },
      { name: 'Sam Neill' },
      { name: 'Kathleen Quinlan' },
      { name: 'Joely Richardson' },
      { name: 'Jason Isaacs' },
      { name: 'Sean Pertwee' },
      { name: 'Jack Noseworthy' },
    ],
    coverUrl: '/movies_pictures/eb731cdd9a70.jpg',
    releaseDate: '1997-08-15',
    length: 96,
    genre: ['Science Fiction', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The X-Files : Combattre le futur',
    director: 'Rob Bowman',
    actors: [
      { name: 'David Duchovny' },
      { name: 'Gillian Anderson' },
      { name: 'Martin Landau' },
      { name: 'Blythe Danner' },
      { name: 'Armin Mueller-Stahl' },
      { name: 'Mitch Pileggi' },
      { name: 'William B. Davis' },
    ],
    coverUrl: '/movies_pictures/01999c8b-608a-7b2e-b448-cd223add3aff.webp',
    releaseDate: '1998-06-19',
    length: 121,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Paycheck",
      secondEntityKey: "Philip K. Dick",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Daybreakers',
    director: 'Michael Spierig, Peter Spierig',
    actors: [
      { name: 'Ethan Hawke' },
      { name: 'Willem Dafoe' },
      { name: 'Sam Neill' },
      { name: 'Claudia Karvan' },
      { name: 'Michael Dorman' },
      { name: 'Isabel Lucas' },
      { name: 'Vince Colosimo' },
    ],
    coverUrl: '/movies_pictures/ca979f9c0334.jpg',
    releaseDate: '2010-02-03',
    length: 98,
    genre: ['Science Fiction', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Invasion',
    director: 'Oliver Hirschbiegel',
    actors: [
      { name: 'Nicole Kidman' },
      { name: 'Daniel Craig' },
      { name: 'Jeremy Northam' },
      { name: 'Jeffrey Wright' },
      { name: 'Josef Sommer' },
      { name: 'Celia Weston' },
      { name: 'Veronica Cartwright' },
    ],
    coverUrl: '/movies_pictures/c27e35faec80.jpg',
    releaseDate: '2007-08-17',
    length: 99,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "L’Invasion des profanateurs",
      secondEntityKey: "Jack Finney",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Moon',
    director: 'Duncan Jones',
    actors: [
      { name: 'Sam Rockwell' },
      { name: 'Kevin Spacey' },
      { name: 'Dominique McElligott' },
      { name: 'Rosie Shaw' },
      { name: 'Adrienne Shaw' },
      { name: 'Kaya Scodelario' },
      { name: 'Benedict Wong' },
    ],
    coverUrl: '/movies_pictures/f4c0a23dc8b6.jpg',
    releaseDate: '2009-07-17',
    length: 97,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Cheval de guerre",
      secondEntityKey: "Michael Morpurgo",
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'John Carter',
    director: 'Andrew Stanton',
    actors: [
      { name: 'Taylor Kitsch' },
      { name: 'Lynn Collins' },
      { name: 'Willem Dafoe' },
      { name: 'Samantha Morton' },
      { name: 'Mark Strong' },
      { name: 'Ciarán Hinds' },
      { name: 'Dominic West' },
    ],
    coverUrl: '/movies_pictures/0dba7a0e4c9e.jpg',
    releaseDate: '2012-03-07',
    length: 132,
    genre: ['Science Fiction', 'Aventure'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Une princesse de Mars",
      secondEntityKey: "Edgar Rice Burroughs",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Le Jour où la Terre s'arrêta",
    director: 'Scott Derrickson',
    actors: [
      { name: 'Keanu Reeves' },
      { name: 'Jennifer Connelly' },
      { name: 'Jaden Smith' },
      { name: 'Jon Hamm' },
      { name: 'Kathy Bates' },
      { name: 'John Cleese' },
      { name: 'Kyle Chandler' },
    ],
    coverUrl: '/movies_pictures/58c235fbfe60.jpg',
    releaseDate: '2008-12-12',
    length: 104,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Cloverfield',
    director: 'Matt Reeves',
    actors: [
      { name: 'Michael Stahl-David' },
      { name: 'Odette Annable' },
      { name: 'Lizzy Caplan' },
      { name: 'Jessica Lucas' },
      { name: 'T.J. Miller' },
      { name: 'Mike Vogel' },
      { name: 'Ben Feldman' },
    ],
    coverUrl: '/movies_pictures/d50a9872768f.jpg',
    releaseDate: '2008-01-18',
    length: 85,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Darkest Hour',
    director: 'Chris Gorak',
    actors: [
      { name: 'Emile Hirsch' },
      { name: 'Olivia Thirlby' },
      { name: 'Max Minghella' },
      { name: 'Rachael Taylor' },
      { name: 'Joel Kinnaman' },
      { name: 'Veronika Ozerova' },
      { name: 'Dato Bakhtadze' },
    ],
    coverUrl: '/movies_pictures/25df460f1645.jpg',
    releaseDate: '2011-12-25',
    length: 89,
    genre: ['Science Fiction', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Passengers',
    director: 'Morten Tyldum',
    actors: [
      { name: 'Jennifer Lawrence' },
      { name: 'Chris Pratt' },
      { name: 'Michael Sheen' },
      { name: 'Laurence Fishburne' },
      { name: 'Andy Garcia' },
      { name: 'Aurora Perrineau' },
      { name: 'Vince Foster' },
    ],
    coverUrl: '/movies_pictures/287c210c7d72.jpg',
    releaseDate: '2016-12-21',
    length: 116,
    genre: ['Science Fiction', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Repo Men',
    director: 'Miguel Sapochnik',
    actors: [
      { name: 'Jude Law' },
      { name: 'Forest Whitaker' },
      { name: 'Alice Braga' },
      { name: 'Liev Schreiber' },
      { name: 'Carice van Houten' },
      { name: 'Chandler Canterbury' },
      { name: 'RZA' },
    ],
    coverUrl: '/movies_pictures/fc5185a6fa55.jpg',
    releaseDate: '2010-03-19',
    length: 111,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Rencontres du troisième type',
    director: 'Steven Spielberg',
    actors: [
      { name: 'Richard Dreyfuss' },
      { name: 'François Truffaut' },
      { name: 'Teri Garr' },
      { name: 'Melinda Dillon' },
      { name: 'Bob Balaban' },
      { name: 'Lance Henriksen' },
      { name: 'Cary Guffey' },
    ],
    coverUrl: '/movies_pictures/1cd9693bb155.jpg',
    releaseDate: '1977-11-16',
    length: 137,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1978 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1978 },
    ],
  },
  {
    title: 'Starship Troopers',
    director: 'Paul Verhoeven',
    actors: [
      { name: 'Casper Van Dien' },
      { name: 'Denise Richards' },
      { name: 'Dina Meyer' },
      { name: 'Jake Busey' },
      { name: 'Neil Patrick Harris' },
      { name: 'Clancy Brown' },
      { name: 'Michael Ironside' },
    ],
    coverUrl: '/movies_pictures/ec34477a353c.jpeg',
    releaseDate: '1997-11-07',
    length: 129,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "K-PAX : l'homme qui vient de loin",
    director: 'Iain Softley',
    actors: [
      { name: 'Kevin Spacey' },
      { name: 'Jeff Bridges' },
      { name: 'Mary McCormack' },
      { name: 'Alfre Woodard' },
      { name: 'David Paymer' },
      { name: 'Saul Williams' },
      { name: 'Peter McRobbie' },
    ],
    coverUrl: '/movies_pictures/e19304211957.jpg',
    releaseDate: '2001-10-26',
    length: 120,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Giver',
    director: 'Phillip Noyce',
    actors: [
      { name: 'Brenton Thwaites' },
      { name: 'Jeff Bridges' },
      { name: 'Meryl Streep' },
      { name: 'Alexander Skarsgård' },
      { name: 'Katie Holmes' },
      { name: 'Taylor Swift' },
    ],
    coverUrl: '/movies_pictures/8c2b0005ff5d.jpg',
    releaseDate: '2014-10-15',
    length: 97,
    genre: ['Science Fiction', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Aventure intérieure",
    director: 'Joe Dante',
    actors: [
      { name: 'Dennis Quaid' },
      { name: 'Martin Short' },
      { name: 'Meg Ryan' },
      { name: 'Kevin McCarthy' },
      { name: 'Fiona Lewis' },
    ],
    coverUrl: '/movies_pictures/39fcd4108943.jpg',
    releaseDate: '1987-07-01',
    length: 120,
    genre: ['Science Fiction', 'Aventure'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Tron',
    director: 'Steven Lisberger',
    actors: [
      { name: 'Jeff Bridges' },
      { name: 'Bruce Boxleitner' },
      { name: 'David Warner' },
      { name: 'Cindy Morgan' },
      { name: 'Barnard Hughes' },
    ],
    coverUrl: '/movies_pictures/978f5b1e9df1.jpg',
    releaseDate: '1982-07-09',
    length: 96,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Charlie's Angels : Les Anges se déchaînent !",
    director: 'McG',
    actors: [
      { name: 'Cameron Diaz' },
      { name: 'Drew Barrymore' },
      { name: 'Lucy Liu' },
      { name: 'Bernie Mac' },
      { name: 'Demi Moore' },
    ],
    coverUrl: '/movies_pictures/sefsegsge.jpg',
    releaseDate: '2003-07-10',
    length: 106,
    genre: ['Science Fiction', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
];
