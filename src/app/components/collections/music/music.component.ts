import { Component, inject, input, output, signal } from '@angular/core';
import { Music } from '../../../models/music-model';
import { saveMusicDetails } from '../../../facades/musics/api-musics.facade';
import { MusicDetailsUpdate } from '../../modals/album-modal/album-modal.component';
import { CommonModule } from '@angular/common';
import { isBaseEntityView } from '../../../core/config';
import { StarInfo } from '../../../models/various-model';
import { DEFAULT_USER_ID, getRatingStars } from '../../../utils/constants';
import { PersonBadgeComponent } from '../../shared/person-badge/person-badge.component';
import { PersonNamesPipe } from '../../shared/person-badge/person-names.pipe';
import { EntityQuotesComponent } from '../../shared/entity-quotes/entity-quotes.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import {
  MusicQuotesModalComponent,
  MusicQuotesModalResult,
} from '../../modals/music-quotes-modal/music-quotes-modal.component';

@Component({
  selector: 'app-music',
  imports: [
    CommonModule,
    PersonBadgeComponent,
    PersonNamesPipe,
    EntityQuotesComponent,
  ],
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent {
  private readonly dialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);

  music = input.required<Music>();
  quotesUpdated = output<MusicQuotesModalResult & { title: string; artist: string }>();
  musicUpdated = output<MusicDetailsUpdate>();
  isBaseEntityView = isBaseEntityView();
  readonly isSaving = signal(false);
  readonly saveError = signal(false);
  private saveQueue: Promise<void> = Promise.resolve();

  canEditQuotes(): boolean {
    if (this.isBaseEntityView) {
      return false;
    }
    return this.authService.canEdit(this.currentUserId());
  }

  onTimesListenedChange(event: Event): void {
    const music = this.music();
    const input = event.target as HTMLInputElement;
    const raw = input.value.trim();
    if (!/^\d+$/.test(raw)) {
      input.value = String(music.timesListened);
      return;
    }
    const timesListened = Number(raw);
    if (timesListened === music.timesListened) {
      return;
    }
    void this.persistMusic({ timesListened }, () => {
      input.value = String(music.timesListened);
    });
  }

  onByHeartChange(event: Event): void {
    const music = this.music();
    const input = event.target as HTMLInputElement;
    const byHeart = input.checked;
    if (byHeart === music.byHeart) {
      return;
    }
    void this.persistMusic({ byHeart }, () => {
      input.checked = music.byHeart;
    });
  }

  private persistMusic(
    patch: Pick<MusicDetailsUpdate, 'timesListened' | 'byHeart'>,
    revert: () => void
  ): Promise<void> {
    const music = this.music();
    const userId = this.currentUserId();
    if (!this.canEditQuotes()) {
      revert();
      return Promise.resolve();
    }

    const run = this.saveQueue.then(async () => {
      this.isSaving.set(true);
      this.saveError.set(false);
      try {
        const saved = await saveMusicDetails({
          userId,
          title: music.title,
          artist: music.artist,
          ...patch,
        });
        if (!saved) {
          revert();
          this.saveError.set(true);
          return;
        }
        this.musicUpdated.emit({
          title: music.title,
          artist: music.artist,
          ...patch,
        });
      } catch {
        revert();
        this.saveError.set(true);
      } finally {
        this.isSaving.set(false);
      }
    });
    this.saveQueue = run.then(
      () => undefined,
      () => undefined
    );
    return run;
  }

  openQuotesEditor(): void {
    const music = this.music();
    const userId = this.currentUserId();
    const dialogRef = this.dialog.open(MusicQuotesModalComponent, {
      data: {
        title: music.title,
        artist: music.artist,
        quotes: music.quotes ?? [],
        userId,
      },
      width: 'min(560px, 95vw)',
    });
    dialogRef.afterClosed().subscribe((result?: MusicQuotesModalResult) => {
      if (!result) {
        return;
      }
      this.quotesUpdated.emit({
        title: music.title,
        artist: music.artist,
        quotes: result.quotes,
      });
    });
  }

  private currentUserId(): string {
    let route: ActivatedRoute | null = this.activatedRoute;
    while (route) {
      const id = route.snapshot.params['id'];
      if (typeof id === 'string' && id) {
        return id;
      }
      route = route.parent;
    }
    return DEFAULT_USER_ID;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
  }
}
