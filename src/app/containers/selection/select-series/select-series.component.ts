import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Serie } from '../../../models/serie-model';
import { series1, series2 } from '../../../utils/guillaume/series';

@Component({
  selector: 'app-select-series',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series.component.html',
  styleUrls: ['./select-series.component.scss'],
})
export class SelectSeriesComponent {
  // Toutes les séries de tous les utilisateurs
  allSeries = signal<Serie[]>([
    // Guillaume
    ...series1,
    ...series2,
  ]);

  // Séries sélectionnées
  selectedSeries = signal<Set<string>>(new Set());

  // Nombre de séries sélectionnées
  selectedCount = computed(() => this.selectedSeries().size);

  // Vérifier si une série est sélectionnée
  isSelected(serie: Serie): boolean {
    return this.selectedSeries().has(this.getSerieKey(serie));
  }

  // Générer une clé unique pour une série
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.releaseDate}`;
  }

  // Basculer la sélection d'une série
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

  // Sélectionner toutes les séries
  selectAll(): void {
    const allKeys = new Set(
      this.allSeries().map((serie) => this.getSerieKey(serie))
    );
    this.selectedSeries.set(allKeys);
  }

  // Désélectionner toutes les séries
  deselectAll(): void {
    this.selectedSeries.set(new Set());
  }

  // Exporter les séries sélectionnées en JSON
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
      alert('Aucune série sélectionnée !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedSeriesList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-series-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
