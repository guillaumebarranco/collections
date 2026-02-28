import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FollowsService } from '../../services/follows.service';
import { getUsersListFromApi } from '../../facades/follows/follows.facade';

export type FollowsModalData = {
  userId: string;
};

@Component({
  selector: 'app-follows-modal',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './follows-modal.component.html',
  styleUrls: ['./follows-modal.component.scss'],
})
export class FollowsModalComponent implements OnInit {
  private readonly dialogRef =
    inject<MatDialogRef<FollowsModalComponent>>(MatDialogRef);
  private readonly data = inject<FollowsModalData | null>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private readonly followsService = inject(FollowsService);

  readonly userId = signal<string>(this.data?.userId ?? '');
  readonly allUsers = signal<string[]>([]);
  readonly follows = signal<string[]>([]);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly togglingUserId = signal<string | null>(null);

  /** Utilisateurs à afficher : tous sauf soi, triés par nom. */
  readonly otherUsers = computed(() => {
    const uid = this.userId().toLowerCase();
    return this.allUsers()
      .filter((u) => u.toLowerCase() !== uid)
      .sort((a, b) => a.localeCompare(b, 'fr'));
  });

  ngOnInit(): void {
    const uid = this.userId();
    if (uid) {
      void this.loadData(uid);
    }
  }

  private async loadData(uid: string): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const [users, list] = await Promise.all([
        getUsersListFromApi(),
        this.followsService.loadFromApi(uid),
      ]);
      this.allUsers.set(users);
      this.follows.set(list);
    } catch {
      this.errorMessage.set('Impossible de charger les données.');
    } finally {
      this.loading.set(false);
    }
  }

  isFollowing(username: string): boolean {
    const target = username.trim().toLowerCase();
    return this.follows().includes(target);
  }

  async toggleFollow(username: string): Promise<void> {
    const uid = this.userId();
    const target = username.trim().toLowerCase();
    if (!uid || !target || target === uid.toLowerCase()) return;
    this.togglingUserId.set(target);
    this.errorMessage.set('');
    try {
      const list = this.isFollowing(username)
        ? await this.followsService.removeFollow(uid, target)
        : await this.followsService.addFollow(uid, target);
      this.follows.set(list);
    } catch {
      this.errorMessage.set('Modification impossible.');
    } finally {
      this.togglingUserId.set(null);
    }
  }

  seeProfilAndClose() {
    this.close();
  }

  close(): void {
    this.dialogRef.close();
  }

  capitalize(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
