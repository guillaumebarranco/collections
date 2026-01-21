import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Game } from '../../../models/game-model';
import { getGamesByUser } from '../../../facades/games/games.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';

type EditGameForm = {
  rating: number;
  timesFinished: number;
  additionnalEstimatedTime: number;
  platined: boolean;
  timesFinishedHundredPercent: number;
};

type EditGameDialogData = {
  game: Game;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss'],
})
export class EditGameComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditGameComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditGameDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly game = signal<Game | null>(null);
  readonly gameForm = signal<EditGameForm | null>(null);
  readonly gameNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);

  readonly gameSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.game) {
      this.game.set(this.dialogData.game);
      this.gameForm.set(this.toForm(this.dialogData.game));
      this.gameNotFound.set(false);
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
    if (
      field === 'rating' ||
      field === 'timesFinished' ||
      field === 'additionnalEstimatedTime' ||
      field === 'timesFinishedHundredPercent'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditGameForm[K];
    }

    this.gameForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'platined', checked: boolean) {
    const current = this.gameForm();
    if (!current) return;
    this.gameForm.set({
      ...current,
      [field]: checked,
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

  async onSubmit() {
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
          timesFinished: form.timesFinished,
          additionnalEstimatedTime: form.additionnalEstimatedTime,
          platined: form.platined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-game:error', payload);
        return;
      }

      if (this.dialogRef) {
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

  navigateToGames() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'games']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
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

  private toForm(game: Game): EditGameForm {
    return {
      rating: game.rating,
      timesFinished: game.timesFinished,
      additionnalEstimatedTime: game.additionnalEstimatedTime,
      platined: game.platined,
      timesFinishedHundredPercent: game.timesFinishedHundredPercent,
    };
  }

  private canEditCurrentUser(): boolean {
    return this.authService.canEdit(this.getCurrentUserId());
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
