import { Component, inject, input, output } from '@angular/core';
import { Music } from '../../../models/music-model';
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
  isBaseEntityView = isBaseEntityView();

  canEditQuotes(): boolean {
    if (this.isBaseEntityView) {
      return false;
    }
    return this.authService.canEdit(this.currentUserId());
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
