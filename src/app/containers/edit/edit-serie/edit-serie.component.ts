import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import {
  BaseSerie,
  BaseSerieSeasonData,
  normalizeSerieGenres,
  Serie,
  UserSerieSeason,
} from '../../../models/serie-model';
import type {
  SerieFromEntityAdaptation,
  SerieFromEntityType,
} from '../../../models/from-entity.model';
import {
  getAllBaseSeries,
  getSeriesByUser,
} from '../../../facades/series/series.facade';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../../facades/games/games.facade';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';
import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { BaseBook } from '../../../models/book-model';
import { BaseBd } from '../../../models/bd-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseGame } from '../../../models/game-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseMovie } from '../../../models/movie-model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/entity/edit-entity-header/edit-entity-header.component';
import { CountrySelectComponent } from '../../../components/shared/country-select/country-select.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/modals/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  SearchableSelectboxComponent,
  SearchableSelectOption,
} from '../../../components/shared/searchable-selectbox/searchable-selectbox.component';

type EditSerieForm = {
  seasons: UserSerieSeason[];
  owned: boolean;
  borrowed: string;
  loaned: string;
  watchPriority: number;
  wantToWatchAgain: boolean;
  ratingComment: string;
};

type EditSerieEntityForm = {
  actors: string;
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string;
  seasonsData: BaseSerieSeasonData[];
  description: string;
  countryOrigin: string;
  saga: string;
  fromEntity: SerieFromEntityAdaptation | null;
};

type EditSerieDialogData = {
  serie: Serie;
  userId?: string;
  list?: Serie[];
  index?: number;
};

