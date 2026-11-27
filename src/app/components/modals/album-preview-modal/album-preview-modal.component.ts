import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { PersonBadgeComponent } from '../../shared/person-badge/person-badge.component';
import { PersonNamesPipe } from '../../shared/person-badge/person-names.pipe';

export interface AlbumPreviewTrack {
  title: string;
  artist: string;
  selected: boolean;
  disabled: boolean;
}

export interface AlbumPreviewModel {
  album: string;
  artist: string;
  coverUrl: string;
  releaseYear: number | null;
  tracks: AlbumPreviewTrack[];
}

@Component({
  selector: 'app-album-preview-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PersonBadgeComponent, PersonNamesPipe],
  templateUrl: './album-preview-modal.component.html',
  styleUrls: ['./album-preview-modal.component.scss'],
})
export class AlbumPreviewModalComponent {
  album = input.required<AlbumPreviewModel>();
  tracklistOpen = input(false);
  primaryLabel = input("Sélectionner tout l'album");
  primaryDisabled = input(false);
  showPrimary = input(true);
  /** Cases par morceau. Désactivé quand seul l'album entier peut être choisi. */
  tracksSelectable = input(true);
  error = input<string | null>(null);

  closed = output<void>();
  tracklistToggled = output<void>();
  trackToggled = output<AlbumPreviewTrack>();
  primary = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }
}
