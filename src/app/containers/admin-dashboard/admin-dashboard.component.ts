import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from '../../core/auth.service';
import { getAdminUsers, AdminUser } from '../../facades/admin/admin.facade';
import { DEFAULT_USER_ID } from '../../utils/constants';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly users = signal<AdminUser[]>([]);
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
      const userId = this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const response = await getAdminUsers(userId);
      this.users.set(response.users);
    } finally {
      this.isLoading.set(false);
    }
  }
}
