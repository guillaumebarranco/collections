import { UserSerie } from '../../../../models/serie-model';

const rawRonanSeries = [
    {
        title: 'Black Mirror',
        director: 'Charlie Brooker',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'How I Met Your Mother',
        director: 'Carter Bays, Craig Thomas',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 2,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 3,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 4,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 5,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 6,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 7,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 8,
                seasonRating: 5,
                seasonTimesWatched: 10
            },
            {
                seasonNumber: 9,
                seasonRating: 5,
                seasonTimesWatched: 10
            }
        ]
    },
    {
        title: 'Loki',
        director: 'Kate Herron',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Le Jeu de la Dame',
        director: 'Scott Frank',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'WandaVision',
        director: 'Matt Shakman',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Obi-Wan Kenobi',
        director: 'Deborah Chow',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Squid Game',
        director: 'Hwang Dong-hyuk',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Breaking Bad',
        director: 'Vince Gilligan',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Umbrella Academy',
        director: 'Steve Blackman',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'You',
        director: 'Greg Berlanti',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Boys',
        director: 'Eric Kripke',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Stranger Things',
        director: 'The Duffer Brothers',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Lupin',
        director: 'Louis Leterrier',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Arcane',
        director: 'Pascal Charrue, Arnaud Delord',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'South Park',
        director: 'Trey Parker, Matt Stone',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 10,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 11,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 12,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 13,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 14,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 15,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 16,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 17,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 18,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 19,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 20,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 21,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 22,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 23,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 24,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 25,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 26,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Daredevil',
        director: 'Drew Goddard',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 3
            }
        ]
    },
    {
        title: 'Daredevil : Born Again',
        director: 'Matt Corman, Chris Ord',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Jessica Jones',
        director: 'Melissa Rosenberg',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Luke Cage',
        director: 'Cheo Hodari Coker',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Iron Fist',
        director: 'Scott Buck',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Defenders',
        director: 'Douglas Petrie, Marco Ramirez',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'The Last of Us',
        director: 'Craig Mazin, Neil Druckmann',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: '13 Reasons Why',
        director: 'Brian Yorkey',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Astérix & Obélix : Le Combat des Chefs',
        director: 'Alain Chabat',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Brooklyn Nine-Nine',
        director: 'Dan Goor, Michael Schur',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Mercredi',
        director: 'Tim Burton',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Montre jamais ça à personne',
        director: 'Hugo Benamozig, David Caviglioli',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Arrow',
        director: 'Greg Berlanti, Marc Guggenheim',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 7,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 8,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'The Flash',
        director: 'Greg Berlanti, Andrew Kreisberg',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'La Casa de Papel',
        director: 'Álex Pina',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Lucifer',
        director: 'Tom Kapinos',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Punisher',
        director: 'Steve Lightfoot',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Rick and Morty',
        director: 'Justin Roiland, Dan Harmon',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Sense8',
        director: 'Lana Wachowski, Lilly Wachowski',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The End of the F***ing World',
        director: 'Jonathan Entwistle',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Superman & Lois',
        director: 'Greg Berlanti, Todd Helbing',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Locke & Key',
        director: 'Carlton Cuse',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Mon amie Adèle',
        director: 'Erik Richter Strand',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'One Piece',
        director: 'Matt Owens, Steven Maeda',
        stoppedAtSeason: 0,
        seasons: []
    },
    {
        title: 'Agent Carter',
        director: 'Tara Butters, Michele Fazekas',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Agents of S.H.I.E.L.D.',
        director: 'Jed Whedon, Maurissa Tancharoen',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 7,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Ahsoka',
        director: 'Dave Filoni',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Altered Carbon',
        director: 'Laeta Kalogridis',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Avatar: The Last Airbender',
        director: 'Michael Dante DiMartino, Bryan Konietzko',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Avengers Assemble',
        director: 'Man of Action',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Bloqués',
        director: 'Jonathan Cohen, Ramzy Bedia',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 3
            }
        ]
    },
    {
        title: 'Bodyguard',
        director: 'Jed Mercurio',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Cloak & Dagger',
        director: 'Joe Pokaski',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Community',
        director: 'Dan Harmon',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Constantine',
        director: 'Daniel Cerone, David S. Goyer',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Death Note',
        director: 'Tetsurō Araki',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Desperate Housewives',
        director: 'Marc Cherry',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Dexter',
        director: 'James Manos Jr.',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 8,
                seasonRating: 4,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Family Business',
        director: 'Igor Gotesman',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Game of Thrones',
        director: 'David Benioff, D.B. Weiss',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 7,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 8,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Gotham',
        director: 'Bruno Heller',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Hawkeye',
        director: 'Jonathan Igla',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Heroes',
        director: 'Tim Kring',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Heroes Reborn',
        director: 'Tim Kring',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Inhumans',
        director: 'Scott Buck',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 0.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: "Jupiter's Legacy",
        director: 'Steven S. DeKnight',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Les Grands',
        director: 'Vianney Lebasque',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Malcolm in the Middle',
        director: 'Linwood Boomer',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 3
            }
        ]
    },
    {
        title: 'Mindhunter',
        director: 'Joe Penhall',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Misfits',
        director: 'Howard Overman',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Mortel',
        director: 'Frédéric Garcia',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Naruto',
        director: 'Masashi Kishimoto',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 3,
                seasonRating: 4.5,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 4,
                seasonRating: 4.5,
                seasonTimesWatched: 3
            },
            {
                seasonNumber: 5,
                seasonRating: 4.5,
                seasonTimesWatched: 3
            }
        ]
    },
    {
        title: 'Penny Dreadful',
        director: 'John Logan',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Runaways',
        director: 'Josh Schwartz, Stephanie Savage',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Samurai Champloo',
        director: 'Shinichirō Watanabe',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Shameless',
        director: 'Paul Abbott',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 10,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 11,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Smallville',
        director: 'Alfred Gough, Miles Millar',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 10,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Sons of Anarchy',
        director: 'Kurt Sutter',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Spartacus',
        director: 'Steven S. DeKnight',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Star Wars Rebels',
        director: 'Dave Filoni',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Star Wars: The Clone Wars',
        director: 'Dave Filoni',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Supernatural',
        director: 'Eric Kripke',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 10,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 11,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 12,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 13,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 14,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 15,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Teen Wolf',
        director: 'Jeff Davis',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 3,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 3,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 3,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'The Big Bang Theory',
        director: 'Chuck Lorre, Bill Prady',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 10,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 11,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 12,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Falcon and the Winter Soldier',
        director: 'Malcolm Spellman',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Get Down',
        director: 'Baz Luhrmann, Stephen Adly Guirgis',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 4.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'The Office',
        director: 'Greg Daniels',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 7,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 8,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 9,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Originals',
        director: 'Julie Plec',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 4,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Returned',
        director: 'Fabrice Gobert',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Shannara Chronicles',
        director: 'Alfred Gough, Miles Millar',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Tomorrow People',
        director: 'Greg Berlanti, Phil Klemmer',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 2.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'The Vampire Diaries',
        director: 'Julie Plec, Kevin Williamson',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 7,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            },
            {
                seasonNumber: 8,
                seasonRating: 3.5,
                seasonTimesWatched: 2
            }
        ]
    },
    {
        title: 'Vikings',
        director: 'Michael Hirst',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 5,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 6,
                seasonRating: 3.5,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Watchmen',
        director: 'Damon Lindelof',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 4,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'Yu Yu Hakusho',
        director: 'Yoshihiro Togashi',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 2,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 3,
                seasonRating: 3,
                seasonTimesWatched: 1
            },
            {
                seasonNumber: 4,
                seasonRating: 3,
                seasonTimesWatched: 1
            }
        ]
    },
    {
        title: 'One Piece (live-action)',
        director: 'Matt Owens, Steven Maeda',
        stoppedAtSeason: 0,
        seasons: [
            {
                seasonNumber: 1,
                seasonRating: 0,
                seasonTimesWatched: 1
            }
        ]
    },
];

export const ronanSeries: UserSerie[] = rawRonanSeries.map(
  ({ stoppedAtSeason, ...serie }) => serie
);
