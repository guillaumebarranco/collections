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
  BaseMovie,
  Movie,
  MovieGenre,
  MOVIE_GENRE_OPTIONS,
  filterToMovieGenres,
  getMovieCountryOriginLabels,
  normalizeMovieCountryOriginsForForm,
} from '../../../models/movie-model';
import { getMoviesByUser } from '../../../facades/movies/movies.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/entity/edit-entity-header/edit-entity-header.component';
import {
  Country,
  MOVIE_COUNTRY_MULTI_SELECT_OPTIONS,
} from '../../../models/countries.enum';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/modals/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { ExtraDatesListComponent } from '../../../components/shared/extra-dates-list/extra-dates-list.component';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../../facades/games/games.facade';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';
import { getAllBaseSeries } from '../../../facades/series/series.facade';
import { BaseBook } from '../../../models/book-model';
import { BaseBd } from '../../../models/bd-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseGame } from '../../../models/game-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseSerie } from '../../../models/serie-model';
import {
  SearchableSelectboxComponent,
  SearchableSelectOption,
} from '../../../components/shared/searchable-selectbox/searchable-selectbox.component';

type EditMovieForm = {
  rating: number;
  timesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  otherSeenDates: string[];
  seenAtCinema: boolean;
  owned: boolean;
  borrowed: string;
  loaned: string;
  wantToSeeAgain: boolean;
  watchPriority: number;
  ratingComment: string;
  inList: string[];
};

type EditMovieEntityForm = {
  actors: string;
  coverUrl: string;
  releaseDate: string;
  length: number;
  genre: MovieGenre[];
  saga: string;
  description: string;
  countryOrigin: Exclude<Country, ''>[];
  fromEntity: BaseMovie['fromEntity'];
};

type EditMovieDialogData = {
  movie: Movie;
  userId?: string;
  list?: Movie[];
  index?: number;
};

export type MovieFromEntityType = NonNullable<
  BaseMovie['fromEntity']
>['entityType'];

