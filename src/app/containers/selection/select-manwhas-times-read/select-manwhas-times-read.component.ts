import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Manwha } from '../../../models/manwha-model';
import { getManwhasByUser } from '../../../facades/manwhas/manwhas.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-manwhas-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-manwhas-times-read.component.html',
  styleUrls: ['./select-manwhas-times-read.component.scss', '../select-base.scss'],
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
        alert("La mise à jour des lectures a échoué.");
        return;
      }

      this.manwhasTimesRead.set(new Map());
      await this.loadManwhasData();
    } catch (error) {
      console.warn('manwhas:batch-times-read:error', error);
      alert("La mise à jour des lectures a échoué.");
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
