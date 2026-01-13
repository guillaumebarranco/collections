import { Component, signal, computed } from '@angular/core';
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
export class SelectSeriesRatingComponent extends SelectEntitiesComponent {
  // Toutes les séries de l'utilisateur
  allSeries = computed<Serie[]>(() => {
    return getSeriesByUser(this.userId());
  });

  // Map pour stocker les ratings mis à jour (clé: title-director, valeur: rating)
  seriesRatings = signal<Map<string, number>>(new Map());

  // Valeurs possibles pour rating (0 à 5 avec incréments de 0.5)
  readonly ratingOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  // Générer une clé unique pour une série
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  // Obtenir le rating actuel d'une série (depuis la map ou depuis la série originale)
  getRating(serie: Serie): number {
    const key = this.getSerieKey(serie);
    const updatedValue = this.seriesRatings().get(key);
    return updatedValue !== undefined ? updatedValue : serie.rating;
  }

  // Mettre à jour le rating d'une série
  updateRating(serie: Serie, rating: number): void {
    const key = this.getSerieKey(serie);
    const updated = new Map(this.seriesRatings());
    updated.set(key, rating);
    this.seriesRatings.set(updated);
  }

  // Compter le nombre de séries modifiées
  modifiedCount = computed(() => {
    return this.allSeries().filter((serie) => {
      const key = this.getSerieKey(serie);
      return this.seriesRatings().has(key);
    }).length;
  });

  // Obtenir les étoiles pour un rating (similaire au codebase)
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

  // Exporter les séries avec leur rating mis à jour
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
      alert('Aucune série à exporter !');
      return;
    }

    const jsonContent = JSON.stringify(seriesToExport, null, 2);
    const fileName = `my-series-rating-${this.userId()}-${new Date().getTime()}.json`;

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
