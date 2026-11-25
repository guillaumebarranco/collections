import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';

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
  tracks: AlbumPreviewTrack[];
}

@Component({
  selector: 'app-album-preview-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './album-preview-modal.component.html',
  styleUrls: ['./album-preview-modal.component.scss'],
})
export class AlbumPreviewModalComponent {
  album = input.required<AlbumPreviewModel>();
  tracklistOpen = input(false);
  primaryLabel = input("Sélectionner tout l'album");
  primaryDisabled = input(false);
  showPrimary = input(true);
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
