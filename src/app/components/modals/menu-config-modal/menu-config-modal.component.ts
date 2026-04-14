import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MenuConfigService,
  CONFIGURABLE_MENU_KEYS,
  type MenuConfigKey,
} from '../../../core/menu-config.service';

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
];

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

  readonly items = CONFIGURABLE_ITEMS;

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

  save(): void {
    const current = this.checked();
    const enabled = new Set<string>();
    for (const key of CONFIGURABLE_MENU_KEYS) {
      if (current[key] !== false) enabled.add(key);
    }
    this.menuConfig.setEnabled(enabled);
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
