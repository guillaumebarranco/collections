import { Injectable, signal } from '@angular/core';
import { getApiBaseUrl } from './config';

const STORAGE_KEY = 'makya-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticatedUserId = signal<string | null>(
    this.readStoredUserId()
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

  async getUserStatus(username: string): Promise<{
    exists: boolean;
    hasPassword: boolean;
  }> {
    const normalized = username.trim().toLowerCase();
    if (!normalized) {
      return { exists: false, hasPassword: false };
    }
    const response = await fetch(
      `${getApiBaseUrl()}/auth/status/${normalized}`
    );
    if (!response.ok) {
      return { exists: false, hasPassword: false };
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
    this.setAuthenticatedUserId(normalized);
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
    this.setAuthenticatedUserId(normalized);
    return true;
  }

  private readStoredUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  }
}
