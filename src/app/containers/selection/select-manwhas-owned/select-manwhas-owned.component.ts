import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Manwha } from '../../../models/manwha-model';
import { getManwhasByUser } from '../../../facades/manwhas/manwhas.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-manwhas-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-manwhas-owned.component.html',
  styleUrls: ['./select-manwhas-owned.component.scss', '../select-base.scss'],
})
export class SelectManwhasOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  manwhasList = signal<Manwha[]>([]);

  allManwhas = computed<Manwha[]>(() => {
    return this.manwhasList();
  });

  manwhasOwned = signal<Map<string, boolean>>(new Map());

  private getManwhaKey(manwha: Manwha): string {
    return `${manwha.title}-${manwha.author}`;
  }

  getOwned(manwha: Manwha): boolean {
    const key = this.getManwhaKey(manwha);
    const updatedValue = this.manwhasOwned().get(key);
    return updatedValue !== undefined ? updatedValue : manwha.owned;
  }

  updateOwned(manwha: Manwha, owned: boolean): void {
    const key = this.getManwhaKey(manwha);
    const updated = new Map(this.manwhasOwned());
    updated.set(key, owned);
    this.manwhasOwned.set(updated);
  }

  modifiedCount = computed(() => {
    return this.allManwhas().filter((manwha) => {
      const key = this.getManwhaKey(manwha);
      return this.manwhasOwned().has(key);
    }).length;
  });

  async saveManwhasOwned(): Promise<void> {
    if (this.isSaving()) return;

    const manwhasToUpdate = this.allManwhas().map((manwha) => ({
      title: manwha.title,
      author: manwha.author,
      owned: this.getOwned(manwha),
    }));

    if (manwhasToUpdate.length === 0) {
      alert('Aucun manwha à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas/batch-owned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          manwhas: manwhasToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('manwhas:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('manwhas');
    } catch (error) {
      console.warn('manwhas:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadManwhasData();
  }

  private async loadManwhasData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const manwhas = await getManwhasByUser(this.userId());
    this.manwhasList.set(manwhas);
    this.isLoading = false;
  }
}
