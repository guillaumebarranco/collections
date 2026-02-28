import {
  Component,
  OnInit,
  HostListener,
  inject,
  computed,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../core/auth.service';
import { DEFAULT_USER_ID } from '../../utils/constants';
import { MenuConfigService } from '../../core/menu-config.service';
import { MenuConfigModalComponent } from '../menu-config-modal/menu-config-modal.component';
import { ImpersonateService } from '../../services/impersonate.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isMobile = false;
  isCompactMenu = false;
  isReadingMenuOpen = false;
  isUserMenuOpen = false;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  menuConfig = inject(MenuConfigService);
  impersonateService = inject(ImpersonateService);
  private readonly dialog = inject(MatDialog);

  /** Utilisateur dont on affiche le contexte (impersonation ou route ou connecté). */
  effectiveUserId = computed(() => {
    const impersonated = this.impersonateService.impersonatedUserId();
    if (impersonated) return impersonated;
    const routeId = this.getRouteIdFromRouter();
    if (routeId) return routeId;
    const auth = this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    return auth ?? DEFAULT_USER_ID;
  });

  currentUser = computed(() => {
    const uid = this.effectiveUserId();
    return uid ? this.capitalizeFirstLetter(uid) : '';
  });

  authenticatedUser = computed(() => {
    const userId = this.authService.userId();
    return userId ? this.capitalizeFirstLetter(userId) : '';
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
    { label: 'Musiques', icon: '🎵', key: 'musics', hideOnMobile: false },
    { label: 'Mix', icon: '🔀', key: 'mix', hideOnMobile: false },
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  getRoute(route: string): string {
    const isAdminView = this.router.url.startsWith('/admin');
    if (isAdminView) {
      return route === 'dashboard' ? '/admin' : `/admin/${route}`;
    }
    const uid = this.effectiveUserId();
    return `/${uid}/${route}`;
  }

  /** Récupère l'id utilisateur depuis l'arbre des routes (ex. :id dans l'URL). */
  private getRouteIdFromRouter(): string | null {
    let route: ActivatedRoute | null = this.router.routerState.root;
    while (route) {
      const id = route.snapshot.params['id'];
      if (id) return id;
      route = route.firstChild;
    }
    return null;
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
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    this.isCompactMenu = window.innerWidth < 1500;
    if (!this.isCompactMenu) {
      this.isReadingMenuOpen = false;
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

  get primaryMenuItems() {
    if (!this.isCompactMenu) return this.visibleMenuItems;
    if (this.isCompactMenu && this.visibleMenuItems.length < 5)
      return this.visibleMenuItems;
    const readingKeys = new Set([
      'books',
      'mangas',
      'manwhas',
      'bds',
      'comics',
    ]);
    return this.visibleMenuItems.filter((item) => !readingKeys.has(item.key));
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
  }

  closeReadingMenu(): void {
    this.isReadingMenuOpen = false;
  }

  isReadingMenuActive(): boolean {
    return this.readingMenuItems.some((item) =>
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
