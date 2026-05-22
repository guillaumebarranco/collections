export interface MandatoryManwhaData {
  title: string;
  author: string;
}

export interface BaseManwha extends MandatoryManwhaData {
  coverUrl: string;
  genre: string;
  nbChapters: number;
  isFinished: boolean;
  /** Début de parution (webtoon), format YYYY-MM-DD. */
  startDate: string;
  /** Fin de parution si le manwha est terminé (`isFinished`), sinon chaîne vide. */
  endDate: string;
  description: string;
}

export interface UserManwha extends MandatoryManwhaData {
  readDate: string;
  /**
   * Début de lecture en scan (chapitre par chapitre), format YYYY-MM-DD (vide si N/A).
   * Alimente l’activité mensuelle : 4 chapitres/mois.
   */
  readingScanStartDate: string;
  /**
   * Fin de lecture en scan (arrêt avant la fin du manwha), format YYYY-MM-DD (vide si N/A).
   * Si renseignée, borne la période de suivi scan (prioritaire sur aujourd’hui).
   */
  readingScanEndDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserManwhas = UserManwha[];

export interface Manwha extends BaseManwha, UserManwha {}
