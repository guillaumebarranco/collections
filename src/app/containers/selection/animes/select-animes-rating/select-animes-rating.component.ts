import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Anime } from '../../../../models/anime-model';
import { getAnimesByUser } from '../../../../facades/animes/animes.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';
import { ratingOptionsSelectPages } from '../../../../utils/constants';

@Component({
  selector: 'app-select-animes-rating',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-animes-rating.component.html',
  styleUrls: [
    './select-animes-rating.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectAnimesRatingComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  animesList = signal<Anime[]>([]);

  allAnimes = computed<Anime[]>(() => {
    return this.animesList();
  });

  // Filtre : afficher uniquement les animés sans note
  showOnlyUnrated = signal<boolean>(false);

  // Recherche textuelle (titre / réalisateur / acteurs)
  searchQuery = signal<string>('');

  // Animés affichées selon les filtres actifs. Un animé est considérée
  // "sans note" lorsqu'aucune de ses saisons n'a de seasonRating > 0. On se
  // base sur les saisons d'origine (pas celles en cours d'édition) pour
  // éviter qu'un animé ne disparaisse de la liste dès qu'elle vient d'être
  // notée pendant la session.
  displayedAnimes = computed<Anime[]>(() => {
    let animes = this.allAnimes();

    if (this.showOnlyUnrated()) {
      animes = animes.filter((anime) => {
        const seasons = anime.seasons ?? [];
        if (seasons.length === 0) return true;
        return seasons.every((season) => !season.seasonRating);
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

  animesSeasons = signal<Map<string, Anime['seasons']>>(new Map());

  readonly ratingOptions = ratingOptionsSelectPages;

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

  getSeasonRating(anime: Anime, seasonNumber: number): number {
    const seasons = this.getEditableSeasons(anime);
    return (
      seasons.find((season) => season.seasonNumber === seasonNumber)
        ?.seasonRating ?? 0
    );
  }

  // Mettre Ã  jour le rating d'une saison
  updateSeasonRating(anime: Anime, seasonNumber: number, rating: number): void {
    const key = this.getAnimeKey(anime);
    const seasons = this.getEditableSeasons(anime).map((season) =>
      season.seasonNumber === seasonNumber
        ? { ...season, seasonRating: rating }
        : season
    );
    const updated = new Map(this.animesSeasons());
    updated.set(key, seasons);
    this.animesSeasons.set(updated);
  }

  // Basculer le filtre des animés sans note
  toggleShowOnlyUnrated(checked: boolean): void {
    this.showOnlyUnrated.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de sÃ©ries modifiÃ©es
  modifiedCount = computed(() => {
    return this.animesSeasons().size;
  });

  // Exporter les sÃ©ries avec leur rating mis Ã  jour
  async saveAnimesRatings(): Promise<void> {
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
      const response = await fetch(`${getApiBaseUrl()}/animes/batch-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          animes: animesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('animes:batch-rating:error', payload);
        alert('La mise à jour des notes a échoué.');
        return;
      }

      this.navigateToEntityList('animes');
    } catch (error) {
      console.warn('animes:batch-rating:error', error);
      alert('La mise à jour des notes a échoué.');
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
