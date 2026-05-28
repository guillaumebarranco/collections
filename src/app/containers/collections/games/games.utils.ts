import { Game } from '../../../models/game-model';
import {
  getGameFirstPlayedTimestamp,
  getGameLastPlayedTimestamp,
  getGameTimePlayed,
} from '../../../utils/games.utils';

export type GameView =
  | 'played'
  | 'gamelist'
  | 'inProgress'
  | 'toRePlay'
  | 'owned'
  | 'borrowed'
  | 'loaned'
  | 'platined'
  | 'finished'
  | 'recommendations';

export type OptionalGameView = Exclude<
  GameView,
  'played' | 'gamelist' | 'inProgress'
>;

const gamesSessionDateSortOptions: { value: string; label: string }[] = [
  { value: 'lastPlayedDate', label: 'Derniers jeux joués récents' },
  { value: 'firstPlayedDate-asc', label: 'Premiers jeux joués' },
];

export const gamesSortOptions: { value: string; label: string }[] = [
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'platform', label: 'Plateforme (A-Z)' },
  { value: 'platform-desc', label: 'Plateforme (Z-A)' },
  ...gamesSessionDateSortOptions,
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
  { value: 'rating', label: 'Note (élevée)' },
  { value: 'rating-asc', label: 'Note (faible)' },
  { value: 'timesFinished', label: 'Terminés (élevé)' },
  { value: 'timesFinished-asc', label: 'Terminés (faible)' },
  { value: 'averageTimeToFinish', label: 'Temps (long)' },
  { value: 'averageTimeToFinish-asc', label: 'Temps (court)' },
  { value: 'totalPlayedTime', label: 'Temps passé (élevé)' },
  { value: 'totalPlayedTime-asc', label: 'Temps passé (faible)' },
];

export const gamesGamelistSortOptions: { value: string; label: string }[] = [
  { value: 'gamelistPriority', label: 'Priorité gamelist' },
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'title-desc', label: 'Titre (Z-A)' },
  { value: 'platform', label: 'Plateforme (A-Z)' },
  { value: 'platform-desc', label: 'Plateforme (Z-A)' },
  { value: 'releaseDate', label: 'Date de sortie (récent)' },
  { value: 'releaseDate-asc', label: 'Date de sortie (ancien)' },
];

export const getGamesSortOptions = (
  selectedView: GameView
): { value: string; label: string }[] => {
  if (selectedView === 'gamelist') {
    return gamesGamelistSortOptions;
  }
  return gamesSortOptions;
};

export const getDefaultGamesSortForView = (view: GameView): string => {
  if (view === 'gamelist') {
    return 'gamelistPriority';
  }
  if (view === 'played' || view === 'inProgress') {
    return 'lastPlayedDate';
  }
  return 'rating';
};

function compareGameTimestampsDesc(
  games: Game[],
  getTimestamp: (game: Game) => number
): Game[] {
  return games.sort((a, b) => {
    const ta = getTimestamp(a);
    const tb = getTimestamp(b);
    if (!ta && !tb) {
      return a.title.localeCompare(b.title);
    }
    if (!ta) {
      return 1;
    }
    if (!tb) {
      return -1;
    }
    if (tb !== ta) {
      return tb - ta;
    }
    return a.title.localeCompare(b.title);
  });
}

function compareGameTimestampsAsc(
  games: Game[],
  getTimestamp: (game: Game) => number
): Game[] {
  return games.sort((a, b) => {
    const ta = getTimestamp(a);
    const tb = getTimestamp(b);
    if (!ta && !tb) {
      return a.title.localeCompare(b.title);
    }
    if (!ta) {
      return 1;
    }
    if (!tb) {
      return -1;
    }
    if (ta !== tb) {
      return ta - tb;
    }
    return a.title.localeCompare(b.title);
  });
}

export const gameViewOptions: { value: GameView; label: string }[] = [
  { value: 'played', label: 'Jeux joués' },
  { value: 'gamelist', label: 'Jeux à jouer' },
  { value: 'inProgress', label: 'En cours' },
  { value: 'toRePlay', label: 'À rejouer' },
  { value: 'platined', label: 'Jeux platinés' },
  { value: 'owned', label: 'Jeux possédés' },
  { value: 'borrowed', label: 'Jeux empruntés' },
  { value: 'loaned', label: 'Jeux prêtés' },
  { value: 'recommendations', label: 'Recommandations' },
];

export const getSortedGames = (games: Game[], selectedSort: string): Game[] => {
  switch (selectedSort) {
    case 'title':
      return games.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return games.sort((a, b) => b.title.localeCompare(a.title));
    case 'platform':
      return games.sort((a, b) => {
        const platformCompare = a.platform.localeCompare(b.platform);
        if (platformCompare !== 0) return platformCompare;
        return a.title.localeCompare(b.title);
      });
    case 'platform-desc':
      return games.sort((a, b) => {
        const platformCompare = b.platform.localeCompare(a.platform);
        if (platformCompare !== 0) return platformCompare;
        return a.title.localeCompare(b.title);
      });
    case 'lastPlayedDate':
      return compareGameTimestampsDesc(games, getGameLastPlayedTimestamp);
    case 'lastPlayedDate-asc':
      return compareGameTimestampsAsc(games, getGameLastPlayedTimestamp);
    case 'firstPlayedDate':
      return compareGameTimestampsDesc(games, getGameFirstPlayedTimestamp);
    case 'firstPlayedDate-asc':
      return compareGameTimestampsAsc(games, getGameFirstPlayedTimestamp);
    case 'releaseDate':
      return games.sort(
        (a, b) =>
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
      );
    case 'releaseDate-asc':
      return games.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );
    case 'rating':
      return games.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        const totalTimeA =
          a.averageTimeToFinish * a.timesFinished + a.additionnalEstimatedTime;
        const totalTimeB =
          b.averageTimeToFinish * b.timesFinished + b.additionnalEstimatedTime;
        return totalTimeB - totalTimeA;
      });
    case 'rating-asc':
      return games.sort((a, b) => {
        if (a.rating !== b.rating) {
          return a.rating - b.rating;
        }
        const totalTimeA =
          a.averageTimeToFinish * a.timesFinished + a.additionnalEstimatedTime;
        const totalTimeB =
          b.averageTimeToFinish * b.timesFinished + b.additionnalEstimatedTime;
        return totalTimeB - totalTimeA;
      });
    case 'timesFinished':
      return games.sort((a, b) => b.timesFinished - a.timesFinished);
    case 'timesFinished-asc':
      return games.sort((a, b) => a.timesFinished - b.timesFinished);
    case 'averageTimeToFinish':
      return games.sort(
        (a, b) => b.averageTimeToFinish - a.averageTimeToFinish
      );
    case 'averageTimeToFinish-asc':
      return games.sort(
        (a, b) => a.averageTimeToFinish - b.averageTimeToFinish
      );
    case 'totalPlayedTime':
      return games.sort((a, b) => {
        const totalTimeA = getGameTimePlayed(a);
        const totalTimeB = getGameTimePlayed(b);
        return totalTimeB - totalTimeA;
      });
    case 'totalPlayedTime-asc':
      return games.sort((a, b) => {
        const totalTimeA = getGameTimePlayed(a);
        const totalTimeB = getGameTimePlayed(b);
        return totalTimeA - totalTimeB;
      });
    case 'gamelistPriority':
      return games.sort((a, b) => {
        const priorityA = a.gamelistPriority ?? 0;
        const priorityB = b.gamelistPriority ?? 0;
        if (priorityB !== priorityA) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
    default:
      return games.sort((a, b) => a.title.localeCompare(b.title));
  }
};
