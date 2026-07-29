import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { createEntityAddRequest } from '../../../facades/entity-add-requests/entity-add-requests.facade';
import {
  ENTITY_ADD_REQUEST_CONFIG,
  type EntityAddRequestType,
} from '../../../models/entity-add-request.model';

export type RequestEntityAddDialogData = {
  entityType: EntityAddRequestType;
  userId: string;
};

@Component({
  selector: 'app-request-entity-add-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-entity-add-modal.component.html',
  styleUrls: ['./request-entity-add-modal.component.scss'],
})
export class RequestEntityAddModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<RequestEntityAddModalComponent>
  );
  private readonly data = inject<RequestEntityAddDialogData>(MAT_DIALOG_DATA);

  readonly entityType = this.data.entityType;
  readonly config = ENTITY_ADD_REQUEST_CONFIG[this.entityType];

  readonly title = signal('');
  readonly secondaryKey = signal('');
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly canSubmit = computed(
    () =>
      this.title().trim().length > 0 &&
      this.secondaryKey().trim().length > 0 &&
      !this.isSaving()
  );

  close(): void {
    this.dialogRef.close();
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) return;
    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      await createEntityAddRequest({
        entityType: this.entityType,
        title: this.title().trim(),
        secondaryKey: this.secondaryKey().trim(),
        requestedBy: this.data.userId,
      });
      this.successMessage.set(
        "Demande envoyée. L'admin l'ajoutera bientôt au catalogue Makya."
      );
      setTimeout(() => this.dialogRef.close({ requested: true }), 1200);
    } catch (error: unknown) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
