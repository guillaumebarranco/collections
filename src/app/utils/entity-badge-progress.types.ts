/** Ligne de progression vers un badge (films, livres, etc.). */
export interface EntityBadgeProgressRow {
  badgeId: string;
  badgeName: string;
  badgeImage: string;
  current: number;
  target: number;
  complete: boolean;
  /** Si défini, remplace `progressUnitLabel` du parent pour « Palier max (N …) ». */
  unitLabel?: string;
}
