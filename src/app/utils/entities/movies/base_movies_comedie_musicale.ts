import { BaseMovie, OscarEnum } from '../../../models/movie-model';

export const baseMoviesComedieMusicale: BaseMovie[] = [
  {
    title: 'Le Chanteur de jazz',
    director: 'Alan Crosland',
    actors: [
      { name: 'Al Jolson' },
      { name: 'May McAvoy' },
      { name: 'Warner Oland' },
      { name: 'Eugenie Besserer' },
      { name: 'Otto Lederer' },
    ],
    coverUrl: '/movies_pictures/cc280646b1ea.jpg',
    releaseDate: '1927-10-06',
    length: 88,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      "Fils d'un chantre, Jakie Rabinowitz brise avec sa tradition pour devenir star du jazz à Broadway.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Mélodie de Broadway',
    director: 'Harry Beaumont',
    actors: [
      { name: 'Charles King' },
      { name: 'Anita Page' },
      { name: 'Bessie Love' },
      { name: 'Mary Doran' },
      { name: 'Eddie Kane' },
    ],
    coverUrl:
      '/movies_pictures/1084395178ed.jpg',
    releaseDate: '1929-02-01',
    length: 100,
    genre: ['Comédie musicale'],
    saga: '',
    description:
      'Deux sœurs débarquent à Broadway ; l’une vole le rôle et le fiancé de l’autre, jusqu’à la réconciliation en duo.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_MOVIE, year: 1930 }],
  },
  {
    title: '42e Rue',
    director: 'Lloyd Bacon',
    actors: [
      { name: 'Warner Baxter' },
      { name: 'Bebe Daniels' },
      { name: 'George Brent' },
      { name: 'Ruby Keeler' },
      { name: 'Ginger Rogers' },
    ],
    coverUrl: '/movies_pictures/49dc32f26d56.jpg',
    releaseDate: '1933-03-09',
    length: 89,
    genre: ['Comédie musicale'],
    saga: '',
    description:
      'Un metteur en scène usé monte un spectacle de Broadway ; la choriste Peg sauve la première.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Le Danseur du dessus',
    director: 'Mark Sandrich',
    actors: [
      { name: 'Fred Astaire' },
      { name: 'Ginger Rogers' },
      { name: 'Edward Everett Horton' },
      { name: 'Erik Rhodes' },
      { name: 'Eric Blore' },
    ],
    coverUrl: '/movies_pictures/2c06992ffa2b.jpg',
    releaseDate: '1935-08-29',
    length: 101,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      'Un danseur américain poursuit à Londres une mannequin qui le prend pour un gigolo.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Le Grand Ziegfeld',
    director: 'Robert Z. Leonard',
    actors: [
      { name: 'William Powell' },
      { name: 'Myrna Loy' },
      { name: 'Luise Rainer' },
      { name: 'Frank Morgan' },
      { name: 'Fanny Brice' },
    ],
    coverUrl: '/movies_pictures/31aa960b0128.jpg',
    releaseDate: '1936-03-22',
    length: 185,
    genre: ['Comédie musicale', 'Biographie', 'Drame'],
    saga: '',
    description:
      'La vie de Florenz Ziegfeld, producteur des Follies, entre faste, faillites et deux mariages.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1937 },
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1937 },
    ],
  },
  {
    title: 'Swing Time',
    director: 'George Stevens',
    actors: [
      { name: 'Fred Astaire' },
      { name: 'Ginger Rogers' },
      { name: 'Victor Moore' },
      { name: 'Helen Broderick' },
      { name: 'Eric Blore' },
    ],
    coverUrl: '/movies_pictures/0a7ec4b1d549.jpg',
    releaseDate: '1936-08-27',
    length: 103,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      'Un danseur qui doit gagner 25000 dollars pour se marier tombe amoureux de son professeur de claquettes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1937 }],
  },
  {
    title: "Le Magicien d'Oz",
    director: 'Victor Fleming',
    actors: [
      {
        name: 'Judy Garland',
      },
      {
        name: 'Frank Morgan',
      },
      {
        name: 'Ray Bolger',
      },
      {
        name: 'Jack Haley',
      },
      {
        name: 'Bert Lahr',
      },
      {
        name: 'Margaret Hamilton',
      },
      {
        name: 'Billie Burke',
      },
    ],
    coverUrl: '/movies_pictures/22_7321950651238_vid.jpg',
    releaseDate: '1939-08-25',
    length: 102,
    genre: ['Fantastique', 'Comédie musicale'],
    saga: '',
    description: 'Dorothy est emportée par une tornade vers l\'Oz magique et doit suivre la route de brique jaune pour retrouver le magicien capable de la ramener au Kansas.',
    fromEntity: {
      entityType: 'book',
      title: "Le Magicien d'Oz",
      secondEntityKey: "L. Frank Baum",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1940 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1940 },
    ],
  },
  {
    title: 'Le Chant du Missouri',
    director: 'Vincente Minnelli',
    actors: [
      { name: 'Judy Garland' },
      { name: "Margaret O'Brien" },
      { name: 'Mary Astor' },
      { name: 'Lucille Bremer' },
      { name: 'Leon Ames' },
    ],
    coverUrl: '/movies_pictures/5605a33fd175.jpg',
    releaseDate: '1944-11-28',
    length: 113,
    genre: ['Comédie musicale'],
    saga: '',
    description:
      "À Saint-Louis, une famille vit les saisons avant l'Exposition de 1904, entre trolley et Noël.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Un Américain à Paris',
    director: 'Vincente Minnelli',
    actors: [
      { name: 'Gene Kelly' },
      { name: 'Leslie Caron' },
      { name: 'Oscar Levant' },
      { name: 'Georges Guétary' },
      { name: 'Nina Foch' },
    ],
    coverUrl: '/movies_pictures/f59a396ee914.jpg',
    releaseDate: '1951-10-04',
    length: 113,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      'Un peintre GI reste à Paris, aime une jeune Française, et termine en ballet Gershwin de dix-sept minutes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1952 },
      { type: OscarEnum.OSCAR_BEST_ADAPTED_SCREENPLAY, year: 1952 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1952 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1952 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1952 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1952 },
    ],
  },
  {
    title: 'Chantons sous la pluie',
    director: 'Gene Kelly, Stanley Donen',
    actors: [
      {
        name: 'Gene Kelly',
      },
      {
        name: "Donald O'Connor",
      },
      {
        name: 'Debbie Reynolds',
      },
      {
        name: 'Jean Hagen',
      },
      {
        name: 'Millard Mitchell',
      },
      {
        name: 'Cyd Charisse',
      },
      {
        name: 'Rita Moreno',
      },
    ],
    coverUrl: '/movies_pictures/4123553.webp',
    releaseDate: '1952-04-11',
    length: 103,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Hollywood 1927 : un couple de stars du muet doit s\'adapter au parlant, entre comédie, romance et numéros de danse cultes sous la pluie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Limelight',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Claire Bloom',
      },
      {
        name: 'Nigel Bruce',
      },
      {
        name: 'Buster Keaton',
      },
      {
        name: 'Sydney Chaplin',
      },
      {
        name: 'Leonard Mudie',
      },
      {
        name: 'Norman Lloyd',
      },
    ],
    coverUrl: '/movies_pictures/16ce23aba0de.jpg',
    releaseDate: '1952-10-16',
    length: 137,
    genre: ['Drame', 'Romance', 'Comédie musicale'],
    saga: '',
    description: 'Un clown déchu du music-hall sauve une danseuse suicidaire et monte un numéro avec elle, dans un hommage mélancolique au spectacle vivant.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1973 },
    ],
  },
  {
    title: 'Tous en scène',
    director: 'Vincente Minnelli',
    actors: [
      { name: 'Fred Astaire' },
      { name: 'Cyd Charisse' },
      { name: 'Oscar Levant' },
      { name: 'Nanette Fabray' },
      { name: 'Jack Buchanan' },
    ],
    coverUrl: '/movies_pictures/baf7e5ac0a94.jpg',
    releaseDate: '1953-08-07',
    length: 111,
    genre: ['Comédie musicale'],
    saga: '',
    description:
      'Une star de la comédie musicale déclinante monte un spectacle, entre Dancing in the Dark et The Girl Hunt.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Carmen Jones',
    director: 'Otto Preminger',
    actors: [
      { name: 'Dorothy Dandridge' },
      { name: 'Harry Belafonte' },
      { name: 'Pearl Bailey' },
      { name: 'Olga James' },
      { name: 'Joe Adams' },
    ],
    coverUrl: '/movies_pictures/0d4d36dc26fe.jpg',
    releaseDate: '1954-10-28',
    length: 105,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      "Carmen, ouvrière d'une usine de parachutes, séduit un GI et le mène à sa perte, sur la musique de Bizet.",
    fromEntity: {
      entityType: 'book',
      title: "Carmen",
      secondEntityKey: "Prosper Mérimée",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Drôle de frimousse',
    director: 'Stanley Donen',
    actors: [
      { name: 'Audrey Hepburn' },
      { name: 'Fred Astaire' },
      { name: 'Kay Thompson' },
      { name: 'Michel Auclair' },
      { name: 'Robert Flemyng' },
    ],
    coverUrl: '/movies_pictures/815a383a3163.jpg',
    releaseDate: '1957-02-13',
    length: 103,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      'Un photographe de mode transforme une libraire de Greenwich Village en icône à Paris.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Gigi',
    director: 'Vincente Minnelli',
    actors: [
      { name: 'Leslie Caron' },
      { name: 'Maurice Chevalier' },
      { name: 'Louis Jourdan' },
      { name: 'Hermione Gingold' },
      { name: 'Eva Gabor' },
    ],
    coverUrl: '/movies_pictures/9b2937508ee7.jpg',
    releaseDate: '1958-05-15',
    length: 115,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      "À Paris, une jeune fille élevée pour être courtisane bouleverse le mondain qui devait l'entretenir.",
    fromEntity: {
      entityType: 'book',
      title: 'Gigi',
      secondEntityKey: 'Colette',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_ADAPTED_SCREENPLAY, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1959 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1959 },
    ],
  },
  {
    title: 'West Side Story',
    director: 'Robert Wise, Jerome Robbins',
    actors: [
      {
        name: 'Natalie Wood',
      },
      {
        name: 'Richard Beymer',
      },
      {
        name: 'Russ Tamblyn',
      },
      {
        name: 'Rita Moreno',
      },
      {
        name: 'George Chakiris',
      },
      {
        name: 'Simon Oakland',
      },
      {
        name: 'Jose De Vega',
      },
    ],
    coverUrl: '/movies_pictures/031ea613b0b2.jpg',
    releaseDate: '1961-10-18',
    length: 152,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Romeo et Juliette revisités à New York : Tony et Maria s\'aiment malgré la guerre des gangs Jets et Sharks dans une comédie musicale légendaire.',
    fromEntity: {
      entityType: 'book',
      title: 'Roméo et Juliette',
      secondEntityKey: 'William Shakespeare',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1962 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1962 },
    ],
  },
  {
    title: 'Les Parapluies de Cherbourg',
    director: 'Jacques Demy',
    actors: [
      {
        name: 'Catherine Deneuve',
      },
      {
        name: 'Nino Castelnuovo',
      },
      {
        name: 'Anne Vernon',
      },
      {
        name: 'Harald Wolff',
      },
      {
        name: 'Dorothée Blanck',
      },
      {
        name: 'Ellen Farner',
      },
      {
        name: 'Gisèle Grandpré',
      },
    ],
    coverUrl: '/movies_pictures/21003043_20130503122946122.webp',
    releaseDate: '1964-02-19',
    length: 91,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Entièrement chanté, le film suit Geneviève et Guy, amants séparés par la guerre d\'Algérie et contraints de choisir entre amour et responsabilités.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Mary Poppins',
    director: 'Robert Stevenson',
    actors: [
      {
        name: 'Julie Andrews',
      },
      {
        name: 'Dick Van Dyke',
      },
      {
        name: 'David Tomlinson',
      },
      {
        name: 'Glynis Johns',
      },
      {
        name: 'Karen Dotrice',
      },
      {
        name: 'Matthew Garber',
      },
      {
        name: 'Hermione Baddeley',
      },
    ],
    coverUrl: '/movies_pictures/mary.webp',
    releaseDate: '1964-08-27',
    length: 139,
    genre: ['Fantastique', 'Comédie musicale'],
    saga: 'Disney Classique',
    description: 'Une nounou magique descend du ciel pour remettre de l\'ordre et de la fantaisie dans la famille Banks grâce à chansons, ombres et promenades dans les airs.',
    fromEntity: {
      entityType: 'book',
      title: "Mary Poppins",
      secondEntityKey: "P. L. Travers",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1965 },
    ],
  },
  {
    title: 'My Fair Lady',
    director: 'George Cukor',
    actors: [
      { name: 'Audrey Hepburn' },
      { name: 'Rex Harrison' },
      { name: 'Stanley Holloway' },
      { name: 'Wilfrid Hyde-White' },
      { name: 'Gladys Cooper' },
    ],
    coverUrl: '/movies_pictures/ae96b7b9dbf4.jpg',
    releaseDate: '1964-10-21',
    length: 170,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      "Higgins parie de faire d'Eliza Doolittle, bouquetière cockney, une lady de l'ambassade.",
    fromEntity: {
      entityType: 'book',
      title: 'Pygmalion',
      secondEntityKey: 'George Bernard Shaw',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_ACTOR, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1965 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1965 },
    ],
  },
  {
    title: 'La Mélodie du bonheur',
    director: 'Robert Wise',
    actors: [
      {
        name: 'Julie Andrews',
      },
      {
        name: 'Christopher Plummer',
      },
      {
        name: 'Bill Lee',
      },
      {
        name: 'Eleanor Parker',
      },
      {
        name: 'Richard Haydn',
      },
      {
        name: 'Nicholas Hammond',
      },
      {
        name: 'Peggy Wood',
      },
    ],
    coverUrl: '/movies_pictures/235855.webp',
    releaseDate: '1965-03-02',
    length: 174,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description: 'Une gouvernante autrichienne apporte musique et joie aux sept enfants d\'un veuf capitaine de marine austère, dans les Alpes autrichiennes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1966 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1966 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1966 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1966 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1966 },
    ],
  },
  {
    title: 'Les Demoiselles de Rochefort',
    director: 'Jacques Demy',
    actors: [
      { name: 'Catherine Deneuve' },
      { name: 'Françoise Dorléac' },
      { name: 'Jacques Perrin' },
      { name: 'Gene Kelly' },
      { name: 'George Chakiris' },
      { name: 'Michel Piccoli' },
      { name: 'Danielle Darrieux' },
    ],
    coverUrl: '/movies_pictures/82df447060e4.jpg',
    releaseDate: '1967-03-08',
    length: 125,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Dans une ville portuaire colorée, deux sœurs rêvant de partir à Paris croisent amours manqués, marins et compositeurs dans une comédie entièrement chantée.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Funny Girl',
    director: 'William Wyler',
    actors: [
      { name: 'Barbra Streisand' },
      { name: 'Omar Sharif' },
      { name: 'Kay Medford' },
      { name: 'Anne Francis' },
      { name: 'Walter Pidgeon' },
    ],
    coverUrl: '/movies_pictures/ee907666380c.jpg',
    releaseDate: '1968-09-18',
    length: 149,
    genre: ['Comédie musicale', 'Biographie', 'Drame'],
    saga: '',
    description:
      'Fanny Brice, comique de Broadway, aime un joueur, entre Ziegfeld et « People ».',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1969 }],
  },
  {
    title: 'Oliver !',
    director: 'Carol Reed',
    actors: [
      { name: 'Ron Moody' },
      { name: 'Oliver Reed' },
      { name: 'Mark Lester' },
      { name: 'Jack Wild' },
      { name: 'Shani Wallis' },
    ],
    coverUrl: '/movies_pictures/54a8b3def99d.jpg',
    releaseDate: '1968-09-26',
    length: 153,
    genre: ['Comédie musicale'],
    saga: '',
    description:
      'Oliver Twist chante sa faim, Fagin recèle, Bill Sikes frappe, le happy end musical de Lionel Bart.',
    fromEntity: {
      entityType: 'book',
      title: 'Oliver Twist',
      secondEntityKey: 'Charles Dickens',
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1969 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1969 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1969 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1969 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1969 },
    ],
  },
  {
    title: 'Un violon sur le toit',
    director: 'Norman Jewison',
    actors: [
      { name: 'Topol' },
      { name: 'Norma Crane' },
      { name: 'Leonard Frey' },
      { name: 'Molly Picon' },
      { name: 'Paul Mann' },
    ],
    coverUrl:
      '/movies_pictures/40c0b18eb053.jpg',
    releaseDate: '1971-11-03',
    length: 181,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Tevye le laitier marie ses filles dans un shtetl de Russie, tradition contre pogroms, If I Were a Rich Man.',
    fromEntity: {
      entityType: 'book',
      title: 'Tevye der milkhiker',
      secondEntityKey: 'Sholem Aleichem',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1972 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1972 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1972 },
    ],
  },
  {
    title: 'Cabaret',
    director: 'Bob Fosse',
    actors: [
      { name: 'Liza Minnelli' },
      { name: 'Michael York' },
      { name: 'Joel Grey' },
      { name: 'Helmut Griem' },
      { name: 'Marisa Berenson' },
    ],
    coverUrl: '/movies_pictures/6a7a9396a3a5.jpg',
    releaseDate: '1972-02-13',
    length: 124,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Au Kit Kat Klub de Berlin, Sally Bowles chante pendant que les nazis montent, life is a cabaret.',
    fromEntity: {
      entityType: 'book',
      title: 'Goodbye to Berlin',
      secondEntityKey: 'Christopher Isherwood',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTOR, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1973 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1973 },
    ],
  },
  {
    title: 'New York, New York',
    director: 'Martin Scorsese',
    actors: [
      {
        name: 'Liza Minnelli',
      },
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Lionel Stander',
      },
      {
        name: 'Barry Primus',
      },
      {
        name: 'Mary Kay Place',
      },
      {
        name: 'Georgie Auld',
      },
      {
        name: 'George Memmoli',
      },
    ],
    coverUrl: '/movies_pictures/bdbc20206e84.jpg',
    releaseDate: '1977-06-21',
    length: 136,
    genre: ['Drame', 'Romance', 'Comédie musicale'],
    saga: '',
    description: 'Après la Seconde Guerre mondiale, un saxophoniste et une chanteuse s\'aiment et se déchirent entre carrières artistiques et vie de couple.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Grease',
    director: 'Randal Kleiser',
    actors: [
      {
        name: 'John Travolta',
      },
      {
        name: 'Olivia Newton-John',
      },
      {
        name: 'Stockard Channing',
      },
      {
        name: 'Jeff Conaway',
      },
      {
        name: 'Barry Pearl',
      },
      {
        name: 'Michael Tucci',
      },
      {
        name: 'Didi Conn',
      },
    ],
    coverUrl: '/movies_pictures/Grease.webp',
    releaseDate: '1978-06-16',
    length: 110,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Dans les années 1950, Sandy et Danny se retrouvent au lycée après un été idyllique et tentent de concilier leurs mondes opposés entre chansons et danse.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Que le spectacle commence',
    director: 'Bob Fosse',
    actors: [
      { name: 'Roy Scheider' },
      { name: 'Jessica Lange' },
      { name: 'Ann Reinking' },
      { name: 'Leland Palmer' },
      { name: 'Cliff Gorman' },
    ],
    coverUrl: '/movies_pictures/2e5d59e65bd2.jpg',
    releaseDate: '1979-12-20',
    length: 123,
    genre: ['Comédie musicale', 'Drame', 'Biographie'],
    saga: '',
    description:
      'Joe Gideon, chorégraphe, monte un show et un film tout en mourant ; Fosse se filme en jazz et électrodes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1980 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1980 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1980 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1980 },
    ],
  },
  {
    title: 'Fame',
    director: 'Alan Parker',
    actors: [
      { name: 'Irene Cara' },
      { name: 'Lee Curreri' },
      { name: 'Gene Anthony Ray' },
      { name: 'Maureen Teefy' },
      { name: 'Barry Miller' },
    ],
    coverUrl: '/movies_pictures/1d44e733e78d.jpg',
    releaseDate: '1980-05-16',
    length: 134,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Des élèves de la High School of Performing Arts dansent dans la rue et apprennent le prix de la scène.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1981 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1981 },
    ],
  },
  {
    title: 'The Blues Brothers',
    director: 'John Landis',
    actors: [
      {
        name: 'John Belushi',
      },
      {
        name: 'Dan Aykroyd',
      },
      {
        name: 'James Brown',
      },
      {
        name: 'Cab Calloway',
      },
      {
        name: 'Ray Charles',
      },
      {
        name: 'Aretha Franklin',
      },
      {
        name: 'Matt Murphy',
      },
    ],
    coverUrl: '/movies_pictures/71PMcA3+KcL.jpg',
    releaseDate: '1980-06-20',
    length: 133,
    genre: ['Comédie', 'Comédie musicale'],
    saga: '',
    description: 'Deux frères pariaux reforment leur groupe de blues pour sauver l\'orphelinat où ils ont grandi, dans une cavale musicale à travers Chicago.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Annie',
    director: 'John Huston',
    actors: [
      { name: 'Aileen Quinn' },
      { name: 'Albert Finney' },
      { name: 'Carol Burnett' },
      { name: 'Ann Reinking' },
      { name: 'Tim Curry' },
    ],
    coverUrl: '/movies_pictures/e78ccf1d468f.jpg',
    releaseDate: '1982-05-21',
    length: 128,
    genre: ['Comédie musicale', 'Jeunesse'],
    saga: '',
    description:
      'Une orpheline rousse est adoptée par un milliardaire, chansons et Depression.',
    fromEntity: {
      entityType: 'comic',
      title: 'Little Orphan Annie',
      secondEntityKey: 'Harold Gray',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Grease 2',
    director: 'Patricia Birch',
    actors: [
      {
        name: 'Maxwell Caulfield',
      },
      {
        name: 'Michelle Pfeiffer',
      },
      {
        name: 'Adrian Zmed',
      },
      {
        name: 'Lorna Luft',
      },
      {
        name: 'Maureen Teefy',
      },
      {
        name: 'Pamela Adlon',
      },
      {
        name: 'Christopher McDonald',
      },
    ],
    coverUrl: '/movies_pictures/81qJICzIC-L._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1982-06-11',
    length: 115,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Un an après Grease, un nouveau lycéen anglais intègre les T-Birds et tombe amoureux d\'une Pink Lady dans une suite musicale plus légère.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Yentl',
    director: 'Barbra Streisand',
    actors: [
      { name: 'Barbra Streisand' },
      { name: 'Mandy Patinkin' },
      { name: 'Amy Irving' },
      { name: 'Nehemiah Persoff' },
      { name: 'Steven Hill' },
    ],
    coverUrl: '/movies_pictures/0dd990be9872.jpg',
    releaseDate: '1983-11-18',
    length: 132,
    genre: ['Comédie musicale', 'Drame', 'Romance'],
    saga: '',
    description:
      'Une jeune juive de Pologne se déguise en garçon pour étudier le Talmud, chansons et mariage.',
    fromEntity: {
      entityType: 'book',
      title: 'Yentl the Yeshiva Boy',
      secondEntityKey: 'Isaac Bashevis Singer',
    },
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1984 }],
  },
  {
    title: 'Footloose',
    director: 'Herbert Ross',
    actors: [
      { name: 'Kevin Bacon' },
      { name: 'Lori Singer' },
      { name: 'John Lithgow' },
      { name: 'Dianne Wiest' },
      { name: 'Chris Penn' },
    ],
    coverUrl:
      '/movies_pictures/ae65304af9cf.jpg',
    releaseDate: '1984-02-17',
    length: 90,
    genre: ['Comédie musicale', 'Drame', 'Romance'],
    saga: '',
    description:
      'Un lycéen de Chicago arrive dans une ville où danser est interdit, et fait bouger le gymnase.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Purple Rain',
    director: 'Albert Magnoli',
    actors: [
      { name: 'Prince' },
      { name: 'Apollonia Kotero' },
      { name: 'Morris Day' },
      { name: 'Olga Karlatos' },
      { name: 'Clarence Williams III' },
    ],
    coverUrl:
      '/movies_pictures/61e1c42ee061.jpg',
    releaseDate: '1984-07-27',
    length: 111,
    genre: ['Comédie musicale', 'Drame', 'Romance'],
    saga: '',
    description:
      'The Kid, musicien de Minneapolis, se bat avec son père, une rivale et la scène du First Avenue.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1985 }],
  },
  {
    title: 'The Cotton Club',
    director: 'Francis Ford Coppola',
    actors: [
      {
        name: 'Richard Gere',
      },
      {
        name: 'Gregory Hines',
      },
      {
        name: 'Diane Lane',
      },
      {
        name: 'Lonette McKee',
      },
      {
        name: 'James Remar',
      },
      {
        name: 'Nicolas Cage',
      },
      {
        name: 'Bob Hoskins',
      },
    ],
    coverUrl: '/movies_pictures/4208c6138b60.jpg',
    releaseDate: '1984-12-14',
    length: 127,
    genre: ['Drame', 'Historique', 'Comédie musicale'],
    saga: '',
    description: 'Harlem des années 1930 : musiciens, danseurs et gangsters se croisent dans le légendaire Cotton Club, entre jazz, violence et ambitions.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'A Chorus Line',
    director: 'Richard Attenborough',
    actors: [
      { name: 'Michael Douglas' },
      { name: 'Alyson Reed' },
      { name: 'Terrence Mann' },
      { name: 'Michael Blevins' },
      { name: 'Yamil Borges' },
    ],
    coverUrl: '/movies_pictures/981e27f66e5c.jpg',
    releaseDate: '1985-12-13',
    length: 113,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Un metteur en scène de Broadway choisit un chœur, souvenirs, claquettes et « one singular sensation ».',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'La Petite Boutique des horreurs',
    director: 'Frank Oz',
    actors: [
      { name: 'Rick Moranis' },
      { name: 'Ellen Greene' },
      { name: 'Vincent Gardenia' },
      { name: 'Steve Martin' },
      { name: 'Levi Stubbs' },
    ],
    coverUrl: '/movies_pictures/7f3c593c0413.jpg',
    releaseDate: '1986-12-19',
    length: 94,
    genre: ['Comédie musicale', 'Horreur', 'Comédie'],
    saga: '',
    description:
      'Un fleuriste nourrit une plante carnivore qui chante, et New York avec.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Commitments',
    director: 'Alan Parker',
    actors: [
      { name: 'Robert Arkins' },
      { name: 'Angeline Ball' },
      { name: 'Maria Doyle Kennedy' },
      { name: 'Andrew Strong' },
      { name: 'Glen Hansard' },
    ],
    coverUrl:
      '/movies_pictures/3aeecc5a2a43.jpg',
    releaseDate: '1991-08-14',
    length: 118,
    genre: ['Comédie musicale', 'Drame', 'Comédie'],
    saga: '',
    description:
      'Des chômeurs de Dublin montent un groupe soul, ego, cuivres et « Mustang Sally ».',
    fromEntity: {
      entityType: 'book',
      title: 'The Commitments',
      secondEntityKey: 'Roddy Doyle',
    },
    countryOrigin: ['Irlande', 'Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Everyone Says I Love You',
    director: 'Woody Allen',
    actors: [
      { name: 'Woody Allen' },
      { name: 'Goldie Hawn' },
      { name: 'Julia Roberts' },
    ],
    coverUrl: '/movies_pictures/a40c5c506d89.jpg',
    releaseDate: '1996-12-06',
    length: 101,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description:
      "Plusieurs familles parisiennes et new-yorkaises cherchent l'amour au son de comédies musicales décalées.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Evita',
    director: 'Alan Parker',
    actors: [
      { name: 'Madonna' },
      { name: 'Antonio Banderas' },
      { name: 'Jonathan Pryce' },
      { name: 'Jimmy Nail' },
      { name: 'Victoria Sus' },
    ],
    coverUrl: '/movies_pictures/2c28fabda05f.jpg',
    releaseDate: '1996-12-25',
    length: 135,
    genre: ['Comédie musicale', 'Drame', 'Biographie'],
    saga: '',
    description:
      'Eva Perón, de la radio au balcon, Madonna chante, Banderas en Che, Argentine en carton doré.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1997 }],
  },
  {
    title: 'Moulin Rouge !',
    director: 'Baz Luhrmann',
    actors: [
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Ewan McGregor',
      },
      {
        name: 'Jim Broadbent',
      },
      {
        name: 'Richard Roxburgh',
      },
      {
        name: 'John Leguizamo',
      },
      {
        name: 'Jacek Koman',
      },
      {
        name: "Caroline O'Connor",
      },
    ],
    coverUrl: '/movies_pictures/69216008_af.webp',
    releaseDate: '2001-05-24',
    length: 127,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Un poète pauvre tombe amoureux d\'une courtisane du Moulin Rouge à Paris et se bat pour leur amour dans un cabaret où tout est spectacle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2002 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 2002 },
    ],
  },
  {
    title: 'Hedwig and the Angry Inch',
    director: 'John Cameron Mitchell',
    actors: [
      { name: 'John Cameron Mitchell' },
      { name: 'Miriam Shor' },
      { name: 'Michael Pitt' },
      { name: 'Andrea Martin' },
      { name: 'Stephen Trask' },
    ],
    coverUrl:
      '/movies_pictures/eb1a21af6477.jpg',
    releaseDate: '2001-07-20',
    length: 95,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Hedwig, chanteur rock originaire de Berlin-Est, raconte en concert sa vie, sa chirurgie ratée et sa quête d\'amour et d\'identité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: '8 Mile',
    director: 'Curtis Hanson',
    actors: [
      {
        name: 'Eminem',
      },
      {
        name: 'Kim Basinger',
      },
      {
        name: 'Brittany Murphy',
      },
      {
        name: 'Mekhi Phifer',
      },
      {
        name: 'Taryn Manning',
      },
      {
        name: 'Omar Benson Miller',
      },
      {
        name: 'Eugene Byrd',
      },
    ],
    coverUrl: '/movies_pictures/affiche (1).webp',
    releaseDate: '2002-11-08',
    length: 110,
    genre: ['Drame', 'Biographie', 'Comédie musicale'],
    saga: '',
    description: 'B-Rabbit, ouvrier blanc des quartiers pauvres de Détroit, tente de percer dans les battles de rap pour échapper à la misère et à ses démons.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 2003 },
    ],
  },
  {
    title: 'Chicago',
    director: 'Rob Marshall',
    actors: [
      {
        name: 'Renée Zellweger',
      },
      {
        name: 'Catherine Zeta-Jones',
      },
      {
        name: 'Richard Gere',
      },
      {
        name: 'Queen Latifah',
      },
      {
        name: 'John C. Reilly',
      },
      {
        name: 'Lucy Liu',
      },
      {
        name: 'Colm Feore',
      },
    ],
    coverUrl: '/movies_pictures/affiche.webp',
    releaseDate: '2002-12-27',
    length: 113,
    genre: ['Comédie musicale', 'Policier'],
    saga: '',
    description: 'Dans les années 1920, deux meurtrières incarcérées transforment leur procès en spectacle médiatique avec l\'aide d\'un avocet cynique et d\'une star de cabaret.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 2003 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2003 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2003 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 2003 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2003 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2003 },
    ],
  },
  {
    title: 'Pas sur la bouche',
    director: 'Alain Resnais',
    actors: [
      { name: 'Sabine Azéma' },
      { name: 'Audrey Tautou' },
      { name: 'Isabelle Nanty' },
      { name: 'Pierre Arditi' },
      { name: 'Lambert Wilson' },
    ],
    coverUrl:
      '/movies_pictures/52651b83dc22.jpg',
    releaseDate: '2003-10-15',
    length: 117,
    genre: ['Comédie musicale', 'Comédie'],
    saga: '',
    description:
      'Adaptation de l\'opérette de Offenbach : une femme mariée feint d\'être morte pour échapper à un ancien amant qui débarque chez elle.',
    fromEntity: null,
    countryOrigin: ['France', 'Suisse'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Dreamgirls',
    director: 'Bill Condon',
    actors: [
      { name: 'Jamie Foxx' },
      { name: 'Beyoncé Knowles' },
      { name: 'Eddie Murphy' },
      { name: 'Jennifer Hudson' },
      { name: 'Anika Noni Rose' },
    ],
    coverUrl: '/movies_pictures/f005bf5e64bc.jpg',
    releaseDate: '2006-12-15',
    length: 130,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Trois chanteuses noires des années 1960 forment un trio qui connaît le succès, mais l\'industrie musicale exploite leurs talents au profit d\'un impresario.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2007 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2007 },
    ],
  },
  {
    title: "Steppin'",
    director: 'Sylvain White',
    actors: [
      { name: 'Columbus Short' },
      { name: 'Meagan Good' },
      { name: 'Ne-Yo' },
      { name: 'Darrin Dewitt Henson' },
      { name: 'Brian J. White' },
      { name: 'Chris Brown' },
      { name: 'Las Alonso' },
    ],
    coverUrl: '/movies_pictures/f8e0ad2f91fd.jpg',
    releaseDate: '2007-01-12',
    length: 109,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description: 'Des étudiants d\'une université historiquement noire s\'affrontent lors de concours de step dance où rivalité, fraternité et ambition se mêlent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Hairspray',
    director: 'Adam Shankman',
    actors: [
      {
        name: 'Nikki Blonsky',
      },
      {
        name: 'John Travolta',
      },
      {
        name: 'Michelle Pfeiffer',
      },
      {
        name: 'Christopher Walken',
      },
      {
        name: 'Amanda Bynes',
      },
      {
        name: 'James Marsden',
      },
      {
        name: 'Queen Latifah',
      },
    ],
    coverUrl: '/movies_pictures/18783470.jpg',
    releaseDate: '2007-07-20',
    length: 117,
    genre: ['Comédie musicale', 'Comédie'],
    saga: '',
    description: 'À Baltimore en 1962, une lycéenne rondelette rêve de danser dans un émission télé et lutte contre la ségrégation raciale avec énergie et chansons.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Across the Universe',
    director: 'Julie Taymor',
    actors: [
      { name: 'Jim Sturgess' },
      { name: 'Evan Rachel Wood' },
      { name: 'Joe Anderson' },
      { name: 'Dana Fuchs' },
      { name: 'Martin Luther McCoy' },
    ],
    coverUrl:
      '/movies_pictures/4bfc2136ea01.jpg',
    releaseDate: '2007-10-12',
    length: 133,
    genre: ['Comédie musicale', 'Drame', 'Romance'],
    saga: '',
    description:
      'Des jeunes Américains des années 1960 vivent leurs amours et leurs engagements sur les chansons des Beatles, entre rêve, guerre du Vietnam et contestation.',
    fromEntity: null,
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Sweeney Todd : Le Diabolique Barbier de Fleet Street',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Johnny Depp',
      },
      {
        name: 'Helena Bonham Carter',
      },
      {
        name: 'Timothy Spall',
      },
      {
        name: 'Jayne Wisener',
      },
      {
        name: 'Sacha Baron Cohen',
      },
      {
        name: 'Jamie Campbell Bower',
      },
      {
        name: 'Laura Michelle Kelly',
      },
    ],
    coverUrl: '/movies_pictures/18876989.jpg',
    releaseDate: '2007-12-21',
    length: 116,
    genre: ['Comédie musicale', 'Horreur'],
    saga: '',
    description: 'Sweeney Todd, barbier vengeur à Londres victorienne, égorge ses clients tandis que Mrs Lovett les transforme en tourtes sanglantes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2008 },
    ],
  },
  {
    title: 'Camp Rock',
    director: 'Matthew Diamond',
    actors: [
      { name: 'Demi Lovato' },
      { name: 'Joe Jonas' },
      { name: 'Nick Jonas' },
      { name: 'Kevin Jonas' },
    ],
    coverUrl: '/movies_pictures/1bbe71712521.jpg',
    releaseDate: '2008-01-01',
    length: 94,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Une adolescente passionnée de musique intègre un camp d\'été rock où elle croise une star pop arrogant et découvre sa propre voix artistique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Mamma Mia!',
    director: 'Phyllida Lloyd',
    actors: [
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Pierce Brosnan',
      },
      {
        name: 'Colin Firth',
      },
      {
        name: 'Stellan Skarsgård',
      },
      {
        name: 'Julie Walters',
      },
      {
        name: 'Christine Baranski',
      },
    ],
    coverUrl: '/movies_pictures/18965700.jpg',
    releaseDate: '2008-07-18',
    length: 108,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Sur une île grecque, une jeune femme invite trois hommes du passé de sa mère pour découvrir qui est son père, sur les chansons d\'ABBA.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Faubourg 36',
    director: 'Christophe Barratier',
    actors: [
      { name: 'Gérard Jugnot' },
      { name: 'Clovis Cornillac' },
      { name: 'Kad Merad' },
      { name: 'Nora Arnezeder' },
      { name: 'Pierre Richard' },
    ],
    coverUrl:
      '/movies_pictures/16bf7b2dac6e.jpg',
    releaseDate: '2008-09-24',
    length: 116,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description:
      'Paris 1936 : un directeur de music-hall monte un spectacle grandiose pour sauver son théâtre des faillites et des menaces politiques.',
    fromEntity: null,
    countryOrigin: ['France', 'Allemagne', 'Tchéquie'],
    selectDisplayOrder: 0,
    oscars: [],
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
      {
        name: 'Emily Osment',
      },
      {
        name: 'Jason Earles',
      },
      {
        name: 'Margo Martindale',
      },
      {
        name: 'Melora Hardin',
      },
    ],
    coverUrl: '/movies_pictures/1bccb06dc7f5.jpg',
    releaseDate: '2009-06-17',
    length: 102,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Miley Stewart, star pop sous l\'identité secrète d\'Hannah Montana, retourne dans sa ville natale pour retrouver une vie normale et sa vraie personnalité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Camp Rock 2',
    director: 'Paul Hoen',
    actors: [
      { name: 'Demi Lovato' },
      { name: 'Joe Jonas' },
      { name: 'Nick Jonas' },
      { name: 'Kevin Jonas' },
    ],
    coverUrl: '/movies_pictures/3c2b8f3bd281.jpg',
    releaseDate: '2010-01-01',
    length: 104,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Les camps Rock et Star s\'affrontent lors d\'un duel musical estival où rivalités amoureuses et scène se mêlent entre jeunes musiciens.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Burlesque',
    director: 'Steve Antin',
    actors: [
      { name: 'Cher' },
      { name: 'Christina Aguilera' },
      { name: 'Stanley Tucci' },
      { name: 'Cam Gigandet' },
      { name: 'Kristen Bell' },
    ],
    coverUrl: '/movies_pictures/870c07d972d9.jpg',
    releaseDate: '2010-11-24',
    length: 119,
    genre: ['Comédie musicale', 'Drame', 'Romance'],
    saga: '',
    description: 'Une provinciale débarque à Los Angeles, intègre un cabaret burlesque menacé de fermeture et y révèle une voix qui pourrait sauver le club.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Rock Forever',
    director: 'Adam Shankman',
    actors: [
      {
        name: 'Diego Boneta',
      },
      {
        name: 'Julianne Hough',
      },
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Russell Brand',
      },
      {
        name: 'Alec Baldwin',
      },
      {
        name: 'Bryan Cranston',
      },
      {
        name: 'Catherine Zeta-Jones',
      },
    ],
    coverUrl: '/movies_pictures/20130887.jpg',
    releaseDate: '2012-06-15',
    length: 123,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Un chanteur glam des années 1980 revient sur scène dans un festival rock et redécouvre l\'amour et la musique aux côtés de fans et d\'anciens rivaux.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Pitch Perfect',
    director: 'Jason Moore',
    actors: [
      {
        name: 'Anna Kendrick',
      },
      {
        name: 'Brittany Snow',
      },
      {
        name: 'Anna Camp',
      },
      {
        name: 'Rebel Wilson',
      },
      {
        name: 'Ester Dean',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Skylar Astin',
      },
    ],
    coverUrl:
      '/movies_pictures/f83aab2f7e42544442d50cb0ba2b511cce6d5bf5f17f592c0925572b7960e37d.jpg',
    releaseDate: '2012-10-05',
    length: 112,
    genre: ['Comédie', 'Comédie musicale'],
    saga: '',
    description: 'Une étudiante introvertie rejoint les Bellas, chorale universitaire féminine, et les aide à reconquérir un concours de a cappella dominé par leurs rivaux masculins.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Les Misérables',
    director: 'Tom Hooper',
    actors: [
      {
        name: 'Hugh Jackman',
      },
      {
        name: 'Russell Crowe',
      },
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Sacha Baron Cohen',
      },
      {
        name: 'Helena Bonham Carter',
      },
      {
        name: 'Eddie Redmayne',
      },
    ],
    coverUrl: '/movies_pictures/20364091.jpg',
    releaseDate: '2012-12-25',
    length: 158,
    genre: ['Comédie musicale', 'Drame'],
    saga: 'Les Misérables',
    description: 'Adaptation chantée du roman de Hugo : Jean Valjean, traqué par Javert, protège Cosette pendant les tumultes révolutionnaires de Paris.',
    fromEntity: {
      entityType: 'book',
      title: 'Les Misérables',
      secondEntityKey: 'Victor Hugo',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2013 },
      { type: OscarEnum.OSCAR_BEST_MAKEUP, year: 2013 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2013 },
    ],
  },
  {
    title: 'Jersey Boys',
    director: 'Clint Eastwood',
    actors: [
      { name: 'John Lloyd Young' },
      { name: 'Erich Bergen' },
      { name: 'Michael Lomenda' },
    ],
    coverUrl: '/movies_pictures/e7455c9ae0ca.jpg',
    releaseDate: '2014-06-20',
    length: 134,
    genre: ['Comédie musicale', 'Biographie'],
    saga: '',
    description:
      'Biographie musicale du groupe Four Seasons, de leurs débuts dans le New Jersey aux succès, jalousies et divisions.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Pitch Perfect 2',
    director: 'Elizabeth Banks',
    actors: [
      {
        name: 'Anna Kendrick',
      },
      {
        name: 'Chrissie Fit',
      },
      {
        name: 'Kelley Jakle',
      },
      {
        name: 'Skylar Astin',
      },
      {
        name: 'Ester Dean',
      },
      {
        name: 'John Michael Higgins',
      },
      {
        name: 'Rebel Wilson',
      },
    ],
    coverUrl: '/movies_pictures/035526.jpg',
    releaseDate: '2015-05-15',
    length: 115,
    genre: ['Comédie', 'Comédie musicale'],
    saga: '',
    description: 'Les Bellas, humiliées lors d\'un gala, doivent regagner leur prestige lors d\'un championnat mondial de a cappella face à des rivales redoutables.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'The Greatest Showman',
    director: 'Michael Gracey',
    actors: [
      {
        name: 'Zac Efron',
      },
      {
        name: 'Hugh Jackman',
      },
      {
        name: 'Michelle Williams',
      },
      {
        name: 'Rebecca Ferguson',
      },
      {
        name: 'Zendaya',
      },
      {
        name: 'Keala Settle',
      },
      {
        name: 'Sam Humphrey',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BMjI1NDYzNzY2Ml5BMl5BanBnXkFtZTgwODQwODczNTM@._V1_.jpg',
    releaseDate: '2017-12-20',
    length: 105,
    genre: ['Comédie musicale', 'Drame'],
    saga: '',
    description: 'P.T. Barnum monte un cirque spectaculaire en recrutant artistes marginalisés et chante sa vision du rêve américain malgré les critiques de la haute société.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Pitch Perfect 3',
    director: 'Trish Sie',
    actors: [
      {
        name: 'Anna Kendrick',
      },
      {
        name: 'Rebel Wilson',
      },
      {
        name: 'Hailee Steinfeld',
      },
      {
        name: 'Brittany Snow',
      },
      {
        name: 'Anna Camp',
      },
      {
        name: 'John Lithgow',
      },
      {
        name: 'DJ Khaled',
      },
    ],
    coverUrl: '/movies_pictures/5714798.webp',
    releaseDate: '2017-12-22',
    length: 93,
    genre: ['Comédie', 'Comédie musicale'],
    saga: '',
    description: 'Les Bellas, diplômées et sans avenir professionnel, partent en tournée militaire pour un dernier concours avant de se séparer.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Mamma Mia! Here We Go Again',
    director: 'Ol Parker',
    actors: [
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Lily James',
      },
      {
        name: 'Christine Baranski',
      },
      {
        name: 'Jessica Keenan Wynn',
      },
      {
        name: 'Julie Walters',
      },
      {
        name: 'Alexa Davies',
      },
    ],
    coverUrl: '/movies_pictures/91gMNM6GcbL.jpg',
    releaseDate: '2018-07-20',
    length: 114,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Entre flashbacks sur la jeunesse de Donna et présent où Sophie rouvre l\'hôtel, les habitants de l\'île célèbrent l\'amour au rythme d\'ABBA.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Bohemian Rhapsody',
    director: 'Bryan Singer',
    actors: [
      {
        name: 'Rami Malek',
      },
      {
        name: 'Mike Myers',
      },
      {
        name: 'Lucy Boynton',
      },
      {
        name: 'Joseph Mazzello',
      },
      {
        name: 'Ben Hardy',
      },
      {
        name: 'Allen Leech',
      },
      {
        name: 'Gwilym Lee',
      },
    ],
    coverUrl: '/movies_pictures/2028013.webp',
    releaseDate: '2018-11-02',
    length: 134,
    genre: ['Biographie', 'Comédie musicale'],
    saga: '',
    description: 'De ses débuts à Queen à Live Aid, Freddie Mercury mène le groupe au sommet tout en luttant contre ses démons personnels et sa solitude.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ACTOR, year: 2019 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 2019 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 2019 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2019 },
    ],
  },
  {
    title: 'Le Retour de Mary Poppins',
    director: 'Rob Marshall',
    actors: [
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Lin-Manuel Miranda',
      },
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Ben Whishaw',
      },
      {
        name: 'Emily Mortimer',
      },
      {
        name: 'Colin Firth',
      },
      {
        name: 'Dick Van Dyke',
      },
    ],
    coverUrl: '/movies_pictures/3191210.webp',
    releaseDate: '2018-12-19',
    length: 130,
    genre: ['Fantastique', 'Comédie musicale'],
    saga: '',
    description: 'Vingt ans plus tard, Mary Poppins revient aider les frère et sœur Banks, devenus adultes, à retrouver l\'émerveillement et la cohésion familiale.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Rocketman',
    director: 'Dexter Fletcher',
    actors: [
      {
        name: 'Taron Egerton',
      },
      {
        name: 'Jamie Bell',
      },
      {
        name: 'Richard Madden',
      },
      {
        name: 'Bryce Dallas Howard',
      },
      {
        name: 'Steven Mackintosh',
      },
      {
        name: 'Gemma Jones',
      },
      {
        name: 'Stephen Graham',
      },
    ],
    coverUrl: '/movies_pictures/3570616.jpg',
    releaseDate: '2019-05-31',
    length: 121,
    genre: ['Biographie', 'Comédie musicale'],
    saga: '',
    description: 'Biopic musical d\'Elton John, de l\'enfance difficile à la gloire planétaire, entre excès, coming-out et recherche d\'amour authentique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 2020 },
    ],
  },
  {
    title: 'West Side Story',
    director: 'Steven Spielberg',
    actors: [
      {
        name: 'Ansel Elgort',
      },
      {
        name: 'Rachel Zegler',
      },
      {
        name: 'Corey Stoll',
      },
      {
        name: "Brian d'Arcy James",
      },
      {
        name: 'Rita Moreno',
      },
      {
        name: 'Ariana DeBose',
      },
      {
        name: 'David Alvarez',
      },
    ],
    coverUrl: '/movies_pictures/2324146.jpg',
    releaseDate: '2021-12-10',
    length: 156,
    genre: ['Comédie musicale', 'Romance'],
    saga: '',
    description: 'Remake du classique : dans le New York des années 1950, Tony et Maria s\'éprendent alors que leurs communautés rivales s\'apprêtent à s\'affronter.',
    fromEntity: {
      entityType: 'book',
      title: 'Roméo et Juliette',
      secondEntityKey: 'William Shakespeare',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2022 },
    ],
  },
  {
    title: 'Elvis',
    director: 'Baz Luhrmann',
    actors: [
      {
        name: 'Austin Butler',
      },
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Olivia DeJonge',
      },
      {
        name: 'Yola',
      },
      {
        name: 'Luke Bracey',
      },
      {
        name: 'Kelvin Harrison Jr.',
      },
      {
        name: 'Dacre Montgomery',
      },
    ],
    coverUrl: '/movies_pictures/2558793.webp',
    releaseDate: '2022-06-24',
    length: 159,
    genre: ['Drame', 'Comédie musicale'],
    saga: '',
    description: 'De Tupelo à Las Vegas, la relation tumultueuse entre Elvis Presley et son impresario Colonel Parker raconte l\'ascension et l\'emprise sur la légende du rock.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'High School Musical 4',
    director: 'Quinn Robbins',
    actors: [
      { name: 'Corbin Bleu' },
      { name: 'Monique Coleman' },
      { name: 'Lucas Grabeel' },
      { name: 'KayCee Stroh' },
      { name: 'Bart Johnson' },
      { name: 'Alyson Reed' },
      { name: 'Joshua Bassett' },
    ],
    coverUrl: '/movies_pictures/b52db780b992.jpg',
    releaseDate: '2023-08-09',
    length: 52,
    genre: ['Comédie musicale', 'Jeunesse'],
    saga: '',
    description: 'Nouvelle génération au lycée East High où de jeunes talents préparent un spectacle musical qui relance l\'esprit de la franchise Disney.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Wicked',
    director: 'Jon M. Chu',
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
        name: 'Jeff Goldblum',
      },
      {
        name: 'Michelle Yeoh',
      },
      {
        name: 'Bowen Yang',
      },
    ],
    coverUrl: '/movies_pictures/1c637da2ba5462df0d49da335124208a.jpg',
    releaseDate: '2024-11-22',
    length: 160,
    genre: ['Comédie musicale', 'Fantastique'],
    saga: '',
    description: 'Origines de la sorcière de l\'Ouest : Elphaba, rejetée pour sa peau verte, devient amie de Glinda avant que leurs destins ne divergent dans le pays d\'Oz.',
    fromEntity: {
      entityType: 'book',
      title: "Wicked",
      secondEntityKey: "Gregory Maguire",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2025 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 2025 },
    ],
  },
  {
    title: 'Sur un air de blues',
    director: 'Michael Grandage',
    actors: [
      {
        name: 'Hugh Jackman',
      },
      {
        name: 'Kate Hudson',
      },
      {
        name: 'Michael Imperioli',
      },
      {
        name: 'Fisher Stevens',
      },
      {
        name: 'James Belushi',
      },
      {
        name: 'Ella Anderson',
      },
      {
        name: 'King Princess',
      },
    ],
    coverUrl: '/movies_pictures/bf238684c15647fe1420a11916a9b63f.webp',
    releaseDate: '2024-12-20',
    length: 120,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Biopic de la chanteuse de jazz Billie Holiday, entre succès scénique, addiction et persécution du FBI qui veut faire taire sa voix engagée.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Wicked: For Good',
    director: 'Jon M. Chu',
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
    coverUrl:
      '/movies_pictures/aaffe1c15e06.jpg',
    releaseDate: '2025-11-19',
    length: 138,
    genre: ['Comédie musicale'],
    saga: '',
    description: 'Suite de Wicked où Elphaba et Glinda affrontent les conséquences de leurs choix et la montée au pouvoir du Magicien dans le royaume d\'Oz.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
];
