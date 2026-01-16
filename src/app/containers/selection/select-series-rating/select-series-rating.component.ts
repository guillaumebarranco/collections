import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Serie } from '../../../models/serie-model';
import { getSeriesByUser } from '../../../facades/series.facade';
import { SelectEntitiesComponent } from '../select-base.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-select-series-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series-rating.component.html',
  styleUrls: ['./select-series-rating.component.scss', '../select-base.scss'],
})
export class SelectSeriesRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;

  seriesList = signal<Serie[]>([]);

  // Toutes les sÃ©ries de l'utilisateur
  allSeries = computed<Serie[]>(() => {
    return this.seriesList();
  });

  // Map pour stocker les ratings mis Ã  jour (clÃ©: title-director, valeur: rating)
  seriesRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 Ã  5 avec incrÃ©ments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  // Obtenir le rating actuel d'une sÃ©rie (depuis la map ou depuis la sÃ©rie originale)
  getRating(serie: Serie): number {
    const key = this.getSerieKey(serie);
    const updatedValue = this.seriesRatings().get(key);
    return updatedValue !== undefined ? updatedValue : serie.rating;
  }

  // Mettre Ã  jour le rating d'une sÃ©rie
  updateRating(serie: Serie, rating: number): void {
    const key = this.getSerieKey(serie);
    const updated = new Map(this.seriesRatings());
    updated.set(key, rating);
    this.seriesRatings.set(updated);
  }

  // Compter le nombre de sÃ©ries modifiÃ©es
  modifiedCount = computed(() => {
    return this.allSeries().filter((serie) => {
      const key = this.getSerieKey(serie);
      return this.seriesRatings().has(key);
    }).length;
  });

  // Obtenir les Ã©toiles pour un rating (similaire au codebase)
  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  // Exporter les sÃ©ries avec leur rating mis Ã  jour
  exportSeriesRatings(): void {
    const seriesToExport = this.allSeries().map((serie) => {
      const key = this.getSerieKey(serie);
      const updatedRating = this.seriesRatings().get(key);

      return {
        title: serie.title,
        director: serie.director,
        rating: updatedRating !== undefined ? updatedRating : serie.rating,
      };
    });

    if (seriesToExport.length === 0) {
      alert('Aucune sÃ©rie Ã  exporter !');
      return;
    }

    const jsonContent = JSON.stringify(seriesToExport, null, 2);
    const fileName = `my-series-rating-${this.userId()}-${new Date().getTime()}.json`;

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
