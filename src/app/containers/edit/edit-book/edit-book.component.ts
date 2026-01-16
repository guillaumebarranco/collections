import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  Router,
  RouterModule,
} from '@angular/router';
import { Book } from '../../../models/book-model';
import { getBooksByUser } from '../../../facades/books/books.facade';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type EditBookForm = {
  title: string;
  author: string;
  rating: number;
  readTimes: number;
  readDate: string;
  coverUrl: string;
  pages: number;
  genre: string;
  saga: string;
  sagaOrder: number;
};

type EditBookDialogData = {
  book: Book;
  userId?: string;
};

const DEFAULT_USER_ID = 'guillaume';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.scss'],
})
export class EditBookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<EditBookComponent>, {
    optional: true,
  });
  private readonly dialogData = inject<EditBookDialogData | null>(
    MAT_DIALOG_DATA,
    {
      optional: true,
    }
  );

  readonly bookForm = signal<EditBookForm | null>(null);
  readonly bookNotFound = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  readonly bookSlug = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('slug') || '';
  });

  constructor() {
    if (this.dialogData?.book) {
      this.bookForm.set(this.toForm(this.dialogData.book));
      this.bookNotFound.set(false);
      return;
    }

    this.activatedRoute.paramMap.subscribe((params) => {
      void this.loadBookFromSlug(params);
    });
  }

  public apiUrl = document.location.origin.includes('localhost')
    ? `http://localhost:3001/api`
    : 'https://makya.webarranco.fr/api';

  updateField<K extends keyof EditBookForm>(field: K, value: string | number) {
    const current = this.bookForm();
    if (!current) return;

    let nextValue: EditBookForm[K] = value as EditBookForm[K];
    if (field === 'rating' || field === 'readTimes' || field === 'pages') {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as EditBookForm[K];
    }

    this.bookForm.set({
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
    const form = this.bookForm();
    if (!form) return;

    this.isSaving.set(true);
    try {
      const userId = this.getCurrentUserId();
      const response = await fetch(`${this.apiUrl}/books`, {
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
        console.error('edit-book:error', payload);
        return;
      }

      if (this.dialogRef) {
        this.dialogRef.close({ updated: true, payload });
      }
    } catch (error) {
      console.error('edit-book:error', error);
    } finally {
      this.isSaving.set(false);
    }
  }

  navigateToBooks() {
    if (this.dialogRef) {
      this.dialogRef.close();
      return;
    }
    const userId = this.getCurrentUserId();
    this.router.navigate(['/', userId, 'books']);
  }

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  private async loadBookFromSlug(params: ParamMap) {
    const slug = params.get('slug') || '';
    const userId = this.getCurrentUserId();
    const books = await getBooksByUser(userId);
    const matched = books.find((book) => {
      return this.toSlug(`${book.title} ${book.author}`) === slug;
    });

    if (!matched) {
      this.bookForm.set(null);
      this.bookNotFound.set(true);
      return;
    }

    this.bookForm.set(this.toForm(matched));
    this.bookNotFound.set(false);
  }

  private getCurrentUserId(): string {
    if (this.dialogData?.userId) {
      return this.dialogData.userId;
    }
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return directId || parentId || DEFAULT_USER_ID;
  }

  private toForm(book: Book): EditBookForm {
    return {
      title: book.title,
      author: book.author,
      rating: book.rating,
      readTimes: book.readTimes || 0,
      readDate: book.readDate,
      coverUrl: book.coverUrl,
      pages: book.pages || 0,
      genre: book.genre,
      saga: book.saga,
      sagaOrder: book.sagaOrder,
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
