import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { EntityBadgeProgressRow } from '../../../utils/entity-badge-progress.types';

/**
 * Contenu visuel commun aux modales « entité passée de la liste à faire → faite »
 * (ex. watchlist → vu, readlist → lu).
 */
@Component({
  selector: 'app-entity-update-follow-up-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-update-follow-up-modal.component.html',
  styleUrls: ['./entity-update-follow-up-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityUpdateFollowUpModalComponent {
  readonly entityTitle = input.required<string>();
  readonly coverUrl = input<string>('');
  /** Texte d’accessibilité pour la couverture / jaquette. */
  readonly coverAlt = input<string>('');
  /** Début du message : ex. « Vous avez vu » / « Vous avez lu ». */
  readonly messageLead = input.required<string>();
  /** Unité pour le libellé « Palier max (N …) » : « films » / « livres ». */
  readonly progressUnitLabel = input.required<string>();
  readonly progressRows = input<EntityBadgeProgressRow[]>([]);

  readonly dismiss = output<void>();

  readonly sparkIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  readonly effectiveCoverAlt = computed(() => {
    const alt = this.coverAlt();
    return alt.trim() ? alt : `Illustration : ${this.entityTitle()}`;
  });

  readonly titleId = 'entity-follow-up-title';
  readonly descId = 'entity-follow-up-desc';

  onDismiss(): void {
    this.dismiss.emit();
  }

  progressPercent(row: EntityBadgeProgressRow): number {
    if (row.target <= 0) return 100;
    return Math.min(100, Math.round((row.current / row.target) * 100));
  }
}
