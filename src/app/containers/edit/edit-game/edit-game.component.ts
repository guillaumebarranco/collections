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
  Game,
  UserGameSession,
} from '../../../models/game-model';
import { getGamesByUser } from '../../../facades/games/games.facade';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { EditEntityHeaderComponent } from '../../../components/edit-entity-header/edit-entity-header.component';
import { AuthService } from '../../../core/auth.service';
import { QuizzCreateModalComponent } from '../../../components/quizz-create-modal/quizz-create-modal.component';
import { EntityType } from '../../../models/quizz-model';

/** Type de complétion pour une session (une seule option par session). */
export type SessionCompletionType =
  | 'platined'
  | 'hundred'
  | 'finished'
  | 'none';

export type EditGameSessionForm = {
  completion: SessionCompletionType;
  additionnalEstimatedTime: number;
};

type EditGameForm = {
  rating: number;
  sessions: EditGameSessionForm[];
  owned: boolean;
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
};

type EditGameDialogData = {
  game: Game;
  userId?: string;
  list?: Game[];
  index?: number;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditEntityComponent,
    EditEntityHeaderComponent,
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

  constructor() {
    if (this.dialogData?.game) {
      this.setupDialogNavigation(this.dialogData);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadGameFromSlug(params);
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

  updateSessionCompletion(sessionIndex: number, completion: SessionCompletionType) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length) return;
    const next = [...current.sessions];
    next[sessionIndex] = { ...next[sessionIndex], completion };
    this.gameForm.set({ ...current, sessions: next });
  }

  updateSessionAdditionnalTime(sessionIndex: number, value: string | number) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length) return;
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
    this.gameForm.set({
      ...current,
      sessions: [...current.sessions, { completion: 'none', additionnalEstimatedTime: 0 }],
    });
  }

  removeSession(sessionIndex: number) {
    const current = this.gameForm();
    if (!current || sessionIndex < 0 || sessionIndex >= current.sessions.length) return;
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

    const half = target.clientWidth / 2;
    const nextValue = event.offsetX < half ? star - 0.5 : star;
    this.updateField('rating', Math.max(0, nextValue));
  }

  getStarType(rating: number, star: number): 'full' | 'half' | 'empty' {
    if (rating >= star) {
      return 'full';
    }
    if (rating >= star - 0.5) {
      return 'half';
    }
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
      this.gameNotFound.set(true);
      return;
    }

    this.game.set(matched);
    this.gameForm.set(this.toForm(matched));
    this.gameEntityForm.set(this.toEntityForm(matched));
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
        : [{ completion: 'none' as const, additionnalEstimatedTime: 0 }];
    return {
      rating: game.rating,
      sessions,
      owned: game.owned,
      gamelistPriority: game.gamelistPriority ?? 0,
      wantToPlayAgain: game.wantToPlayAgain ?? false,
      ratingComment: game.ratingComment ?? '',
    };
  }

  private gameSessionsToFormSessions(sessions: UserGameSession[]): EditGameSessionForm[] {
    return sessions.map((s) => {
      let completion: SessionCompletionType = 'none';
      if (s.platinedGame) completion = 'platined';
      else if (s.finishedGameWithHundredPercent) completion = 'hundred';
      else if (s.finishedGame) completion = 'finished';
      return {
        completion,
        additionnalEstimatedTime: s.additionnalEstimatedTime ?? 0,
      };
    });
  }

  private formSessionsToPayload(formSessions: EditGameSessionForm[]): {
    sessions: UserGameSession[];
  } {
    const sessions: UserGameSession[] = formSessions.map((f) => ({
      finishedGame: f.completion === 'finished',
      finishedGameWithHundredPercent: f.completion === 'hundred',
      platinedGame: f.completion === 'platined',
      additionnalEstimatedTime: f.completion === 'none' ? (f.additionnalEstimatedTime ?? 0) : 0,
    }));
    return { sessions };
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
