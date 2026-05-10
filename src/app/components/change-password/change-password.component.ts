import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MenuComponent } from '../menu/menu.component';

/** Longueur minimale exigée pour un nouveau mot de passe (alignée avec la création de compte). */
const MIN_PASSWORD_LENGTH = 4;

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MenuComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly oldPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly isLoading = signal(false);

  readonly authenticatedUser = computed(() => this.authService.userId());

  onOldPasswordChange(value: string) {
    this.oldPassword.set(value);
    this.errorMessage.set('');
  }

  onNewPasswordChange(value: string) {
    this.newPassword.set(value);
    this.errorMessage.set('');
  }

  onConfirmPasswordChange(value: string) {
    this.confirmPassword.set(value);
    this.errorMessage.set('');
  }

  private validate(): string | null {
    const oldPwd = this.oldPassword();
    const newPwd = this.newPassword();
    const confirmPwd = this.confirmPassword();

    if (!oldPwd) return 'Merci de saisir ton mot de passe actuel.';
    if (!newPwd) return 'Merci de saisir un nouveau mot de passe.';
    if (newPwd.length < MIN_PASSWORD_LENGTH) {
      return `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
    }
    if (newPwd !== confirmPwd) {
      return 'La confirmation ne correspond pas au nouveau mot de passe.';
    }
    if (newPwd === oldPwd) {
      return 'Le nouveau mot de passe doit être différent de l’ancien.';
    }
    return null;
  }

  async onSubmit() {
    const username = this.authenticatedUser();
    if (!username) {
      this.errorMessage.set(
        'Tu dois être connecté pour modifier ton mot de passe.'
      );
      this.router.navigate(['/']);
      return;
    }

    const validationError = this.validate();
    if (validationError) {
      this.errorMessage.set(validationError);
      return;
    }

    this.isLoading.set(true);
    try {
      const result = await this.authService.changePassword(
        username,
        this.oldPassword(),
        this.newPassword()
      );
      switch (result) {
        case 'ok':
          this.successMessage.set('Mot de passe mis à jour avec succès !');
          this.errorMessage.set('');
          this.oldPassword.set('');
          this.newPassword.set('');
          this.confirmPassword.set('');
          setTimeout(() => {
            this.router.navigate([username, 'dashboard']);
          }, 1200);
          return;
        case 'invalid-current':
          this.errorMessage.set('Mot de passe actuel incorrect.');
          return;
        case 'not-found':
          this.errorMessage.set('Utilisateur introuvable.');
          return;
        case 'same-password':
          this.errorMessage.set(
            'Le nouveau mot de passe doit être différent de l’ancien.'
          );
          return;
        default:
          this.errorMessage.set(
            'Impossible de modifier le mot de passe. Réessaie plus tard.'
          );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  cancel() {
    const uid = this.authenticatedUser();
    if (uid) {
      this.router.navigate([uid, 'dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
