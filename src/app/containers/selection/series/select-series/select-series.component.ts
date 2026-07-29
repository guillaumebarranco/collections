import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import {
  getAllBaseSeries,
  getCurrentWatchlistSeriesByUser,
  getSeriesByUser,
} from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSerieComponent } from '../../../add/add-serie/add-serie.component';
import { RequestEntityAddModalComponent } from '../../../../components/modals/request-entity-add-modal/request-entity-add-modal.component';
import { getApiBaseUrl } from '../../../../core/config';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

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

  userSeries = signal<Serie[]>([]);
  watchlistSeries = signal<Serie[]>([]);
  allSeriesMergedList = signal<Serie[]>([]);
  searchTerm = signal('');

  // Séries déjà dans la collection (vues / notées)
  watchedSeries = computed<Set<string>>(() => {
    const userSeries = this.userSeries();
    return new Set(userSeries.map((serie) => this.getSerieKey(serie)));
  });

  /** Déjà en watchlist — exclues pour éviter les doublons (comme select-movies). */
  alreadyInWatchlistSeries = computed<Set<string>>(() => {
    return new Set(
      this.watchlistSeries().map((serie) => this.getSerieKey(serie))
    );
  });

  /** Au moins une série vue issue du catalogue — pour afficher l’ajout manuel. */
  hasWatchedSeriesFromExistingCatalog = computed(() => {
    const catalogKeys = new Set(
      this.allSeriesMergedList().map((s) => this.getSerieKey(s))
    );
    return this.userSeries().some((s) =>
      catalogKeys.has(this.getSerieKey(s))
    );
  });

  // Catalogue : ni déjà en collection, ni déjà en watchlist (même logique que select-movies).
  allSeries = computed<Serie[]>(() => {
    const allSeriesList = this.allSeriesMergedList();
    return allSeriesList.filter(
      (serie) =>
        !this.watchedSeries().has(this.getSerieKey(serie)) &&
        !this.alreadyInWatchlistSeries().has(this.getSerieKey(serie))
    );
  });

  filteredSeries = computed<Serie[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allSeries();
    if (!normalizedTerm) return list;
    return list.filter((serie) => {
      const title = normalizeSearchText(serie.title ?? '');
      const director = normalizeSearchText(serie.director ?? '');
      return (
        title.includes(normalizedTerm) || director.includes(normalizedTerm)
      );
    });
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

  openRequestEntityAddDialog(): void {
    this.dialog.open(RequestEntityAddModalComponent, {
      data: { entityType: 'serie', userId: this.userId() },
      width: '480px',
      maxWidth: '95vw',
    });
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
    const [series, watchlist] = await Promise.all([
      getSeriesByUser(userId),
      getCurrentWatchlistSeriesByUser(userId),
    ]);
    const allSeries = await this.getAllSeriesForSelection(userId);
    this.userSeries.set(series);
    this.watchlistSeries.set(watchlist);
    this.allSeriesMergedList.set(allSeries);
  }

  private async getAllSeriesForSelection(userId: string): Promise<Serie[]> {
    const baseSeries = await getAllBaseSeries();
    return baseSeries.map((serie) => ({
      ...serie,
      seasons: Array.from(
        { length: serie.seasonsData?.length ?? 0 },
        (_, index) => ({
          seasonNumber: index + 1,
          seasonRating: 0,
          watching: false,
          seasonTimesWatched: 0,
          firstViewedDate: '',
          lastViewedDate: '',
          otherViewedDates: [],
        })
      ),
      owned: false,
      watchPriority: 1,
      wantToWatchAgain: false,
      ratingComment: '',
      borrowed: '',
      loaned: '',
    }));
  }

  protected async addSelectedSeries(): Promise<void> {
    const selectedSeriesList = this.allSeries()
      .filter((serie) => this.isSelected(serie))
      .map((serie) => ({ ...serie }));

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
          watchlist: this.isWatchOrReadlistMode(),
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
