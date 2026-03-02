import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../services/pwa.service';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isInstallable() && !isInstalled()) {
    <div class="pwa-install-banner">
      <div class="pwa-install-content">
        <p>Installez Makya sur votre appareil pour une meilleure expérience</p>
        <div class="pwa-install-actions">
          <button class="makya-btn-small" (click)="install()">Installer</button>
          <button class="makya-btn-small" (click)="dismiss()">Plus tard</button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .pwa-install-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #1976d2;
        color: white;
        padding: 16px;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
      }

      .pwa-install-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      .pwa-install-content p {
        margin: 0;
        flex: 1;
      }

      .pwa-install-actions {
        display: flex;
        gap: 8px;
      }

      @media (max-width: 768px) {
        .pwa-install-content {
          flex-direction: column;
          align-items: stretch;
        }

        .pwa-install-actions {
          width: 100%;
        }

        .pwa-install-actions button {
          flex: 1;
        }
      }
    `,
  ],
})
export class PwaInstallComponent implements OnInit {
  private pwaService = inject(PwaService);
  isInstallable = signal(false);
  isInstalled = signal(false);

  ngOnInit(): void {
    this.isInstalled.set(this.pwaService.isInstalled());

    // Vérifier si l'utilisateur a déjà choisi de ne pas installer
    const dismissed = localStorage.getItem('pwa-install-dismissed') === 'true';
    if (dismissed) {
      this.isInstallable.set(false);
      return;
    }

    this.pwaService.installable$.subscribe((installable) => {
      this.isInstallable.set(installable);
    });
  }

  async install(): Promise<void> {
    const installed = await this.pwaService.installPwa();
    if (installed) {
      this.isInstalled.set(true);
    }
  }

  dismiss(): void {
    this.isInstallable.set(false);
    // Optionnel: sauvegarder dans localStorage pour ne plus afficher
    localStorage.setItem('pwa-install-dismissed', 'true');
  }
}
