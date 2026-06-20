import { getApiBaseUrl } from '../../../core/config';
import { Game } from '../../../models/game-model';

function clampPriority(
  priority: number | null | undefined
): number {
  const n =
    typeof priority === 'number' && Number.isFinite(priority) ? priority : 1;
  return Math.min(3, Math.max(1, n));
}

export async function updateGamelistPriority(
  data: {
    game: Game;
    priority: number;
  },
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: data.game.title,
        editor: data.game.editor,
        rating: data.game.rating,
        owned: data.game.owned,
        gamelistPriority: clampPriority(data.priority),
        wantToPlayAgain: data.game.wantToPlayAgain ?? false,
        sessions: data.game.sessions ?? [],
        ratingComment: data.game.ratingComment ?? '',
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec de la mise à jour de la priorité :',
        payload?.error || response.statusText
      );
      return false;
    }

    return true;
  } catch (error) {
    console.warn(
      'Erreur réseau lors de la mise à jour de la priorité.',
      error
    );
    return false;
  }
}

export async function markGameAsWantToRePlay(
  game: Game,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: game.title,
        editor: game.editor,
        rating: game.rating,
        owned: game.owned,
        gamelistPriority: clampPriority(game.gamelistPriority),
        wantToPlayAgain: true,
        sessions: game.sessions ?? [],
        ratingComment: game.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer à rejouer:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer jeu à rejouer.', error);
    return false;
  }
}

export async function markGameAsRePlayed(
  game: Game,
  getActiveUserId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: game.title,
        editor: game.editor,
        rating: game.rating,
        owned: game.owned,
        gamelistPriority: clampPriority(game.gamelistPriority),
        wantToPlayAgain: false,
        sessions: game.sessions ?? [],
        ratingComment: game.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn('Échec marquer rejoué:', payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau marquer jeu rejoué.', error);
    return false;
  }
}

export async function addGameToGamelist(
  game: Game,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, games: [game], gamelist: true }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout jeu à la gamelist:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout jeu à la gamelist.", error);
    return false;
  }
}

/** Gamelist : marque le jeu comme commencé (session en cours), reste dans la gamelist. */
export async function markGamelistGameAsStarted(
  game: Game,
  getActiveUserId: string
): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const existing = game.sessions ?? [];
  const cleared = existing.map((session) => ({
    ...session,
    currentlyPlaying: false,
  }));
  const sessions = [
    ...cleared,
    {
      finishedGame: false,
      finishedGameWithHundredPercent: false,
      platinedGame: false,
      additionnalEstimatedTime: 0,
      sessionStartDate: today,
      sessionEndDate: '',
      currentlyPlaying: true,
    },
  ];

  try {
    const response = await fetch(`${getApiBaseUrl()}/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getActiveUserId,
        title: game.title,
        editor: game.editor,
        rating: game.rating,
        owned: game.owned,
        gamelistPriority: clampPriority(game.gamelistPriority),
        wantToPlayAgain: game.wantToPlayAgain ?? false,
        sessions,
        ratingComment: game.ratingComment ?? '',
      }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn(
        'Échec du marquage « en cours de jeu » :',
        payload?.error || response.statusText
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Erreur réseau lors du marquage « en cours de jeu ».', error);
    return false;
  }
}

export async function addGameAsPlayed(
  game: Game,
  userId: string
): Promise<boolean> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/games/add-existing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, games: [game], gamelist: false }),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      console.warn("Échec ajout jeu en « joué »:", payload?.error || response.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Erreur réseau ajout jeu en « joué ».", error);
    return false;
  }
}