@Component({
  selector: 'app-edit-serie',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
    CountrySelectComponent,
    MatFormFieldModule,
    MatSelectModule,
    SearchableSelectboxComponent,
  ],
  templateUrl: './edit-serie.component.html',
  styleUrls: ['./edit-serie.component.scss'],
})
export class EditSerieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditSerieComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditSerieDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly serie = signal<Serie | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly serieForm = signal<EditSerieForm | null>(null);
  readonly serieEntityForm = signal<EditSerieEntityForm | null>(null);
  readonly serieNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());
  readonly isAdminView = computed(
    () => this.authService.isAdmin() && this.router.url.startsWith('/admin')
  );
  readonly isTitleModified = computed(
    () => this.adminTitle().trim() !== this.originalTitle().trim()
  );
  readonly isSecondaryModified = computed(
    () => this.adminSecondary().trim() !== this.originalSecondary().trim()
  );
  readonly disableTitleEdit = computed(() => this.isSecondaryModified());
  readonly disableSecondaryEdit = computed(() => this.isTitleModified());
  readonly hasDialogUpdates = signal<boolean>(false);
  readonly dialogList = signal<Serie[]>([]);
  readonly dialogIndex = signal<number>(-1);
  readonly hasDialogNavigation = computed(() => {
    return (
      this.isDialogMode() &&
      this.dialogList().length > 1 &&
      this.dialogIndex() >= 0
    );
  });
  readonly canNavigatePrevious = computed(() => {
    return this.hasDialogNavigation() && this.dialogIndex() > 0;
  });
  readonly canNavigateNext = computed(() => {
    return (
      this.hasDialogNavigation() &&
      this.dialogIndex() < this.dialogList().length - 1
    );
  });
  readonly dialogPositionLabel = computed(() => {
    if (!this.hasDialogNavigation()) return '';
    return `${this.dialogIndex() + 1}/${this.dialogList().length}`;
  });

  readonly baseBooks = signal<BaseBook[]>([]);
  readonly baseBds = signal<BaseBd[]>([]);
  readonly baseComics = signal<BaseComic[]>([]);
  readonly baseGames = signal<BaseGame[]>([]);
  readonly baseMangas = signal<BaseManga[]>([]);
  readonly baseManwhas = signal<BaseManwha[]>([]);
  readonly baseMovies = signal<BaseMovie[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);
  readonly fromEntitySourceType = signal<SerieFromEntityType | ''>('');

  readonly fromEntityTypeSelectOptions: {
    value: SerieFromEntityType | '';
    label: string;
  }[] = [
    { value: '', label: 'Aucune adaptation' },
    { value: 'book', label: 'Livre' },
    { value: 'bd', label: 'Bande dessinée' },
    { value: 'comic', label: 'Comic' },
    { value: 'manga', label: 'Manga' },
    { value: 'manwha', label: 'Manhwa' },
    { value: 'game', label: 'Jeu vidéo' },
    { value: 'movie', label: 'Film' },
    { value: 'serie', label: 'Série' },
  ];

  readonly fromEntityWorkOptions = computed<SearchableSelectOption[]>(() => {
    const type = this.fromEntitySourceType();
    if (!type) return [];
    const sortByTitle = <T extends { title: string }>(a: T, b: T) =>
      a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
    switch (type) {
      case 'book':
        return [...this.baseBooks()]
          .sort(sortByTitle)
          .map((b) => ({
            value: `${b.title}|${b.author}`,
            label: `${b.title} — ${b.author}`,
          }));
      case 'bd':
        return [...this.baseBds()]
          .sort(sortByTitle)
          .map((b) => ({
            value: `${b.title}|${b.writer}`,
            label: `${b.title} — ${b.writer}`,
          }));
      case 'comic':
        return [...this.baseComics()]
          .sort(sortByTitle)
          .map((c) => ({
            value: `${c.title}|${c.writer}`,
            label: `${c.title} — ${c.writer}`,
          }));
      case 'manga':
        return [...this.baseMangas()]
          .sort(sortByTitle)
          .map((m) => ({
            value: `${m.title}|${m.author}`,
            label: `${m.title} — ${m.author}`,
          }));
      case 'manwha':
        return [...this.baseManwhas()]
          .sort(sortByTitle)
          .map((m) => ({
            value: `${m.title}|${m.author}`,
            label: `${m.title} — ${m.author}`,
          }));
      case 'game':
        return [...this.baseGames()]
          .sort(sortByTitle)
          .map((g) => ({
            value: `${g.title}|${g.editor}`,
            label: `${g.title} — ${g.editor}`,
          }));
      case 'movie':
        return [...this.baseMovies()]
          .sort(sortByTitle)
          .map((m) => ({
            value: `${m.title}|${m.director}`,
            label: `${m.title} — ${m.director}`,
          }));
      case 'serie':
        return [...this.baseSeries()]
          .sort(sortByTitle)
          .map((s) => ({
            value: `${s.title}|${s.director}`,
            label: `${s.title} — ${s.director}`,
          }));
      default:
        return [];
    }
  });

  readonly fromEntityWorkSelectValue = computed(() => {
    const form = this.serieEntityForm();
    const type = this.fromEntitySourceType();
    const fe = form?.fromEntity;
    if (!fe || fe.entityType !== type) return '';
    return `${fe.title}|${fe.secondEntityKey}`;
  });

  readonly serieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.serie) {
      this.setupDialogNavigation(this.dialogData);
      void this.loadBaseFromEntitySourcesIfAdmin();
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadSerieFromSlug(params);
    });
    void this.loadBaseFromEntitySourcesIfAdmin();
  }

  private async loadBaseFromEntitySourcesIfAdmin() {
    if (!this.isAdminView()) return;
    const [
      books,
      bds,
      comics,
      games,
      mangas,
      manwhas,
      movies,
      series,
    ] = await Promise.all([
      getAllBaseBooks(),
      getAllBaseBds(),
      getAllBaseComics(),
      getAllBaseGames(),
      getAllBaseMangas(),
      getAllBaseManwhas(),
      getAllBaseMovies(),
      getAllBaseSeries(),
    ]);
    this.baseBooks.set(books);
    this.baseBds.set(bds);
    this.baseComics.set(comics);
    this.baseGames.set(games);
    this.baseMangas.set(mangas);
    this.baseManwhas.set(manwhas);
    this.baseMovies.set(movies);
    this.baseSeries.set(series);
  }

  getFromEntityTypeDisplayLabel(type: SerieFromEntityType | undefined): string {
    if (!type) return '';
    const opt = this.fromEntityTypeSelectOptions.find((o) => o.value === type);
    return opt?.label ?? String(type);
  }

  private syncFromEntitySourceTypeFromForm(): void {
    const fe = this.serieEntityForm()?.fromEntity;
    this.fromEntitySourceType.set((fe?.entityType ?? '') as SerieFromEntityType | '');
  }

  onFromEntityTypeSelect(value: string) {
    const current = this.serieEntityForm();
    if (!current) return;
    const t = (value ?? '') as SerieFromEntityType | '';
    this.fromEntitySourceType.set(t);
    if (!t) {
      this.serieEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    if (current.fromEntity?.entityType === t) {
      return;
    }
    this.serieEntityForm.set({ ...current, fromEntity: null });
  }

  onFromEntityWorkSelect(value: string) {
    const current = this.serieEntityForm();
    if (!current) return;
    const type = this.fromEntitySourceType();
    if (!type) {
      return;
    }
    if (!value?.trim()) {
      this.serieEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    const pipe = value.indexOf('|');
    if (pipe < 0) return;
    const title = value.slice(0, pipe).trim();
    const secondEntityKey = value.slice(pipe + 1).trim();
    if (!title) return;
    this.serieEntityForm.set({
      ...current,
      fromEntity: {
        entityType: type,
        title,
        secondEntityKey,
      },
    });
  }

  async onSubmit(navigateAfterSave = false) {
    if (this.isAdminView()) {
      await this.onAdminSubmit();
      return;
    }
    const form = this.serieForm();
    const serie = this.serie();
    if (!form || !serie) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: serie.title,
          director: serie.director,
          seasons: form.seasons,
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          watchPriority: form.watchPriority,
          wantToWatchAgain: form.wantToWatchAgain,
          ratingComment: form.ratingComment ?? '',
          entity: this.isAdminView()
            ? this.toEntityPayload(this.serieEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie:error', payload);
        return;
      }

      if (this.dialogRef) {
        if (navigateAfterSave && this.canNavigateNext()) {
          this.hasDialogUpdates.set(true);
          this.navigateNext();
          return;
        }
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-serie:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const serie = this.serie();
    if (!serie) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer cette série de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/series/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: serie.title,
          director: serie.director,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToSeries();
    } catch (error) {
      console.error('edit-serie:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const serie = this.serie();
    const entityForm = this.serieEntityForm();
    if (!serie || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        'Merci de modifier soit le titre, soit le réalisateur, pas les deux en même temps.'
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getAdminUserId(),
          title: this.adminTitle().trim(),
          director: this.adminSecondary().trim(),
          entityOnly: true,
          originalTitle: this.originalTitle(),
          originalDirector: this.originalSecondary(),
          entity: this.toEntityPayload(entityForm),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-serie:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-serie:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const serie = this.serie();
    if (!serie) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: serie.title,
        entityType: EntityType.SERIE,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToSeries() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'series']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  navigatePrevious(): void {
    this.navigateToOffset(-1);
  }

  navigateNext(): void {
    this.navigateToOffset(1);
  }

  getActorsLabel(actors: Serie['actors'] | undefined): string {
    if (!actors?.length) return '';
    return actors.map((actor) => actor.name).join(', ');
  }

  private async loadSerieFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const series = await getSeriesByUser(userId);
    const matched = series.find((serie) => {
      return this.toSlug(`${serie.title} ${serie.director}`) === slug;
    });

    if (!matched) {
      this.serie.set(null);
      this.serieForm.set(null);
      this.serieEntityForm.set(null);
      this.fromEntitySourceType.set('');
      this.serieNotFound.set(true);
      return;
    }

    this.serie.set(matched);
    this.serieForm.set(this.toForm(matched));
    this.serieEntityForm.set(this.toEntityForm(matched));
    this.syncFromEntitySourceTypeFromForm();
    this.serieNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private getQuizzCreator(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private toForm(serie: Serie): EditSerieForm {
    return {
      seasons: this.buildSeasons(serie),
      owned: serie.owned,
      borrowed: serie.borrowed ?? '',
      loaned: serie.loaned ?? '',
      watchPriority: serie.watchPriority ?? 0,
      wantToWatchAgain: serie.wantToWatchAgain ?? false,
      ratingComment: serie.ratingComment ?? '',
    };
  }

  private toEntityForm(serie: Serie): EditSerieEntityForm {
    return {
      actors: (serie.actors || []).map((actor) => actor.name).join(', '),
      coverUrl: serie.coverUrl,
      releaseDate: serie.releaseDate,
      endDate: serie.endDate,
      genre: normalizeSerieGenres(serie.genre).join(', '),
      seasonsData: serie.seasonsData || [],
      description: serie.description ?? '',
      countryOrigin: serie.countryOrigin ?? '',
      saga: serie.saga ?? '',
      fromEntity: serie.fromEntity ?? null,
    };
  }

  private toEntityPayload(form: EditSerieEntityForm | null) {
    if (!form) return undefined;
    return {
      actors: form.actors
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      endDate: form.endDate,
      genre: normalizeSerieGenres(form.genre),
      seasonsData: form.seasonsData,
      description: form.description ?? '',
      countryOrigin: form.countryOrigin ?? '',
      saga: form.saga ?? '',
      fromEntity: form.fromEntity,
    };
  }

  updateCheckbox(field: 'owned' | 'wantToWatchAgain', checked: boolean) {
    const current = this.serieForm();
    if (!current) return;
    this.serieForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateField<K extends keyof EditSerieForm>(field: K, value: number | string) {
    const current = this.serieForm();
    if (!current) return;
    let nextValue: EditSerieForm[K] = value as EditSerieForm[K];
    if (field === 'watchPriority') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditSerieForm[K];
    }
    if (field === 'ratingComment') {
      nextValue = (typeof value === 'string' ? value : '') as EditSerieForm[K];
    }
    this.serieForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityField<K extends keyof EditSerieEntityForm>(
    field: K,
    value: string
  ) {
    const current = this.serieEntityForm();
    if (!current) return;
    this.serieEntityForm.set({
      ...current,
      [field]: value,
    });
  }

  updateSeasonDataField(
    seasonNumber: number,
    field: 'nbEpisodes' | 'totalLength',
    value: string | number
  ) {
    const current = this.serieEntityForm();
    if (!current) return;
    const nextValue = Number(value);
    const normalizedValue = Number.isNaN(nextValue) ? 0 : nextValue;
    const nextSeasons = current.seasonsData.map((season) =>
      season.seasonNumber === seasonNumber
        ? {
            ...season,
            [field]: normalizedValue,
          }
        : season
    );
    this.serieEntityForm.set({
      ...current,
      seasonsData: nextSeasons,
    });
  }

  updateSeasonField(
    seasonNumber: number,
    field: 'seasonRating' | 'seasonTimesWatched' | 'lastViewedDate',
    value: string | number
  ) {
    const current = this.serieForm();
    if (!current) return;

    const nextSeasons = current.seasons.map((season) =>
      season.seasonNumber === seasonNumber
        ? {
            ...season,
            [field]:
              field === 'lastViewedDate'
                ? String(value)
                : Number.isNaN(Number(value))
                ? 0
                : Number(value),
          }
        : season
    );

    this.serieForm.set({
      ...current,
      seasons: nextSeasons,
    });
  }

  setRatingFromClick(seasonNumber: number, star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const width = target.clientWidth;
    const x = event.offsetX;
    const ratio = x / width;
    const offset = ratio < 0.25 ? 0.75 : ratio < 0.5 ? 0.5 : ratio < 0.75 ? 0.25 : 0;
    const nextValue = Math.round((star - offset) * 4) / 4;
    this.updateSeasonField(
      seasonNumber,
      'seasonRating',
      Math.max(0, Math.min(5, nextValue))
    );
  }

  getStarType(rating: number, star: number): 'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.25) return 'threeQuarter';
    if (rating >= star - 0.5) return 'half';
    if (rating >= star - 0.75) return 'quarter';
    return 'empty';
  }

  private buildSeasons(serie: Serie): UserSerieSeason[] {
    if (serie.seasons && serie.seasons.length > 0) {
      return serie.seasons.map((season) => ({
        ...season,
        lastViewedDate: season.lastViewedDate || '',
      }));
    }
    const total = serie.seasonsData?.length ?? 0;
    return Array.from({ length: total }, (_, index) => ({
      seasonNumber: index + 1,
      seasonRating: 0,
      seasonTimesWatched: 0,
      lastViewedDate: '',
    }));
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }

  private canEditCurrentUser(): boolean {
    return (
      this.isAdminView() || this.authService.canEdit(this.getCurrentUserId())
    );
  }

  private getAdminUserId(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private setupDialogNavigation(data: EditSerieDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.serie];
    const index = this.resolveDialogIndex(list, data.index, data.serie);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setSerie(list[index] ?? data.serie);
  }

  private resolveDialogIndex(
    list: Serie[],
    index: number | undefined,
    serie: Serie
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === serie.title && item.director === serie.director
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setSerie(list[nextIndex]);
  }

  private setSerie(serie: Serie): void {
    this.serie.set(serie);
    this.serieForm.set(this.toForm(serie));
    this.serieEntityForm.set(this.toEntityForm(serie));
    this.adminTitle.set(serie.title);
    this.adminSecondary.set(serie.director);
    this.originalTitle.set(serie.title);
    this.originalSecondary.set(serie.director);
    this.serieNotFound.set(false);
    this.syncFromEntitySourceTypeFromForm();
  }
}
