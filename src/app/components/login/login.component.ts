import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type LoginMode = 'login' | 'register';

/** Nom d'utilisateur valide à la création : uniquement minuscules (a-z) et chiffres, sans espace ni caractère spécial. */
const USERNAME_REGISTER_PATTERN = /^[a-z0-9]+$/;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly username = signal('');
  readonly password = signal('');
  readonly mode = signal<LoginMode>('login');
  readonly errorMessage = signal('');
  readonly isLoading = signal(false);

  onUsernameChange(value: string) {
    this.username.set(value);
    this.errorMessage.set('');
  }

  onPasswordChange(value: string) {
    this.password.set(value);
    this.errorMessage.set('');
  }

  /** Message d'erreur sur le champ username en mode inscription (espaces/caractères spéciaux/majuscules interdits). */
  getUsernameValidationError(): string | null {
    if (this.mode() !== 'register') return null;
    return this.getRegistrationUsernameValidationError();
  }

  /** Règles du nom d'utilisateur à la création de compte ou première définition du mot de passe. */
  private getRegistrationUsernameValidationError(): string | null {
    const raw = this.username().trim();
    if (!raw) return null;
    if (/\s/.test(this.username())) return 'Le nom d\'utilisateur ne doit pas contenir d\'espace.';
    if (this.username() !== this.username().toLowerCase()) return 'Le nom d\'utilisateur doit être entièrement en minuscules.';
    if (!USERNAME_REGISTER_PATTERN.test(raw)) return 'Le nom d\'utilisateur ne doit contenir que des lettres minuscules (a-z) et des chiffres, sans caractère spécial.';
    return null;
  }

  async onSubmit() {
    const rawUsername = this.username().trim();
    const username = rawUsername.toLowerCase();
    const password = this.password();
    if (!username || !password) {
      this.errorMessage.set('Merci de renseigner un nom et un mot de passe.');
      return;
    }
    if (this.mode() === 'register') {
      const usernameError = this.getRegistrationUsernameValidationError();
      if (usernameError) {
        this.errorMessage.set(usernameError);
        return;
      }
    }

    this.isLoading.set(true);
    try {
      const status = await this.authService.getUserStatus(username);

      if (status.exists && status.hasPassword) {
        const ok = await this.authService.login(username, password);
        if (!ok) {
          this.errorMessage.set('Identifiants invalides.');
          return;
        }
        this.router.navigate([username]);
        return;
      }

      // Compte inexistant ou existant sans mot de passe : inscription au premier clic
      const regError = this.getRegistrationUsernameValidationError();
      if (regError) {
        this.errorMessage.set(regError);
        this.mode.set('register');
        return;
      }

      const ok = await this.authService.register(username, password);
      if (!ok) {
        this.errorMessage.set('Impossible de créer le mot de passe.');
        return;
      }
      this.router.navigate([username]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
