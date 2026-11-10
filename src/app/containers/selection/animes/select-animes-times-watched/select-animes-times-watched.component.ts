import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Anime } from '../../../../models/anime-model';
import { getAnimesByUser } from '../../../../facades/animes/animes.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-animes-times-watched',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-animes-times-watched.component.html',
  styleUrls: [
    './select-animes-times-watched.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectAnimesTimesWatchedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  animesList = signal<Anime[]>([]);

  allAnimes = computed<Anime[]>(() => {
    return this.animesList();
  });

  showOnlyNotWatched = signal<boolean>(false);

  searchQuery = signal<string>('');

  displayedAnimes = computed<Anime[]>(() => {
    let animes = this.allAnimes();

    if (this.showOnlyNotWatched()) {
      animes = animes.filter((anime) => {
        if (!anime.seasons || anime.seasons.length === 0) return true;
        return anime.seasons.every((season) => !season.seasonTimesWatched);
      });
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      animes = animes.filter((anime) => {
        if (anime.title?.toLowerCase().includes(query)) return true;
        if (anime.director?.toLowerCase().includes(query)) return true;
        return (anime.actors ?? []).some((actor) =>
          actor?.name?.toLowerCase().includes(query)
        );
      });
    }

    return animes;
  });

  // Map pour stocker les saisons mises Ã  jour (clÃ©: title-director)
  animesSeasons = signal<Map<string, Anime['seasons']>>(new Map());

  // Valeurs possibles pour timesWatched
  readonly timesWatchedOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 40, 50];

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getAnimeKey(anime: Anime): string {
    return `${anime.title}-${anime.director}`;
  }

  private getAnimeSeasons(anime: Anime) {
    if (anime.seasons && anime.seasons.length > 0) {
      return anime.seasons;
    }
    const total = anime.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      watching: false,
      seasonTimesWatched: 0,
      firstViewedDate: '',
      lastViewedDate: '',
      otherViewedDates: [],
    }));
  }

  getEditableSeasons(anime: Anime) {
    const key = this.getAnimeKey(anime);
    return this.animesSeasons().get(key) ?? this.getAnimeSeasons(anime);
  }

  // Obtenir le timesWatched actuel d'une sÃ©rie (depuis la map ou depuis les saisons)
  getTimesWatched(anime: Anime): number {
    const key = this.getAnimeKey(anime);
    const updatedValue = this.animesSeasons().get(key);
    const seasons = updatedValue ?? this.getAnimeSeasons(anime);
    if (seasons.length === 0) return 0;
    const total = seasons.reduce(
      (sum, season) => sum + (season.seasonTimesWatched || 0),
      0
    );
    return total > 0 ? total / seasons.length : 0;
  }

  getSeasonTimesWatched(anime: Anime, seasonNumber: number): number {
    const seasons = this.getEditableSeasons(anime);
    return (
      seasons.find((season) => season.seasonNumber === seasonNumber)
        ?.seasonTimesWatched ?? 0
    );
  }

  // Mettre Ã  jour le timesWatched d'une saison
  updateSeasonTimesWatched(
    anime: Anime,
    seasonNumber: number,
    timesWatched: number
  ): void {
    const key = this.getAnimeKey(anime);
    const seasons = this.getEditableSeasons(anime).map((season) =>
      season.seasonNumber === seasonNumber
        ? { ...season, seasonTimesWatched: timesWatched }
        : season
    );
    const updated = new Map(this.animesSeasons());
    updated.set(key, seasons);
    this.animesSeasons.set(updated);
  }

  toggleShowOnlyNotWatched(checked: boolean): void {
    this.showOnlyNotWatched.set(checked);
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de sÃ©ries modifiÃ©es
  modifiedCount = computed(() => {
    return this.animesSeasons().size;
  });

  async saveAnimesTimesWatched(): Promise<void> {
    if (this.isSaving()) return;

    const animesToUpdate = this.allAnimes().map((anime) => ({
      title: anime.title,
      director: anime.director,
      seasons: this.getEditableSeasons(anime),
    }));

    if (animesToUpdate.length === 0) {
      alert('Aucun animé à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/animes/batch-times-watched`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: this.userId(),
            animes: animesToUpdate,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('animes:batch-times-watched:error', payload);
        alert('La mise à jour des visionnages a échoué.');
        return;
      }

      this.navigateToEntityList('animes');
    } catch (error) {
      console.warn('animes:batch-times-watched:error', error);
      alert('La mise à jour des visionnages a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadAnimesData();
  }

  private async loadAnimesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const animes = await getAnimesByUser(this.userId());
    this.animesList.set(animes);
    this.isLoading = false;
  }
}
