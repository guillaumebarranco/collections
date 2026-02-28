import { Injectable, signal } from '@angular/core';

/**
 * Service d'impersonation : quand l'utilisateur connecté consulte le profil d'un autre
 * utilisateur (ex. via "Voir le profil" dans la modal Comptes suivis), tous les liens
 * du menu (Films, Livres, etc.) pointent vers les collections de cet utilisateur.
 * L'impersonation est annulée au clic sur "Retour sur mon dashboard".
 */
@Injectable({
  providedIn: 'root',
})
export class ImpersonateService {
  /** ID de l'utilisateur dont on consulte le profil (null = on consulte son propre contexte). */
  readonly impersonatedUserId = signal<string | null>(null);

  setImpersonation(userId: string | null): void {
    this.impersonatedUserId.set(userId ? userId.trim().toLowerCase() : null);
  }

  clearImpersonation(): void {
    this.impersonatedUserId.set(null);
  }

  isImpersonating(): boolean {
    return this.impersonatedUserId() != null;
  }
}
