import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type LoginMode = 'login' | 'register';

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

  async onSubmit() {
    const username = this.username().trim().toLowerCase();
    const password = this.password();
    if (!username || !password) {
      this.errorMessage.set('Merci de renseigner un nom et un mot de passe.');
      return;
    }

    this.isLoading.set(true);
    try {
      const status = await this.authService.getUserStatus(username);
      if (!status.exists || !status.hasPassword) {
        if (this.mode() !== 'register') {
          this.mode.set('register');
          this.errorMessage.set(
            "Ce compte n'a pas encore de mot de passe. Crée-en un."
          );
          return;
        }
        const ok = await this.authService.register(username, password);
        if (!ok) {
          this.errorMessage.set('Impossible de créer le mot de passe.');
          return;
        }
        this.router.navigate([username]);
        return;
      }

      const ok = await this.authService.login(username, password);
      if (!ok) {
        this.errorMessage.set('Identifiants invalides.');
        return;
      }
      this.router.navigate([username]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
