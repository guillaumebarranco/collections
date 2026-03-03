import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicComponent } from '../../../components/collections/music/music.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { AdminMusicsHeaderComponent } from './musics-header/musics-header.component';
import { Music } from '../../../models/music-model';
import { getAllBaseMusics } from '../../../facades/musics/musics.facade';
import { getSortedMusics } from '../../collections/musics/musics.utils';
import { normalizeSearchText } from '../../../utils/normalize-search-text';

@Component({
  selector: 'app-admin-musics',
  imports: [
    CommonModule,
    FormsModule,
    MusicComponent,
    MenuComponent,
    AdminMusicsHeaderComponent,
  ],
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMusicsComponent implements OnInit {
  searchTerm = signal<string>('');
  allMusics = signal<Music[]>([]);

  filteredMusics = computed<Music[]>(() => {
    const musics = this.allMusics();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return musics;
    return musics.filter((music) => this.matchesSearch(music, term));
  });

  sortedMusics = computed<Music[]>(() =>
    getSortedMusics([...this.filteredMusics()], 'title')
  );

  ngOnInit() {
    void this.refreshMusics();
  }

  async refreshMusics() {
    const baseMusics = await getAllBaseMusics();
    const musics = baseMusics.map((music) => ({
      title: music.title,
      artist: music.artist,
      rating: 0,
      timesListened: 0,
      album: music.album,
      coverUrl: music.coverUrl,
      releaseDate: music.releaseDate,
      duration: music.duration,
      genre: music.genre,
    }));
    this.allMusics.set(musics);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  private matchesSearch(music: Music, term: string): boolean {
    const haystack = [music.title, music.artist, music.album, music.genre]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

}
