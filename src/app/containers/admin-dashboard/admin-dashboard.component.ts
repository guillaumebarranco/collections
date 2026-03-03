import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from '../../core/auth.service';
import {
  getAdminUsers,
  getAdminUserStats,
  AdminUser,
  UserCollectionCounts,
} from '../../facades/admin/admin.facade';
import { DEFAULT_USER_ID } from '../../utils/constants';

export type AdminUserWithStats = AdminUser & { counts: UserCollectionCounts };

/** Libellés courts pour les types de collection (affichage carte). */
export const COLLECTION_LABELS: { key: keyof UserCollectionCounts; label: string }[] = [
  { key: 'movies', label: 'Films' },
  { key: 'series', label: 'Séries' },
  { key: 'books', label: 'Livres' },
  { key: 'games', label: 'Jeux' },
  { key: 'mangas', label: 'Mangas' },
  { key: 'manwhas', label: 'Manwhas' },
  { key: 'comics', label: 'Comics' },
  { key: 'bds', label: 'BD' },
  { key: 'musics', label: 'Musiques' },
];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly collectionLabels = COLLECTION_LABELS;
  readonly users = signal<AdminUserWithStats[]>([]);
  readonly usersCount = computed(() => this.users().length);
  readonly isLoading = signal<boolean>(true);
  readonly isAdmin = computed(() => this.authService.isAdmin());

  capitalizeFirstLetter(val: string): string {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  getUserRoute(username: string): string {
    return `/${username.toLowerCase()}/dashboard`;
  }

  async ngOnInit() {
    if (!this.isAdmin()) return;
    this.isLoading.set(true);
    try {
      const userId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const response = await getAdminUsers(userId);
      const withStats: AdminUserWithStats[] = await Promise.all(
        response.users.map(async (user) => {
          const counts = await getAdminUserStats(user.username);
          return { ...user, counts };
        })
      );
      this.users.set(withStats);
    } finally {
      this.isLoading.set(false);
    }
  }
}
