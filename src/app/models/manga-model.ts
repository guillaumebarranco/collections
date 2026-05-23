import type {
  MangaFromEntityAdaptation,
  MangaFromEntityType,
} from './from-entity.model';

export interface MandatoryMangaData {
  title: string;
  author: string;
}

export interface BaseManga extends MandatoryMangaData {
  coverUrl: string;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
  /** Début de parution (magazine / web / équivalent), format YYYY-MM-DD. */
  startDate: string;
  /** Fin de parution si le manga est terminé (`isFinished`), sinon chaîne vide. */
  endDate: string;
  saga: string;
  description: string;
  /** Œuvre source (livre, film, jeu, autre manga, etc.) si adaptation. */
  fromEntity: MangaFromEntityAdaptation | null;
}

export type { MangaFromEntityAdaptation, MangaFromEntityType };

export interface UserManga extends MandatoryMangaData {
  readDate: string;
  /**
   * Début de lecture en scan (chapitre par chapitre), format YYYY-MM-DD (vide si N/A).
   * Alimente l’activité mensuelle : 4 chapitres/mois.
   */
  readingScanStartDate: string;
  /**
   * Fin de lecture en scan (arrêt avant la fin du manga), format YYYY-MM-DD (vide si N/A).
   * Si renseignée, borne la période de suivi scan (prioritaire sur aujourd’hui).
   */
  readingScanStopDate: string;
  rating: number;
  readTimes: number;
  owned: boolean;
  readPriority: 1 | 2 | 3;
  wantToReadAgain: boolean;
  ratingComment: string;
  borrowed: string;
  loaned: string;
}

export type UserMangas = UserManga[];

export interface Manga extends BaseManga, UserManga {}
