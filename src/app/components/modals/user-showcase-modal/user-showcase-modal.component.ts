import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import type { UserShowcaseSlot } from '../../../models/user-showcase.model';
import { UserShowcaseService } from '../../../services/user-showcase.service';
import type { ShowcaseCandidate } from '../../../utils/user-showcase.utils';

export type UserShowcaseModalData = {
  userId: string;
  slotIndex: number;
  slots: Array<UserShowcaseSlot | null>;
  candidates: ShowcaseCandidate[];
};

@Component({
  selector: 'app-user-showcase-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './user-showcase-modal.component.html',
  styleUrls: ['./user-showcase-modal.component.scss'],
})
export class UserShowcaseModalComponent {
  private readonly dialogRef =
    inject<MatDialogRef<UserShowcaseModalComponent>>(MatDialogRef);
  private readonly data = inject<UserShowcaseModalData>(MAT_DIALOG_DATA);
  private readonly userShowcaseService = inject(UserShowcaseService);

  readonly slotNumber = this.data.slotIndex + 1;
  readonly candidates = this.data.candidates;
  readonly groups = this.groupCandidates(this.candidates);
  readonly saving = signal(false);
  readonly errorMessage = signal('');

  private readonly slots = this.data.slots.map((slot) => slot);

  cancel(): void {
    if (this.saving()) return;
    this.dialogRef.close(false);
  }

  placedAt(candidate: ShowcaseCandidate): number | null {
    const index = this.slots.findIndex(
      (slot) =>
        slot?.entityType === candidate.entityType && slot.key === candidate.key
    );
    return index === -1 ? null : index + 1;
  }

  isCurrent(candidate: ShowcaseCandidate): boolean {
    const current = this.slots[this.data.slotIndex];
    return (
      current?.entityType === candidate.entityType &&
      current?.key === candidate.key
    );
  }

  get currentFilled(): boolean {
    return this.slots[this.data.slotIndex] !== null;
  }

  async choose(candidate: ShowcaseCandidate): Promise<void> {
    const next = this.slots.map((slot) =>
      slot?.entityType === candidate.entityType && slot.key === candidate.key
        ? null
        : slot
    );
    next[this.data.slotIndex] = {
      entityType: candidate.entityType,
      key: candidate.key,
      title: candidate.title,
      coverUrl: candidate.coverUrl,
    };
    await this.persist(next);
  }

  async clear(): Promise<void> {
    const next = this.slots.slice();
    next[this.data.slotIndex] = null;
    await this.persist(next);
  }

  private async persist(
    slots: Array<UserShowcaseSlot | null>
  ): Promise<void> {
    this.saving.set(true);
    this.errorMessage.set('');
    try {
      await this.userShowcaseService.saveShowcase(this.data.userId, { slots });
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

  private groupCandidates(candidates: ShowcaseCandidate[]): Array<{
    label: string;
    items: ShowcaseCandidate[];
  }> {
    const groups: Array<{ label: string; items: ShowcaseCandidate[] }> = [];
    for (const candidate of candidates) {
      const existing = groups.find((group) => group.label === candidate.entityLabel);
      if (existing) {
        existing.items.push(candidate);
      } else {
        groups.push({ label: candidate.entityLabel, items: [candidate] });
      }
    }
    return groups;
  }
}
