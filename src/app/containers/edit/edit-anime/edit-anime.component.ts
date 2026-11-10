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
  BaseAnime,
  BaseAnimeSeasonData,
  normalizeAnimeGenres,
  Anime,
  UserAnimeSeason,
} from '../../../models/anime-model';
import type {
  AnimeFromEntityAdaptation,
  AnimeFromEntityType,
} from '../../../models/from-entity.model';
import {
  getAllBaseAnimes,
  getAnimesByUser,
} from '../../../facades/animes/animes.facade';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getAllBaseGames } from '../../../facades/games/games.facade';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';
import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { getAllBaseSeries } from '../../../facades/series/series.facade';
import { BaseBook } from '../../../models/book-model';
import { BaseBd } from '../../../models/bd-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseGame } from '../../../models/game-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseMovie } from '../../../models/movie-model';
import { BaseSerie } from '../../../models/serie-model';
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
import { ExtraDatesListComponent } from '../../../components/shared/extra-dates-list/extra-dates-list.component';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  SearchableSelectboxComponent,
  SearchableSelectOption,
} from '../../../components/shared/searchable-selectbox/searchable-selectbox.component';

type EditAnimeForm = {
  seasons: UserAnimeSeason[];
  owned: boolean;
  borrowed: string;
  loaned: string;
  watchPriority: number;
  wantToWatchAgain: boolean;
  ratingComment: string;
  quotes: string[];
};

type EditAnimeEntityForm = {
  actors: string;
  coverUrl: string;
  releaseDate: string;
  endDate: string;
  genre: string;
  seasonsData: BaseAnimeSeasonData[];
  description: string;
  countryOrigin: string;
  saga: string;
  fromEntity: AnimeFromEntityAdaptation | null;
};

type EditAnimeDialogData = {
  anime: Anime;
  userId?: string;
  list?: Anime[];
  index?: number;
};

