import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardShowcaseSlotView {
  filled: boolean;
  title: string;
  coverUrl: string;
  entityLabel: string;
}

/**
 * Bandeau des 5 œuvres phares, affiché au-dessus des onglets du tableau de bord.
 */
@Component({
  selector: 'app-dashboard-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-showcase.component.html',
  styleUrls: ['./dashboard-showcase.component.scss'],
})
export class DashboardShowcaseComponent {
  readonly slots = input.required<DashboardShowcaseSlotView[]>();
  readonly canEdit = input(false);
  /** L'utilisateur a déjà classé au moins une œuvre dans un top 5 de collection. */
  readonly hasEntityTopFive = input(false);
  /** Index de l'emplacement en cours d'ouverture, ou null. */
  readonly openingSlot = input<number | null>(null);

  readonly slotSelected = output<number>();

  protected visible(): boolean {
    return this.canEdit() || this.slots().some((slot) => slot.filled);
  }

  protected onSlotClick(index: number): void {
    if (!this.canEdit() || this.openingSlot() !== null) return;
    this.slotSelected.emit(index);
  }

  protected slotAriaLabel(
    slot: DashboardShowcaseSlotView,
    index: number
  ): string {
    const place = `Emplacement ${index + 1}`;
    if (slot.filled) {
      return `${place} : ${slot.title}. Cliquer pour changer d’œuvre.`;
    }
    if (!this.hasEntityTopFive()) {
      return `${place}. Faites d’abord un top 5 dans vos collections.`;
    }
    return `${place}. Cliquer pour choisir une œuvre de vos top 5.`;
  }
}
