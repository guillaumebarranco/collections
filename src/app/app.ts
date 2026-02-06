import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './services/pwa.service';
import { PwaInstallComponent } from './components/pwa-install/pwa-install.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PwaInstallComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'makya';
  private pwaService = inject(PwaService);

  ngOnInit(): void {
    // Initialiser le service PWA (il s'enregistre automatiquement)
    // Le service est déjà injecté et s'initialise dans le constructeur
  }
}
