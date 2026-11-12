import { Component, input, output, signal } from '@angular/core';
import { getApiBaseUrl } from '../../../core/config';

export const COVER_ENTITY_TYPES = [
  'movies',
  'series',
  'animes',
  'books',
  'children-books',
  'bds',
  'comics',
  'mangas',
  'manwhas',
  'games',
  'musics',
] as const;

export type CoverEntityType = (typeof COVER_ENTITY_TYPES)[number];

@Component({
  selector: 'app-cover-upload',
  standalone: true,
  templateUrl: './cover-upload.component.html',
  styleUrls: ['./cover-upload.component.scss'],
})
export class CoverUploadComponent {
  readonly entityType = input.required<CoverEntityType>();
  readonly uploaded = output<string>();

  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);

  async onFileSelected(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    inputEl.value = '';
    if (!file || this.uploading()) return;

    this.error.set(null);
    this.uploading.set(true);
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/covers/${encodeURIComponent(this.entityType())}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: file,
        },
      );
      const data = (await response.json().catch(() => null)) as {
        coverUrl?: string;
        error?: string;
      } | null;
      if (!response.ok || !data?.coverUrl?.startsWith('/')) {
        this.error.set(data?.error || 'L’envoi de l’image a échoué.');
        return;
      }
      this.uploaded.emit(data.coverUrl);
    } catch {
      this.error.set('Impossible de joindre le serveur.');
    } finally {
      this.uploading.set(false);
    }
  }
}
