import {
  Component,
  OnInit,
  HostListener,
  inject,
  computed,
} from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  isMobile = false;

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  currentUser = computed(() => {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;
    return hasNameParam ? this.capitalizeFirstLetter(params['id']) : '';
  });

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  menuItems = [
    {
      label: 'Home',
      route: this.getRoute('dashboard'),
      icon: '📊',
      hideOnMobile: false,
    },
    {
      label: 'Livres',
      route: this.getRoute('books'),
      icon: '📚',
      hideOnMobile: false,
    },
    {
      label: 'Films',
      route: this.getRoute('movies'),
      icon: '🎬',
      hideOnMobile: false,
    },
    {
      label: 'Séries',
      route: this.getRoute('series'),
      icon: '📺',
      hideOnMobile: false,
    },
    {
      label: 'Jeux',
      route: this.getRoute('games'),
      icon: '🎮',
      hideOnMobile: false,
    },
    {
      label: 'Mangas',
      route: this.getRoute('mangas'),
      icon: '📖',
      hideOnMobile: false,
    },
    {
      label: 'Comics',
      route: this.getRoute('comics'),
      icon: '🦸',
      hideOnMobile: false,
    },
    {
      label: 'BD',
      route: this.getRoute('bds'),
      icon: '📗',
      hideOnMobile: false,
    },
    {
      label: 'Manwhas',
      route: this.getRoute('manwhas'),
      icon: '🎨',
      hideOnMobile: true,
    },
    {
      label: 'Musiques',
      route: this.getRoute('musics'),
      icon: '🎵',
      hideOnMobile: false,
    },
  ];

  ngOnInit() {
    this.checkScreenSize();
  }

  getRoute(route: string): string {
    const params: Params = this.activatedRoute.snapshot.params;
    const hasNameParam = params['id'] !== undefined;

    if (hasNameParam) {
      return `/${params['id']}/${route}`;
    }
    return `/${route}`;
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  get visibleMenuItems() {
    return this.menuItems.filter(
      (item) => !item.hideOnMobile || !this.isMobile
    );
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
