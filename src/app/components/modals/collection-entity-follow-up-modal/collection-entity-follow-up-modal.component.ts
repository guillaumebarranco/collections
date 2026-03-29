import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EntityUpdateFollowUpModalComponent } from '../entity-update-follow-up-modal/entity-update-follow-up-modal.component';
import type { EntityBadgeProgressRow } from '../../../utils/entity-badge-progress.types';

/** Données pour la modale de félicitations (toute collection hors musique). */
export interface CollectionEntityFollowUpModalData {
  entityTitle: string;
  coverUrl: string;
  /** Préfixe du texte alternatif de la couverture, ex. « Couverture de » / « Jaquette de ». */
  coverAltPrefix: string;
  messageLead: string;
  progressUnitLabel: string;
  progressRows: EntityBadgeProgressRow[];
}

@Component({
  selector: 'app-collection-entity-follow-up-modal',
  standalone: true,
  imports: [MatDialogModule, EntityUpdateFollowUpModalComponent],
  template: `
    <app-entity-update-follow-up-modal
      [entityTitle]="data.entityTitle"
      [coverUrl]="data.coverUrl"
      [coverAlt]="data.coverAltPrefix + ' ' + data.entityTitle"
      [messageLead]="data.messageLead"
      [progressUnitLabel]="data.progressUnitLabel"
      [progressRows]="data.progressRows"
      (dismiss)="close()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionEntityFollowUpModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<CollectionEntityFollowUpModalComponent>
  );
  readonly data = inject<CollectionEntityFollowUpModalData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
