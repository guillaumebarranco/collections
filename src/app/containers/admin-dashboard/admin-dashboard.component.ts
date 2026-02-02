import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import { AuthService } from '../../core/auth.service';
import { getAdminUsersCount } from '../../facades/admin/admin.facade';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly usersCount = signal<number | null>(null);
  readonly isAdmin = computed(() => this.authService.isAdmin());

  async ngOnInit() {
    if (!this.isAdmin()) return;
    const userId = this.authService.getAuthenticatedUserId() || 'guillaume';
    const count = await getAdminUsersCount(userId);
    this.usersCount.set(count);
  }
}
