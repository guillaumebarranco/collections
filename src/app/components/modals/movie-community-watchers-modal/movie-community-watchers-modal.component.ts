import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  getEntityCommunityWatchers,
  type CommunityEntityKind,
} from '../../../facades/community/entity-community-watchers.facade';

export interface EntityCommunityWatchersModalData {
  workTitle: string;
  currentUserId: string;
  kind: CommunityEntityKind;
  identity: Record<string, string>;
}

/** @deprecated Utiliser {@link EntityCommunityWatchersModalData}. */
export type MovieCommunityWatchersModalData = EntityCommunityWatchersModalData;

export type EntityCommunityWatcherDisplayRow = {
  userId: string;
  displayName: string;
  ratingLabel: string;
  timesLabel: string;
  isCurrentUser: boolean;
};

/** @deprecated Utiliser {@link EntityCommunityWatcherDisplayRow}. */
export type MovieCommunityWatcherDisplayRow = EntityCommunityWatcherDisplayRow;

function userIdToDisplayName(userId: string): string {
  const t = userId.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

export function formatCommunityCountLabel(
  kind: CommunityEntityKind,
  n: number
): string {
  if (
    kind === 'book' ||
    kind === 'manga' ||
    kind === 'comic' ||
    kind === 'manwha' ||
    kind === 'bd'
  ) {
    return n <= 1 ? `${n} lecture` : `${n} lectures`;
  }
  if (kind === 'game') {
    return n <= 1 ? `${n} partie terminée` : `${n} parties terminées`;
  }
  return n <= 1 ? `${n} visionnage` : `${n} visionnages`;
}

@Component({
  selector: 'app-movie-community-watchers-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './movie-community-watchers-modal.component.html',
  styleUrls: ['./movie-community-watchers-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCommunityWatchersModalComponent implements OnInit {
  private readonly dialogRef = inject(
    MatDialogRef<MovieCommunityWatchersModalComponent>
  );
  readonly data = inject<EntityCommunityWatchersModalData>(MAT_DIALOG_DATA);

  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly rows = signal<EntityCommunityWatcherDisplayRow[]>([]);

  ngOnInit(): void {
    const { kind, identity, currentUserId } = this.data;
    const currentLower = currentUserId.trim().toLowerCase();

    void getEntityCommunityWatchers(kind, identity, currentUserId)
      .then((list) => {
        this.rows.set(
          list.map((r) => ({
            userId: r.userId,
            displayName: userIdToDisplayName(r.userId),
            ratingLabel:
              (r.rating ?? 0) === 0 ? 'Pas de note' : `${r.rating}/5`,
            timesLabel: formatCommunityCountLabel(
              kind,
              r.timesWatched ?? 0
            ),
            isCurrentUser: r.userId.toLowerCase() === currentLower,
          }))
        );
        this.loading.set(false);
      })
      .catch(() => {
        this.loadError.set(true);
        this.loading.set(false);
      });
  }

  close(): void {
    this.dialogRef.close();
  }
}
