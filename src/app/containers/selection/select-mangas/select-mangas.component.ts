import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import { mangas } from '../../../utils/guillaume/mangas/mangas';

@Component({
  selector: 'app-select-mangas',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-mangas.component.html',
  styleUrls: ['./select-mangas.component.scss'],
})
export class SelectMangasComponent {
  // Tous les mangas de tous les utilisateurs
  allMangas = signal<any[]>([
    // Guillaume
    ...mangas,
  ]);

  // Mangas sélectionnés
  selectedMangas = signal<Set<string>>(new Set());

  // Nombre de mangas sélectionnés
  selectedCount = computed(() => this.selectedMangas().size);

  // Vérifier si un manga est sélectionné
  isSelected(manga: Book): boolean {
    return this.selectedMangas().has(this.getMangaKey(manga));
  }

  // Générer une clé unique pour un manga
  private getMangaKey(manga: Book): string {
    return `${manga.title}-${manga.author}`;
  }

  // Basculer la sélection d'un manga
  toggleSelection(manga: Book): void {
    const key = this.getMangaKey(manga);
    const selected = new Set(this.selectedMangas());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedMangas.set(selected);
  }

  // Sélectionner tous les mangas
  selectAll(): void {
    const allKeys = new Set(
      this.allMangas().map((manga) => this.getMangaKey(manga))
    );
    this.selectedMangas.set(allKeys);
  }

  // Désélectionner tous les mangas
  deselectAll(): void {
    this.selectedMangas.set(new Set());
  }

  // Exporter les mangas sélectionnés en JSON
  exportSelectedMangas(): void {
    const selectedMangasList = this.allMangas()
      .filter((manga) => this.isSelected(manga))
      .map((manga) => {
        return {
          ...manga,
          readTimes: 1,
          rating: 0,
          readDate: '',
        };
      });

    if (selectedMangasList.length === 0) {
      alert('Aucun manga sélectionné !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedMangasList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-mangas-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
