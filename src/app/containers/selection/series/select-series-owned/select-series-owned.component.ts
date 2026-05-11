import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import { getSeriesByUser } from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-series-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-series-owned.component.html',
  styleUrls: [
    './select-series-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectSeriesOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  seriesList = signal<Serie[]>([]);

  // Toutes les séries de l'utilisateur
  allSeries = computed<Serie[]>(() => {
    return this.seriesList();
  });

  // Filtre : afficher uniquement les séries non possédées
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / réalisateur / acteurs)
  searchQuery = signal<string>('');

  // Séries affichées selon les filtres actifs. Le filtre "non possédée" se
  // base sur la valeur d'origine pour éviter qu'une série ne disparaisse
  // dès qu'on la marque comme possédée pendant la session.
  displayedSeries = computed<Serie[]>(() => {
    let series = this.allSeries();

    if (this.showOnlyNotOwned()) {
      series = series.filter((serie) => !serie.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      series = series.filter((serie) => {
        if (serie.title?.toLowerCase().includes(query)) return true;
        if (serie.director?.toLowerCase().includes(query)) return true;
        return (serie.actors ?? []).some((actor) =>
          actor?.name?.toLowerCase().includes(query)
        );
      });
    }

    return series;
  });

  // Map pour stocker les owned mis à jour (clé: title-director)
  seriesOwned = signal<Map<string, boolean>>(new Map());

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getSerieKey(serie: Serie): string {
    return `${serie.title}-${serie.director}`;
  }

  // Obtenir le statut owned actuel d'une série
  getOwned(serie: Serie): boolean {
    const key = this.getSerieKey(serie);
    const updatedValue = this.seriesOwned().get(key);
    return updatedValue !== undefined ? updatedValue : serie.owned;
  }

  updateOwned(serie: Serie, owned: boolean): void {
    const key = this.getSerieKey(serie);
    const updated = new Map(this.seriesOwned());
    updated.set(key, owned);
    this.seriesOwned.set(updated);
  }

  // Basculer le filtre des séries non possédées
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de séries modifiées
  modifiedCount = computed(() => {
    return this.seriesOwned().size;
  });

  async saveSeriesOwned(): Promise<void> {
    if (this.isSaving()) return;

    const seriesToUpdate = this.allSeries().map((serie) => ({
      title: serie.title,
      director: serie.director,
      owned: this.getOwned(serie),
    }));

    if (seriesToUpdate.length === 0) {
      alert('Aucune série à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/series/batch-owned`, {
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
        console.warn('series:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('series');
    } catch (error) {
      console.warn('series:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
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
