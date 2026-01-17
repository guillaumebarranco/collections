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

type EditMangaForm = {
  title: string;
  author: string;
  rating: number;
  readTimes: number;
  readDate: string;
  coverUrl: string;
  pages: number;
  genre: string;
  nbTomes: number;
  isFinished: boolean;
};

type EditMangaDialogData = {
  manga: Manga;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-manga',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  readonly mangaForm = signal<EditMangaForm | null>(null);
  readonly mangaNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly mangaSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.manga) {
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
    if (field === 'rating' || field === 'readTimes' || field === 'pages') {
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
    if (!form) return;

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
          title: form.title,
          author: form.author,
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
      this.mangaForm.set(null);
      this.mangaNotFound.set(true);
      return;
    }

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
      title: manga.title,
      author: manga.author,
      rating: manga.rating,
      readTimes: manga.readTimes || 0,
      readDate: manga.readDate,
      coverUrl: manga.coverUrl,
      pages: manga.pages || 0,
      genre: manga.genre,
      nbTomes: manga.nbTomes || 0,
      isFinished: manga.isFinished || false,
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
