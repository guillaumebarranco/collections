import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MenuConfigService,
  CONFIGURABLE_MENU_KEYS,
  type MenuConfigKey,
} from '../../../core/menu-config.service';
import { AuthService } from '../../../core/auth.service';
import { OfflineModeService } from '../../../services/offline-mode.service';

const CONFIGURABLE_ITEMS: {
  key: MenuConfigKey;
  label: string;
  icon: string;
}[] = [
  { key: 'books', label: 'Livres', icon: '📚' },
  { key: 'movies', label: 'Films', icon: '🎬' },
  { key: 'series', label: 'Séries', icon: '📺' },
  { key: 'games', label: 'Jeux', icon: '🎮' },
  { key: 'mangas', label: 'Mangas', icon: '📖' },
  { key: 'manwhas', label: 'Manwhas', icon: '🎨' },
  { key: 'comics', label: 'Comics', icon: '🦸' },
  { key: 'bds', label: 'BD', icon: '📗' },
  { key: 'musics', label: 'Musiques', icon: '🎵' },
  { key: 'adaptations', label: 'Adaptations', icon: '🔀' },
  { key: 'quizzs', label: 'Quizz', icon: '🎯' },
  { key: 'records', label: 'Records', icon: '🏆' },
  {
    key: 'entity-stats',
    label: 'Statistiques des entités',
    icon: '📈',
  },
];

type PreferencesTab = 'menu' | 'offline';

export interface MenuConfigModalData {
  initialTab?: PreferencesTab;
}

@Component({
  selector: 'app-menu-config-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './menu-config-modal.component.html',
  styleUrls: ['./menu-config-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuConfigModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<MenuConfigModalComponent, void>
  );
  private readonly menuConfig = inject(MenuConfigService);
  private readonly authService = inject(AuthService);
  private readonly offlineMode = inject(OfflineModeService);
  private readonly dialogData = inject<MenuConfigModalData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly items = CONFIGURABLE_ITEMS;
  readonly activeTab = signal<PreferencesTab>(
    this.dialogData?.initialTab ?? 'menu'
  );

  private readonly initialCacheEnabled = this.offlineMode.cacheEnabled();
  private readonly initialOfflineModeActive = this.offlineMode.offlineModeActive();

  readonly offlineCacheEnabled = signal(this.initialCacheEnabled);
  readonly offlineModeActive = signal(this.initialOfflineModeActive);
  readonly isSyncing = this.offlineMode.isSyncing;
  readonly syncError = this.offlineMode.lastSyncError;

  readonly lastSavedLabel = computed(() => {
    const at = this.offlineMode.lastSavedAt();
    if (!at) return null;
    try {
      const d = new Date(at);
      return `Dernière sauvegarde : ${d.toLocaleString('fr-FR')}`;
    } catch {
      return null;
    }
  });

  /** État local des cases cochées (clé -> activé). */
  readonly checked = signal<Record<string, boolean>>(
    CONFIGURABLE_ITEMS.reduce((acc, item) => {
      acc[item.key] = this.menuConfig.isEnabled(item.key);
      return acc;
    }, {} as Record<string, boolean>)
  );

  isChecked(key: string): boolean {
    return this.checked()[key] ?? true;
  }

  setChecked(key: string, value: boolean): void {
    const next = { ...this.checked() };
    next[key] = value;
    this.checked.set(next);
  }

  setTab(tab: PreferencesTab): void {
    this.activeTab.set(tab);
  }

  onCacheEnabledChange(enabled: boolean): void {
    this.offlineCacheEnabled.set(enabled);
  }

  onOfflineModeChange(active: boolean): void {
    this.offlineModeActive.set(active);
  }

  forceSync(): void {
    if (!this.offlineCacheEnabled()) return;
    const userId = this.authService.getAuthenticatedUserId();
    if (!userId) return;
    void this.offlineMode.syncOfflineData(userId);
  }

  save(): void {
    const current = this.checked();
    const enabled = new Set<string>();
    for (const key of CONFIGURABLE_MENU_KEYS) {
      if (current[key] !== false) enabled.add(key);
    }
    this.menuConfig.setEnabled(enabled);

    const userId = this.authService.getAuthenticatedUserId();
    const cacheEnabled = this.offlineCacheEnabled();
    const offlineActive = this.offlineModeActive();

    if (cacheEnabled !== this.initialCacheEnabled) {
      this.offlineMode.setCacheEnabled(cacheEnabled, userId);
    }
    if (offlineActive !== this.initialOfflineModeActive) {
      this.offlineMode.setOfflineModeActive(offlineActive);
    }

    this.dialogRef.close();
  }

  cancel(): void {
    const userId = this.authService.getAuthenticatedUserId();
    this.offlineMode.setCacheEnabled(this.initialCacheEnabled, userId);
    this.offlineMode.setOfflineModeActive(this.initialOfflineModeActive);
    this.dialogRef.close();
  }
}
