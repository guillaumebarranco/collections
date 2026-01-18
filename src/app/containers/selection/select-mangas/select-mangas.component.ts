import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { Manga } from '../../../models/manga-model';
import {
  getAllMangasMerged,
  getCurrentReadlistMangasByUser,
  getMangasByUser,
} from '../../../facades/mangas/mangas.facade';
import { SelectEntitiesComponent } from '../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddMangaComponent } from '../../add/add-manga/add-manga.component';
import { getApiBaseUrl, isLocalhost } from '../../../core/config';
import { Router } from '@angular/router';
import { SelectEntityComponent } from '../../../components/select-entity/select-entity.component';

@Component({
  selector: 'app-select-mangas',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-mangas.component.html',
  styleUrls: ['./select-mangas.component.scss', '../select-base.scss'],
})
export class SelectMangasComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  userMangas = signal<Manga[]>([]);
  readlistMangas = signal<Manga[]>([]);
  allMangasMergedList = signal<Manga[]>([]);

  readMangas = computed<Set<string>>(() => {
    const userMangas = this.userMangas();
    return new Set(userMangas.map((manga) => this.getMangaKey(manga)));
  });

  alreadyInReadlistMangas = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistMangas = this.readlistMangas();
    return new Set(readlistMangas.map((manga) => this.getMangaKey(manga)));
  });

  allMangas = computed<Manga[]>(() => {
    const allMangasList = this.allMangasMergedList();

    if (!this.isWatchOrReadlistMode()) {
      return allMangasList.filter(
        (manga) =>
          !this.readMangas().has(this.getMangaKey(manga)) &&
          !this.alreadyInReadlistMangas().has(this.getMangaKey(manga))
      );
    }

    return allMangasList.filter(
      (manga) =>
        !this.readMangas().has(this.getMangaKey(manga)) &&
        !this.alreadyInReadlistMangas().has(this.getMangaKey(manga))
    );
  });

  selectedMangas = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedMangas().size);

  isSelected(manga: Manga): boolean {
    return this.selectedMangas().has(this.getMangaKey(manga));
  }

  private getMangaKey(manga: Manga): string {
    return `${manga.title}-${manga.author}`;
  }

  toggleSelection(manga: Manga): void {
    const key = this.getMangaKey(manga);
    const selected = new Set(this.selectedMangas());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedMangas.set(selected);
  }

  openAddMangaDialog(): void {
    const dialogRef = this.dialog.open(AddMangaComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/mangas`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [mangas, readlist] = await Promise.all([
      getMangasByUser(userId),
      getCurrentReadlistMangasByUser(userId),
    ]);
    const allMangas = await this.getAllMangasForSelection(userId);
    this.userMangas.set(mangas);
    this.readlistMangas.set(readlist);
    this.allMangasMergedList.set(allMangas);
  }

  private async getAllMangasForSelection(userId: string): Promise<Manga[]> {
    if (isLocalhost()) {
      return getAllMangasMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedMangas(): Promise<void> {
    const selectedMangasList = this.allMangas()
      .filter((manga) => this.isSelected(manga))
      .map((manga) => {
        return {
          ...manga,
          readTimes: this.isWatchOrReadlistMode() ? 0 : 1,
          rating: 0,
          readDate: '',
        };
      });

    const mangas = selectedMangasList.map((manga) => ({
      title: manga.title,
      author: manga.author,
    }));

    if (mangas.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/mangas/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          mangas,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des mangas :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/mangas`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des mangas.", error);
    }
  }
}
