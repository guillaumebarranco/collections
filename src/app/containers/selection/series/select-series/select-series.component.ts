import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import {
  getAllSeriesMerged,
  getSeriesByUser,
} from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSerieComponent } from '../../../add/add-serie/add-serie.component';
import { isLocalhost, getApiBaseUrl } from '../../../../core/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-series',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-series.component.html',
  styleUrls: ['./select-series.component.scss', '../../select-base.scss'],
})
export class SelectSeriesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);
  private router = inject(Router);

  userSeries = signal<Serie[]>([]);
  allSeriesMergedList = signal<Serie[]>([]);

  // Séries déjà vues par l'utilisateur (pour les exclure en mode ajout)
  watchedSeries = computed<Set<string>>(() => {
    const userSeries = this.userSeries();
    return new Set(
      userSeries.map((serie) => this.getSerieKey(serie))
    );
  });

  // Toutes les séries, filtrées en mode ajout
  allSeries = computed<Serie[]>(() => {
    const allSeriesList = this.allSeriesMergedList();

    if (!this.isWatchOrReadlistMode()) {
      return allSeriesList.filter(
        (serie) => !this.watchedSeries().has(this.getSerieKey(serie))
      );
    }

    return allSeriesList.filter(
      (serie) => !this.watchedSeries().has(this.getSerieKey(serie))
    );
  });

  selectedSeries = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedSeries().size);

  isSelected(serie: Serie): boolean {
    return this.selectedSeries().has(this.getSerieKey(serie));
  }

  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.releaseDate}`;
  }

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

  openAddSerieDialog(): void {
    const dialogRef = this.dialog.open(AddSerieComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/series`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const series = await getSeriesByUser(userId);
    const allSeries = await this.getAllSeriesForSelection(userId);
    this.userSeries.set(series);
    this.allSeriesMergedList.set(allSeries);
  }

  private async getAllSeriesForSelection(userId: string): Promise<Serie[]> {
    if (isLocalhost()) {
      return getAllSeriesMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/series/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedSeries(): Promise<void> {
    const selectedSeriesList = this.allSeries()
      .filter((serie) => this.isSelected(serie))
      .map((serie) => {
        return {
          ...serie,
          timesWatched: 1,
          rating: 0,
        };
      });

    const series = selectedSeriesList.map((serie) => ({
      title: serie.title,
      director: serie.director,
    }));

    if (series.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/series/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          series,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des séries :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/series`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des séries.", error);
    }
  }
}
