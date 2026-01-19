import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Comic } from '../../../models/comic-model';
import { getComicsByUser } from '../../../facades/comics/comics.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';

type EditComicForm = {
  rating: number;
  readTimes: number;
  readDate: string;
};

type EditComicDialogData = {
  comic: Comic;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-comic',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-comic.component.html',
  styleUrls: ['./edit-comic.component.scss'],
})
export class EditComicComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditComicComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditComicDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly comic = signal<Comic | null>(null);
  readonly comicForm = signal<EditComicForm | null>(null);
  readonly comicNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly comicSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.comic) {
      this.comic.set(this.dialogData.comic);
      this.comicForm.set(this.toForm(this.dialogData.comic));
      this.comicNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadComicFromSlug(params);
    });
  }

  updateField<K extends keyof EditComicForm>(field: K, value: string | number) {
    const current = this.comicForm();
    if (!current) return;

    let nextValue: EditComicForm[K] = value as EditComicForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditComicForm[K];
    }

    this.comicForm.set({
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
    const form = this.comicForm();
    const comic = this.comic();
    if (!form || !comic) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/comics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: comic.title,
          author: comic.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-comic:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-comic:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  navigateToComics() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'comics']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  private async loadComicFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const comics = await getComicsByUser(userId);
    const matched = comics.find((comic) => {
      return this.toSlug(`${comic.title} ${comic.author}`) === slug;
    });

    if (!matched) {
      this.comic.set(null);
      this.comicForm.set(null);
      this.comicNotFound.set(true);
      return;
    }

    this.comic.set(matched);
    this.comicForm.set(this.toForm(matched));
    this.comicNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(comic: Comic): EditComicForm {
    return {
      rating: comic.rating,
      readTimes: comic.readTimes || 0,
      readDate: comic.readDate,
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
