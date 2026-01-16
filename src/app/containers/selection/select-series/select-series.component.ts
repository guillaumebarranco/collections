import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Serie } from '../../../models/serie-model';
import {
  getAllSeriesMerged,
  getSeriesByUser,
} from '../../../facades/series.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSerieComponent } from '../../add/add-serie/add-serie.component';
import { isLocalhost } from '../../../core/config';

@Component({
  selector: 'app-select-series',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-series.component.html',
  styleUrls: ['./select-series.component.scss', '../select-base.scss'],
})
export class SelectSeriesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private isLoading = false;

  userSeries = signal<Serie[]>([]);
  allSeriesMergedList = signal<Serie[]>([]);

  // Series already watched by user (exclude in add mode)
  watchedSeries = computed<Set<string>>(() => {
    if (!this.isAddMode()) {
      return new Set();
    }
    const userSeries = this.userSeries();
    return new Set(
      userSeries.map((serie) => `${serie.title}-${serie.releaseDate}`)
    );
  });

  // All series, filtered in add mode
  allSeries = computed<Serie[]>(() => {
    const allSeriesList = this.allSeriesMergedList();

    if (this.isAddMode()) {
      return allSeriesList.filter(
        (serie) =>
          !this.watchedSeries().has(`${serie.title}-${serie.releaseDate}`)
      );
    }

    return allSeriesList;
  });

  // Selected series
  selectedSeries = signal<Set<string>>(new Set());

  // Number of selected series
  selectedCount = computed(() => this.selectedSeries().size);

  isAdding = signal<boolean>(false);
  addErrorMessage = signal<string>('');

  // Check if a serie is selected
  isSelected(serie: Serie): boolean {
    return this.selectedSeries().has(this.getSerieKey(serie));
  }

  // Unique key for a serie
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.releaseDate}`;
  }

  // Toggle selection
  toggleSelection(serie: Serie): void {
    const key = this.getSerieKey(serie);
    const selected = new Set(this.selectedSeries());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedSeries.set(selected);
  }

  // Select all
  selectAll(): void {
    const allKeys = new Set(
      this.allSeries().map((serie) => this.getSerieKey(serie))
    );
    this.selectedSeries.set(allKeys);
  }

  // Deselect all
  deselectAll(): void {
    this.selectedSeries.set(new Set());
  }

  openAddSerieDialog(): void {
    const dialogRef = this.dialog.open(AddSerieComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        void this.loadSeriesData();
      }
    });
  }

  async addSelectedSeries(): Promise<void> {
    const selected = this.selectedSeries();
    if (selected.size === 0) return;

    this.isAdding.set(true);
    this.addErrorMessage.set('');

    try {
      const series = this.allSeries()
        .filter((serie) => selected.has(this.getSerieKey(serie)))
        .map((serie) => ({
          title: serie.title,
          director: serie.director,
        }));

      const response = await fetch(`${this.getApiUrl()}/series/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          series,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.addErrorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.selectedSeries.set(new Set());
      await this.loadSeriesData();
    } catch (error) {
      this.addErrorMessage.set("Erreur reseau lors de l'ajout.");
    } finally {
      this.isAdding.set(false);
    }
  }

  // Export selected series as JSON
  exportSelectedSeries(): void {
    const selectedSeriesList = this.allSeries()
      .filter((serie) => this.isSelected(serie))
      .map((serie) => {
        return {
          ...serie,
          timesWatched: 1,
          rating: 0,
        };
      });

    if (selectedSeriesList.length === 0) {
      alert('Aucune serie selectionnee !');
      return;
    }

    const jsonContent = JSON.stringify(selectedSeriesList, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-series-selection-${new Date().getTime()}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  ngOnInit() {
    void this.loadSeriesData();
  }

  private async loadSeriesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const userId = this.userId();
    const series = await getSeriesByUser(userId);
    const allSeries = await this.getAllSeriesForSelection(userId);
    this.userSeries.set(series);
    this.allSeriesMergedList.set(allSeries);
    this.isLoading = false;
  }

  private async getAllSeriesForSelection(userId: string): Promise<Serie[]> {
    if (this.isLocalhost()) {
      return getAllSeriesMerged(userId);
    }
    try {
      const response = await fetch(`${this.getApiUrl()}/series/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  private isLocalhost(): boolean {
    return isLocalhost();
  }

  private getApiUrl(): string {
    return document.location.origin.includes('localhost')
      ? `http://localhost:3001/api`
      : 'https://makya.webarranco.fr/api';
  }
}
