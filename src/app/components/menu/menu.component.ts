import {
  Component,
  OnInit,
  HostListener,
  inject,
  computed,
  effect,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/auth.service';
import { DEFAULT_USER_ID } from '../../utils/constants';
import { MenuConfigService } from '../../core/menu-config.service';
import { MenuConfigModalComponent } from '../modals/menu-config-modal/menu-config-modal.component';
import { ImpersonateService } from '../../services/impersonate.service';
import { ProfileBadgeService } from '../../services/profile-badge.service';
import { getBadgeDefinitionById } from '../../utils/users/badges';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  /** Premiers segments d’URL qui ne sont pas un profil `/:userId/...` (évite de confondre avec `:id` de routes internes). */
  private static readonly URL_FIRST_SEGMENT_NOT_USER_PROFILE = new Set([
    'admin',
    'movies',
    'series',
    'games',
    'comics',
    'bds',
    'manwhas',
    'musics',
    'adaptations',
    'quizzs',
    'entity-stats',
  ]);

  isMobile = false;
  isCompactMenu = false;
  isReadingMenuOpen = false;
  isScreenMenuOpen = false;
  isExtrasMenuOpen = false;
  isUserMenuOpen = false;

  router = inject(Router);
  authService = inject(AuthService);
  menuConfig = inject(MenuConfigService);
  impersonateService = inject(ImpersonateService);
  profileBadgeService = inject(ProfileBadgeService);
  private readonly dialog = inject(MatDialog);

  /**
   * `:id` utilisateur dans l’URL, mis à jour à chaque fin de navigation (reload + navigation interne).
   * Sans cela, les `computed` ne voient pas le changement d’URL (le Router n’est pas un signal).
   */
  private readonly routeUserId = signal<string | null>(
    this.getUserProfileIdFromUrl(this.router.url)
  );

  /** Utilisateur dont on affiche le contexte (impersonation ou route ou connecté). */
  effectiveUserId = computed(() => {
    const impersonated = this.impersonateService.impersonatedUserId();
    if (impersonated) return impersonated;
    const routeId = this.routeUserId();
    if (routeId) return routeId;
    const auth =
      this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    return auth ?? DEFAULT_USER_ID;
  });

  /** Bandeau : URL = profil Y alors que la session est X (y compris après F5 ; le signal d’impersonation seul est volatil). */
  showImpersonationBanner = computed(() => {
    const authRaw =
      this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    const auth = authRaw?.trim().toLowerCase() ?? '';
    const routeId = this.routeUserId()?.trim().toLowerCase() ?? '';
    if (!auth || !routeId) return false;
    return auth !== routeId;
  });

  currentUser = computed(() => {
    const uid = this.effectiveUserId();
    return uid ? this.capitalizeFirstLetter(uid) : '';
  });

  authenticatedUser = computed(() => {
    const userId = this.authService.userId();
    return userId ? this.capitalizeFirstLetter(userId) : '';
  });

  /** Image du badge choisi comme avatar (utilisateur connecté uniquement). */
  profileBadgeAvatarUrl = computed(() => {
    const uid = this.authService.userId();
    if (!uid) return null;
    this.profileBadgeService.cache();
    const badgeId = this.profileBadgeService.getProfileBadgeId(uid);
    if (!badgeId) return null;
    const def = getBadgeDefinitionById(badgeId);
    return def?.image ?? null;
  });

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  /** Retour sur son propre dashboard et arrêt de l'impersonation. */
  goToDashboard(): void {
    this.impersonateService.clearImpersonation();
    const authId =
      this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    const uid = authId ? String(authId).toLowerCase() : DEFAULT_USER_ID;
    this.router.navigate([`/${uid}/dashboard`]);
  }

  /** Vue admin : navigation explicite (fiable avec le menu utilisateur) + sortie d’impersonation. */
  goToAdmin(): void {
    this.closeUserMenu();
    this.impersonateService.clearImpersonation();
    void this.router.navigate(['/admin']);
  }

  menuItems = [
    { label: 'Home', icon: '📊', key: 'dashboard', hideOnMobile: false },
    { label: 'Livres', icon: '📚', key: 'books', hideOnMobile: false },
    { label: 'Films', icon: '🎬', key: 'movies', hideOnMobile: false },
    { label: 'Séries', icon: '📺', key: 'series', hideOnMobile: false },
    { label: 'Jeux', icon: '🎮', key: 'games', hideOnMobile: false },
    { label: 'Mangas', icon: '📖', key: 'mangas', hideOnMobile: false },
    { label: 'Manwhas', icon: '🎨', key: 'manwhas', hideOnMobile: true },
    { label: 'Comics', icon: '🦸', key: 'comics', hideOnMobile: false },
    { label: 'BD', icon: '📗', key: 'bds', hideOnMobile: false },
    { label: 'Musiques', icon: '🎵', key: 'musics', hideOnMobile: true },
    {
      label: 'Adaptations',
      icon: '🔀',
      key: 'adaptations',
      hideOnMobile: false,
      group: 'extras',
    },
    { label: 'Quizz', icon: '🎯', key: 'quizzs', hideOnMobile: false, group: 'extras' },
    {
      label: 'Records',
      icon: '🏆',
      key: 'records',
      hideOnMobile: false,
      group: 'extras',
    },
    {
      label: 'Statistiques des entités',
      icon: '📈',
      key: 'entity-stats',
      hideOnMobile: false,
      group: 'extras',
    },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        this.routeUserId.set(this.getUserProfileIdFromUrl(e.urlAfterRedirects));
      });

    effect(() => {
      const uid = this.authService.userId();
      if (uid) {
        void this.profileBadgeService.loadFromApi(uid);
      }
    });
  }

  ngOnInit() {
    this.checkScreenSize();
    this.profileBadgeService.loadFromStorage();
  }

  getRoute(route: string): string {
    const isAdminView = this.router.url.startsWith('/admin');
    if (isAdminView) {
      return route === 'dashboard' ? '/admin' : `/admin/${route}`;
    }
    const uid = this.effectiveUserId();
    return `/${uid}/${route}`;
  }

  /**
   * Identifiant de profil dans une URL du type `/:userId/dashboard`, jamais sous `/admin` ni
   * les routes catalogue / sélection (évite le premier `:id` ambigu de l’ActivatedRoute).
   */
  private getUserProfileIdFromUrl(routerUrl: string): string | null {
    const path = routerUrl.split('?')[0].replace(/#.*$/, '');
    const segments = path.split('/').filter(Boolean);
    const first = segments[0];
    if (!first) return null;
    const lower = first.toLowerCase();
    if (lower === 'admin') return null;
    if (MenuComponent.URL_FIRST_SEGMENT_NOT_USER_PROFILE.has(lower)) return null;
    if (lower.startsWith('select-')) return null;
    return first;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-user-group')) {
      this.closeUserMenu();
    }
    if (
      !target.closest('.menu-item-group') &&
      !target.closest('.menu-extras-group') &&
      !target.closest('.menu-screen-group')
    ) {
      this.closeReadingMenu();
      this.closeScreenMenu();
      this.closeExtrasMenu();
    }
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isCompactMenu = window.innerWidth < 1500;
    if (!this.isCompactMenu) {
      this.isReadingMenuOpen = false;
      this.isScreenMenuOpen = false;
      this.isExtrasMenuOpen = false;
    }
  }

  get visibleMenuItems() {
    this.menuConfig.enabledKeys(); // dépendance signal pour mise à jour après config
    return this.menuItems.filter(
      (item) =>
        this.menuConfig.isEnabled(item.key) &&
        (!item.hideOnMobile || !this.isMobile)
    );
  }

  get readingMenuItems() {
    const readingKeys = new Set([
      'books',
      'mangas',
      'manwhas',
      'bds',
      'comics',
    ]);
    return this.visibleMenuItems.filter((item) => readingKeys.has(item.key));
  }

  /** Entrées du sous-menu Écran (Films, Séries, Jeux) – affiché en mode compact. */
  get screenMenuItems() {
    const screenKeys = new Set(['movies', 'series', 'games']);
    return this.visibleMenuItems.filter((item) => screenKeys.has(item.key));
  }

  /** Entrées du sous-menu Extras (Adaptations, Quizz). */
  get extrasMenuItems() {
    return this.visibleMenuItems.filter(
      (item) => (item as { group?: string }).group === 'extras'
    );
  }

  /** Entrées affichées dans la barre (sans le groupe Extras : rendu à part après Écran / Lecture). */
  get primaryMenuItems() {
    const visible = this.visibleMenuItems;
    const withoutExtras = visible.filter(
      (item) => (item as { group?: string }).group !== 'extras'
    );
    if (!this.isCompactMenu) return withoutExtras;
    if (this.isCompactMenu && withoutExtras.length < 5) return withoutExtras;
    const readingKeys = new Set([
      'books',
      'mangas',
      'manwhas',
      'bds',
      'comics',
    ]);
    const screenKeys = new Set(['movies', 'series', 'games']);
    return withoutExtras.filter(
      (item) => !readingKeys.has(item.key) && !screenKeys.has(item.key)
    );
  }

  /** Afficher le bouton / sous-menu Extras (toujours après Écran et Lecture en compact). */
  get hasExtrasMenu(): boolean {
    return this.extrasMenuItems.length > 0;
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  goToLogin(): void {
    this.router.navigate(['/']);
  }

  toggleReadingMenu(): void {
    this.isReadingMenuOpen = !this.isReadingMenuOpen;
    if (this.isReadingMenuOpen) this.closeScreenMenu();
  }

  closeReadingMenu(): void {
    this.isReadingMenuOpen = false;
  }

  isReadingMenuActive(): boolean {
    return this.readingMenuItems.some((item) =>
      this.isActive(this.getRoute(item.key))
    );
  }

  toggleScreenMenu(): void {
    this.isScreenMenuOpen = !this.isScreenMenuOpen;
    if (this.isScreenMenuOpen) {
      this.closeReadingMenu();
      this.closeExtrasMenu();
    }
  }

  closeScreenMenu(): void {
    this.isScreenMenuOpen = false;
  }

  isScreenMenuActive(): boolean {
    return this.screenMenuItems.some((item) =>
      this.isActive(this.getRoute(item.key))
    );
  }

  toggleExtrasMenu(): void {
    this.isExtrasMenuOpen = !this.isExtrasMenuOpen;
    if (this.isExtrasMenuOpen) {
      this.closeReadingMenu();
      this.closeScreenMenu();
    }
  }

  closeExtrasMenu(): void {
    this.isExtrasMenuOpen = false;
  }

  isExtrasMenuActive(): boolean {
    return this.extrasMenuItems.some((item) =>
      this.isActive(this.getRoute(item.key))
    );
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  openMenuConfigModal(): void {
    this.closeUserMenu();
    this.dialog.open(MenuConfigModalComponent, {
      width: 'auto',
      maxWidth: '95vw',
    });
  }

  logout(): void {
    this.authService.clearAuthenticatedUserId();
    this.closeUserMenu();
    this.router.navigate(['/']);
  }
}
