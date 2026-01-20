import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import { getSeriesByUser } from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-series-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series-rating.component.html',
  styleUrls: [
    './select-series-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectSeriesRatingComponent
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

  // Map pour stocker les saisons mises Ã  jour (clÃ©: title-director)
  seriesSeasons = signal<Map<string, Serie['seasons']>>(new Map());

  // Valeurs possibles pour rating (0 Ã  5 avec incrÃ©ments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  private getSerieSeasons(serie: Serie) {
    if (serie.seasons && serie.seasons.length > 0) {
      return serie.seasons;
    }
    const total = serie.seasonsData?.length ?? serie.nbSeasons ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
    }));
  }

  getEditableSeasons(serie: Serie) {
    const key = this.getSerieKey(serie);
    return this.seriesSeasons().get(key) ?? this.getSerieSeasons(serie);
  }

  getSeasonRating(serie: Serie, seasonNumber: number): number {
    const seasons = this.getEditableSeasons(serie);
    return (
      seasons.find((season) => season.seasonNumber === seasonNumber)
        ?.seasonRating ?? 0
    );
  }

  // Mettre Ã  jour le rating d'une saison
  updateSeasonRating(
    serie: Serie,
    seasonNumber: number,
    rating: number
  ): void {
    const key = this.getSerieKey(serie);
    const seasons = this.getEditableSeasons(serie).map((season) =>
      season.seasonNumber === seasonNumber
        ? { ...season, seasonRating: rating }
        : season
    );
    const updated = new Map(this.seriesSeasons());
    updated.set(key, seasons);
    this.seriesSeasons.set(updated);
  }

  // Compter le nombre de sÃ©ries modifiÃ©es
  modifiedCount = computed(() => {
    return this.seriesSeasons().size;
  });

  // Exporter les sÃ©ries avec leur rating mis Ã  jour
  async saveSeriesRatings(): Promise<void> {
    if (this.isSaving()) return;

    const seriesToUpdate = this.allSeries().map((serie) => ({
      title: serie.title,
      director: serie.director,
      seasons: this.getEditableSeasons(serie),
    }));

    if (seriesToUpdate.length === 0) {
      alert('Aucune série à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/series/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          series: seriesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('series:batch-rating:error', payload);
        alert("La mise à jour des notes a échoué.");
        return;
      }

      this.navigateToEntityList('series');
    } catch (error) {
      console.warn('series:batch-rating:error', error);
      alert("La mise à jour des notes a échoué.");
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
