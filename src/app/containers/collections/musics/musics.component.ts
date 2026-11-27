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
  AlbumRatingUpdate,
  AlbumTrackRow,
  MusicDetailsUpdate,
} from '../../../components/modals/album-modal/album-modal.component';
import {
  BaseMusic,
  Music,
  UserAlbum,
} from '../../../models/music-model';
import type { EntityQuote } from '../../../models/entity-quote.model';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  getAllBaseMusics,
  getAllMusics,
} from '../../../facades/musics/musics.facade';
import {
  addExistingMusics,
  fetchUserAlbumNotes,
  fetchUserAlbumsToListen,
  removeAlbumToListen,
  saveAlbumNote,
  saveMusicDetails,
} from '../../../facades/musics/api-musics.facade';
import { LocalStorageService } from '../../../services/local-storage.service';
import {
  albumReleaseYear,
  defaultMusicFilter,
  getSortedMusics,
  sortAlbumTracks,
  MIN_SONGS_PER_ALBUM,
  ownsAlbumMajority,
  TIMES_LISTENED_FOR_POPULAR,
  musicFilterOptions,
  musicSortOptions,
  musicViewOptions,
} from './musics.utils';
import { DEFAULT_USER_ID } from '../../../utils/constants';
import { AuthService } from '../../../core/auth.service';
import { CanEditDirective } from '../../../directives/can-edit.directive';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';
import { MobileCollectionPickerComponent } from '../../../components/shared/mobile-collection-picker/mobile-collection-picker.component';
import { RatingStarsComponent } from '../../../components/shared/rating-stars/rating-stars.component';
import { PersonBadgeComponent } from '../../../components/shared/person-badge/person-badge.component';
import { PersonNamesPipe } from '../../../components/shared/person-badge/person-names.pipe';
import { pickMobileViewCovers } from '../../../utils/mobile-view-previews';
import {
  MoveEntityReviewModalComponent,
  MoveEntityReviewModalResult,
} from '../../../components/modals/move-entity-review-modal/move-entity-review-modal.component';

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
    RouterLink,
    CanEditDirective,
    MatDialogModule,
    RatingStarsComponent,
    PersonBadgeComponent,
    PersonNamesPipe,
  ],
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss'],
})
export class MusicsComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly dialog = inject(MatDialog);
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
  listeningAlbumKey = signal<string | null>(null);
  listenAlbumErrorKey = signal<string | null>(null);

  // Modal d'album
  isAlbumModalOpen = signal<boolean>(false);
  selectedAlbum = signal<Album | null>(null);
  albumNotes = signal<UserAlbum[]>([]);
  albumsToListen = signal<UserAlbum[]>([]);
  baseMusics = signal<BaseMusic[]>([]);
  readonly pendingAlbumRatings = signal<Record<string, number>>({});
  readonly albumSaveErrorKey = signal<string | null>(null);
  private albumSaveQueue: Promise<void> = Promise.resolve();

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

  /** Titres du catalogue, indexés par « album|artiste ». */
  catalogAlbumTitles = computed(() => {
    const byAlbum = new Map<string, Set<string>>();
    for (const music of this.baseMusics()) {
      if (!music.album || music.album === 'Unknown') continue;
      const key = `${music.album}|${music.artist}`;
      let titles = byAlbum.get(key);
      if (!titles) {
        titles = new Set();
        byAlbum.set(key, titles);
      }
      titles.add(music.title);
    }
    return byAlbum;
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
    const catalog = this.catalogAlbumTitles();

    filteredAlbumsMap.forEach((filteredMusics, key) => {
      const catalogTitles = catalog.get(key);
      const allAlbumMusics = allAlbumsMap.get(key);
      if (!catalogTitles?.size || !allAlbumMusics || key.includes('Unknown')) {
        return;
      }
      const ownedTitles = new Set(allAlbumMusics.map((music) => music.title));
      let owned = 0;
      catalogTitles.forEach((title) => {
        if (ownedTitles.has(title)) owned++;
      });
      if (!ownsAlbumMajority(owned, catalogTitles.size)) {
        return;
      }
      const displayedMusics = this.onlyByHeart()
        ? filteredMusics
        : allAlbumMusics;
      if (displayedMusics.length < MIN_SONGS_PER_ALBUM) {
        return;
      }
      const [albumName, artist] = key.split('|');
      const note = this.albumNotes().find(
        (item) => item.album === albumName && item.artist === artist
      );
      albums.push({
        name: albumName,
        artist: artist,
        coverUrl: displayedMusics[0].coverUrl,
        musics: sortAlbumTracks(displayedMusics),
        totalDuration: displayedMusics.reduce(
          (sum, music) => sum + music.duration,
          0
        ),
        releaseYear: albumReleaseYear(
          allAlbumMusics.map((music) => music.releaseDate)
        ),
        rating: note?.rating ?? 0,
        favorite: note?.favorite === true,
        lastListenedDate: note?.lastListenedDate ?? null,
      });
    });

    // Tri par artiste, puis par date de sortie (du plus ancien au plus récent)
    return albums.sort((a, b) => {
      const artistCompare = a.artist.localeCompare(b.artist);
      if (artistCompare !== 0) {
        return artistCompare;
      }
      return (a.releaseYear ?? 0) - (b.releaseYear ?? 0);
    });
  });

  favoriteAlbums = computed<Album[]>(() =>
    this.completeAlbums()
      .filter((album) => album.favorite)
      .sort((a, b) => {
        const aRated = a.rating > 0;
        const bRated = b.rating > 0;
        if (aRated && bRated && a.rating !== b.rating) {
          return b.rating - a.rating;
        }
        if (aRated !== bRated) {
          return aRated ? -1 : 1;
        }
        const artistCompare = a.artist.localeCompare(b.artist);
        if (artistCompare !== 0) {
          return artistCompare;
        }
        return (a.releaseYear ?? 0) - (b.releaseYear ?? 0);
      })
  );

  otherAlbums = computed<Album[]>(() =>
    this.completeAlbums().filter((album) => !album.favorite)
  );

  listenAlbums = computed(() => {
    const byAlbum = new Map<string, BaseMusic[]>();
    for (const music of this.baseMusics()) {
      if (!music.album || music.album === 'Unknown') continue;
      const key = `${music.album}|${music.artist}`;
      const tracks = byAlbum.get(key);
      if (tracks) {
        tracks.push(music);
      } else {
        byAlbum.set(key, [music]);
      }
    }

    return this.albumsToListen()
      .map((item) => {
        const tracks = byAlbum.get(`${item.album}|${item.artist}`) ?? [];
        const cover =
          tracks.find((music) => this.hasCatalogCover(music.coverUrl))
            ?.coverUrl ??
          tracks[0]?.coverUrl ??
          '';
        return {
          name: item.album,
          artist: item.artist,
          coverUrl: cover,
          trackCount: tracks.length,
          totalDuration: tracks.reduce(
            (sum, music) => sum + (music.duration || 0),
            0
          ),
          releaseYear: albumReleaseYear(tracks.map((music) => music.releaseDate)),
        };
      })
      .sort((a, b) => {
        const artistCompare = a.artist.localeCompare(b.artist);
        if (artistCompare !== 0) return artistCompare;
        return a.name.localeCompare(b.name);
      });
  });

  filteredAlbumsToListen = computed(() => {
    const term = normalizeSearchText(this.searchTerm().trim());
    const albums = this.listenAlbums();
    if (!term) return albums;
    return albums.filter(
      (album) =>
        normalizeSearchText(album.name).includes(term) ||
        normalizeSearchText(album.artist).includes(term)
    );
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
    if (this.selectedViewMode() === 'toListen') {
      const totalSeconds = this.listenAlbums().reduce(
        (sum, album) => sum + album.totalDuration,
        0
      );
      return [
        {
          label: 'Temps total pour écouter les albums',
          value: this.formatDurationFromSeconds(totalSeconds),
          icon: '🎧',
          color: StatItemColor.PRIMARY,
        },
      ];
    }

    return [
      {
        label: 'Durée totale de toutes les musiques',
        value: this.calculateTotalDuration(),
        icon: '🎵',
        color: StatItemColor.SUCCESS,
      },
      {
        label: 'Temps total passé en écoute',
        value: this.calculateTotalListeningTime(),
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
    this.isLoadingPreferences = true;
    if (parsed && typeof parsed === 'object') {
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
    }
    const view = this.activatedRoute.snapshot.queryParams['view'];
    if (
      typeof view === 'string' &&
      this.viewOptions.some((opt) => opt.value === view)
    ) {
      this.selectedViewMode.set(view);
    }
    this.isLoadingPreferences = false;
  }

  ngOnInit() {
    this.loadViewPreferencesFromStorage();
    void this.refreshMusics();
  }

  async refreshMusics(silent = false) {
    if (!silent) {
      this.isLoadingMusics.set(true);
    }
    try {
      const userId = this.getActiveUserId();
      const [musics, notes, toListen, baseMusics] = await Promise.all([
        getAllMusics(userId),
        fetchUserAlbumNotes(userId).catch(() => [] as UserAlbum[]),
        fetchUserAlbumsToListen(userId).catch(() => [] as UserAlbum[]),
        getAllBaseMusics(),
      ]);
      this.musicsList.set(musics);
      this.albumNotes.set(notes);
      this.albumsToListen.set(toListen);
      this.baseMusics.set(baseMusics);

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
      if (view === 'toListen') {
        return this.listenAlbums().map((album) => ({
          key: `${album.name}|${album.artist}`,
          coverUrl: album.coverUrl,
          title: album.name,
        }));
      }
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

  getSelectMusicsRoute(): string {
    let route: ActivatedRoute | null = this.activatedRoute;
    while (route) {
      const id = route.snapshot.params['id'];
      if (typeof id === 'string' && id) {
        return `/${id}/select-musics`;
      }
      route = route.parent;
    }
    return '/select-musics';
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
    return this.formatDurationFromSeconds(totalSeconds);
  }

  private calculateTotalListeningTime(): string {
    const totalSeconds = this.allMusics().reduce(
      (sum, music) => sum + music.duration * music.timesListened,
      0
    );
    return this.formatDurationFromSeconds(totalSeconds);
  }

  private formatDurationFromSeconds(totalSeconds: number): string {
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    let formatted = '';
    if (days > 0) {
      formatted += days === 1 ? '1 jour' : `${days} jours`;
    }
    if (hours > 0) formatted += (formatted ? ', ' : '') + `${hours}h`;
    if (minutes > 0) formatted += (formatted ? ' ' : '') + `${minutes}min`;
    if (!formatted) formatted = '0min';
    return formatted;
  }

  async onRemoveAlbumToListen(
    album: { name: string; artist: string },
    event: Event
  ): Promise<void> {
    event.stopPropagation();
    if (!this.canEditQuotes()) return;
    const removed = await removeAlbumToListen({
      userId: this.getActiveUserId(),
      artist: album.artist,
      album: album.name,
    });
    if (!removed) return;
    this.albumsToListen.update((albums) =>
      albums.filter(
        (item) => !(item.artist === album.artist && item.album === album.name)
      )
    );
  }

  onAlbumListened(
    album: { name: string; artist: string },
    event: Event
  ): void {
    event.stopPropagation();
    if (!this.canEditQuotes() || this.listeningAlbumKey()) return;
    const note = this.albumNotes().find(
      (item) => item.album === album.name && item.artist === album.artist
    );
    const dialogRef = this.dialog.open<
      MoveEntityReviewModalComponent,
      { entityTitle: string; hideComment: boolean; initialRating?: number },
      MoveEntityReviewModalResult | undefined
    >(MoveEntityReviewModalComponent, {
      data: {
        entityTitle: `${album.artist} — ${album.name}`,
        hideComment: true,
        initialRating: note?.rating ?? 0,
      },
      width: 'auto',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === undefined) return;
      void this.markAlbumAsListened(album, result.rating);
    });
  }

  private async markAlbumAsListened(
    album: { name: string; artist: string },
    rating: number
  ): Promise<void> {
    const key = this.albumKey(album);
    this.listeningAlbumKey.set(key);
    this.listenAlbumErrorKey.set(null);
    const userId = this.getActiveUserId();
    const catalog = this.baseMusics().filter(
      (music) => music.album === album.name && music.artist === album.artist
    );
    const owned = this.allMusics().filter(
      (music) => music.album === album.name && music.artist === album.artist
    );
    const ownedIds = new Set(
      owned.map((music) => `${music.title}|${music.artist}`)
    );
    const missing = catalog.filter(
      (music) => !ownedIds.has(`${music.title}|${music.artist}`)
    );

    if (missing.length > 0) {
      const added = await addExistingMusics({
        userId,
        musics: missing.map((music) => ({
          title: music.title,
          artist: music.artist,
        })),
      });
      if (!added) {
        this.listeningAlbumKey.set(null);
        this.listenAlbumErrorKey.set(key);
        return;
      }
    }

    const incremented = await Promise.all(
      owned.map((music) =>
        saveMusicDetails({
          userId,
          title: music.title,
          artist: music.artist,
          timesListened: music.timesListened + 1,
        })
      )
    );
    if (incremented.some((ok) => !ok)) {
      this.listeningAlbumKey.set(null);
      this.listenAlbumErrorKey.set(key);
      await this.refreshMusics(true);
      return;
    }

    const saved = await saveAlbumNote({
      userId,
      artist: album.artist,
      album: album.name,
      ...(rating > 0 ? { rating } : {}),
      markListened: true,
    });
    this.listeningAlbumKey.set(null);
    if (!saved) {
      this.listenAlbumErrorKey.set(key);
    }
    await this.refreshMusics(true);
  }

  private hasCatalogCover(coverUrl: string): boolean {
    const normalized = coverUrl?.toLowerCase() ?? '';
    return (
      !!normalized &&
      !normalized.includes('default') &&
      !normalized.includes('placeholder')
    );
  }

  formatAlbumDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  }

  favoriteSongs = computed<Music[]>(() =>
    this.sortLooseMusics(
      this.filteredMusics().filter((music) => music.favorite === true)
    )
  );

  otherStandaloneMusics = computed<Music[]>(() =>
    this.sortLooseMusics(
      this.standaloneMusics().filter((music) => music.favorite !== true)
    )
  );

  private sortLooseMusics(musics: Music[]): Music[] {
    const maxListensByArtist = new Map<string, number>();
    for (const music of musics) {
      const current = maxListensByArtist.get(music.artist) ?? 0;
      if (music.timesListened > current) {
        maxListensByArtist.set(music.artist, music.timesListened);
      }
    }
    return [...musics].sort((a, b) => {
      const listens =
        (maxListensByArtist.get(b.artist) ?? 0) -
        (maxListensByArtist.get(a.artist) ?? 0);
      if (listens !== 0) return listens;
      const artist = a.artist.localeCompare(b.artist, 'fr', {
        sensitivity: 'base',
      });
      if (artist !== 0) return artist;
      const album = a.album.localeCompare(b.album, 'fr', {
        sensitivity: 'base',
      });
      if (album !== 0) return album;
      const aTrack = a.albumTrackId ?? 0;
      const bTrack = b.albumTrackId ?? 0;
      if (aTrack !== bTrack) {
        if (aTrack === 0) return 1;
        if (bTrack === 0) return -1;
        return aTrack - bTrack;
      }
      return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
    });
  }

  hasCatalogAlbum(music: Music): boolean {
    if (!music.album || music.album === 'Unknown') {
      return false;
    }
    return this.catalogAlbumTitles().has(`${music.album}|${music.artist}`);
  }

  openStandaloneAlbum(music: Music): void {
    if (!this.hasCatalogAlbum(music)) {
      return;
    }
    const key = `${music.album}|${music.artist}`;
    const catalog = sortAlbumTracks(
      this.baseMusics().filter(
        (item) => `${item.album}|${item.artist}` === key
      )
    );
    const owned = sortAlbumTracks(
      this.allMusics().filter(
        (item) => `${item.album}|${item.artist}` === key
      )
    );
    const coverSource = catalog.length > 0 ? catalog : owned;
    const note = this.albumNotes().find(
      (item) => item.album === music.album && item.artist === music.artist
    );
    this.openAlbumModal({
      name: music.album,
      artist: music.artist,
      coverUrl:
        coverSource.find((item) => this.hasCatalogCover(item.coverUrl))
          ?.coverUrl || music.coverUrl,
      musics: owned,
      totalDuration: owned.reduce(
        (sum, item) => sum + (item.duration || 0),
        0
      ),
      releaseYear: albumReleaseYear(
        coverSource.map((item) => item.releaseDate)
      ),
      rating: note?.rating ?? 0,
      favorite: note?.favorite === true,
      lastListenedDate: note?.lastListenedDate ?? null,
    });
  }

  openAlbumTracks = computed((): AlbumTrackRow[] => {
    const album = this.selectedAlbum();
    if (!album) {
      return [];
    }
    const key = `${album.name}|${album.artist}`;
    const owned = new Map<string, Music>();
    for (const music of this.allMusics()) {
      if (`${music.album}|${music.artist}` !== key) {
        continue;
      }
      owned.set(`${music.title}|${music.artist}`, music);
    }
    const seen = new Set<string>();
    const rows: Array<{
      title: string;
      artist: string;
      duration: number;
      albumTrackId: number;
      music: Music | null;
    }> = [];
    for (const base of this.baseMusics()) {
      if (`${base.album}|${base.artist}` !== key) {
        continue;
      }
      const id = `${base.title}|${base.artist}`;
      seen.add(id);
      const music = owned.get(id) ?? null;
      rows.push({
        title: base.title,
        artist: base.artist,
        duration: music?.duration || base.duration,
        albumTrackId: music?.albumTrackId || base.albumTrackId,
        music,
      });
    }
    for (const music of owned.values()) {
      const id = `${music.title}|${music.artist}`;
      if (seen.has(id)) {
        continue;
      }
      rows.push({
        title: music.title,
        artist: music.artist,
        duration: music.duration,
        albumTrackId: music.albumTrackId ?? 0,
        music,
      });
    }
    return sortAlbumTracks(rows).map((row, index) => ({
      key: `${row.title}|${row.artist}`,
      title: row.title,
      artist: row.artist,
      duration: row.duration,
      number: row.albumTrackId > 0 ? row.albumTrackId : index + 1,
      music: row.music,
    }));
  });

  openListenAlbum(album: {
    name: string;
    artist: string;
    coverUrl: string;
    totalDuration: number;
    releaseYear: number | null;
  }): void {
    const key = `${album.name}|${album.artist}`;
    const owned = sortAlbumTracks(
      this.allMusics().filter(
        (music) => `${music.album}|${music.artist}` === key
      )
    );
    const note = this.albumNotes().find(
      (item) => item.album === album.name && item.artist === album.artist
    );
    this.openAlbumModal({
      name: album.name,
      artist: album.artist,
      coverUrl: album.coverUrl,
      musics: owned,
      totalDuration: album.totalDuration,
      releaseYear: album.releaseYear,
      rating: note?.rating ?? 0,
      favorite: note?.favorite === true,
      lastListenedDate: note?.lastListenedDate ?? null,
    });
  }

  openAlbumModal(album: Album) {
    this.selectedAlbum.set(album);
    this.isAlbumModalOpen.set(true);
  }

  closeAlbumModal() {
    this.isAlbumModalOpen.set(false);
    this.selectedAlbum.set(null);
  }

  async onAlbumTracksAdded(): Promise<void> {
    await this.refreshMusics();
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
            ...(update.rating !== undefined ? { rating: update.rating } : {}),
            ...(update.favorite !== undefined
              ? { favorite: update.favorite }
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

  albumKey(album: Pick<Album, 'artist' | 'name'>): string {
    return `${album.artist}|${album.name}`;
  }

  albumRating(album: Album): number {
    const pending = this.pendingAlbumRatings()[this.albumKey(album)];
    return pending ?? album.rating;
  }

  onAlbumCardFavoriteToggle(album: Album, event: Event): void {
    event.stopPropagation();
    if (!this.canEditQuotes()) {
      return;
    }
    const favorite = !album.favorite;
    const key = this.albumKey(album);
    this.albumSaveErrorKey.set(null);
    this.onAlbumRatingUpdated({
      artist: album.artist,
      album: album.name,
      favorite,
    });
    const run = this.albumSaveQueue.then(async () => {
      const saved = await saveAlbumNote({
        userId: this.getActiveUserId(),
        artist: album.artist,
        album: album.name,
        favorite,
      });
      const current = this.albumNotes().find(
        (note) => note.artist === album.artist && note.album === album.name
      );
      if (!saved) {
        if (current?.favorite === favorite) {
          this.onAlbumRatingUpdated({
            artist: album.artist,
            album: album.name,
            favorite: !favorite,
          });
        }
        this.albumSaveErrorKey.set(key);
      }
    });
    this.albumSaveQueue = run.then(
      () => undefined,
      () => undefined
    );
  }

  onAlbumCardRatingChange(album: Album, rating: number): void {
    if (!this.canEditQuotes() || rating === this.albumRating(album)) {
      return;
    }
    const key = this.albumKey(album);
    this.pendingAlbumRatings.update((ratings) => ({
      ...ratings,
      [key]: rating,
    }));
    this.albumSaveErrorKey.set(null);
    const run = this.albumSaveQueue.then(async () => {
      const saved = await saveAlbumNote({
        userId: this.getActiveUserId(),
        artist: album.artist,
        album: album.name,
        rating,
      });
      const stillCurrent = this.pendingAlbumRatings()[key] === rating;
      if (!saved) {
        if (stillCurrent) {
          this.pendingAlbumRatings.update((ratings) => {
            const next = { ...ratings };
            delete next[key];
            return next;
          });
        }
        this.albumSaveErrorKey.set(key);
        return;
      }
      this.onAlbumRatingUpdated({
        artist: album.artist,
        album: album.name,
        rating,
      });
      if (stillCurrent) {
        this.pendingAlbumRatings.update((ratings) => {
          const next = { ...ratings };
          delete next[key];
          return next;
        });
      }
    });
    this.albumSaveQueue = run.then(
      () => undefined,
      () => undefined
    );
  }

  onAlbumRatingUpdated(update: AlbumRatingUpdate): void {
    this.albumNotes.update((notes) => {
      const index = notes.findIndex(
        (note) => note.artist === update.artist && note.album === update.album
      );
      const next: UserAlbum =
        index === -1
          ? {
              artist: update.artist,
              album: update.album,
              rating: update.rating ?? 0,
              favorite: update.favorite ?? false,
              toListen: false,
              lastListenedDate: null,
            }
          : {
              ...notes[index],
              ...(update.rating !== undefined
                ? { rating: update.rating }
                : {}),
              ...(update.favorite !== undefined
                ? { favorite: update.favorite }
                : {}),
            };
      if (index === -1) {
        return [...notes, next];
      }
      return notes.map((note, noteIndex) =>
        noteIndex === index ? next : note
      );
    });
    const album = this.selectedAlbum();
    if (
      album &&
      album.artist === update.artist &&
      album.name === update.album
    ) {
      this.selectedAlbum.set({
        ...album,
        ...(update.rating !== undefined ? { rating: update.rating } : {}),
        ...(update.favorite !== undefined
          ? { favorite: update.favorite }
          : {}),
      });
    }
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
