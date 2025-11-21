import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Music } from '../../../models/music-model';
import { musics } from '../../../utils/guillaume/musics';

@Component({
  selector: 'app-select-musics',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-musics.component.html',
  styleUrls: ['./select-musics.component.scss'],
})
export class SelectMusicsComponent {
  // Toutes les musiques de tous les utilisateurs
  allMusics = signal<Music[]>([
    // Guillaume
    ...musics,
  ]);

  // Musiques sélectionnées
  selectedMusics = signal<Set<string>>(new Set());

  // Nombre de musiques sélectionnées
  selectedCount = computed(() => this.selectedMusics().size);

  // Vérifier si une musique est sélectionnée
  isSelected(music: Music): boolean {
    return this.selectedMusics().has(this.getMusicKey(music));
  }

  // Générer une clé unique pour une musique
  private getMusicKey(music: Music): string {
    return `${music.title}-${music.artist}`;
  }

  // Basculer la sélection d'une musique
  toggleSelection(music: Music): void {
    const key = this.getMusicKey(music);
    const selected = new Set(this.selectedMusics());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedMusics.set(selected);
  }

  // Sélectionner toutes les musiques
  selectAll(): void {
    const allKeys = new Set(
      this.allMusics().map((music) => this.getMusicKey(music))
    );
    this.selectedMusics.set(allKeys);
  }

  // Désélectionner toutes les musiques
  deselectAll(): void {
    this.selectedMusics.set(new Set());
  }

  // Exporter les musiques sélectionnées en JSON
  exportSelectedMusics(): void {
    const selectedMusicsList = this.allMusics()
      .filter((music) => this.isSelected(music))
      .map((music) => {
        return {
          ...music,
          timesListened: 1,
          rating: 0,
        };
      });

    if (selectedMusicsList.length === 0) {
      alert('Aucune musique sélectionnée !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedMusicsList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-musics-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
