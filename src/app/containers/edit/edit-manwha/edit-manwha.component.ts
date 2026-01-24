import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Manwha } from '../../../models/manwha-model';
import { getManwhasByUser } from '../../../facades/manwhas/manwhas.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';
import { AuthService } from '../../../core/auth.service';

type EditManwhaForm = {
  rating: number;
  readTimes: number;
  readDate: string;
  owned: boolean;
};

type EditManwhaEntityForm = {
  pages: number;
  genre: string;
  nbChapters: number;
  isFinished: boolean;
  coverUrl: string;
};

type EditManwhaDialogData = {
  manwha: Manwha;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-manwha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-manwha.component.html',
  styleUrls: ['./edit-manwha.component.scss'],
})
export class EditManwhaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditManwhaComponent>, {
    optional: true,
  });
  private readonly authService = inject(AuthService);
  private readonly dialogData = inject<EditManwhaDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly manwha = signal<Manwha | null>(null);
  readonly manwhaForm = signal<EditManwhaForm | null>(null);
  readonly manwhaEntityForm = signal<EditManwhaEntityForm | null>(null);
  readonly manwhaNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);
  readonly isAdmin = computed(() => this.authService.isAdmin());

  readonly manwhaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manwha) {
      this.manwha.set(this.dialogData.manwha);
      this.manwhaForm.set(this.toForm(this.dialogData.manwha));
      this.manwhaEntityForm.set(this.toEntityForm(this.dialogData.manwha));
      this.manwhaNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadManwhaFromSlug(params);
    });
  }

  updateField<K extends keyof EditManwhaForm>(
    field: K,
    value: string | number
  ) {
    const current = this.manwhaForm();
    if (!current) return;

    let nextValue: EditManwhaForm[K] = value as EditManwhaForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditManwhaForm[K];
    }

    this.manwhaForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateCheckbox(field: 'owned', checked: boolean) {
    const current = this.manwhaForm();
    if (!current) return;
    this.manwhaForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateEntityField<K extends keyof EditManwhaEntityForm>(
    field: K,
    value: string | number
  ) {
    const current = this.manwhaEntityForm();
    if (!current) return;
    let nextValue: EditManwhaEntityForm[K] = value as EditManwhaEntityForm[K];
    if (field !== 'genre' && field !== 'coverUrl') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditManwhaEntityForm[K];
    }
    this.manwhaEntityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateEntityCheckbox(field: 'isFinished', checked: boolean) {
    const current = this.manwhaEntityForm();
    if (!current) return;
    this.manwhaEntityForm.set({
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
    const form = this.manwhaForm();
    const manwha = this.manwha();
    if (!form || !manwha) return;
    if (!this.canEditCurrentUser()) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/manwhas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manwha.title,
          author: manwha.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
          owned: form.owned,
          entity: this.isAdmin()
            ? this.toEntityPayload(this.manwhaEntityForm())
            : undefined,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manwha:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-manwha:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const manwha = this.manwha();
    if (!manwha) return;
    if (!this.canEditCurrentUser()) return;
    if (!confirm('Supprimer ce manwha de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/manwhas/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manwha.title,
          author: manwha.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manwha:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToManwhas();
    } catch (error) {
      console.error('edit-manwha:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  navigateToManwhas() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'manwhas']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  private async loadManwhaFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const manwhas = await getManwhasByUser(userId);
    const matched = manwhas.find((manwha) => {
      return this.toSlug(`${manwha.title} ${manwha.author}`) === slug;
    });

    if (!matched) {
      this.manwha.set(null);
      this.manwhaForm.set(null);
      this.manwhaNotFound.set(true);
      return;
    }

    this.manwha.set(matched);
    this.manwhaForm.set(this.toForm(matched));
    this.manwhaEntityForm.set(this.toEntityForm(matched));
    this.manwhaNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(manwha: Manwha): EditManwhaForm {
    return {
      rating: manwha.rating,
      readTimes: manwha.readTimes || 0,
      readDate: manwha.readDate,
      owned: manwha.owned,
    };
  }

  private toEntityForm(manwha: Manwha): EditManwhaEntityForm {
    return {
      pages: manwha.pages || 0,
      genre: manwha.genre || '',
      nbChapters: manwha.nbChapters || 0,
      isFinished: manwha.isFinished !== false,
      coverUrl: manwha.coverUrl || '',
    };
  }

  private toEntityPayload(form: EditManwhaEntityForm | null) {
    if (!form) return undefined;
    return {
      pages: form.pages,
      genre: form.genre,
      nbChapters: form.nbChapters,
      isFinished: form.isFinished,
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
