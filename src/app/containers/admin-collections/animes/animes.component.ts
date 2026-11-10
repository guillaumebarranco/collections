import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimeComponent } from '../../../components/collections/anime/anime.component';
import { AdminAnimesHeaderComponent } from './animes-header/animes-header.component';

import { normalizeAnimeGenres, Anime } from '../../../models/anime-model';
import {
  AnimeView,
  getAnimesByCountry,
  getAnimesBySaga,
  getSortedAnimes,
  animeViewOptions,
} from '../../collections/animes/animes.utils';
import { getAllBaseAnimes } from '../../../facades/animes/animes.facade';

import { getFullAnime } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

const ADMIN_VIEW_OPTIONS: AnimeView[] = ['finished', 'sagas', 'countries'];

@Component({
  selector: 'app-admin-animes',
  imports: [
    CommonModule,
    FormsModule,
    AnimeComponent,
    AdminAnimesHeaderComponent,
  ],
  templateUrl: './animes.component.html',
  styleUrls: ['./animes.component.scss'],
})
export class AdminAnimesComponent implements OnInit {
  searchTerm = signal<string>('');
  selectedView = signal<AnimeView>('finished');

  visibleViewOptions = computed(() => {
    const options = animeViewOptions.filter((opt) =>
      ADMIN_VIEW_OPTIONS.includes(opt.value)
    );
    return options.map((opt, i) =>
      i === 0 ? { ...opt, label: 'Voir tout' } : opt
    );
  });

  adminAnimesList = signal<Anime[]>([]);
  baseAnimesList = signal<Anime[]>([]);
  collapsedCountries = signal<Record<string, boolean>>({});
  collapsedSagas = signal<Record<string, boolean>>({});

  allAnimes = computed<Anime[]>(() => this.adminAnimesList());

  filteredAnimes = computed<Anime[]>(() => {
    let animes = this.allAnimes();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return animes;
    return animes.filter((anime) => this.matchesSearch(anime, term));
  });

  sortedAnimes = computed<Anime[]>(() =>
    getSortedAnimes([...this.filteredAnimes()], 'title')
  );

  animesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getAnimesByCountry({
      sortedAnimes: this.sortedAnimes(),
      allAnimes: this.allAnimes(),
      baseAnimes: this.baseAnimesList(),
      selectedSort: 'country-count',
    });
  });

  animesBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getAnimesBySaga({
      sortedAnimes: this.sortedAnimes(),
      allAnimes: this.allAnimes(),
      baseAnimes: this.baseAnimesList(),
      selectedSort: 'saga-count',
    });
  });

  ngOnInit() {
    void this.refreshAnimes();
  }

  async refreshAnimes() {
    const baseAnimes = await getAllBaseAnimes();
    const animes = baseAnimes.map(getFullAnime);
    this.adminAnimesList.set(animes);
    this.baseAnimesList.set(animes);
  }

  onViewChange(view: AnimeView) {
    this.selectedView.set(view);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  toggleSaga(saga: string): void {
    this.collapsedSagas.update((prev) => ({
      ...prev,
      [saga]: !prev[saga],
    }));
  }

  isSagaCollapsed(saga: string): boolean {
    return !!this.collapsedSagas()[saga];
  }

  toggleCountry(country: string): void {
    this.collapsedCountries.update((prev) => ({
      ...prev,
      [country]: !prev[country],
    }));
  }

  isCountryCollapsed(country: string): boolean {
    return !!this.collapsedCountries()[country];
  }

  private matchesSearch(anime: Anime, term: string): boolean {
    const actors = anime.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [
      anime.title,
      anime.director,
      actors,
      normalizeAnimeGenres(anime.genre).join(' '),
      anime.saga,
    ]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }
}
