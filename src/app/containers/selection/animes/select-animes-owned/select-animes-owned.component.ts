import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Anime } from '../../../../models/anime-model';
import { getAnimesByUser } from '../../../../facades/animes/animes.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { getApiBaseUrl } from '../../../../core/config';

@Component({
  selector: 'app-select-animes-owned',
  imports: [CommonModule, MenuComponent],
  templateUrl: './select-animes-owned.component.html',
  styleUrls: [
    './select-animes-owned.component.scss',
    '../../select-base.scss',
  ],
})
export class SelectAnimesOwnedComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private isLoading = false;
  isSaving = signal(false);

  animesList = signal<Anime[]>([]);

  // Toutes les animés de l'utilisateur
  allAnimes = computed<Anime[]>(() => {
    return this.animesList();
  });

  // Filtre : afficher uniquement les animés non possédées
  showOnlyNotOwned = signal<boolean>(false);

  // Recherche textuelle (titre / réalisateur / acteurs)
  searchQuery = signal<string>('');

  // Animés affichées selon les filtres actifs. Le filtre "non possédée" se
  // base sur la valeur d'origine pour éviter qu'un animé ne disparaisse
  // dès qu'on la marque comme possédée pendant la session.
  displayedAnimes = computed<Anime[]>(() => {
    let animes = this.allAnimes();

    if (this.showOnlyNotOwned()) {
      animes = animes.filter((anime) => !anime.owned);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      animes = animes.filter((anime) => {
        if (anime.title?.toLowerCase().includes(query)) return true;
        if (anime.director?.toLowerCase().includes(query)) return true;
        return (anime.actors ?? []).some((actor) =>
          actor?.name?.toLowerCase().includes(query)
        );
      });
    }

    return animes;
  });

  // Map pour stocker les owned mis à jour (clé: title-director)
  animesOwned = signal<Map<string, boolean>>(new Map());

  // GÃ©nÃ©rer une clÃ© unique pour une sÃ©rie
  private getAnimeKey(anime: Anime): string {
    return `${anime.title}-${anime.director}`;
  }

  // Obtenir le statut owned actuel d'un animé
  getOwned(anime: Anime): boolean {
    const key = this.getAnimeKey(anime);
    const updatedValue = this.animesOwned().get(key);
    return updatedValue !== undefined ? updatedValue : anime.owned;
  }

  updateOwned(anime: Anime, owned: boolean): void {
    const key = this.getAnimeKey(anime);
    const updated = new Map(this.animesOwned());
    updated.set(key, owned);
    this.animesOwned.set(updated);
  }

  // Basculer le filtre des animés non possédées
  toggleShowOnlyNotOwned(checked: boolean): void {
    this.showOnlyNotOwned.set(checked);
  }

  // Mettre à jour la recherche textuelle
  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  // Compter le nombre de animés modifiées
  modifiedCount = computed(() => {
    return this.animesOwned().size;
  });

  async saveAnimesOwned(): Promise<void> {
    if (this.isSaving()) return;

    const animesToUpdate = this.allAnimes().map((anime) => ({
      title: anime.title,
      director: anime.director,
      owned: this.getOwned(anime),
    }));

    if (animesToUpdate.length === 0) {
      alert('Aucun animé à mettre à jour !');
      return;
    }

    this.isSaving.set(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/animes/batch-owned`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          animes: animesToUpdate,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        console.warn('animes:batch-owned:error', payload);
        alert("La mise à jour des possessions a échoué.");
        return;
      }

      this.navigateToEntityList('animes');
    } catch (error) {
      console.warn('animes:batch-owned:error', error);
      alert("La mise à jour des possessions a échoué.");
    } finally {
      this.isSaving.set(false);
    }
  }

  ngOnInit() {
    void this.loadAnimesData();
  }

  private async loadAnimesData() {
    if (this.isLoading) return;
    this.isLoading = true;
    const animes = await getAnimesByUser(this.userId());
    this.animesList.set(animes);
    this.isLoading = false;
  }
}
