import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MusicComponent } from '../../../components/collections/music/music.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { SortOption } from '../../../components/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/stats-display/stats-display.component';
import { MusicsHeaderComponent } from './musics-header/musics-header.component';
import {
  AlbumModalComponent,
  Album,
} from '../../../components/album-modal/album-modal.component';
import { Music } from '../../../models/music-model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  getAllBaseMusics,
  getAllMusics,
} from '../../../facades/musics/musics.facade';
import { AuthService } from '../../../core/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
  getSortedMusics,
  MIN_SONGS_PER_ALBUM,
  TIMES_LISTENED_FOR_POPULAR,
  musicFilterOptions,
  musicSortOptions,
  musicViewOptions,
} from './musics.utils';

@Component({
  selector: 'app-musics',
  imports: [
    CommonModule,
    FormsModule,
    MusicComponent,
    MenuComponent,
    AlbumModalComponent,
    MusicsHeaderComponent,
  ],
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
})
export class MusicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'musics_view_preferences';

  selectedSort = signal<string>('rating');
  selectedViewMode = signal<string>('albums'); // 'albums' ou 'all'
  selectedFilter = signal<string>('popular'); // 'all' ou 'popular'
  searchTerm = signal<string>('');

  // Modal d'album
  isAlbumModalOpen = signal<boolean>(false);
  selectedAlbum = signal<Album | null>(null);

  filterOptions = musicFilterOptions;

  sortOptions: SortOption[] = musicSortOptions;

  viewOptions: { value: string; label: string }[] = musicViewOptions;

  musicsList = signal<{ [key: string]: Music[] }>({});
  adminMusicsList = signal<Music[]>([]);

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences || this.isAdminView()) return;
      const preferences = {
        viewMode: this.selectedViewMode(),
        filter: this.selectedFilter(),
        sort: this.selectedSort(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });
  }

  allMusics = computed<Music[]>(() => {
    if (this.isAdminView()) {
      return this.adminMusicsList();
    }
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam
      ? this.musicsList()[params['id']] || []
      : this.musicsList()['guillaume'];
  });

  // Musiques filtrées selon le filtre sélectionné
  filteredMusics = computed<Music[]>(() => {
    let filtered = [...this.allMusics()];

    if (this.selectedFilter() === 'popular') {
      filtered = filtered.filter(
        (music) => music.timesListened > TIMES_LISTENED_FOR_POPULAR
      );
    } else if (this.selectedFilter() === 'more_than_once') {
      filtered = filtered.filter((music) => music.timesListened > 1);
    }

    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return filtered;
    }

    return filtered.filter((music) => this.matchesSearch(music, term));
  });

  completeAlbums = computed<Album[]>(() => {
    // Grouper TOUTES les musiques par album
    const allAlbumsMap = new Map<string, Music[]>();
    this.allMusics().forEach((music) => {
      const key = `${music.album}|${music.artist}`;
      if (!allAlbumsMap.has(key)) {
        allAlbumsMap.set(key, []);
      }
      allAlbumsMap.get(key)!.push(music);
    });

    // Grouper les musiques filtrées par album pour déterminer quels albums afficher
    const filteredAlbumsMap = new Map<string, Music[]>();
    this.filteredMusics().forEach((music) => {
      const key = `${music.album}|${music.artist}`;
      if (!filteredAlbumsMap.has(key)) {
        filteredAlbumsMap.set(key, []);
      }
      filteredAlbumsMap.get(key)!.push(music);
    });

    const albums: Album[] = [];

    const minTimesListened =
      this.selectedFilter() === 'popular'
        ? TIMES_LISTENED_FOR_POPULAR
        : this.selectedFilter() === 'more_than_once'
        ? 1
        : 0;

    // Pour chaque album, vérifier si les musiques filtrées répondent aux critères
    filteredAlbumsMap.forEach((filteredMusics, key) => {
      if (
        !key.includes('Unknown') &&
        filteredMusics.length >= MIN_SONGS_PER_ALBUM &&
        filteredMusics.every((music) => music.timesListened > minTimesListened)
      ) {
        // Récupérer TOUTES les musiques de l'album (pas seulement les filtrées)
        const allAlbumMusics = allAlbumsMap.get(key)!;
        const [albumName, artist] = key.split('|');
        albums.push({
          name: albumName,
          artist: artist,
          coverUrl: allAlbumMusics[0].coverUrl,
          musics: allAlbumMusics.sort((a, b) => a.title.localeCompare(b.title)),
          totalDuration: allAlbumMusics.reduce((sum, m) => sum + m.duration, 0),
        });
      }
    });

    // Tri par artiste, puis par date de sortie (du plus ancien au plus récent)
    return albums.sort((a, b) => {
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) {
        return artistCompare;
      }
      // Tri par date de sortie pour les albums d'un même artiste
      const dateA = new Date(a.musics[0].releaseDate).getTime();
      const dateB = new Date(b.musics[0].releaseDate).getTime();
      return dateA - dateB;
    });
  });

  // Musiques qui ne font pas partie d'un album complet
  standaloneMusics = computed<Music[]>(() => {
    const completeAlbumNames = new Set(
      this.completeAlbums().map((album) => `${album.name}|${album.artist}`)
    );

    return this.filteredMusics().filter((music) => {
      const key = `${music.album}|${music.artist}`;
      return !completeAlbumNames.has(key);
    });
  });

  sortedMusics = computed<Music[]>(() =>
    getSortedMusics([...this.filteredMusics()], this.selectedSort())
  );

  stats = computed<StatItem[]>(() => {
    if (this.isAdminView()) {
      return [];
    }
    const totalDuration = this.calculateTotalDuration();
    const totalListeningTime = this.calculateTotalListeningTime();

    return [
      {
        label: 'Durée totale de toutes les musiques',
        value: totalDuration,
        icon: '🎵',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé en écoute',
        value: totalListeningTime,
        icon: '🎧',
        color: StatItemColor.PRIMARY,
      },
    ];
  });

  private loadViewPreferencesFromStorage(): void {
    const parsed = this.localStorageService.getItem<
      Partial<{
        viewMode: string;
        filter: string;
        sort: string;
      }>
    >(this.viewPreferencesStorageKey);
    if (!parsed || typeof parsed !== 'object') return;
    this.isLoadingPreferences = true;
    if (
      parsed.viewMode &&
      this.viewOptions.some((opt) => opt.value === parsed.viewMode)
    ) {
      this.selectedViewMode.set(parsed.viewMode);
    }
    if (
      parsed.filter &&
      this.filterOptions.some((opt) => opt.value === parsed.filter)
    ) {
      this.selectedFilter.set(parsed.filter);
    }
    if (
      parsed.sort &&
      this.sortOptions.some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    this.isLoadingPreferences = false;
  }

  ngOnInit() {
    this.loadViewPreferencesFromStorage();
    void this.refreshMusics();
  }

  async refreshMusics() {
    if (this.isAdminView()) {
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
      this.adminMusicsList.set(musics);
      return;
    }

    const userId = this.getActiveUserId();
    const musics = await getAllMusics(userId);
    this.musicsList.set(musics);

    const currentUserMusics = musics[userId] || [];
    if (
      this.selectedFilter() === 'popular' &&
      currentUserMusics.length > 0 &&
      !currentUserMusics.some(
        (music) => music.timesListened > TIMES_LISTENED_FOR_POPULAR
      )
    ) {
      this.selectedFilter.set('all');
    }
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  onViewModeChange(viewMode: string) {
    this.selectedViewMode.set(viewMode);
    // Changer le filtre par défaut selon le mode de vue
    if (viewMode === 'albums') {
      this.selectedFilter.set('popular');
    } else {
      this.selectedFilter.set('popular');
    }
  }

  onFilterChange(filter: string) {
    this.selectedFilter.set(filter);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  private getActiveUserId(): string {
    const params: Params = this.activatedRoute.snapshot.params;
    return params['id'] ?? 'guillaume';
  }

  private calculateTotalDuration(): string {
    const totalSeconds = this.allMusics().reduce(
      (sum, music) => sum + music.duration,
      0
    );
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let formatted = '';
    if (days > 0) formatted += `${days} jours`;
    if (hours > 0) formatted += (formatted ? ', ' : '') + `${hours}h`;
    if (minutes > 0) formatted += (formatted ? ' ' : '') + `${minutes}min`;
    if (!formatted) formatted = '0min';
    return formatted;
  }

  private calculateTotalListeningTime(): string {
    const totalSeconds = this.allMusics().reduce(
      (sum, music) => sum + music.duration * music.timesListened,
      0
    );
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let formatted = '';
    if (days > 0) formatted += `${days} jours`;
    if (hours > 0) formatted += (formatted ? ', ' : '') + `${hours}h`;
    if (minutes > 0) formatted += (formatted ? ' ' : '') + `${minutes}min`;
    if (!formatted) formatted = '0min';
    return formatted;
  }

  formatAlbumDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  sortedStandaloneMusics = computed<Music[]>(() => {
    const sorted = [...this.standaloneMusics()];
    // Tri par nombre d'écoutes (du plus écouté au moins écouté)
    return sorted.sort((a, b) => b.timesListened - a.timesListened);
  });

  openAlbumModal(album: Album) {
    this.selectedAlbum.set(album);
    this.isAlbumModalOpen.set(true);
  }

  closeAlbumModal() {
    this.isAlbumModalOpen.set(false);
    this.selectedAlbum.set(null);
  }

  private matchesSearch(music: Music, term: string): boolean {
    const haystack = [music.title, music.artist, music.album, music.genre]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
