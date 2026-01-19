import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Bd } from '../../../models/bd-model';
import { getBdsByUser } from '../../../facades/bds/bds.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { getApiBaseUrl } from '../../../core/config';

@Component({
  selector: 'app-select-bds-times-read',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-bds-times-read.component.html',
  styleUrls: ['./select-bds-times-read.component.scss', '../select-base.scss'],
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

  bdsTimesRead = signal<Map<string, number>>(new Map());

  readonly timesReadOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  private getBdKey(bd: Bd): string {
    return `${bd.title}-${bd.author}`;
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
      author: bd.author,
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
        alert("La mise à jour des lectures a échoué.");
        return;
      }

      this.navigateToEntityList('bds');
    } catch (error) {
      console.warn('bds:batch-times-read:error', error);
      alert("La mise à jour des lectures a échoué.");
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