@Component({
  selector: 'app-edit-movie',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    SearchableSelectboxComponent,
    ExtraDatesListComponent,
  ],
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
})
export class EditMovieComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditMovieComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditMovieDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly movie = signal<Movie | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly movieForm = signal<EditMovieForm | null>(null);
  readonly movieEntityForm = signal<EditMovieEntityForm | null>(null);
  readonly movieNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Movie[]>([]);
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
  readonly baseSeries = signal<BaseSerie[]>([]);
  /** Type de source sélectionné (peut être renseigné sans œuvre encore choisie). */
  readonly fromEntitySourceType = signal<MovieFromEntityType | ''>('');

  readonly movieGenreOptions = MOVIE_GENRE_OPTIONS;

  readonly fromEntityTypeSelectOptions: {
    value: MovieFromEntityType | '';
    label: string;
  }[] = [
    { value: '', label: 'Aucune adaptation' },
    { value: 'book', label: 'Livre' },
    { value: 'bd', label: 'Bande dessinée' },
    { value: 'comic', label: 'Comic' },
    { value: 'manga', label: 'Manga' },
    { value: 'manwha', label: 'Manhwa' },
    { value: 'game', label: 'Jeu vidéo' },
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
    const form = this.movieEntityForm();
    const type = this.fromEntitySourceType();
    const fe = form?.fromEntity;
    if (!fe || fe.entityType !== type) return '';
    return `${fe.title}|${fe.secondEntityKey}`;
  });

  readonly movieSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.movie) {
      this.setupDialogNavigation(this.dialogData);
      void this.loadBaseFromEntitySourcesIfAdmin();
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadMovieFromSlug(params);
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
      series,
    ] = await Promise.all([
      getAllBaseBooks(),
      getAllBaseBds(),
      getAllBaseComics(),
      getAllBaseGames(),
      getAllBaseMangas(),
      getAllBaseManwhas(),
      getAllBaseSeries(),
    ]);
    this.baseBooks.set(books);
    this.baseBds.set(bds);
    this.baseComics.set(comics);
    this.baseGames.set(games);
    this.baseMangas.set(mangas);
    this.baseManwhas.set(manwhas);
    this.baseSeries.set(series);
  }

  getFromEntityTypeDisplayLabel(
    type: MovieFromEntityType | undefined
  ): string {
    if (!type) return '';
    const opt = this.fromEntityTypeSelectOptions.find((o) => o.value === type);
    return opt?.label ?? String(type);
  }

  private syncFromEntitySourceTypeFromForm(): void {
    const fe = this.movieEntityForm()?.fromEntity;
    this.fromEntitySourceType.set((fe?.entityType ?? '') as MovieFromEntityType | '');
  }

  updateOtherSeenDates(dates: string[]): void {
    const current = this.movieForm();
    if (!current) {
      return;
    }
    this.movieForm.set({
      ...current,
      otherSeenDates: dates,
    });
  }

  updateField<K extends keyof EditMovieForm>(field: K, value: string | number) {
    const current = this.movieForm();
    if (!current) return;

    let nextValue: EditMovieForm[K] = value as EditMovieForm[K];
    if (
      field === 'rating' ||
      field === 'timesWatched' ||
      field === 'watchPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMovieForm[K];
    }

    this.movieForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(
    field: 'seenAtCinema' | 'owned' | 'wantToSeeAgain',
    checked: boolean
  ) {
    const current = this.movieForm();
    if (!current) return;
    this.movieForm.set({
      ...current,
      [field]: checked,
    });
  }

  setEntityGenres(genres: MovieGenre[]) {
    const current = this.movieEntityForm();
    if (!current) return;
    this.movieEntityForm.set({ ...current, genre: genres });
  }

  setEntityCountries(countries: Exclude<Country, ''>[]) {
    const current = this.movieEntityForm();
    if (!current) return;
    this.movieEntityForm.set({ ...current, countryOrigin: countries });
  }

  readonly movieCountryOptions = MOVIE_COUNTRY_MULTI_SELECT_OPTIONS;

  countriesDisplay(movie: Movie | null | undefined): string {
    return movie ? getMovieCountryOriginLabels(movie).join(', ') : '';
  }

  updateEntityField<K extends keyof EditMovieEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.movieEntityForm();
    if (!current) return;
    let nextValue: EditMovieEntityForm[K] = value as EditMovieEntityForm[K];
    if (field === 'length') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditMovieEntityForm[K];
    }
    this.movieEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  setRatingFromClick(star: number, event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const width = target.clientWidth;
    const x = event.offsetX;
    const ratio = x / width;
    const offset = ratio < 0.25 ? 0.75 : ratio < 0.5 ? 0.5 : ratio < 0.75 ? 0.25 : 0;
    const nextValue = Math.round((star - offset) * 4) / 4;
    this.updateField('rating', Math.max(0, Math.min(5, nextValue)));
  }

  getStarType(rating: number, star: number): 'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.25) return 'threeQuarter';
    if (rating >= star - 0.5) return 'half';
    if (rating >= star - 0.75) return 'quarter';
    return 'empty';
  }

  async onSubmit(navigateAfterSave = false) {
    if (this.isAdminView()) {
      await this.onAdminSubmit();
      return;
    }
    const form = this.movieForm();
    const movie = this.movie();
    if (!form || !movie) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          director: movie.director,
          rating: form.rating,
          timesWatched: form.timesWatched,
          firstViewedDate: form.firstViewedDate,
          lastViewedDate: form.lastViewedDate,
          otherSeenDates: normalizeActivityExtraDates(form.otherSeenDates),
          seenAtCinema: form.seenAtCinema,
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          wantToSeeAgain: form.wantToSeeAgain,
          watchPriority: form.watchPriority,
          ratingComment: form.ratingComment ?? '',
          inList: form.inList ?? [],
          entity: this.isAdminView()
            ? this.toEntityPayload(this.movieEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-movie:error', payload);
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
      console.error('edit-movie:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const movie = this.movie();
    if (!movie) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce film de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/movies/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          director: movie.director,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-movie:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToMovies();
    } catch (error) {
      console.error('edit-movie:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const movie = this.movie();
    const entityForm = this.movieEntityForm();
    if (!movie || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        'Merci de modifier soit le titre, soit le réalisateur, pas les deux en même temps.'
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/movies`, {
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
        console.error('edit-movie:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-movie:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const movie = this.movie();
    if (!movie) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: movie.title,
        entityType: EntityType.MOVIE,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToMovies() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'movies']);
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

  getActorsLabel(actors: Movie['actors'] | undefined): string {
    if (!actors?.length) return '';
    return actors.map((actor) => actor.name).join(', ');
  }

  private async loadMovieFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const movies = await getMoviesByUser(userId);
    const matched = movies.find((movie) => {
      return this.toSlug(`${movie.title} ${movie.director}`) === slug;
    });

    if (!matched) {
      this.movie.set(null);
      this.movieForm.set(null);
      this.movieEntityForm.set(null);
      this.fromEntitySourceType.set('');
      this.movieNotFound.set(true);
      return;
    }

    this.movie.set(matched);
    this.movieForm.set(this.toForm(matched));
    this.movieEntityForm.set(this.toEntityForm(matched));
    this.syncFromEntitySourceTypeFromForm();
    this.movieNotFound.set(false);
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

  private toForm(movie: Movie): EditMovieForm {
    return {
      rating: movie.rating,
      timesWatched: movie.timesWatched,
      firstViewedDate: movie.firstViewedDate,
      lastViewedDate: movie.lastViewedDate,
      otherSeenDates: [...(movie.otherSeenDates ?? [])],
      seenAtCinema: movie.seenAtCinema,
      owned: movie.owned,
      borrowed: movie.borrowed ?? '',
      loaned: movie.loaned ?? '',
      wantToSeeAgain: movie.wantToSeeAgain ?? false,
      watchPriority: movie.watchPriority ?? 0,
      ratingComment: movie.ratingComment ?? '',
      inList: movie.inList ?? [],
    };
  }

  private toEntityForm(movie: Movie): EditMovieEntityForm {
    return {
      actors: (movie.actors || []).map((actor) => actor.name).join(', '),
      coverUrl: movie.coverUrl,
      releaseDate: movie.releaseDate,
      length: movie.length,
      genre: this.normalizeMovieGenresForForm(movie.genre),
      saga: movie.saga || '',
      description: movie.description ?? '',
      countryOrigin: normalizeMovieCountryOriginsForForm(movie.countryOrigin),
      fromEntity: movie.fromEntity ?? null,
    };
  }

  private normalizeMovieGenresForForm(raw: unknown): MovieGenre[] {
    if (Array.isArray(raw)) {
      return filterToMovieGenres(raw as string[]);
    }
    if (typeof raw === 'string' && raw.trim()) {
      return filterToMovieGenres(
        raw.split(',').map((g) => g.trim()).filter(Boolean)
      );
    }
    return [];
  }

  private toEntityPayload(form: EditMovieEntityForm | null) {
    if (!form) return undefined;
    return {
      actors: form.actors
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      length: form.length,
      genre: form.genre,
      saga: form.saga,
      description: form.description ?? '',
      countryOrigin: form.countryOrigin ?? [],
      fromEntity: form.fromEntity,
    };
  }

  onFromEntityTypeSelect(value: string) {
    const current = this.movieEntityForm();
    if (!current) return;
    const t = (value ?? '') as MovieFromEntityType | '';
    this.fromEntitySourceType.set(t);
    if (!t) {
      this.movieEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    if (current.fromEntity?.entityType === t) {
      return;
    }
    this.movieEntityForm.set({ ...current, fromEntity: null });
  }

  onFromEntityWorkSelect(value: string) {
    const current = this.movieEntityForm();
    if (!current) return;
    const type = this.fromEntitySourceType();
    if (!type) {
      return;
    }
    if (!value?.trim()) {
      this.movieEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    const pipe = value.indexOf('|');
    if (pipe < 0) return;
    const title = value.slice(0, pipe).trim();
    const secondEntityKey = value.slice(pipe + 1).trim();
    if (!title) return;
    this.movieEntityForm.set({
      ...current,
      fromEntity: {
        entityType: type,
        title,
        secondEntityKey,
      },
    });
  }

  private canEditCurrentUser(): boolean {
    return (
      this.isAdminView() || this.authService.canEdit(this.getCurrentUserId())
    );
  }

  private getAdminUserId(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private setupDialogNavigation(data: EditMovieDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.movie];
    const index = this.resolveDialogIndex(list, data.index, data.movie);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setMovie(list[index] ?? data.movie);
  }

  private resolveDialogIndex(
    list: Movie[],
    index: number | undefined,
    movie: Movie
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === movie.title && item.director === movie.director
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setMovie(list[nextIndex]);
  }

  private setMovie(movie: Movie): void {
    this.movie.set(movie);
    this.movieForm.set(this.toForm(movie));
    this.movieEntityForm.set(this.toEntityForm(movie));
    this.adminTitle.set(movie.title);
    this.adminSecondary.set(movie.director);
    this.originalTitle.set(movie.title);
    this.originalSecondary.set(movie.director);
    this.movieNotFound.set(false);
    this.syncFromEntitySourceTypeFromForm();
  }

  private toSlug(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  }
}
