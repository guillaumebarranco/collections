import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface MoveEntityReviewModalData {
  /** Titre de l'entité (film, livre, série, etc.) */
  entityTitle: string;
  /** Libellé du bouton de validation (ex. "Valider") */
  confirmLabel?: string;
}

export interface MoveEntityReviewModalResult {
  rating: number;
  ratingComment: string;
}

@Component({
  selector: 'app-move-entity-review-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './move-entity-review-modal.component.html',
  styleUrls: ['./move-entity-review-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveEntityReviewModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<MoveEntityReviewModalComponent, MoveEntityReviewModalResult | undefined>>(
      MatDialogRef
    );
  readonly data = inject<MoveEntityReviewModalData>(MAT_DIALOG_DATA);

  readonly rating = signal<number>(0);
  readonly ratingComment = signal<string>('');

  readonly confirmLabel = computed(
    () => this.data.confirmLabel ?? 'Valider'
  );

  readonly stars = computed(() => {
    const r = this.rating();
    const result: Array<'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty'> = [];
    for (let i = 1; i <= 5; i++) {
      if (r >= i) result.push('full');
      else if (r >= i - 0.25) result.push('threeQuarter');
      else if (r >= i - 0.5) result.push('half');
      else if (r >= i - 0.75) result.push('quarter');
      else result.push('empty');
    }
    return result;
  });

  /** Arrondit la note au quart le plus proche (0, 0.25, 0.5, 0.75, 1, …). */
  setRating(value: number): void {
    const v = Math.max(0, Math.min(5, Math.round(value * 4) / 4));
    this.rating.set(v);
  }

  setRatingFromStarClick(star: number, event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;
    const width = target.clientWidth;
    const x = event.offsetX;
    const ratio = x / width;
    const offset = ratio < 0.25 ? 0.75 : ratio < 0.5 ? 0.5 : ratio < 0.75 ? 0.25 : 0;
    this.setRating(star - offset);
  }

  onRatingInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const v = parseFloat(input.value);
    if (!Number.isNaN(v)) this.setRating(v);
  }

  onCommentInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.ratingComment.set(textarea.value ?? '');
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }

  confirm(): void {
    this.dialogRef.close({
      rating: this.rating(),
      ratingComment: this.ratingComment().trim(),
    });
  }
}
