import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Anime } from '../../../../models/anime-model';
import {
  getAllBaseAnimesLight,
  getUserAnimesRaw,
  getWatchlistAnimesRaw,
} from '../../../../facades/animes/animes.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAnimeComponent } from '../../../add/add-anime/add-anime.component';
import { RequestEntityAddModalComponent } from '../../../../components/modals/request-entity-add-modal/request-entity-add-modal.component';
import { getApiBaseUrl } from '../../../../core/config';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-animes',
  imports: [CommonModule, MenuComponent, MatDialogModule],
  templateUrl: './select-animes.component.html',
  styleUrls: ['./select-animes.component.scss', '../../select-base.scss'],
})
export class SelectAnimesComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  userAnimes = signal<Anime[]>([]);
  watchlistAnimes = signal<Anime[]>([]);
  allAnimesMergedList = signal<Anime[]>([]);
  searchTerm = signal('');

  // Animés déjà dans la collection (vues / notées)
  watchedAnimes = computed<Set<string>>(() => {
    const userAnimes = this.userAnimes();
    return new Set(userAnimes.map((anime) => this.getAnimeKey(anime)));
  });

  /** Déjà en watchlist — exclues pour éviter les doublons (comme select-movies). */
  alreadyInWatchlistAnimes = computed<Set<string>>(() => {
    return new Set(
      this.watchlistAnimes().map((anime) => this.getAnimeKey(anime))
    );
  });

  /** Au moins un animé vue issue du catalogue — pour afficher l’ajout manuel. */
  hasWatchedAnimesFromExistingCatalog = computed(() => {
    const catalogKeys = new Set(
      this.allAnimesMergedList().map((s) => this.getAnimeKey(s))
    );
    return this.userAnimes().some((s) =>
      catalogKeys.has(this.getAnimeKey(s))
    );
  });

  // Catalogue : ni déjà en collection, ni déjà en watchlist (même logique que select-movies).
  allAnimes = computed<Anime[]>(() => {
    const allAnimesList = this.allAnimesMergedList();
    return allAnimesList.filter(
      (anime) =>
        !this.watchedAnimes().has(this.getAnimeKey(anime)) &&
        !this.alreadyInWatchlistAnimes().has(this.getAnimeKey(anime))
    );
  });

  filteredAnimes = computed<Anime[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allAnimes();
    if (!normalizedTerm) return list;
    return list.filter((anime) => {
      const title = normalizeSearchText(anime.title ?? '');
      const director = normalizeSearchText(anime.director ?? '');
      return (
        title.includes(normalizedTerm) || director.includes(normalizedTerm)
      );
    });
  });

  selectedAnimes = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedAnimes().size);

  isSelected(anime: Anime): boolean {
    return this.selectedAnimes().has(this.getAnimeKey(anime));
  }

  private getAnimeKey(anime: Anime): string {
    return `${anime.title}-${anime.director}`;
  }

  toggleSelection(anime: Anime): void {
    const key = this.getAnimeKey(anime);
    const selected = new Set(this.selectedAnimes());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedAnimes.set(selected);
  }

  openRequestEntityAddDialog(): void {
    this.dialog.open(RequestEntityAddModalComponent, {
      data: { entityType: 'anime', userId: this.userId() },
      width: '480px',
      maxWidth: '95vw',
    });
  }

  openAddAnimeDialog(): void {
    const dialogRef = this.dialog.open(AddAnimeComponent, {
      data: { userId: this.userId(), listMode: this.listModeFlag() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/animes`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [animes, watchlist, allAnimes] = await Promise.all([
      getUserAnimesRaw(userId),
      getWatchlistAnimesRaw(userId),
      this.getAllAnimesForSelection(userId),
    ]);
    this.userAnimes.set(animes as Anime[]);
    this.watchlistAnimes.set(watchlist as Anime[]);
    this.allAnimesMergedList.set(allAnimes);
  }

  private async getAllAnimesForSelection(userId: string): Promise<Anime[]> {
    const baseAnimes = await getAllBaseAnimesLight();
    return baseAnimes.map((anime) => ({
      title: anime.title,
      director: anime.director,
      coverUrl: anime.coverUrl ?? '',
      releaseDate: anime.releaseDate ?? '',
      actors: [],
      endDate: '',
      genre: [],
      seasonsData: [],
      description: '',
      countryOrigin: '' as const,
      saga: '',
      fromEntity: null,
      seasons: Array.from(
        { length: anime.seasonsCount ?? 0 },
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
      quotes: [],
    }));
  }

  protected async addSelectedAnimes(): Promise<void> {
    const selectedAnimesList = this.allAnimes()
      .filter((anime) => this.isSelected(anime))
      .map((anime) => ({ ...anime }));

    const animes = selectedAnimesList.map((anime) => ({
      title: anime.title,
      director: anime.director,
    }));

    if (animes.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/animes/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          animes,
          watchlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des animés :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/animes`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des animés.", error);
    }
  }
}
