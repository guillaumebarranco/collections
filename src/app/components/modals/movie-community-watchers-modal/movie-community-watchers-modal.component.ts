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
  type CommunityWatcherSeasonEntry,
} from '../../../facades/community/entity-community-watchers.facade';

export interface EntityCommunityWatchersModalData {
  workTitle: string;
  currentUserId: string;
  kind: CommunityEntityKind;
  identity: Record<string, string>;
}

/** @deprecated Utiliser {@link EntityCommunityWatchersModalData}. */
export type MovieCommunityWatchersModalData = EntityCommunityWatchersModalData;

export type EntityCommunityWatcherSeasonDisplayRow = {
  seasonNumber: number;
  ratingLabel: string;
  timesLabel: string;
};

export type EntityCommunitySeasonGroupUserRow = {
  userId: string;
  displayName: string;
  ratingLabel: string;
  timesLabel: string;
  isCurrentUser: boolean;
};

export type EntityCommunitySeasonGroup = {
  seasonNumber: number;
  users: EntityCommunitySeasonGroupUserRow[];
};

export type EntityCommunityWatcherDisplayRow = {
  userId: string;
  displayName: string;
  ratingLabel: string;
  timesLabel: string;
  isCurrentUser: boolean;
  seasons: EntityCommunityWatcherSeasonDisplayRow[];
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

export function formatCommunitySeasonTimesLabel(
  seasonTimesWatched: number,
  watching = false
): string {
  if (watching || seasonTimesWatched === 0.5) {
    return 'En cours';
  }
  const n = Math.floor(seasonTimesWatched);
  if (n <= 0) {
    return 'Non vue';
  }
  return n <= 1 ? '1 visionnage' : `${n} visionnages`;
}

function mapSeasonsForDisplay(
  seasons: CommunityWatcherSeasonEntry[] | undefined
): EntityCommunityWatcherSeasonDisplayRow[] {
  return (seasons ?? []).map((se) => ({
    seasonNumber: se.seasonNumber,
    ratingLabel:
      (se.seasonRating ?? 0) === 0 ? 'Pas de note' : `${se.seasonRating}/5`,
    timesLabel: formatCommunitySeasonTimesLabel(
      se.seasonTimesWatched ?? 0,
      se.watching === true
    ),
  }));
}

function sortSeasonGroupUsers(
  users: EntityCommunitySeasonGroupUserRow[]
): EntityCommunitySeasonGroupUserRow[] {
  const me = users.filter((u) => u.isCurrentUser);
  const others = users
    .filter((u) => !u.isCurrentUser)
    .sort((a, b) =>
      a.displayName.localeCompare(b.displayName, 'fr', { sensitivity: 'base' })
    );
  return [...me, ...others];
}

export function buildSerieSeasonGroups(
  rows: EntityCommunityWatcherDisplayRow[]
): EntityCommunitySeasonGroup[] {
  const bySeason = new Map<number, EntityCommunitySeasonGroupUserRow[]>();

  for (const row of rows) {
    for (const season of row.seasons) {
      const list = bySeason.get(season.seasonNumber) ?? [];
      list.push({
        userId: row.userId,
        displayName: row.displayName,
        ratingLabel: season.ratingLabel,
        timesLabel: season.timesLabel,
        isCurrentUser: row.isCurrentUser,
      });
      bySeason.set(season.seasonNumber, list);
    }
  }

  return [...bySeason.entries()]
    .sort(([a], [b]) => a - b)
    .map(([seasonNumber, users]) => ({
      seasonNumber,
      users: sortSeasonGroupUsers(users),
    }));
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
  readonly serieSeasonGroups = signal<EntityCommunitySeasonGroup[]>([]);

  ngOnInit(): void {
    const { kind, identity, currentUserId } = this.data;
    const currentLower = currentUserId.trim().toLowerCase();

    void getEntityCommunityWatchers(kind, identity, currentUserId)
      .then((list) => {
        const displayRows = list.map((r) => ({
          userId: r.userId,
          displayName: userIdToDisplayName(r.userId),
          ratingLabel:
            (r.rating ?? 0) === 0 ? 'Pas de note' : `${r.rating}/5`,
          timesLabel: formatCommunityCountLabel(kind, r.timesWatched ?? 0),
          isCurrentUser: r.userId.toLowerCase() === currentLower,
          seasons:
            kind === 'serie' ? mapSeasonsForDisplay(r.seasons) : [],
        }));
        this.rows.set(displayRows);
        if (kind === 'serie') {
          this.serieSeasonGroups.set(buildSerieSeasonGroups(displayRows));
        }
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
