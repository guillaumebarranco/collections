import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import type { UserMovieListItem } from '../../../models/movie-list.model';

const DEFAULT_ICON = '📋';
const DEFAULT_COLOR = '#6b7280';
const HEX_COLOR_PATTERN = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export type CreateMovieListModalResult = UserMovieListItem | undefined;

@Component({
  selector: 'app-create-movie-list-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './create-movie-list-modal.component.html',
  styleUrls: ['./create-movie-list-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateMovieListModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<CreateMovieListModalComponent, CreateMovieListModalResult>>(
      MatDialogRef
    );

  readonly name = signal('');
  readonly icon = signal(DEFAULT_ICON);
  readonly color = signal(DEFAULT_COLOR);

  readonly normalizedColor = computed(() =>
    normalizeHexColor(this.color())
  );

  readonly colorError = computed(() => {
    const raw = this.color().trim();
    if (!raw) return 'La couleur est obligatoire.';
    if (!HEX_COLOR_PATTERN.test(raw)) {
      return 'Format invalide : entrez une couleur hexadécimale (ex. #8B4513 ou #ca8a04).';
    }
    return '';
  });

  readonly canSubmit = computed(
    () => this.name().trim().length > 0 && !this.colorError()
  );

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (!this.canSubmit()) return;
    this.dialogRef.close({
      name: this.name().trim(),
      icon: this.icon().trim() || DEFAULT_ICON,
      color: this.normalizedColor() ?? DEFAULT_COLOR,
    });
  }
}

function normalizeHexColor(value: string): string | null {
  const trimmed = value.trim();
  const match = trimmed.match(HEX_COLOR_PATTERN);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex.toLowerCase()}`;
}
