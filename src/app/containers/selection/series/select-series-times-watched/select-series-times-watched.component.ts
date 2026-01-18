import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import { getSeriesByUser } from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-series-times-watched',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series-times-watched.component.html',
  styleUrls: [
    './select-series-times-watched.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectSeriesTimesWatchedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  seriesList = signal<Serie[]>([]);

  // Toutes les sÃ©ries de l'utilisateur
  allSeries = computed<Serie[]>(() => {
    return this.seriesList();
  });

  // Map pour stocker les timesWatched mis Ã  jour (clÃ©: title-director, valeur: timesWatched)
  seriesTimesWatched = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour timesWatched
  readonly timesWatchedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  // Obtenir le timesWatched actuel d'une sÃ©rie (depuis la map ou depuis la sÃ©rie originale)
  getTimesWatched(serie: Serie): number {
    const key = this.getSerieKey(serie);
    const updatedValue = this.seriesTimesWatched().get(key);
    return updatedValue !== undefined ? updatedValue : serie.timesWatched;
  }

  // Mettre Ã  jour le timesWatched d'une sÃ©rie
  updateTimesWatched(serie: Serie, timesWatched: number): void {
    const key = this.getSerieKey(serie);
    const updated = new Map(this.seriesTimesWatched());
    updated.set(key, timesWatched);
    this.seriesTimesWatched.set(updated);
  }

  // Compter le nombre de sÃ©ries modifiÃ©es
  modifiedCount = computed(() => {
    return this.allSeries().filter((serie) => {
      const key = this.getSerieKey(serie);
      return this.seriesTimesWatched().has(key);
    }).length;
  });

  async saveSeriesTimesWatched(): Promise<void> {
    if (this.isSaving()) return;

    const seriesToUpdate = this.allSeries().map((serie) => ({
      title: serie.title,
      director: serie.director,
      timesWatched: this.getTimesWatched(serie),
    }));

    if (seriesToUpdate.length === 0) {
      alert('Aucune série à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/series/batch-times-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            series: seriesToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('series:batch-times-watched:error', payload);
        alert("La mise à jour des visionnages a échoué.");
        return;
      }

      this.navigateToEntityList('series');
    } catch (error) {
      console.warn('series:batch-times-watched:error', error);
      alert("La mise à jour des visionnages a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadSeriesData();
  }

  private async loadSeriesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const series = await getSeriesByUser(this.userId());
    this.seriesList.set(series);
    this.isLoading = false;
  }
}
