import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Serie } from '../../../models/serie-model';
import { getSeriesByUser } from '../../../facades/series.facade';
import { SelectEntitiesComponent } from '../select-base.component';

@Component({
  selector: 'app-select-series-times-watched',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series-times-watched.component.html',
  styleUrls: [
    './select-series-times-watched.component.scss',
    '../select-base.scss',
  ],
})
export class SelectSeriesTimesWatchedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;

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

  // Exporter les sÃ©ries avec leur timesWatched mis Ã  jour
  exportSeriesTimesWatched(): void {
    const seriesToExport = this.allSeries().map((serie) => {
      const key = this.getSerieKey(serie);
      const updatedTimesWatched = this.seriesTimesWatched().get(key);

      return {
        title: serie.title,
        director: serie.director,
        timesWatched:
          updatedTimesWatched !== undefined
            ? updatedTimesWatched
            : serie.timesWatched,
      };
    });

    if (seriesToExport.length === 0) {
      alert('Aucune sÃ©rie Ã  exporter !');
      return;
    }

    const jsonContent = JSON.stringify(seriesToExport, null, 2);
    const fileName = `my-series-times-watched-${this.userId()}-${new Date().getTime()}.json`;

    // CrÃ©er un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // CrÃ©er un lien de tÃ©lÃ©chargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // TÃ©lÃ©charger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
