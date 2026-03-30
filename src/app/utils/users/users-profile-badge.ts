/**
 * Valeurs locales de secours (ex. localhost sans API), alignées sur le dépôt.
 * La source de vérité pour un déploiement / plusieurs appareils est le fichier
 * `profile-badge.json` par utilisateur, écrit par l’API (voir ProfileBadgeService).
 */
export const usersProfileBadge: Record<string, string | null> = {};
