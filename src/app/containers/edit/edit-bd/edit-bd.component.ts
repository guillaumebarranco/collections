import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Bd } from '../../../models/bd-model';
import { getBdsByUser } from '../../../facades/bds/bds.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';

type EditBdForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
};

type EditBdEntityForm = {
  pages: number;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
  writer: string;
  coverUrl: string;
};

type EditBdDialogData = {
  bd: Bd;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-bd',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-bd.component.html',
  styleUrls: ['./edit-bd.component.scss'],
})
export class EditBdComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditBdComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditBdDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly bd = signal<Bd | null>(null);
  readonly bdForm = signal<EditBdForm | null>(null);
  readonly bdEntityForm = signal<EditBdEntityForm | null>(null);
  readonly bdNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());

  readonly bdSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.bd) {
      this.bd.set(this.dialogData.bd);
      this.bdForm.set(this.toForm(this.dialogData.bd));
      this.bdEntityForm.set(this.toEntityForm(this.dialogData.bd));
      this.bdNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadBdFromSlug(params);
    });
  }

  updateField<K extends keyof EditBdForm>(field: K, value: string | number) {
    const current = this.bdForm();
    if (!current) return;

    let nextValue: EditBdForm[K] = value as EditBdForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBdForm[K];
    }

    this.bdForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.bdForm();
    if (!current) return;
    this.bdForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditBdEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.bdEntityForm();
    if (!current) return;
    let nextValue: EditBdEntityForm[K] = value as EditBdEntityForm[K];
    if (field !== 'genre' && field !== 'writer' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBdEntityForm[K];
    }
    this.bdEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.bdEntityForm();
    if (!current) return;
    this.bdEntityForm.set({
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
    const form = this.bdForm();
    const bd = this.bd();
    if (!form || !bd) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/bds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: bd.title,
          designer: bd.designer,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          entity: this.isAdmin()
            ? this.toEntityPayload(this.bdEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-bd:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-bd:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const bd = this.bd();
    if (!bd) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer cette BD de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/bds/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: bd.title,
          designer: bd.designer,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-bd:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToBds();
    } catch (error) {
      console.error('edit-bd:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  navigateToBds() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'bds']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  private async loadBdFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const bds = await getBdsByUser(userId);
    const matched = bds.find((bd) => {
      return this.toSlug(`${bd.title} ${bd.designer}`) === slug;
    });

    if (!matched) {
      this.bd.set(null);
      this.bdForm.set(null);
      this.bdNotFound.set(true);
      return;
    }

    this.bd.set(matched);
    this.bdForm.set(this.toForm(matched));
    this.bdEntityForm.set(this.toEntityForm(matched));
    this.bdNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(bd: Bd): EditBdForm {
    return {
      rating: bd.rating,
      readTimes: bd.readTimes || 0,
      readDate: bd.readDate,
      owned: bd.owned,
    };
  }

  private toEntityForm(bd: Bd): EditBdEntityForm {
    return {
      pages: bd.pages || 0,
      genre: bd.genre || '',
      nbTomes: bd.nbTomes || 0,
      isFinished: bd.isFinished !== false,
      writer: bd.writer || '',
      coverUrl: bd.coverUrl || '',
    };
  }

  private toEntityPayload(form: EditBdEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      nbTomes: form.nbTomes,
      isFinished: form.isFinished,
      writer: form.writer,
      coverUrl: form.coverUrl,
    };
  }

  private canEditCurrentUser(): boolean {
    return this.authService.canEdit(this.getCurrentUserId());
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
