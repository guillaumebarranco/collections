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

type EditManwhaForm = {
  title: string;
  author: string;
  rating: number;
  readTimes: number;
  readDate: string;
  coverUrl: string;
  pages: number;
  genre: string;
  nbChapters: number;
  isFinished: boolean;
};

type EditManwhaDialogData = {
  manwha: Manwha;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-manwha',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-manwha.component.html',
  styleUrls: ['./edit-manwha.component.scss'],
})
export class EditManwhaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditManwhaComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditManwhaDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly manwhaForm = signal<EditManwhaForm | null>(null);
  readonly manwhaNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly manwhaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manwha) {
      this.manwhaForm.set(this.toForm(this.dialogData.manwha));
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
    if (field === 'rating' || field === 'readTimes' || field === 'pages') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditManwhaForm[K];
    }

    this.manwhaForm.set({
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

  async onSubmit() {
    const form = this.manwhaForm();
    if (!form) return;

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
          title: form.title,
          author: form.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
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
      this.manwhaForm.set(null);
      this.manwhaNotFound.set(true);
      return;
    }

    this.manwhaForm.set(this.toForm(matched));
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
      title: manwha.title,
      author: manwha.author,
      rating: manwha.rating,
      readTimes: manwha.readTimes || 0,
      readDate: manwha.readDate,
      coverUrl: manwha.coverUrl,
      pages: manwha.pages || 0,
      genre: manwha.genre,
      nbChapters: manwha.nbChapters || 0,
      isFinished: manwha.isFinished || false,
    };
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
