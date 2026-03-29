import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityUpdateFollowUpModalComponent } from '../entity-update-follow-up-modal/entity-update-follow-up-modal.component';
import type { EntityBadgeProgressRow } from '../../../utils/entity-badge-progress.types';

export interface MovieUpdateFollowUpModalData {
  movieTitle: string;
  coverUrl: string;
  progressRows: EntityBadgeProgressRow[];
}

@Component({
  selector: 'app-movie-update-follow-up-modal',
  standalone: true,
  imports: [MatDialogModule, EntityUpdateFollowUpModalComponent],
  template: `
    <app-entity-update-follow-up-modal
      [entityTitle]="data.movieTitle"
      [coverUrl]="data.coverUrl"
      [coverAlt]="'Jaquette de ' + data.movieTitle"
      messageLead="Vous avez vu"
      progressUnitLabel="films"
      [progressRows]="data.progressRows"
      (dismiss)="close()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieUpdateFollowUpModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<MovieUpdateFollowUpModalComponent>
  );
  readonly data = inject<MovieUpdateFollowUpModalData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
