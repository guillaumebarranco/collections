import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Bd } from '../../../models/bd-model';
import { getBdsByUser } from '../../../facades/bds/bds.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-bds-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-bds-owned.component.html',
  styleUrls: ['./select-bds-owned.component.scss', '../select-base.scss'],
})
export class SelectBdsOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  bdsList = signal<Bd[]>([]);

  allBds = computed<Bd[]>(() => {
    return this.bdsList();
  });

  bdsOwned = signal<Map<string, boolean>>(new Map());

  private getBdKey(bd: Bd): string {
    return `${bd.title}-${bd.designer}`;
  }

  getOwned(bd: Bd): boolean {
    const key = this.getBdKey(bd);
    const updatedValue = this.bdsOwned().get(key);
    return updatedValue !== undefined ? updatedValue : bd.owned;
  }

  updateOwned(bd: Bd, owned: boolean): void {
    const key = this.getBdKey(bd);
    const updated = new Map(this.bdsOwned());
    updated.set(key, owned);
    this.bdsOwned.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allBds().filter((bd) => {
      const key = this.getBdKey(bd);
      return this.bdsOwned().has(key);
    }).length;
  });

  async saveBdsOwned(): Promise<void> {
    if (this.isSaving()) return;

    const bdsToUpdate = this.allBds().map((bd) => ({
      title: bd.title,
      designer: bd.designer,
      owned: this.getOwned(bd),
    }));

    if (bdsToUpdate.length === 0) {
      alert('Aucune BD à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/bds/batch-owned`, {
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
        console.warn('bds:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('bds');
    } catch (error) {
      console.warn('bds:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
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
