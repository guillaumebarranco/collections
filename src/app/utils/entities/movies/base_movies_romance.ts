import { BaseMovie, OscarEnum } from '../../../models/movie-model';

export const baseMoviesRomance: BaseMovie[] = [
  {
    title: 'Cœurs brûlés',
    director: 'Josef von Sternberg',
    actors: [
      { name: 'Marlene Dietrich' },
      { name: 'Gary Cooper' },
      { name: 'Adolphe Menjou' },
      { name: 'Ullrich Haupt' },
      { name: 'Eve Southern' },
    ],
    coverUrl: '/movies_pictures/4d7e6374be1f.jpg',
    releaseDate: '1930-11-14',
    length: 91,
    genre: ['Romance', 'Drame'],
    saga: '',
    description:
      'À Mogador, une chanteuse de cabaret joue avec un légionnaire et un riche mondain.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Le Roman de Marguerite Gautier',
    director: 'George Cukor',
    actors: [
      { name: 'Greta Garbo' },
      { name: 'Robert Taylor' },
      { name: 'Lionel Barrymore' },
      { name: 'Elizabeth Allan' },
      { name: 'Jessie Ralph' },
    ],
    coverUrl: '/movies_pictures/b47a491f1556.jpg',
    releaseDate: '1936-12-12',
    length: 109,
    genre: ['Romance', 'Drame'],
    saga: '',
    description:
      "La courtisane Marguerite Gautier aime un jeune bourgeois que la société et la maladie séparent d'elle.",
    fromEntity: {
      entityType: 'book',
      title: 'La Dame aux camélias',
      secondEntityKey: 'Alexandre Dumas fils',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Une partie de campagne',
    director: 'Jean Renoir',
    actors: [
      { name: 'Sylvia Bataille' },
      { name: 'Georges Darnoux' },
      { name: 'Jacques B. Brunius' },
      { name: 'Jane Marken' },
      { name: 'Paul Temps' },
    ],
    coverUrl: '/movies_pictures/89bd30fd96d9.jpg',
    releaseDate: '1946-05-08',
    length: 40,
    genre: ['Romance', 'Drame'],
    saga: '',
    description:
      "Un dimanche au bord de l'eau, une jeune fille s'abandonne à un canotier, souvenir d'un été qui ne reviendra pas.",
    fromEntity: {
      entityType: 'book',
      title: 'Une partie de campagne',
      secondEntityKey: 'Guy de Maupassant',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Le Fantôme et Mrs. Muir',
    director: 'Joseph L. Mankiewicz',
    actors: [
      { name: 'Gene Tierney' },
      { name: 'Rex Harrison' },
      { name: 'George Sanders' },
      { name: 'Edna Best' },
      { name: 'Vanessa Brown' },
    ],
    coverUrl: '/movies_pictures/822bfa4ed66e.jpg',
    releaseDate: '1947-05-26',
    length: 104,
    genre: ['Romance', 'Fantastique', 'Comédie'],
    saga: '',
    description:
      "Une veuve s'installe dans une maison hantée par un capitaine, et écrit ses mémoires d'outre-tombe.",
    fromEntity: {
      entityType: 'book',
      title: 'The Ghost and Mrs. Muir',
      secondEntityKey: 'R. A. Dick',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Homme tranquille",
    director: 'John Ford',
    actors: [
      { name: 'John Wayne' },
      { name: "Maureen O'Hara" },
      { name: 'Barry Fitzgerald' },
      { name: 'Ward Bond' },
      { name: 'Victor McLaglen' },
    ],
    coverUrl: '/movies_pictures/d890d98a040c.jpg',
    releaseDate: '1952-07-21',
    length: 129,
    genre: ['Romance', 'Comédie', 'Drame'],
    saga: '',
    description:
      'Un boxeur américain rentre au village irlandais de ses parents et courtise une rousse indomptable.',
    fromEntity: {
      entityType: 'book',
      title: "Jeux interdits",
      secondEntityKey: "François Boyer",
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1953 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1953 },
    ],
  },
  {
    title: 'Vacances romaines',
    director: 'William Wyler',
    actors: [
      {
        name: 'Gregory Peck',
      },
      {
        name: 'Audrey Hepburn',
      },
      {
        name: 'Eddie Albert',
      },
      {
        name: 'Tullio Carminati',
      },
      {
        name: 'Paolo Carlini',
      },
      {
        name: 'Claudio Ermelli',
      },
      {
        name: 'Paola Borboni',
      },
    ],
    coverUrl: '/movies_pictures/Roman_Holiday_(1953_poster).jpg',
    releaseDate: '1953-08-27',
    length: 118,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une princesse étouffée par ses obligations s\'échappe incognito à Rome et tombe amoureuse d\'un journaliste américain qui ignore son identité royale.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1954 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1954 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 1954 },
    ],
  },
  {
    title: 'Un homme et une femme',
    director: 'Claude Lelouch',
    actors: [
      { name: 'Anouk Aimée' },
      { name: 'Jean-Louis Trintignant' },
      { name: 'Pierre Barouh' },
      { name: 'Valérie Lagrange' },
      { name: 'Simone Paris' },
    ],
    coverUrl: '/movies_pictures/f89c758ac6e8.jpg',
    releaseDate: '1966-05-12',
    length: 102,
    genre: ['Romance', 'Drame'],
    saga: '',
    description:
      'Une script et un pilote, veufs, se retrouvent à Deauville auprès de leurs enfants.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_INTERNATIONAL_FEATURE, year: 1967 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 1967 },
    ],
  },
  {
    title: 'Nos plus belles années',
    director: 'Sydney Pollack',
    actors: [
      { name: 'Barbra Streisand' },
      { name: 'Robert Redford' },
      { name: 'Bradford Dillman' },
      { name: 'Lois Chiles' },
      { name: "Patrick O'Neal" },
    ],
    coverUrl:
      '/movies_pictures/35b140fcc664.jpg',
    releaseDate: '1973-10-16',
    length: 118,
    genre: ['Romance', 'Drame'],
    saga: '',
    description:
      "Katie et Hubbell s'aiment de l'université aux années 50, politique, succès et chanson The Way We Were.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1974 }],
  },
  {
    title: 'Starman',
    director: 'John Carpenter',
    actors: [
      {
        name: 'Jeff Bridges',
      },
      {
        name: 'Karen Allen',
      },
      {
        name: 'Charles Martin Smith',
      },
      {
        name: 'Richard Jaeckel',
      },
      {
        name: 'David Wells',
      },
      {
        name: 'Dirk Blocker',
      },
      {
        name: 'George Buck Flower',
      },
    ],
    coverUrl: '/movies_pictures/0e81aa55fdac.jpg',
    releaseDate: '1984-12-14',
    length: 115,
    genre: ['Romance', 'Science Fiction', 'Drame'],
    saga: '',
    description: 'Une extraterrestre prend l\'apparence du défunt mari d\'une veuve et doit regagner sa planète tout en développant un lien humain avec elle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Murphy's Romance",
    director: 'Martin Ritt',
    actors: [
      { name: 'Sally Field' },
      { name: 'James Garner' },
      { name: 'Brian Kerwin' },
      { name: 'Corey Haim' },
      { name: 'Dennis Burkley' },
    ],
    coverUrl: '/movies_pictures/6b7022f9cb2c.jpg',
    releaseDate: '1985-12-25',
    length: 107,
    genre: ['Romance', 'Comédie', 'Drame'],
    saga: '',
    description:
      "Une mère divorcée s'installe en Arizona et aime un pharmacien plus âgé, cow-boys et timidité.",
    fromEntity: {
      entityType: 'book',
      title: "Murphy's Romance",
      secondEntityKey: 'Max Schott',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "An Autumn's Tale",
    director: 'Mabel Cheung',
    actors: [
      { name: 'Chow Yun-fat' },
      { name: 'Cherie Chung' },
      { name: 'Danny Chan' },
      { name: 'Gigi Wong' },
      { name: 'Tse Wai-hung' },
    ],
    coverUrl: '/movies_pictures/c149141428ef.jpg',
    releaseDate: '1987-07-16',
    length: 98,
    genre: ['Romance', 'Drame', 'Comédie'],
    saga: '',
    description:
      "Une étudiante hongkongaise à New York croise un cousin voyou, feuilles d'automne et second degré.",
    fromEntity: null,
    countryOrigin: ['Chine'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Dirty Dancing',
    director: 'Emile Ardolino',
    actors: [
      {
        name: 'Patrick Swayze',
      },
      {
        name: 'Jennifer Grey',
      },
      {
        name: 'Jerry Orbach',
      },
      {
        name: 'Cynthia Rhodes',
      },
      {
        name: 'Kelly Bishop',
      },
      {
        name: 'Jane Brucker',
      },
      {
        name: 'Jack Weston',
      },
    ],
    coverUrl: '/movies_pictures/7af154f55610.webp',
    releaseDate: '1987-08-21',
    length: 100,
    genre: ['Romance'],
    saga: '',
    description: 'Françoise, surnommée Baby, passe l\'été dans un resort et apprend à danser avec Johnny, danseur professionnel, dans une romance estivale emblématique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1988 }],
  },
  {
    title: 'Cocktail',
    director: 'Roger Donaldson',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Bryan Brown',
      },
      {
        name: 'Elisabeth Shue',
      },
      {
        name: 'Gina Gershon',
      },
      {
        name: 'Kelly Lynch',
      },
      {
        name: 'Lisa Banes',
      },
      {
        name: 'Laurence Luckinbill',
      },
    ],
    coverUrl: '/movies_pictures/cocktail.jpg',
    releaseDate: '1988-07-29',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Un barman charismatique monte à New York pour réussir et tombe amoureux d\'une femme qui le pousse à choisir entre argent et amour.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Always',
    director: 'Steven Spielberg',
    actors: [
      { name: 'Richard Dreyfuss' },
      { name: 'Holly Hunter' },
      { name: 'Brad Johnson' },
      { name: 'John Goodman' },
      { name: 'Audrey Hepburn' },
    ],
    coverUrl:
      '/movies_pictures/d9ea5669788f.jpg',
    releaseDate: '1989-12-22',
    length: 123,
    genre: ['Romance', 'Fantastique', 'Drame'],
    saga: '',
    description:
      'Un pilote pompier meurt, revient en fantôme et aide sa fiancée à aimer un autre, Hepburn en ange.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Pretty Woman',
    director: 'Garry Marshall',
    actors: [
      {
        name: 'Richard Gere',
      },
      {
        name: 'Julia Roberts',
      },
      {
        name: 'Ralph Bellamy',
      },
      {
        name: 'Jason Alexander',
      },
      {
        name: 'Laura San Giacomo',
      },
      {
        name: 'Héctor Elizondo',
      },
      {
        name: 'Amy Yasbeck',
      },
    ],
    coverUrl: '/movies_pictures/0cfd4a62eec3.jpg',
    releaseDate: '1990-03-23',
    length: 119,
    genre: ['Romance'],
    saga: '',
    description: 'Un homme d\'affaires richissime embauche une prostituée pour l\'accompagner lors d\'événements sociaux, et leur arrangement se transforme en vraie romance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Ghost',
    director: 'Jerry Zucker',
    actors: [
      {
        name: 'Patrick Swayze',
      },
      {
        name: 'Demi Moore',
      },
      {
        name: 'Whoopi Goldberg',
      },
      {
        name: 'Tony Goldwyn',
      },
      {
        name: 'Rick Aviles',
      },
      {
        name: 'Vincent Schiavelli',
      },
      {
        name: 'Stephen Root',
      },
    ],
    coverUrl: '/movies_pictures/19106105.jpg',
    releaseDate: '1990-07-13',
    length: 127,
    genre: ['Romance', 'Fantastique'],
    saga: '',
    description: 'Un homme assassiné revient comme esprit pour protéger sa petite amie et la guider vers la vérité grâce à une médium, dans une romance surnaturelle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [{ type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 1991 }],
  },
  {
    title: 'Wild at Heart',
    director: 'David Lynch',
    actors: [
      {
        name: 'Nicolas Cage',
      },
      {
        name: 'Laura Dern',
      },
      {
        name: 'Willem Dafoe',
      },
      {
        name: 'Crispin Glover',
      },
      {
        name: 'Diane Ladd',
      },
      {
        name: 'Isabella Rossellini',
      },
      {
        name: 'Harry Dean Stanton',
      },
    ],
    coverUrl: '/movies_pictures/5c5c66a89897.jpg',
    releaseDate: '1990-08-17',
    length: 124,
    genre: ['Romance', 'Thriller', 'Policier'],
    saga: '',
    description: 'Lula et Sailor, amants fuyant la violence et la jalousie, traversent l\'Amérique dans une odyssée où passion, musique et danger se confondent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Frankie and Johnny',
    director: 'Garry Marshall',
    actors: [
      { name: 'Al Pacino' },
      { name: 'Michelle Pfeiffer' },
      { name: 'Hector Elizondo' },
      { name: 'Nathan Lane' },
      { name: 'Kate Nelligan' },
    ],
    coverUrl:
      '/movies_pictures/c18b73098c6e.jpg',
    releaseDate: '1991-10-11',
    length: 118,
    genre: ['Romance', 'Comédie', 'Drame'],
    saga: '',
    description:
      'Johnny, ex-détenu, tombe amoureux de Frankie, serveuse méfiante, et tente de la convaincre que l\'amour vaut le risque d\'une nouvelle déception.',
    fromEntity: {
      entityType: 'book',
      title: 'Frankie and Johnny in the Clair de Lune',
      secondEntityKey: 'Terrence McNally',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Strictly Ballroom',
    director: 'Baz Luhrmann',
    actors: [
      {
        name: 'Paul Mercurio',
      },
      {
        name: 'Bill Hunter',
      },
      {
        name: 'Barry Otto',
      },
      {
        name: 'Gia Carides',
      },
      {
        name: 'Lauren Hewett',
      },
      {
        name: 'Tara Morice',
      },
    ],
    coverUrl: '/movies_pictures/91wvoI-VZ2L._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1992-08-20',
    length: 94,
    genre: ['Romance'],
    saga: '',
    description: 'Un danseur de compétition australien choisit une partenaire débutante et défie les règles rigides du monde du ballroom pour danser avec passion.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Forever Young',
    director: 'Steve Miner',
    actors: [
      { name: 'Mel Gibson' },
      { name: 'Jamie Lee Curtis' },
      { name: 'Elijah Wood' },
      { name: 'Isabel Glasser' },
      { name: 'George Wendt' },
    ],
    coverUrl:
      '/movies_pictures/cafec4823fa0.jpg',
    releaseDate: '1992-12-16',
    length: 102,
    genre: ['Romance', 'Science Fiction', 'Drame'],
    saga: '',
    description:
      'Un pilote de 1939 se fait cryogéniser et se réveille en 1992, amour perdu et enfant du voisin.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Benny & Joon',
    director: 'Jeremiah S. Chechik',
    actors: [
      { name: 'Johnny Depp' },
      { name: 'Mary Stuart Masterson' },
      { name: 'Aidan Quinn' },
      { name: 'Julianne Moore' },
      { name: 'Oliver Platt' },
    ],
    coverUrl:
      '/movies_pictures/8440f219de03.jpg',
    releaseDate: '1993-04-16',
    length: 98,
    genre: ['Romance', 'Comédie', 'Drame'],
    saga: '',
    description:
      "Benny protège sa sœur Joon, fragile mentalement, jusqu'à ce qu'un étrange homme entre dans leur vie et tombe amoureux d'elle.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Nuits blanches à Seattle',
    director: 'Nora Ephron',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Meg Ryan',
      },
      {
        name: 'Bill Pullman',
      },
      {
        name: 'Ross Malinger',
      },
      {
        name: "Rosie O'Donnell",
      },
      {
        name: 'Victor Garber',
      },
      {
        name: 'Rita Wilson',
      },
    ],
    coverUrl: '/movies_pictures/e1878c69e822.jpg',
    releaseDate: '1993-06-25',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Une veuve parle au radio d\'un homme qu\'elle aime sans l\'avoir rencontré, attirant l\'attention d\'une journaliste qui veut les réunir.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Chungking Express',
    director: 'Wong Kar-wai',
    actors: [
      { name: 'Takeshi Kaneshiro' },
      { name: 'Brigitte Lin' },
      { name: 'Tony Leung Chiu-wai' },
      { name: 'Faye Wong' },
      { name: 'Valerie Chow' },
    ],
    coverUrl:
      '/movies_pictures/be18ab832973.jpg',
    releaseDate: '1994-07-14',
    length: 102,
    genre: ['Romance', 'Drame', 'Comédie'],
    saga: '',
    description:
      "Deux flics, deux amours, boîtes de sardines périmées et Faye Wong dans un snack de l'aéroport.",
    fromEntity: null,
    countryOrigin: ['Chine'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Les Vendanges de feu',
    director: 'Alfonso Arau',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Aitana Sánchez-Gijón',
      },
      {
        name: 'Anthony Quinn',
      },
      {
        name: 'Giancarlo Giannini',
      },
      {
        name: 'Angélica Aragón',
      },
      {
        name: 'Freddy Rodríguez',
      },
      {
        name: 'Debra Messing',
      },
    ],
    coverUrl: '/movies_pictures/18868756.webp',
    releaseDate: '1995-04-21',
    length: 102,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune veuve mexicaine et un chef américain tombent amoureux en préparant une sauce ancestral, entre traditions culinaires et passions brûlantes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Roméo + Juliette',
    director: 'Baz Luhrmann',
    actors: [
      {
        name: 'Leonardo DiCaprio',
      },
      {
        name: 'Claire Danes',
      },
      {
        name: 'Brian Dennehy',
      },
      {
        name: 'John Leguizamo',
      },
      {
        name: 'Pete Postlethwaite',
      },
      {
        name: 'Paul Sorvino',
      },
      {
        name: 'Diane Venora',
      },
    ],
    coverUrl: '/movies_pictures/18798069.jpg',
    releaseDate: '1996-11-01',
    length: 120,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Shakespeare revisité en Miami contemporaine : Roméo et Juliette s\'aiment malgré la guerre entre leurs familles mafieuses rivales.',
    fromEntity: {
      entityType: 'book',
      title: 'Roméo et Juliette',
      secondEntityKey: 'William Shakespeare',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Titanic',
    director: 'James Cameron',
    actors: [
      {
        name: 'Leonardo DiCaprio',
      },
      {
        name: 'Kate Winslet',
      },
      {
        name: 'Billy Zane',
      },
      {
        name: 'Kathy Bates',
      },
      {
        name: 'Frances Fisher',
      },
      {
        name: 'Bernard Hill',
      },
      {
        name: 'Jonathan Hyde',
      },
    ],
    coverUrl: '/movies_pictures/9141165baf17.jpg',
    releaseDate: '1997-12-19',
    length: 195,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Rose, jeune aristocrate, tombe amoureuse de Jack, artiste pauvre, à bord du Titanic lors de sa traversée fatale de l\'Atlantique en 1912.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_SOUND, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_FILM_EDITING, year: 1998 },
      { type: OscarEnum.OSCAR_BEST_VISUAL_EFFECTS, year: 1998 },
    ],
  },
  {
    title: 'Demain on se marie',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Drew Barrymore',
      },
      {
        name: 'Christine Taylor',
      },
      {
        name: 'Allen Covert',
      },
      {
        name: 'Angela Featherstone',
      },
      {
        name: 'Matthew Glave',
      },
      {
        name: 'Steve Buscemi',
      },
    ],
    coverUrl: '/movies_pictures/041710_af.webp',
    releaseDate: '1998-02-13',
    length: 119,
    genre: ['Romance'],
    saga: '',
    description: 'Un chirurgien cardiaque et une enseignante s\'accordent sur un mariage sans amour pour satisfaire leurs familles, mais les sentiments apparaissent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Sliding Doors',
    director: 'Peter Howitt',
    actors: [
      { name: 'Gwyneth Paltrow' },
      { name: 'John Hannah' },
      { name: 'John Lynch' },
      { name: 'Jeanne Tripplehorn' },
      { name: 'Zara Turner' },
    ],
    coverUrl: '/movies_pictures/096bcc7ccd0e.jpg',
    releaseDate: '1998-04-24',
    length: 99,
    genre: ['Romance', 'Drame', 'Comédie'],
    saga: '',
    description:
      "Deux vies selon qu'elle attrape le métro ou non, infidélité, cheveux blonds, Londres.",
    fromEntity: null,
    countryOrigin: ['Royaume-Uni', 'États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Mary à tout prix',
    director: 'Bobby Farrelly, Peter Farrelly',
    actors: [
      {
        name: 'Cameron Diaz',
      },
      {
        name: 'Matt Dillon',
      },
      {
        name: 'Ben Stiller',
      },
      {
        name: 'Lee Evans',
      },
      {
        name: 'Chris Elliott',
      },
      {
        name: 'Jeffrey Tambor',
      },
      {
        name: 'Keith David',
      },
    ],
    coverUrl: '/movies_pictures/3909229.webp',
    releaseDate: '1998-07-15',
    length: 119,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Ted, obsédé par son amour lycéen pour Mary, embauche un détective pour la retrouver quinze ans plus tard, avec des conséquences absurdes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'À tout jamais, une histoire de Cendrillon',
    director: 'Andy Tennant',
    actors: [
      { name: 'Drew Barrymore' },
      { name: 'Anjelica Huston' },
      { name: 'Dougray Scott' },
      { name: 'Megan Dodds' },
      { name: 'Patrick Godfrey' },
    ],
    coverUrl: '/movies_pictures/1fe90e494f35.jpg',
    releaseDate: '1998-07-31',
    length: 121,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une princesse déguisée en servante rencontre un prince lors d\'un bal masqué, mais leur différence de rang menace leur idylle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Dance with Me',
    director: 'Liz Friedlander',
    actors: [
      { name: 'Vanessa L. Williams' },
      { name: 'Chayanne' },
      { name: 'Kris Kristofferson' },
      { name: 'Joan Plowright' },
      { name: 'Jane Lynch' },
      { name: 'Beth Grant' },
      { name: 'Julianne Morris' },
    ],
    coverUrl: '/movies_pictures/1188bb52b56d.jpg',
    releaseDate: '1998-10-16',
    length: 126,
    genre: ['Romance', 'Comédie musicale'],
    saga: '',
    description: 'Un jeune Cubain passionné de salsa arrive à Houston et tombe amoureux d\'une danseuse lors d\'un concours qui pourrait changer leurs vies.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Rencontre avec Joe Black',
    director: 'Martin Brest',
    actors: [
      {
        name: 'Brad Pitt',
      },
      {
        name: 'Anthony Hopkins',
      },
      {
        name: 'Claire Forlani',
      },
      {
        name: 'Jake Weber',
      },
      {
        name: 'Marcia Gay Harden',
      },
      {
        name: 'Jeffrey Tambor',
      },
      {
        name: 'David S. Howard',
      },
    ],
    coverUrl: '/movies_pictures/51762-meet-joe-black-0-150-0-225-crop.jpg',
    releaseDate: '1998-11-13',
    length: 178,
    genre: ['Drame', 'Romance'],
    saga: '',
    description: 'La Mort prend l\'apparence d\'un jeune homme pour apprendre la vie humaine et tombe amoureuse de la fille du magnat qu\'elle est venue chercher.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Shakespeare in Love',
    director: 'John Madden',
    actors: [
      { name: 'Gwyneth Paltrow' },
      { name: 'Joseph Fiennes' },
      { name: 'Geoffrey Rush' },
      { name: 'Colin Firth' },
      { name: 'Ben Affleck' },
      { name: 'Judi Dench' },
      { name: 'Simon Callow' },
    ],
    coverUrl: '/movies_pictures/d237ef20a037.jpg',
    releaseDate: '1998-12-11',
    length: 123,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Jeune Shakespeare, en panne d\'inspiration, tombe amoureux d\'une femme qui veut jouer au théâtre alors que les femmes en sont interdites.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_MOVIE, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 1999 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 1999 },
    ],
  },
  {
    title: 'Vous avez un message',
    director: 'Nora Ephron',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Meg Ryan',
      },
      {
        name: 'Greg Kinnear',
      },
      {
        name: 'Parker Posey',
      },
      {
        name: 'Jean Stapleton',
      },
      {
        name: 'Steve Zahn',
      },
      {
        name: 'Dave Chappelle',
      },
    ],
    coverUrl: '/movies_pictures/038614_af.webp',
    releaseDate: '1998-12-18',
    length: 119,
    genre: ['Romance'],
    saga: '',
    description: 'Un libraire veuf et une femme mariée échangent des emails anonymes sans savoir qu\'ils se croisent déjà dans la vie réelle à New York.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Elle est trop bien',
    director: 'Robert Iscove',
    actors: [
      {
        name: 'Freddie Prinze Jr.',
      },
      {
        name: 'Rachael Leigh Cook',
      },
      {
        name: 'Matthew Lillard',
      },
      {
        name: 'Paul Walker',
      },
      {
        name: "Jodi Lyn O'Keefe",
      },
      {
        name: 'Kevin Pollak',
      },
      {
        name: 'Gabrielle Union',
      },
    ],
    coverUrl: '/movies_pictures/75770_20131202125759836.jpg',
    releaseDate: '1999-01-29',
    length: 95,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une belle lycéenne populaire accepte de transformer un voisin intellectuel en prince du bal, mais le projet les rapproche plus qu\'elle ne l\'avait prévu.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: '10 bonnes raisons de te larguer',
    director: 'Gil Junger',
    actors: [
      { name: 'Julia Stiles' },
      { name: 'Heath Ledger' },
      { name: 'Joseph Gordon-Levitt' },
      { name: 'Larisa Oleynik' },
      { name: 'David Krumholtz' },
      { name: 'Andrew Keegan' },
      { name: 'Susan May Pratt' },
    ],
    coverUrl: '/movies_pictures/19052436.webp',
    releaseDate: '1999-03-31',
    length: 97,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une lycéenne ne peut sortir que si sa sœur aînée trouve un petit ami, ce qui pousse un rebelle à séduire la cadette pour de l\'argent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Coup de foudre à Notting Hill',
    director: 'Roger Michell',
    actors: [
      {
        name: 'Julia Roberts',
      },
      {
        name: 'Hugh Grant',
      },
      {
        name: 'Rhys Ifans',
      },
      {
        name: 'Emma Chambers',
      },
      {
        name: 'Tim McInnerny',
      },
      {
        name: 'Gina McKee',
      },
      {
        name: 'Hugh Bonneville',
      },
    ],
    coverUrl: '/movies_pictures/989231ed87fc.jpg',
    releaseDate: '1999-05-28',
    length: 124,
    genre: ['Romance'],
    saga: '',
    description: 'Une star de cinéma tombe amoureuse d\'un libraire discret de Notting Hill, mais leur différence de statut complique chaque moment ensemble.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Boys and Girls',
    director: 'Robert Iscove',
    actors: [
      { name: 'Freddie Prinze Jr.' },
      { name: 'Claire Forlani' },
      { name: 'Jason Biggs' },
      { name: 'Amanda Detmer' },
      { name: 'Heather Donahue' },
    ],
    coverUrl: '/movies_pictures/87b02f08b994.jpg',
    releaseDate: '2000-06-16',
    length: 94,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Deux amis d\'enfance se retrouvent à l\'université, passant de l\'amitié à la tension amoureuse après des années de complicité platonique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Mon beau-père et moi',
    director: 'Jay Roach',
    actors: [
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Ben Stiller',
      },
      {
        name: 'Teri Polo',
      },
      {
        name: 'Blythe Danner',
      },
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Nicole DeHuff',
      },
      {
        name: 'Jon Abrahams',
      },
    ],
    coverUrl: '/movies_pictures/19458150.jpg',
    releaseDate: '2000-10-06',
    length: 108,
    genre: ['Comédie', 'Romance'],
    saga: 'Mon Beau-Père et... Moi',
    description: 'Un infirmier excentrique doit gagner l\'approbation du père surprotecteur de sa fiancée, un ex-agent de la CIA méfiant.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Ce que Veulent les Femmes',
    director: 'Nancy Meyers',
    actors: [
      {
        name: 'Mel Gibson',
      },
      {
        name: 'Helen Hunt',
      },
      {
        name: 'Marisa Tomei',
      },
      {
        name: 'Alan Alda',
      },
      {
        name: 'Lauren Holly',
      },
      {
        name: 'Ashley Johnson',
      },
      {
        name: 'Bette Midler',
      },
    ],
    coverUrl: '/movies_pictures/cdbc53ae7135.jpg',
    releaseDate: '2000-12-15',
    length: 127,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un publicitaire séducteur est contraint de vivre comme une femme pour comprendre leurs désirs et sauver sa carrière, tout en découvrant l\'empathie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Sweet November',
    director: "Pat O'Connor",
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Charlize Theron',
      },
      {
        name: 'Jason Isaacs',
      },
      {
        name: 'Greg Germann',
      },
      {
        name: 'Lauren Graham',
      },
      {
        name: 'Liam Aiken',
      },
      {
        name: 'Robert Joy',
      },
    ],
    coverUrl: '/movies_pictures/518MW6AR4QL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2001-02-16',
    length: 120,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme libre convainc un publicitaire workaholic de vivre un mois avec elle, transformant sa vision du temps et de l\'amour.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Le Journal de Bridget Jones',
    director: 'Sharon Maguire',
    actors: [
      {
        name: 'Renée Zellweger',
      },
      {
        name: 'Colin Firth',
      },
      {
        name: 'Hugh Grant',
      },
      {
        name: 'Gemma Jones',
      },
      {
        name: 'Jim Broadbent',
      },
      {
        name: 'Shirley Henderson',
      },
      {
        name: 'Sally Phillips',
      },
    ],
    coverUrl: '/movies_pictures/69216164_af.webp',
    releaseDate: '2001-04-13',
    length: 97,
    genre: ['Comédie', 'Romance'],
    saga: 'Bridget Jones',
    description: 'Bridget, célibataire trentenaire, tient un journal de ses efforts pour maigrir, arrêter de fumer et séduire son patron séduisant mais infidèle.',
    fromEntity: {
      entityType: 'book',
      title: 'Le Journal de Bridget Jones',
      secondEntityKey: 'Helen Fielding',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Bridget Jones : L'Âge de raison",
    director: 'Beeban Kidron',
    actors: [
      { name: 'Renée Zellweger' },
      { name: 'Colin Firth' },
      { name: 'Hugh Grant' },
      { name: 'Jim Broadbent' },
      { name: 'Gemma Jones' },
    ],
    coverUrl: '/movies_pictures/7d28b2948ee9.jpg',
    releaseDate: '2004-11-12',
    length: 108,
    genre: ['Comédie', 'Romance'],
    saga: 'Bridget Jones',
    description: 'Bridget, enceinte et incertaine du père, doit choisir entre son ex Daniel et le sage Mark Darcy dans une suite chaotique et tendre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Pearl Harbor',
    director: 'Michael Bay',
    actors: [
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Josh Hartnett',
      },
      {
        name: 'Kate Beckinsale',
      },
      {
        name: 'Cuba Gooding Jr.',
      },
      {
        name: 'Jon Voight',
      },
      {
        name: 'Tom Sizemore',
      },
      {
        name: 'Alec Baldwin',
      },
    ],
    coverUrl: '/movies_pictures/568a10272f5a.jpg',
    releaseDate: '2001-05-25',
    length: 183,
    genre: ['Drame', 'Romance'],
    saga: '',
    description: 'Deux pilotes amis s\'éprennent de la même infirmière avant et pendant l\'attaque japonaise sur Pearl Harbor, dans une épopée romantique et guerrière.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_SOUND_EDITING, year: 2002 }],
  },
  {
    title: 'Princesse malgré elle',
    director: 'Garry Marshall',
    actors: [
      {
        name: 'Julie Andrews',
      },
      {
        name: 'Héctor Elizondo',
      },
      {
        name: 'Heather Matarazzo',
      },
      {
        name: 'Mandy Moore',
      },
      {
        name: 'Caroline Goodall',
      },
      {
        name: 'Patrick Flueger',
      },
      {
        name: 'Sandra Oh',
      },
    ],
    coverUrl: '/movies_pictures/69216468_af.webp',
    releaseDate: '2001-08-03',
    length: 111,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Mia découvre qu\'elle est l\'héritière d\'un petit royaume européen et doit apprendre les règles de la cour tout en gardant ses pieds sur terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Un amour à New York',
    director: 'Peter Chelsom',
    actors: [
      {
        name: 'John Cusack',
      },
      {
        name: 'Kate Beckinsale',
      },
      {
        name: 'Bridget Moynahan',
      },
      {
        name: 'John Corbett',
      },
      {
        name: 'Jeremy Piven',
      },
      {
        name: 'Eugene Levy',
      },
      {
        name: 'Molly Shannon',
      },
    ],
    coverUrl: '/movies_pictures/affny.jpg',
    releaseDate: '2001-10-05',
    length: 90,
    genre: ['Romance'],
    saga: '',
    description: 'Un chirurgien britannique et une fleuriste new-yorkaise tombent amoureux lors d\'un bref séjour, puis tentent de maintenir leur relation à distance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Kate & Leopold',
    director: 'James Mangold',
    actors: [
      { name: 'Meg Ryan' },
      { name: 'Hugh Jackman' },
      { name: 'Liev Schreiber' },
    ],
    coverUrl: '/movies_pictures/446268c03621.jpg',
    releaseDate: '2001-12-25',
    length: 118,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description:
      "Un duc victorien voyage par accident au Manhattan moderne et tombe amoureux d'une publicitaire indépendante.",
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Le temps d'un automne",
    director: 'Adam Shankman',
    actors: [
      {
        name: 'Shane West',
      },
      {
        name: 'Mandy Moore',
      },
      {
        name: 'Peter Coyote',
      },
      {
        name: 'Daryl Hannah',
      },
      {
        name: 'Lauren German',
      },
      {
        name: 'Clayne Crawford',
      },
      {
        name: 'Al Thompson',
      },
    ],
    coverUrl: '/movies_pictures/c72a3739f413.webp',
    releaseDate: '2002-01-25',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Landon, jeune rebelle, tombe amoureux de Jamie, fille du pasteur atteinte d\'une maladie incurable, dans une romance adolescente marquée par le temps.',
    fromEntity: {
      entityType: 'book',
      title: 'À tout jamais',
      secondEntityKey: 'Nicholas Sparks',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: '40 jours et 40 nuits',
    director: 'Michael Lehmann',
    actors: [
      {
        name: 'Josh Hartnett',
      },
      {
        name: 'Shannyn Sossamon',
      },
      {
        name: 'Paulo Costanzo',
      },
      {
        name: 'Maggie Gyllenhaal',
      },
      {
        name: 'Vinessa Shaw',
      },
      {
        name: 'Keegan Connor Tracy',
      },
      {
        name: 'Monet Mazur',
      },
    ],
    coverUrl: '/movies_pictures/40_jours_et_40_nuits.webp',
    releaseDate: '2002-03-01',
    length: 96,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un célibataire parie qu\'il peut rester quarante jours sans relation sexuelle, juste au moment où la femme de ses rêves entre dans sa vie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Coup de foudre à Manhattan',
    director: 'Wayne Wang',
    actors: [
      {
        name: 'Jennifer Lopez',
      },
      {
        name: 'Ralph Fiennes',
      },
      {
        name: 'Natasha Richardson',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Tyler Posey',
      },
      {
        name: 'Frances Conroy',
      },
      {
        name: 'Chris Eigeman',
      },
    ],
    coverUrl: '/movies_pictures/affiche_cooup_foudre.webp',
    releaseDate: '2002-12-13',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Un chef étoilé tombe amoureux d\'une femme qui ne peut sentir ni goûter, et tente de la séduire par d\'autres sens et par la cuisine.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'Amour sans préavis",
    director: 'Marc Lawrence',
    actors: [
      {
        name: 'Hugh Grant',
      },
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Alicia Witt',
      },
      {
        name: 'Heather Burns',
      },
      {
        name: 'David Haig',
      },
      {
        name: 'Joe Badalucco',
      },
      {
        name: 'Katheryn Winnick',
      },
    ],
    coverUrl: '/movies_pictures/aff.webp',
    releaseDate: '2002-12-20',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme amnésique oublie son mari chaque matin, et celui-ci doit la reconquérir jour après jour avec patience et créativité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Jeux d'enfants",
    director: 'Yann Samuel',
    actors: [
      {
        name: 'Guillaume Canet',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Gérard Watkins',
      },
      {
        name: 'Gilles Lellouche',
      },
      {
        name: 'Thibault Verhaeghe',
      },
      {
        name: 'Joséphine Lebas-Joly',
      },
      {
        name: 'Élodie Navarre',
      },
    ],
    coverUrl: '/movies_pictures/6_5050582196122_vid.jpg',
    releaseDate: '2003-01-01',
    length: 93,
    genre: ['Romance'],
    saga: '',
    description: 'Julien et Sophie, amis d\'enfance, transforment leurs défis en jeu où l\'audace masque des sentiments qu\'ils refusent d\'assumer pendant des décennies.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Love Actually',
    director: 'Richard Curtis',
    actors: [
      { name: 'Hugh Grant' },
      { name: 'Emma Thompson' },
      { name: 'Keira Knightley' },
      { name: 'Liam Neeson' },
    ],
    coverUrl: '/movies_pictures/2a18186e96f0.jpg',
    releaseDate: '2003-11-07',
    length: 135,
    genre: ['Romance'],
    saga: '',
    description: 'Plusieurs histoires d\'amour s\'entrecroisent à Londres à l\'approche de Noël, entre premiers baisers, deuils, trahisons et déclarations inattendues.',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Honey',
    director: 'Billie Woodruff',
    actors: [
      {
        name: 'Jessica Alba',
      },
      {
        name: 'Romeo Miller',
      },
      {
        name: 'Mekhi Phifer',
      },
      {
        name: 'Joy Bryant',
      },
      {
        name: 'David Moscow',
      },
      {
        name: 'Lonette McKee',
      },
      {
        name: 'Zachary Williams',
      },
    ],
    coverUrl: '/movies_pictures/6ba2ba94c3b7.jpg',
    releaseDate: '2003-12-05',
    length: 96,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Une danseuse hip-hop rêve de chorégrapher pour une star et doit surmonter rivalités, trahisons et obstacles pour réaliser son ambition.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Tout peut arriver',
    director: 'Nancy Meyers',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Diane Keaton',
      },
      {
        name: 'Amanda Peet',
      },
      {
        name: 'Frances McDormand',
      },
      {
        name: 'Jon Favreau',
      },
      {
        name: 'KaDee Strickland',
      },
    ],
    coverUrl: '/movies_pictures/51XZJ18NBYL.jpg',
    releaseDate: '2003-12-12',
    length: 128,
    genre: ['Romance'],
    saga: '',
    description: 'Une mère divorcée tombe amoureuse d\'un jeune acteur venu chez elle pour préparer un rôle, bouleversant sa vie rangée à San Francisco.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Amour & Amnésie',
    director: 'Peter Segal',
    actors: [
      { name: 'Adam Sandler' },
      { name: 'Drew Barrymore' },
      { name: 'Rob Schneider' },
      { name: 'Sean Astin' },
      { name: 'Lusia Strus' },
      { name: 'Dan Aykroyd' },
      { name: 'Blake Clark' },
    ],
    coverUrl: '/movies_pictures/250140b717ae.jpg',
    releaseDate: '2004-02-13',
    length: 99,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Après un accident, une femme perd la mémoire récente et son mari tente de la reconquérir chaque jour comme s\'il la rencontrait à nouveau.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Dirty Dancing 2',
    director: 'Guy Ferland',
    actors: [
      { name: 'Diego Luna' },
      { name: 'Romola Garai' },
      { name: 'Sela Ward' },
      { name: 'John Slattery' },
      { name: 'Jonathan Jackson' },
    ],
    coverUrl: '/movies_pictures/4ad1875f09a1.jpg',
    releaseDate: '2004-02-27',
    length: 86,
    genre: ['Romance', 'Comédie musicale'],
    saga: '',
    description: 'Johnny revient dans un resort des Catskills et forme une danseuse talentueuse pour un spectacle qui ravive souvenirs et passions.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    director: 'Michel Gondry',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Kate Winslet',
      },
      {
        name: 'Elijah Wood',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Kirsten Dunst',
      },
    ],
    coverUrl: '/movies_pictures/85ea351eba0f.jpg',
    releaseDate: '2004-03-19',
    length: 108,
    genre: ['Romance'],
    saga: '',
    description: 'Joel et Clementine effacent leurs souvenirs d\'amour après une rupture, mais Joel tente de préserver les moments heureux pendant la procédure.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 2005 }],
  },
  {
    title: 'The Girl Next Door',
    director: 'Luke Greenfield',
    actors: [
      {
        name: 'Emile Hirsch',
      },
      {
        name: 'Elisha Cuthbert',
      },
      {
        name: 'Timothy Olyphant',
      },
      {
        name: 'Chris Marquette',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'James Remar',
      },
      {
        name: 'Timothy Bottoms',
      },
    ],
    coverUrl:
      '/movies_pictures/46081-the-girl-next-door-2004-0-150-0-225-crop.jpg',
    releaseDate: '2004-04-09',
    length: 109,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un lycéen découvre que sa voisine est une ancienne star du porno et tombe amoureux d\'elle malgré les préjugés de son entourage.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Princess Diaries 2: Royal Engagement',
    director: 'Garry Marshall',
    actors: [
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Julie Andrews',
      },
      {
        name: 'Héctor Elizondo',
      },
      {
        name: 'John Rhys-Davies',
      },
      {
        name: 'Chris Pine',
      },
      {
        name: 'Callum Blue',
      },
      {
        name: 'Heather Matarazzo',
      },
    ],
    coverUrl: '/movies_pictures/Movie_the_princess_diaries_2.jpg',
    releaseDate: '2004-08-11',
    length: 113,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Mia Thermopolis doit se marier pour conserver la couronne de Génovia et découvre un prétendant tout en retrouvant un ancien amour.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
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
      {
        name: 'Gena Rowlands',
      },
      {
        name: 'James Garner',
      },
      {
        name: 'Joan Allen',
      },
      {
        name: 'Kevin Connolly',
      },
    ],
    coverUrl: '/movies_pictures/n-oublie-jamais-film.jpg',
    releaseDate: '2004-09-08',
    length: 121,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un jeune homme tombe amoureux d\'une étudiante atteinte d\'Alzheimer précoce et consigne leurs moments dans un journal pour qu\'elle se souvienne.',
    fromEntity: {
      entityType: 'book',
      title: 'Les pages de notre amour',
      secondEntityKey: 'Nicholas Sparks',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Des étoiles plein les yeux',
    director: 'Forest Whitaker',
    actors: [
      {
        name: 'Katie Holmes',
      },
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Marc Blucas',
      },
      {
        name: 'Amerie',
      },
      {
        name: 'Lela Rochon',
      },
      {
        name: 'Margaret Colin',
      },
      {
        name: 'Dwayne Adway',
      },
    ],
    coverUrl: '/movies_pictures/43443-first-daughter-0-150-0-225-crop.jpg',
    releaseDate: '2004-09-24',
    length: 106,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune chanteuse de gospel découvre le monde du R&B et tombe amoureuse de son mentor, entre ambition artistique et choix personnels difficiles.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Mon beau-père, mes parents et moi',
    director: 'Jay Roach',
    actors: [
      { name: 'Robert De Niro' },
      { name: 'Ben Stiller' },
      { name: 'Dustin Hoffman' },
      { name: 'Barbra Streisand' },
      { name: 'Teri Polo' },
      { name: 'Blythe Danner' },
      { name: 'Owen Wilson' },
    ],
    coverUrl: '/movies_pictures/8441ea155b52.jpg',
    releaseDate: '2004-12-22',
    length: 115,
    genre: ['Comédie'],
    saga: '',
    description: 'Greg Focker présente ses parents libéraux à la famille ultra-contrôlée de sa fiancée, dans une comédie de quiproquos avant le mariage.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Hitch : Expert en Séduction',
    director: 'Andy Tennant',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Eva Mendes',
      },
      {
        name: 'Kevin James',
      },
      {
        name: 'Amber Valletta',
      },
      {
        name: 'Michael Rapaport',
      },
      {
        name: 'Adam Arkin',
      },
      {
        name: 'Julie Ann Emery',
      },
    ],
    coverUrl: '/movies_pictures/Hitch3Fduction_-_Affiche_VOD.webp',
    releaseDate: '2005-02-11',
    length: 118,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un conseiller amoureux professionnel aide un comptable timide à séduire une femme, jusqu\'à ce que ses propres méthodes soient remises en question.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Black/White',
    director: 'Kevin Rodney Sullivan',
    actors: [
      {
        name: 'Bernie Mac',
      },
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Zoë Saldaña',
      },
      {
        name: 'Judith Scott',
      },
      {
        name: 'Robert Curtis Brown',
      },
      {
        name: 'David Ramsey',
      },
      {
        name: 'Hal Williams',
      },
    ],
    coverUrl: '/movies_pictures/18437927.webp',
    releaseDate: '2005-03-25',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: 'Une jeune Noire et un jeune Blanc s\'éprendent malgré les préjugés de leurs familles et de leur entourage dans une comédie romantique des années 2000.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Match Point',
    director: 'Woody Allen',
    actors: [
      {
        name: 'Jonathan Rhys-Meyers',
      },
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Emily Mortimer',
      },
      {
        name: 'Matthew Goode',
      },
      {
        name: 'Brian Cox',
      },
      {
        name: 'Penelope Wilton',
      },
      {
        name: 'Ewen Bremner',
      },
    ],
    coverUrl: '/movies_pictures/69289f0422b1.jpg',
    releaseDate: '2005-05-12',
    length: 124,
    genre: ['Thriller', 'Romance'],
    saga: '',
    description: 'Un ancien joueur de tennis s\'introduit dans une famille aisée londonienne et doit choisir entre une relation stable et une passion dangereuse.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Quatre filles et un jean',
    director: 'Ken Kwapis',
    actors: [
      { name: 'America Ferrera' },
      { name: 'Amber Tamblyn' },
      { name: 'Blake Lively' },
      { name: 'Alexis Bledel' },
      { name: 'Bradley Whitford' },
      { name: 'Nancy Travis' },
      { name: 'Jenna Boyd' },
    ],
    coverUrl: '/movies_pictures/18457409.jpg',
    releaseDate: '2005-06-01',
    length: 119,
    genre: ['Comédie', 'Romance'],
    saga: 'Quatre filles et un jean',
    description: 'Quatre amies partagent un jean magique qui leur va à tour de rôle pendant un été où chacune vit ses propres épreuves amoureuses et familiales.',
    fromEntity: {
      entityType: 'book',
      title: 'Quatre filles et un jean',
      secondEntityKey: 'Ann Brashares',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Orgueil et Préjugés',
    director: 'Joe Wright',
    actors: [
      {
        name: 'Keira Knightley',
      },
      {
        name: 'Matthew Macfadyen',
      },
      {
        name: 'Brenda Blethyn',
      },
      {
        name: 'Donal Sutherland',
      },
      {
        name: 'Tom Hollander',
      },
      {
        name: 'Rosamund Pike',
      },
      {
        name: 'Jena Malone',
      },
    ],
    coverUrl: '/movies_pictures/a213348be4ad.jpg',
    releaseDate: '2005-09-16',
    length: 129,
    genre: ['Romance'],
    saga: '',
    description: 'Elizabeth Bennet croise le riche et distant M. Darcy dans l\'Angleterre du XIXe siècle, où orgueil et malentendus menacent leur attirance mutuelle.',
    fromEntity: {
      entityType: 'book',
      title: 'Orgueil et Préjugés',
      secondEntityKey: 'Jane Austen',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "Et si c'était vrai…",
    director: 'Mark Waters',
    actors: [
      { name: 'Reese Witherspoon' },
      { name: 'Mark Ruffalo' },
      { name: 'Donal Logue' },
      { name: 'Dina Waters' },
      { name: 'Jon Heder' },
    ],
    coverUrl: '/movies_pictures/0898c691e4d9.jpg',
    releaseDate: '2005-09-16',
    length: 95,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Un architecte veuf voit le fantôme de sa défunte fiancée et tombe amoureux d\'une médium qui peut communiquer avec elle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Mémoires d'une geisha",
    director: 'Rob Marshall',
    actors: [
      { name: 'Zhang Ziyi' },
      { name: 'Ken Watanabe' },
      { name: 'Michelle Yeoh' },
      { name: 'Gong Li' },
      { name: 'Koji Yakusho' },
      { name: 'Youki Kudoh' },
      { name: 'Suzuka Ohgo' },
    ],
    coverUrl: '/movies_pictures/18464241.jpg',
    releaseDate: '2005-12-23',
    length: 145,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Chiyo devient la geisha Sayuri à Kyoto et navigue entre mécènes, rivalités et amour interdit dans le Japon d\'avant-guerre.',
    fromEntity: {
      entityType: 'book',
      title: 'Geisha',
      secondEntityKey: 'Arthur Golden',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2006 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2006 },
      { type: OscarEnum.OSCAR_BEST_COSTUME_DESIGN, year: 2006 },
    ],
  },
  {
    title: 'Entre deux rives',
    director: 'Alejandro Agresti',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Dylan Walsh',
      },
      {
        name: 'Shohreh Aghdashloo',
      },
      {
        name: 'Christopher Plummer',
      },
      {
        name: 'Ebon Moss-Bachrach',
      },
      {
        name: 'Willeke van Ammelrooy',
      },
    ],
    coverUrl: '/movies_pictures/18653696.jpg',
    releaseDate: '2006-06-16',
    length: 99,
    genre: ['Romance'],
    saga: '',
    description: 'Un veuf envoie des messages à sa femme décédée via une boîte aux lettres du lac et reçoit une réponse d\'une femme qui traverse elle aussi une épreuve.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Sexy Dance',
    director: 'Anne Fletcher',
    actors: [
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Jenna Dewan',
      },
      {
        name: 'Mario',
      },
      {
        name: 'Drew Sidora',
      },
      {
        name: 'Rachel Griffiths',
      },
      {
        name: 'Josh Henderson',
      },
      {
        name: 'Alyson Stoner',
      },
    ],
    coverUrl: '/movies_pictures/sexy-dance-affiche_316596_23702.jpg',
    releaseDate: '2006-08-11',
    length: 104,
    genre: ['Drame', 'Romance'],
    saga: 'Sexy Dance',
    description: 'Un danseur de rue condamné à des travaux d\'intérêt général intègre une école de danse classique et tombe amoureux de son élève rigide.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Sexy Dance 2',
    director: 'Jon M. Chu',
    actors: [
      {
        name: 'Briana Evigan',
      },
      {
        name: 'Robert Hoffman',
      },
      {
        name: 'Adam Gary Sevani',
      },
      {
        name: 'Will Kemp',
      },
      {
        name: 'Cassie',
      },
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Harry Shum Jr',
      },
    ],
    coverUrl: '/movies_pictures/e81f0815b9be.jpg',
    releaseDate: '2008-02-14',
    length: 98,
    genre: ['Drame', 'Romance'],
    saga: 'Sexy Dance',
    description: 'Un danseur de hip-hop rejoint une école d\'art prestigieuse et s\'efforce de prouver sa valeur aux côtés d\'une chorégraphe exigeante qu\'il séduit.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Sexy Dance 3D',
    director: 'Jon M. Chu',
    actors: [
      {
        name: 'Rick Malambri',
      },
      {
        name: 'Sharni Vinson',
      },
      {
        name: 'Adam Gary Sevani',
      },
      {
        name: 'Alyson Stoner',
      },
      {
        name: 'Harry Shum Jr',
      },
      {
        name: 'Keith Stallworth',
      },
      {
        name: 'Mari Koda',
      },
    ],
    coverUrl: '/movies_pictures/097774355416.jpg',
    releaseDate: '2010-08-06',
    length: 107,
    genre: ['Drame', 'Romance'],
    saga: 'Sexy Dance',
    description: 'Des danseurs de rue s\'affrontent lors d\'un concours à Las Vegas où loyauté, ambition et romance se mêlent sur scène.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Sexy Dance 4 : Miami Heat',
    director: 'Scott Speer',
    actors: [
      {
        name: 'Ryan Guzman',
      },
      {
        name: 'Kathryn McCormick',
      },
      {
        name: 'Misha Gabriel Hamilton',
      },
      {
        name: 'Peter Gallagher',
      },
      {
        name: 'Stephen Boss',
      },
      {
        name: 'Cleopatra Coleman',
      },
      {
        name: 'Megan Boone',
      },
    ],
    coverUrl: '/movies_pictures/753d126125ed.jpg',
    releaseDate: '2012-08-08',
    length: 99,
    genre: ['Drame', 'Romance'],
    saga: 'Sexy Dance',
    description: 'Emily rejoint un crew de danseurs à Miami pour sauver sa sœur et découvre une scène électrisante où passion artistique et amour se croisent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Step Up: All In',
    director: 'Trish Sie',
    actors: [
      { name: 'Ryan Guzman' },
      { name: 'Briana Evigan' },
      { name: 'Alyson Stoner' },
      { name: 'Adam G. Sevani' },
      { name: 'Stephen Boss' },
      { name: 'Misha Gabriel' },
      { name: 'Izabella Miko' },
    ],
    coverUrl: '/movies_pictures/step_up_all_in.jpg',
    releaseDate: '2014-08-08',
    length: 112,
    genre: ['Drame'],
    saga: 'Sexy Dance',
    description: 'Des danseurs de différentes villes s\'unissent pour un battle à Las Vegas où leur rêve commun les rapproche autant que leurs rivalités passées.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Holiday',
    director: 'Nancy Meyers',
    actors: [
      { name: 'Cameron Diaz' },
      { name: 'Kate Winslet' },
      { name: 'Jude Law' },
      { name: 'Jack Black' },
      { name: 'Eli Wallach' },
      { name: 'Shannyn Sossamon' },
      { name: 'Edward Burns' },
    ],
    coverUrl: '/movies_pictures/artoff1049.webp',
    releaseDate: '2006-12-08',
    length: 136,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Deux femmes épuisées par leurs vies amoureuses échangent leurs maisons entre Los Angeles et l\'Angleterre et rencontrent de nouveaux amours.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Charlie, les filles lui disent merci',
    director: 'Mark Helfrich',
    actors: [
      {
        name: 'Dane Cook',
      },
      {
        name: 'Jessica Alba',
      },
      {
        name: 'Dan Fogler',
      },
      {
        name: 'Ellia English',
      },
      {
        name: 'Lonny Ross',
      },
      {
        name: 'Sasha Pieterse',
      },
      {
        name: 'Connor Price',
      },
    ],
    coverUrl:
      '/movies_pictures/5c90b820c8d937b410251edf019caf05e9886554fde10a631e48fd14c03132e0.jpg',
    releaseDate: '2007-09-21',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Un séducteur invétéré parie qu\'il peut faire tomber amoureuse une jeune femme timide, mais finit par être sincèrement touché par elle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'P.S. I Love You',
    director: 'Richard LaGravenese',
    actors: [
      {
        name: 'Hilary Swank',
      },
      {
        name: 'Gerard Butler',
      },
      {
        name: 'Lisa Kudrow',
      },
      {
        name: 'Harry Connick',
      },
      {
        name: 'Gina Gershon',
      },
      {
        name: 'Jeffrey Dean Morgan',
      },
      {
        name: 'Kathy Bates',
      },
    ],
    coverUrl: '/movies_pictures/81w+NT8-2HL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2007-12-21',
    length: 126,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Une veuve reçoit des lettres laissées par son défunt mari pour l\'aider à surmonter le deuil et à retrouver le chemin de la vie.',
    fromEntity: {
      entityType: 'book',
      title: 'P.S. I Love You',
      secondEntityKey: 'Cecelia Ahern',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Juno',
    director: 'Jason Reitman',
    actors: [
      {
        name: 'Elliot Page',
      },
      {
        name: 'Michael Cera',
      },
      {
        name: 'Jennifer Garner',
      },
      {
        name: 'Jason Bateman',
      },
      {
        name: 'Allison Janney',
      },
      {
        name: 'J. K. Simmons',
      },
      {
        name: 'Olivia Thirlby',
      },
    ],
    coverUrl: '/movies_pictures/48051-juno-0-150-0-225-crop.jpg',
    releaseDate: '2007-12-25',
    length: 96,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une lycéenne enceinte décide de donner son bébé à un couple et traverse grossesse, adoption et premiers amours avec humour et lucidité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 2008 }],
  },
  {
    title: '27 Robes',
    director: 'Anne Fletcher',
    actors: [
      {
        name: 'Katherine Heigl',
      },
      {
        name: 'James Marsden',
      },
      {
        name: 'Malin Åkerman',
      },
      {
        name: 'Edward Burns',
      },
      {
        name: 'Judy Greer',
      },
      {
        name: 'Brian Kerwin',
      },
      {
        name: 'David Castro',
      },
    ],
    coverUrl: '/movies_pictures/18930657.jpg',
    releaseDate: '2008-01-18',
    length: 111,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une femme a été demoiselle d\'honneur vingt-sept fois sans jamais être la mariée, jusqu\'à ce qu\'un journaliste révèle son histoire et un homme la voie enfin.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le témoin amoureux',
    director: 'Paul Weiland',
    actors: [
      {
        name: 'Patrick Dempsey',
      },
      {
        name: 'Michelle Monaghan',
      },
      {
        name: 'Kevin McKidd',
      },
      {
        name: 'Kadeem Hardison',
      },
      {
        name: 'Chris Messina',
      },
      {
        name: 'Richmond Arquette',
      },
      {
        name: 'Sydney Pollack',
      },
    ],
    coverUrl: '/movies_pictures/18926251.jpg',
    releaseDate: '2008-05-02',
    length: 101,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Le meilleur ami d\'un homme sur le point de se marier réalise qu\'il aime la future mariée et tente de saboter le mariage avec des moyens douteux.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Jackpot',
    director: 'Tom Vaughan',
    actors: [
      {
        name: 'Cameron Diaz',
      },
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Rob Corddry',
      },
      {
        name: 'Lake Bell',
      },
      {
        name: 'Jason Sudeikis',
      },
      {
        name: 'Treat Williams',
      },
      {
        name: 'Queen Latifah',
      },
    ],
    coverUrl:
      '/movies_pictures/47414-what-happens-in-vegas--0-150-0-225-crop.jpg',
    releaseDate: '2008-05-09',
    length: 99,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Un étudiant en médecine tombe amoureux d\'une actrice lors d\'un voyage à Las Vegas où mensonges, paris et malentendus compliquent leur idylle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Vicky Cristina Barcelona',
    director: 'Woody Allen',
    actors: [
      { name: 'Scarlett Johansson' },
      { name: 'Javier Bardem' },
      { name: 'Rebecca Hall' },
      { name: 'Penélope Cruz' },
      { name: 'Patricia Clarkson' },
      { name: 'Christopher Evan Welch' },
      { name: 'Kevin Dunn' },
    ],
    coverUrl: '/movies_pictures/18982307.webp',
    releaseDate: '2008-05-17',
    length: 96,
    genre: ['Romance'],
    saga: '',
    description: 'Deux Américaines à Barcelone tombent sous le charme d\'un peintre espagnol et entrent dans un triangle amoureux avec son ex-femme instable.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [{ type: OscarEnum.OSCAR_BEST_SUPPORTING_ACTRESS, year: 2009 }],
  },
  {
    title: 'Sex and the City',
    director: 'Michael Patrick King',
    actors: [
      {
        name: 'Sarah Jessica Parker',
      },
      {
        name: 'Kim Cattrall',
      },
      {
        name: 'Kristin Davis',
      },
      {
        name: 'Cynthia Nixon',
      },
      {
        name: 'Chris Noth',
      },
      {
        name: 'David Eigenberg',
      },
      {
        name: 'Willie Garson',
      },
    ],
    coverUrl: '/movies_pictures/18938386.webp',
    releaseDate: '2008-05-30',
    length: 145,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Carrie, Samantha, Charlotte et Miranda quittent New York pour le mariage de Miranda et vivent une escapade où amitié, amour et désir se confrontent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Meilleures ennemies',
    director: 'Gary Winick',
    actors: [
      {
        name: 'Kate Hudson',
      },
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Candice Bergen',
      },
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Bryan Greenberg',
      },
      {
        name: 'Steve Howey',
      },
      {
        name: 'Kristen Johnston',
      },
    ],
    coverUrl: '/movies_pictures/614QUSlx75L._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2009-01-09',
    length: 89,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Deux amies rivales depuis l\'enfance s\'affrontent pour le même poste et le même homme, jusqu\'à ce que leur amitié reprenne le dessus.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Un jour, peut-être',
    director: 'Marc Webb',
    actors: [
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Isla Fisher',
      },
      {
        name: 'Abigail Breslin',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Rachel Weisz',
      },
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Derek Luke',
      },
    ],
    coverUrl: '/movies_pictures/18926056.webp',
    releaseDate: '2009-01-23',
    length: 100,
    genre: ['Romance'],
    saga: '',
    description: 'Will et Emily se croisent régulièrement sans jamais être disponibles en même temps, dans une comédie romantique sur le timing et les occasions manquées.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: '17 ans encore',
    director: 'Burr Steers',
    actors: [
      {
        name: 'Zac Efron',
      },
      {
        name: 'Leslie Mann',
      },
      {
        name: 'Thomas Lennon',
      },
      {
        name: 'Sterling Knight',
      },
      {
        name: 'Hunter Parrish',
      },
      {
        name: 'Melora Hardin',
      },
      {
        name: 'Kat Graham',
      },
    ],
    coverUrl: '/movies_pictures/41276-17-again-0-150-0-225-crop.jpg',
    releaseDate: '2009-04-17',
    length: 102,
    genre: ['Comédie', 'Romance', 'Jeunesse'],
    saga: '',
    description: 'Un homme de trente-sept ans revient soudain dans son corps de lycéen et tente de corriger ses erreurs tout en retrouvant son amour d\'adolescence.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'La proposition',
    director: 'Anne Fletcher',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Betty White',
      },
      {
        name: 'Mary Steenburgen',
      },
      {
        name: 'Craig T. Nelson',
      },
      {
        name: 'Aasif Mandvi',
      },
      {
        name: "Denis O'Hare",
      },
    ],
    coverUrl: '/movies_pictures/6fd353a82d5e.jpg',
    releaseDate: '2009-06-19',
    length: 108,
    genre: ['Romance'],
    saga: '',
    description: 'Une éditrice canadienne force son assistant à l\'épouser pour éviter l\'expulsion, mais un week-end en Alaska bouleverse leurs rapports.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: '(500) Jours Ensemble',
    director: 'Marc Webb',
    actors: [
      {
        name: 'Joseph Gordon-Levitt',
      },
      {
        name: 'Zooey Deschanel',
      },
      {
        name: 'Geoffrey Arend',
      },
      {
        name: 'Chloë Grace Moretz',
      },
      {
        name: 'Matthew Gray Gubler',
      },
      {
        name: 'Clark Gregg',
      },
      {
        name: 'Patricia Belcher',
      },
    ],
    coverUrl: '/movies_pictures/4ca738b206f0.jpg',
    releaseDate: '2009-07-17',
    length: 95,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Tom revit ses 500 jours avec Summer, entre euphorie, déception et prise de conscience sur la différence entre attente romantique et réalité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Cher John',
    director: 'Lasse Hallström',
    actors: [
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Henry Thomas',
      },
      {
        name: 'Richard Jenkins',
      },
      {
        name: 'Scott Porter',
      },
      {
        name: 'D.J. Cotrona',
      },
      {
        name: 'Cullen Moss',
      },
    ],
    coverUrl: '/movies_pictures/19262319.jpg',
    releaseDate: '2010-02-05',
    length: 108,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Une étudiante tombe amoureuse d\'un soldat et entretient une correspondance intense, mais la guerre et le temps testent la solidité de leur lien.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "Valentine's Day",
    director: 'Garry Marshall',
    actors: [
      {
        name: 'Jessica Alba',
      },
      {
        name: 'Jessica Biel',
      },
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Julia Roberts',
      },
      {
        name: 'Jamie Foxx',
      },
      {
        name: 'Anne Hathaway',
      },
    ],
    coverUrl: '/movies_pictures/c47dd12d6826.jpg',
    releaseDate: '2010-02-12',
    length: 125,
    genre: ['Romance'],
    saga: '',
    description: 'Plusieurs couples et célibataires croisent leurs destins amoureux à Los Angeles le jour de la Saint-Valentin dans une comédie chorale.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Remember Me',
    director: 'Allen Coulter',
    actors: [
      {
        name: 'Robert Pattinson',
      },
      {
        name: 'Émilie de Ravin',
      },
      {
        name: 'Chris Cooper',
      },
      {
        name: 'Lena Olin',
      },
      {
        name: 'Pierce Brosnan',
      },
      {
        name: 'Martha Plimpton',
      },
      {
        name: 'Tate Ellington',
      },
    ],
    coverUrl: '/movies_pictures/37502-remember-me-0-150-0-225-crop.jpg',
    releaseDate: '2010-03-12',
    length: 113,
    genre: ['Drame', 'Romance'],
    saga: '',
    description: 'À New York, Tyler, jeune homme en colère, tombe amoureux d\'une étudiante dont la famille cache des blessures liées à un drame familial.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'Arnacœur",
    director: 'Pascal Chaumeil',
    actors: [
      {
        name: 'Romain Duris',
      },
      {
        name: 'Vanessa Paradis',
      },
      {
        name: 'Julie Ferrier',
      },
      {
        name: 'Andrew Lincoln',
      },
      {
        name: 'Jacques Frantz',
      },
      {
        name: 'Victoria Silvstedt',
      },
      {
        name: 'Amandine Dewasmes',
      },
    ],
    coverUrl: '/movies_pictures/6238116a7128.jpg',
    releaseDate: '2010-03-17',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Un séducteur professionnel est payé pour briser le cœur d\'une femme indépendante, mais finit par tomber sincèrement amoureux d\'elle.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Le Chasseur de primes',
    director: 'Andy Tennant',
    actors: [
      {
        name: 'Gerard Butler',
      },
      {
        name: 'Jennifer Aniston',
      },
      {
        name: 'Jason Sudeikis',
      },
      {
        name: 'Christine Baranski',
      },
      {
        name: 'Dorian Missick',
      },
      {
        name: 'Adam Rose',
      },
      {
        name: 'Peter Greene',
      },
    ],
    coverUrl: '/movies_pictures/459e6ed2c87b.jpg',
    releaseDate: '2010-03-19',
    length: 110,
    genre: ['Romance'],
    saga: '',
    description: 'Une journaliste embauchée pour retrouver un homme disparaît dans les Bahamas et finit par tomber amoureuse de sa cible insaisissable.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Lettres à Juliette',
    director: 'Gary Winick',
    actors: [
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Christopher Egan',
      },
      {
        name: 'Vanessa Redgrave',
      },
      {
        name: 'Gael García Bernal',
      },
      {
        name: 'Luisa Ranieri',
      },
      {
        name: 'Franco Nero',
      },
      {
        name: 'Oliver Platt',
      },
    ],
    coverUrl: '/movies_pictures/19241233.webp',
    releaseDate: '2010-05-14',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Une Américaine en Italie découvre une lettre d\'amour adressée à Juliette et part à la recherche de son auteur avec la petite-fille concernée.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Mange, prie, aime',
    director: 'Ryan Murphy',
    actors: [
      {
        name: 'Julia Roberts',
      },
      {
        name: 'Javier Bardem',
      },
      {
        name: 'James Franco',
      },
      {
        name: 'Richard Jenkins',
      },
      {
        name: 'Viola Davis',
      },
      {
        name: 'Billy Crudup',
      },
    ],
    coverUrl: '/movies_pictures/19472721.jpg',
    releaseDate: '2010-08-13',
    length: 133,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Après un divorce, Liz voyage en Italie, Inde et Bali pour retrouver équilibre, spiritualité et un amour inattendu.',
    fromEntity: {
      entityType: 'book',
      title: 'Mange, prie, aime',
      secondEntityKey: 'Elizabeth Gilbert',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'Trop loin pour toi',
    director: 'Nanette Burstein',
    actors: [
      {
        name: 'Drew Barrymore',
      },
      {
        name: 'Justin Long',
      },
      {
        name: 'Charlie Day',
      },
      {
        name: 'Jason Sudeikis',
      },
      {
        name: 'Christina Applegate',
      },
      {
        name: 'Ron Livingston',
      },
      {
        name: 'Rob Riggle',
      },
    ],
    coverUrl: '/movies_pictures/19488091.jpg',
    releaseDate: '2010-08-27',
    length: 102,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une journaliste sportive et un joueur de baseball à la retraite s\'éloignent géographiquement mais tentent de maintenir leur relation à distance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Love & autres drogues',
    director: 'Edward Zwick',
    actors: [
      { name: 'Jake Gyllenhaal' },
      { name: 'Anne Hathaway' },
      { name: 'Oliver Platt' },
      { name: 'Hank Azaria' },
      { name: 'Josh Gad' },
      { name: 'Gabriel Macht' },
      { name: 'Judy Greer' },
    ],
    coverUrl: '/movies_pictures/f4ae023308ad.jpg',
    releaseDate: '2010-11-24',
    length: 112,
    genre: ['Romance'],
    saga: '',
    description: 'Un représentant pharmaceutique séducteur tombe amoureux d\'une jeune femme atteinte de la maladie de Parkinson, bouleversant sa vision du couple.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Mon beau-père et nous',
    director: 'Paul Weitz',
    actors: [
      { name: 'Robert De Niro' },
      { name: 'Ben Stiller' },
      { name: 'Owen Wilson' },
      { name: 'Teri Polo' },
      { name: 'Jessica Alba' },
      { name: 'Dustin Hoffman' },
      { name: 'Barbra Streisand' },
    ],
    coverUrl: '/movies_pictures/42a7f948cc61.jpg',
    releaseDate: '2010-12-22',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: 'Greg tente d\'organiser les fêtes de fin d\'année avec ses beaux-parents tout en gérant ses propres parents et une nouvelle grossesse surprise.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Sex Friends',
    director: 'Ivan Reitman',
    actors: [
      {
        name: 'Natalie Portman',
      },
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Cary Elwes',
      },
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Greta Gerwig',
      },
      {
        name: 'Lake Bell',
      },
      {
        name: 'Olivia Thirlby',
      },
    ],
    coverUrl: '/movies_pictures/c2d281b1e6e8.jpg',
    releaseDate: '2011-01-21',
    length: 108,
    genre: ['Romance'],
    saga: '',
    description: 'Deux amis décident de ne maintenir qu\'une relation physique sans sentiments, mais leurs règles s\'effondrent quand l\'un d\'eux tombe amoureux.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: "L'agence",
    director: 'George Nolfi',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Anthony Mackie',
      },
      {
        name: 'John Slattery',
      },
      {
        name: 'Terence Stamp',
      },
      {
        name: 'Michael Kelly',
      },
      {
        name: 'Anthony Ruivivar',
      },
    ],
    coverUrl: '/movies_pictures/e164ca60cdcf.jpg',
    releaseDate: '2011-03-04',
    length: 106,
    genre: ['Romance'],
    saga: '',
    description: 'Un homme découvre que sa vie amoureuse est orchestrée par une agence secrète qui manipule les rencontres selon un plan mystérieux.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Minuit à Paris',
    director: 'Woody Allen',
    actors: [
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'Kurt Fuller',
      },
      {
        name: 'Michael Sheen',
      },
      {
        name: 'Carla Bruni',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Léa Seydoux',
      },
    ],
    coverUrl: '/movies_pictures/19702766.jpg',
    releaseDate: '2011-05-20',
    length: 94,
    genre: ['Romance', 'Fantastique'],
    saga: '',
    description: 'Un scénariste nostalgique se retrouve transporté dans le Paris des années 1920 où il croise artistes légendaires et une femme qui bouleverse sa vision du présent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [{ type: OscarEnum.OSCAR_BEST_ORIGINAL_SCREENPLAY, year: 2012 }],
  },
  {
    title: 'Sexe entre amis',
    director: 'Will Gluck',
    actors: [
      {
        name: 'Justin Timberlake',
      },
      {
        name: 'Mila Kunis',
      },
      {
        name: 'Patricia Clarkson',
      },
      {
        name: 'Jenna Elfman',
      },
      {
        name: 'Bryan Greenberg',
      },
      {
        name: 'Richard Jenkins',
      },
      {
        name: 'Emma Stone',
      },
    ],
    coverUrl: '/movies_pictures/19757410.webp',
    releaseDate: '2011-07-22',
    length: 109,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Deux amis décident d\'ajouter du sexe à leur relation sans complications, mais les règles deviennent difficiles à tenir quand les sentiments apparaissent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Un jour',
    director: 'Lone Scherfig',
    actors: [
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Jim Sturgess',
      },
      {
        name: 'Patricia Clarkson',
      },
      {
        name: 'Romola Garai',
      },
      {
        name: 'Rafe Spall',
      },
      {
        name: 'Ken Stott',
      },
      {
        name: 'Jodie Whittaker',
      },
    ],
    coverUrl: '/movies_pictures/un_jour.jpg',
    releaseDate: '2011-08-19',
    length: 107,
    genre: ['Romance'],
    saga: '',
    description: 'Emma et Dexter se croisent le soir de leur remise de diplômes et se retrouvent chaque année le même jour, entre amitié, regrets et amour différé.',
    fromEntity: {
      entityType: 'book',
      title: 'Un jour',
      secondEntityKey: 'David Nicholls',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'LOL (Laughing Out Loud)',
    director: 'Lisa Azuelos',
    actors: [
      { name: 'Sophie Marceau' },
      { name: 'Alexandre Astier' },
      { name: 'Christa Théret' },
      { name: 'Jérémy Kapone' },
      { name: 'Marion Chabassol' },
      { name: 'Félix Moati' },
      { name: 'Lou Lesage' },
    ],
    coverUrl: '/movies_pictures/e16d7036cbc8.jpg',
    releaseDate: '2012-04-04',
    length: 97,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Lola, lycéenne parisienne, vit ses premiers amours, mensonges et ruptures sous l\'œil de sa mère qui tente de comprendre la génération Facebook.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'The Lucky One',
    director: 'Scott Hicks',
    actors: [
      {
        name: 'Zac Efron',
      },
      {
        name: 'Taylor Schilling',
      },
      {
        name: 'Jay R. Ferguson',
      },
      {
        name: 'Blythe Danner',
      },
      {
        name: 'Adam LeFevre',
      },
      {
        name: 'Douglas M. Griffin',
      },
      {
        name: 'Joe Chrest',
      },
    ],
    coverUrl: '/movies_pictures/64331-the-lucky-one-0-150-0-225-crop.jpg',
    releaseDate: '2012-04-20',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Un marine survit à la guerre grâce à une photo trouvée et part à sa recherche, tombant amoureux de la femme qu\'elle représente.',
    fromEntity: {
      entityType: 'book',
      title: 'Le porte bonheur',
      secondEntityKey: 'Nicholas Sparks',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Warm Bodies',
    director: 'Jonathan Levine',
    actors: [
      {
        name: 'Teresa Palmer',
      },
      {
        name: 'Rob Corddry',
      },
      {
        name: 'Dave Franco',
      },
      {
        name: 'Lio Tipton',
      },
      {
        name: 'Cory Hardrict',
      },
      {
        name: 'John Malkovich',
      },
      {
        name: 'Nicholas Hoult',
      },
    ],
    coverUrl: '/movies_pictures/71BQ9tEcdJL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2013-02-01',
    length: 98,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Un zombie tombe amoureux d\'une humaine survivante, et leur lien semble le rendre à nouveau humain dans un monde post-apocalyptique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "20 ans d'écart",
    director: 'David Moreau',
    actors: [
      {
        name: 'Virginie Efira',
      },
      {
        name: 'Pierre Niney',
      },
      {
        name: 'Charles Berling',
      },
      {
        name: 'Gilles Cohen',
      },
      {
        name: 'Camille Japy',
      },
      {
        name: 'Michaël Abiteboul',
      },
      {
        name: 'Louis-Do de Lencquesaing',
      },
    ],
    coverUrl: '/movies_pictures/20446783.jpg',
    releaseDate: '2013-02-20',
    length: 92,
    genre: ['Romance'],
    saga: '',
    description: 'Une quarantenaire tombe amoureuse d\'un jeune acteur de dix-neuf ans, provoquant moqueries, doutes et remise en question de sa vie professionnelle.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Écume des jours",
    director: 'Michel Gondry',
    actors: [
      { name: 'Romain Duris' },
      { name: 'Audrey Tautou' },
      { name: 'Gad Elmaleh' },
      { name: 'Omar Sy' },
      { name: 'Aïssa Maïga' },
    ],
    coverUrl: '/movies_pictures/5fbd89a16e61.jpg',
    releaseDate: '2013-04-24',
    length: 125,
    genre: ['Romance', 'Fantastique', 'Drame'],
    saga: '',
    description:
      'Adaptation féerique et musicale du roman de Vian : Colin et Chloé vivent un amour menacé par une maladie absurde et poétique.',
    fromEntity: {
      entityType: 'book',
      title: "L'Écume des jours",
      secondEntityKey: 'Boris Vian',
    },
    countryOrigin: ['France', 'Belgique'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Jeune et jolie',
    director: 'François Ozon',
    actors: [
      {
        name: 'Marine Vacth',
      },
      {
        name: 'Geraldine Pailhas',
      },
      {
        name: 'Frederic Pierrot',
      },
      {
        name: 'Charlotte Rampling',
      },
      {
        name: 'Fantin Ravat',
      },
      {
        name: 'Johan Leysen',
      },
      {
        name: 'Nathalie Richard',
      },
    ],
    coverUrl: '/movies_pictures/27ae8ec0c816.webp',
    releaseDate: '2013-08-21',
    length: 94,
    genre: ['Drame'],
    saga: '',
    description: 'Isabelle, lycéenne parisienne, explore sa sexualité en se prostituant secrètement, entre désir, culpabilité et quête de liberté.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'About Time',
    director: 'Richard Curtis',
    actors: [
      {
        name: 'Domhnall Gleeson',
      },
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'Bill Nighy',
      },
      {
        name: 'Lydia Wilson',
      },
      {
        name: 'Lindsay Duncan',
      },
      {
        name: 'Tom Hollander',
      },
      {
        name: 'Margot Robbie',
      },
    ],
    coverUrl: '/movies_pictures/814fRqJ+AyL.jpg',
    releaseDate: '2013-11-08',
    length: 123,
    genre: ['Romance', 'Fantastique'],
    saga: '',
    description: 'Tim découvre qu\'il peut voyager dans le temps et l\'utilise pour améliorer sa vie amoureuse, jusqu\'à comprendre la valeur de chaque instant ordinaire.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Nos étoiles contraires',
    director: 'Josh Boone',
    actors: [
      { name: 'Shailene Woodley' },
      { name: 'Ansel Elgort' },
      { name: 'Nat Wolff' },
      { name: 'Laura Dern' },
      { name: 'Sam Trammell' },
      { name: 'Willem Dafoe' },
      { name: 'Lotte Verbeek' },
    ],
    coverUrl: '/movies_pictures/cf5267af0e75.jpg',
    releaseDate: '2014-06-06',
    length: 126,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Hazel et Gus, deux adolescents atteints de cancer, tombent amoureux et partent à la recherche d\'un auteur qu\'ils admirent pour donner un sens à leur temps restant.',
    fromEntity: {
      entityType: 'book',
      title: 'Nos étoiles contraires',
      secondEntityKey: 'John Green',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
    oscars: [],
  },
  {
    title: 'La règle de novembre',
    director: 'Mike Elliott',
    actors: [
      {
        name: 'Mo McRae',
      },
      {
        name: 'Tatyana Ali',
      },
      {
        name: 'DJ Qualls',
      },
      {
        name: 'La La Anthony',
      },
      {
        name: 'Rick Gonzalez',
      },
      {
        name: 'Jay Ellis',
      },
      {
        name: 'Macy Gray',
      },
    ],
    coverUrl: '/movies_pictures/b885b5aad82c.jpg',
    releaseDate: '2015-02-14',
    length: 94,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une femme tombe amoureuse d\'un homme atteint d\'une maladie terminale et décide de vivre pleinement chaque moment de leur relation.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Lobster',
    director: 'Yorgos Lanthimos',
    actors: [
      { name: 'Colin Farrell' },
      { name: 'Rachel Weisz' },
      { name: 'Léa Seydoux' },
      { name: 'Ben Whishaw' },
      { name: 'John C. Reilly' },
      { name: 'Olivia Colman' },
      { name: 'Ashley Jensen' },
    ],
    coverUrl: '/movies_pictures/a1f7c1e83656.jpg',
    releaseDate: '2015-10-30',
    length: 119,
    genre: ['Romance', 'Dystopie'],
    saga: '',
    description: 'Dans un monde où les célibataires doivent trouver un partenaire sous peine d\'être transformés en animaux, un homme fuit les règles absurdes de l\'amour.',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Un choix',
    director: 'Ross Katz',
    actors: [
      {
        name: 'Benjamin Walker',
      },
      {
        name: 'Teresa Palmer',
      },
      {
        name: 'Maggie Grace',
      },
      {
        name: 'Alexandra Daddario',
      },
      {
        name: 'Tom Welling',
      },
      {
        name: 'Tom Wilkinson',
      },
    ],
    coverUrl: '/movies_pictures/258147-the-choice-0-150-0-225-crop.jpg',
    releaseDate: '2016-02-05',
    length: 111,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme doit choisir entre rester avec son petit ami stable et repartir avec le premier amour revenu dans sa vie après des années d\'absence.',
    fromEntity: {
      entityType: 'book',
      title: 'Un choix',
      secondEntityKey: 'Nicholas Sparks',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'La La Land',
    director: 'Damien Chazelle',
    actors: [
      {
        name: 'Emma Stone',
      },
      {
        name: 'J. K. Simmons',
      },
      {
        name: 'Finn Wittrock',
      },
      {
        name: 'Rosemarie DeWitt',
      },
      {
        name: 'Meagen Fay',
      },
      {
        name: 'John Legend',
      },
      {
        name: 'Sonoya Mizuno',
      },
    ],
    coverUrl: '/movies_pictures/38b5c57f0991.jpg',
    releaseDate: '2016-12-09',
    length: 128,
    genre: ['Romance'],
    saga: '',
    description: 'Une actrice en devenir et un pianiste de jazz s\'éprendront à Los Angeles, mais leurs ambitions artistiques menacent de les éloigner l\'un de l\'autre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [
      { type: OscarEnum.OSCAR_BEST_DIRECTOR, year: 2017 },
      { type: OscarEnum.OSCAR_BEST_ACTRESS, year: 2017 },
      { type: OscarEnum.OSCAR_BEST_CINEMATOGRAPHY, year: 2017 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SCORE, year: 2017 },
      { type: OscarEnum.OSCAR_BEST_ORIGINAL_SONG, year: 2017 },
      { type: OscarEnum.OSCAR_BEST_PRODUCTION_DESIGN, year: 2017 },
    ],
  },
  {
    title: 'Below Her Mouth',
    director: 'April Mullen',
    actors: [
      { name: 'Erika Linder' },
      { name: 'Natalie Krill' },
      { name: 'Tomasz Kot' },
      { name: 'Mayko Nguyen' },
      { name: 'Elise Bauman' },
      { name: 'Melanie Leishman' },
      { name: 'Andrea Stefancikova' },
    ],
    coverUrl: '/movies_pictures/85913562991f.jpg',
    releaseDate: '2017-02-10',
    length: 92,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Une femme mariée tombe amoureuse d\'une ouvrière du bâtiment lors d\'une nuit torride qui bouleverse sa vie et ses certitudes.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'A Christmas Prince',
    director: 'Alex Zamm',
    actors: [
      { name: 'Rose McIver' },
      { name: 'Ben Lamb' },
      { name: 'Alice Krige' },
      { name: 'Tahirah Sharif' },
      { name: 'Honor Kneafsey' },
      { name: 'Jenny Baines' },
      { name: 'Theo Devaney' },
    ],
    coverUrl: '/movies_pictures/7cc44bcb2b2c.jpg',
    releaseDate: '2017-11-17',
    length: 92,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une journaliste se fait passer pour la tutrice du prince d\'Aldovia et tombe amoureuse de lui pendant qu\'elle enquête sur sa réputation.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Forever My Girl',
    director: 'Bethany Ashton Wolf',
    actors: [
      {
        name: 'Alex Roe',
      },
      {
        name: 'Jessica Rothe',
      },
      {
        name: 'John Benjamin Hickey',
      },
      {
        name: 'Abby Ryder Fortson',
      },
      {
        name: 'Travis Tritt',
      },
      {
        name: 'Peter Cambor',
      },
      {
        name: 'Gillian Vigman',
      },
    ],
    coverUrl: '/movies_pictures/forever_my_girl.jpg',
    releaseDate: '2018-01-19',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une star de country revient dans sa ville natale pour un enterrement et retrouve la femme qu\'il a abandonnée au moment de leur mariage.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Mon âme sœur',
    director: 'Stephanie Laing',
    actors: [
      {
        name: 'Gugu Mbatha-Raw',
      },
      {
        name: 'Michiel Huisman',
      },
      {
        name: 'Steve Coogan',
      },
      {
        name: 'Timothy Simons',
      },
      {
        name: 'Jacki Weaver',
      },
      {
        name: 'Kate McKinnon',
      },
      {
        name: 'Christopher Walken',
      },
    ],
    coverUrl: '/movies_pictures/mon_ame_soeur.jpg',
    releaseDate: '2018-02-16',
    length: 96,
    genre: ['Romance'],
    saga: '',
    description: 'Deux meilleures amies tombent amoureuses du même homme et doivent choisir entre leur amitié et leurs sentiments respectifs.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Kissing Booth',
    director: 'Vince Marcello',
    actors: [
      {
        name: 'Joey King',
      },
      {
        name: 'Jacob Elordi',
      },
      {
        name: 'Joel Courtney',
      },
      {
        name: 'Molly Ringwald',
      },
      {
        name: 'Meg Donnelly',
      },
      {
        name: 'Moses Arias',
      },
      {
        name: 'Courtney Jines',
      },
    ],
    coverUrl: '/movies_pictures/4574d8e055c3.jpg',
    releaseDate: '2018-05-11',
    length: 105,
    genre: ['Romance', 'Comédie'],
    saga: 'The Kissing Booth',
    description: 'Elle tombe amoureuse du meilleur ami de son frère aîné, malgré la règle interdisant de fréquenter les amis de la famille.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Kissing Booth 2',
    director: 'Vince Marcello',
    actors: [
      {
        name: 'Joey King',
      },
      {
        name: 'Joel Courtney',
      },
      {
        name: 'Jacob Elordi',
      },
      {
        name: 'Maisie Richardson-Sellers',
      },
      {
        name: 'Molly Ringwald',
      },
      {
        name: 'Meganne Young',
      },
    ],
    coverUrl: '/movies_pictures/0527531.webp',
    releaseDate: '2020-07-24',
    length: 132,
    genre: ['Romance', 'Comédie'],
    saga: 'The Kissing Booth',
    description: 'Elle part à Boston pour ses études pendant que son petit ami s\'éloigne, et doit gérer jalousie, nouveaux crushs et le retour du kissing booth.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Kissing Booth 3',
    director: 'Vince Marcello',
    actors: [
      {
        name: 'Joey King',
      },
      {
        name: 'Joel Courtney',
      },
      {
        name: 'Jacob Elordi',
      },
      {
        name: 'Taylor Zakhar Perez',
      },
      {
        name: 'Maisie Richardson-Sellers',
      },
      {
        name: 'Meganne Young',
      },
      {
        name: 'Molly Ringwald',
      },
    ],
    coverUrl: '/movies_pictures/852d674b3e4a.jpg',
    releaseDate: '2021-08-11',
    length: 113,
    genre: ['Comédie', 'Romance'],
    saga: 'The Kissing Booth',
    description: 'Elle doit choisir entre deux universités et deux avenirs amoureux pendant un dernier été entre amis avant la séparation.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Petits coups montés',
    director: 'Claire Scanlon',
    actors: [
      {
        name: 'Zoey Deutch',
      },
      {
        name: 'Lucy Liu',
      },
      {
        name: 'Glen Powell',
      },
      {
        name: 'Taye Diggs',
      },
      {
        name: 'Pete Davidson',
      },
      {
        name: 'Joan Smalls',
      },
      {
        name: 'Jon Rudnitsky',
      },
    ],
    coverUrl: '/movies_pictures/319550-set-it-up-0-150-0-225-crop.jpg',
    releaseDate: '2018-06-15',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Deux assistants exécutifs rivaux s\'allient pour piéger leurs patrons exigeants et les pousser à rompre, mais le plan les rapproche plus qu\'ils ne l\'imaginaient.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "À tous les garçons que j'ai aimés",
    director: 'Susan Johnson',
    actors: [
      { name: 'Lana Condor' },
      { name: 'Noah Centineo' },
      { name: 'Janel Parrish' },
      { name: 'Anna Cathcart' },
      { name: 'John Corbett' },
      { name: 'Israel Broussard' },
      { name: 'Madeleine Arthur' },
    ],
    coverUrl: '/movies_pictures/to_all_the_boys_i_ve_loved_before.jpg',
    releaseDate: '2018-08-17',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: 'Les lettres d\'amour secrètes de Lara Jean sont envoyées par accident à ses anciens crushs, bouleversant sa vie lycéenne et ses sentiments.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Noël à Pemberley',
    director: 'Colin Theys',
    actors: [
      { name: 'Jessica Lowndes' },
      { name: 'Michael Rady' },
      { name: 'Carmen Lauzetta' },
      { name: 'Kayla Wallace' },
      { name: 'Bruce Blain' },
      { name: 'Meredith Thomas' },
      { name: 'Colby Johannson' },
    ],
    coverUrl: '/movies_pictures/89474d12ea02.jpg',
    releaseDate: '2018-11-02',
    length: 84,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une écrivaine spécialisée dans les romans de Jane Austen retourne dans sa ville natale à Noël et retrouve un amour de jeunesse devenu architecte.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'The Princess Switch',
    director: 'Mike Rohl',
    actors: [
      {
        name: 'Vanessa Hudgens',
      },
      {
        name: 'Sam Palladio',
      },
      {
        name: 'Sara Stewart',
      },
      {
        name: 'Suanne Braun',
      },
    ],
    coverUrl:
      '/movies_pictures/485841-the-princess-switch-0-150-0-225-crop.jpg',
    releaseDate: '2018-11-16',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Une pâtissière de Chicago et une princesse montovienne se ressemblent comme deux gouttes d\'eau et échangent leurs rôles pour une semaine.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Mon inconnue',
    director: 'Hugo Gélin',
    actors: [
      {
        name: 'Francois Civil',
      },
      {
        name: 'Josephine Japy',
      },
      {
        name: 'Benjamin Lavernhe',
      },
      {
        name: 'Edith Scob',
      },
      {
        name: 'Camille Lellouche',
      },
      {
        name: 'Samir Boitard',
      },
      {
        name: 'Aude Pepin',
      },
    ],
    coverUrl: '/movies_pictures/c92fb64760bb.webp',
    releaseDate: '2019-01-30',
    length: 118,
    genre: ['Romance'],
    saga: '',
    description: 'Un architecte retrouve son ex-petite amie dans un vol Paris-New York, mais elle ne se souvient plus de lui après un accident qui a effacé ses souvenirs.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'The Perfect Date',
    director: 'Chris Nelson',
    actors: [
      {
        name: 'Laura Marano',
      },
      {
        name: 'Noah Centineo',
      },
      {
        name: 'Camila Mendes',
      },
      {
        name: 'Matt Walsh',
      },
      {
        name: 'Wayne Pére',
      },
    ],
    coverUrl: '/movies_pictures/3028326.webp',
    releaseDate: '2019-04-12',
    length: 89,
    genre: ['Romance'],
    saga: '',
    description: 'Un lycéen propose ses services comme faux petit ami et développe de vrais sentiments pour une cliente, tout en gérant d\'autres missions.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Falling Inn Love',
    director: 'Roger Kumble',
    actors: [
      { name: 'Christina Milian' },
      { name: 'Adam Demos' },
      { name: 'Jay Phirho' },
      { name: 'Anna Jullienne' },
      { name: 'Christian Kane' },
      { name: 'James Beaumont' },
      { name: 'Daniel Bess' },
    ],
    coverUrl: '/movies_pictures/6b272b78951a.jpg',
    releaseDate: '2019-08-29',
    length: 98,
    genre: ['Romance', 'Comédie'],
    saga: '',
    description: 'Une city girl hérite d\'une auberge néo-zélandaise et tombe amoureuse du charpentier local qui l\'aide à rénover le lieu.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Last Christmas',
    director: 'Paul Feig',
    actors: [
      {
        name: 'Emilia Clarke',
      },
      {
        name: 'Henry Golding',
      },
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Michelle Yeoh',
      },
      {
        name: 'Rebecca Root',
      },
      {
        name: 'Patti LuPone',
      },
      {
        name: 'Lydia Leonard',
      },
    ],
    coverUrl: '/movies_pictures/477863-last-christmas-0-150-0-225-crop.jpg',
    releaseDate: '2019-11-08',
    length: 103,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme désabusée tombe amoureuse d\'un homme énigmatique pendant les fêtes, alors qu\'elle tente de reprendre pied après une greffe du cœur.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'La Belle et le Clochard',
    director: 'Charlie Bean',
    actors: [
      {
        name: 'Tessa Thompson',
      },
      {
        name: 'Justin Theroux',
      },
      {
        name: 'Thomas Mann',
      },
      {
        name: 'Kiersey Clemons',
      },
      {
        name: 'Ashley Jensen',
      },
      {
        name: 'Sam Elliott',
      },
      {
        name: 'Yvette Nicole Brown',
      },
    ],
    coverUrl: '/movies_pictures/1278031.jpg',
    releaseDate: '2019-11-12',
    length: 103,
    genre: ['Romance', 'Jeunesse'],
    saga: '',
    description: 'Lady, cocker spaniel raffinée, rencontre Tramp, chien errant libre, et découvre l\'amour au-delà des différences de milieu dans un Paris canin.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: "À tous les garçons : P.S. Je t'aime toujours",
    director: 'Michael Fimognari',
    actors: [
      {
        name: 'Lana Condor',
      },
      {
        name: 'Noah Centineo',
      },
      {
        name: 'Jordan Fisher',
      },
      {
        name: 'Anna Cathcart',
      },
      {
        name: 'John Corbett',
      },
      {
        name: 'Sarayu Blue',
      },
      {
        name: 'Janel Parrish',
      },
    ],
    coverUrl: '/movies_pictures/5599609.webp',
    releaseDate: '2020-02-12',
    length: 102,
    genre: ['Romance', 'Comédie'],
    saga: 'A Tous les Garçons',
    description: 'Lara Jean découvre que Peter a peut-être encore des sentiments pour son ex pendant qu\'un autre garçon lui déclare sa flamme.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'À tous les garçons : Pour toujours et à jamais',
    director: 'Michael Fimognari',
    actors: [
      {
        name: 'Lana Condor',
      },
      {
        name: 'Noah Centineo',
      },
      {
        name: 'Janel Parrish',
      },
      {
        name: 'Anna Cathcart',
      },
      {
        name: 'Madeleine Arthur',
      },
      {
        name: 'Emilija Baranac',
      },
      {
        name: 'Sarayu Blue',
      },
    ],
    coverUrl: '/movies_pictures/2398485.webp',
    releaseDate: '2021-02-12',
    length: 115,
    genre: ['Romance', 'Comédie'],
    saga: 'A Tous les Garçons',
    description: 'Lara Jean et Peter affrontent la fin du lycée et le choix des universités, qui menace leur relation à long terme.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Isi & Ossi',
    director: 'Oliver Kienle',
    actors: [
      { name: 'Lisa Vicari' },
      { name: 'Dennis Mojen' },
      { name: 'Lisa Hagmeister' },
      { name: 'Walid Al-Atiyat' },
      { name: 'Anke Engelke' },
      { name: 'Stephan Luca' },
      { name: 'Almila Bagriacik' },
    ],
    coverUrl: '/movies_pictures/584262-isi-ossi-0-150-0-225-crop.jpg',
    releaseDate: '2020-02-14',
    length: 113,
    genre: ['Romance'],
    saga: '',
    description: 'Une héritière et un boxeur fauché simulent un couple pour satisfaire leurs familles respectives, mais le mensonge devient une vraie complicité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Emma.',
    director: 'Autumn de Wilde',
    actors: [
      {
        name: 'Anya Taylor-Joy',
      },
      {
        name: 'Johnny Flynn',
      },
      {
        name: 'Bill Nighy',
      },
      {
        name: 'Mia Goth',
      },
      {
        name: 'Miranda Hart',
      },
      {
        name: "Josh O'Connor",
      },
      {
        name: 'Callum Turner',
      },
    ],
    coverUrl: '/movies_pictures/5725926.webp',
    releaseDate: '2020-02-14',
    length: 124,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Emma Woodhouse, jeune femme intelligente et impertinente, s\'immisce dans la vie amoureuse de son entourage avant de découvrir ses propres sentiments.',
    fromEntity: {
      entityType: 'book',
      title: 'Emma',
      secondEntityKey: 'Jane Austen',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Love Wedding Repeat',
    director: 'Dean Craig',
    actors: [
      {
        name: 'Sam Claflin',
      },
      {
        name: 'Olivia Munn',
      },
      {
        name: 'Eleanor Tomlinson',
      },
      {
        name: 'Freida Pinto',
      },
      {
        name: 'Joel Fry',
      },
      {
        name: 'Jack Farthing',
      },
      {
        name: 'Allan Mustafa',
      },
    ],
    coverUrl: '/movies_pictures/3931365.webp',
    releaseDate: '2020-04-10',
    length: 100,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Lors d\'un mariage, une maladie, des ex et des malentendus font dérailler le week-end, revu sous plusieurs versions d\'une même journée.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Rich in Love',
    director: 'Bruno Garotti',
    actors: [
      { name: 'Maisa Silva' },
      { name: 'Danilo Mesquita' },
      { name: 'Giovanna Lancellotti' },
      { name: 'Ivete Sangalo' },
      { name: 'José Rubens Chachá' },
      { name: 'Vanessa Lóes' },
      { name: 'Igor Jansen' },
    ],
    coverUrl: '/movies_pictures/582011-rich-in-love-0-150-0-225-crop.jpg',
    releaseDate: '2020-06-19',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme découvre que son père a une seconde famille et s\'installe chez eux au Brésil, où l\'amour et la réconciliation s\'entremêlent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Rebecca',
    director: 'Ben Wheatley',
    actors: [
      {
        name: 'Lily James',
      },
      {
        name: 'Armie Hammer',
      },
      {
        name: 'Kristin Scott Thomas',
      },
      {
        name: 'Keeley Hawes',
      },
      {
        name: 'Ann Dowd',
      },
      {
        name: 'Sam Riley',
      },
      {
        name: 'Tom Goodman-Hill',
      },
    ],
    coverUrl: '/movies_pictures/3328407.webp',
    releaseDate: '2020-10-21',
    length: 123,
    genre: ['Romance', 'Thriller'],
    saga: '',
    description: 'Une jeune épouse hantée par l\'ombre de Rebecca, première femme de son mari, découvre des secrets sombres dans le manoir de Manderley.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Holidate',
    director: 'John Whitesell',
    actors: [
      {
        name: 'Emma Roberts',
      },
      {
        name: 'Luke Bracey',
      },
      {
        name: 'KingBach',
      },
      {
        name: 'Jessica Capshaw',
      },
      {
        name: 'Manish Dayal',
      },
      {
        name: 'Alex Moffat',
      },
      {
        name: 'Jake Manley',
      },
    ],
    coverUrl: '/movies_pictures/542464-holidate-0-150-0-225-crop.jpg',
    releaseDate: '2020-10-28',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Deux célibataires en manque de plan de Saint-Valentin s\'associent pour assister ensemble aux fêtes de fin d\'année et finissent par s\'attacher.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Princess Switch : Switched Again',
    director: 'Mike Rohl',
    actors: [
      {
        name: 'Vanessa Hudgens',
      },
      {
        name: 'Sam Palladio',
      },
      {
        name: 'Nick Sagar',
      },
      {
        name: 'Suanne Braun',
      },
      {
        name: 'Mark Fleischmann',
      },
      {
        name: 'Ricky Norwood',
      },
      {
        name: 'Lachlan Nieboer',
      },
    ],
    coverUrl:
      '/movies_pictures/569812-the-princess-switch-switched-again-0-150-0-225-crop.jpg',
    releaseDate: '2020-11-19',
    length: 97,
    genre: ['Romance'],
    saga: '',
    description: 'Stacy, princesse par le mariage, retrouve sa sosie et une troisième look-alike lors d\'une cérémonie de couronnement pleine de quiproquos romantiques.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'Amour puissance mille",
    director: 'Filip Zylber',
    actors: [
      { name: 'Adrianna Chlebicka' },
      { name: 'Mikolaj Roznerski' },
      { name: 'Wojciech Solarz' },
    ],
    coverUrl: '/movies_pictures/2b3c67229ef5.jpg',
    releaseDate: '2021-02-11',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Un jeune couple polonais lutte contre la maladie et la distance pour préserver leur amour, entre sacrifices, espoir et épreuves du quotidien.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'La Dernière Lettre de son amant',
    director: 'Augustine Frizzell',
    actors: [
      {
        name: 'Shailene Woodley',
      },
      {
        name: 'Felicity Jones',
      },
      {
        name: 'Diana Kent',
      },
      {
        name: 'Callum Turner',
      },
      {
        name: 'Ben Cross',
      },
      {
        name: 'Nabhaan Rizwan',
      },
      {
        name: 'Joe Alwyn',
      },
    ],
    coverUrl: '/movies_pictures/3914070.webp',
    releaseDate: '2021-07-23',
    length: 110,
    genre: ['Romance'],
    saga: '',
    description: 'Une journaliste enquête sur une lettre d\'amour trouvée dans les ruines d\'un immeuble et reconstitue une passion secrète des années 1960.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'Amour complexe",
    director: 'Steven Tsuchida',
    actors: [
      { name: 'Christina Milian' },
      { name: 'Jay Pharoah' },
      { name: 'Sinqua Walls' },
      { name: 'Kym Whitley' },
      { name: 'Tymberlee Hill' },
      { name: 'AnnaLynne McCord' },
      { name: 'Lonnie Chavis' },
    ],
    coverUrl: '/movies_pictures/704151-resort-to-love-0-150-0-225-crop.jpg',
    releaseDate: '2021-07-29',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Une artiste et un célèbre chef s\'affrontent lors d\'un concours culinaire télévisé où rivalité professionnelle cède la place à l\'attirance.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "He's All That",
    director: 'Mark Waters',
    actors: [
      {
        name: 'Addison Rae',
      },
      {
        name: 'Tanner Buchanan',
      },
      {
        name: 'Madison Pettis',
      },
      {
        name: 'Matthew Lillard',
      },
      {
        name: 'Rachael Leigh Cook',
      },
      {
        name: 'Peyton Meyer',
      },
      {
        name: 'Isabella Crovetti',
      },
    ],
    coverUrl: '/movies_pictures/p19885745_v_v12_ab.jpg',
    releaseDate: '2021-08-27',
    length: 88,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une influenceuse humiliée par son ex transforme un lycéen discret en relooking total pour le présenter au bal de promo et regagner sa popularité.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Friendzone',
    director: 'Charles Van Tieghem',
    actors: [
      { name: 'Mickaël Lumière' },
      { name: 'Manon Azem' },
      { name: 'Constance Arnoult' },
      { name: 'Yvick Letexier' },
      { name: 'Diane Robert' },
      { name: 'Helena Coppejans' },
      { name: 'Jean-Édouard Bodziak' },
    ],
    coverUrl: '/movies_pictures/7e4e7b1969cd.jpg',
    releaseDate: '2021-09-29',
    length: 88,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Thibault aime secrètement sa meilleure amie depuis l\'enfance, mais elle ne le voit que comme un frère jusqu\'à ce qu\'un voyage change la donne.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Love Hard',
    director: 'Hernán Jiménez',
    actors: [
      {
        name: 'Nina Dobrev',
      },
      {
        name: 'Jimmy Ouyang',
      },
      {
        name: 'Darren Barnet',
      },
      {
        name: 'Harry Shum Jr',
      },
      {
        name: 'James Saito',
      },
      {
        name: 'Mikaela Hoover',
      },
      {
        name: 'Lochlyn Munro',
      },
    ],
    coverUrl: '/movies_pictures/656542-love-hard-0-150-0-225-crop.jpg',
    releaseDate: '2021-11-05',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme part à la rencontre d\'un homme rencontré en ligne à Noël et découvre qu\'il l\'a séduite avec de fausses photos, mais une vraie complicité naît.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The Princess Switch 3: Romancing the Star',
    director: 'Mike Rohl',
    actors: [
      {
        name: 'Vanessa Hudgens',
      },
      {
        name: 'Remy Hii',
      },
      {
        name: 'Sam Palladio',
      },
      {
        name: 'Nick Sagar',
      },
      {
        name: 'Amanda Donohoe',
      },
      {
        name: 'Ricky Norwood',
      },
      {
        name: 'Suanne Braun',
      },
    ],
    coverUrl: '/movies_pictures/The_Princess_Switch_3.jpg',
    releaseDate: '2021-11-18',
    length: 107,
    genre: ['Romance'],
    saga: '',
    description: 'Margaret doit retrouver une relique volée avec l\'aide de Stacy et d\'une sosie, dans une aventure royale où les sentiments se compliquent.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Cyrano',
    director: 'Joe Wright',
    actors: [
      { name: 'Peter Dinklage' },
      { name: 'Haley Bennett' },
      { name: 'Kelvin Harrison Jr.' },
      { name: 'Ben Mendelsohn' },
      { name: 'Bashir Salahuddin' },
    ],
    coverUrl: '/movies_pictures/4aa2dbf1d812.jpg',
    releaseDate: '2021-12-31',
    length: 124,
    genre: ['Romance', 'Drame', 'Comédie musicale', 'Historique'],
    saga: '',
    description:
      'Adaptation musicale où Cyrano de Bergerac, interprété par Peter Dinklage, aime Roxane en secret et prête ses mots à Christian pour la séduire, prisonnier de son image de lui.',
    fromEntity: {
      entityType: 'book',
      title: 'Cyrano de Bergerac',
      secondEntityKey: 'Edmond Rostand',
    },
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'À Travers Ma Fenêtre',
    director: 'Marçal Forés',
    actors: [
      {
        name: 'Clara Galle',
      },
      {
        name: 'Julio Peña Fernandez',
      },
      {
        name: 'Eric Masip',
      },
      {
        name: 'Hugo Arbués',
      },
      {
        name: 'Guillermo Lasheras',
      },
      {
        name: 'Pilar Castro',
      },
    ],
    coverUrl: '/movies_pictures/735239-through-my-window-0-150-0-225-crop.jpg',
    releaseDate: '2022-02-04',
    length: 113,
    genre: ['Romance'],
    saga: '',
    description: 'Une lycéenne espionne son voisin par la fenêtre et entame une relation secrète avec lui malgré les interdits familiaux et sociaux.',
    fromEntity: {
      entityType: 'book',
      title: 'À Travers Ma Fenêtre',
      secondEntityKey: 'Ariana Godoy',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'The In-between',
    director: 'Arie Posin',
    actors: [
      {
        name: 'Joey King',
      },
      {
        name: 'Kyle Allen',
      },
      {
        name: 'Kim Dickens',
      },
      {
        name: 'John Ortiz',
      },
      {
        name: "Celeste O'Connor",
      },
      {
        name: 'Donna Biscoe',
      },
      {
        name: 'April Parker Jones',
      },
    ],
    coverUrl: '/movies_pictures/735089-the-in-between-0-150-0-225-crop.jpg',
    releaseDate: '2022-02-11',
    length: 116,
    genre: ['Romance'],
    saga: '',
    description: 'Une adolescente en deuil croise le fantôme de son père défunt et apprend à avancer grâce à une amitié qui la pousse à embrasser la vie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Un Accord Parfait',
    director: 'Stuart McDonald',
    actors: [
      { name: 'Victoria Justice' },
      { name: 'Adam Demos' },
      { name: 'Lucy Durack' },
      { name: 'Craig Horner' },
      { name: 'Samuel Johnson' },
      { name: 'Toby Truslove' },
      { name: 'Susan Prior' },
    ],
    coverUrl: '/movies_pictures/839735-a-perfect-pairing-0-150-0-225-crop.jpg',
    releaseDate: '2022-05-19',
    length: 101,
    genre: ['Romance'],
    saga: '',
    description: 'Une musicienne classique et un rockeur excentrique sont contraints de collaborer sur une chanson de mariage et découvrent une alchimie inattendue.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'Amour en touriste",
    director: 'David Wnendt',
    actors: [
      {
        name: 'Rachael Leigh Cook',
      },
      {
        name: 'Scott Ly',
      },
      {
        name: 'Missi Pyle',
      },
      {
        name: 'Ben Feldman',
      },
      {
        name: 'Glynn Sweet',
      },
      {
        name: 'Alexa Povah',
      },
      {
        name: 'Jacqueline Correa',
      },
    ],
    coverUrl: '/movies_pictures/1147458.webp',
    releaseDate: '2022-06-08',
    length: 96,
    genre: ['Romance'],
    saga: '',
    description: 'Une Allemande en vacances à Hamburg tombe amoureuse d\'un guide local et doit choisir entre retourner chez elle et suivre son cœur.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Hello, adieu, et nous au milieu',
    director: 'Michael Lewen',
    actors: [
      { name: 'Talia Ryder' },
      { name: 'Jordan Fisher' },
      { name: 'Ayo Edebiri' },
      { name: 'Nico Hiraga' },
      { name: 'Julia Benson' },
      { name: 'Artemis Anastasiadis' },
      { name: 'Sophia Reid-Gantzert' },
    ],
    coverUrl:
      '/movies_pictures/666928-hello-goodbye-and-everything-in-between-0-150-0-225-crop.jpg',
    releaseDate: '2022-07-06',
    length: 91,
    genre: ['Romance'],
    saga: '',
    description: 'Un couple en crise décide de se séparer mais continue de vivre sous le même toit, oscillant entre rupture, jalousie et attachement persistant.',
    fromEntity: {
      entityType: 'book',
      title: 'Hello Goodbye and Everything in Between',
      secondEntityKey: 'Jamie McGuire',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Nos coeurs meurtris',
    director: 'Elizabeth Allen Rosenbaum',
    actors: [
      {
        name: 'Sofia Carson',
      },
      {
        name: 'Nicholas Galitzine',
      },
      {
        name: 'Chosen Jacobs',
      },
      {
        name: 'John Kim',
      },
      {
        name: 'Katrina Cunningham',
      },
      {
        name: 'Linden Ashby',
      },
      {
        name: 'Anthony Ippolito',
      },
    ],
    coverUrl: '/movies_pictures/9b9884d67773.jpg',
    releaseDate: '2022-07-29',
    length: 122,
    genre: ['Romance'],
    saga: '',
    description: 'Deux adolescents atteints de maladies cardiaques se rencontrent en cure et vivent un amour intense malgré la fragilité de leurs corps.',
    fromEntity: {
      entityType: 'book',
      title: 'Nos cœurs meurtris',
      secondEntityKey: 'Tess Wakefield',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Tout le Bleu du Ciel',
    director: 'João Canijo',
    actors: [
      { name: 'Rita Blanco' },
      { name: 'Anabela Moreira' },
      { name: 'Cleia Almeida' },
      { name: 'Vera Barreto' },
      { name: 'Madalena Almeida' },
      { name: 'Beatriz Batarda' },
      { name: 'Lia Carvalho' },
    ],
    coverUrl:
      '/movies_pictures/1307347-tout-le-bleu-du-ciel-2025-0-150-0-225-crop.jpg',
    releaseDate: '2022-09-08',
    length: 127,
    genre: ['Drame', 'Romance'],
    saga: '',
    description: 'Une jeune femme découvre que son mari cache une double vie et doit reconstruire son existence en affrontant vérité, culpabilité et désir de recommencer.',
    fromEntity: {
      entityType: 'book',
      title: 'Tout le bleu du ciel',
      secondEntityKey: 'Mélissa Da Costa',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "Par-delà l'univers",
    director: 'Diego Freitas',
    actors: [
      {
        name: 'Giulia Be',
      },
      {
        name: 'Henry Zaga',
      },
      {
        name: 'João Miguel',
      },
      {
        name: 'Othon Bastos',
      },
      {
        name: 'Viviane Araújo',
      },
      {
        name: 'Denise Del Vecchio',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BYWMxOGIyODMtMGMyMi00ODYzLWIwNTAtYWE5YjAwNzE1OWZkXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2022-10-27',
    length: 127,
    genre: ['Romance'],
    saga: '',
    description: 'Une pianiste prodige atteinte d\'une maladie dégénérative tombe amoureuse d\'un astronaute dont la mission l\'éloigne de la Terre.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Un Noël en Californie',
    director: 'Shawn Seet',
    actors: [
      {
        name: 'Lauren Swickard',
      },
      {
        name: 'Josh Swickard',
      },
      {
        name: 'Ali Afshar',
      },
      {
        name: 'David Del Rio',
      },
      {
        name: 'Amanda Detmer',
      },
      {
        name: 'Julie Lancaster',
      },
      {
        name: 'Gunnar Anderson',
      },
    ],
    coverUrl: '/movies_pictures/5951216.webp',
    releaseDate: '2022-11-11',
    length: 106,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme retourne dans sa ville natale à Noël et retrouve son amour de lycée, entre traditions familiales et seconde chance sentimentale.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Ce sera toi',
    director: 'Alauda Ruiz de Azúa',
    actors: [
      {
        name: 'Álvaro Cervantes',
      },
      {
        name: 'Silvia Alonso',
      },
      {
        name: 'Susana Abaitua',
      },
      {
        name: 'Pilar Castro',
      },
    ],
    coverUrl: '/movies_pictures/735234-love-at-first-kiss-0-150-0-225-crop.jpg',
    releaseDate: '2023-02-10',
    length: 103,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme revient dans sa ville natale et retrouve son amour de lycée, entre souvenirs d\'enfance et choix qui ont séparé leurs chemins.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Joli Désastre',
    director: 'Roger Kumble',
    actors: [
      { name: 'Dylan Sprouse' },
      { name: 'Virginia Gardner' },
      { name: 'Autumn Reeser' },
      { name: 'Brian Austin Green' },
      { name: 'Nicole Forester' },
      { name: 'Hunter Dolton' },
      { name: 'Tyler Chase' },
    ],
    coverUrl: '/movies_pictures/be0b2edd53b2.jpg',
    releaseDate: '2023-04-13',
    length: 96,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme en plein divorce croise un homme charmant lors d\'un voyage de groupe, mais leurs vies compliquées rendent l\'idylle difficile à concrétiser.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Love again: un peu, beaucoup, passionnément',
    director: 'James C. Strouse',
    actors: [
      {
        name: 'Priyanka Chopra Jonas',
      },
      {
        name: 'Sam Heughan',
      },
      {
        name: 'Celine Dion',
      },
      {
        name: 'Sofia Barclay',
      },
      {
        name: 'Russell Tovey',
      },
      {
        name: 'Lydia West',
      },
      {
        name: 'Steve Oram',
      },
    ],
    coverUrl: '/movies_pictures/3006482.jpg',
    releaseDate: '2023-06-07',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme en deuil envoie des textos au numéro de son défunt fiancé, reçus par un journaliste qui finit par tomber amoureux d\'elle.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "La Probabilité statistique de l'amour au premier regard",
    director: 'Vanessa Caswill',
    actors: [
      {
        name: 'Haley Lu Richardson',
      },
      {
        name: 'Ben Hardy',
      },
      {
        name: 'Dexter Fletcher',
      },
      {
        name: 'Rob Delaney',
      },
      {
        name: 'Sally Phillips',
      },
      {
        name: 'Tom Taylor',
      },
      {
        name: 'Jessica Ransom',
      },
    ],
    coverUrl: '/movies_pictures/1146306_300x450.webp',
    releaseDate: '2023-09-15',
    length: 91,
    genre: ['Romance'],
    saga: '',
    description: 'Après avoir échangé leurs numéros dans un train, Hadley et Oliver se cherchent à New York et se demandent si le hasard peut fonder une vraie histoire.',
    fromEntity: {
      entityType: 'book',
      title: "La Probabilité statistique de l'amour au premier regard",
      secondEntityKey: 'Jennifer E. Smith',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Au plaisir de se faire trahir',
    director: 'Diego Freitas',
    actors: [
      {
        name: 'Giovanna Lancellotti',
      },
      {
        name: 'Leandro Lima',
      },
      {
        name: 'Camilla de Lucas',
      },
      {
        name: 'Bruno Montaleone',
      },
      {
        name: 'Micael Borges',
      },
      {
        name: 'Louise D&#39;Tuani',
      },
      {
        name: 'Drayson Menezzes',
      },
    ],
    coverUrl: '/movies_pictures/1060546-burning-betrayal-0-150-0-225-crop.jpg',
    releaseDate: '2023-10-25',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme découvre que son compagnon la trompe et décide de le piéger en organisant une fausse infidélité pour tester sa réaction.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Dernier appel pour Istanbul',
    director: 'Ömer Faruk Sorak',
    actors: [
      {
        name: 'Beren Saat',
      },
      {
        name: 'Kıvanç Tatlıtuğ',
      },
      {
        name: 'Senan Kara',
      },
      {
        name: 'Zihan Zhao',
      },
      {
        name: 'Michael Loayza',
      },
      {
        name: 'Susan Slatin',
      },
      {
        name: 'Annie McCain Engman',
      },
    ],
    coverUrl:
      '/movies_pictures/aHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvL29yaWdpbmFsLy8xbldMTlhDV245UDV1WFdvNHBTZXgxVjlwRm8uanBn.webp',
    releaseDate: '2023-11-17',
    length: 91,
    genre: ['Romance'],
    saga: '',
    description: 'Deux étrangers se rencontrent lors d\'une nuit d\'escale à Istanbul et partagent leurs secrets avant de reprendre chacun leur vol.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'Maintenance Required',
    director: 'Lacey Uhlemeyer',
    actors: [
      {
        name: 'Madelaine Petsch',
      },
      {
        name: 'Jacob Scipio',
      },
      {
        name: 'Madison Bailey',
      },
      {
        name: 'Katy O’Brian',
      },
      {
        name: 'Inanna Sarkis',
      },
      {
        name: 'Matteo Lane',
      },
      {
        name: 'Jim Gaffigan',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BNGZlN2Y5ZGEtMmU0MS00ZWI0L_FMjpg_UX1000_.jpg',
    releaseDate: '2024-01-01',
    length: 95,
    genre: ['Drame', 'Romance'],
    saga: '',
    description: 'Une mécanicienne indépendante tombe amoureuse d\'un client charismatique qui menace de faire fermer son garage familial.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'My Oxford Year',
    director: 'Sarah Treem',
    actors: [
      {
        name: 'Sofia Carson',
      },
      {
        name: 'Corey Mylchreest',
      },
      {
        name: 'Dougray Scott',
      },
      {
        name: 'Catherine McCormack',
      },
      {
        name: 'Harry Trevaldwyn',
      },
      {
        name: 'Hugh Coles',
      },
      {
        name: 'Poppy Gilbert',
      },
    ],
    coverUrl: '/movies_pictures/f1c06582c665ba69d863934d8b176d25.jpg',
    releaseDate: '2024-01-01',
    length: 113,
    genre: ['Romance'],
    saga: '',
    description: 'Une Américaine part étudier à Oxford et tombe amoureuse d\'un Britannique dont la vie cache des secrets qui remettent en cause leur avenir.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'La carte qui mène à toi',
    director: 'Lasse Hallström',
    actors: [
      {
        name: 'Madelyn Cline',
      },
      {
        name: 'KJ Apa',
      },
      {
        name: 'Sofia Wylie',
      },
      {
        name: 'Madison Thompson',
      },
      {
        name: 'Josh Lucas',
      },
    ],
    coverUrl: '/movies_pictures/1254072.webp',
    releaseDate: '2024-01-01',
    length: 100,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme suit une série de cartes postales laissées par sa défunte mère et rencontre un homme qui l\'aide à comprendre le message final.',
    fromEntity: {
      entityType: 'book',
      title: "La carte qui mène jusqu'à toi",
      secondEntityKey: 'Joseph Monninger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'amour au présent",
    director: 'John Crowley',
    actors: [
      {
        name: 'Andrew Garfield',
      },
      {
        name: 'Florence Pugh',
      },
      {
        name: 'Adam James',
      },
      {
        name: 'Marama Corlett',
      },
      {
        name: 'Aoife Hinds',
      },
    ],
    coverUrl: '/movies_pictures/we_live_in_time.jpg',
    releaseDate: '2024-01-01',
    length: 108,
    genre: ['Romance'],
    saga: '',
    description: 'Une photographe new-yorkaise tombe amoureuse d\'un homme dont la vie semble trop parfaite, jusqu\'à ce que le passé remonte à la surface.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Fly Me to the Moon',
    director: 'Greg Berlanti',
    actors: [
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Jim Rash',
      },
      {
        name: 'Anna Garcia',
      },
    ],
    coverUrl: '/movies_pictures/fly_me_to_the_moon.jpg',
    releaseDate: '2024-01-01',
    length: 132,
    genre: ['Romance'],
    saga: '',
    description: 'Dans les années 1960, une publicitaire est chargée de vendre la mission Apollo au public et flirte avec un lanceur NASA sceptique.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: "L'amour ouf",
    director: 'Gilles Lellouche',
    actors: [
      {
        name: 'François Civil',
      },
      {
        name: 'Adèle Exarchopoulos',
      },
      {
        name: 'Mallory Wanecque',
      },
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Benoît Poelvoorde',
      },
      {
        name: 'Vincent Lacoste',
      },
      {
        name: 'Jean-Pascal Zadi',
      },
    ],
    coverUrl: '/movies_pictures/4d3324dc3860.jpg',
    releaseDate: '2024-01-31',
    length: 160,
    genre: ['Romance', 'Drame'],
    saga: '',
    description: 'Jackie et Clotaire, amants adolescents des années 1980, se retrouvent des décennies plus tard et mesurent ce que leur passion dévorante a laissé derrière elle.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'Prise au jeu',
    director: 'Trish Sie',
    actors: [
      {
        name: 'Gina Rodriguez',
      },
      {
        name: 'Damon Wayans Jr.',
      },
      {
        name: 'Tom Ellis',
      },
      {
        name: 'Augustus Prew',
      },
      {
        name: 'Joel Courtney',
      },
      {
        name: 'Liza Koshy',
      },
      {
        name: 'Jerry Kernion',
      },
    ],
    coverUrl: '/movies_pictures/1133774.webp',
    releaseDate: '2024-02-14',
    length: 105,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme piégée dans une arnaque sentimentale en ligne part à la recherche de l\'homme qui l\'a dupée, mais découvre une vérité inattendue.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: "L'idée d'être avec toi",
    director: 'Michael Showalter',
    actors: [
      { name: 'Anne Hathaway' },
      { name: 'Nicholas Galitzine' },
      { name: 'Ella Rubin' },
      { name: 'Annie Mumolo' },
      { name: 'Reid Scott' },
      { name: 'Perry Mattfeld' },
      { name: 'Jordan Aaron Hall' },
    ],
    coverUrl: '/movies_pictures/d5b4d0f9fa2a.png',
    releaseDate: '2024-05-02',
    length: 115,
    genre: ['Romance'],
    saga: '',
    description: 'Une femme de quarante ans tombe amoureuse du fils de son ex-petit ami lors d\'une réunion de lycée, remettant en question ses choix de vie.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Demain est un autre jour',
    director: 'Liz W. Garcia',
    actors: [
      {
        name: 'Sofia Carson',
      },
      {
        name: 'Sebastian de Souza',
      },
      {
        name: 'Connie Britton',
      },
      {
        name: 'Kyle Allen',
      },
      {
        name: 'José Zúñiga',
      },
      {
        name: 'Jordi Mollà',
      },
      {
        name: 'Marriane Rendón',
      },
    ],
    coverUrl: '/movies_pictures/de3f80f84a41.png',
    releaseDate: '2024-07-18',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme découvre qu\'elle peut remonter le temps pour corriger ses erreurs amoureuses, mais chaque changement bouleverse sa vie de façon imprévisible.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'À contre-sens 2',
    director: 'Domingo González',
    actors: [
      { name: 'Gabriel Guevara' },
      { name: 'Nicole Wallace' },
      { name: 'Marta Hazas' },
      { name: 'Iván Sánchez' },
      { name: 'Victor Varo' },
      { name: 'Gabriela Andrada' },
      { name: 'Fernando Solís' },
    ],
    coverUrl: '/movies_pictures/97fb32eb72ab.jpg',
    releaseDate: '2024-10-25',
    length: 118,
    genre: ['Romance'],
    saga: '',
    description: 'Noah et Nick tentent de reconstruire leur relation après les révélations du premier volet, entre jalousie, secrets familiaux et passion adolescente.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
    oscars: [],
  },
  {
    title: 'French Lover',
    director: 'Nina Rives',
    actors: [
      { name: 'Omar Sy' },
      { name: 'Sara Giraudeau' },
      { name: 'Pascale Arbillot' },
      { name: 'Alban Ivanov' },
      { name: 'Anaïs Demoustier' },
    ],
    coverUrl:
      '/movies_pictures/AAAABWVgN_6qNZk70MFWrIUY6kiYXI907aDytmsBt7M1eQ_o.jpg',
    releaseDate: '2025-01-01',
    length: 95,
    genre: ['Romance'],
    saga: '',
    description: 'Une Parisienne déçue par l\'amour rencontre un acteur britannique excentrique qui lui propose un pacte amoureux pour redécouvrir la romance.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Jane Austen a gâché ma vie',
    director: 'Laura Piani',
    actors: [
      {
        name: 'Camille Rutherford',
      },
      {
        name: 'Pablo Pauly',
      },
      {
        name: 'Charlie Anson',
      },
      {
        name: 'Annabelle Lengronne',
      },
      {
        name: 'Liz Crowther',
      },
      {
        name: 'Alan Fairbairn',
      },
      {
        name: 'Lola Peploe',
      },
    ],
    coverUrl: '/movies_pictures/e7dfc74ab3c8.jpg',
    releaseDate: '2025-01-22',
    length: 98,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une libraire parisienne obsédée par Jane Austen croise un écrivain britannique et doit choisir entre fiction romantique et amour réel.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
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
      {
        name: 'Benjamin Tranié',
      },
      {
        name: 'Abdulah Sissoko',
      },
      {
        name: 'Alassane Diong',
      },
      {
        name: 'Steve Tientcheu',
      },
      {
        name: 'François Damiens',
      },
    ],
    coverUrl: '/movies_pictures/amour-surcote.jpg',
    releaseDate: '2025-04-23',
    length: 98,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: 'Une styliste parisienne et un chef étoilé s\'affrontent puis s\'attirent lors d\'un défi culinaire où ego, passion et romance se mélangent.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: "L'Épreuve du feu",
    director: 'Aurélien Peyre',
    actors: [
      {
        name: 'Félix Lefebvre',
      },
      {
        name: 'Anja Verderosa',
      },
      {
        name: 'Suzanne Jouannet',
      },
      {
        name: 'Victor Bonnel',
      },
      {
        name: 'Sarah Henochsberg',
      },
      {
        name: 'Jules Porier',
      },
      {
        name: 'Nolan Masraf',
      },
    ],
    coverUrl: '/movies_pictures/0c1397847db3.jpg',
    releaseDate: '2025-08-13',
    length: 105,
    genre: ['Romance', 'Jeunesse', 'Drame'],
    saga: '',
    description: 'Deux pompiers s\'affrontent lors d\'une compétition internationale et découvrent que leur rivalité cache une attirance qu\'ils peinent à avouer.',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
    oscars: [],
  },
  {
    title: 'Valeur sentimentale (2025)',
    director: 'Joachim Trier',
    actors: [
      {
        name: 'Renate Reinsve',
      },
      {
        name: 'Stellan Skarsgard',
      },
      {
        name: 'Elle Fanning',
      },
      {
        name: 'Inga Ibsdotter Lilleaas',
      },
      {
        name: 'Anders Danielsen Lie',
      },
      {
        name: 'Bartosz Bielenia',
      },
      {
        name: 'Cory Michael Smith',
      },
    ],
    coverUrl: '/movies_pictures/99b101006553223982d79f39868c79fa.webp',
    releaseDate: '2025-08-20',
    length: 134,
    genre: ['Drame'],
    saga: '',
    description: 'Une réalisatrice et ses sœurs retournent dans la maison familiale norvégienne où secrets, rivalités et héritage parental remontent à la surface.',
    fromEntity: null,
    countryOrigin: ['Suède'],
    selectDisplayOrder: 10,
    oscars: [{ type: OscarEnum.OSCAR_BEST_INTERNATIONAL_FEATURE, year: 2026 }],
  },
  {
    title: 'Champagne Problems',
    director: 'Mark Steven Johnson',
    actors: [
      {
        name: 'Minka Kelly',
      },
      {
        name: 'Thibault de Montalembert',
      },
      {
        name: 'Flula Borg',
      },
      {
        name: 'Astrid Whettnall',
      },
      {
        name: 'Xavier Samuel',
      },
      {
        name: 'Maeve Courtier-Lilley',
      },
    ],
    coverUrl: '/movies_pictures/dce24faf4dfe1c86c2bb5ccf0f1a131f.webp',
    releaseDate: '2025-11-19',
    length: 104,
    genre: ['Romance'],
    saga: '',
    description: 'Une jeune femme hérite d\'un vignoble en Bourgogne et doit choisir entre vendre la propriété familiale et suivre son cœur vers un vigneron local.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
  {
    title: 'Marty Supreme',
    director: 'Josh Safdie',
    actors: [
      {
        name: 'Timothée Chalamet',
      },
      {
        name: 'Gwyneth Paltrow',
      },
      {
        name: 'Tyler, the Creator',
      },
      {
        name: 'Odessa Adlon',
      },
      {
        name: 'Penn Jillette',
      },
      {
        name: "Kevin O'Leary",
      },
      {
        name: 'Abel Ferrara',
      },
    ],
    coverUrl: '/movies_pictures/7dcb8416ab4e8fd4ff6eeaed758c6004.jpg',
    releaseDate: '2025-12-25',
    length: 120,
    genre: ['Comédie'],
    saga: '',
    description: 'Un prodige du ping-pong des années 1950 gravit les échelons du sport professionnel tout en poursuivant une obsession amoureuse destructrice.',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
    oscars: [],
  },
  {
    title: 'People We Meet on Vacation',
    director: 'Brett Haley',
    actors: [
      {
        name: 'Emily Bader',
      },
      {
        name: 'Tom Blyth',
      },
      {
        name: 'Sarah Catherine Hook',
      },
      {
        name: 'Jameela Jamil',
      },
      {
        name: 'Lucien Laviscount',
      },
      {
        name: 'Lukas Gage',
      },
      {
        name: 'Miles Heizer',
      },
    ],
    coverUrl: '/movies_pictures/people-we-meet-on-vacation-1.jpg',
    releaseDate: '2026-01-09',
    length: 118,
    genre: ['Romance'],
    saga: '',
    description: 'Deux amis d\'enfance partent chaque année en vacances ensemble, mais leurs sentiments refoulés menacent de transformer leur tradition estivale.',
    fromEntity: {
      entityType: 'book',
      title: 'People We Meet on Vacation',
      secondEntityKey: 'Emily Henry',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 10,
    oscars: [],
  },
];
