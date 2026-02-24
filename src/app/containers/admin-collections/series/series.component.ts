import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SerieComponent } from '../../../components/collections/serie/serie.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { AdminSeriesHeaderComponent } from './series-header/series-header.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Serie } from '../../../models/serie-model';
import {
  SerieView,
  getSeriesByCountry,
  getSeriesBySaga,
  getSortedSeries,
  serieViewOptions,
} from '../../collections/series/series.utils';
import { getAllBaseSeries } from '../../../facades/series/series.facade';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { getFullSerie } from '../../../helpers/full-entities-helper';
import { Quizz } from '../../../models/quizz-model';

const ADMIN_VIEW_OPTIONS: SerieView[] = ['finished', 'sagas', 'countries'];

@Component({
  selector: 'app-admin-series',
  imports: [
    CommonModule,
    FormsModule,
    SerieComponent,
    MenuComponent,
    QuizzModalComponent,
    AdminSeriesHeaderComponent,
  ],
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
})
export class AdminSeriesComponent implements OnInit {
  searchTerm = signal<string>('');
  selectedView = signal<SerieView>('finished');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);

  visibleViewOptions = computed(() => {
    const options = serieViewOptions.filter((opt) =>
      ADMIN_VIEW_OPTIONS.includes(opt.value)
    );
    return options.map((opt, i) =>
      i === 0 ? { ...opt, label: 'Voir tout' } : opt
    );
  });

  adminSeriesList = signal<Serie[]>([]);
  baseSeriesList = signal<Serie[]>([]);
  collapsedCountries = signal<Record<string, boolean>>({});
  collapsedSagas = signal<Record<string, boolean>>({});

  allSeries = computed<Serie[]>(() => this.adminSeriesList());

  filteredSeries = computed<Serie[]>(() => {
    let series = this.allSeries();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return series;
    return series.filter((serie) => this.matchesSearch(serie, term));
  });

  sortedSeries = computed<Serie[]>(() =>
    getSortedSeries([...this.filteredSeries()], 'title')
  );

  seriesByCountry = computed(() => {
    if (this.selectedView() !== 'countries') return [];
    return getSeriesByCountry({
      sortedSeries: this.sortedSeries(),
      allSeries: this.allSeries(),
      baseSeries: this.baseSeriesList(),
      selectedSort: 'country-count',
    });
  });

  seriesBySaga = computed(() => {
    if (this.selectedView() !== 'sagas') return [];
    return getSeriesBySaga({
      sortedSeries: this.sortedSeries(),
      allSeries: this.allSeries(),
      baseSeries: this.baseSeriesList(),
      selectedSort: 'saga-count',
    });
  });

  ngOnInit() {
    void this.refreshQuizzs();
    void this.refreshSeries();
  }

  async refreshSeries() {
    const baseSeries = await getAllBaseSeries();
    const series = baseSeries.map(getFullSerie);
    this.adminSeriesList.set(series);
    this.baseSeriesList.set(series);
  }

  private async refreshQuizzs() {
    const quizzs = await getAllQuizzs();
    this.quizzs.set(quizzs);
  }

  onViewChange(view: SerieView) {
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

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs || quizzs.length === 0) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  private matchesSearch(serie: Serie, term: string): boolean {
    const actors = serie.actors?.map((actor) => actor.name).join(' ') || '';
    const haystack = [serie.title, serie.director, actors, serie.genre, serie.saga]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
