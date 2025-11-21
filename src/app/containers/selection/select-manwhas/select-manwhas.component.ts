import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Book } from '../../../models/book-model';
import { manwhas } from '../../../utils/guillaume/mangas/manwhas';

@Component({
  selector: 'app-select-manwhas',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-manwhas.component.html',
  styleUrls: ['./select-manwhas.component.scss'],
})
export class SelectManwhasComponent {
  // Tous les manwhas de tous les utilisateurs
  allManwhas = signal<any[]>([
    // Guillaume
    ...manwhas,
  ]);

  // Manwhas sélectionnés
  selectedManwhas = signal<Set<string>>(new Set());

  // Nombre de manwhas sélectionnés
  selectedCount = computed(() => this.selectedManwhas().size);

  // Vérifier si un manwha est sélectionné
  isSelected(manwha: Book): boolean {
    return this.selectedManwhas().has(this.getManwhaKey(manwha));
  }

  // Générer une clé unique pour un manwha
  private getManwhaKey(manwha: Book): string {
    return `${manwha.title}-${manwha.author}`;
  }

  // Basculer la sélection d'un manwha
  toggleSelection(manwha: Book): void {
    const key = this.getManwhaKey(manwha);
    const selected = new Set(this.selectedManwhas());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedManwhas.set(selected);
  }

  // Sélectionner tous les manwhas
  selectAll(): void {
    const allKeys = new Set(
      this.allManwhas().map((manwha) => this.getManwhaKey(manwha))
    );
    this.selectedManwhas.set(allKeys);
  }

  // Désélectionner tous les manwhas
  deselectAll(): void {
    this.selectedManwhas.set(new Set());
  }

  // Exporter les manwhas sélectionnés en JSON
  exportSelectedManwhas(): void {
    const selectedManwhasList = this.allManwhas()
      .filter((manwha) => this.isSelected(manwha))
      .map((manwha) => {
        return {
          ...manwha,
          readTimes: 1,
          rating: 0,
          readDate: '',
        };
      });

    if (selectedManwhasList.length === 0) {
      alert('Aucun manwha sélectionné !');
      return;
    }

    // Créer le JSON
    const jsonContent = JSON.stringify(selectedManwhasList, null, 2);

    // Créer un blob
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-manwhas-selection-${new Date().getTime()}.json`;

    // Télécharger le fichier
    document.body.appendChild(link);
    link.click();

    // Nettoyer
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
