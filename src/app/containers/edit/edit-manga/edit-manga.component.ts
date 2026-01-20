import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Manga } from '../../../models/manga-model';
import { getMangasByUser } from '../../../facades/mangas/mangas.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { EditEntityComponent } from '../../../components/edit-entity/edit-entity.component';

type EditMangaForm = {
  rating: number;
  readTimes: number;
  readDate: string;
};

type EditMangaDialogData = {
  manga: Manga;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-manga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EditEntityComponent],
  templateUrl: './edit-manga.component.html',
  styleUrls: ['./edit-manga.component.scss'],
})
export class EditMangaComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditMangaComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditMangaDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly manga = signal<Manga | null>(null);
  readonly mangaForm = signal<EditMangaForm | null>(null);
  readonly mangaNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);
  readonly isDeleting = signal<boolean>(false);

  readonly mangaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manga) {
      this.manga.set(this.dialogData.manga);
      this.mangaForm.set(this.toForm(this.dialogData.manga));
      this.mangaNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadMangaFromSlug(params);
    });
  }

  updateField<K extends keyof EditMangaForm>(field: K, value: string | number) {
    const current = this.mangaForm();
    if (!current) return;

    let nextValue: EditMangaForm[K] = value as EditMangaForm[K];
    if (field === 'rating' || field === 'readTimes') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditMangaForm[K];
    }

    this.mangaForm.set({
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
    const form = this.mangaForm();
    const manga = this.manga();
    if (!form || !manga) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/mangas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manga.title,
          author: manga.author,
          rating: form.rating,
          readTimes: form.readTimes,
          readDate: form.readDate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manga:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-manga:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  async onDelete() {
    const manga = this.manga();
    if (!manga) return;
    if (!confirm('Supprimer ce manga de ta liste ?')) return;

    this.isDeleting.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${getApiBaseUrl()}/mangas/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: manga.title,
          author: manga.author,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.error('edit-manga:delete:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, deleted: true, payload });
        return;
      }

      this.navigateToMangas();
    } catch (error) {
      console.error('edit-manga:delete:error', error);
    } finally {
      this.isDeleting.set(false);
    }
  }

  navigateToMangas() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'mangas']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  private async loadMangaFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const mangas = await getMangasByUser(userId);
    const matched = mangas.find((manga) => {
      return this.toSlug(`${manga.title} ${manga.author}`) === slug;
    });

    if (!matched) {
      this.manga.set(null);
      this.mangaForm.set(null);
      this.mangaNotFound.set(true);
      return;
    }

    this.manga.set(matched);
    this.mangaForm.set(this.toForm(matched));
    this.mangaNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(manga: Manga): EditMangaForm {
    return {
      rating: manga.rating,
      readTimes: manga.readTimes || 0,
      readDate: manga.readDate,
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
