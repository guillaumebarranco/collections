import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Manga } from '../../../../models/manga-model';
import { getMangasByUser } from '../../../../facades/mangas/mangas.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-mangas-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-mangas-owned.component.html',
  styleUrls: ['./select-mangas-owned.component.scss', '../../select-base.scss'],
})
export class SelectMangasOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  mangasList = signal<Manga[]>([]);

  allMangas = computed<Manga[]>(() => {
    return this.mangasList();
  });

  // Filtre : afficher uniquement les mangas non possédés
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / auteur)
  searchQuery = signal<string>('');

  // Mangas affichés selon les filtres actifs. Le filtre "non possédé" se base
  // sur la valeur d'origine pour éviter qu'un manga ne disparaisse dès qu'on
  // le marque comme possédé pendant la session.
  displayedMangas = computed<Manga[]>(() => {
    let mangas = this.allMangas();

    if (this.showOnlyNotOwned()) {
      mangas = mangas.filter((manga) => !manga.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      mangas = mangas.filter((manga) => {
        if (manga.title?.toLowerCase().includes(query)) return true;
        if (manga.author?.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    return mangas;
  });

  mangasOwned = signal<Map<string, boolean>>(new Map());

  private getMangaKey(manga: Manga): string {
    return `${manga.title}-${manga.author}`;
  }

  getOwned(manga: Manga): boolean {
    const key = this.getMangaKey(manga);
    const updatedValue = this.mangasOwned().get(key);
    return updatedValue !== undefined ? updatedValue : manga.owned;
  }

  updateOwned(manga: Manga, owned: boolean): void {
    const key = this.getMangaKey(manga);
    const updated = new Map(this.mangasOwned());
    updated.set(key, owned);
    this.mangasOwned.set(updated);
  }

  // Basculer le filtre des mangas non possédés
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  modifiedCount = computed(() => {
    return this.allMangas().filter((manga) => {
      const key = this.getMangaKey(manga);
      return this.mangasOwned().has(key);
    }).length;
  });

  async saveMangasOwned(): Promise<void> {
    if (this.isSaving()) return;

    const mangasToUpdate = this.allMangas().map((manga) => ({
      title: manga.title,
      author: manga.author,
      owned: this.getOwned(manga),
    }));

    if (mangasToUpdate.length === 0) {
      alert('Aucun manga à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas/batch-owned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          mangas: mangasToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('mangas:batch-owned:error', payload);
        alert('La mise à jour des possessions a échoué.');
        return;
      }

      this.navigateToEntityList('mangas');
    } catch (error) {
      console.warn('mangas:batch-owned:error', error);
      alert('La mise à jour des possessions a échoué.');
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadMangasData();
  }

  private async loadMangasData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const mangas = await getMangasByUser(this.userId());
    this.mangasList.set(mangas);
    this.isLoading = false;
  }
}
