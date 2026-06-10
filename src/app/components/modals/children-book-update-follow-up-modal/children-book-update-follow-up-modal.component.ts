import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityUpdateFollowUpModalComponent } from '../entity-update-follow-up-modal/entity-update-follow-up-modal.component';
import type { EntityBadgeProgressRow } from '../../../utils/entity-badge-progress.types';

export interface ChildrenBookUpdateFollowUpModalData {
  childrenBookTitle: string;
  coverUrl: string;
  progressRows: EntityBadgeProgressRow[];
}

@Component({
  selector: 'app-children-book-update-follow-up-modal',
  standalone: true,
  imports: [MatDialogModule, EntityUpdateFollowUpModalComponent],
  template: `
    <app-entity-update-follow-up-modal
      [entityTitle]="data.childrenBookTitle"
      [coverUrl]="data.coverUrl"
      [coverAlt]="'Couverture de ' + data.childrenBookTitle"
      messageLead="Vous avez lu"
      progressUnitLabel="livres"
      [progressRows]="data.progressRows"
      (dismiss)="close()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChildrenBookUpdateFollowUpModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<ChildrenBookUpdateFollowUpModalComponent>
  );
  readonly data = inject<ChildrenBookUpdateFollowUpModalData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
