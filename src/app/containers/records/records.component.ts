import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../components/menu/menu.component';
import {
  DashboardRecordsComponent,
  type RecordsData,
} from '../../components/dashboard/dashboard-records/dashboard-records.component';
import { AuthService } from '../../core/auth.service';
import { getAdminRecords } from '../../facades/admin/admin.facade';
import { DEFAULT_USER_ID } from '../../utils/constants';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, MenuComponent, DashboardRecordsComponent],
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecordsComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly isAdmin = computed<boolean>(() => this.authService.isAdmin());
  readonly recordsData = signal<RecordsData | null>(null);
  readonly recordsLoading = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    if (this.isAdmin()) {
      await this.loadRecords();
    }
  }

  private async loadRecords(): Promise<void> {
    this.recordsLoading.set(true);
    this.recordsData.set(null);
    try {
      const adminId =
        this.authService.getAuthenticatedUserId() || DEFAULT_USER_ID;
      const data = await getAdminRecords(adminId);
      this.recordsData.set(data);
    } finally {
      this.recordsLoading.set(false);
    }
  }
}
