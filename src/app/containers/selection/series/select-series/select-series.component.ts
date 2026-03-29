import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Serie } from '../../../../models/serie-model';
import {
  getAllBaseSeries,
  getSeriesByUser,
} from '../../../../facades/series/series.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddSerieComponent } from '../../../add/add-serie/add-serie.component';
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
  allSeriesMergedList = signal<Serie[]>([]);
  searchTerm = signal('');

  // Séries déjà vues par l'utilisateur (pour les exclure en mode ajout)
  watchedSeries = computed<Set<string>>(() => {
    const userSeries = this.userSeries();
    return new Set(userSeries.map((serie) => this.getSerieKey(serie)));
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
    const baseSeries = await getAllBaseSeries();
    return baseSeries.map((serie) => ({
      ...serie,
      seasons: Array.from(
        { length: serie.seasonsData?.length ?? 0 },
        (_, index) => ({
          seasonNumber: index + 1,
          seasonRating: 0,
          seasonTimesWatched: 0,
          lastViewedDate: new Date().toISOString(),
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
