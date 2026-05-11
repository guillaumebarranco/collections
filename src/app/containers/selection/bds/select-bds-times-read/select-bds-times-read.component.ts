import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Bd } from '../../../../models/bd-model';
import { getBdsByUser } from '../../../../facades/bds/bds.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-bds-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-bds-times-read.component.html',
  styleUrls: [
    './select-bds-times-read.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectBdsTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  bdsList = signal<Bd[]>([]);

  allBds = computed<Bd[]>(() => {
    return this.bdsList();
  });

  // Filtre : afficher uniquement les BDs non lues
  showOnlyNotRead = signal<boolean>(false);

  // Recherche textuelle (titre / scénariste)
  searchQuery = signal<string>('');

  // BDs affichées selon les filtres actifs. Le filtre "non lu" se base sur
  // la valeur d'origine pour éviter qu'une BD ne disparaisse dès qu'on lui
  // attribue un nombre de lectures pendant la session.
  displayedBds = computed<Bd[]>(() => {
    let bds = this.allBds();

    if (this.showOnlyNotRead()) {
      bds = bds.filter((bd) => !bd.readTimes);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      bds = bds.filter((bd) => {
        if (bd.title?.toLowerCase().includes(query)) return true;
        if (bd.writer?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return bds;
  });

  bdsTimesRead = signal<Map<string, number>>(new Map());

  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getBdKey(bd: Bd): string {
    return `${bd.title}-${bd.writer}`;
  }

  getTimesRead(bd: Bd): number {
    const key = this.getBdKey(bd);
    const updatedValue = this.bdsTimesRead().get(key);
    const original = bd.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  updateTimesRead(bd: Bd, timesRead: number): void {
    const key = this.getBdKey(bd);
    const updated = new Map(this.bdsTimesRead());
    updated.set(key, timesRead);
    this.bdsTimesRead.set(updated);
  }

  // Basculer le filtre des BDs non lues
  toggleShowOnlyNotRead(checked: boolean): void {
    this.showOnlyNotRead.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allBds().filter((bd) => {
      const key = this.getBdKey(bd);
      return this.bdsTimesRead().has(key);
    }).length;
  });

  async saveBdsTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const bdsToUpdate = this.allBds().map((bd) => ({
      title: bd.title,
      writer: bd.writer,
      readTimes: this.getTimesRead(bd),
    }));

    if (bdsToUpdate.length === 0) {
      alert('Aucune BD à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds/batch-times-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          bds: bdsToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('bds:batch-times-read:error', payload);
        alert('La mise à jour des lectures a échoué.');
        return;
      }

      this.navigateToEntityList('bds');
    } catch (error) {
      console.warn('bds:batch-times-read:error', error);
      alert('La mise à jour des lectures a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadBdsData();
  }

  private async loadBdsData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const bds = await getBdsByUser(this.userId());
    this.bdsList.set(bds);
    this.isLoading = false;
  }
}
