import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ImpersonateService } from '../../services/impersonate.service';
import {
  getAdminUsers,
  getAdminUserStats,
  AdminUser,
  UserCollectionCounts,
} from '../../facades/admin/admin.facade';
import {
  clearEntityAddRequests,
  getEntityAddRequests,
} from '../../facades/entity-add-requests/entity-add-requests.facade';
import {
  ENTITY_ADD_REQUEST_CONFIG,
  type EntityAddRequest,
  type EntityAddRequestType,
} from '../../models/entity-add-request.model';
import { DEFAULT_USER_ID } from '../../utils/constants';

export type AdminUserWithStats = AdminUser & { counts: UserCollectionCounts };

/** Libellés courts pour les types de collection (affichage carte). */
export const COLLECTION_LABELS: {
  key: keyof UserCollectionCounts;
  label: string;
}[] = [
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
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly impersonateService = inject(ImpersonateService);

  readonly collectionLabels = COLLECTION_LABELS;
  readonly users = signal<AdminUserWithStats[]>([]);
  readonly usersCount = computed(() => this.users().length);
  readonly isLoading = signal<boolean>(true);
  readonly isAdmin = computed(() => this.authService.isAdmin());

  readonly entityAddRequests = signal<EntityAddRequest[]>([]);
  readonly isLoadingRequests = signal(true);
  readonly isClearingRequests = signal(false);

  capitalizeFirstLetter(val: string): string {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  getUserRoute(username: string): string {
    return `/${username.toLowerCase()}/dashboard`;
  }

  getEntityTypeLabel(entityType: EntityAddRequestType): string {
    return ENTITY_ADD_REQUEST_CONFIG[entityType]?.typeLabel ?? entityType;
  }

  getSecondaryLabel(entityType: EntityAddRequestType): string {
    return ENTITY_ADD_REQUEST_CONFIG[entityType]?.secondaryLabel ?? '';
  }

  formatRequestDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString('fr-FR');
  }

  /** Quitte l’admin et l’impersonation éventuelle, retour au dashboard de l’utilisateur connecté. */
  goToUserDashboard(): void {
    this.impersonateService.clearImpersonation();
    const authId =
      this.authService.getAuthenticatedUserId?.() ?? this.authService.userId();
    const uid = authId ? String(authId).toLowerCase() : DEFAULT_USER_ID;
    void this.router.navigate([`/${uid}/dashboard`]);
  }

  async clearEntityAddRequestsList(): Promise<void> {
    if (this.entityAddRequests().length === 0 || this.isClearingRequests()) {
      return;
    }
    this.isClearingRequests.set(true);
    try {
      const userId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      await clearEntityAddRequests(userId);
      this.entityAddRequests.set([]);
    } finally {
      this.isClearingRequests.set(false);
    }
  }

  async ngOnInit() {
    if (!this.isAdmin()) return;
    this.isLoading.set(true);
    this.isLoadingRequests.set(true);
    try {
      const userId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const [response, requests] = await Promise.all([
        getAdminUsers(userId),
        getEntityAddRequests(userId),
      ]);
      this.entityAddRequests.set(requests);
      const withStats: AdminUserWithStats[] = await Promise.all(
        response.users.map(async (user) => {
          const counts = await getAdminUserStats(user.username);
          return { ...user, counts };
        })
      );
      this.users.set(withStats);
    } finally {
      this.isLoading.set(false);
      this.isLoadingRequests.set(false);
    }
  }
}
