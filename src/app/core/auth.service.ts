import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'makya-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticatedUserId = signal<string | null>(
    this.readStoredUserId()
  );

  setAuthenticatedUserId(userId: string) {
    const normalized = userId.trim().toLowerCase();
    if (!normalized) return;
    this.authenticatedUserId.set(normalized);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, normalized);
    }
  }

  clearAuthenticatedUserId() {
    this.authenticatedUserId.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  getAuthenticatedUserId(): string | null {
    return this.authenticatedUserId();
  }

  isAuthenticated(): boolean {
    return Boolean(this.authenticatedUserId());
  }

  canEdit(targetUserId?: string | null): boolean {
    if (!targetUserId) return false;
    const authUserId = this.authenticatedUserId();
    return Boolean(authUserId && authUserId === targetUserId.toLowerCase());
  }

  private readStoredUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  }
}
