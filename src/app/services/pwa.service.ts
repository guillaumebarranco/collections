import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PwaService {
  private promptEvent: any;
  private installable = new BehaviorSubject<boolean>(false);
  public installable$: Observable<boolean> = this.installable.asObservable();

  constructor() {
    this.init();
  }

  private init(): void {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker enregistré avec succès:', registration.scope);

            // Vérifier les mises à jour
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Nouvelle version disponible
                    console.log('Nouvelle version disponible');
                    if (confirm('Une nouvelle version est disponible. Voulez-vous recharger la page ?')) {
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('Erreur lors de l\'enregistrement du service worker:', error);
          });
      });

      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message du service worker:', event.data);
      });
    }

    // Détecter si l'app peut être installée
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.promptEvent = e;
      this.installable.next(true);
    });

    // Détecter si l'app est déjà installée
    window.addEventListener('appinstalled', () => {
      console.log('PWA installée');
      this.installable.next(false);
      this.promptEvent = null;
    });
  }

  async installPwa(): Promise<boolean> {
    if (!this.promptEvent) {
      return false;
    }

    this.promptEvent.prompt();
    const { outcome } = await this.promptEvent.userChoice;

    if (outcome === 'accepted') {
      this.installable.next(false);
      this.promptEvent = null;
      return true;
    }

    return false;
  }

  isInstallable(): boolean {
    return this.installable.value;
  }

  isInstalled(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
  }
}
