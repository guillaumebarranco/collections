import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityUpdateFollowUpModalComponent } from '../entity-update-follow-up-modal/entity-update-follow-up-modal.component';
import type { EntityBadgeProgressRow } from '../../../utils/entity-badge-progress.types';

export interface BookUpdateFollowUpModalData {
  bookTitle: string;
  coverUrl: string;
  progressRows: EntityBadgeProgressRow[];
}

@Component({
  selector: 'app-book-update-follow-up-modal',
  standalone: true,
  imports: [MatDialogModule, EntityUpdateFollowUpModalComponent],
  template: `
    <app-entity-update-follow-up-modal
      [entityTitle]="data.bookTitle"
      [coverUrl]="data.coverUrl"
      [coverAlt]="'Couverture de ' + data.bookTitle"
      messageLead="Vous avez lu"
      progressUnitLabel="livres"
      [progressRows]="data.progressRows"
      (dismiss)="close()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookUpdateFollowUpModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<BookUpdateFollowUpModalComponent>
  );
  readonly data = inject<BookUpdateFollowUpModalData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
