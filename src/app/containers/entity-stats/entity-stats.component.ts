import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../components/shared/view-toggle/view-toggle.component';
import { AuthService } from '../../core/auth.service';
import {
  getPlatformEntityStats,
  type AdminRecordsCategoryKey,
  type PlatformEntityStatsResponse,
} from '../../facades/admin/admin.facade';
import { DEFAULT_USER_ID } from '../../utils/constants';

const ENTITY_TAB_LABELS: Record<AdminRecordsCategoryKey, string> = {
  books: 'Livres',
  movies: 'Films',
  series: 'Séries',
  games: 'Jeux',
  mangas: 'Mangas',
  manwhas: 'Manwhas',
  comics: 'Comics',
  bds: 'BD',
  musics: 'Musiques',
};

const ENTITY_SECONDARY_LABEL: Record<AdminRecordsCategoryKey, string> = {
  books: 'Auteur',
  movies: 'Réalisateur',
  series: 'Réalisateur',
  games: 'Éditeur',
  mangas: 'Auteur',
  manwhas: 'Auteur',
  comics: 'Scénariste',
  bds: 'Scénariste',
  musics: 'Artiste',
};

const ENTITY_TAB_ORDER: AdminRecordsCategoryKey[] = [
  'movies',
  'series',
  'books',
  'games',
  'mangas',
  'manwhas',
  'comics',
  'bds',
  'musics',
];

@Component({
  selector: 'app-entity-stats',
  standalone: true,
  imports: [CommonModule, MenuComponent, ViewToggleComponent],
  templateUrl: './entity-stats.component.html',
  styleUrls: ['./entity-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityStatsComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly isAdmin = computed<boolean>(() => this.authService.isAdmin());
  readonly statsData = signal<PlatformEntityStatsResponse | null>(null);
  readonly loading = signal<boolean>(false);

  readonly selectedEntity = signal<AdminRecordsCategoryKey>('movies');

  readonly entityTabOptions: ViewToggleOption[] = ENTITY_TAB_ORDER.map(
    (value) => ({
      value,
      label: ENTITY_TAB_LABELS[value],
    })
  );

  readonly secondaryColumnLabel = computed(() =>
    ENTITY_SECONDARY_LABEL[this.selectedEntity()]
  );

  readonly currentCategory = computed(() => {
    const data = this.statsData();
    const key = this.selectedEntity();
    return data?.[key] ?? null;
  });

  async ngOnInit(): Promise<void> {
    if (!this.isAdmin()) return;
    this.loading.set(true);
    this.statsData.set(null);
    try {
      const adminId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const data = await getPlatformEntityStats(adminId);
      this.statsData.set(data);
    } finally {
      this.loading.set(false);
    }
  }

  onEntityTabChange(value: string): void {
    this.selectedEntity.set(value as AdminRecordsCategoryKey);
  }
}
