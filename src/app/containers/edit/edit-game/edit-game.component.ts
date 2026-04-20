import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { BaseGame, Game, UserGameSession } from '../../../models/game-model';
import { normalizeUserGameSessions } from '../../../helpers/entities.helper';
import type {
  GameFromEntityAdaptation,
  GameFromEntityType,
} from '../../../models/from-entity.model';
import {
  getAllBaseGames,
  getGamesByUser,
} from '../../../facades/games/games.facade';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';
import { getAllBaseSeries } from '../../../facades/series/series.facade';
import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { BaseBook } from '../../../models/book-model';
import { BaseMovie } from '../../../models/movie-model';
import { BaseBd } from '../../../models/bd-model';
import { BaseComic } from '../../../models/comic-model';
import { BaseManga } from '../../../models/manga-model';
import { BaseManwha } from '../../../models/manwha-model';
import { BaseSerie } from '../../../models/serie-model';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/entity/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/entity/edit-entity-header/edit-entity-header.component';
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

/** Type de complétion pour une session (une seule option par session). */
export type SessionCompletionType =
  | 'platined'
  | 'hundred'
  | 'finished'
  | 'none';

export type EditGameSessionForm = {
  completion: SessionCompletionType;
  additionnalEstimatedTime: number;
  /** YYYY-MM-DD ; vide si session « temps uniquement » / en cours. */
  finishedSessionDate: string;
  currentlyPlaying: boolean;
};

type EditGameForm = {
  rating: number;
  sessions: EditGameSessionForm[];
  owned: boolean;
  borrowed: string;
  loaned: string;
  gamelistPriority: number;
  wantToPlayAgain: boolean;
  ratingComment: string;
};

type EditGameEntityForm = {
  hero: string;
  coverUrl: string;
  releaseDate: string;
  averageTimeToFinish: number;
  averageTimeToHundredPercent: number;
  platform: string;
  saga: string;
  description: string;
  platineTime: number;
  fromEntity: GameFromEntityAdaptation | null;
};

type EditGameDialogData = {
  game: Game;
  userId?: string;
  list?: Game[];
  index?: number;
};

