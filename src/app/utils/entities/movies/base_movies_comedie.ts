import { BaseMovie } from '../../../models/movie-model';

export const baseMoviesComedie: BaseMovie[] = [
  {
    title: 'La Boum',
    director: 'Claude Pinoteau',
    actors: [
      { name: 'Sophie Marceau' },
      { name: 'Claude Brasseur' },
      { name: 'Brigitte Fossey' },
      { name: 'Denise Grey' },
      { name: "Sheila O'Connor" },
      { name: 'Alexandre Sterling' },
      { name: 'Bernard Giraudeau' },
    ],
    coverUrl: '/movies_pictures/7b8dbed44135.jpg',
    releaseDate: '1980-12-17',
    length: 110,
    genre: ['Comédie', 'Romance'],
    saga: 'La Boum',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La Boum 2',
    director: 'Claude Pinoteau',
    actors: [
      { name: 'Sophie Marceau' },
      { name: 'Claude Brasseur' },
      { name: 'Brigitte Fossey' },
      { name: 'Denise Grey' },
      { name: 'Pierre Cosso' },
      { name: 'Alexandre Jardin' },
      { name: 'Shirley Bousquet' },
    ],
    coverUrl: '/movies_pictures/105349aa69a5.jpg',
    releaseDate: '1982-12-08',
    length: 109,
    genre: ['Comédie', 'Romance'],
    saga: 'La Boum',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La Guerre des boutons',
    director: 'Yves Robert',
    actors: [
      { name: 'André Treton' },
      { name: 'Martin Lartigue' },
      { name: 'Michel Galabru' },
      { name: 'François Boyer' },
      { name: 'Mona Dol' },
      { name: 'Pierre Tchernia' },
      { name: 'Jean Richard' },
    ],
    coverUrl: '/movies_pictures/la_guerre_des_boutons.jpg',
    releaseDate: '1962-04-18',
    length: 90,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'La Guerre des boutons',
      secondEntityKey: 'Louis Pergaud',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Mais où est donc passée la 7ème compagnie ?',
    director: 'Robert Lamoureux',
    actors: [
      { name: 'Jean Lefebvre' },
      { name: 'Pierre Mondy' },
      { name: 'Robert Lamoureux' },
      { name: 'Aldo Maccione' },
      { name: 'Michel Modo' },
      { name: 'Robert Rimbaud' },
      { name: 'Henri Guybet' },
    ],
    coverUrl: '/movies_pictures/d79426f1171c.jpg',
    releaseDate: '1973-10-15',
    length: 92,
    genre: ['Comédie', 'Guerre'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Barbie',
    director: 'Greta Gerwig',
    actors: [
      {
        name: 'Margot Robbie',
      },
      {
        name: 'Ryan Gosling',
      },
      {
        name: 'America Ferrera',
      },
      {
        name: 'Simu Liu',
      },
      {
        name: 'Kate McKinnon',
      },
      {
        name: 'Alexandra Shipp',
      },
      {
        name: 'Emma Mackey',
      },
    ],
    coverUrl: '/movies_pictures/1fb8801aa761.jpg',
    releaseDate: '2023-07-21',
    length: 114,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: "Don't look up, déni cosmique",
    director: 'Adam McKay',
    actors: [
      {
        name: 'Leonardo DiCaprio',
      },
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Cate Blanchett',
      },
      {
        name: 'Ariana Grande',
      },
      {
        name: 'Timothée Chalamet',
      },
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Chris Evans',
      },
      {
        name: 'Jonah Hill',
      },
    ],
    coverUrl: '/movies_pictures/1dda88e91df0.jpg',
    releaseDate: '2021-12-24',
    length: 138,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: "Le diable s'habille en Prada",
    director: 'David Frankel',
    actors: [
      { name: 'Meryl Streep' },
      { name: 'Anne Hathaway' },
      { name: 'Emily Blunt' },
      { name: 'Stanley Tucci' },
      { name: 'Simon Baker' },
      { name: 'Adrian Grenier' },
      { name: 'Tracie Thoms' },
    ],
    coverUrl: '/movies_pictures/le_diable_s_habille_en_prada.jpg',
    releaseDate: '2006-06-30',
    length: 109,
    genre: ['Comédie', 'Drame'],
    saga: "Le diable s'habille en Prada",
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Le diable s'habille en Prada",
      secondEntityKey: 'Lauren Weisberger',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
  },
  {
    title: "Le diable s'habille en Prada 2",
    director: 'David Frankel',
    actors: [
      { name: 'Meryl Streep' },
      { name: 'Anne Hathaway' },
      { name: 'Emily Blunt' },
      { name: 'Stanley Tucci' },
      { name: 'Simon Baker' },
      { name: 'Adrian Grenier' },
      { name: 'Tracie Thoms' },
    ],
    coverUrl: '/movies_pictures/le_diable_s_habille_en_prada_2.jpg',
    releaseDate: '2026-01-01',
    length: 110,
    genre: ['Comédie', 'Drame'],
    saga: "Le diable s'habille en Prada",
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 20,
  },
  {
    title: 'Free Guy',
    director: 'Shawn Levy',
    actors: [
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Taika Waititi',
      },
      {
        name: 'Lil Rel Howery',
      },
      {
        name: 'Joe Keery',
      },
      {
        name: 'Camille Kostek',
      },
      {
        name: 'Jodie Comer',
      },
      {
        name: 'Utkarsh Ambudkar',
      },
    ],
    coverUrl: '/movies_pictures/838153f7b859.jpg',
    releaseDate: '2021-08-13',
    length: 115,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Tanguy',
    director: 'Étienne Chatiliez',
    actors: [
      {
        name: 'Sabine Azéma',
      },
      {
        name: 'André Dussollier',
      },
      {
        name: 'Aurore Clément',
      },
      {
        name: 'Jean-Paul Rouve',
      },
      {
        name: 'André Wilms',
      },
      {
        name: 'Éric Berger',
      },
      {
        name: 'Hélène Duc',
      },
    ],
    coverUrl: '/movies_pictures/50d23a7e1733.jpg',
    releaseDate: '2001-12-19',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Shaolin Soccer',
    director: 'Stephen Chow',
    actors: [
      {
        name: 'Stephen Chow',
      },
      {
        name: 'Zhao Wei',
      },
      {
        name: 'Danny Chan Kwok Kwan',
      },
      {
        name: 'Ng Man-tat',
      },
      {
        name: 'Patrick Tse',
      },
      {
        name: 'Wong Yat-fei',
      },
      {
        name: 'Tin Kai-man',
      },
    ],
    coverUrl: '/movies_pictures/45025-shaolin-soccer-0-150-0-225-crop.jpg',
    releaseDate: '2001-07-12',
    length: 87,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Miss Détective',
    director: 'Donald Petrie',
    actors: [
      {
        name: 'William Shatner',
      },
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Benjamin Bratt',
      },
      {
        name: 'Candice Bergen',
      },
      {
        name: 'Michael Caine',
      },
      {
        name: 'Ernie Hudson',
      },
      {
        name: 'Heather Burns',
      },
    ],
    coverUrl: '/movies_pictures/51006-miss-congeniality-0-150-0-225-crop.jpg',
    releaseDate: '2000-12-22',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Snatch',
    director: 'Guy Ritchie',
    actors: [
      {
        name: 'Jason Statham',
      },
      {
        name: 'Stephen Graham',
      },
      {
        name: 'Brad Pitt',
      },
      {
        name: 'Dennis Farina',
      },
      {
        name: 'Rade Šerbedžija',
      },
      {
        name: 'Leni James',
      },
      {
        name: 'Vinnie Jones',
      },
    ],
    coverUrl: '/movies_pictures/2046311f3aa1.jpg',
    releaseDate: '2000-09-01',
    length: 104,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Dans tes rêves',
    director: 'Denis Thybaud',
    actors: [
      { name: 'Disiz' },
      { name: 'Béatrice Dalle' },
      { name: 'Vincent Elbaz' },
      { name: 'Anne Marivin' },
      { name: 'Édouard Montoute' },
      { name: 'Atmen Kelif' },
      { name: 'Nicolas Marié' },
    ],
    coverUrl: '/movies_pictures/18411781.jpg',
    releaseDate: '2005-10-05',
    length: 95,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'DodgeBall: Même pas mal',
    director: 'Rawson Marshall Thurber',
    actors: [
      {
        name: 'Vince Vaughn',
      },
      {
        name: 'Ben Stiller',
      },
      {
        name: 'Justin Long',
      },
      {
        name: 'Christine Taylor',
      },
      {
        name: 'Rip Torn',
      },
      {
        name: 'Alan Tudyk',
      },
      {
        name: 'Missi Pyle',
      },
    ],
    coverUrl:
      '/movies_pictures/aHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvL29yaWdpbmFsLy84aWtzckNOdmZhYnplZlMyQTlYVWg5ZXdyVm4uanBn.webp',
    releaseDate: '2004-06-18',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Garfield',
    director: 'Peter Hewitt',
    actors: [
      {
        name: 'Breckin Meyer',
      },
      {
        name: 'Jennifer Love Hewitt',
      },
      {
        name: 'Stephen Tobolowsky',
      },
      {
        name: 'Mark Christopher Lawrence',
      },
      {
        name: 'Juliette Goglia',
      },
      {
        name: 'Jim Davis',
      },
      {
        name: 'David Eigenberg',
      },
    ],
    coverUrl: '/movies_pictures/443d87c56ca4.jpg',
    releaseDate: '2004-06-11',
    length: 80,
    genre: ['Comédie'],
    saga: 'Garfield',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Garfield 2',
    director: 'Tim Hill',
    actors: [
      {
        name: 'Breckin Meyer',
      },
      {
        name: 'Jennifer Love Hewitt',
      },
      {
        name: 'Bill Murray',
      },
      {
        name: 'Billy Connolly',
      },
      {
        name: 'Lucy Davis',
      },
      {
        name: 'Bob Hoskins',
      },
      {
        name: 'Tim Curry',
      },
    ],
    coverUrl: '/movies_pictures/d2b311224602.jpg',
    releaseDate: '2006-07-19',
    length: 86,
    genre: ['Comédie', 'Jeunesse'],
    saga: 'Garfield',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Harold & Kumar Go to White Castle',
    director: 'Danny Leiner',
    actors: [
      {
        name: 'John Cho',
      },
      {
        name: 'Kal Penn',
      },
      {
        name: 'Paula Garcés',
      },
      {
        name: 'David Krumholtz',
      },
      {
        name: 'Eddie Kaye Thomas',
      },
      {
        name: 'Christopher Meloni',
      },
      {
        name: 'Malin Åkerman',
      },
    ],
    coverUrl: '/movies_pictures/harold_et_kumar_white_castle.jpg',
    releaseDate: '2004-07-30',
    length: 88,
    genre: ['Comédie'],
    saga: 'Harold & Kumar',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Le Joyeux Noël d'Harold et Kumar",
    director: 'Todd Strauss-Schulson',
    actors: [
      {
        name: 'John Cho',
      },
      {
        name: 'Kal Penn',
      },
      {
        name: 'Paula Garcés',
      },
      {
        name: 'Neil Patrick Harris',
      },
      {
        name: 'David Krumholtz',
      },
      {
        name: 'Eddie Kaye Thomas',
      },
      {
        name: 'Elias Koteas',
      },
    ],
    coverUrl: '/movies_pictures/52837895.webp',
    releaseDate: '2011-11-04',
    length: 90,
    genre: ['Comédie'],
    saga: 'Harold & Kumar',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Shaun of the Dead',
    director: 'Edgar Wright',
    actors: [
      {
        name: 'Kate Ashfield',
      },
      {
        name: 'Lucy Davis',
      },
      {
        name: 'Nick Frost',
      },
      {
        name: 'Dylan Moran',
      },
      {
        name: 'Bill Nighy',
      },
      {
        name: 'Penelope Wilton',
      },
      {
        name: 'Simon Pegg',
      },
    ],
    coverUrl: '/movies_pictures/shaun_of_the_dead.jpg',
    releaseDate: '2004-04-09',
    length: 99,
    genre: ['Comédie'],
    saga: 'Cornetto',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
  },
  {
    title: 'EuroTrip',
    director: 'Jeff Schaffer',
    actors: [
      {
        name: 'Scott Mechlowicz',
      },
      {
        name: 'Jacob Pitts',
      },
      {
        name: 'Michelle Trachtenberg',
      },
      {
        name: 'Jessica Boehrs',
      },
      {
        name: 'Vinnie Jones',
      },
      {
        name: 'Kristin Kreuk',
      },
      {
        name: 'Rade Šerbedžija',
      },
    ],
    coverUrl: '/movies_pictures/47243-eurotrip-0-150-0-225-crop.jpg',
    releaseDate: '2004-02-20',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les 11 commandements',
    director: 'François Desagnat, Thomas Sorriaux',
    actors: [
      {
        name: 'Michaël Youn',
      },
      {
        name: 'Dieudonné',
      },
      {
        name: 'Gad Elmaleh',
      },
      {
        name: 'Patrick Timsit',
      },
      {
        name: 'Amélie Mauresmo',
      },
      {
        name: 'Benjamin Morgaine',
      },
      {
        name: 'Q3021869',
      },
    ],
    coverUrl: '/movies_pictures/40754-the-11-commandments-0-150-0-225-crop.jpg',
    releaseDate: '2004-02-11',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'RRRrrrr!!!',
    director: 'Alain Chabat',
    actors: [
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Jean-Paul Rouve',
      },
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Marina Foïs',
      },
      {
        name: 'Maurice Barthélemy',
      },
      {
        name: 'Pierre-François Martin-Laval',
      },
    ],
    coverUrl: '/movies_pictures/1663063914e2.jpg',
    releaseDate: '2004-01-28',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Bruce tout-puissant',
    director: 'Tom Shadyac',
    actors: [
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Jennifer Aniston',
      },
      {
        name: 'Philip Baker Hall',
      },
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Steve Carell',
      },
      {
        name: 'Catherine Bell',
      },
      {
        name: 'Lisa Ann Walter',
      },
    ],
    coverUrl: '/movies_pictures/fsggdrgrdgr.jpg',
    releaseDate: '2003-05-23',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Moi, Cesar, 10 ans et demi, 1m39',
    director: 'Richard Berry',
    actors: [
      {
        name: 'Richard Berry',
      },
    ],
    coverUrl: '/movies_pictures/6543-i-cesar-0-150-0-225-crop.jpg',
    releaseDate: '2003-04-30',
    length: 91,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'En sursis',
    director: 'Andrzej Bartkowiak',
    actors: [
      {
        name: 'Jet Li',
      },
      {
        name: 'DMX',
      },
      {
        name: 'Anthony Anderson',
      },
      {
        name: 'Kelly Hu',
      },
      {
        name: 'Tom Arnold',
      },
      {
        name: 'Mark Dacascos',
      },
      {
        name: 'Gabrielle Union',
      },
    ],
    coverUrl: '/movies_pictures/46051-cradle-2-the-grave-0-150-0-225-crop.jpg',
    releaseDate: '2003-02-28',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'La Beuze',
    director: 'Éric Rochant',
    actors: [
      {
        name: 'Michaël Youn',
      },
      {
        name: 'Vincent Desagnat',
      },
      {
        name: 'Zoé Félix',
      },
      {
        name: 'Alex Descas',
      },
      {
        name: 'Benjamin Morgaine',
      },
      {
        name: 'Gad Elmaleh',
      },
      {
        name: 'Hans Meyer',
      },
    ],
    coverUrl: '/movies_pictures/la_beuze.jpg',
    releaseDate: '2003-02-05',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Opération antisèche',
    director: 'Andrew Gurland',
    actors: [
      {
        name: 'Martin Starr',
      },
      {
        name: 'Matthew Lawrence',
      },
      {
        name: 'Trevor Fehrman',
      },
      {
        name: 'Elden Henson',
      },
      {
        name: 'Mary Tyler Moore',
      },
      {
        name: 'Griffin Dunne',
      },
      {
        name: 'David Krumholtz',
      },
    ],
    coverUrl: '/movies_pictures/41348-cheats-0-150-0-225-crop.jpg',
    releaseDate: '2002-09-13',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Malavita',
    director: 'Luc Besson',
    actors: [
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Michelle Pfeiffer',
      },
      {
        name: 'Tommy Lee Jones',
      },
      {
        name: 'Dianna Agron',
      },
      {
        name: "John D'Leo",
      },
      {
        name: 'Dominic Chianese',
      },
      {
        name: 'Vincent Pastore',
      },
    ],
    coverUrl: '/movies_pictures/21041261_20130918111051913.jpg',
    releaseDate: '2013-10-23',
    length: 111,
    genre: ['Comédie', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Fanfan la Tulipe',
    director: 'Gérard Krawczyk',
    actors: [
      {
        name: 'Vincent Perez',
      },
      {
        name: 'Penélope Cruz',
      },
      {
        name: 'Michel Muller',
      },
      {
        name: 'Didier Bourdon',
      },
      {
        name: 'Adrien Saint-Joré',
      },
      {
        name: 'Augustin Legrand',
      },
      {
        name: 'Fabio Zenoni',
      },
    ],
    coverUrl: '/movies_pictures/affiche3.jpg',
    releaseDate: '2003-05-14',
    length: 97,
    genre: ['Aventure', 'Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Murder Club du jeudi',
    director: 'Chris Columbus',
    actors: [
      { name: 'Helen Mirren' },
      { name: 'Pierce Brosnan' },
      { name: 'Ben Kingsley' },
      { name: 'Celia Imrie' },
      { name: 'David Tennant' },
      { name: 'Naomi Ackie' },
      { name: 'Richard E. Grant' },
    ],
    coverUrl: '/movies_pictures/71cfda9b6e17b1b060ca232f1a038ea1.jpg',
    releaseDate: '2025-08-21',
    length: 118,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ce soir je dors chez toi',
    director: 'Olivier Baroux',
    actors: [
      {
        name: 'Alain Doutey',
      },
      {
        name: 'Arièle Semenoff',
      },
      {
        name: 'Audrey Dana',
      },
      {
        name: 'James Gerard',
      },
      {
        name: 'Jean-Paul Bathany',
      },
      {
        name: 'Jean-Paul Rouve',
      },
      {
        name: 'Kad Merad',
      },
    ],
    coverUrl: '/movies_pictures/18833360.webp',
    releaseDate: '2007-02-14',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Rasta Rockett',
    director: 'Jon Turteltaub',
    actors: [
      {
        name: 'Leon Robinson',
      },
      {
        name: 'Doug E. Doug',
      },
      {
        name: 'Rawle D. Lewis',
      },
      {
        name: 'Malik Yoba',
      },
      {
        name: 'John Candy',
      },
      {
        name: 'John Morgan',
      },
      {
        name: 'Peter Outerbridge',
      },
    ],
    coverUrl: '/movies_pictures/5345474.jpg',
    releaseDate: '1993-10-01',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Yao',
    director: 'Philippe Godeau',
    actors: [
      {
        name: 'Omar Sy',
      },
      {
        name: 'Fatoumata Diawara',
      },
      {
        name: 'Lionel Louis Basse',
      },
      {
        name: 'Germaine Acogny',
      },
      {
        name: 'Alibeta',
      },
      {
        name: 'Gwendolyn Gourvenec',
      },
      {
        name: 'Abdoulaye Diop',
      },
    ],
    coverUrl: '/movies_pictures/4636245.jpg',
    releaseDate: '2018-12-19',
    length: 103,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Bienvenue à Marly-Gomont',
    director: 'Julien Rambaldi',
    actors: [
      {
        name: 'Marc Zinga',
      },
      {
        name: 'Aïssa Maïga',
      },
      {
        name: 'Jean-Benoît Ugeux',
      },
      {
        name: 'Jonathan Lambert',
      },
      {
        name: 'Rufus',
      },
    ],
    coverUrl: '/movies_pictures/182694.jpg',
    releaseDate: '2016-06-08',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hot Shots!',
    director: 'Jim Abrahams',
    actors: [
      {
        name: 'Charlie Sheen',
      },
      {
        name: 'Cary Elwes',
      },
      {
        name: 'Valeria Golino',
      },
      {
        name: 'Lloyd Bridges',
      },
      {
        name: 'Kevin Dunn',
      },
      {
        name: 'Jon Cryer',
      },
      {
        name: "William O'Leary",
      },
    ],
    coverUrl: '/movies_pictures/8297c5b1c60c.jpg',
    releaseDate: '1991-07-31',
    length: 85,
    genre: ['Comédie'],
    saga: 'Hot Shots',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hot Shots! 2',
    director: 'Jim Abrahams',
    actors: [
      {
        name: 'Charlie Sheen',
      },
      {
        name: 'Lloyd Bridges',
      },
      {
        name: 'Valeria Golino',
      },
      {
        name: 'Rowan Atkinson',
      },
      {
        name: 'Richard Crenna',
      },
      {
        name: 'Jerry Haleva',
      },
      {
        name: 'Miguel Ferrer',
      },
    ],
    coverUrl: '/movies_pictures/c91e3df722a1.jpg',
    releaseDate: '1993-05-21',
    length: 86,
    genre: ['Comédie'],
    saga: 'Hot Shots',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'MASH',
    director: 'Robert Altman',
    actors: [
      {
        name: 'Donald Sutherland',
      },
      {
        name: 'Elliott Gould',
      },
      {
        name: 'Tom Skerritt',
      },
      {
        name: 'Sally Kellerman',
      },
      {
        name: 'Robert Duvall',
      },
      {
        name: 'René Auberjonois',
      },
      {
        name: 'Roger Bowen',
      },
    ],
    coverUrl: '/movies_pictures/mash.jpg',
    releaseDate: '1970-03-25',
    length: 116,
    genre: ['Comédie', 'Guerre'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Palm Springs',
    director: 'Max Barbakow',
    actors: [
      {
        name: 'Andy Samberg',
      },
      {
        name: 'Cristin Milioti',
      },
      {
        name: 'J. K. Simmons',
      },
      {
        name: 'Peter Gallagher',
      },
      {
        name: 'Meredith Hagner',
      },
      {
        name: 'Camila Mendes',
      },
      {
        name: 'Tyler Hoechlin',
      },
    ],
    coverUrl: '/movies_pictures/515467-palm-springs-0-150-0-225-crop.jpg',
    releaseDate: '2020-07-10',
    length: 90,
    genre: ['Comédie', 'Science Fiction'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'La soupe aux choux',
    director: 'Jean Girault',
    actors: [
      { name: 'Louis de Funès' },
      { name: 'Jean Carmet' },
      { name: 'Jacques Villeret' },
      { name: 'Claude Gensac' },
      { name: 'Henri Génès' },
      { name: 'Carole Brenner' },
      { name: 'Marco Perrin' },
    ],
    coverUrl: '/movies_pictures/18478117.jpg',
    releaseDate: '1981-12-02',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La Grande Vadrouille',
    director: 'Gérard Oury',
    actors: [
      {
        name: 'Bourvil',
      },
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Terry-Thomas',
      },
      {
        name: 'Helmuth Schneider',
      },
      {
        name: 'Claudio Brook',
      },
      {
        name: 'Mike Marshall',
      },
      {
        name: 'Marie Dubois',
      },
    ],
    coverUrl: '/movies_pictures/81pPAF7B7RL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1966-12-08',
    length: 132,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: "L'aile ou la cuisse",
    director: 'Claude Zidi',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Coluche',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Jean Martin',
      },
      {
        name: 'Marcel Dalio',
      },
      {
        name: 'Vittorio Caprioli',
      },
      {
        name: 'Julien Guiomar',
      },
    ],
    coverUrl: '/movies_pictures/061303c95cea.jpg',
    releaseDate: '1976-10-27',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les aventures de Rabbi Jacob',
    director: 'Gérard Oury',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Marcel Dalio',
      },
      {
        name: 'Renzo Montagnani',
      },
      {
        name: 'Miou-Miou',
      },
      {
        name: 'Suzy Delair',
      },
      {
        name: 'Claude Giraud',
      },
      {
        name: 'Henri Guybet',
      },
    ],
    coverUrl: '/movies_pictures/de94a9f25fdb.jpg',
    releaseDate: '1973-10-17',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La Folie des grandeurs',
    director: 'Gérard Oury',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Yves Montand',
      },
      {
        name: 'Karin Schubert',
      },
      {
        name: 'Alberto de Mendoza',
      },
      {
        name: 'Jaime de Mora y Aragón',
      },
      {
        name: 'Venantino Venantini',
      },
      {
        name: 'Gabriele Tinti',
      },
    ],
    coverUrl:
      '/movies_pictures/43223-delusions-of-grandeur-0-150-0-225-crop.jpg',
    releaseDate: '1971-12-08',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Oscar',
    director: 'Édouard Molinaro',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Claude Rich',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Paul Préboist',
      },
      {
        name: 'Roger Van Hool',
      },
    ],
    coverUrl: '/movies_pictures/50079-oscar-0-150-0-225-crop.jpg',
    releaseDate: '1967-10-11',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Pouic-Pouic',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Mireille Darc',
      },
      {
        name: 'Roger Dumas',
      },
      {
        name: 'Christian Marin',
      },
      {
        name: 'Daniel Ceccaldi',
      },
      {
        name: 'Guy Tréjan',
      },
      {
        name: 'Jacqueline Maillan',
      },
    ],
    coverUrl: '/movies_pictures/8259f6f050e5.jpg',
    releaseDate: '1963-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Faites sauter la banque !',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Yvonne Clech',
      },
      {
        name: 'Jean-Pierre Marielle',
      },
      {
        name: 'Georges Wilson',
      },
      {
        name: 'Claude Piéplu',
      },
      {
        name: 'Michel Tureau',
      },
      {
        name: 'Guy Grosso',
      },
    ],
    coverUrl: '/movies_pictures/813192d54f88.jpg',
    releaseDate: '1964-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Des pissenlits par la racine',
    director: 'Georges Lautner',
    actors: [
      {
        name: 'Michel Serrault',
      },
      {
        name: 'Mireille Darc',
      },
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Francis Blanche',
      },
      {
        name: 'Venantino Venantini',
      },
      {
        name: 'Bice Valori',
      },
      {
        name: 'Gianni Musy',
      },
    ],
    coverUrl: '/movies_pictures/318f3a3b6a37.jpg',
    releaseDate: '1964-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Une souris chez les hommes',
    director: 'Jacques Poitrenaud',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Dany Saval',
      },
      {
        name: 'Albert Michel',
      },
      {
        name: 'André Badin',
      },
      {
        name: 'Bernard Musson',
      },
      {
        name: 'Claude Piéplu',
      },
      {
        name: 'Dany Carrel',
      },
    ],
    coverUrl: '/movies_pictures/f8a857a7fcec.jpg',
    releaseDate: '1964-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Corniaud',
    director: 'Gérard Oury',
    actors: [
      {
        name: 'Bourvil',
      },
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Venantino Venantini',
      },
      {
        name: 'Beba Loncar',
      },
      {
        name: 'Alida Chelli',
      },
      {
        name: 'Lando Buzzanca',
      },
      {
        name: 'Henri Génès',
      },
    ],
    coverUrl: '/movies_pictures/f8b2c8e8c72e.jpg',
    releaseDate: '1965-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Bons Vivants',
    director: 'Gilles Grangier, Georges Lautner',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Bernard Blier',
      },
      {
        name: 'Adrien Cayla-Legrand',
      },
      {
        name: 'Albert Michel',
      },
      {
        name: 'Albert Rémy',
      },
      {
        name: 'Aline Bertrand',
      },
      {
        name: 'Andréa Parisy',
      },
    ],
    coverUrl: '/movies_pictures/7566596a7709.jpg',
    releaseDate: '1965-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Gendarme à New York',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Mario Pisu',
      },
      {
        name: 'Tiberio Murgia',
      },
      {
        name: 'Geneviève Grad',
      },
      {
        name: 'Jean Lefebvre',
      },
      {
        name: 'Christian Marin',
      },
    ],
    coverUrl: '/movies_pictures/5e19424f0e96.jpg',
    releaseDate: '1965-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Fantomas se déchaîne',
    director: 'André Hunebelle',
    actors: [
      {
        name: 'Jean Marais',
      },
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Mylène Demongeot',
      },
      {
        name: 'Jacques Dynam',
      },
      {
        name: 'Robert Dalban',
      },
      {
        name: 'Olivier de Funès',
      },
      {
        name: 'Arturo Dominici',
      },
    ],
    coverUrl: '/movies_pictures/75102b73c25e.jpg',
    releaseDate: '1965-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Grand Restaurant',
    director: 'Jacques Besnard',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Bernard Blier',
      },
      {
        name: 'Folco Lulli',
      },
      {
        name: 'Venantino Venantini',
      },
      {
        name: 'Noël Roquevert',
      },
      {
        name: 'Paul Préboist',
      },
      {
        name: 'Adrien Cayla-Legrand',
      },
    ],
    coverUrl: '/movies_pictures/02136366c083.jpg',
    releaseDate: '1966-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Fantomas contre Scotland Yard',
    director: 'André Hunebelle',
    actors: [
      {
        name: 'Jean Marais',
      },
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Mylène Demongeot',
      },
      {
        name: 'Françoise Christophe',
      },
      {
        name: 'André Dumas',
      },
      {
        name: 'Antoine Baud',
      },
      {
        name: 'Dominique Zardi',
      },
    ],
    coverUrl: '/movies_pictures/cc7146465fe3.jpg',
    releaseDate: '1967-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Grandes Vacances',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Silvia Dionisio',
      },
      {
        name: 'Ferdy Mayne',
      },
      {
        name: 'Olivier de Funès',
      },
      {
        name: 'Maurice Risch',
      },
      {
        name: 'Jacques Dynam',
      },
    ],
    coverUrl: '/movies_pictures/ff581892f807.jpg',
    releaseDate: '1967-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Petit Baigneur',
    director: 'Robert Dhéry',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Franco Fabrizi',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Pierre Dac',
      },
      {
        name: 'Pierre Tchernia',
      },
      {
        name: 'Andréa Parisy',
      },
      {
        name: 'Robert Dhéry',
      },
    ],
    coverUrl: '/movies_pictures/4b9dd005abfd.jpg',
    releaseDate: '1968-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Tatoué',
    director: 'Denys de La Patellière',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Jean Gabin',
      },
      {
        name: 'Jean-Pierre Darras',
      },
      {
        name: 'Lyne Chardonnet',
      },
      {
        name: 'Michel Tureau',
      },
      {
        name: 'Patrick Préjean',
      },
      {
        name: 'Henri Virlogeux',
      },
    ],
    coverUrl: '/movies_pictures/cfef8c6f52fb.jpg',
    releaseDate: '1968-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le gendarme se marie',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Geneviève Grad',
      },
      {
        name: 'Jean Lefebvre',
      },
      {
        name: 'Christian Marin',
      },
      {
        name: 'Bernard Lavalette',
      },
    ],
    coverUrl: '/movies_pictures/d8d0e2193a72.jpg',
    releaseDate: '1968-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hibernatus',
    director: 'Édouard Molinaro',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Michael Lonsdale',
      },
      {
        name: 'Bernard Alane',
      },
      {
        name: 'Olivier de Funès',
      },
      {
        name: 'Claude Piéplu',
      },
      {
        name: 'Paul Préboist',
      },
    ],
    coverUrl: '/movies_pictures/dfb617447e93.jpg',
    releaseDate: '1969-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: "L'Homme orchestre",
    director: 'Serge Korber',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Olivier de Funès',
      },
      {
        name: 'Paul Préboist',
      },
      {
        name: 'Noëlle Adam',
      },
      {
        name: 'Danielle Minazzoli',
      },
      {
        name: 'Franco Fabrizi',
      },
      {
        name: 'Franco Volpi',
      },
    ],
    coverUrl: '/movies_pictures/bfe97bd45dd1.jpg',
    releaseDate: '1970-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Gendarme en balade',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Sara Franchetti',
      },
      {
        name: 'Ugo Fangareggi',
      },
      {
        name: 'Jean Lefebvre',
      },
      {
        name: 'Christian Marin',
      },
    ],
    coverUrl: '/movies_pictures/8299ce4eaf25.jpg',
    releaseDate: '1970-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Sur un arbre perché',
    director: 'Serge Korber',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Geraldine Chaplin',
      },
      {
        name: 'Franco Volpi',
      },
      {
        name: 'Olivier de Funès',
      },
      {
        name: 'Alice Sapritch',
      },
      {
        name: 'Paul Préboist',
      },
      {
        name: 'Hans Meyer',
      },
    ],
    coverUrl: '/movies_pictures/b220e77daa73.jpg',
    releaseDate: '1971-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jo',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Bernard Blier',
      },
      {
        name: 'Guy Tréjan',
      },
      {
        name: 'Ferdy Mayne',
      },
      {
        name: 'Yvonne Clech',
      },
    ],
    coverUrl: '/movies_pictures/ac77aca9ecb0.jpg',
    releaseDate: '1971-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'La Zizanie',
    director: 'Claude Zidi',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Annie Girardot',
      },
      {
        name: 'André Badin',
      },
      {
        name: 'Daniel Boulanger',
      },
      {
        name: 'Éric Vasberg',
      },
      {
        name: 'Geneviève Fontanel',
      },
      {
        name: 'Georges Staquet',
      },
    ],
    coverUrl: '/movies_pictures/eafe0386bec4.jpg',
    releaseDate: '1978-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Gendarme et les Extra-terrestres',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Maurice Risch',
      },
      {
        name: 'France Rumilly',
      },
      {
        name: 'Guy Grosso',
      },
      {
        name: 'Michel Modo',
      },
      {
        name: 'Jacques François',
      },
    ],
    coverUrl: '/movies_pictures/e3971432900d.jpg',
    releaseDate: '1979-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'L’Avare',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Bernard Menez',
      },
      {
        name: 'Anne Caudry',
      },
      {
        name: 'Gaëlle Legrand',
      },
      {
        name: 'Georges Audoubert',
      },
    ],
    coverUrl: '/movies_pictures/3fff49c774c6.jpg',
    releaseDate: '1980-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Gendarme et les Gendarmettes',
    director: 'Jean Girault, Tony Aboyantz',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Claude Gensac',
      },
      {
        name: 'Maurice Risch',
      },
      {
        name: 'Guy Grosso',
      },
      {
        name: 'Michel Modo',
      },
      {
        name: 'Patrick Préjean',
      },
    ],
    coverUrl: '/movies_pictures/c31090a58cca.jpg',
    releaseDate: '1982-06-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Gendarme de Saint-Tropez',
    director: 'Jean Girault',
    actors: [
      {
        name: 'Louis de Funès',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Jean Lefebvre',
      },
      {
        name: 'Christian Marin',
      },
      {
        name: 'Guy Grosso',
      },
      {
        name: 'Michel Modo',
      },
      {
        name: 'Claude Piéplu',
      },
    ],
    coverUrl:
      '/movies_pictures/49168-le-gendarme-de-saint-tropez-0-150-0-225-crop.jpg',
    releaseDate: '1964-09-09',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les temps modernes',
    director: 'Charles Chaplin',
    actors: [{ name: 'Charles Chaplin' }],
    coverUrl: '/movies_pictures/49889-modern-times-0-150-0-225-crop.jpg',
    releaseDate: '1936-02-05',
    length: 87,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Yamakasi',
    director: 'Julien Seri',
    actors: [
      { name: 'Châu Belle Dinh' },
      { name: 'Williams Belle' },
      { name: 'Malik Diouf' },
      { name: "Yannn H'Nautra" },
      { name: "Guylain N'Guba Boyeke" },
      { name: 'Laurent Piemontesi' },
      { name: 'Charles Perrière' },
      { name: 'Maher Kamoun' },
    ],
    coverUrl: '/movies_pictures/48171-yamakasi-0-1000-0-1500-crop.jpg',
    releaseDate: '2001-02-05',
    length: 90,
    genre: ['Comédie', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Jackie chan dans le bronx',
    director: 'Stanley Tong Gwai-Lai',
    actors: [
      {
        name: 'Jackie Chan',
      },
      {
        name: 'Anita Mui',
      },
      {
        name: 'Françoise Yip',
      },
      {
        name: 'Bill Tung',
      },
      {
        name: 'Garvin Cross',
      },
      {
        name: 'Marc Akerstream',
      },
    ],
    coverUrl:
      '/movies_pictures/y7AxKPPCtZyrGQKvxzn5zTQ8wFm-0-1000-0-1500-crop.jpg',
    releaseDate: '1995-02-05',
    length: 106,
    genre: ['Comédie', 'Action'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: 'Astérix et Obélix contre César',
    director: 'Claude Zidi',
    actors: [
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Roberto Benigni',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Claude Piéplu',
      },
      {
        name: 'Daniel Prévost',
      },
      {
        name: 'Pierre Palmade',
      },
    ],
    coverUrl: '/movies_pictures/036676_af.jpg',
    releaseDate: '1999-01-30',
    length: 105,
    genre: ['Comédie'],
    saga: 'Astérix',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Astérix le Gaulois',
      secondEntityKey: 'René Goscinny',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Astérix & Obélix : Mission Cléopâtre',
    director: 'Alain Chabat',
    actors: [
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Jamel Debbouze',
      },
      {
        name: 'Monica Bellucci',
      },
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Claude Rich',
      },
      {
        name: 'Pierre Tchernia',
      },
    ],
    coverUrl: '/movies_pictures/4edc62ca1dcf.jpg',
    releaseDate: '2002-01-30',
    length: 107,
    genre: ['Comédie'],
    saga: 'Astérix',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Astérix et Cléopâtre',
      secondEntityKey: 'René Goscinny',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Astérix aux Jeux Olympiques',
    director: 'Frédéric Forestier, Thomas Langmann',
    actors: [
      {
        name: 'Clovis Cornillac',
      },
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Alain Delon',
      },
      {
        name: 'Benoît Poelvoorde',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Jérôme Le Banner',
      },
    ],
    coverUrl: '/movies_pictures/fec4f6009f25.jpg',
    releaseDate: '2008-01-30',
    length: 117,
    genre: ['Comédie'],
    saga: 'Astérix',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Astérix le Gaulois',
      secondEntityKey: 'René Goscinny',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Astérix et Obélix : Au service de Sa Majesté',
    director: 'Laurent Tirard',
    actors: [
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Catherine Deneuve',
      },
      {
        name: 'Guillaume Gallienne',
      },
      {
        name: 'Édouard Baer',
      },
      {
        name: 'Charlotte Le Bon',
      },
      {
        name: 'Valérie Lemercier',
      },
      {
        name: 'Dany Boon',
      },
    ],
    coverUrl: '/movies_pictures/asterix_obelix_god_save_britannia.jpg',
    releaseDate: '2012-10-17',
    length: 109,
    genre: ['Comédie'],
    saga: 'Astérix',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Astérix le Gaulois',
      secondEntityKey: 'René Goscinny',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: "Astérix et Obélix : L'Empire du Milieu",
    director: 'Guillaume Canet',
    actors: [
      {
        name: 'Guillaume Canet',
      },
      {
        name: 'Gilles Lellouche',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Vincent Cassel',
      },
      {
        name: 'Jonathan Cohen',
      },
      {
        name: 'Leanna Chea',
      },
      {
        name: 'Angèle',
      },
    ],
    coverUrl: '/movies_pictures/asterix_et_obelix_lempire_du_milieu.jpg',
    releaseDate: '2023-02-01',
    length: 112,
    genre: ['Comédie'],
    saga: 'Astérix',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Astérix le Gaulois',
      secondEntityKey: 'René Goscinny',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Wild Wild West',
    director: 'Barry Sonnenfeld',
    actors: [
      {
        name: 'Will Smith',
      },
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Kenneth Branagh',
      },
      {
        name: 'Salma Hayek',
      },
      {
        name: 'M. Emmet Walsh',
      },
      {
        name: 'Musetta Vander',
      },
      {
        name: 'Bai Ling',
      },
    ],
    coverUrl: '/movies_pictures/wild_wild_west.jpg',
    releaseDate: '1999-06-30',
    length: 106,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Mon voisin le tueur',
    director: 'Jonathan Lynn',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Matthew Perry',
      },
      {
        name: 'Rosanna Arquette',
      },
      {
        name: 'Michael Clarke Duncan',
      },
      {
        name: 'Natasha Henstridge',
      },
      {
        name: 'Amanda Peet',
      },
      {
        name: 'Kevin Pollak',
      },
    ],
    coverUrl:
      '/movies_pictures/50554-the-whole-nine-yards-0-150-0-225-crop.jpg',
    releaseDate: '2000-02-18',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hors de Prix',
    director: 'Pierre Salvadori',
    actors: [
      {
        name: 'Gad Elmaleh',
      },
      {
        name: 'Audrey Tautou',
      },
      {
        name: 'Marie-Christine Adam',
      },
      {
        name: 'Vernon Dobtcheff',
      },
      {
        name: 'Annelise Hesme',
      },
      {
        name: 'Blandine Pélissier',
      },
      {
        name: 'Didier Brice',
      },
    ],
    coverUrl: '/movies_pictures/48206-priceless-0-150-0-225-crop.jpg',
    releaseDate: '2006-12-27',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Admis à tout prix',
    director: 'Steve Pink',
    actors: [
      {
        name: 'Justin Long',
      },
      {
        name: 'Jonah Hill',
      },
      {
        name: 'Blake Lively',
      },
      {
        name: 'Columbus Short',
      },
      {
        name: 'Maria Thayer',
      },
      {
        name: 'Lewis Black',
      },
      {
        name: 'Mark Derwin',
      },
    ],
    coverUrl: '/movies_pictures/46823-accepted-0-150-0-225-crop.jpg',
    releaseDate: '2006-08-18',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Nos Jours heureux',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Jean-Paul Rouve',
      },
      {
        name: 'Marilou Berry',
      },
      {
        name: 'Omar Sy',
      },
      {
        name: 'Lannick Gautry',
      },
      {
        name: 'Jacqueline Jehanneuf',
      },
      {
        name: 'Julie Durand',
      },
      {
        name: 'Alexandre Pesle',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BMjI0NzM1NTcxMV5BMl5BanBnXkFtZTcwNjM1MTAzOQ@@._V1_.jpg',
    releaseDate: '2006-07-19',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: "Le Diable s'Habille en Prada",
    director: 'David Frankel',
    actors: [
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Simon Baker',
      },
      {
        name: 'Adrian Grenier',
      },
      {
        name: 'Tracie Thoms',
      },
    ],
    coverUrl: '/movies_pictures/4a702017d522.jpg',
    releaseDate: '2006-06-30',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: "De l'autre côté du lit",
    director: 'Peyton Reed',
    actors: [{ name: 'Vince Vaughn' }],
    coverUrl: '/movies_pictures/46843-the-break-up-0-150-0-225-crop.jpg',
    releaseDate: '2006-06-02',
    length: 106,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Camping',
    director: 'Fabien Onteniente',
    actors: [
      {
        name: 'Abbes Zahmani',
      },
      {
        name: 'Antoine Duléry',
      },
      {
        name: 'Ari Vatanen',
      },
      {
        name: 'Armonie Sanders',
      },
      {
        name: 'Béatrice Costantini',
      },
      {
        name: 'Bernard Montiel',
      },
      {
        name: 'Christine Citti',
      },
    ],
    coverUrl: '/movies_pictures/44197-camping-0-150-0-225-crop.jpg',
    releaseDate: '2006-04-26',
    length: 111,
    genre: ['Comédie'],
    saga: 'Camping',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Incontrôlable',
    director: 'Raffy Shart',
    actors: [
      {
        name: 'Arsène Mosca',
      },
      {
        name: 'Benjamin Morgaine',
      },
      {
        name: 'Christophe Fluder',
      },
      {
        name: 'Cyrielle Clair',
      },
      {
        name: 'Delphine Chanéac',
      },
      {
        name: 'Éric Le Roch',
      },
      {
        name: 'Françoise Bertin',
      },
    ],
    coverUrl: '/movies_pictures/43655-incontrolable-0-150-0-225-crop.jpg',
    releaseDate: '2006-02-01',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: '40 Ans, Toujours Puceau',
    director: 'Judd Apatow',
    actors: [
      {
        name: 'Steve Carell',
      },
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Paull Rudd',
      },
      {
        name: 'Catherine Keener',
      },
    ],
    coverUrl: '/movies_pictures/cd530e028963.jpg',
    releaseDate: '2005-08-19',
    length: 116,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Serial Nocers',
    director: 'David Dobkin',
    actors: [
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Vince Vaughn',
      },
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'Isla Fisher',
      },
      {
        name: 'Christopher Walken',
      },
      {
        name: 'Jane Seymour',
      },
    ],
    coverUrl: '/movies_pictures/47078-wedding-crashers-0-150-0-225-crop.jpg',
    releaseDate: '2005-07-15',
    length: 119,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Baby Sittor',
    director: 'Adam Shankman',
    actors: [
      {
        name: 'Vin Diesel',
      },
      {
        name: 'Lauren Graham',
      },
      {
        name: 'Faith Ford',
      },
      {
        name: 'Brittany Snow',
      },
      {
        name: 'Morgan York',
      },
      {
        name: 'Max Thieriot',
      },
      {
        name: 'Carol Kane',
      },
    ],
    coverUrl: '/movies_pictures/46620-the-pacifier-0-150-0-225-crop.jpg',
    releaseDate: '2005-03-04',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Mask',
    director: 'Chuck Russell',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Peter Riegert',
      },
      {
        name: 'Peter Greene',
      },
      {
        name: 'Amy Yasbeck',
      },
      {
        name: 'Orestes Matacena',
      },
      {
        name: 'Ben Stein',
      },
      {
        name: 'Blake Clark',
      },
    ],
    coverUrl: '/movies_pictures/51298-the-mask-0-150-0-225-crop.jpg',
    releaseDate: '1994-07-29',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'comic',
      title: 'The Mask',
      secondEntityKey: 'John Arcudi',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La cité de la peur',
    director: 'Alain Berbérian',
    actors: [
      {
        name: 'Patrick Timsit',
      },
      {
        name: 'Gérard Darmon',
      },
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Chantal Lauby',
      },
      {
        name: 'Dominique Farrugia',
      },
      {
        name: 'Bruno Carette',
      },
      {
        name: 'Élisabeth Vitali',
      },
    ],
    coverUrl:
      '/movies_pictures/42599-fear-city-a-family-style-comedy-0-150-0-225-crop.jpg',
    releaseDate: '1994-03-16',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Mrs. Doubtfire',
    director: 'Chris Columbus',
    actors: [
      {
        name: 'Robin Williams',
      },
      {
        name: 'Sally Field',
      },
      {
        name: 'Lisa Jakub',
      },
      {
        name: 'Matthew Lawrence',
      },
      {
        name: 'Mara Wilson',
      },
      {
        name: 'Pierce Brosnan',
      },
      {
        name: 'Harvey Fierstein',
      },
    ],
    coverUrl: '/movies_pictures/51364-mrs-doubtfire-0-150-0-225-crop.jpg',
    releaseDate: '1993-11-24',
    length: 125,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Le Dîner de Cons',
    director: 'Francis Veber',
    actors: [
      {
        name: 'Jacques Villeret',
      },
      {
        name: 'Thierry Lhermitte',
      },
      {
        name: 'Francis Huster',
      },
      {
        name: 'Alexandra Vandernoot',
      },
      {
        name: 'Daniel Prévost',
      },
      {
        name: 'Bernard Alane',
      },
      {
        name: 'Candide Sanchez',
      },
    ],
    coverUrl: '/movies_pictures/4df8e777a594.jpg',
    releaseDate: '1998-04-15',
    length: 80,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'The Big Lebowski',
    director: 'Joel Coen, Ethan Coen',
    actors: [
      {
        name: 'Julianne Moore',
      },
      {
        name: 'Steve Buscemi',
      },
      {
        name: 'Jeff Bridges',
      },
      {
        name: 'John Goodman',
      },
      {
        name: 'John Turturro',
      },
      {
        name: 'David Huddleston',
      },
      {
        name: 'Philip Seymour Hoffman',
      },
    ],
    coverUrl: '/movies_pictures/51935-the-big-lebowski-0-150-0-225-crop.jpg',
    releaseDate: '1998-03-06',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Il a Déjà Tes Yeux',
    director: 'Lucien Jean-Baptiste',
    actors: [
      {
        name: 'Lucien Jean-Baptiste',
      },
      {
        name: 'Aïssa Maïga',
      },
      {
        name: 'Zabou Breitman',
      },
      {
        name: 'Vincent Elbaz',
      },
      {
        name: 'Michel Jonasz',
      },
      {
        name: 'Naidra Ayadi',
      },
    ],
    coverUrl:
      '/movies_pictures/333161-he-even-has-your-eyes-0-150-0-225-crop.jpg',
    releaseDate: '2016-12-07',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Swiss Army Man',
    director: 'Dan Kwan, Daniel Scheinert',
    actors: [
      {
        name: 'Daniel Radcliffe',
      },
      {
        name: 'Paul Dano',
      },
      {
        name: 'Mary Elizabeth Winstead',
      },
      {
        name: 'Richard Gross',
      },
      {
        name: 'Shane Carruth',
      },
      {
        name: 'Andy Hull',
      },
    ],
    coverUrl: '/movies_pictures/swiss_army_man.jpg',
    releaseDate: '2016-07-01',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Comment c'est loin",
    director: 'Orelsan',
    actors: [
      {
        name: 'Orelsan',
      },
      {
        name: 'Gringe',
      },
      {
        name: 'Skread',
      },
      {
        name: 'Sophie de Fürst',
      },
      {
        name: 'Redouanne Harjane',
      },
      {
        name: 'Alain Dion',
      },
      {
        name: 'Marc Brunet',
      },
    ],
    coverUrl: '/movies_pictures/302633-comment-c-est-loin-0-150-0-225-crop.jpg',
    releaseDate: '2015-12-09',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Pixels',
    director: 'Chris Columbus',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Josh Gad',
      },
      {
        name: 'Michelle Monaghan',
      },
      {
        name: 'Peter Dinklage',
      },
      {
        name: 'Matt Lintz',
      },
      {
        name: 'Brian Cox',
      },
      {
        name: 'Jane Krakowski',
      },
    ],
    coverUrl: '/movies_pictures/181118-pixels-0-150-0-225-crop.jpg',
    releaseDate: '2015-07-24',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le médaillon',
    director: 'Gordon Chan',
    actors: [
      {
        name: 'Jackie Chan',
      },
      {
        name: 'Lee Evans',
      },
      {
        name: 'Claire Forlani',
      },
      {
        name: 'Julian Sands',
      },
      {
        name: 'John Rhys-Davies',
      },
      {
        name: 'Anthony Wong Chau-sang',
      },
      {
        name: 'Edison Chen',
      },
    ],
    coverUrl: '/movies_pictures/46064-the-medallion-0-1000-0-1500-crop.jpg',
    releaseDate: '2003-02-05',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Smoking',
    director: 'Kevin Donovan',
    actors: [
      {
        name: 'Jackie Chan',
      },
      {
        name: 'Jennifer Love Hewitt',
      },
      {
        name: 'Jason Isaacs',
      },
      {
        name: 'Debi Mazar',
      },
      {
        name: 'Peter Stormare',
      },
      {
        name: 'Romany Malco',
      },
      {
        name: 'James Brown',
      },
    ],
    coverUrl: '/movies_pictures/45912-the-tuxedo-0-1000-0-1500-crop.jpg',
    releaseDate: '2002-02-05',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Brice de Nice',
    director: 'James Huth',
    actors: [
      {
        name: 'Jean Dujardin',
      },
      {
        name: 'Clovis Cornillac',
      },
      {
        name: 'Élodie Bouchez',
      },
      {
        name: 'Bruno Salomone',
      },
      {
        name: 'Alexandra Lamy',
      },
      {
        name: 'Audrey Lamy',
      },
      {
        name: 'Delphine Chanéac',
      },
    ],
    coverUrl: '/movies_pictures/41053-the-brice-man-0-150-0-225-crop.jpg',
    releaseDate: '2005-02-02',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La tour Montparnasse infernale',
    director: 'Charles Nemes',
    actors: [
      {
        name: 'Éric et Ramzy',
      },
      {
        name: 'Bô Gaultier de Kermoal',
      },
      {
        name: 'Bruce Johnson',
      },
      {
        name: 'Edgar Givry',
      },
      {
        name: 'Éric Judor',
      },
      {
        name: 'Fred Testot',
      },
      {
        name: 'Georges Trillat',
      },
    ],
    coverUrl: '/movies_pictures/la_tour_montparnasse_infernale.jpg',
    releaseDate: '2001-10-31',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Spaceballs',
    director: 'Mel Brooks',
    actors: [
      {
        name: 'Bill Pullman',
      },
      {
        name: 'John Candy',
      },
      {
        name: 'Rick Moranis',
      },
      {
        name: 'Daphne Zuniga',
      },
      {
        name: 'Dick Van Patten',
      },
      {
        name: 'Joan Rivers',
      },
      {
        name: 'Mel Brooks',
      },
    ],
    coverUrl: '/movies_pictures/51203-spaceballs-0-150-0-225-crop.jpg',
    releaseDate: '1987-06-24',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'I Love You Phillip Morris',
    director: 'Glenn Ficarra, John Requa',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Ewan McGregor',
      },
      {
        name: 'Rodrigo Santoro',
      },
      {
        name: 'Antoni Corone',
      },
      {
        name: 'Leslie Mann',
      },
      {
        name: 'Brennan Brown',
      },
      {
        name: 'Marylouise Burke',
      },
    ],
    coverUrl: '/movies_pictures/i_love_you_philipp_morris.jpg',
    releaseDate: '2009-01-30',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Yes Man',
    director: 'Peyton Reed',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Zooey Deschanel',
      },
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'John Michael Higgins',
      },
      {
        name: 'Danny Masterson',
      },
      {
        name: 'Fionnula Flanagan',
      },
      {
        name: 'Molly Sims',
      },
    ],
    coverUrl: '/movies_pictures/yes-man-0-150-0-225-crop.jpg',
    releaseDate: '2008-12-19',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Rien que pour vos cheveux',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Emmanuelle Chriqui',
      },
      {
        name: 'John Turturro',
      },
      {
        name: 'Nick Swardson',
      },
      {
        name: 'Lainie Kazan',
      },
      {
        name: 'Rob Schneider',
      },
      {
        name: 'Dave Matthews',
      },
    ],
    coverUrl: '/movies_pictures/dont-mess-with-the-zohan-0-150-0-225-crop.jpg',
    releaseDate: '2008-06-06',
    length: 113,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Evan tout-puissant',
    director: 'Tom Shadyac',
    actors: [
      {
        name: 'Steve Carell',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Lauren Graham',
      },
      {
        name: 'John Goodman',
      },
      {
        name: 'Wanda Sykes',
      },
      {
        name: 'John Michael Higgins',
      },
      {
        name: 'Jonah Hill',
      },
    ],
    coverUrl: '/movies_pictures/50146-evan-almighty-0-150-0-225-crop.jpg',
    releaseDate: '2007-06-22',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Supergrave',
    director: 'Greg Mottola',
    actors: [
      {
        name: 'Jonah Hill',
      },
      {
        name: 'Michael Cera',
      },
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Bill Hader',
      },
      {
        name: 'Christopher Mintz-Plasse',
      },
      {
        name: 'Emma Stone',
      },
      {
        name: 'Aurora Snow',
      },
    ],
    coverUrl: '/movies_pictures/47776-superbad-0-150-0-225-crop.jpg',
    releaseDate: '2007-08-17',
    length: 113,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un indien dans la ville',
    director: 'Hervé Palud',
    actors: [
      {
        name: 'Thierry Lhermitte',
      },
      {
        name: 'Patrick Timsit',
      },
      {
        name: 'Ludwig Briand',
      },
      {
        name: 'Miou-Miou',
      },
      {
        name: 'Arielle Dombasle',
      },
      {
        name: 'Cheik Doukouré',
      },
    ],
    coverUrl:
      '/movies_pictures/45265-little-indian-big-city-0-150-0-225-crop.jpg',
    releaseDate: '1994-12-14',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Dumb & Dumber',
    director: 'Peter Farrelly, Bobby Farrelly',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Jeff Daniels',
      },
      {
        name: 'Lauren Holly',
      },
      {
        name: 'Mike Starr',
      },
      {
        name: 'Victoria Rowell',
      },
      {
        name: 'Teri Garr',
      },
      {
        name: 'Felton Perry',
      },
    ],
    coverUrl:
      '/movies_pictures/st4P2TtPrAfNwu8HLXoPsPPii42-0-150-0-225-crop.jpg',
    releaseDate: '1994-12-16',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: 'Comment tuer son boss',
    director: 'Seth Gordon',
    actors: [
      { name: 'Jason Bateman' },
      { name: 'Charlie Day' },
      { name: 'Jason Sudeikis' },
      { name: 'Christoph Waltz' },
    ],
    coverUrl: '/movies_pictures/00b38a3626d0.jpg',
    releaseDate: '2011-07-08',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Comment tuer son boss 2',
    director: 'Sean Anders',
    actors: [
      {
        name: 'Jason Bateman',
      },
      {
        name: 'Jason Sudeikis',
      },
      {
        name: 'Charlie Day',
      },
      {
        name: 'Jennifer Aniston',
      },
      {
        name: 'Christoph Waltz',
      },
      {
        name: 'Chris Pine',
      },
      {
        name: 'Jamie Foxx',
      },
    ],
    coverUrl: '/movies_pictures/aae8de9af6e2.jpg',
    releaseDate: '2014-12-24',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Paul',
    director: 'Greg Mottola',
    actors: [
      {
        name: 'Simon Pegg',
      },
      {
        name: 'Nick Frost',
      },
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Jason Bateman',
      },
      {
        name: 'Kristen Wiig',
      },
      {
        name: 'Bill Hader',
      },
      {
        name: 'Blythe Danner',
      },
    ],
    coverUrl: '/movies_pictures/paul.jpg',
    releaseDate: '2011-03-18',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Fatal',
    director: 'Michaël Youn',
    actors: [
      {
        name: 'Armelle',
      },
      {
        name: 'Ary Abittan',
      },
      {
        name: 'Bianca Gervais',
      },
      {
        name: 'Catherine Allégret',
      },
      {
        name: 'Fabrice Éboué',
      },
      {
        name: 'Jean Benguigui',
      },
      {
        name: 'Jérôme Le Banner',
      },
    ],
    coverUrl: '/movies_pictures/3111ebebad71.jpg',
    releaseDate: '2010-06-30',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Lucky Luke',
    director: 'James Huth',
    actors: [
      {
        name: 'Jean Dujardin',
      },
      {
        name: 'Sylvie Testud',
      },
      {
        name: 'Melvil Poupaud',
      },
      {
        name: 'Alexandra Lamy',
      },
      {
        name: 'André Oumansky',
      },
      {
        name: 'Bruno Salomone',
      },
      {
        name: 'Daniel Prévost',
      },
    ],
    coverUrl: '/movies_pictures/28805-lucky-luke-0-150-0-225-crop.jpg',
    releaseDate: '2009-10-21',
    length: 103,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Wanted Lucky Luke',
      secondEntityKey: 'Morris',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Zombieland',
    director: 'Ruben Fleischer',
    actors: [
      {
        name: 'Woody Harrelson',
      },
      {
        name: 'Jesse Eisenberg',
      },
      {
        name: 'Emma Stone',
      },
      {
        name: 'Abigail Breslin',
      },
      {
        name: 'Amber Heard',
      },
      {
        name: 'Bill Murray',
      },
      {
        name: 'Mike White',
      },
    ],
    coverUrl: '/movies_pictures/39352-zombieland-0-150-0-225-crop.jpg',
    releaseDate: '2009-10-02',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les seigneurs',
    director: 'Olivier Dahan',
    actors: [
      {
        name: 'Alban Aumard',
      },
      {
        name: 'André Chaumeau',
      },
      {
        name: 'André Penvern',
      },
      {
        name: 'Anne Suarez',
      },
      {
        name: 'Arnaud Henriet',
      },
      {
        name: 'Arsène Mosca',
      },
      {
        name: 'Chantal Neuwirth',
      },
    ],
    coverUrl: '/movies_pictures/103066-the-dream-team-0-150-0-225-crop.jpg',
    releaseDate: '2012-09-26',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Dictator',
    director: 'Larry Charles',
    actors: [
      {
        name: 'Sacha Baron Cohen',
      },
      {
        name: 'Anna Faris',
      },
      {
        name: 'Ben Kingsley',
      },
      {
        name: 'John C. Reilly',
      },
      {
        name: 'Megan Fox',
      },
      {
        name: 'Edward Norton',
      },
      {
        name: 'B.J. Novak',
      },
    ],
    coverUrl: '/movies_pictures/62911-the-dictator-0-150-0-225-crop.jpg',
    releaseDate: '2012-05-16',
    length: 83,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: '21 Jump Street',
    director: 'Phil Lord, Christopher Miller',
    actors: [
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Jonah Hill',
      },
      {
        name: 'Brie Larson',
      },
      {
        name: 'Dave Franco',
      },
      {
        name: 'Ice Cube',
      },
      {
        name: 'Jake Johnson',
      },
      {
        name: 'Johnny Depp',
      },
    ],
    coverUrl: '/movies_pictures/b9ff8c463531.jpg',
    releaseDate: '2012-03-16',
    length: 109,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: '22 Jump Street',
    director: 'Phil Lord, Chris Miller',
    actors: [
      {
        name: 'Jonah Hill',
      },
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Ice Cube',
      },
      {
        name: 'Jillian Bell',
      },
      {
        name: 'Amber Stevens West',
      },
      {
        name: 'Wyatt Russell',
      },
      {
        name: 'Jimmy Tatro',
      },
    ],
    coverUrl: '/movies_pictures/22_jump_street.jpg',
    releaseDate: '2014-08-27',
    length: 112,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Intouchables',
    director: 'Olivier Nakache, Éric Toledano',
    actors: [
      {
        name: 'François Cluzet',
      },
      {
        name: 'Omar Sy',
      },
      {
        name: 'Alba Gaïa Bellugi',
      },
      {
        name: 'Anne Le Ny',
      },
      {
        name: 'Audrey Fleurot',
      },
      {
        name: 'Clotilde Mollet',
      },
      {
        name: 'Caroline Bourg',
      },
    ],
    coverUrl: '/movies_pictures/intouchables-0-150-0-225-crop.jpg',
    releaseDate: '2011-11-02',
    length: 112,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Good Morning, Vietnam',
    director: 'Barry Levinson',
    actors: [
      {
        name: 'Robin Williams',
      },
      {
        name: 'Forest Whitaker',
      },
      {
        name: 'Bruno Kirby',
      },
      {
        name: 'J. T. Walsh',
      },
      {
        name: 'Noble Willingham',
      },
      {
        name: 'Chintara Sukapatana',
      },
      {
        name: 'Mark Johnson',
      },
    ],
    coverUrl: '/movies_pictures/good_morning_vietnam.jpg',
    releaseDate: '1987-12-23',
    length: 121,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les visiteurs',
    director: 'Jean-Marie Poiré',
    actors: [
      {
        name: 'Jean Reno',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Valérie Lemercier',
      },
      {
        name: 'Marie-Anne Chazel',
      },
      {
        name: 'Isabelle Nanty',
      },
      {
        name: 'Arièle Semenoff',
      },
      {
        name: 'Katja Weitzenböck',
      },
    ],
    coverUrl: '/movies_pictures/45066-the-visitors-0-150-0-225-crop.jpg',
    releaseDate: '1993-01-27',
    length: 107,
    genre: ['Comédie'],
    saga: 'Les Visiteurs',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les Visiteurs II : Les couloirs du temps',
    director: 'Jean-Marie Poiré',
    actors: [
      {
        name: 'Jean Reno',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Muriel Robin',
      },
      {
        name: 'Marie-Anne Chazel',
      },
      {
        name: 'Jean-Luc Caron',
      },
      {
        name: 'Patrick Chesnais',
      },
      {
        name: 'Marianne Sagebrecht',
      },
    ],
    coverUrl: '/movies_pictures/90f170480b09.jpg',
    releaseDate: '1998-03-29',
    length: 118,
    genre: ['Comédie'],
    saga: 'Les Visiteurs',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les Visiteurs en Amérique',
    director: 'Jean-Marie Poiré',
    actors: [
      {
        name: 'Jean Reno',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Christina Applegate',
      },
      {
        name: 'Tara Reid',
      },
      {
        name: 'Malcolm McDowell',
      },
      {
        name: 'Bridgette Wilson-Sampras',
      },
      {
        name: 'Matt Ross',
      },
    ],
    coverUrl: '/movies_pictures/a23ce3ea75a4.jpg',
    releaseDate: '2001-04-11',
    length: 88,
    genre: ['Comédie'],
    saga: 'Les Visiteurs',
    description: '',
    fromEntity: null,
    countryOrigin: ['France', 'États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les Visiteurs : La Révolution',
    director: 'Jean-Marie Poiré',
    actors: [
      {
        name: 'Jean Reno',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Karin Viard',
      },
      {
        name: 'Sylvie Testud',
      },
      {
        name: 'Marie-Anne Chazel',
      },
      {
        name: 'Alex Lutz',
      },
    ],
    coverUrl: '/movies_pictures/49de8e641305.jpg',
    releaseDate: '2016-04-06',
    length: 110,
    genre: ['Comédie'],
    saga: 'Les Visiteurs',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Nos 18 ans',
    director: 'Frédéric Berthe',
    actors: [
      {
        name: 'Arthur Dupont',
      },
      {
        name: 'Bernadette Lafont',
      },
      {
        name: 'Éric Naggar',
      },
      {
        name: 'Julia Piaton',
      },
      {
        name: 'Liza Manili',
      },
      {
        name: 'Maruschka Detmers',
      },
      {
        name: 'Michel Blanc',
      },
    ],
    coverUrl: '/movies_pictures/18930938.jpg',
    releaseDate: '2008-09-16',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Do-Over',
    director: 'Steven Brill',
    actors: [
      {
        name: 'David Spade',
      },
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Paula Patton',
      },
      {
        name: 'Catherine Bell',
      },
      {
        name: 'Nick Swardson',
      },
      {
        name: 'Sean Astin',
      },
      {
        name: 'Luis Guzmán',
      },
    ],
    coverUrl: '/movies_pictures/475370.webp',
    releaseDate: '2016-05-27',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Eh mec, elle est où ma caisse ?',
    director: 'Frédéric Forestier',
    actors: [
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Seann William Scott',
      },
      {
        name: 'Jennifer Garner',
      },
      {
        name: 'Marla Sokoloff',
      },
      {
        name: 'Kristy Swanson',
      },
      {
        name: 'David Herman',
      },
      {
        name: 'Hal Sparks',
      },
    ],
    coverUrl: '/movies_pictures/69198036_af.jpg',
    releaseDate: '2016-01-27',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Amour et turbulences',
    director: 'Alexandre Castagnetti',
    actors: [
      {
        name: 'Ludivine Sagnier',
      },
      {
        name: 'Nicolas Bedos',
      },
      {
        name: 'Jonathan Cohen',
      },
      {
        name: 'Arnaud Ducret',
      },
      {
        name: 'Brigitte Catillon',
      },
      {
        name: 'Jackie Berroyer',
      },
      {
        name: 'Clémentine Célarié',
      },
    ],
    coverUrl: '/movies_pictures/20465398.webp',
    releaseDate: '2013-06-26',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hot Babes',
    director: 'Christian Forte',
    actors: [
      {
        name: 'Chris Pratt',
      },
      {
        name: 'Brendan Hines',
      },
      {
        name: 'Scott Caan',
      },
      {
        name: 'Denise Richards',
      },
      {
        name: 'Christopher McDonald',
      },
      {
        name: 'Tracy Morgan',
      },
      {
        name: 'Kim Kardashian',
      },
    ],
    coverUrl: '/movies_pictures/350226.jpg',
    releaseDate: '2009-10-10',
    length: 91,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Sex List',
    director: 'Denis Malleval',
    actors: [
      {
        name: 'Aubrey Plaza',
      },
      {
        name: 'Johnny Simmons',
      },
      {
        name: 'Bill Hader',
      },
      {
        name: 'Alia Shawkat',
      },
      {
        name: 'Sarah Steele',
      },
      {
        name: 'Scott Porter',
      },
      {
        name: 'Rachel Bilson',
      },
    ],
    coverUrl: '/movies_pictures/19802001.webp',
    releaseDate: '2017-04-19',
    length: 104,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ali G',
    director: 'Mark Mylod',
    actors: [
      {
        name: 'Sacha Baron Cohen',
      },
      {
        name: 'Martin Freeman',
      },
      {
        name: 'Michael Gambon',
      },
      {
        name: 'Charles Dance',
      },
      {
        name: 'Rhona Mitra',
      },
      {
        name: 'Eileen Essell',
      },
      {
        name: 'Jack Thompson',
      },
    ],
    coverUrl: '/movies_pictures/71Nt8UcRgfL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2002-03-22',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Ce Que Veulent Les Hommes',
    director: 'Adam McKay',
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
    coverUrl: '/movies_pictures/5459039.webp',
    releaseDate: '2000-12-15',
    length: 97,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Walter',
    director: 'Varante Soudjian',
    actors: [
      {
        name: 'Issaka Sawadogo',
      },
      {
        name: 'Alban Ivanov',
      },
      {
        name: 'Judith El Zein',
      },
      {
        name: 'David Salles',
      },
      {
        name: 'Karim Jebli',
      },
      {
        name: 'Nordine Salhi',
      },
      {
        name: 'Alexandre Antonio',
      },
    ],
    coverUrl: '/movies_pictures/4878496.jpg',
    releaseDate: '2023-07-18',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Prénom',
    director: 'Alexandre de La Patellière, Matthieu Delaporte',
    actors: [
      {
        name: 'Patrick Bruel',
      },
      {
        name: 'Valérie Benguigui',
      },
      {
        name: 'Charles Berling',
      },
      {
        name: 'Guillaume de Tonquédec',
      },
      {
        name: 'Judith El Zein',
      },
      {
        name: 'Françoise Fabian',
      },
      {
        name: 'Yaniss Lespert',
      },
    ],
    coverUrl: '/movies_pictures/20057116.jpg',
    releaseDate: '2012-04-25',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Deux moi',
    director: 'Cédric Klapisch',
    actors: [
      {
        name: 'François Civil',
      },
      {
        name: 'Ana Girardot',
      },
      {
        name: 'Camille Cottin',
      },
      {
        name: 'François Berléand',
      },
      {
        name: 'Eye Haïdara',
      },
      {
        name: 'Rebecca Marder',
      },
      {
        name: 'Pierre Niney',
      },
    ],
    coverUrl: '/movies_pictures/4929782.webp',
    releaseDate: '2019-01-09',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: "L'Héritage",
    director: 'Sylwester Jakimow',
    actors: [{ name: 'Inconnu' }],
    coverUrl: '/movies_pictures/lheritage.jpg',
    releaseDate: '2024-06-19',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Shotgun Wedding',
    director: 'Jason Moore',
    actors: [
      {
        name: 'Jennifer Lopez',
      },
      {
        name: 'Josh Duhamel',
      },
      {
        name: 'Sonia Braga',
      },
      {
        name: 'Jennifer Coolidge',
      },
      {
        name: 'Lenny Kravitz',
      },
      {
        name: 'Cheech Marin',
      },
      {
        name: "D'Arcy Carden",
      },
    ],
    coverUrl: '/movies_pictures/5806477.jpg',
    releaseDate: '2022-12-28',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Borat',
    director: 'Larry Charles',
    actors: [
      {
        name: 'Sacha Baron Cohen',
      },
      {
        name: 'Ken Davitian',
      },
      {
        name: 'Pamela Anderson',
      },
      {
        name: 'Luenell Campbell',
      },
      {
        name: 'Dan Mazer',
      },
    ],
    coverUrl: '/movies_pictures/18682308.jpg',
    releaseDate: '2006-11-03',
    length: 82,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'The Worst Person in the World',
    director: 'Joachim Trier',
    actors: [
      {
        name: 'Renate Reinsve',
      },
      {
        name: 'Anders Danielsen Lie',
      },
      {
        name: 'Herbert Nordrum',
      },
      {
        name: 'Hans Olav Brenner',
      },
      {
        name: 'Silje Storstein',
      },
      {
        name: 'Ruby Dagnall',
      },
      {
        name: 'Ine F. Jansen',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BZGEyYzBiYmItZDM4OC00NTdmLWJlYzctODdiM2E2MjZmYTU2XkEyXkFqcGc@._V1_.jpg',
    releaseDate: '2021-10-13',
    length: 128,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Rhinestone',
    director: 'Bob Clark',
    actors: [
      {
        name: 'Sylvester Stallone',
      },
      {
        name: 'Dolly Parton',
      },
      {
        name: 'Richard Farnsworth',
      },
      {
        name: 'Ron Leibman',
      },
      {
        name: 'Tim Thomerson',
      },
      {
        name: 'Ritch Brinkley',
      },
    ],
    coverUrl: '/movies_pictures/523416.webp',
    releaseDate: '1984-10-19',
    length: 111,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jumeaux',
    director: 'Ivan Reitman',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Danny DeVito',
      },
      {
        name: 'Kelly Preston',
      },
      {
        name: 'Chloe Webb',
      },
      {
        name: 'Bonnie Bartlett',
      },
      {
        name: 'Tony Jay',
      },
      {
        name: 'Marshall Bell',
      },
    ],
    coverUrl: '/movies_pictures/19681869.webp',
    releaseDate: '1988-12-09',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un flic à la maternelle',
    director: 'Ivan Reitman',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Penelope Ann Miller',
      },
      {
        name: 'Pamela Reed',
      },
      {
        name: 'Linda Hunt',
      },
      {
        name: 'Carroll Baker',
      },
      {
        name: 'Richard Tyson',
      },
      {
        name: 'Angela Bassett',
      },
    ],
    coverUrl: '/movies_pictures/19681754.webp',
    releaseDate: '1990-12-21',
    length: 111,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Junior',
    director: 'Ivan Reitman',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Danny DeVito',
      },
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Frank Langella',
      },
      {
        name: 'Pamela Reed',
      },
      {
        name: 'Aida Turturro',
      },
      {
        name: 'James Eckhouse',
      },
    ],
    coverUrl: '/movies_pictures/19681885.webp',
    releaseDate: '1994-11-23',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Killing Gunther',
    director: 'Taran Killam',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Cobie Smulders',
      },
      {
        name: 'Hannah Simone',
      },
      {
        name: 'Taran Killam',
      },
      {
        name: 'Allison Tolman',
      },
      {
        name: 'Steve Bacic',
      },
      {
        name: 'Bobby Moynihan',
      },
    ],
    coverUrl: '/movies_pictures/2745112.webp',
    releaseDate: '2017-09-22',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hudson Hawk, gentleman et cambrioleur',
    director: 'Michael Lehmann',
    actors: [
      {
        name: 'Danny Aiello',
      },
      {
        name: 'Andie MacDowell',
      },
      {
        name: 'James Coburn',
      },
      {
        name: 'Sandra Bernhard',
      },
      {
        name: 'Richard E. Grant',
      },
      {
        name: 'Bruce Willis',
      },
      {
        name: 'David Caruso',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BMmU4MmUzN2YtMTNmNS00ODk3LThmYTYtMDFjNzJkYzYxZjY2XkEyXkFqcGc@._V1_.jpg',
    releaseDate: '1991-05-24',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'La mort vous va si bien',
    director: 'Robert Zemeckis',
    actors: [
      {
        name: 'Meryl Streep',
      },
      {
        name: 'Goldie Hawn',
      },
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Isabella Rossellini',
      },
      {
        name: 'Mary Ellen Trainor',
      },
      {
        name: 'Nancy Fish',
      },
      {
        name: 'Michelle Johnson',
      },
    ],
    coverUrl: '/movies_pictures/380625.webp',
    releaseDate: '1992-05-22',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un homme presque parfait',
    director: 'John McTiernan',
    actors: [
      {
        name: 'Paul Newman',
      },
      {
        name: 'Jessica Tandy',
      },
      {
        name: 'Pruitt Taylor Vince',
      },
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Melanie Griffith',
      },
      {
        name: 'Dylan Walsh',
      },
      {
        name: 'Josef Sommer',
      },
    ],
    coverUrl: '/movies_pictures/51MDME1T0AL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1993-11-19',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Sale Môme',
    director: 'Barry Levinson',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Spencer Breslin',
      },
      {
        name: 'Emily Mortimer',
      },
      {
        name: 'Lily Tomlin',
      },
      {
        name: 'Chi McBride',
      },
      {
        name: 'Jean Smart',
      },
      {
        name: 'Daniel von Bargen',
      },
    ],
    coverUrl: '/movies_pictures/sale_mome.jpg',
    releaseDate: '2000-10-06',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Bandits',
    director: 'Barry Levinson',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Billy Bob Thornton',
      },
      {
        name: 'Cate Blanchett',
      },
      {
        name: 'Troy Garity',
      },
      {
        name: "Brían F. O'Byrne",
      },
      {
        name: 'Micole Mercurio',
      },
      {
        name: 'Azura Skye',
      },
    ],
    coverUrl: '/movies_pictures/bandits.jpg',
    releaseDate: '2001-10-12',
    length: 123,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Mon voisin le tueur 2',
    director: 'Patrick Read Johnson',
    actors: [
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Matthew Perry',
      },
      {
        name: 'Amanda Peet',
      },
      {
        name: 'Kevin Pollak',
      },
      {
        name: 'Natasha Henstridge',
      },
      {
        name: 'Frank Collison',
      },
      {
        name: 'Johnny Messner',
      },
    ],
    coverUrl: '/movies_pictures/18383447.webp',
    releaseDate: '2005-09-09',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Moonrise Kingdom',
    director: 'Wes Anderson',
    actors: [
      {
        name: 'Jared Gilman',
      },
      {
        name: 'Kara Hayward',
      },
      {
        name: 'Bruce Willis',
      },
      {
        name: 'Edward Norton',
      },
      {
        name: 'Bill Murray',
      },
      {
        name: 'Frances McDormand',
      },
      {
        name: 'Tilda Swinton',
      },
    ],
    coverUrl: '/movies_pictures/20079610.jpg',
    releaseDate: '2012-05-25',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ace Ventura en Afrique',
    director: 'Steve Oedekerk',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Ian McNeice',
      },
      {
        name: 'Simon Callow',
      },
      {
        name: 'Maynard Eziashi',
      },
      {
        name: 'Bob Gunton',
      },
      {
        name: 'Sophie Okonedo',
      },
      {
        name: 'Tommy Davidson',
      },
    ],
    coverUrl: '/movies_pictures/51S480FZPZL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1995-11-10',
    length: 90,
    genre: ['Comédie'],
    saga: 'Ace Ventura',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Menteur, menteur',
    director: 'Tom Shadyac',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Maura Tierney',
      },
      {
        name: 'Jennifer Tilly',
      },
      {
        name: 'Swoosie Kurtz',
      },
      {
        name: 'Amanda Donohoe',
      },
      {
        name: 'Jason Bernard',
      },
      {
        name: 'Mitchell Ryan',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BN2Y2YTNlNjItNTZhMC00YWI0LWJjNDctOWMzZWM0ZmM1ODBjXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '1997-03-21',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Fous d'Irène",
    director: 'Bobby Farrelly, Peter Farrelly',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Renée Zellweger',
      },
      {
        name: 'Anthony Anderson',
      },
      {
        name: 'Chris Cooper',
      },
      {
        name: 'Robert Forster',
      },
      {
        name: 'Tony Cox',
      },
      {
        name: 'Richard Jenkins',
      },
    ],
    coverUrl: '/movies_pictures/52704123.webp',
    releaseDate: '2000-05-19',
    length: 116,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Braqueurs amateurs',
    director: 'Les Mayfield',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Téa Leoni',
      },
      {
        name: 'Alec Baldwin',
      },
      {
        name: 'Richard Jenkins',
      },
      {
        name: 'John Michael Higgins',
      },
      {
        name: 'Angie Harmon',
      },
      {
        name: 'Richard Burgi',
      },
    ],
    coverUrl: '/movies_pictures/18470756.webp',
    releaseDate: '2001-08-10',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'M. Popper et ses pingouins',
    director: 'Mark Waters',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Carla Gugino',
      },
      {
        name: 'Angela Lansbury',
      },
      {
        name: 'Ophelia Lovibond',
      },
      {
        name: 'Madeline Carroll',
      },
      {
        name: 'Clark Gregg',
      },
      {
        name: 'Jeffrey Tambor',
      },
    ],
    coverUrl: '/movies_pictures/19768358.webp',
    releaseDate: '2011-06-17',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Dogma : Resurrected !',
    director: 'Kevin Smith',
    actors: [
      {
        name: 'Ben Affleck',
      },
      {
        name: 'George Carlin',
      },
      {
        name: 'Matt Damon',
      },
      {
        name: 'Linda Fiorentino',
      },
      {
        name: 'Salma Hayek',
      },
      {
        name: 'Jason Lee',
      },
      {
        name: 'Jason Mewes',
      },
    ],
    coverUrl: '/movies_pictures/2143a7b1a514644f257543e0d3bb9896.webp',
    releaseDate: '1999-11-12',
    length: 130,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Zack et Miri font un porno',
    director: 'Kevin Smith',
    actors: [
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Elizabeth Banks',
      },
      {
        name: 'Craig Robinson',
      },
      {
        name: 'Jason Mewes',
      },
      {
        name: 'Jeff Anderson',
      },
      {
        name: 'Traci Lords',
      },
      {
        name: 'Katie Morgan',
      },
    ],
    coverUrl: '/movies_pictures/zack_et_miri_font_un_porno.jpg',
    releaseDate: '2008-10-31',
    length: 101,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Deux en un',
    director: 'Steven Soderbergh',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Greg Kinnear',
      },
      {
        name: 'Eva Mendes',
      },
      {
        name: 'Wen Yann Shih',
      },
      {
        name: 'Pat Crawford Brown',
      },
      {
        name: 'Cher',
      },
      {
        name: 'Griffin Dunne',
      },
    ],
    coverUrl: '/movies_pictures/old-deux_en_un.0.jpg',
    releaseDate: '2002-08-09',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Informant !',
    director: 'Steven Soderbergh',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Scott Bakula',
      },
      {
        name: 'Joel McHale',
      },
      {
        name: 'Melanie Lynskey',
      },
      {
        name: 'Tom Papa',
      },
      {
        name: 'Rick Overton',
      },
      {
        name: 'Thomas F. Wilson',
      },
    ],
    coverUrl: '/movies_pictures/61iJsROZviL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2009-09-18',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Downsizing',
    director: 'Alexander Payne',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Christoph Waltz',
      },
      {
        name: 'Hong Chau',
      },
      {
        name: 'Kristen Wiig',
      },
      {
        name: 'Rolf Lassgård',
      },
      {
        name: 'Ingjerd Egeberg',
      },
      {
        name: 'Udo Kier',
      },
    ],
    coverUrl: '/movies_pictures/71I+vaCNsEL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2017-12-22',
    length: 135,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Bienvenue à Suburbicon',
    director: 'George Clooney',
    actors: [
      {
        name: 'Matt Damon',
      },
      {
        name: 'Julianne Moore',
      },
      {
        name: 'Oscar Isaac',
      },
      {
        name: 'Noah Jupe',
      },
      {
        name: 'Glenn Fleshler',
      },
      {
        name: 'Megan Ferguson',
      },
      {
        name: 'Jack Conley',
      },
    ],
    coverUrl: '/movies_pictures/3569523.jpg',
    releaseDate: '2017-10-27',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Burn After Reading',
    director: 'Joel Coen, Ethan Coen',
    actors: [
      {
        name: 'George Clooney',
      },
      {
        name: 'Frances McDormand',
      },
      {
        name: 'John Malkovich',
      },
      {
        name: 'Tilda Swinton',
      },
      {
        name: 'Brad Pitt',
      },
      {
        name: 'Richard Jenkins',
      },
      {
        name: 'J. K. Simmons',
      },
    ],
    coverUrl: '/movies_pictures/18991610.webp',
    releaseDate: '2008-09-12',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'War Machine',
    director: 'David Michôd',
    actors: [
      {
        name: 'Brad Pitt',
      },
      {
        name: 'Ben Kingsley',
      },
      {
        name: 'Anthony Hayes',
      },
      {
        name: 'Emory Cohen',
      },
      {
        name: 'RJ Cyler',
      },
      {
        name: 'Daniel Betts',
      },
      {
        name: 'Topher Grace',
      },
    ],
    coverUrl: '/movies_pictures/115361.jpg',
    releaseDate: '2017-05-26',
    length: 122,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'That Thing You Do!',
    director: 'Tom Hanks',
    actors: [
      {
        name: 'Tom Everett Scott',
      },
      {
        name: 'Liv Tyler',
      },
      {
        name: 'Johnathon Schaech',
      },
      {
        name: 'Steve Zahn',
      },
      {
        name: 'Ethan Embry',
      },
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Giovanni Ribisi',
      },
    ],
    coverUrl: '/movies_pictures/51V7K8HACAL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1996-10-04',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Il n'est jamais trop tard",
    director: 'Tom Hanks',
    actors: [
      {
        name: 'Julia Roberts',
      },
      {
        name: 'Cedric the Entertainer',
      },
      {
        name: 'Taraji P. Henson',
      },
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Gugu Mbatha-Raw',
      },
      {
        name: 'Wilmer Valderrama',
      },
      {
        name: 'Bryan Cranston',
      },
    ],
    coverUrl: '/movies_pictures/19754859.webp',
    releaseDate: '2011-12-09',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un hologramme pour le roi',
    director: 'Tom Tykwer',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Alex Black',
      },
      {
        name: 'Sarita Choudhury',
      },
      {
        name: 'Sidse Babett Knudsen',
      },
      {
        name: 'Ben Whishaw',
      },
      {
        name: 'Tom Skerritt',
      },
      {
        name: 'Tracey Fairaway',
      },
    ],
    coverUrl: '/movies_pictures/94017612.webp',
    releaseDate: '2016-04-22',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Pire Voisin au monde',
    director: 'John Krasinski',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Rachel Keller',
      },
      {
        name: 'Manuel Garcia-Rulfo',
      },
      {
        name: 'Mariana Treviño',
      },
      {
        name: 'Cameron Britton',
      },
      {
        name: 'Mike Birbiglia',
      },
      {
        name: 'John Higgins',
      },
    ],
    coverUrl: '/movies_pictures/4413721.jpg',
    releaseDate: '2022-06-17',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Asteroid City',
    director: 'Wes Anderson',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Maya Hawke',
      },
      {
        name: 'Margot Robbie',
      },
    ],
    coverUrl: '/movies_pictures/5000360.jpg',
    releaseDate: '2023-06-23',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jerry Maguire',
    director: 'Cameron Crowe',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Cuba Gooding Jr.',
      },
      {
        name: 'Renée Zellweger',
      },
      {
        name: 'Kelly Preston',
      },
      {
        name: "Jerry O'Connell",
      },
      {
        name: 'Jay Mohr',
      },
      {
        name: 'Bonnie Hunt',
      },
    ],
    coverUrl: '/movies_pictures/18956382.webp',
    releaseDate: '1996-12-13',
    length: 139,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Tonnerre sous les Tropiques',
    director: 'Ben Stiller',
    actors: [
      {
        name: 'Ben Stiller',
      },
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Robert Downey Jr.',
      },
      {
        name: 'Jake Black',
      },
    ],
    coverUrl: '/movies_pictures/18976808.jpg',
    releaseDate: '2008-08-13',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: 'Celebrity',
    director: 'Woody Allen',
    actors: [
      {
        name: 'Hank Azaria',
      },
      {
        name: 'Kenneth Branagh',
      },
      {
        name: 'Judy Davis',
      },
      {
        name: 'Leonardo DiCaprio',
      },
      {
        name: 'Winona Ryder',
      },
      {
        name: 'Melanie Griffith',
      },
      {
        name: 'Famke Janssen',
      },
    ],
    coverUrl: '/movies_pictures/039649_af.webp',
    releaseDate: '1998-11-20',
    length: 113,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Scoop',
    director: 'Woody Allen',
    actors: [
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Hugh Jackman',
      },
      {
        name: 'Ian McShane',
      },
      {
        name: 'Woody Allen',
      },
      {
        name: 'Charles Dance',
      },
      {
        name: 'Romola Garai',
      },
      {
        name: 'Kevin McNally',
      },
    ],
    coverUrl: '/movies_pictures/18674307.jpg',
    releaseDate: '2006-07-28',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },

  {
    title: 'Beaucoup de bruit pour rien',
    director: 'Kenneth Branagh',
    actors: [
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Robert Sean Leonard',
      },
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Denzel Washington',
      },
      {
        name: 'Kenneth Branagh',
      },
      {
        name: 'Kate Beckinsale',
      },
    ],
    coverUrl: '/movies_pictures/18455665.webp',
    releaseDate: '1993-05-07',
    length: 111,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Remplaçants',
    director: 'Howard Deutch',
    actors: [
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Gene Hackman',
      },
      {
        name: 'Brooke Langton',
      },
      {
        name: 'Jon Favreau',
      },
      {
        name: 'Orlando Jones',
      },
      {
        name: 'Brett Cullen',
      },
      {
        name: 'Rhys Ifans',
      },
    ],
    coverUrl: '/movies_pictures/5122D0XJQFL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2000-08-11',
    length: 118,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Âge difficile obscur',
    director: 'Richard Linklater',
    actors: [
      {
        name: 'Lou Taylor Pucci',
      },
      {
        name: 'Tilda Swinton',
      },
      {
        name: "Vincent D'Onofrio",
      },
      {
        name: 'Keanu Reeves',
      },
      {
        name: 'Vince Vaughn',
      },
      {
        name: 'Kelli Garner',
      },
      {
        name: 'Benjamin Bratt',
      },
    ],
    coverUrl: '/movies_pictures/unnamed (2).jpg',
    releaseDate: '2004-09-24',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Mords-moi sans hésitation',
    director: 'Jason Friedberg, Aaron Seltzer',
    actors: [
      {
        name: 'Jenn Proske',
      },
      {
        name: 'Matt Lanter',
      },
      {
        name: 'Christopher N. Riggi',
      },
      {
        name: 'Ken Jeong',
      },
      {
        name: 'Anneliese van der Pol',
      },
      {
        name: 'Diedrich Bader',
      },
      {
        name: 'Arielle Kebbel',
      },
    ],
    coverUrl: '/movies_pictures/7d9ae1e530b9.jpg',
    releaseDate: '2010-08-18',
    length: 82,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Super Héros Movie',
    director: 'Craig Mazin',
    actors: [
      {
        name: 'Drake Bell',
      },
      {
        name: 'Sara Paxton',
      },
      {
        name: 'Leslie Nielsen',
      },
      {
        name: 'Christopher McDonald',
      },
      {
        name: 'Marion Ross',
      },
      {
        name: 'Kevin Hart',
      },
      {
        name: 'Tracy Morgan',
      },
    ],
    coverUrl: '/movies_pictures/ea033986376d.jpg',
    releaseDate: '2008-03-28',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Spoof Movie',
    director: 'Paris Barclay',
    actors: [
      {
        name: 'Shawn Wayans',
      },
      {
        name: 'Marlon Wayans',
      },
      {
        name: 'Tracey Cherelle Jones',
      },
      {
        name: 'Vivica A. Fox',
      },
      {
        name: 'Chris Spencer',
      },
      {
        name: 'Bernie Mac',
      },
      {
        name: 'Keenen Ivory Wayans',
      },
    ],
    coverUrl: '/movies_pictures/5f141a51b9a9.jpg',
    releaseDate: '1996-01-12',
    length: 89,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Adventureland : Un job d'été à éviter",
    director: 'Greg Mottola',
    actors: [
      { name: 'Ryan Reynolds' },
      { name: 'Jesse Eisenberg' },
      { name: 'Kristen Stewart' },
      { name: 'Martin Starr' },
      { name: 'Bill Hader' },
      { name: 'Wendie Malick' },
      { name: 'Margarita Levieva' },
    ],
    coverUrl: '/movies_pictures/341031.jpg',
    releaseDate: '2009-04-03',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Paper Man',
    director: 'Kieran Mulroney',
    actors: [
      {
        name: 'Jeff Daniels',
      },
      {
        name: 'Emma Stone',
      },
      {
        name: 'Ryan Reynolds',
      },
      {
        name: 'Lisa Kudrow',
      },
      {
        name: 'Hunter Parrish',
      },
      {
        name: 'Kieran Culkin',
      },
      {
        name: 'Arabella Field',
      },
    ],
    coverUrl: '/movies_pictures/19427092.jpg',
    releaseDate: '2009-04-24',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Deux drôles d'oiseaux",
    director: 'Forest Whitaker',
    actors: [
      {
        name: 'Robert Duvall',
      },
      {
        name: 'Richard Harris',
      },
      {
        name: 'Shirley MacLaine',
      },
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Marty Belafsky',
      },
      {
        name: 'Piper Laurie',
      },
      {
        name: 'Micole Mercurio',
      },
    ],
    coverUrl: '/movies_pictures/deux_droles_d_oiseaux.jpg',
    releaseDate: '1996-09-13',
    length: 123,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Pour l'amour de l'art",
    director: 'Griffin Dunne',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Stephen Dillane',
      },
      {
        name: 'Yaphet Kotto',
      },
      {
        name: 'Mike Starr',
      },
      {
        name: 'Denis Leary',
      },
      {
        name: 'Michael Badalucco',
      },
      {
        name: 'Wayne Robson',
      },
    ],
    coverUrl: '/movies_pictures/51EMR6QPNKL._AC_UF1000,1000_QL80_.jpg',
    releaseDate: '1997-04-25',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Ensorceleuses',
    director: 'Griffin Dunne',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Stockard Channing',
      },
      {
        name: 'Dianne Wiest',
      },
      {
        name: 'Aidan Quinn',
      },
      {
        name: 'Goran Višnjić',
      },
      {
        name: 'Evan Rachel Wood',
      },
    ],
    coverUrl: '/movies_pictures/51-oqFisdVL._AC_UF1000,1000_QL80_.jpg',
    releaseDate: '1998-06-24',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: '28 Jours en sursis',
    director: 'Betty Thomas',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Viggo Mortensen',
      },
      {
        name: 'Dominic West',
      },
      {
        name: 'Elizabeth Perkins',
      },
      {
        name: 'Diane Ladd',
      },
      {
        name: 'Steve Buscemi',
      },
      {
        name: 'Alan Tudyk',
      },
    ],
    coverUrl: '/movies_pictures/28_jours_en_sursis.webp',
    releaseDate: '2000-04-14',
    length: 103,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un Vent de folie',
    director: 'Callie Khouri',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Ben Affleck',
      },
      {
        name: 'Maura Tierney',
      },
      {
        name: 'Steve Zahn',
      },
      {
        name: 'Blythe Danner',
      },
      {
        name: 'Ronny Cox',
      },
      {
        name: 'Michael Fairman',
      },
    ],
    coverUrl: '/movies_pictures/023294.jpg',
    releaseDate: '2002-06-28',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Flingueuses',
    director: 'Paul Feig',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Melissa McCarthy',
      },
      {
        name: 'Michael Rapaport',
      },
      {
        name: 'Demián Bichir',
      },
      {
        name: 'Tony Hale',
      },
      {
        name: 'Thomas F. Wilson',
      },
      {
        name: 'Kaitlin Olson',
      },
    ],
    coverUrl: '/movies_pictures/21022372_20130724154657123.webp',
    releaseDate: '2013-06-28',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Our Brand Is Crisis',
    director: 'David Gordon Green',
    actors: [
      {
        name: 'Sandra Bullock',
      },
      {
        name: 'Billy Bob Thornton',
      },
      {
        name: 'Anthony Mackie',
      },
      {
        name: 'Joaquim de Almeida',
      },
      {
        name: 'Ann Dowd',
      },
      {
        name: 'Scoot McNairy',
      },
      {
        name: 'Zoe Kazan',
      },
    ],
    coverUrl: '/movies_pictures/486362.jpg',
    releaseDate: '2015-10-30',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Dirty Work',
    director: 'Bob Saget',
    actors: [
      {
        name: 'Norm Macdonald',
      },
      {
        name: 'Artie Lange',
      },
      {
        name: 'Jack Warden',
      },
      {
        name: 'Traylor Howard',
      },
      {
        name: 'Don Rickles',
      },
      {
        name: 'Christopher McDonald',
      },
      {
        name: 'Chevy Chase',
      },
    ],
    coverUrl: '/movies_pictures/91Vv6w2rhcL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1998-06-12',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Big Daddy',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Cole et Dylan Sprouse',
      },
      {
        name: 'Joey Lauren Adams',
      },
      {
        name: 'Jon Stewart',
      },
      {
        name: 'Rob Schneider',
      },
      {
        name: 'Leslie Mann',
      },
      {
        name: 'Steve Buscemi',
      },
    ],
    coverUrl: '/movies_pictures/big_daddy.jpg',
    releaseDate: '1999-06-25',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Punch-Drunk Love',
    director: 'Paul Thomas Anderson',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Emily Watson',
      },
      {
        name: 'Philip Seymour Hoffman',
      },
      {
        name: 'Luis Guzmán',
      },
      {
        name: 'Mary Lynn Rajskub',
      },
      {
        name: 'Don McManus',
      },
      {
        name: 'Robert Smigel',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BODU1M2FhNmMtYjQwYy00MzZlLWJjODctMGFmNjBlMDM5MjkzXkEyXkFqcGc@._V1_.jpg',
    releaseDate: '2002-10-11',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Self control',
    director: 'Peter Segal',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Marisa Tomei',
      },
      {
        name: 'John Turturro',
      },
      {
        name: 'Luis Guzmán',
      },
      {
        name: 'Jonathan Loughran',
      },
      {
        name: 'Kurt Fuller',
      },
    ],
    coverUrl: '/movies_pictures/self_control.jpg',
    releaseDate: '2003-06-13',
    length: 128,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Histoires enchantées',
    director: 'Peter Segal',
    actors: [
      {
        name: 'Susanne Blakeslee',
      },
      {
        name: 'Erin Torpey',
      },
      {
        name: 'Corey Burton',
      },
      {
        name: 'Barbara Dirickson',
      },
      {
        name: 'Frank Welker',
      },
      {
        name: 'Lea Salonga',
      },
      {
        name: 'Linda Larkin',
      },
    ],
    coverUrl: '/movies_pictures/19000540.jpg',
    releaseDate: '2006-06-23',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Zookeeper',
    director: 'Frank Coraci',
    actors: [
      {
        name: 'Rosario Dawson',
      },
      {
        name: 'Leslie Bibb',
      },
      {
        name: 'Kevin James',
      },
      {
        name: 'Ken Jeong',
      },
      {
        name: 'Donnie Wahlberg',
      },
      {
        name: 'Joe Rogan',
      },
      {
        name: 'Nat Faxon',
      },
    ],
    coverUrl: '/movies_pictures/19765666.jpg',
    releaseDate: '2011-07-08',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Mytho',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Jennifer Aniston',
      },
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Brooklyn Decker',
      },
      {
        name: 'Nicole Kidman',
      },
      {
        name: 'Nick Swardson',
      },
      {
        name: 'Dave Matthews',
      },
      {
        name: 'Bailee Madison',
      },
    ],
    coverUrl: '/movies_pictures/19639330.jpg',
    releaseDate: '2011-02-11',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Crazy Dad',
    director: 'Sean Anders',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Vanilla Ice',
      },
      {
        name: 'Todd Bridges',
      },
      {
        name: 'Andy Samberg',
      },
      {
        name: 'Leighton Meester',
      },
      {
        name: 'James Caan',
      },
      {
        name: 'Susan Sarandon',
      },
    ],
    coverUrl: '/movies_pictures/20147947.jpg',
    releaseDate: '2012-06-15',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Famille recomposée',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Alexis Arquette',
      },
      {
        name: 'Allen Covert',
      },
      {
        name: 'Bella Thorne',
      },
      {
        name: 'Drew Barrymore',
      },
      {
        name: 'Joel McHale',
      },
      {
        name: 'Kevin Nealon',
      },
    ],
    coverUrl: '/movies_pictures/hj03ifq6saygahhxm8ugdxnkntf-594.jpg',
    releaseDate: '2014-05-23',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Cobbler',
    director: 'Thomas McCarthy',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Steve Buscemi',
      },
      {
        name: 'Dustin Hoffman',
      },
      {
        name: 'Dan Stevens',
      },
      {
        name: 'Melonie Diaz',
      },
      {
        name: 'Method Man',
      },
      {
        name: 'Ellen Barkin',
      },
    ],
    coverUrl: '/movies_pictures/117850.webp',
    releaseDate: '2014-09-12',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Ridiculous 6',
    director: 'Frank Coraci',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Terry Crews',
      },
      {
        name: 'Jorge Garcia',
      },
      {
        name: 'Taylor Lautner',
      },
      {
        name: 'Rob Schneider',
      },
      {
        name: 'Luke Wilson',
      },
      {
        name: 'Steve Buscemi',
      },
    ],
    coverUrl: '/movies_pictures/443790.webp',
    releaseDate: '2015-12-11',
    length: 118,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Sandy Wexler',
    director: 'Steven Brill',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Kevin James',
      },
      {
        name: 'Jamie Gray Hyder',
      },
      {
        name: 'Terry Crews',
      },
      {
        name: 'Rob Schneider',
      },
      {
        name: 'Chris Rock',
      },
      {
        name: 'Nick Swardson',
      },
    ],
    coverUrl: '/movies_pictures/355985.webp',
    releaseDate: '2017-04-14',
    length: 130,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Happy Gilmore',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Julie Bowen',
      },
      {
        name: 'Christopher McDonald',
      },
      {
        name: 'Carl Weathers',
      },
      {
        name: 'Allen Covert',
      },
      {
        name: 'Frances Bay',
      },
      {
        name: 'Ben Stiller',
      },
    ],
    coverUrl: '/movies_pictures/happy_gilmore.jpg',
    releaseDate: '1996-02-16',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Le Songe d'une nuit d'été",
    director: 'Michael Hoffman',
    actors: [
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Michelle Pfeiffer',
      },
      {
        name: 'Rupert Everett',
      },
      {
        name: 'Stanley Tucci',
      },
      {
        name: 'Calista Flockhart',
      },
      {
        name: 'Anna Friel',
      },
      {
        name: 'Christian Bale',
      },
    ],
    coverUrl: '/movies_pictures/s-l400.jpg',
    releaseDate: '1999-05-14',
    length: 116,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: "Songe d'une nuit d'été",
      secondEntityKey: 'William Shakespeare',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'American Bluff',
    director: 'David O. Russell',
    actors: [
      {
        name: 'Christian Bale',
      },
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Amy Adams',
      },
    ],
    coverUrl: '/movies_pictures/199998.webp',
    releaseDate: '2013-12-20',
    length: 138,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ghost World',
    director: 'Terry Zwigoff',
    actors: [
      {
        name: 'Thora Birch',
      },
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Brad Renfro',
      },
      {
        name: 'Illeana Douglas',
      },
      {
        name: 'Steve Buscemi',
      },
      {
        name: 'Bob Balaban',
      },
      {
        name: 'Dave Sheridan',
      },
    ],
    coverUrl: '/movies_pictures/205168.webp',
    releaseDate: '2001-07-20',
    length: 111,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Perfect Score',
    director: 'Brian Robbins',
    actors: [
      {
        name: 'Erika Christensen',
      },
      {
        name: 'Chris Evans',
      },
      {
        name: 'Bryan Greenberg',
      },
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Darius Miles',
      },
      {
        name: 'Leonardo Nam',
      },
      {
        name: 'Matthew Lillard',
      },
    ],
    coverUrl: '/movies_pictures/508509.jpg',
    releaseDate: '2004-01-30',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Chef',
    director: 'Jon Favreau',
    actors: [
      {
        name: 'Jon Favreau',
      },
      {
        name: 'John Leguizamo',
      },
      {
        name: 'Bobby Cannavale',
      },
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Dustin Hoffman',
      },
      {
        name: 'Sofía Vergara',
      },
      {
        name: 'Oliver Platt',
      },
    ],
    coverUrl: '/movies_pictures/358672.jpg',
    releaseDate: '2014-05-09',
    length: 115,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jojo Rabbit',
    director: 'Taika Waititi',
    actors: [
      {
        name: 'Scarlett Johansson',
      },
      {
        name: 'Taika Waititi',
      },
      {
        name: 'Rebel Wilson',
      },
      {
        name: 'Thomasin McKenzie',
      },
      {
        name: 'Sam Rockwell',
      },
      {
        name: 'Alfie Allen',
      },
      {
        name: 'Stephen Merchant',
      },
    ],
    coverUrl: '/movies_pictures/1009759.jpg',
    releaseDate: '2019-10-18',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Whiskey Tango Foxtrot',
    director: 'Glenn Ficarra',
    actors: [
      {
        name: 'Tina Fey',
      },
      {
        name: 'Margot Robbie',
      },
      {
        name: 'Martin Freeman',
      },
      {
        name: 'Alfred Molina',
      },
      {
        name: 'Christopher Abbott',
      },
      {
        name: 'Billy Bob Thornton',
      },
      {
        name: 'Nicholas Braun',
      },
    ],
    coverUrl: '/movies_pictures/500754.webp',
    releaseDate: '2016-03-04',
    length: 112,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jack',
    director: 'Francis Ford Coppola',
    actors: [
      {
        name: 'Robin Williams',
      },
      {
        name: 'Diane Lane',
      },
      {
        name: 'Jennifer Lopez',
      },
      {
        name: 'Bill Cosby',
      },
      {
        name: 'Fran Drescher',
      },
      {
        name: 'Brian Kerwin',
      },
      {
        name: 'Seth Smith',
      },
    ],
    coverUrl: '/movies_pictures/196422.webp',
    releaseDate: '1996-08-09',
    length: 113,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Harry dans tous ses états',
    director: 'Barry Levinson',
    actors: [
      {
        name: 'Caroline Aaron',
      },
      {
        name: 'Kirstie Alley',
      },
      {
        name: 'Bob Balaban',
      },
      {
        name: 'Richard Benjamin',
      },
      {
        name: 'Eric Bogosian',
      },
      {
        name: 'Billy Crystal',
      },
      {
        name: 'Judy Davis',
      },
    ],
    coverUrl: '/movies_pictures/471571.webp',
    releaseDate: '1997-10-10',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Bûcher des vanités',
    director: 'Brian De Palma',
    actors: [
      { name: 'Morgan Freeman' },
      { name: 'Bruce Willis' },
      { name: 'Tom Hanks' },
      { name: 'Melanie Griffith' },
      { name: 'Kim Cattrall' },
      { name: 'Saul Rubinek' },
      { name: 'F. Murray Abraham' },
    ],
    coverUrl: '/movies_pictures/18867957.webp',
    releaseDate: '1990-12-21',
    length: 125,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Sans plus attendre',
    director: 'Rob Reiner',
    actors: [
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Sean Hayes',
      },
      {
        name: 'Rob Morrow',
      },
      {
        name: 'Beverly Todd',
      },
      {
        name: 'Rowena King',
      },
      {
        name: 'Ian Anthony Dale',
      },
    ],
    coverUrl:
      '/movies_pictures/sans-plus-attendre-the-bucket-list-affiche_hd.jpg',
    releaseDate: '2007-11-21',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Last Vegas',
    director: 'Jon Turteltaub',
    actors: [
      {
        name: 'Michael Douglas',
      },
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Kevin Kline',
      },
      {
        name: 'Morgan Freeman',
      },
      {
        name: 'Mary Steenburgen',
      },
      {
        name: 'Bre Blair',
      },
      {
        name: 'Jerry Ferrara',
      },
    ],
    coverUrl: '/movies_pictures/21039597_20130913113752098.webp',
    releaseDate: '2013-11-01',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Braquage à l'ancienne",
    director: 'Zach Braff',
    actors: [
      { name: 'Morgan Freeman' },
      { name: 'Michael Caine' },
      { name: 'Christopher Lloyd' },
      { name: 'Alan Arkin' },
      { name: 'Joey King' },
      { name: 'Ann-Margret' },
      { name: 'Matt Dillon' },
    ],
    coverUrl: '/movies_pictures/313963.jpg',
    releaseDate: '2017-05-12',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Dictateur',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Paulette Goddard',
      },
      {
        name: 'Jack Oakie',
      },
      {
        name: 'Reginald Gardiner',
      },
      {
        name: 'Henry Daniell',
      },
      {
        name: 'Billy Gilbert',
      },
      {
        name: 'Emma Dunn',
      },
    ],
    coverUrl: '/movies_pictures/le-dictateur-affiche.jpg',
    releaseDate: '1940-10-15',
    length: 125,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les Lumières de la ville',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Harry Myers',
      },
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Henry Bergman',
      },
      {
        name: 'Virginia Cherrill',
      },
      {
        name: 'Al Ernest Garcia',
      },
      {
        name: 'Albert Austin',
      },
      {
        name: 'Granville Redmond',
      },
    ],
    coverUrl: '/movies_pictures/3312868.webp',
    releaseDate: '1931-01-30',
    length: 87,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 1,
  },
  {
    title: "La Ruée vers l'or",
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Mack Swain',
      },
      {
        name: 'Tom Murray',
      },
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Georgia Hale',
      },
      {
        name: 'Henry Bergman',
      },
      {
        name: 'Albert Austin',
      },
      {
        name: 'Tiny Sandford',
      },
    ],
    coverUrl: '/movies_pictures/82fae46a6d1a382c74dfe48b25205187.jpg',
    releaseDate: '1925-06-26',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 1,
  },
  {
    title: 'Les Tontons flingueurs',
    director: 'Georges Lautner',
    actors: [
      {
        name: 'Lino Ventura',
      },
      {
        name: 'Bernard Blier',
      },
      {
        name: 'Jean Lefebvre',
      },
      {
        name: 'Francis Blanche',
      },
      {
        name: 'Venantino Venantini',
      },
      {
        name: 'Robert Dalban',
      },
      {
        name: 'Claude Rich',
      },
    ],
    coverUrl: '/movies_pictures/gdsgdgdrgr.webp',
    releaseDate: '1963-11-20',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Sunshine Cleaning',
    director: 'Christine Jeffs',
    actors: [
      {
        name: 'Amy Adams',
      },
      {
        name: 'Emily Blunt',
      },
      {
        name: 'Alan Arkin',
      },
      {
        name: 'Jason Spevack',
      },
      {
        name: 'Steve Zahn',
      },
      {
        name: 'Mary Lynn Rajskub',
      },
      {
        name: 'Clifton Collins Jr.',
      },
    ],
    coverUrl: '/movies_pictures/19117595.jpg',
    releaseDate: '2008-01-01',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Neuilly, sa mère !',
    director: 'Gabriel Julien-Laferrière',
    actors: [
      {
        name: 'Samy Seghir',
      },
      {
        name: 'Jérémy Denisty',
      },
      {
        name: 'Rachida Brakni',
      },
      {
        name: 'Denis Podalydès',
      },
      {
        name: 'Chloé Coulloud',
      },
      {
        name: 'Joséphine Japy',
      },
      {
        name: 'Farida Khelfa',
      },
    ],
    coverUrl: '/movies_pictures/a2c6d0a9fee6.jpg',
    releaseDate: '2008-01-01',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Neuilly, sa mère sa mère',
    director: 'Gabriel Julien-Laferrière',
    actors: [
      {
        name: 'Samy Seghir',
      },
      {
        name: 'Jérémy Denisty',
      },
      {
        name: 'Denis Podalydès',
      },
      {
        name: 'Sophia Aram',
      },
      {
        name: 'Joséphine Japy',
      },
      {
        name: 'Julien Courbey',
      },
      {
        name: 'Booder',
      },
    ],
    coverUrl: '/movies_pictures/9b3167b6902e.jpg',
    releaseDate: '2017-08-08',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jack Mimoun et les Secrets de Val Verde',
    director: 'Ludovic Bernard',
    actors: [
      {
        name: 'Malik Bentalha',
      },
      {
        name: 'Benoît Magimel',
      },
      {
        name: 'Jérôme Commandeur',
      },
      {
        name: 'François Damiens',
      },
      {
        name: 'Joséphine Japy',
      },
    ],
    coverUrl: '/movies_pictures/3604583.jpg',
    releaseDate: '2022-01-01',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les petits mouchoirs',
    director: 'Guillaume Canet',
    actors: [
      {
        name: 'François Cluzet',
      },
      {
        name: 'Marion Cotillard',
      },
      {
        name: 'Benoît Magimel',
      },
      {
        name: 'Gilles Lellouche',
      },
      {
        name: 'Jean Dujardin',
      },
      {
        name: 'Anne Marivin',
      },
      {
        name: 'Pascale Arbillot',
      },
    ],
    coverUrl: '/movies_pictures/19505586.webp',
    releaseDate: '2010-01-01',
    length: 154,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un plus une',
    director: 'Claude Lelouch',
    actors: [
      {
        name: 'Jean Dujardin',
      },
      {
        name: 'Elsa Zylberstein',
      },
      {
        name: 'Christopher Lambert',
      },
      {
        name: 'Alice Pol',
      },
      {
        name: 'Rahul Vohra',
      },
      {
        name: 'Shriya Pilgaonkar',
      },
      {
        name: 'Venantino Venantini',
      },
    ],
    coverUrl: '/movies_pictures/016306.webp',
    releaseDate: '2015-01-01',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un homme à la hauteur',
    director: 'Laurent Tirard',
    actors: [
      {
        name: 'Jean Dujardin',
      },
      {
        name: 'Virginie Efira',
      },
      {
        name: 'Cédric Kahn',
      },
      {
        name: 'Camille Damour',
      },
    ],
    coverUrl: '/movies_pictures/234297.webp',
    releaseDate: '2016-01-01',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le père Noël est une ordure',
    director: 'Jean-Marie Poiré',
    actors: [
      {
        name: 'Gérard Jugnot',
      },
      {
        name: 'Thierry Lhermitte',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Marie-Anne Chazel',
      },
      {
        name: 'Anémone',
      },
      {
        name: 'Bruno Moynot',
      },
      {
        name: 'Martin Lamotte',
      },
    ],
    coverUrl: '/movies_pictures/fsfsdfddf.jpg',
    releaseDate: '1982-01-01',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Seuls Two',
    director: 'David Charhon',
    actors: [
      {
        name: 'Benoît Magimel',
      },
      {
        name: 'Édouard Baer',
      },
      {
        name: 'Élodie Bouchez',
      },
      {
        name: 'Éric Judor',
      },
      {
        name: 'François Damiens',
      },
      {
        name: 'Fred Testot',
      },
      {
        name: 'Hafid Ferdjioui Benamar',
      },
    ],
    coverUrl: '/movies_pictures/18949833.webp',
    releaseDate: '2008-01-01',
    length: 82,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: "Le Fabuleux Destin d'Amélie Poulain",
    director: 'Jean-Pierre Jeunet',
    actors: [
      {
        name: 'Audrey Tautou',
      },
      {
        name: 'Mathieu Kassovitz',
      },
      {
        name: 'Jamel Debbouze',
      },
      {
        name: 'Dominique Pinon',
      },
      {
        name: 'Yolande Moreau',
      },
      {
        name: 'André Dussollier',
      },
      {
        name: 'Isabelle Nanty',
      },
    ],
    coverUrl: '/movies_pictures/c0391db4-96d2-4f7d-a138-6545911ace7b.webp',
    releaseDate: '2001-01-01',
    length: 122,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Les trois frères',
    director: 'Didier Bourdon',
    actors: [
      {
        name: 'Didier Bourdon',
      },
      {
        name: 'Bernard Campan',
      },
      {
        name: 'Pascal Légitimus',
      },
      {
        name: 'Antoine du Merle',
      },
      {
        name: 'Anne Jacquemin',
      },
      {
        name: 'Marine Jolivet',
      },
      {
        name: 'Annick Alane',
      },
    ],
    coverUrl: '/movies_pictures/affiche-les_trois_freres.jpg',
    releaseDate: '1995-01-01',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: "Qu'est-ce qu'on a fait au bon dieu ?",
    director: 'Philippe de Chauveron',
    actors: [
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Chantal Lauby',
      },
      {
        name: 'Ary Abittan',
      },
      {
        name: 'Medi Sadoun',
      },
      {
        name: 'Frédéric Chau',
      },
      {
        name: 'Noom Diawara',
      },
      {
        name: 'Frédérique Bel',
      },
    ],
    coverUrl: '/movies_pictures/474265.webp',
    releaseDate: '2014-01-01',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Babysitting',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Alice David',
      },
      {
        name: 'Charlotte Gabris',
      },
      {
        name: 'Clotilde Courau',
      },
      {
        name: 'David Marsais',
      },
      {
        name: 'David Salles',
      },
      {
        name: 'Enzo Tomasini',
      },
      {
        name: 'Gérard Jugnot',
      },
    ],
    coverUrl: '/movies_pictures/509268.jpg',
    releaseDate: '2014-01-01',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Babysitting 2',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Philippe Lacheau',
      },
      {
        name: 'Alice David',
      },
      {
        name: 'Vincent Desagnat',
      },
      {
        name: 'Tarek Boudali',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Grégoire Ludig',
      },
      {
        name: 'Élodie Fontan',
      },
    ],
    coverUrl: '/movies_pictures/599783.jpg',
    releaseDate: '2015-01-01',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: "Bienvenue chez les Ch'tis",
    director: 'Dany Boon',
    actors: [
      {
        name: 'Kad Merad',
      },
      {
        name: 'Dany Boon',
      },
      {
        name: 'Zoé Félix',
      },
      {
        name: 'Anne Marivin',
      },
      {
        name: 'Line Renaud',
      },
      {
        name: 'Stéphane Freiss',
      },
      {
        name: 'Michel Galabru',
      },
    ],
    coverUrl: '/movies_pictures/18889951.jpg',
    releaseDate: '2008-01-01',
    length: 106,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les Beaux Gosses',
    director: 'Riad Sattouf',
    actors: [
      {
        name: 'Anthony Sonigo',
      },
      {
        name: 'Cartman',
      },
      {
        name: 'Emmanuelle Devos',
      },
      {
        name: 'Fred Neidhardt',
      },
      {
        name: 'Irène Jacob',
      },
      {
        name: 'Jean-Pierre Haigneré',
      },
      {
        name: 'Marjane Satrapi',
      },
    ],
    coverUrl: '/movies_pictures/19104712.webp',
    releaseDate: '2009-01-01',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Un singe en hiver',
    director: 'Henri Verneuil',
    actors: [
      {
        name: 'Jean Gabin',
      },
      {
        name: 'Jean-Paul Belmondo',
      },
      {
        name: 'Suzanne Flon',
      },
      {
        name: 'Noël Roquevert',
      },
      {
        name: 'Paul Frankeur',
      },
      {
        name: 'André Dalibert',
      },
      {
        name: 'Anne-Marie Coffinet',
      },
    ],
    coverUrl: '/movies_pictures/21047625_20131008153522592.webp',
    releaseDate: '1962-01-01',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Tais-toi',
    director: 'Francis Veber',
    actors: [
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Jean Reno',
      },
      {
        name: 'Leonor Varela',
      },
      {
        name: 'Richard Berry',
      },
      {
        name: 'André Dussollier',
      },
      {
        name: 'Aurélien Recoing',
      },
      {
        name: 'Ticky Holgado',
      },
    ],
    coverUrl: '/movies_pictures/affiche (5).webp',
    releaseDate: '2003-01-01',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'La vérité si je mens !',
    director: 'Thomas Gilou',
    actors: [
      {
        name: 'Richard Bohringer',
      },
      {
        name: 'Vincent Elbaz',
      },
      {
        name: 'Bruno Solo',
      },
      {
        name: 'Anthony Delon',
      },
      {
        name: 'Richard Anconina',
      },
      {
        name: 'Gilbert Melki',
      },
      {
        name: 'Amira Casar',
      },
    ],
    coverUrl: '/movies_pictures/18908004.jpg',
    releaseDate: '1997-01-01',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Steak',
    director: 'Quentin Dupieux',
    actors: [
      {
        name: 'Annette Garant',
      },
      {
        name: 'Éric Judor',
      },
      {
        name: 'Hugolin Chevrette-Landesque',
      },
      {
        name: 'Jacky Lambert',
      },
      {
        name: 'Jean-François Boudreau',
      },
      {
        name: 'Jonathan Lambert',
      },
      {
        name: 'KΔVINϟKY',
      },
    ],
    coverUrl: '/movies_pictures/18772761.webp',
    releaseDate: '2007-01-01',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Pour le pire et pour le meilleur',
    director: 'James L. Brooks',
    actors: [
      {
        name: 'Jack Nicholson',
      },
      {
        name: 'Helen Hunt',
      },
      {
        name: 'Greg Kinnear',
      },
      {
        name: 'Cuba Gooding Jr.',
      },
      {
        name: 'Skeet Ulrich',
      },
      {
        name: 'Shirley Knight',
      },
      {
        name: 'Yeardley Smith',
      },
    ],
    coverUrl: '/movies_pictures/4df3molkndn0hqngrqj0uwnjg2t-417.jpg',
    releaseDate: '1997-12-23',
    length: 139,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Happiness Therapy',
    director: 'David O. Russell',
    actors: [
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Jacki Weaver',
      },
      {
        name: 'Chris Tucker',
      },
      {
        name: 'Anupam Kher',
      },
      {
        name: 'Shea Whigham',
      },
    ],
    coverUrl: '/movies_pictures/20302958.jpg',
    releaseDate: '2012-12-25',
    length: 122,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hysteria',
    director: 'Tanya Wexler',
    actors: [
      {
        name: 'Maggie Gyllenhaal',
      },
      {
        name: 'Hugh Dancy',
      },
      {
        name: 'Felicity Jones',
      },
      {
        name: 'Rupert Everett',
      },
      {
        name: 'Jonathan Pryce',
      },
      {
        name: 'Ashley Jensen',
      },
      {
        name: 'Gemma Jones',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BNjg5NjU0MTM4N15BMl5BanBnXkFtZTgwMjU1NDQzMjE@._V1_.jpg',
    releaseDate: '2011-09-15',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Love and Friendship',
    director: 'Whit Stillman',
    actors: [
      {
        name: 'Kate Beckinsale',
      },
      {
        name: 'Xavier Samuel',
      },
      {
        name: 'Emma Greenwell',
      },
      {
        name: 'Morfydd Clark',
      },
      {
        name: 'Jemma Redgrave',
      },
      {
        name: 'Tom Bennett',
      },
      {
        name: 'James Fleet',
      },
    ],
    coverUrl: '/movies_pictures/030703.webp',
    releaseDate: '2016-05-13',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ça chauffe au lycée Ridgemont',
    director: 'Amy Heckerling',
    actors: [
      {
        name: 'Sean Penn',
      },
      {
        name: 'Jennifer Jason Leigh',
      },
      {
        name: 'Judge Reinhold',
      },
      {
        name: 'Phoebe Cates',
      },
      {
        name: 'Brian Backer',
      },
      {
        name: 'Robert Romanus',
      },
      {
        name: 'Ray Walston',
      },
    ],
    coverUrl: '/movies_pictures/chauffe-au-lycee-ridgemont-6b0c353288.jpg',
    releaseDate: '1982-08-13',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "L'Étoile de Harlem",
    director: 'Bill Duke',
    actors: [{ name: 'Forest Whitaker' }],
    coverUrl: '/movies_pictures/sdsdsddsdsds.jpg',
    releaseDate: '1991-05-03',
    length: 108,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Boogie Woogie',
    director: 'Duncan Ward',
    actors: [
      {
        name: 'Gillian Anderson',
      },
      {
        name: 'Alan Cumming',
      },
      {
        name: 'Heather Graham',
      },
      {
        name: 'Danny Huston',
      },
      {
        name: 'Christopher Lee',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Charlotte Rampling',
      },
    ],
    coverUrl: '/movies_pictures/71xCb0YL0GL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2009-06-12',
    length: 94,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'A Bag of Hammers',
    director: 'Brian Crano',
    actors: [
      {
        name: 'Jason Ritter',
      },
      {
        name: 'Jake Sandvig',
      },
      {
        name: 'Chandler Canterbury',
      },
      {
        name: 'Rebecca Hall',
      },
      {
        name: 'Todd Louiso',
      },
      {
        name: 'Gabriel Macht',
      },
      {
        name: 'Sally Kirkland',
      },
    ],
    coverUrl: '/movies_pictures/20035801.webp',
    releaseDate: '2011-06-10',
    length: 85,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Winter Break',
    director: 'Alexander Payne',
    actors: [
      { name: 'Paul Giamatti' },
      { name: "Da'Vine Joy Randolph" },
      { name: 'Dominic Sessa' },
      { name: 'Carrie Preston' },
      { name: 'Brady Hepner' },
      { name: 'Gilligan Vigman' },
      { name: 'Tate Donovan' },
    ],
    coverUrl: '/movies_pictures/e048afd5c841.jpg',
    releaseDate: '2023-11-10',
    length: 133,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Jouer avec le feu',
    director: 'Florian Desmoulins',
    actors: [
      { name: 'Karim Belkhadra' },
      { name: 'Constantin Briest' },
      { name: 'Audrey Dana' },
      { name: 'Julien Baumgartner' },
      { name: 'François Berléand' },
      { name: 'Éric Elmosnino' },
      { name: 'Valérie Bonneton' },
    ],
    coverUrl:
      '/movies_pictures/MV5BNmFlYTQ2NjgtNGE3MC00ODk4LWFjMWQtOTlkMjRjZjAwNTczXkEyXkFqcGc@._V1_QL75_UY207_CR14,0,140,207_.jpg',
    releaseDate: '2011-02-01',
    length: 0,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Wolfs',
    director: 'Jon Watts',
    actors: [
      { name: 'George Clooney' },
      { name: 'Brad Pitt' },
      { name: 'Amy Ryan' },
      { name: 'Austin Abrams' },
      { name: 'Poorna Jagannathan' },
      { name: 'Michael Cohen' },
      { name: 'Zlatko Burić' },
    ],
    coverUrl: '/movies_pictures/af04164512a5.jpg',
    releaseDate: '2024-09-27',
    length: 108,
    genre: ['Comédie', 'Policier', 'Thriller'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ave, César',
    director: 'Ethan Coen, Joel Coen',
    actors: [
      { name: 'Josh Brolin' },
      { name: 'George Clooney' },
      { name: 'Alden Ehrenreich' },
      { name: 'Scarlett Johansson' },
      { name: 'Channing Tatum' },
      { name: 'Tilda Swinton' },
      { name: 'Ralph Fiennes' },
    ],
    coverUrl: '/movies_pictures/e20042b8b823.jpg',
    releaseDate: '2016-02-05',
    length: 106,
    genre: ['Comédie', 'Drame', 'Mystère'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Les Banshees d'Inisherin",
    director: 'Martin McDonagh',
    actors: [
      { name: 'Colin Farrell' },
      { name: 'Brendan Gleeson' },
      { name: 'Kerry Condon' },
      { name: 'Barry Keoghan' },
      { name: 'Pat Shortt' },
      { name: 'Gary Lydon' },
      { name: 'Jon Kenny' },
    ],
    coverUrl: '/movies_pictures/5530bc434fc9.jpg',
    releaseDate: '2022-11-04',
    length: 114,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Irlande'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Booksmart',
    director: 'Olivia Wilde',
    actors: [
      { name: 'Kaitlyn Dever' },
      { name: 'Beanie Feldstein' },
      { name: 'Jessica Williams' },
      { name: 'Lisa Kudrow' },
      { name: 'Jason Sudeikis' },
      { name: 'Will Forte' },
      { name: 'Skyler Gisondo' },
    ],
    coverUrl: '/movies_pictures/cef7ac5785a5.jpg',
    releaseDate: '2019-05-24',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Poker Face',
    director: '',
    actors: [
      { name: 'Natasha Lyonne' },
      { name: 'Simon Helberg' },
      { name: 'Benjamin Bratt' },
      { name: 'Adrien Brody' },
      { name: 'Judith Light' },
      { name: 'Ellen Barkin' },
      { name: 'Chloë Sevigny' },
    ],
    coverUrl: '/movies_pictures/96b6931c2548.jpg',
    releaseDate: '2023-01-26',
    length: 0,
    genre: ['Comédie', 'Policier', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'My Dinner with Andrew',
    director: 'Tim Ryan',
    actors: [{ name: 'Bob Glouberman' }, { name: 'Tim Ryan' }],
    coverUrl:
      '/movies_pictures/MV5BYWE3OTcwYTUtNzIyMy00OTMwLWFiNjMtZjljMjM4ZDU5NDg0XkEyXkFqcGc@._V1_.jpg',
    releaseDate: '',
    length: 0,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Family Man',
    director: 'Brett Ratner',
    actors: [
      { name: 'Nicolas Cage' },
      { name: 'Téa Leoni' },
      { name: 'Don Cheadle' },
      { name: 'Jeremy Piven' },
      { name: 'Saul Rubinek' },
      { name: 'Lisa Thornhill' },
      { name: 'Makenzie Vega' },
    ],
    coverUrl: '/movies_pictures/29999f5194d8.jpg',
    releaseDate: '2000-12-22',
    length: 125,
    genre: ['Comédie', 'Drame', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'They Might Be Giants',
    director: 'Anthony Harvey',
    actors: [
      {
        name: 'George C. Scott',
      },
      {
        name: 'Joanne Woodward',
      },
      {
        name: 'Al Lewis',
      },
      {
        name: 'Jack Gilford',
      },
      {
        name: 'Rue McClanahan',
      },
      {
        name: 'Theresa Merritt',
      },
      {
        name: 'Frances Fuller',
      },
    ],
    coverUrl: '/movies_pictures/8d82c86a0233.jpg',
    releaseDate: '1971-06-09',
    length: 91,
    genre: ['Comédie', 'Romance', 'Mystère'],
    saga: 'Sherlock Holmes',
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'Les Aventures de Sherlock Holmes',
      secondEntityKey: 'Arthur Conan Doyle',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Without a clue',
    director: 'Thom Eberhardt',
    actors: [
      {
        name: 'Michael Caine',
      },
      {
        name: 'Ben Kingsley',
      },
      {
        name: 'Jeffrey Jones',
      },
      {
        name: 'Paul Freeman',
      },
      {
        name: 'Nigel Davenport',
      },
      {
        name: 'Lysette Anthony',
      },
      {
        name: 'John Warner',
      },
    ],
    coverUrl: '/movies_pictures/165bb557a33a.jpg',
    releaseDate: '1988-10-21',
    length: 107,
    genre: ['Comédie', 'Mystère'],
    saga: 'Sherlock Holmes',
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'Les Aventures de Sherlock Holmes',
      secondEntityKey: 'Arthur Conan Doyle',
    },
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Holmes & Watson',
    director: 'Etan Cohen',
    actors: [
      {
        name: 'Will Ferrell',
      },
      {
        name: 'John C. Reilly',
      },
      {
        name: 'Kelly Macdonald',
      },
      {
        name: 'Rebecca Hall',
      },
      {
        name: 'Ralph Fiennes',
      },
      {
        name: 'Lauren Lapkus',
      },
      {
        name: 'Hugh Laurie',
      },
    ],
    coverUrl: '/movies_pictures/30c785712da4.jpg',
    releaseDate: '2018-12-25',
    length: 89,
    genre: ['Comédie', 'Mystère'],
    saga: 'Sherlock Holmes',
    description: '',
    fromEntity: {
      entityType: 'book' as const,
      title: 'Les Aventures de Sherlock Holmes',
      secondEntityKey: 'Arthur Conan Doyle',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Bagdad Café',
    director: 'Percy Adlon',
    actors: [
      { name: 'Marianne Sägebrecht' },
      { name: 'CCH Pounder' },
      { name: 'Jack Palance' },
      { name: 'Christine Kaufmann' },
      { name: 'Darron Flagg' },
      { name: 'Johnny Nickel' },
      { name: 'Hans Stadlbauer' },
    ],
    coverUrl: '/movies_pictures/6263c71e6952.jpg',
    releaseDate: '1988-04-22',
    length: 95,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Allemagne'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Before Sunrise',
    director: 'Richard Linklater',
    actors: [
      { name: 'Ethan Hawke' },
      { name: 'Julie Delpy' },
      { name: 'Andrea Eckert' },
      { name: 'Hanno Pöschl' },
      { name: 'Karl Bruckschwaiger' },
      { name: 'Erni Mangold' },
      { name: 'Haymon Maria Buttinger' },
    ],
    coverUrl: '/movies_pictures/9749c107c5c5.jpg',
    releaseDate: '1995-01-27',
    length: 101,
    genre: ['Comédie', 'Drame', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Samba',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Adel Bencherif',
      },
      {
        name: 'Catherine Davenier',
      },
      {
        name: 'Charlotte Gainsbourg',
      },
      {
        name: 'Christiane Millet',
      },
      {
        name: 'Clotilde Mollet',
      },
      {
        name: 'Éric Toledano',
      },
      {
        name: 'Hélène Vincent',
      },
    ],
    coverUrl: '/movies_pictures/5549252be6fd.jpg',
    releaseDate: '2014-10-15',
    length: 118,
    genre: ['Comédie', 'Drame', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Hors normes',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Vincent Cassel',
      },
      {
        name: 'Reda Kateb',
      },
      {
        name: 'Hélène Vincent',
      },
      {
        name: 'Darren Muselet',
      },
      {
        name: 'Lyna Khoudri',
      },
    ],
    coverUrl: '/movies_pictures/b29734b8f2e0.jpg',
    releaseDate: '2019-03-25',
    length: 114,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Tellement proches',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Alain Guillo',
      },
      {
        name: 'Arsène Mosca',
      },
      {
        name: 'Ary Abittan',
      },
      {
        name: 'Audrey Dana',
      },
      {
        name: 'Catherine Hosmalin',
      },
      {
        name: 'Charlie Dupont',
      },
      {
        name: 'Cyril Couton',
      },
    ],
    coverUrl: '/movies_pictures/cc99e6df0c7e.jpg',
    releaseDate: '2009-06-17',
    length: 102,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Émotifs anonymes',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Benoît Poelvoorde',
      },
      {
        name: 'Isabelle Carré',
      },
      {
        name: 'Jacques Boudet',
      },
      {
        name: 'Lorella Cravotta',
      },
      {
        name: 'Lise Lamétrie',
      },
      {
        name: 'Alice Pol',
      },
      {
        name: 'Céline Duhamel',
      },
    ],
    coverUrl: '/movies_pictures/cc0469025f2b.jpg',
    releaseDate: '2010-12-22',
    length: 80,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France', 'Belgique'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Demain tout commence',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Omar Sy',
      },
      {
        name: 'Clémence Poésy',
      },
      {
        name: 'Antoine Bertrand',
      },
      {
        name: 'Ashley Walters',
      },
      {
        name: 'Clémentine Célarié',
      },
      {
        name: 'Raquel Cassidy',
      },
      {
        name: 'Ruben Alves',
      },
    ],
    coverUrl: '/movies_pictures/3b9b65058891.jpg',
    releaseDate: '2016-12-21',
    length: 118,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Le Sens de la fête',
    director: 'Éric Toledano, Olivier Nakache',
    actors: [
      {
        name: 'Jean-Pierre Bacri',
      },
      {
        name: 'Gilles Lellouche',
      },
      {
        name: 'Jean-Paul Rouve',
      },
      {
        name: 'Hélène Vincent',
      },
      {
        name: 'Suzanne Clément',
      },
      {
        name: 'Benjamin Lavernhe',
      },
      {
        name: 'Judith Chemla',
      },
    ],
    coverUrl: '/movies_pictures/dd349fc8a404.jpg',
    releaseDate: '2017-10-04',
    length: 117,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Chacun pour tous',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Ahmed Sylla',
      },
      {
        name: 'Jean-Pierre Darroussin',
      },
      {
        name: 'Camélia Jordana',
      },
      {
        name: 'Olivier Barthélémy',
      },
      {
        name: 'David Boring',
      },
      {
        name: 'Thomas de Pourquery',
      },
    ],
    coverUrl: '/movies_pictures/4242dd9f74ba.jpg',
    releaseDate: '2018-10-17',
    length: 122,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: '10 jours sans maman',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Aure Atika',
      },
      {
        name: 'Alexis Michalik',
      },
      {
        name: 'Héléna Noguerra',
      },
      {
        name: 'Violette Guillon',
      },
      {
        name: 'Evan Paturel',
      },
      {
        name: 'Ilan Debrabant',
      },
    ],
    coverUrl: '/movies_pictures/1503e35993cc.jpeg',
    releaseDate: '2023-04-12',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: '10 jours encore sans maman',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Aure Atika',
      },
      {
        name: 'Alexis Michalik',
      },
      {
        name: 'Alice David',
      },
      {
        name: 'Swan Joulin',
      },
      {
        name: 'Violette Guillon',
      },
      {
        name: 'Ilan Debrabant',
      },
    ],
    coverUrl: '/movies_pictures/a5c44d589de5.jpg',
    releaseDate: '2024-04-10',
    length: 91,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Matchstick Men',
    director: 'Ridley Scott',
    actors: [
      {
        name: 'Nicolas Cage',
      },
      {
        name: 'Sam Rockwell',
      },
      {
        name: 'Alison Lohman',
      },
      {
        name: 'Bruce Altman',
      },
      {
        name: 'Bruce McGill',
      },
      {
        name: "Jenny O'Hara",
      },
      {
        name: 'Steve Eastin',
      },
    ],
    coverUrl: '/movies_pictures/f70865bf87a9.jpg',
    releaseDate: '2003-09-12',
    length: 116,
    genre: ['Comédie', 'Drame', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'After Hours',
    director: 'Martin Scorsese',
    actors: [
      {
        name: 'Rosanna Arquette',
      },
      {
        name: 'Verna Bloom',
      },
      {
        name: 'Tommy Chong',
      },
      {
        name: 'Linda Fiorentino',
      },
      {
        name: 'Teri Garr',
      },
      {
        name: 'John Heard',
      },
      {
        name: 'Cheech Marin',
      },
    ],
    coverUrl: '/movies_pictures/47e9bc67b89a.jpg',
    releaseDate: '1985-09-13',
    length: 97,
    genre: ['Comédie', 'Thriller', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Inherent Vice',
    director: 'Paul Thomas Anderson',
    actors: [
      {
        name: 'Benicio del Toro',
      },
      {
        name: 'Jeannie Berlin',
      },
      {
        name: 'Joaquin Phoenix',
      },
      {
        name: 'Josh Brolin',
      },
      {
        name: "Kevin J. O'Connor",
      },
      {
        name: 'Martin Short',
      },
      {
        name: 'Owen Wilson',
      },
    ],
    coverUrl: '/movies_pictures/1f3a191b0c7f.jpg',
    releaseDate: '2014-12-12',
    length: 148,
    genre: ['Comédie', 'Policier', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Licorice Pizza',
    director: 'Paul Thomas Anderson',
    actors: [
      {
        name: 'Alana Haim',
      },
      {
        name: 'Cooper Hoffman',
      },
      {
        name: 'Sean Penn',
      },
      {
        name: 'Tom Waits',
      },
      {
        name: 'Bradley Cooper',
      },
      {
        name: 'Maya Rudolph',
      },
      {
        name: 'Skyler Gisondo',
      },
    ],
    coverUrl: '/movies_pictures/5633e846dd8d.jpg',
    releaseDate: '2021-11-26',
    length: 133,
    genre: ['Comédie', 'Drame', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Army of Darkness',
    director: 'Sam Raimi',
    actors: [
      {
        name: 'Embeth Davidtz',
      },
      {
        name: 'Bruce Campbell',
      },
      {
        name: 'Marcus Gilbert',
      },
      {
        name: 'Ted Raimi',
      },
      {
        name: 'Bridget Fonda',
      },
      {
        name: 'Bill Moseley',
      },
      {
        name: 'Ian Abercrombie',
      },
    ],
    coverUrl: '/movies_pictures/c5ca3d9a8050.jpg',
    releaseDate: '1993-02-19',
    length: 81,
    genre: ['Comédie', 'Fantastique', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'On the Rocks',
    director: 'Sofia Coppola',
    actors: [
      {
        name: 'Bill Murray',
      },
      {
        name: 'Rashida Jones',
      },
      {
        name: 'Marlon Wayans',
      },
      {
        name: 'Jessica Henwick',
      },
      {
        name: 'Jenny Slate',
      },
      {
        name: 'Liyanna Muscat',
      },
      {
        name: 'Barbara Bain',
      },
    ],
    coverUrl: '/movies_pictures/aaa4112420be.jpg',
    releaseDate: '2020-10-02',
    length: 96,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'American Graffiti',
    director: 'George Lucas',
    actors: [
      {
        name: 'Candy Clark',
      },
      {
        name: 'Ron Howard',
      },
      {
        name: 'Richard Dreyfuss',
      },
      {
        name: 'Cindy Williams',
      },
      {
        name: 'Mackenzie Phillips',
      },
      {
        name: 'Charles Martin Smith',
      },
      {
        name: 'Wolfman Jack',
      },
    ],
    coverUrl: '/movies_pictures/997f4d7dc7ab.jpg',
    releaseDate: '1973-08-11',
    length: 110,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Kid',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Jackie Coogan',
      },
      {
        name: 'Carl Miller',
      },
      {
        name: 'Edna Purviance',
      },
      {
        name: 'Albert Austin',
      },
      {
        name: 'Beulah Bains',
      },
      {
        name: 'Nellie Bly Baker',
      },
    ],
    coverUrl: '/movies_pictures/7694fead40aa.jpg',
    releaseDate: '1921-02-06',
    length: 68,
    genre: ['Comédie', 'Drame', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "La ruée vers l'or",
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Mack Swain',
      },
      {
        name: 'Tom Murray',
      },
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Georgia Hale',
      },
      {
        name: 'Henry Bergman',
      },
      {
        name: 'Albert Austin',
      },
      {
        name: 'Tiny Sandford',
      },
    ],
    coverUrl: '/movies_pictures/463e45a82b00.jpg',
    releaseDate: '1925-06-26',
    length: 95,
    genre: ['Comédie', 'Aventure', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'The Circus',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Al Ernest Garcia',
      },
      {
        name: 'Merna Kennedy',
      },
      {
        name: 'Henry Bergman',
      },
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Tiny Sandford',
      },
      {
        name: 'Albert Austin',
      },
      {
        name: 'Hugh Saxon',
      },
    ],
    coverUrl: '/movies_pictures/8daa41db4142.jpg',
    releaseDate: '1928-01-06',
    length: 72,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Monsieur Verdoux',
    director: 'Charlie Chaplin',
    actors: [
      {
        name: 'Martha Raye',
      },
      {
        name: 'William Frawley',
      },
      {
        name: 'Marilyn Nash',
      },
      {
        name: 'Charlie Chaplin',
      },
      {
        name: 'Isobel Elsom',
      },
      {
        name: 'Edna Purviance',
      },
      {
        name: 'Fritz Leiber',
      },
    ],
    coverUrl: '/movies_pictures/c0720db1aac9.jpg',
    releaseDate: '1947-04-11',
    length: 124,
    genre: ['Comédie', 'Policier', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Austin Powers dans Goldmember',
    director: 'Jay Roach',
    actors: [
      {
        name: 'Mike Myers',
      },
      {
        name: 'Beyoncé',
      },
      {
        name: 'Michael Caine',
      },
      {
        name: 'Seth Green',
      },
      {
        name: 'Michael York',
      },
      {
        name: 'Verne Troyer',
      },
      {
        name: 'Mindy Sterling',
      },
    ],
    coverUrl: '/movies_pictures/6f1732146283.jpg',
    releaseDate: '2002-07-26',
    length: 94,
    genre: ['Comédie'],
    saga: 'Austin Powers',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Austin Powers - L'Espion qui m'a tirée",
    director: 'Jay Roach',
    actors: [
      {
        name: 'Mike Myers',
      },
      {
        name: 'Elizabeth Hurley',
      },
      {
        name: 'Michael York',
      },
      {
        name: 'Mimi Rogers',
      },
      {
        name: 'Robert Wagner',
      },
      {
        name: 'Seth Green',
      },
      {
        name: 'Fabiana Udenio',
      },
    ],
    coverUrl: '/movies_pictures/5f6dc67749a0.jpg',
    releaseDate: '1997-05-02',
    length: 94,
    genre: ['Comédie'],
    saga: 'Austin Powers',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Johnny English',
    director: 'Peter Howitt',
    actors: [
      {
        name: 'Rowan Atkinson',
      },
      {
        name: 'Natalie Imbruglia',
      },
      {
        name: 'John Malkovich',
      },
      {
        name: 'Ben Miller',
      },
      {
        name: 'Greg Wise',
      },
      {
        name: 'Tasha de Vasconcelos',
      },
      {
        name: 'Douglas McFerran',
      },
    ],
    coverUrl: '/movies_pictures/fc330392805f.jpg',
    releaseDate: '2003-04-06',
    length: 88,
    genre: ['Comédie', 'Action'],
    saga: 'Johnny English',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni', 'France', 'États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Johnny English, le retour',
    director: 'Oliver Parker',
    actors: [
      {
        name: 'Rowan Atkinson',
      },
      {
        name: 'Rosamund Pike',
      },
      {
        name: 'Dominic West',
      },
      {
        name: 'Gillian Anderson',
      },
      {
        name: 'Daniel Kaluuya',
      },
      {
        name: 'Richard Schiff',
      },
      {
        name: 'Tim McInnerny',
      },
    ],
    coverUrl: '/movies_pictures/bd193410e596.jpg',
    releaseDate: '2011-09-15',
    length: 101,
    genre: ['Comédie', 'Action'],
    saga: 'Johnny English',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni', 'France', 'États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Johnny English 3 : Contre-attaque',
    director: 'David Kerr',
    actors: [
      {
        name: 'Rowan Atkinson',
      },
      {
        name: 'Olga Kurylenko',
      },
      {
        name: 'Ben Miller',
      },
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Jake Lacy',
      },
      {
        name: 'Miranda Hennessy',
      },
      {
        name: 'Adam James',
      },
    ],
    coverUrl: '/movies_pictures/f9ebf7618bc7.jpg',
    releaseDate: '2018-10-05',
    length: 88,
    genre: ['Comédie', 'Action'],
    saga: 'Johnny English',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni', 'France', 'États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: "Y a-t-il un pilote dans l'avion ?",
    director: 'Jim Abrahams, David Zucker, Jerry Zucker',
    actors: [
      {
        name: 'Robert Hays',
      },
      {
        name: 'Julie Hagerty',
      },
      {
        name: 'Leslie Nielsen',
      },
      {
        name: 'Robert Stack',
      },
      {
        name: 'Lloyd Bridges',
      },
      {
        name: 'Peter Graves',
      },
      {
        name: 'Kareem Abdul-Jabbar',
      },
    ],
    coverUrl: '/movies_pictures/629107712b62.jpg',
    releaseDate: '1980-07-02',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Y a-t-il un flic pour sauver le président ?',
    director: 'David Zucker',
    actors: [
      {
        name: 'Leslie Nielsen',
      },
      {
        name: 'Priscilla Presley',
      },
      {
        name: 'George Kennedy',
      },
      {
        name: 'O. J. Simpson',
      },
      {
        name: 'Robert Goulet',
      },
      {
        name: 'Kathleen Freeman',
      },
      {
        name: 'Richard Romanus',
      },
    ],
    coverUrl: '/movies_pictures/6ba63a53dcf5.jpg',
    releaseDate: '1991-06-28',
    length: 85,
    genre: ['Comédie', 'Policier'],
    saga: 'Y a-t-il un flic...',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Y a-t-il un flic pour sauver la reine ?',
    director: 'David Zucker',
    actors: [
      {
        name: 'Leslie Nielsen',
      },
      {
        name: 'Priscilla Presley',
      },
      {
        name: 'Ricardo Montalbán',
      },
      {
        name: 'George Kennedy',
      },
      {
        name: 'O. J. Simpson',
      },
      {
        name: 'Nancy Marchand',
      },
      {
        name: 'John Houseman',
      },
    ],
    coverUrl: '/movies_pictures/f9c261044b6f.jpg',
    releaseDate: '1988-12-02',
    length: 85,
    genre: ['Comédie', 'Policier'],
    saga: 'Y a-t-il un flic...',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Sex Academy',
    director: 'Joel Gallen',
    actors: [
      {
        name: 'Chyler Leigh',
      },
      {
        name: 'Chris Evans',
      },
      {
        name: 'Jaime Pressly',
      },
      {
        name: 'Eric Christian Olsen',
      },
      {
        name: 'Mia Kirshner',
      },
      {
        name: 'Deon Richmond',
      },
      {
        name: 'Eric Jungmann',
      },
    ],
    coverUrl: '/movies_pictures/61ab00831dca.jpg',
    releaseDate: '2001-12-07',
    length: 89,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Mexican Pie',
    director: 'Jason A. Carbone, Mike Fleiss',
    actors: [
      {
        name: 'Eddie Macsalka',
      },
      {
        name: 'Hans Swolfs',
      },
      {
        name: 'Alexander Loyless',
      },
      {
        name: "Johnny 'Kansas' Milord",
      },
      {
        name: 'Bryan Codi',
      },
      {
        name: 'Andrew Ghertner',
      },
      {
        name: 'Matt Huntington',
      },
    ],
    coverUrl: '/movies_pictures/c72c534ebede.jpg',
    releaseDate: '2003-09-24',
    length: 75,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Tucker et Dale fightent le mal',
    director: 'Eli Craig',
    actors: [
      {
        name: 'Tyler Labine',
      },
      {
        name: 'Alan Tudyk',
      },
      {
        name: 'Katrina Bowden',
      },
      {
        name: 'Jesse Moss',
      },
      {
        name: 'Chelan Simmons',
      },
      {
        name: 'Brandon Jay McLaren',
      },
      {
        name: 'Christie Laing',
      },
    ],
    coverUrl: '/movies_pictures/0bbbad00d75a.jpg',
    releaseDate: '2010-01-22',
    length: 89,
    genre: ['Comédie', 'Horreur'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Canada', 'États-Unis', 'Royaume-Uni', 'Inde'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Cinéman',
    director: 'Yann Moix',
    actors: [
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Lucy Gordon',
      },
      {
        name: 'Pierre-François Martin-Laval',
      },
      {
        name: 'Pierre Richard',
      },
      {
        name: 'Anne Marivin',
      },
      {
        name: 'Michel Galabru',
      },
      {
        name: 'Marisa Berenson',
      },
      {
        name: 'Jean-Christophe Bouvet',
      },
    ],
    coverUrl: '/movies_pictures/39816599a642.jpg',
    releaseDate: '2009-10-28',
    length: 90,
    genre: ['Comédie', 'Fantastique', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France', 'Belgique'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Deux heures moins le quart avant Jésus-Christ',
    director: 'Jean Yanne',
    actors: [
      {
        name: 'Coluche',
      },
      {
        name: 'Michel Serrault',
      },
      {
        name: 'Jean Yanne',
      },
      {
        name: 'Françoise Fabian',
      },
      {
        name: 'Michel Auclair',
      },
      {
        name: 'Mimi Coutelier',
      },
      {
        name: 'Darry Cowl',
      },
    ],
    coverUrl: '/movies_pictures/63c7ae9e220c.jpg',
    releaseDate: '1982-10-06',
    length: 97,
    genre: ['Comédie', 'Peplum'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France', 'Tunisie'],
    selectDisplayOrder: 0,
  },

  {
    title: 'Le Nouveau Stagiaire',
    director: 'Nancy Meyers',
    actors: [
      {
        name: 'Robert De Niro',
      },
      {
        name: 'Anne Hathaway',
      },
      {
        name: 'Rene Russo',
      },
      {
        name: 'Anders Holm',
      },
      {
        name: 'Andrew Rannells',
      },
      {
        name: 'Adam DeVine',
      },
      {
        name: 'Zack Pearlman',
      },
    ],
    coverUrl:
      '/movies_pictures/MV5BNDRlMjAyZGEtM2JiYy00ZDE0LWJhY2UtNWE3ZTFkMjk3NTY3XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
    releaseDate: '2015-09-25',
    length: 121,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },

  {
    title: 'Ted',
    director: 'Seth MacFarlane',
    actors: [
      { name: 'Mark Wahlberg' },
      { name: 'Mila Kunis' },
      { name: 'Seth MacFarlane' },
      { name: 'Joel McHale' },
      { name: 'Giovanni Ribisi' },
      { name: 'Patrick Warburton' },
      { name: 'Jessica Stroup' },
    ],
    coverUrl: '/movies_pictures/20196214.webp',
    releaseDate: '2012-06-29',
    length: 106,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Dark Shadows',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Joan Bennett',
      },
      {
        name: 'Louis Edmonds',
      },
      {
        name: 'Jonathan Frid',
      },
      {
        name: 'Grayson Hall',
      },
      {
        name: 'Lara Parker',
      },
      {
        name: 'Kathryn Leigh Scott',
      },
      {
        name: 'David Selby',
      },
    ],
    coverUrl: '/movies_pictures/20078610.jpg',
    releaseDate: '2012-05-11',
    length: 113,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },

  {
    title: 'Alvin et les Chipmunks',
    director: 'Tim Hill',
    actors: [
      {
        name: 'Jason Lee',
      },
      {
        name: 'David Cross',
      },
      {
        name: 'Cameron Richardson',
      },
      {
        name: 'Jane Lynch',
      },
      {
        name: 'Beth Riesgraf',
      },
      {
        name: 'Erin Chambers',
      },
      {
        name: 'Justin Long',
      },
    ],
    coverUrl: '/movies_pictures/Alvin_et_les_Chipmunks.webp',
    releaseDate: '2007-12-14',
    length: 92,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },

  {
    title: 'Comme Cendrillon',
    director: 'Mark Rosman',
    actors: [
      {
        name: 'Hilary Duff',
      },
      {
        name: 'Chad Michael Murray',
      },
      {
        name: 'Dan Byrd',
      },
      {
        name: 'Julie Gonzalo',
      },
      {
        name: 'Madeline Zima',
      },
      {
        name: 'Simon Helberg',
      },
      {
        name: 'Jennifer Coolidge',
      },
    ],
    coverUrl: '/movies_pictures/18378825.webp',
    releaseDate: '2004-07-16',
    length: 95,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Lolita malgré moi',
    director: 'Mark Waters',
    actors: [
      {
        name: 'Lindsay Lohan',
      },
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'Lizzy Caplan',
      },
      {
        name: 'Lacey Chabert',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Tina Fey',
      },
      {
        name: 'Jonathan Bennett',
      },
    ],
    coverUrl: '/movies_pictures/4080aa6749107ac45e4fcd4f90218293.webp',
    releaseDate: '2004-04-30',
    length: 97,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: '30 ans sinon rien',
    director: 'Gary Winick',
    actors: [
      {
        name: 'Jennifer Garner',
      },
      {
        name: 'Judy Greer',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Andy Serkis',
      },
      {
        name: 'Kathy Baker',
      },
      {
        name: 'Christa B. Allen',
      },
      {
        name: 'Renee Olstead',
      },
    ],
    coverUrl: '/movies_pictures/18380155.jpg',
    releaseDate: '2004-04-23',
    length: 98,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Une nana au poil',
    director: 'Mark Rosman',
    actors: [
      {
        name: 'Rachel McAdams',
      },
      {
        name: 'Anna Faris',
      },
      {
        name: 'Matthew Lawrence',
      },
      {
        name: 'Eric Christian Olsen',
      },
      {
        name: 'Robert Davi',
      },
      {
        name: 'Leila Kenzle',
      },
      {
        name: "Michael O'Keefe",
      },
    ],
    coverUrl: '/movies_pictures/71LWzBwndGS._AC_UF894,1000_QL80_.jpg',
    releaseDate: '2003-08-06',
    length: 97,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Manoir hanté et les 999 Fantômes',
    director: 'Rob Minkoff',
    actors: [
      {
        name: 'Eddie Murphy',
      },
      {
        name: 'Jennifer Tilly',
      },
      {
        name: 'Terence Stamp',
      },
      {
        name: 'Marsha Thomason',
      },
      {
        name: 'Nathaniel Parker',
      },
      {
        name: 'Ariel Alexandria Davis',
      },
      {
        name: 'Marc John Jefferies',
      },
    ],
    coverUrl: '/movies_pictures/5222566.jpg',
    releaseDate: '2003-11-26',
    length: 99,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'George de la jungle',
    director: 'Sam Weisman',
    actors: [
      {
        name: 'Brendan Fraser',
      },
      {
        name: 'Leslie Mann',
      },
      {
        name: 'Thomas Haden Church',
      },
      {
        name: 'John Cleese',
      },
      {
        name: 'Richard Roundtree',
      },
      {
        name: 'Abraham Benrubi',
      },
      {
        name: 'Holland Taylor',
      },
    ],
    coverUrl: '/movies_pictures/george_of_the_jungle.jpg',
    releaseDate: '1997-10-15',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'George de la Jungle 2',
    director: 'David Grossman',
    actors: [
      {
        name: 'Thomas Haden Church',
      },
      {
        name: 'Julie Benz',
      },
      {
        name: 'Christina Pickles',
      },
      {
        name: 'Angus T. Jones',
      },
      {
        name: 'John Kassir',
      },
      {
        name: 'Michael Clarke Duncan',
      },
      {
        name: 'John Cleese',
      },
    ],
    coverUrl: '/movies_pictures/3452423.jpg',
    releaseDate: '2003-08-18',
    length: 87,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Un vendredi dingue, dingue, dingue',
    director: 'Gary Nelson',
    actors: [
      {
        name: 'Barbara Harris',
      },
      {
        name: 'Jodie Foster',
      },
      {
        name: 'John Astin',
      },
      {
        name: 'Dick Van Patten',
      },
      {
        name: 'Sorrell Booke',
      },
      {
        name: 'Alan Oppenheimer',
      },
      {
        name: 'Patsy Kelly',
      },
    ],
    coverUrl: '/movies_pictures/ef07c72dedc1.jpg',
    releaseDate: '1977-01-21',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },

  {
    title: "La Revanche d'une blonde",
    director: 'Robert Luketic',
    actors: [
      {
        name: 'Reese Witherspoon',
      },
      {
        name: 'Luke Wilson',
      },
      {
        name: 'Selma Blair',
      },
      {
        name: 'Matthew Davis',
      },
      {
        name: 'Victor Garber',
      },
      {
        name: 'Jennifer Coolidge',
      },
      {
        name: 'Holland Taylor',
      },
    ],
    coverUrl: '/movies_pictures/69217795_af.jpg',
    releaseDate: '2001-07-13',
    length: 96,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Grinch',
    director: 'Ron Howard',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Taylor Momsen',
      },
      {
        name: 'Jeffrey Tambor',
      },
      {
        name: 'Christine Baranski',
      },
      {
        name: 'Bill Irwin',
      },
      {
        name: 'Molly Shannon',
      },
      {
        name: 'Clint Howard',
      },
    ],
    coverUrl: '/movies_pictures/050712_af.jpg',
    releaseDate: '2000-11-17',
    length: 104,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'À nous quatre',
    director: 'Nancy Meyers',
    actors: [
      {
        name: 'Lindsay Lohan',
      },
      {
        name: 'Dennis Quaid',
      },
      {
        name: 'Natasha Richardson',
      },
      {
        name: 'Elaine Hendrix',
      },
      {
        name: 'Lisa Ann Walter',
      },
      {
        name: 'Simon Kunz',
      },
      {
        name: 'Kat Graham',
      },
    ],
    coverUrl: '/movies_pictures/4573997.webp',
    releaseDate: '1998-07-29',
    length: 128,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Flubber',
    director: 'Les Mayfield',
    actors: [
      {
        name: 'Robin Williams',
      },
      {
        name: 'Marcia Gay Harden',
      },
      {
        name: 'Christopher McDonald',
      },
      {
        name: 'Ted Levine',
      },
      {
        name: 'Clancy Brown',
      },
      {
        name: 'Raymond J. Barry',
      },
      {
        name: 'Wil Wheaton',
      },
    ],
    coverUrl:
      '/movies_pictures/58aafba5c16e3cf4f16002d5c2110bc9f4c9dbd31f24d418a88f3b21223980ee.jpg',
    releaseDate: '1997-11-26',
    length: 93,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Austin Powers',
    director: 'Jay Roach',
    actors: [
      {
        name: 'Elizabeth Hurley',
      },
      {
        name: 'Michael York',
      },
      {
        name: 'Mimi Rogers',
      },
      {
        name: 'Robert Wagner',
      },
      {
        name: 'Seth Green',
      },
      {
        name: 'Fabiana Udenio',
      },
      {
        name: 'Paul Dillon',
      },
    ],
    coverUrl: '/movies_pictures/61-oLcCQ+rL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1997-05-02',
    length: 94,
    genre: ['Comédie'],
    saga: 'Austin Powers',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Matilda',
    director: 'Danny DeVito',
    actors: [
      {
        name: 'Rhea Perlman',
      },
      {
        name: 'Embeth Davidtz',
      },
      {
        name: 'Pam Ferris',
      },
      {
        name: 'Mara Wilson',
      },
      {
        name: 'Danny DeVito',
      },
      {
        name: 'Brian Levinson',
      },
      {
        name: 'Jimmy Karz',
      },
    ],
    coverUrl: '/movies_pictures/MATILDA_1996_MLF-FR-artwork.webp',
    releaseDate: '1996-08-02',
    length: 98,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Super Noël',
    director: 'John Pasquin',
    actors: [
      {
        name: 'Tim Allen',
      },
      {
        name: 'Eric Lloyd',
      },
      {
        name: 'Wendy Crewson',
      },
      {
        name: 'Judge Reinhold',
      },
      {
        name: 'David Krumholtz',
      },
      {
        name: 'Peter Boyle',
      },
      {
        name: 'Larry Brandenburg',
      },
    ],
    coverUrl: '/movies_pictures/41oRV4OvaVL._AC_UF894,1000_QL80_.jpg',
    releaseDate: '1994-11-11',
    length: 97,
    genre: ['Comédie', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Un jour sans fin',
    director: 'Harold Ramis',
    actors: [
      {
        name: 'Andie MacDowell',
      },
      {
        name: 'Bill Murray',
      },
      {
        name: 'Chris Elliott',
      },
      {
        name: 'Stephen Tobolowsky',
      },
      {
        name: 'Brian Doyle-Murray',
      },
      {
        name: 'Rick Ducommun',
      },
      {
        name: 'Willie Garson',
      },
    ],
    coverUrl: '/movies_pictures/1931558.jpg',
    releaseDate: '1993-02-12',
    length: 101,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'La Famille Addams',
    director: 'Barry Sonnenfeld',
    actors: [
      {
        name: 'Anjelica Huston',
      },
      {
        name: 'Raúl Juliá',
      },
      {
        name: 'Christopher Lloyd',
      },
      {
        name: 'Christina Ricci',
      },
      {
        name: 'Judith Malina',
      },
      {
        name: 'Dan Hedaya',
      },
      {
        name: 'Carel Struycken',
      },
    ],
    coverUrl: '/movies_pictures/2560441.jpg',
    releaseDate: '1991-11-22',
    length: 102,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Beetlejuice',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Alec Baldwin',
      },
      {
        name: 'Geena Davis',
      },
      {
        name: 'Jeffrey Jones',
      },
      {
        name: "Catherine O'Hara",
      },
      {
        name: 'Winona Ryder',
      },
      {
        name: 'Glenn Shadix',
      },
    ],
    coverUrl: '/movies_pictures/5083109.webp',
    releaseDate: '1988-03-30',
    length: 92,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },

  {
    title: 'Le coup du siècle',
    director: 'Chris Addison',
    actors: [
      { name: 'Anne Hathaway' },
      { name: 'Rebel Wilson' },
      { name: 'Alex Sharp' },
      { name: 'Ingrid Oliver' },
    ],
    coverUrl: '/movies_pictures/621d08062b84.jpg',
    releaseDate: '2019-01-01',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 0,
  },
  {
    title: 'Ma sorcière bien aimée',
    director: 'Nora Ephron',
    actors: [
      { name: 'Nicole Kidman' },
      { name: 'Will Ferrell' },
      { name: 'Michael Caine' },
      { name: 'Shirley MacLaine' },
    ],
    coverUrl: '/movies_pictures/3656abaf6c93.jpg',
    releaseDate: '2005-01-01',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 0,
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
      {
        name: 'Lyes Salem',
      },
      {
        name: 'Constance Carrelet',
      },
      {
        name: 'Rudy Milstein',
      },
      {
        name: 'Johann Dionnet',
      },
    ],
    coverUrl: '/movies_pictures/avignon.jpg',
    releaseDate: '2025-06-18',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
      {
        name: 'John Goodman',
      },
      {
        name: 'Holly Hunter',
      },
      {
        name: 'Chris Thomas King',
      },
      {
        name: 'Charles Durning',
      },
    ],
    coverUrl: '/movies_pictures/1f14c0e6a8c4.jpg',
    releaseDate: '2000-08-30',
    length: 106,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: 'Marsupilami',
    description: '',
    fromEntity: {
      entityType: 'serie',
      title: 'Le marsupilami',
      secondEntityKey: 'André Franquin',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
      {
        name: 'Kelly Reilly',
      },
      {
        name: 'Judith Godrèche',
      },
      {
        name: 'François-Xavier Demaison',
      },
      {
        name: 'Xavier De Guillebon',
      },
    ],
    coverUrl: '/movies_pictures/3649f55f5292.jpg',
    releaseDate: '2002-06-19',
    length: 120,
    genre: ['Comédie'],
    saga: 'Trilogie Cédric Klapisch',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: 'Trilogie Cédric Klapisch',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie'],
    saga: 'Monty Python',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
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
    genre: ['Comédie', 'Thriller', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 30,
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
    genre: ['Comédie', 'Science Fiction'],
    saga: 'Trilogie Cornetto',
    description: '',
    fromEntity: null,
    countryOrigin: ['Royaume-Uni'],
    selectDisplayOrder: 5,
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
    genre: ['Comédie', 'Aventure', 'Jeunesse'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: "La Venue de l'Avenir",
    director: 'Cédric Klapisch',
    actors: [
      {
        name: 'Suzanne Lindon',
      },
      {
        name: 'Abraham Wapler',
      },
      {
        name: 'Vincent Macaigne',
      },
      {
        name: 'Julia Piaton',
      },
      {
        name: 'Zinedine Soualem',
      },
      {
        name: 'Paul Kircher',
      },
      {
        name: 'Vassili Schneider',
      },
      {
        name: 'Sara Giraudeau',
      },
    ],
    coverUrl: '/movies_pictures/a4314bd0a23f.jpg',
    releaseDate: '2025-05-22',
    length: 125,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Materialists',
    director: 'Celine Song',
    actors: [
      {
        name: 'Dakota Johnson',
      },
      {
        name: 'Chris Evans',
      },
      {
        name: 'Pedro Pascal',
      },
      {
        name: 'Marin Ireland',
      },
      {
        name: 'Zoë Winters',
      },
      {
        name: 'Dasha Nekrasova',
      },
      {
        name: 'Louisa Jacobson',
      },
    ],
    coverUrl: '/movies_pictures/9a099cf183d6.jpg',
    releaseDate: '2025-07-02',
    length: 127,
    genre: ['Comédie', 'Romance'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Iznogoud',
    director: 'Patrick Braoudé',
    actors: [
      {
        name: 'Michaël Youn',
      },
      {
        name: 'Jacques Villeret',
      },
      {
        name: 'Franck Dubosc',
      },
      {
        name: 'Bernard Farcy',
      },
      {
        name: 'Arno Chevrier',
      },
      {
        name: 'Sofia Essaïdi',
      },
      {
        name: 'Elsa Pataky',
      },
    ],
    coverUrl: '/movies_pictures/78bc8801b843.jpg',
    releaseDate: '2005-01-19',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Sur la piste du Marsupilami',
    director: 'Alain Chabat',
    actors: [
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Jamel Debbouze',
      },
      {
        name: 'Fred Testot',
      },
      {
        name: 'Lambert Wilson',
      },
      {
        name: 'Géraldine Nakache',
      },
    ],
    coverUrl: '/movies_pictures/e43fef00796c.jpg',
    releaseDate: '2012-04-04',
    length: 105,
    genre: ['Comédie'],
    saga: 'Marsupilami',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Casse-tête Chinois',
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
      {
        name: 'Sandrine Holt',
      },
      {
        name: 'Flore Bonaventura',
      },
      {
        name: 'Benoît Jacquot',
      },
    ],
    coverUrl: '/movies_pictures/1ae4f0135bee.jpg',
    releaseDate: '2013-12-04',
    length: 120,
    genre: ['Comédie'],
    saga: 'Trilogie Cédric Klapisch',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Ace Ventura, détective pour chiens et chats',
    director: 'Tom Shadyac',
    actors: [
      {
        name: 'Jim Carrey',
      },
      {
        name: 'Courtney Cox',
      },
      {
        name: 'Sean Young',
      },
      {
        name: 'Tone Loc',
      },
      {
        name: 'Dan Marino',
      },
      {
        name: 'Noble Willingham',
      },
      {
        name: 'Troy Evans',
      },
    ],
    coverUrl: '/movies_pictures/3b75625db871.jpg',
    releaseDate: '1994-02-04',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Le Mystère Henri Pick',
    director: 'Rémi Bezançon',
    actors: [
      {
        name: 'Fabrice Luchini',
      },
      {
        name: 'Camille Cottin',
      },
      {
        name: 'Alice Isaaz',
      },
      {
        name: 'Bastien Bouillon',
      },
    ],
    coverUrl: '/movies_pictures/31d8318928a1.jpg',
    releaseDate: '2019-03-06',
    length: 100,
    genre: ['Comédie', 'Drame'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'book',
      title: 'Le mystère Henri Pick',
      secondEntityKey: 'David Foenkinos',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Les Profs',
    director: 'Pierre-François Martin-Laval',
    actors: [
      {
        name: 'Kev Adams',
      },
      {
        name: 'Christian Clavier',
      },
      {
        name: 'Isabelle Nanty',
      },
      {
        name: 'Arnaud Ducret',
      },
    ],
    coverUrl: '/movies_pictures/1afcb4b4221c.jpg',
    releaseDate: '2013-04-17',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: "L'Élève Ducobu",
    director: 'Philippe de Chauveron',
    actors: [
      {
        name: 'Vincent Claude',
      },
      {
        name: 'Juliette Chappey',
      },
      {
        name: 'Joséphine de Meaux',
      },
      {
        name: 'Elie Semoun',
      },
    ],
    coverUrl: '/movies_pictures/692062283952.jpg',
    releaseDate: '2011-06-22',
    length: 96,
    genre: ['Comédie'],
    saga: "L'Eleve Ducobu",
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Les Vacances de Ducobu',
    director: 'Philippe de Chauveron',
    actors: [
      {
        name: 'François Viette',
      },
      {
        name: 'Joséphine de Meaux',
      },
      {
        name: 'Juliette Chappey',
      },
      {
        name: 'Elie Semoun',
      },
    ],
    coverUrl: '/movies_pictures/f1607f7a9159.jpg',
    releaseDate: '2012-04-25',
    length: 94,
    genre: ['Comédie'],
    saga: "L'Eleve Ducobu",
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Petit Nicolas',
    director: 'Laurent Tirard',
    actors: [
      {
        name: 'Maxime Godart',
      },
      {
        name: 'Kad Merad',
      },
      {
        name: 'Valérie Lemercier',
      },
      {
        name: 'François-Xavier Demaison',
      },
      {
        name: 'Sandrine Kiberlain',
      },
    ],
    coverUrl: '/movies_pictures/5ee3c6ce4eda.jpg',
    releaseDate: '2009-09-30',
    length: 91,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Juste une illusion',
    director: 'Olivier Nakache, Éric Toledano',
    actors: [
      {
        name: 'Louis Garrel',
      },
      {
        name: 'Camille Cottin',
      },
      {
        name: 'Pierre Lottin',
      },
      {
        name: 'Alexis Rosenstiehl',
      },
      {
        name: 'Simon Boublil',
      },
    ],
    coverUrl: '/movies_pictures/9d931f14273c.jpg',
    releaseDate: '2026-04-15',
    length: 116,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Click : Télécommandez votre vie',
    director: 'Frank Coraci',
    actors: [
      { name: 'Adam Sandler' },
      { name: 'Kate Beckinsale' },
      { name: 'Christopher Walken' },
      { name: 'Henry Winkler' },
      { name: 'Julie Kavner' },
      { name: 'David Hasselhoff' },
      { name: 'Sean Astin' },
    ],
    coverUrl: '/movies_pictures/3e3c38d14aae.png',
    releaseDate: '2006-09-13',
    length: 107,
    genre: ['Comédie', 'Fantastique'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: "L'arnaque",
    director: 'George Roy Hill',
    actors: [
      { name: 'Paul Newman' },
      { name: 'Robert Redford' },
      { name: 'Robert Shaw' },
      { name: 'Charles Durning' },
      { name: 'Ray Walston' },
      { name: 'Eileen Brennan' },
      { name: 'Harold Gould' },
    ],
    coverUrl: '/movies_pictures/a1678f33bc5c.jpg',
    releaseDate: '1974-03-22',
    length: 129,
    genre: ['Comédie', 'Policier'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Spartatouille',
    director: 'Jason Friedberg, Aaron Seltzer',
    actors: [
      { name: 'Sean Maguire' },
      { name: 'Carmen Electra' },
      { name: 'Ken Davitian' },
      { name: 'Kevin Sorbo' },
      { name: 'Diedrich Bader' },
      { name: 'Nicole Parker' },
      { name: 'Jim Piddock' },
    ],
    coverUrl: '/movies_pictures/a0e6edfd41f9.jpg',
    releaseDate: '2008-07-16',
    length: 84,
    genre: ['Comédie', 'Peplum'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Big movie',
    director: 'Jason Friedberg, Aaron Seltzer',
    actors: [
      { name: 'Kal Penn' },
      { name: 'Adam Campbell' },
      { name: 'Jennifer Coolidge' },
      { name: 'Jayma Mays' },
      { name: 'Crispin Glover' },
      { name: 'Faune Chambers Watkins' },
      { name: 'Fred Willard' },
    ],
    coverUrl: '/movies_pictures/8c2325a93d5a.jpg',
    releaseDate: '2007-03-28',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis', 'Allemagne'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Docteur Folamour',
    director: 'Stanley Kubrick',
    actors: [
      { name: 'Peter Sellers' },
      { name: 'George C. Scott' },
      { name: 'Sterling Hayden' },
      { name: 'Slim Pickens' },
      { name: 'Keenan Wynn' },
      { name: 'Peter Bull' },
      { name: 'Tracy Reed' },
    ],
    coverUrl: '/movies_pictures/987087c8814f.jpg',
    releaseDate: '1964-03-11',
    length: 94,
    genre: ['Comédie', 'Guerre'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis', 'Royaume-Uni'],
    selectDisplayOrder: 5,
  },
  {
    title: 'How High',
    director: 'Jesse Dylan',
    actors: [
      { name: 'Method Man' },
      { name: 'Redman' },
      { name: 'Mike Epps' },
      { name: 'Anna Maria Horsford' },
      { name: 'Jeffrey Jones' },
      { name: 'Lark Voorhies' },
      { name: 'Obba Babatundé' },
    ],
    coverUrl: '/movies_pictures/16394f0a5668.jpg',
    releaseDate: '2001-12-21',
    length: 93,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },

  {
    title: 'Adieu Jean-Pat',
    director: 'Cécilia Rouaud',
    actors: [
      {
        name: 'Hakim Jemili',
      },
      {
        name: 'Alice David',
      },
    ],
    coverUrl: '/movies_pictures/adieu_jean_pat.jpg',
    releaseDate: '2025-09-03',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Loups-Garous',
    director: 'François Uzan',
    actors: [
      {
        name: 'Bill Skarsgård',
      },
      {
        name: 'Nicholas Hoult',
      },
      {
        name: 'Lily-Rose Depp',
      },
      {
        name: 'Aaron Taylor-Johnson',
      },
      {
        name: 'Emma Corrin',
      },
      {
        name: 'Willem Dafoe',
      },
    ],
    coverUrl: '/movies_pictures/loups_garous.jpg',
    releaseDate: '2024-10-23',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Beetlejuice Beetlejuice',
    director: 'Tim Burton',
    actors: [
      {
        name: 'Michael Keaton',
      },
      {
        name: 'Winona Ryder',
      },
      {
        name: "Catherine O'Hara",
      },
      {
        name: 'Jenna Ortega',
      },
      {
        name: 'Justin Theroux',
      },
    ],
    coverUrl: '/movies_pictures/beetlejuice_beetlejuice.jpg',
    releaseDate: '2024-09-11',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'A Little Something Extra',
    director: 'Artus',
    actors: [
      {
        name: 'Artus',
      },
      {
        name: 'Clovis Cornillac',
      },
      {
        name: 'Alice Belaïdi',
      },
      {
        name: 'Marc Riso',
      },
      {
        name: 'Céline Groussard',
      },
    ],
    coverUrl: '/movies_pictures/a_little_something_extra.jpg',
    releaseDate: '2024-01-01',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Tout sauf toi',
    director: 'Will Gluck',
    actors: [
      {
        name: 'Sydney Sweeney',
      },
      {
        name: 'Glen Powell',
      },
      {
        name: 'Alexandra Shipp',
      },
      {
        name: 'Hadley Robinson',
      },
      {
        name: 'Michelle Hurd',
      },
    ],
    coverUrl: '/movies_pictures/tout_sauf_toi.jpg',
    releaseDate: '2024-01-24',
    length: 103,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Pauvres Créatures',
    director: 'Yórgos Lánthimos',
    actors: [
      {
        name: 'Emma Stone',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Willem Dafoe',
      },
      {
        name: 'Ramy Youssef',
      },
      {
        name: 'Christopher Abbott',
      },
    ],
    coverUrl: '/movies_pictures/pauvres_creatures.jpg',
    releaseDate: '2024-01-17',
    length: 141,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Manoir hanté',
    director: 'Justin Simien',
    actors: [
      {
        name: 'LaKeith Stanfield',
      },
      {
        name: 'Tiffany Haddish',
      },
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Danny DeVito',
      },
      {
        name: 'Rosario Dawson',
      },
    ],
    coverUrl: '/movies_pictures/le_manoir_hante.jpg',
    releaseDate: '2023-07-26',
    length: 123,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Yannick',
    director: 'Quentin Dupieux',
    actors: [
      {
        name: 'Raphaël Quenard',
      },
      {
        name: 'Pio Marmaï',
      },
      {
        name: 'Blanche Gardin',
      },
      {
        name: 'Sébastien Chassagne',
      },
    ],
    coverUrl: '/movies_pictures/yannick.jpg',
    releaseDate: '2023-08-02',
    length: 67,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Challenge',
    director: 'Gene Stupnitsky',
    actors: [
      {
        name: 'Jennifer Lawrence',
      },
      {
        name: 'Andrew Barth Feldman',
      },
      {
        name: 'Laura Benanti',
      },
      {
        name: 'Natalie Morales',
      },
      {
        name: 'Matthew Broderick',
      },
    ],
    coverUrl: '/movies_pictures/le_challenge.jpg',
    releaseDate: '2023-06-21',
    length: 103,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Mon crime',
    director: 'François Ozon',
    actors: [
      {
        name: 'Nadia Tereszkiewicz',
      },
      {
        name: 'Rebecca Marder',
      },
      {
        name: 'Isabelle Huppert',
      },
      {
        name: 'Fabrice Luchini',
      },
      {
        name: 'Dany Boon',
      },
    ],
    coverUrl: '/movies_pictures/mon_crime.jpg',
    releaseDate: '2023-03-08',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Alibi.com 2',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Philippe Lacheau',
      },
      {
        name: 'Élodie Fontan',
      },
      {
        name: 'Julien Arruti',
      },
    ],
    coverUrl: '/movies_pictures/alibicom_2.jpg',
    releaseDate: '2023-01-01',
    length: 88,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Le Menu',
    director: 'Mark Mylod',
    actors: [
      {
        name: 'Ralph Fiennes',
      },
      {
        name: 'Anya Taylor-Joy',
      },
      {
        name: 'Nicholas Hoult',
      },
    ],
    coverUrl: '/movies_pictures/le_menu.jpg',
    releaseDate: '2022-11-23',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Ténor',
    director: 'Claude Zidi Jr.',
    actors: [
      {
        name: 'Michaël Youn',
      },
      {
        name: 'Kad Merad',
      },
      {
        name: 'Claude Zidi Jr.',
      },
    ],
    coverUrl: '/movies_pictures/tenor.jpg',
    releaseDate: '2022-05-04',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Super-héros malgré lui',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Philippe Lacheau',
      },
      {
        name: 'Tarek Boudali',
      },
      {
        name: 'Julien Arruti',
      },
    ],
    coverUrl: '/movies_pictures/super-heros_malgre_lui.jpg',
    releaseDate: '2022-02-02',
    length: 82,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'The Trip',
    director: 'Tommy Wirkola',
    actors: [
      {
        name: 'Noomi Rapace',
      },
      {
        name: 'Aksel Hennie',
      },
      {
        name: 'Atle Antonsen',
      },
    ],
    coverUrl: '/movies_pictures/the_trip.jpg',
    releaseDate: '2021-07-30',
    length: 113,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Norvège'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Un papa hors pair',
    director: 'Paul Weitz',
    actors: [
      {
        name: 'Kevin Hart',
      },
      {
        name: 'Alfre Woodard',
      },
      {
        name: 'Lil Rel Howery',
      },
    ],
    coverUrl: '/movies_pictures/un_papa_hors_pair.jpg',
    releaseDate: '2021-06-18',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Play',
    director: 'Anthony Marciano',
    actors: [
      {
        name: 'Anthony Marciano',
      },
      {
        name: 'Mehdi Nebbou',
      },
      {
        name: 'Lannick Gautry',
      },
    ],
    coverUrl: '/movies_pictures/play.jpg',
    releaseDate: '2020-01-01',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: "À tous les garçons que j'ai aimés",
    director: 'Susan Johnson',
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
    ],
    coverUrl: '/movies_pictures/to_all_the_boys_i_ve_loved_before.jpg',
    releaseDate: '2018-08-17',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Crazy Rich Asians',
    director: 'Jon M. Chu',
    actors: [
      {
        name: 'Constance Wu',
      },
      {
        name: 'Henry Golding',
      },
      {
        name: 'Michelle Yeoh',
      },
    ],
    coverUrl: '/movies_pictures/crazy_rich_asians.jpg',
    releaseDate: '2018-11-07',
    length: 121,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Ne coupez pas !',
    director: "Shin'ichirō Ueda",
    actors: [
      {
        name: 'Dwayne Johnson',
      },
      {
        name: 'Jack Black',
      },
      {
        name: 'Kevin Hart',
      },
    ],
    coverUrl: '/movies_pictures/one_cut_of_the_dead.jpg',
    releaseDate: '2019-04-24',
    length: 96,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Japon'],
    selectDisplayOrder: 5,
  },
  {
    title: 'The Babysitter',
    director: 'McG',
    actors: [
      {
        name: 'Samara Weaving',
      },
      {
        name: 'Judah Lewis',
      },
      {
        name: 'Bella Thorne',
      },
    ],
    coverUrl: '/movies_pictures/the_babysitter.jpg',
    releaseDate: '2017-10-13',
    length: 85,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Lady Bird',
    director: 'Greta Gerwig',
    actors: [
      {
        name: 'Saoirse Ronan',
      },
      {
        name: 'Laurie Metcalf',
      },
      {
        name: 'Tracy Letts',
      },
    ],
    coverUrl: '/movies_pictures/lady_bird.jpg',
    releaseDate: '2018-02-28',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'La Colle',
    director: 'Alexandre Castagnetti',
    actors: [
      {
        name: 'Kev Adams',
      },
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Noémie Schmidt',
      },
    ],
    coverUrl: '/movies_pictures/la_colle.jpg',
    releaseDate: '2017-07-19',
    length: 91,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Alibi.com',
    director: 'Philippe Lacheau',
    actors: [
      {
        name: 'Philippe Lacheau',
      },
      {
        name: 'Élodie Fontan',
      },
      {
        name: 'Tarek Boudali',
      },
    ],
    coverUrl: '/movies_pictures/alibi_com.jpg',
    releaseDate: '2017-02-15',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'The Boyfriend : Pourquoi lui ?',
    director: 'John Hamburg',
    actors: [
      {
        name: 'James Franco',
      },
      {
        name: 'Zoey Deutch',
      },
      {
        name: 'Bryan Cranston',
      },
    ],
    coverUrl: '/movies_pictures/why_him.jpg',
    releaseDate: '2017-01-25',
    length: 111,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'War Dogs',
    director: 'Todd Phillips',
    actors: [
      {
        name: 'Jonah Hill',
      },
      {
        name: 'Miles Teller',
      },
      {
        name: 'Ana de Armas',
      },
    ],
    coverUrl: '/movies_pictures/war_dogs.jpg',
    releaseDate: '2016-09-14',
    length: 114,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'The Nice Guys',
    director: 'Shane Black',
    actors: [
      {
        name: 'Ryan Gosling',
      },
      {
        name: 'Russell Crowe',
      },
      {
        name: 'Angourie Rice',
      },
    ],
    coverUrl: '/movies_pictures/the_nice_guys.jpg',
    releaseDate: '2016-05-20',
    length: 116,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Nos pires voisins 2',
    director: 'Nicholas Stoller',
    actors: [
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Zac Efron',
      },
      {
        name: 'Rose Byrne',
      },
    ],
    coverUrl: '/movies_pictures/neighbors_2_sorority_rising.jpg',
    releaseDate: '2016-07-06',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Five',
    director: 'Igor Gotesman',
    actors: [
      {
        name: 'Pierre Niney',
      },
      {
        name: 'François Civil',
      },
    ],
    coverUrl: '/movies_pictures/five.jpg',
    releaseDate: '2016-08-31',
    length: 95,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Ted 2',
    director: 'Seth MacFarlane',
    actors: [
      {
        name: 'Mark Wahlberg',
      },
      {
        name: 'Seth MacFarlane',
      },
      {
        name: 'Amanda Seyfried',
      },
      {
        name: 'Morgan Freeman',
      },
    ],
    coverUrl: '/movies_pictures/ted_2.jpg',
    releaseDate: '2015-08-05',
    length: 115,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Dope',
    director: 'Rick Famuyiwa',
    actors: [
      {
        name: 'Shameik Moore',
      },
      {
        name: 'Tony Revolori',
      },
      {
        name: 'Kiersey Clemons',
      },
    ],
    coverUrl: '/movies_pictures/dope.jpg',
    releaseDate: '2015-11-04',
    length: 103,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Nos pires voisins',
    director: 'Nicholas Stoller',
    actors: [
      {
        name: 'Seth Rogen',
      },
      {
        name: 'Zac Efron',
      },
      {
        name: 'Rose Byrne',
      },
    ],
    coverUrl: '/movies_pictures/neighbors.jpg',
    releaseDate: '2014-05-28',
    length: 97,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'The Grand Budapest Hotel',
    director: 'Wes Anderson',
    actors: [
      {
        name: 'Ralph Fiennes',
      },
      {
        name: 'Tony Revolori',
      },
      {
        name: 'F. Murray Abraham',
      },
    ],
    coverUrl: '/movies_pictures/the_grand_budapest_hotel.jpg',
    releaseDate: '2014-02-26',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Vampires en toute intimité',
    director: 'Taika Waititi, Jemaine Clement',
    actors: [
      {
        name: 'Taika Waititi',
      },
      {
        name: 'Jemaine Clement',
      },
      {
        name: 'Jonathan Brugh',
      },
    ],
    coverUrl: '/movies_pictures/what_we_do_in_the_shadows.jpg',
    releaseDate: '2015-02-11',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['Nouvelle-Zélande'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Et (beaucoup) plus si affinités',
    director: 'Michael Dowse',
    actors: [
      {
        name: 'Daniel Radcliffe',
      },
      {
        name: 'Zoe Kazan',
      },
      {
        name: 'Megan Park',
      },
    ],
    coverUrl: '/movies_pictures/what_if.jpg',
    releaseDate: '2014-08-20',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'New York Melody',
    director: 'John Carney',
    actors: [
      {
        name: 'Keira Knightley',
      },
      {
        name: 'Mark Ruffalo',
      },
      {
        name: 'Adam Levine',
      },
    ],
    coverUrl: '/movies_pictures/begin_again.jpg',
    releaseDate: '2014-07-30',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Les Miller, une famille en herbe',
    director: 'Rawson Marshall Thurber',
    actors: [
      {
        name: 'Jennifer Aniston',
      },
      {
        name: 'Jason Sudeikis',
      },
      {
        name: 'Emma Roberts',
      },
    ],
    coverUrl: '/movies_pictures/we_re_the_millers.jpg',
    releaseDate: '2013-09-18',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Copains pour toujours 2',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Kevin James',
      },
      {
        name: 'Chris Rock',
      },
    ],
    coverUrl: '/movies_pictures/grown_ups_2.jpg',
    releaseDate: '2013-09-11',
    length: 101,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Les Stagiaires',
    director: 'Shawn Levy',
    actors: [
      {
        name: 'Vince Vaughn',
      },
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Rose Byrne',
      },
    ],
    coverUrl: '/movies_pictures/the_internship.jpg',
    releaseDate: '2013-06-26',
    length: 119,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: "C'est la fin",
    director: 'Evan Goldberg, Seth Rogen',
    actors: [
      {
        name: 'Seth Rogen',
      },
      {
        name: 'James Franco',
      },
      {
        name: 'Jonah Hill',
      },
    ],
    coverUrl: '/movies_pictures/this_is_the_end.jpg',
    releaseDate: '2013-10-09',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Seven Psychopaths',
    director: 'Martin McDonagh',
    actors: [
      {
        name: 'Colin Farrell',
      },
      {
        name: 'Sam Rockwell',
      },
      {
        name: 'Christopher Walken',
      },
    ],
    coverUrl: '/movies_pictures/seven_psychopaths.jpg',
    releaseDate: '2013-01-30',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Happy New Year',
    director: 'Garry Marshall',
    actors: [
      {
        name: 'Halle Berry',
      },
      {
        name: 'Ashton Kutcher',
      },
      {
        name: 'Jessica Biel',
      },
    ],
    coverUrl: '/movies_pictures/new_year_s_eve.jpg',
    releaseDate: '2011-12-21',
    length: 118,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: '10 ans déjà !',
    director: 'Jamie Linden',
    actors: [
      {
        name: 'Channing Tatum',
      },
      {
        name: 'Rosario Dawson',
      },
      {
        name: 'Justin Long',
      },
    ],
    coverUrl: '/movies_pictures/10_years.jpg',
    releaseDate: '2012-06-13',
    length: 110,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Bad Teacher',
    director: 'Jake Kasdan',
    actors: [
      {
        name: 'Cameron Diaz',
      },
      {
        name: 'Justin Timberlake',
      },
      {
        name: 'Jason Segel',
      },
    ],
    coverUrl: '/movies_pictures/bad_teacher.jpg',
    releaseDate: '2011-07-27',
    length: 92,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Scott Pilgrim',
    director: 'Edgar Wright',
    actors: [
      {
        name: 'Michael Cera',
      },
      {
        name: 'Mary Elizabeth Winstead',
      },
      {
        name: 'Kieran Culkin',
      },
    ],
    coverUrl: '/movies_pictures/scott_pilgrim_vs_the_world.jpg',
    releaseDate: '2010-12-01',
    length: 112,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Copains pour toujours',
    director: 'Dennis Dugan',
    actors: [
      {
        name: 'Adam Sandler',
      },
      {
        name: 'Kevin James',
      },
      {
        name: 'Chris Rock',
      },
    ],
    coverUrl: '/movies_pictures/grown_ups.jpg',
    releaseDate: '2010-09-08',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Nanny McPhee et le Big Bang',
    director: 'Susanna White',
    actors: [
      {
        name: 'Emma Thompson',
      },
      {
        name: 'Maggie Gyllenhaal',
      },
      {
        name: 'Rhys Ifans',
      },
    ],
    coverUrl: '/movies_pictures/nanny_mcphee_and_the_big_bang.jpg',
    releaseDate: '2010-03-31',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Coco',
    director: 'Gad Elmaleh',
    actors: [
      {
        name: 'Gad Elmaleh',
      },
    ],
    coverUrl: '/movies_pictures/coco.jpg',
    releaseDate: '2009-11-29',
    length: 105,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Little Miss Sunshine',
    director: 'Jonathan Dayton, Valerie Faris',
    actors: [
      {
        name: 'Abigail Breslin',
      },
      {
        name: 'Greg Kinnear',
      },
      {
        name: 'Toni Collette',
      },
    ],
    coverUrl: '/movies_pictures/little_miss_sunshine.jpg',
    releaseDate: '2006-09-06',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Treize à la douzaine 2',
    director: 'Adam Shankman',
    actors: [
      {
        name: 'Steve Martin',
      },
      {
        name: 'Bonnie Hunt',
      },
      {
        name: 'Eugene Levy',
      },
    ],
    coverUrl: '/movies_pictures/cheaper_by_the_dozen_2.jpg',
    releaseDate: '2006-03-01',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Kiss Kiss Bang Bang',
    director: 'Shane Black',
    actors: [
      {
        name: 'Steve Carell',
      },
      {
        name: 'Catherine Keener',
      },
      {
        name: 'Paul Rudd',
      },
    ],
    coverUrl: '/movies_pictures/kiss_kiss_bang_bang.jpg',
    releaseDate: '2005-09-14',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Le Fils du Mask',
    director: 'Lawrence Guterman',
    actors: [
      {
        name: 'Jamie Kennedy',
      },
      {
        name: 'Alan Cumming',
      },
      {
        name: 'Traylor Howard',
      },
    ],
    coverUrl: '/movies_pictures/son_of_the_mask.jpg',
    releaseDate: '2005-03-23',
    length: 94,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'comic',
      title: 'The Mask',
      secondEntityKey: 'John Arcudi',
    },
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Les Dalton',
    director: 'Philippe Haïm',
    actors: [
      {
        name: 'Nicolas Cage',
      },
      {
        name: 'Diane Kruger',
      },
      {
        name: 'Justin Bartha',
      },
    ],
    coverUrl: '/movies_pictures/lucky_luke_and_the_daltons.jpg',
    releaseDate: '2004-12-08',
    length: 86,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: {
      entityType: 'bd',
      title: 'Les Cousins Dalton',
      secondEntityKey: 'Morris',
    },
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
  {
    title: 'F.B.I. : Fausses blondes infiltrées',
    director: 'Keenen Ivory Wayans',
    actors: [
      {
        name: 'Shawn Wayans',
      },
      {
        name: 'Marlon Wayans',
      },
      {
        name: 'Jaime King',
      },
    ],
    coverUrl: '/movies_pictures/white_chicks.jpg',
    releaseDate: '2004-10-20',
    length: 109,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Treize à la douzaine',
    director: 'Shawn Levy',
    actors: [
      {
        name: 'Steve Martin',
      },
      {
        name: 'Bonnie Hunt',
      },
      {
        name: 'Piper Perabo',
      },
    ],
    coverUrl: '/movies_pictures/cheaper_by_the_dozen.jpg',
    releaseDate: '2004-04-14',
    length: 99,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Rock Academy',
    director: 'Richard Linklater',
    actors: [
      {
        name: 'Jack Black',
      },
      {
        name: 'Joan Cusack',
      },
      {
        name: 'Mike White',
      },
    ],
    coverUrl: '/movies_pictures/school_of_rock.jpg',
    releaseDate: '2004-03-24',
    length: 108,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Comment se faire larguer en dix leçons',
    director: 'Donald Petrie',
    actors: [
      {
        name: 'Kate Hudson',
      },
      {
        name: 'Matthew McConaughey',
      },
      {
        name: 'Kathryn Hahn',
      },
    ],
    coverUrl: '/movies_pictures/how_to_lose_a_guy_in_10_days.jpg',
    releaseDate: '2003-06-11',
    length: 115,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Zoolander',
    director: 'Ben Stiller',
    actors: [
      {
        name: 'Ben Stiller',
      },
      {
        name: 'Owen Wilson',
      },
      {
        name: 'Christine Taylor',
      },
    ],
    coverUrl: '/movies_pictures/zoolander.jpg',
    releaseDate: '2002-01-02',
    length: 89,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'La Course au jouet',
    director: 'Brian Levant',
    actors: [
      {
        name: 'Arnold Schwarzenegger',
      },
      {
        name: 'Jeff Goldblum',
      },
      {
        name: 'Julianne Moore',
      },
      {
        name: 'Pete Postlethwaite',
      },
    ],
    coverUrl: '/movies_pictures/jingle_all_the_way.jpg',
    releaseDate: '1996-12-11',
    length: 90,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Sister Act, acte 2',
    director: 'Bill Duke',
    actors: [
      {
        name: 'Chantal Lauby',
      },
      {
        name: 'Alain Chabat',
      },
      {
        name: 'Dominique Farrugia',
      },
    ],
    coverUrl: '/movies_pictures/sister_act_2_back_in_the_habit.jpg',
    releaseDate: '1994-03-23',
    length: 107,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Sister Act',
    director: 'Emile Ardolino',
    actors: [
      {
        name: 'Whoopi Goldberg',
      },
      {
        name: 'Maggie Smith',
      },
      {
        name: 'Harvey Keitel',
      },
    ],
    coverUrl: '/movies_pictures/sister_act.jpg',
    releaseDate: '1992-11-25',
    length: 100,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Big',
    director: 'Penny Marshall',
    actors: [
      {
        name: 'Tom Hanks',
      },
      {
        name: 'Elizabeth Perkins',
      },
      {
        name: 'Robert Loggia',
      },
    ],
    coverUrl: '/movies_pictures/big.jpg',
    releaseDate: '1988-12-07',
    length: 104,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'La Folle Journée de Ferris Bueller',
    director: 'John Hughes',
    actors: [
      {
        name: 'Mayumi Tanaka',
      },
      {
        name: 'Keiko Yokozawa',
      },
      {
        name: 'Kotoe Hatsui',
      },
    ],
    coverUrl: '/movies_pictures/ferris_bueller_s_day_off.jpg',
    releaseDate: '1986-12-17',
    length: 102,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 5,
  },
  {
    title: 'Risky Business',
    director: 'Paul Brickman',
    actors: [
      {
        name: 'Tom Cruise',
      },
      {
        name: 'Rebecca De Mornay',
      },
      {
        name: 'Joe Pantoliano',
      },
    ],
    coverUrl: '/movies_pictures/risky_business.jpg',
    releaseDate: '1984-03-21',
    length: 98,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['États-Unis'],
    selectDisplayOrder: 30,
  },
  {
    title: 'Les Valseuses',
    director: 'Bertrand Blier',
    actors: [
      {
        name: 'Gérard Depardieu',
      },
      {
        name: 'Patrick Dewaere',
      },
      {
        name: 'Miou-Miou',
      },
    ],
    coverUrl: '/movies_pictures/going_places.jpg',
    releaseDate: '1974-01-09',
    length: 117,
    genre: ['Comédie'],
    saga: '',
    description: '',
    fromEntity: null,
    countryOrigin: ['France'],
    selectDisplayOrder: 5,
  },
];
