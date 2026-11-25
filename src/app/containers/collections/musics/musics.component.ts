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
import { SortOption } from '../../../components/shared/sort-dropdown/sort-dropdown.component';
import {
  StatItem,
  StatItemColor,
} from '../../../components/shared/stats-display/stats-display.component';
import { MusicsHeaderComponent } from './musics-header/musics-header.component';
import {
  AlbumModalComponent,
  Album,
  MusicDetailsUpdate,
} from '../../../components/modals/album-modal/album-modal.component';
import { Music } from '../../../models/music-model';
import type { EntityQuote } from '../../../models/entity-quote.model';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { ActivatedRoute, Router } from '@angular/router';
import {
  getAllBaseMusics,
  getAllMusics,
} from '../../../facades/musics/musics.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
  defaultMusicFilter,
  getSortedMusics,
  sortAlbumTracks,
  MIN_SONGS_PER_ALBUM,
  TIMES_LISTENED_FOR_POPULAR,
  musicFilterOptions,
  musicSortOptions,
  musicViewOptions,
} from './musics.utils';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { AuthService } from '../../../core/auth.service';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';
import { MobileCollectionPickerComponent } from '../../../components/shared/mobile-collection-picker/mobile-collection-picker.component';
import { pickMobileViewCovers } from '../../../utils/mobile-view-previews';