@Component({
  selector: 'app-edit-game',
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
  ],
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss'],
})
export class EditGameComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<EditGameComponent>, {
    optional: true,
  });
  public EntityType = EntityType;
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditGameDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly game = signal<Game | null>(null);
  readonly adminTitle = signal<string>('');
  readonly adminSecondary = signal<string>('');
  readonly originalTitle = signal<string>('');
  readonly originalSecondary = signal<string>('');
  readonly gameForm = signal<EditGameForm | null>(null);
  readonly gameEntityForm = signal<EditGameEntityForm | null>(null);
  readonly gameNotFound = signal<boolean>(false);
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
  readonly dialogList = signal<Game[]>([]);
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

  readonly gameSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  readonly baseBooks = signal<BaseBook[]>([]);
  readonly baseBds = signal<BaseBd[]>([]);
  readonly baseComics = signal<BaseComic[]>([]);
  readonly baseGames = signal<BaseGame[]>([]);
  readonly baseMangas = signal<BaseManga[]>([]);
  readonly baseManwhas = signal<BaseManwha[]>([]);
  readonly baseSeries = signal<BaseSerie[]>([]);
  readonly baseMovies = signal<BaseMovie[]>([]);
  readonly fromEntitySourceType = signal<GameFromEntityType | ''>('');

  readonly fromEntityTypeSelectOptions: {
    value: GameFromEntityType | '';
    label: string;
  }[] = [
    { value: '', label: 'Aucune adaptation' },
    { value: 'book', label: 'Livre' },
    { value: 'bd', label: 'Bande dessinée' },
    { value: 'comic', label: 'Comic' },
    { value: 'manga', label: 'Manga' },
    { value: 'manwha', label: 'Manhwa' },
    { value: 'movie', label: 'Film' },
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
      case 'movie':
        return [...this.baseMovies()]
          .sort(sortByTitle)
          .map((m) => ({
            value: `${m.title}|${m.director}`,
            label: `${m.title} — ${m.director}`,
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
    const form = this.gameEntityForm();
    const type = this.fromEntitySourceType();
    const fe = form?.fromEntity;
    if (!fe || fe.entityType !== type) return '';
    return `${fe.title}|${fe.secondEntityKey}`;
  });

  constructor() {
    if (this.dialogData?.game) {
      this.setupDialogNavigation(this.dialogData);
      void this.loadBaseFromEntitySourcesIfAdmin();
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadGameFromSlug(params);
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
      movies,
    ] = await Promise.all([
      getAllBaseBooks(),
      getAllBaseBds(),
      getAllBaseComics(),
      getAllBaseGames(),
      getAllBaseMangas(),
      getAllBaseManwhas(),
      getAllBaseSeries(),
      getAllBaseMovies(),
    ]);
    this.baseBooks.set(books);
    this.baseBds.set(bds);
    this.baseComics.set(comics);
    this.baseGames.set(games);
    this.baseMangas.set(mangas);
    this.baseManwhas.set(manwhas);
    this.baseSeries.set(series);
    this.baseMovies.set(movies);
  }

  getFromEntityTypeDisplayLabel(type: GameFromEntityType | undefined): string {
    if (!type) return '';
    const opt = this.fromEntityTypeSelectOptions.find((o) => o.value === type);
    return opt?.label ?? String(type);
  }

  private syncFromEntitySourceTypeFromForm(): void {
    const fe = this.gameEntityForm()?.fromEntity;
    this.fromEntitySourceType.set((fe?.entityType ?? '') as GameFromEntityType | '');
  }

  onFromEntityTypeSelect(value: string) {
    const current = this.gameEntityForm();
    if (!current) return;
    const t = (value ?? '') as GameFromEntityType | '';
    this.fromEntitySourceType.set(t);
    if (!t) {
      this.gameEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    if (current.fromEntity?.entityType === t) {
      return;
    }
    this.gameEntityForm.set({ ...current, fromEntity: null });
  }

  onFromEntityWorkSelect(value: string) {
    const current = this.gameEntityForm();
    if (!current) return;
    const type = this.fromEntitySourceType();
    if (!type) {
      return;
    }
    if (!value?.trim()) {
      this.gameEntityForm.set({ ...current, fromEntity: null });
      return;
    }
    const pipe = value.indexOf('|');
    if (pipe < 0) return;
    const title = value.slice(0, pipe).trim();
    const secondEntityKey = value.slice(pipe + 1).trim();
    if (!title) return;
    this.gameEntityForm.set({
      ...current,
      fromEntity: {
        entityType: type,
        title,
        secondEntityKey,
      },
    });
  }

  updateField<K extends keyof EditGameForm>(field: K, value: string | number) {
    const current = this.gameForm();
    if (!current) return;

    let nextValue: EditGameForm[K] = value as EditGameForm[K];
    if (field === 'rating' || field === 'gamelistPriority') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditGameForm[K];
    }

    this.gameForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateSessionCompletion(
    sessionIndex: number,
    completion: SessionCompletionType
  ) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length)
      return;
    const next = [...current.sessions];
    const prevDate = (next[sessionIndex]?.finishedSessionDate ?? '').trim();
    next[sessionIndex] = {
      ...next[sessionIndex],
      completion,
      currentlyPlaying:
        completion === 'none' ? (next[sessionIndex]?.currentlyPlaying ?? false) : false,
      finishedSessionDate:
        completion === 'none'
          ? ''
          : prevDate || new Date().toISOString().slice(0, 10),
    };
    this.gameForm.set({ ...current, sessions: next });
  }

  updateSessionCurrentlyPlaying(sessionIndex: number, checked: boolean) {
    const current = this.gameForm();
    if (!current || sessionIndex !== current.sessions.length - 1) return;
    const next = current.sessions.map((s, i) =>
      i === sessionIndex
        ? { ...s, currentlyPlaying: checked }
        : { ...s, currentlyPlaying: false }
    );
    this.gameForm.set({ ...current, sessions: next });
  }

  updateSessionFinishedDate(sessionIndex: number, value: string) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length)
      return;
    const next = [...current.sessions];
    next[sessionIndex] = {
      ...next[sessionIndex],
      finishedSessionDate: typeof value === 'string' ? value : '',
    };
    this.gameForm.set({ ...current, sessions: next });
  }

  updateSessionAdditionnalTime(sessionIndex: number, value: string | number) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length)
      return;
    const hours = Number(value);
    const next = [...current.sessions];
    next[sessionIndex] = {
      ...next[sessionIndex],
      additionnalEstimatedTime: Number.isNaN(hours) ? 0 : hours,
    };
    this.gameForm.set({ ...current, sessions: next });
  }

  addSession() {
    const current = this.gameForm();
    if (!current) return;
    const cleared = current.sessions.map((s) => ({
      ...s,
      currentlyPlaying: false,
    }));
    this.gameForm.set({
      ...current,
      sessions: [
        ...cleared,
        {
          completion: 'none',
          additionnalEstimatedTime: 0,
          finishedSessionDate: '',
          currentlyPlaying: false,
        },
      ],
    });
  }

  removeSession(sessionIndex: number) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length)
      return;
    const next = current.sessions.filter((_, i) => i !== sessionIndex);
    this.gameForm.set({ ...current, sessions: next });
  }

  /** True si une autre session a déjà "Platiné" coché (une seule session platine par jeu). */
  hasOtherSessionPlatined(sessionIndex: number): boolean {
    const form = this.gameForm();
    if (!form) return true;
    return form.sessions.some(
      (s, i) => i !== sessionIndex && s.completion === 'platined'
    );
  }

  /** Afficher l’option "Platiné" seulement si le jeu a un platineTime > 0 et qu’aucune autre session n’est platine. */
  canShowPlatinedOption(sessionIndex: number): boolean {
    const game = this.game();
    if (!game || game.platineTime <= 0) return false;
    return !this.hasOtherSessionPlatined(sessionIndex);
  }

  updateCheckbox(field: 'owned' | 'wantToPlayAgain', checked: boolean) {
    const current = this.gameForm();
    if (!current) return;
    this.gameForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditGameEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.gameEntityForm();
    if (!current) return;
    let nextValue: EditGameEntityForm[K] = value as EditGameEntityForm[K];
    if (
      field === 'averageTimeToFinish' ||
      field === 'averageTimeToHundredPercent' ||
      field === 'platineTime'
    ) {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as EditGameEntityForm[K];
    }
    this.gameEntityForm.set({
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
    const form = this.gameForm();
    const game = this.game();
    if (!form || !game) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: game.title,
          editor: game.editor,
          rating: form.rating,
          ...this.formSessionsToPayload(form.sessions),
          owned: form.owned,
          borrowed: form.borrowed,
          loaned: form.loaned,
          gamelistPriority: form.gamelistPriority,
          wantToPlayAgain: form.wantToPlayAgain,
          ratingComment: form.ratingComment ?? '',
          entity: this.isAdminView()
            ? this.toEntityPayload(this.gameEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-game:error', payload);
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
      console.error('edit-game:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const game = this.game();
    if (!game) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce jeu de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/games/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: game.title,
          editor: game.editor,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-game:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToGames();
    } catch (error) {
      console.error('edit-game:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  async onAdminSubmit() {
    const game = this.game();
    const entityForm = this.gameEntityForm();
    if (!game || !entityForm) return;
    if (!this.canEditCurrentUser()) return;
    if (this.isTitleModified() && this.isSecondaryModified()) {
      alert(
        "Merci de modifier soit le titre, soit l'éditeur, pas les deux en même temps."
      );
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/games`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getAdminUserId(),
          title: this.adminTitle().trim(),
          editor: this.adminSecondary().trim(),
          entityOnly: true,
          originalTitle: this.originalTitle(),
          originalEditor: this.originalSecondary(),
          entity: this.toEntityPayload(entityForm),
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-game:admin:error', payload);
        return;
      }

      this.dialogRef?.close({ updated: true, payload });
    } catch (error) {
      console.error('edit-game:admin:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  openCreateQuizz() {
    const game = this.game();
    if (!game) return;
    this.dialog.open(QuizzCreateModalComponent, {
      data: {
        entityTitle: game.title,
        entityType: EntityType.GAME,
        creator: this.getQuizzCreator(),
      },
      width: '720px',
      maxWidth: '95vw',
    });
    this.dialogRef?.close();
  }

  navigateToGames() {
    if (this.dialogRef) {
      this.dialogRef.close(
        this.hasDialogUpdates() ? { updated: true } : undefined
      );
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'games']);
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

  private async loadGameFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const games = await getGamesByUser(userId);
    const matched = games.find((game) => {
      return this.toSlug(`${game.title} ${game.editor}`) === slug;
    });

    if (!matched) {
      this.game.set(null);
      this.gameForm.set(null);
      this.gameEntityForm.set(null);
      this.fromEntitySourceType.set('');
      this.gameNotFound.set(true);
      return;
    }

    this.game.set(matched);
    this.gameForm.set(this.toForm(matched));
    this.gameEntityForm.set(this.toEntityForm(matched));
    this.syncFromEntitySourceTypeFromForm();
    this.gameNotFound.set(false);
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

  private toForm(game: Game): EditGameForm {
    const sessions =
      (game.sessions ?? []).length > 0
        ? this.gameSessionsToFormSessions(game.sessions)
        : [
            {
              completion: 'none' as const,
              additionnalEstimatedTime: 0,
              finishedSessionDate: '',
              currentlyPlaying: false,
            },
          ];
    return {
      rating: game.rating,
      sessions,
      owned: game.owned,
      borrowed: game.borrowed ?? '',
      loaned: game.loaned ?? '',
      gamelistPriority: game.gamelistPriority ?? 0,
      wantToPlayAgain: game.wantToPlayAgain ?? false,
      ratingComment: game.ratingComment ?? '',
    };
  }

  private gameSessionsToFormSessions(
    sessions: UserGameSession[]
  ): EditGameSessionForm[] {
    const last = sessions.length - 1;
    return sessions.map((s, index) => {
      let completion: SessionCompletionType = 'none';
      if (s.platinedGame) completion = 'platined';
      else if (s.finishedGameWithHundredPercent) completion = 'hundred';
      else if (s.finishedGame) completion = 'finished';
      return {
        completion,
        additionnalEstimatedTime: s.additionnalEstimatedTime ?? 0,
        finishedSessionDate: s.finishedSessionDate ?? '',
        currentlyPlaying:
          index === last && Boolean(s.currentlyPlaying),
      };
    });
  }

  private formSessionsToPayload(formSessions: EditGameSessionForm[]): {
    sessions: UserGameSession[];
  } {
    const sessions = normalizeUserGameSessions(
      formSessions.map((f) => ({
        finishedGame: f.completion === 'finished',
        finishedGameWithHundredPercent: f.completion === 'hundred',
        platinedGame: f.completion === 'platined',
        additionnalEstimatedTime:
          f.completion === 'none' ? f.additionnalEstimatedTime ?? 0 : 0,
        finishedSessionDate: this.resolveFinishedSessionDateForPayload(f),
        currentlyPlaying: Boolean(f.currentlyPlaying),
      }))
    );
    return { sessions };
  }

  private resolveFinishedSessionDateForPayload(f: EditGameSessionForm): string {
    const trimmed = (f.finishedSessionDate ?? '').trim();
    if (trimmed) {
      return trimmed;
    }
    if (f.completion === 'none') {
      return '';
    }
    return new Date().toISOString().slice(0, 10);
  }

  private toEntityForm(game: Game): EditGameEntityForm {
    return {
      hero: game.hero || '',
      coverUrl: game.coverUrl || '',
      releaseDate: game.releaseDate || '',
      averageTimeToFinish: game.averageTimeToFinish || 0,
      averageTimeToHundredPercent: game.averageTimeToHundredPercent || 0,
      platform: game.platform || '',
      saga: game.saga || '',
      platineTime: game.platineTime || 0,
      description: game.description ?? '',
      fromEntity: game.fromEntity ?? null,
    };
  }

  private toEntityPayload(form: EditGameEntityForm | null) {
    if (!form) return undefined;
    return {
      hero: form.hero,
      coverUrl: form.coverUrl,
      releaseDate: form.releaseDate,
      averageTimeToFinish: form.averageTimeToFinish,
      averageTimeToHundredPercent: form.averageTimeToHundredPercent,
      platform: form.platform,
      saga: form.saga,
      platineTime: form.platineTime,
      description: form.description ?? '',
      fromEntity: form.fromEntity,
    };
  }

  private canEditCurrentUser(): boolean {
    return (
      this.isAdminView() || this.authService.canEdit(this.getCurrentUserId())
    );
  }

  private getAdminUserId(): string {
    return this.authService.getAuthenticatedUserId() || this.getCurrentUserId();
  }

  private setupDialogNavigation(data: EditGameDialogData) {
    const list = data.list && data.list.length > 0 ? data.list : [data.game];
    const index = this.resolveDialogIndex(list, data.index, data.game);
    this.dialogList.set(list);
    this.dialogIndex.set(index);
    this.setGame(list[index] ?? data.game);
  }

  private resolveDialogIndex(
    list: Game[],
    index: number | undefined,
    game: Game
  ): number {
    if (typeof index === 'number' && index >= 0 && index < list.length) {
      return index;
    }
    const fallback = list.findIndex(
      (item) => item.title === game.title && item.editor === game.editor
    );
    return fallback >= 0 ? fallback : 0;
  }

  private navigateToOffset(offset: number): void {
    if (!this.hasDialogNavigation()) return;
    const list = this.dialogList();
    const nextIndex = this.dialogIndex() + offset;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    this.dialogIndex.set(nextIndex);
    this.setGame(list[nextIndex]);
  }

  private setGame(game: Game): void {
    this.game.set(game);
    this.gameForm.set(this.toForm(game));
    this.gameEntityForm.set(this.toEntityForm(game));
    this.adminTitle.set(game.title);
    this.adminSecondary.set(game.editor);
    this.originalTitle.set(game.title);
    this.originalSecondary.set(game.editor);
    this.gameNotFound.set(false);
    this.syncFromEntitySourceTypeFromForm();
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
}
