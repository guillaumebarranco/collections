import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { getApiBaseUrl } from '../../../core/config';

export interface MusicQuotesModalData {
  title: string;
  artist: string;
  quotes: string[];
  userId: string;
}

export interface MusicQuotesModalResult {
  quotes: string[];
}

@Component({
  selector: 'app-music-quotes-modal',
  standalone: true,
  imports: [FormsModule, MatDialogModule],
  templateUrl: './music-quotes-modal.component.html',
  styleUrl: './music-quotes-modal.component.scss',
})
export class MusicQuotesModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<MusicQuotesModalComponent, MusicQuotesModalResult | undefined>
  );
  readonly data = inject<MusicQuotesModalData>(MAT_DIALOG_DATA);

  readonly quotes = signal<string[]>(
    [...(this.data.quotes ?? [])].map((quote) =>
      quote.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\r/g, '\n')
    )
  );
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');

  addQuote(): void {
    this.quotes.update((quotes) => [...quotes, '']);
  }

  updateQuote(index: number, value: string): void {
    this.quotes.update((quotes) =>
      quotes.map((quote, quoteIndex) => (quoteIndex === index ? value : quote))
    );
  }

  removeQuote(index: number): void {
    this.quotes.update((quotes) =>
      quotes.filter((_, quoteIndex) => quoteIndex !== index)
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  async save(): Promise<void> {
    const quotes = this.quotes()
      .map((quote) => quote.trim())
      .filter(Boolean);
    this.isSaving.set(true);
    this.errorMessage.set('');
    try {
      const response = await fetch(`${getApiBaseUrl()}/musics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.data.userId,
          title: this.data.title,
          artist: this.data.artist,
          quotes,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        this.errorMessage.set(payload?.error || 'Enregistrement impossible');
        return;
      }
      this.dialogRef.close({ quotes });
    } catch {
      this.errorMessage.set('Enregistrement impossible');
    } finally {
      this.isSaving.set(false);
    }
  }
}