@Component({
  selector: 'app-musics',
  imports: [
    CommonModule,
    FormsModule,
    MusicComponent,
    MenuComponent,
    AlbumModalComponent,
    MusicsHeaderComponent,
    LoaderComponent,
    MobileCollectionPickerComponent,
  ],
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
})
export class MusicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private isLoadingPreferences = false;
  private readonly viewPreferencesStorageKey = 'musics_view_preferences';

  selectedSort = signal<string>('rating');
  selectedViewMode = signal<string>('albums'); // 'albums' ou 'all'
  mobileSelectedView = signal(false);
  selectedFilter = signal<string>('all');
  /** Filtre déjà enregistré par l'utilisateur, avant le choix automatique. */
  private storedFilter: string | null = null;
  onlyByHeart = signal(false);
  searchTerm = signal<string>('');

  // Modal d'album
  isAlbumModalOpen = signal<boolean>(false);
  selectedAlbum = signal<Album | null>(null);

  filterOptions = musicFilterOptions;

  sortOptions: SortOption[] = musicSortOptions;

  viewOptions: { value: string; label: string }[] = musicViewOptions;

  /** True tant que les musiques n'ont pas été chargées une première fois. */
  isLoadingMusics = signal<boolean>(true);

  musicsList = signal<{ [key: string]: Music[] }>({});

  constructor() {
    effect(() => {
      if (this.isLoadingPreferences) return;
      const preferences = {
        viewMode: this.selectedViewMode(),
        filter: this.selectedFilter(),
        sort: this.selectedSort(),
        onlyByHeart: this.onlyByHeart(),
      };
      this.localStorageService.setItem(
        this.viewPreferencesStorageKey,
        preferences
      );
    });
  }

  allMusics = computed<Music[]>(() => {
    return this.musicsList()[this.getActiveUserId()] || [];
  });

  /** True si l'utilisateur a des musiques (affiche stats, filtres, recherche). */
  showFiltersAndSearch = computed(() => this.allMusics().length > 0);

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

    if (this.onlyByHeart()) {
      filtered = filtered.filter((music) => music.byHeart);
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
        const allAlbumMusics = allAlbumsMap.get(key)!;
        const displayedMusics = this.onlyByHeart()
          ? filteredMusics
          : allAlbumMusics;
        const [albumName, artist] = key.split('|');
        albums.push({
          name: albumName,
          artist: artist,
          coverUrl: displayedMusics[0].coverUrl,
          musics: sortAlbumTracks(displayedMusics),
          totalDuration: displayedMusics.reduce(
            (sum, music) => sum + music.duration,
            0
          ),
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
        onlyByHeart: boolean;
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
      this.storedFilter = parsed.filter;
      this.selectedFilter.set(parsed.filter);
    }
    if (
      parsed.sort &&
      this.sortOptions.some((opt) => opt.value === parsed.sort)
    ) {
      this.selectedSort.set(parsed.sort);
    }
    if (typeof parsed.onlyByHeart === 'boolean') {
      this.onlyByHeart.set(parsed.onlyByHeart);
    }
    this.isLoadingPreferences = false;
  }

  ngOnInit() {
    this.loadViewPreferencesFromStorage();
    void this.refreshMusics();
  }

  async refreshMusics() {
    this.isLoadingMusics.set(true);
    try {
      const userId = this.getActiveUserId();
      const musics = await getAllMusics(userId);
      this.musicsList.set(musics);

      const currentUserMusics = musics[userId] || [];
      const defaultFilter = defaultMusicFilter(currentUserMusics);
      const keepStoredFilter =
        this.storedFilter !== null &&
        !(this.storedFilter === 'popular' && defaultFilter === 'all');
      if (!keepStoredFilter) {
        this.selectedFilter.set(defaultFilter);
      }
    } finally {
      this.isLoadingMusics.set(false);
    }
  }

  onSortChange(sortValue: string) {
    this.selectedSort.set(sortValue);
  }

  isMobile(): boolean {
    return window.innerWidth < 768;
  }

  onMobileSelectView(view: string): void {
    this.mobileSelectedView.set(true);
    this.onViewModeChange(view);
  }

  onMobileBack(): void {
    this.mobileSelectedView.set(false);
  }

  mobileViewPreviews = computed(() =>
    pickMobileViewCovers(this.viewOptions, (view) => {
      if (view === 'albums') {
        const seen = new Set<string>();
        const albums: { key: string; coverUrl: string; title: string }[] = [];
        for (const music of this.allMusics()) {
          const key = `${music.album}|${music.artist}`;
          if (seen.has(key)) continue;
          seen.add(key);
          albums.push({
            key,
            coverUrl: music.coverUrl,
            title: music.album || music.title,
          });
        }
        return albums;
      }
      return this.allMusics().map((music) => ({
        key: `${music.title}|${music.artist}`,
        coverUrl: music.coverUrl,
        title: music.title,
      }));
    })
  );

  onViewModeChange(viewMode: string) {
    this.selectedViewMode.set(viewMode);
    this.selectedFilter.set(defaultMusicFilter(this.allMusics()));
  }

  onFilterChange(filter: string) {
    this.selectedFilter.set(filter);
  }

  onOnlyByHeartChange(onlyByHeart: boolean) {
    this.onlyByHeart.set(onlyByHeart);
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  getActiveUserId(): string {
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

  activeUserId(): string {
    return this.getActiveUserId();
  }

  canEditQuotes(): boolean {
    return this.authService.canEdit(this.getActiveUserId());
  }

  onMusicQuotesUpdated(update: {
    title: string;
    artist: string;
    quotes: EntityQuote[];
  }): void {
    const userId = this.getActiveUserId();
    this.musicsList.update((list) => {
      const current = list[userId] ?? [];
      return {
        ...list,
        [userId]: current.map((music) =>
          music.title === update.title && music.artist === update.artist
            ? { ...music, quotes: update.quotes }
            : music
        ),
      };
    });
    const album = this.selectedAlbum();
    if (!album) {
      return;
    }
    this.selectedAlbum.set({
      ...album,
      musics: album.musics.map((music) =>
        music.title === update.title && music.artist === update.artist
          ? { ...music, quotes: update.quotes }
          : music
      ),
    });
  }

  onMusicDetailsUpdated(update: MusicDetailsUpdate): void {
    const apply = (music: Music): Music =>
      music.title === update.title && music.artist === update.artist
        ? {
            ...music,
            ...(update.timesListened !== undefined
              ? { timesListened: update.timesListened }
              : {}),
            ...(update.byHeart !== undefined
              ? { byHeart: update.byHeart }
              : {}),
          }
        : music;

    const userId = this.getActiveUserId();
    this.musicsList.update((list) => {
      const current = list[userId] ?? [];
      return {
        ...list,
        [userId]: current.map(apply),
      };
    });
    const album = this.selectedAlbum();
    if (!album) {
      return;
    }
    this.selectedAlbum.set({
      ...album,
      musics: album.musics.map(apply),
    });
  }

  private matchesSearch(music: Music, term: string): boolean {
    const haystack = [
      music.title,
      music.artist,
      music.album,
      music.genre,
      ...(music.quotes ?? []),
    ]
      .filter(Boolean)
      .join(' ');

    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }
}
