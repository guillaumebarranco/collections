/**
 * Comptes suivis par utilisateur.
 * userId -> liste des usernames que cet utilisateur suit (accès à leur dashboard et collections).
 * La donnée réelle est chargée via l'API et persistée dans users-follows.json côté serveur.
 */

export type UsersFollows = Record<string, string[]>;

/** Valeur par défaut (utilisée côté client avant le premier chargement API). */
export const usersFollows: UsersFollows = {};
