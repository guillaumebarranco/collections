import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Manwha } from '../../../../models/manwha-model';
import { getManwhasByUser } from '../../../../facades/manwhas/manwhas.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-manwhas-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-manwhas-times-read.component.html',
  styleUrls: [
    './select-manwhas-times-read.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectManwhasTimesReadComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  manwhasList = signal<Manwha[]>([]);

  allManwhas = computed<Manwha[]>(() => {
    return this.manwhasList();
  });

  // Filtre : afficher uniquement les manwhas non lus
  showOnlyNotRead = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Manwhas affichés selon les filtres actifs. Le filtre "non lu" se base
  // sur la valeur d'origine pour éviter qu'un manwha ne disparaisse dès
  // qu'on lui attribue un nombre de lectures pendant la session.
  displayedManwhas = computed<Manwha[]>(() => {
    let manwhas = this.allManwhas();

    if (this.showOnlyNotRead()) {
      manwhas = manwhas.filter((manwha) => !manwha.readTimes);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      manwhas = manwhas.filter((manwha) => {
        if (manwha.title?.toLowerCase().includes(query)) return true;
        if (manwha.author?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return manwhas;
  });

  manwhasTimesRead = signal<Map<string, number>>(new Map());

  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getManwhaKey(manwha: Manwha): string {
    return `${manwha.title}-${manwha.author}`;
  }

  getTimesRead(manwha: Manwha): number {
    const key = this.getManwhaKey(manwha);
    const updatedValue = this.manwhasTimesRead().get(key);
    const original = manwha.readTimes ?? 0;
    return updatedValue !== undefined ? updatedValue : original;
  }

  updateTimesRead(manwha: Manwha, timesRead: number): void {
    const key = this.getManwhaKey(manwha);
    const updated = new Map(this.manwhasTimesRead());
    updated.set(key, timesRead);
    this.manwhasTimesRead.set(updated);
  }

  // Basculer le filtre des manwhas non lus
  toggleShowOnlyNotRead(checked: boolean): void {
    this.showOnlyNotRead.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allManwhas().filter((manwha) => {
      const key = this.getManwhaKey(manwha);
      return this.manwhasTimesRead().has(key);
    }).length;
  });

  async saveManwhasTimesRead(): Promise<void> {
    if (this.isSaving()) return;

    const manwhasToUpdate = this.allManwhas().map((manwha) => ({
      title: manwha.title,
      author: manwha.author,
      readTimes: this.getTimesRead(manwha),
    }));

    if (manwhasToUpdate.length === 0) {
      alert('Aucun manwha à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/manwhas/batch-times-read`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            manwhas: manwhasToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('manwhas:batch-times-read:error', payload);
        alert('La mise à jour des lectures a échoué.');
        return;
      }

      this.navigateToEntityList('manwhas');
    } catch (error) {
      console.warn('manwhas:batch-times-read:error', error);
      alert('La mise à jour des lectures a échoué.');
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
