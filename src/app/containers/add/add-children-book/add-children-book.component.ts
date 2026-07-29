import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { CountrySelectComponent } from '../../../components/shared/country-select/country-select.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  CHILDREN_BOOK_GENRE_OPTIONS,
  type ChildrenBookGenre,
} from '../../../models/children-book-model';
import { ExtraDatesListComponent } from '../../../components/shared/extra-dates-list/extra-dates-list.component';
import { normalizeActivityExtraDates } from '../../../utils/activity-extra-dates.utils';

type AddChildrenBookEntityForm = {
  title: string;
  author: string;
  coverUrl: string;
  pages: number;
  genre: ChildrenBookGenre[];
  saga: string;
  sagaOrder: number;
  sagaFinished: boolean;
  releaseDate: string;
  description: string;
  countryOrigin: string;
};

type AddChildrenBookUserForm = {
  rating: number;
  readTimes: number;
  firstReadDate: string;
  lastReadDate: string;
  otherReadDates: string[];
  owned: boolean;
  borrowed: string;
  loaned: string;
  readPriority: number;
  ratingComment: string;
};

type AddChildrenBookDialogData = {
  userId: string;
  listMode?: 'watchlist' | 'readlist' | 'gamelist' | null;
};

@Component({
  selector: 'app-add-children-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CountrySelectComponent,
    MatFormFieldModule,
    MatSelectModule,
    ExtraDatesListComponent,
  ],
  templateUrl: './add-children-book.component.html',
  styleUrls: ['./add-children-book.component.scss'],
})
export class AddChildrenBookComponent {
  private readonly dialogRef = inject(MatDialogRef<AddChildrenBookComponent>);
  private readonly dialogData = inject<AddChildrenBookDialogData | null>(
    MAT_DIALOG_DATA,
    { optional: true }
  );

  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly childrenBookGenreOptions = CHILDREN_BOOK_GENRE_OPTIONS;

  entityForm = signal<AddChildrenBookEntityForm>({
    title: '',
    author: '',
    coverUrl: '',
    pages: 0,
    genre: [],
    saga: '',
    sagaOrder: 0,
    sagaFinished: true,
    releaseDate: '',
    description: '',
    countryOrigin: '',
  });

  userForm = signal<AddChildrenBookUserForm>({
    rating: 0,
    readTimes: 1,
    firstReadDate: '',
    lastReadDate: '',
    otherReadDates: [],
    owned: false,
    borrowed: '',
    loaned: '',
    readPriority: 1,
    ratingComment: '',
  });

  close() {
    this.dialogRef.close();
  }

  updateEntityField<K extends keyof AddChildrenBookEntityForm>(
    field: K,
    value: string | number | boolean
  ) {
    const current = this.entityForm();
    let nextValue: AddChildrenBookEntityForm[K] = value as AddChildrenBookEntityForm[K];
    if (field === 'pages' || field === 'sagaOrder') {
      const asNumber = Number(value);
      nextValue = (
        Number.isNaN(asNumber) ? 0 : asNumber
      ) as AddChildrenBookEntityForm[K];
    }
    this.entityForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  updateOtherReadDates(dates: string[]): void {
    this.userForm.set({
      ...this.userForm(),
      otherReadDates: dates,
    });
  }

  updateUserField<K extends keyof AddChildrenBookUserForm>(
    field: K,
    value: string | number
  ) {
    const current = this.userForm();
    let nextValue: AddChildrenBookUserForm[K] = value as AddChildrenBookUserForm[K];
    if (
      field === 'rating' ||
      field === 'readTimes' ||
      field === 'readPriority'
    ) {
      const asNumber = Number(value);
      nextValue = (Number.isNaN(asNumber) ? 0 : asNumber) as AddChildrenBookUserForm[K];
    }
    this.userForm.set({
      ...current,
      [field]: nextValue,
    });
  }

  setGenres(genres: ChildrenBookGenre[]) {
    const current = this.entityForm();
    this.entityForm.set({ ...current, genre: genres });
  }

  updateCheckbox(field: 'sagaFinished', checked: boolean) {
    const current = this.entityForm();
    this.entityForm.set({
      ...current,
      [field]: checked,
    });
  }

  updateUserCheckbox(field: 'owned', checked: boolean) {
    const current = this.userForm();
    this.userForm.set({
      ...current,
      [field]: checked,
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
    this.updateUserField('rating', Math.max(0, Math.min(5, nextValue)));
  }

  getStarType(rating: number, star: number): 'full' | 'threeQuarter' | 'half' | 'quarter' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.25) return 'threeQuarter';
    if (rating >= star - 0.5) return 'half';
    if (rating >= star - 0.75) return 'quarter';
    return 'empty';
  }

  getUserId(): string {
    return this.dialogData?.userId || DEFAULT_USER_ID;
  }

  get headerTitle(): string {
    return this.dialogData?.listMode === 'readlist'
      ? 'Ajouter un livre pour enfants à lire'
      : 'Ajouter un livre pour enfants';
  }

  async onSubmit() {
    const entity = this.entityForm();
    const user = this.userForm();

    if (!entity.title || !entity.author) {
      this.errorMessage.set('Titre et auteur sont obligatoires.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/children-books/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.getUserId(),
          readlist: this.dialogData?.listMode === 'readlist',
          entity,
          user: {
            ...user,
            otherReadDates: normalizeActivityExtraDates(user.otherReadDates),
          },
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.errorMessage.set(payload?.error || "Erreur lors de l'ajout.");
        return;
      }

      this.dialogRef.close({ created: true, payload });
    } catch {
      this.errorMessage.set("Erreur réseau lors de l'ajout.");
    } finally {
      this.isSaving.set(false);
    }
  }
}
