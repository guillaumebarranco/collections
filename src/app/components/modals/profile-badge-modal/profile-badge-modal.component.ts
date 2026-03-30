import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { BadgesService } from '../../../services/badges.service';
import { ProfileBadgeService } from '../../../services/profile-badge.service';
import { getBadgesDisplay } from '../../../utils/users/badges';

export type ProfileBadgeModalData = {
  userId: string;
};

@Component({
  selector: 'app-profile-badge-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './profile-badge-modal.component.html',
  styleUrls: ['./profile-badge-modal.component.scss'],
})
export class ProfileBadgeModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<ProfileBadgeModalComponent>>(MatDialogRef);
  private readonly data = inject<ProfileBadgeModalData>(MAT_DIALOG_DATA);
  private readonly badgesService = inject(BadgesService);
  private readonly profileBadgeService = inject(ProfileBadgeService);

  readonly userId = this.data.userId;

  readonly earnedBadges = computed(() => {
    this.badgesService.cache();
    return getBadgesDisplay(this.badgesService.getBadges(this.userId)).filter(
      (b) => b.earned
    );
  });

  readonly selectedId = signal<string | null>(
    this.profileBadgeService.getProfileBadgeId(this.userId)
  );

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  selectBadge(badgeId: string): void {
    this.selectedId.set(badgeId);
  }

  clearSelection(): void {
    this.selectedId.set(null);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  async confirm(): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.profileBadgeService.saveProfileBadge(
        this.userId,
        this.selectedId()
      );
      this.dialogRef.close(true);
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : 'Enregistrement impossible. Réessayez.';
      this.errorMessage.set(msg);
    } finally {
      this.saving.set(false);
    }
  }
}
