import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface RecordEntry {
  username: string;
  value: number;
}

export type RecordCategoryKey =
  | 'books'
  | 'movies'
  | 'series'
  | 'games'
  | 'mangas'
  | 'manwhas'
  | 'comics'
  | 'bds'
  | 'musics';

export interface RecordsCategoryData {
  mostReadSeen: RecordEntry[];
  mostTimeReadWatched: RecordEntry[];
}

export type RecordsData = Record<RecordCategoryKey, RecordsCategoryData>;

const CATEGORY_LABELS: Record<RecordCategoryKey, string> = {
  books: '📖 Livres lus',
  movies: '🎬 Films vus',
  series: '📺 Séries vues',
  games: '🎮 Jeux joués',
  mangas: '📚 Mangas lus',
  manwhas: '📖 Manwhas lus',
  comics: '🦸 Comics lus',
  bds: '📗 BD lues',
  musics: '🎵 Musiques écoutées',
};

/** Libellés des sections "Top 3 par temps" (lecture / visionnage / écoute). */
const CATEGORY_DURATION_LABELS: Record<RecordCategoryKey, string> = {
  books: '⏱️ Temps de lecture (livres)',
  movies: '⏱️ Temps de visionnage (films)',
  series: '⏱️ Temps de visionnage (séries)',
  games: '⏱️ Temps de jeu',
  mangas: '⏱️ Temps de lecture (mangas)',
  manwhas: '⏱️ Temps de lecture (manwhas)',
  comics: '⏱️ Temps de lecture (comics)',
  bds: '⏱️ Temps de lecture (BD)',
  musics: '⏱️ Temps d\'écoute (musiques)',
};

const CATEGORY_ORDER: RecordCategoryKey[] = [
  'books',
  'movies',
  'series',
  'games',
  'mangas',
  'manwhas',
  'comics',
  'bds',
  'musics',
];

@Component({
  selector: 'app-dashboard-records',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-records.component.html',
  styleUrls: ['./dashboard-records.component.scss'],
})
export class DashboardRecordsComponent {
  readonly recordsData = input<RecordsData | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly isAdmin = input<boolean>(false);

  readonly categories = CATEGORY_ORDER;
  readonly categoryLabels = CATEGORY_LABELS;
  readonly categoryDurationLabels = CATEGORY_DURATION_LABELS;

  getTop3(key: RecordCategoryKey): RecordEntry[] {
    const data = this.recordsData();
    const cat = data?.[key];
    if (!cat?.mostReadSeen) return [];
    return cat.mostReadSeen.slice(0, 3);
  }

  /** Top 3 par temps (lecture / visionnage / écoute) pour une catégorie ; value en jours. */
  getTop3ByDuration(key: RecordCategoryKey): RecordEntry[] {
    const data = this.recordsData();
    const cat = data?.[key];
    if (!cat?.mostTimeReadWatched) return [];
    return cat.mostTimeReadWatched.slice(0, 3);
  }

  getUserLink(username: string): string {
    return `/${username.toLowerCase()}/dashboard`;
  }

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  getUserName(username: string): string {
    return this.capitalizeFirstLetter(username);
  }

  /** Formate des jours pour l'affichage (mostTimeReadWatched). */
  formatDays(days: number | undefined): string {
    if (days == null || days <= 0) return '—';
    if (days >= 1) return `${Math.round(days)}j`;
    return `${days.toFixed(1)}j`;
  }
}
