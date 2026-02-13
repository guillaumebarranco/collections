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
import { MenuConfigService } from '../../core/menu-config.service';
import { MenuConfigModalComponent } from '../menu-config-modal/menu-config-modal.component';

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
  private readonly dialog = inject(MatDialog);

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
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

  goToDashboard(): void {
    this.router.navigate([
      `/${this.authenticatedUser().toLowerCase()}/dashboard`,
    ]);
  }

  menuItems = [
    {
      label: 'Home',
      route: this.getRoute('dashboard'),
      icon: '📊',
      key: 'dashboard',
      hideOnMobile: false,
    },
    {
      label: 'Livres',
      route: this.getRoute('books'),
      icon: '📚',
      key: 'books',
      hideOnMobile: false,
    },
    {
      label: 'Films',
      route: this.getRoute('movies'),
      icon: '🎬',
      key: 'movies',
      hideOnMobile: false,
    },
    {
      label: 'Séries',
      route: this.getRoute('series'),
      icon: '📺',
      key: 'series',
      hideOnMobile: false,
    },
    {
      label: 'Jeux',
      route: this.getRoute('games'),
      icon: '🎮',
      key: 'games',
      hideOnMobile: false,
    },
    {
      label: 'Mangas',
      route: this.getRoute('mangas'),
      icon: '📖',
      key: 'mangas',
      hideOnMobile: false,
    },
    {
      label: 'Manwhas',
      route: this.getRoute('manwhas'),
      icon: '🎨',
      key: 'manwhas',
      hideOnMobile: true,
    },
    {
      label: 'Comics',
      route: this.getRoute('comics'),
      icon: '🦸',
      key: 'comics',
      hideOnMobile: false,
    },
    {
      label: 'BD',
      route: this.getRoute('bds'),
      icon: '📗',
      key: 'bds',
      hideOnMobile: false,
    },
    {
      label: 'Musiques',
      route: this.getRoute('musics'),
      icon: '🎵',
      key: 'musics',
      hideOnMobile: false,
    },
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  getRoute(route: string): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    const isAdminView = this.router.url.startsWith('/admin');

    if (isAdminView) {
      return route === 'dashboard' ? '/admin' : `/admin/${route}`;
    }

    if (hasNameParam) {
      return `/${params['id']}/${route}`;
    }
    return `/guillaume/${route}`;
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
    return this.readingMenuItems.some((item) => this.isActive(item.route));
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