@Component({
  selector: 'app-edit-anime',
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
    ExtraDatesListComponent,
  ],
  templateUrl: './edit-anime.component.html',
  styleUrls: ['./edit-anime.component.scss'],
})
export class EditAnimeComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditAnimeComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditAnimeDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly anime = signal<Anime | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly animeForm = signal<EditAnimeForm | null>(null);
  readonly animeEntityForm = signal<EditAnimeEntityForm | null>(null);
  readonly animeNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Anime[]>([]);
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
  readonly baseAnimes = signal<BaseAnime[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);
  readonly fromEntitySourceType = signal<AnimeFromEntityType | ''>('');

  readonly fromEntityTypeSelectOptions: {
    value: AnimeFromEntityType | '';
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
    { value: 'anime', label: 'Animé' },
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
      case 'anime':
        return [...this.baseAnimes()]
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
    const form = this.animeEntityForm();
    const type = this.fromEntitySourceType();
    const fe = form?.fromEntity;
    if (!fe || fe.entityType !== type) return '';
    return `${fe.title}|${fe.secondEntityKey}`;
  });

  readonly animeSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.anime) {
      this.setupDialogNavigation(this.dialogData);
      void this.loadBaseFromEntitySourcesIfAdmin();
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadAnimeFromSlug(params);
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
      animes,
      series,
    ] = await Promise.all([
      getAllBaseBooks(),
      getAllBaseBds(),
      getAllBaseComics(),
      getAllBaseGames(),
      getAllBaseMangas(),
      getAllBaseManwhas(),
      getAllBaseMovies(),
      getAllBaseAnimes(),
      getAllBaseSeries(),
    ]);
    this.baseBooks.set(books);
    this.baseBds.set(bds);
    this.baseComics.set(comics);
    this.baseGames.set(games);
    this.baseMangas.set(mangas);
    this.baseManwhas.set(manwhas);
    this.baseMovies.set(movies);
    this.baseAnimes.set(animes);
    this.baseSeries.set(series);
  }

  getFromEntityTypeDisplayLabel(type: AnimeFromEntityType | undefined): string {
    if (!type) return '';
    const opt = this.fromEntityTypeSelectOptions.find((o) => o.value === type);
    return opt?.label ?? String(type);
  }

  private syncFromEntitySourceTypeFromForm(): void {
    const fe = this.animeEntityForm()?.fromEntity;
    this.fromEntitySourceType.set((fe?.entityType ?? '') as AnimeFromEntityType | '');
  }

  onFromEntityTypeSelect(value: string) {
    const current = this.animeEntityForm();
    if (!current) return;
    const t = (value ?? '') as AnimeFromEntityType | '';
    this.fromEntitySourceType.set(t);
    if (!t) {
      this.animeEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    if (current.fromEntity?.entityType === t) {
      return;
    }
    this.animeEntityForm.set({ ...current, fromEntity: null });
  }

  onFromEntityWorkSelect(value: string) {
    const current = this.animeEntityForm();
    if (!current) return;
    const type = this.fromEntitySourceType();
    if (!type) {
      return;
    }
    if (!value?.trim()) {
      this.animeEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    const pipe = value.indexOf('|');
    if (pipe < 0) return;
    const title = value.slice(0, pipe).trim();
    const secondEntityKey = value.slice(pipe + 1).trim();
    if (!title) return;
    this.animeEntityForm.set({
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
    const form = this.animeForm();
    const anime = this.anime();
    if (!form || !anime) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/animes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: anime.title,
          director: anime.director,
          seasons: form.seasons.map((season) => ({
            ...season,
            otherViewedDates: normalizeActivityExtraDates(
              season.otherViewedDates
            ),
          })),
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          watchPriority: Math.min(3, Math.max(1, form.watchPriority ?? 1)),
          wantToWatchAgain: form.wantToWatchAgain,
          ratingComment: form.ratingComment ?? '',
          quotes: form.quotes.map((quote) => quote.trim()).filter(Boolean),
          entity: this.isAdminView()
            ? this.toEntityPayload(this.animeEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-anime:error', payload);
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
      console.error('edit-anime:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const anime = this.anime();
    if (!anime) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer cet animé de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/animes/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: anime.title,
          director: anime.director,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-anime:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToAnimes();
    } catch (error) {
      console.error('edit-anime:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const anime = this.anime();
    const entityForm = this.animeEntityForm();
    if (!anime || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        'Merci de modifier soit le titre, soit le réalisateur, pas les deux en même temps.'
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/animes`, {
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
        console.error('edit-anime:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-anime:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const anime = this.anime();
    if (!anime) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: anime.title,
        entityType: EntityType.ANIME,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToAnimes() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'animes']);
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

  getActorsLabel(actors: Anime['actors'] | undefined): string {
    if (!actors?.length) return '';
    return actors.map((actor) => actor.name).join(', ');
  }

  private async loadAnimeFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const animes = await getAnimesByUser(userId);
    const matched = animes.find((anime) => {
      return this.toSlug(`${anime.title} ${anime.director}`) === slug;
    });

    if (!matched) {
      this.anime.set(null);
      this.animeForm.set(null);
      this.animeEntityForm.set(null);
      this.fromEntitySourceType.set('');
      this.animeNotFound.set(true);
      return;
    }

    this.anime.set(matched);
    this.animeForm.set(this.toForm(matched));
    this.animeEntityForm.set(this.toEntityForm(matched));
    this.syncFromEntitySourceTypeFromForm();
    this.animeNotFound.set(false);
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

  private toForm(anime: Anime): EditAnimeForm {
    return {
      seasons: this.buildSeasons(anime),
      owned: anime.owned,
      borrowed: anime.borrowed ?? '',
      loaned: anime.loaned ?? '',
      watchPriority: Math.min(3, Math.max(1, anime.watchPriority ?? 1)),
      wantToWatchAgain: anime.wantToWatchAgain ?? false,
      ratingComment: anime.ratingComment ?? '',
      quotes: [...(anime.quotes ?? [])].map((quote) =>
        quote.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n')
      ),
    };
  }

  private toEntityForm(anime: Anime): EditAnimeEntityForm {
    return {
      actors: (anime.actors || []).map((actor) => actor.name).join(', '),
      coverUrl: anime.coverUrl,
      releaseDate: anime.releaseDate,
      endDate: anime.endDate,
      genre: normalizeAnimeGenres(anime.genre).join(', '),
      seasonsData: anime.seasonsData || [],
      description: anime.description ?? '',
      countryOrigin: anime.countryOrigin ?? '',
      saga: anime.saga ?? '',
      fromEntity: anime.fromEntity ?? null,
    };
  }

  private toEntityPayload(form: EditAnimeEntityForm | null) {
    if (!form) return undefined;
    return {
      actors: form.actors
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean),
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      endDate: form.endDate,
      genre: normalizeAnimeGenres(form.genre),
      seasonsData: form.seasonsData,
      description: form.description ?? '',
      countryOrigin: form.countryOrigin ?? '',
      saga: form.saga ?? '',
      fromEntity: form.fromEntity,
    };
  }

  addQuote(): void {
    const form = this.animeForm();
    if (!form) {
      return;
    }
    this.animeForm.set({
      ...form,
      quotes: [...form.quotes, ''],
    });
  }

  updateQuote(index: number, value: string): void {
    const form = this.animeForm();
    if (!form || index < 0 || index >= form.quotes.length) {
      return;
    }
    const quotes = [...form.quotes];
    quotes[index] = value;
    this.animeForm.set({
      ...form,
      quotes,
    });
  }

  removeQuote(index: number): void {
    const form = this.animeForm();
    if (!form || index < 0 || index >= form.quotes.length) {
      return;
    }
    this.animeForm.set({
      ...form,
      quotes: form.quotes.filter((_, quoteIndex) => quoteIndex !== index),
    });
  }

  updateCheckbox(field: 'owned' | 'wantToWatchAgain', checked: boolean) {
    const current = this.animeForm();
    if (!current) return;
    this.animeForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateField<K extends keyof EditAnimeForm>(field: K, value: number | string) {
    const current = this.animeForm();
    if (!current) return;
    let nextValue: EditAnimeForm[K] = value as EditAnimeForm[K];
    if (field === 'watchPriority') {
      const asNumber = Number(value);
      const priority = Number.isNaN(asNumber) ? 1 : asNumber;
      nextValue = (priority < 1 ? 1 : priority > 3 ? 3 : priority) as EditAnimeForm[K];
    }
    if (field === 'ratingComment') {
      nextValue = (typeof value === 'string' ? value : '') as EditAnimeForm[K];
    }
    this.animeForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityField<K extends keyof EditAnimeEntityForm>(
    field: K,
    value: string
  ) {
    const current = this.animeEntityForm();
    if (!current) return;
    this.animeEntityForm.set({
      ...current,
      [field]: value,
    });
  }

  addEntitySeason(): void {
    const current = this.animeEntityForm();
    if (!current) return;
    const nums = current.seasonsData.map((s) => s.seasonNumber);
    /** Première saison = 1 ; sinon max + 1 (données héritées avec trous possibles). */
    const resolvedNext =
      nums.length === 0 ? 1 : Math.max(...nums) + 1;
    this.animeEntityForm.set({
      ...current,
      seasonsData: [
        ...current.seasonsData,
        {
          seasonNumber: resolvedNext,
          nbEpisodes: 0,
          totalLength: 0,
        },
      ],
    });
  }

  removeEntitySeason(index: number): void {
    const current = this.animeEntityForm();
    if (!current) return;
    const nextSeasons = current.seasonsData
      .filter((_, i) => i !== index)
      .map((season, i) => ({
        ...season,
        seasonNumber: i + 1,
      }));
    this.animeEntityForm.set({
      ...current,
      seasonsData: nextSeasons,
    });
  }

  updateSeasonDataField(
    seasonNumber: number,
    field: 'nbEpisodes' | 'totalLength',
    value: string | number
  ) {
    const current = this.animeEntityForm();
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
    this.animeEntityForm.set({
      ...current,
      seasonsData: nextSeasons,
    });
  }

  updateSeasonOtherViewedDates(seasonNumber: number, dates: string[]): void {
    const current = this.animeForm();
    if (!current) return;

    this.animeForm.set({
      ...current,
      seasons: current.seasons.map((season) =>
        season.seasonNumber === seasonNumber
          ? { ...season, otherViewedDates: dates }
          : season
      ),
    });
  }

  updateSeasonField(
    seasonNumber: number,
    field: 'seasonRating' | 'seasonTimesWatched' | 'firstViewedDate' | 'lastViewedDate',
    value: string | number
  ) {
    const current = this.animeForm();
    if (!current) return;

    const nextSeasons = current.seasons.map((season) =>
      season.seasonNumber === seasonNumber
        ? {
            ...season,
            [field]:
              field === 'firstViewedDate' || field === 'lastViewedDate'
                ? String(value)
                : Number.isNaN(Number(value))
                ? 0
                : Number(value),
          }
        : season
    );

    this.animeForm.set({
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

  private buildSeasons(anime: Anime): UserAnimeSeason[] {
    if (anime.seasons && anime.seasons.length > 0) {
      return anime.seasons.map((season) => ({
        ...season,
        firstViewedDate: season.firstViewedDate || '',
        lastViewedDate: season.lastViewedDate || '',
        otherViewedDates: season.otherViewedDates ?? [],
      }));
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

  private setupDialogNavigation(data: EditAnimeDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.anime];
    const index = this.resolveDialogIndex(list, data.index, data.anime);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setAnime(list[index] ?? data.anime);
  }

  private resolveDialogIndex(
    list: Anime[],
    index: number | undefined,
    anime: Anime
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === anime.title && item.director === anime.director
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setAnime(list[nextIndex]);
  }

  private setAnime(anime: Anime): void {
    this.anime.set(anime);
    this.animeForm.set(this.toForm(anime));
    this.animeEntityForm.set(this.toEntityForm(anime));
    this.adminTitle.set(anime.title);
    this.adminSecondary.set(anime.director);
    this.originalTitle.set(anime.title);
    this.originalSecondary.set(anime.director);
    this.animeNotFound.set(false);
    this.syncFromEntitySourceTypeFromForm();
  }
}
