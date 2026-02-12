import { getApiBaseUrl } from '../../../core/config';
import { Game } from '../../../models/game-model';

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
        gamelistPriority: data.priority,
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
        gamelistPriority: game.gamelistPriority ?? 1,
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
        gamelistPriority: game.gamelistPriority ?? 1,
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
