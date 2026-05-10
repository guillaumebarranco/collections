import { Injectable, signal } from '@angular/core';
import { getApiBaseUrl } from './config';

const STORAGE_KEY = 'makya-auth-user';
const STORAGE_ADMIN_KEY = 'makya-auth-admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticatedUserId = signal<string | null>(
    this.readStoredUserId()
  );
  private readonly authenticatedUserAdmin = signal<boolean>(
    this.readStoredAdmin()
  );
  readonly userId = this.authenticatedUserId.asReadonly();

  setAuthenticatedUserId(userId: string) {
    const normalized = userId.trim().toLowerCase();
    if (!normalized) return;
    this.authenticatedUserId.set(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
  }

  setAuthenticatedUserAdmin(isAdmin: boolean) {
    this.authenticatedUserAdmin.set(Boolean(isAdmin));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ADMIN_KEY, String(Boolean(isAdmin)));
    }
  }

  clearAuthenticatedUserId() {
    this.authenticatedUserId.set(null);
    this.authenticatedUserAdmin.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_ADMIN_KEY);
    }
  }

  getAuthenticatedUserId(): string | null {
    return this.authenticatedUserId();
  }

  isAuthenticated(): boolean {
    return Boolean(this.authenticatedUserId());
  }

  isAdmin(): boolean {
    return Boolean(this.authenticatedUserAdmin());
  }

  canEdit(targetUserId?: string | null): boolean {
    if (!targetUserId) return false;
    const authUserId = this.authenticatedUserId();
    return Boolean(authUserId && authUserId === targetUserId.toLowerCase());
  }

  async getUserStatus(username: string): Promise<{
    exists: boolean;
    hasPassword: boolean;
    admin: boolean;
  }> {
    const normalized = username.trim().toLowerCase();
    if (!normalized) {
      return { exists: false, hasPassword: false, admin: false };
    }
    const response = await fetch(
      `${getApiBaseUrl()}/auth/status/${normalized}`
    );
    if (!response.ok) {
      return { exists: false, hasPassword: false, admin: false };
    }
    return response.json();
  }

  async login(username: string, password: string): Promise<boolean> {
    const normalized = username.trim().toLowerCase();
    if (!normalized || !password) return false;
    const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized, password }),
    });
    if (!response.ok) {
      return false;
    }
    const payload = await response.json();
    this.setAuthenticatedUserId(normalized);
    this.setAuthenticatedUserAdmin(Boolean(payload?.admin));
    return true;
  }

  async register(username: string, password: string): Promise<boolean> {
    const normalized = username.trim().toLowerCase();
    if (!normalized || !password) return false;
    const response = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalized, password }),
    });
    if (!response.ok) {
      return false;
    }
    const payload = await response.json();
    this.setAuthenticatedUserId(normalized);
    this.setAuthenticatedUserAdmin(Boolean(payload?.admin));
    return true;
  }

  /**
   * Change le mot de passe de l'utilisateur courant côté serveur.
   * Le serveur vérifie d'abord l'ancien mot de passe puis applique le nouveau
   * hash (PBKDF2 sha512, même schéma que `register`).
   *
   * @returns un statut `'ok' | 'invalid-current' | 'not-found' | 'same-password' | 'error'`
   */
  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<
    'ok' | 'invalid-current' | 'not-found' | 'same-password' | 'error'
  > {
    const normalized = username.trim().toLowerCase();
    if (!normalized || !oldPassword || !newPassword) return 'error';

    const response = await fetch(`${getApiBaseUrl()}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: normalized,
        oldPassword,
        newPassword,
      }),
    });

    if (response.ok) return 'ok';
    if (response.status === 401) return 'invalid-current';
    if (response.status === 404) return 'not-found';
    if (response.status === 400) return 'same-password';
    return 'error';
  }

  private readStoredUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  }

  private readStoredAdmin(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_ADMIN_KEY) === 'true';
  }
}
