import { Component, signal, computed } from '@angular/core';
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
export class SelectSeriesTimesWatchedComponent extends SelectEntitiesComponent {
  // Toutes les séries de l'utilisateur
  allSeries = computed<Serie[]>(() => {
    return getSeriesByUser(this.userId());
  });

  // Map pour stocker les timesWatched mis à jour (clé: title-director, valeur: timesWatched)
  seriesTimesWatched = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour timesWatched
  readonly timesWatchedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // Générer une clé unique pour une série
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  // Obtenir le timesWatched actuel d'une série (depuis la map ou depuis la série originale)
  getTimesWatched(serie: Serie): number {
    const key = this.getSerieKey(serie);
    const updatedValue = this.seriesTimesWatched().get(key);
    return updatedValue !== undefined ? updatedValue : serie.timesWatched;
  }

  // Mettre à jour le timesWatched d'une série
  updateTimesWatched(serie: Serie, timesWatched: number): void {
    const key = this.getSerieKey(serie);
    const updated = new Map(this.seriesTimesWatched());
    updated.set(key, timesWatched);
    this.seriesTimesWatched.set(updated);
  }

  // Compter le nombre de séries modifiées
  modifiedCount = computed(() => {
    return this.allSeries().filter((serie) => {
      const key = this.getSerieKey(serie);
      return this.seriesTimesWatched().has(key);
    }).length;
  });

  // Exporter les séries avec leur timesWatched mis à jour
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
      alert('Aucune série à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(seriesToExport, null, 2);
    const fileName = `my-series-times-watched-${this.userId()}-${new Date().getTime()}.json`;

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
