import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { BaseComic, Comic } from '../../../../models/comic-model';
import {
  getAllComicsMerged,
  getCurrentReadlistComicsByUser,
  getComicsByUser,
  getAllBaseComics,
} from '../../../../facades/comics/comics.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddComicComponent } from '../../../add/add-comic/add-comic.component';
import { getApiBaseUrl, isLocalhost } from '../../../../core/config';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';
import { getEmptyComic } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-comics',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-comics.component.html',
  styleUrls: ['./select-comics.component.scss', '../../select-base.scss'],
})
export class SelectComicsComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  baseComics = signal<BaseComic[]>([]);
  userComics = signal<Comic[]>([]);
  readlistComics = signal<Comic[]>([]);
  allComicsMergedList = signal<Comic[]>([]);
  searchTerm = signal('');

  readComics = computed<Set<string>>(() => {
    const userComics = this.userComics();
    return new Set(userComics.map((comic) => this.getComicKey(comic)));
  });

  /** Au moins un comic lu issu du catalogue — pour afficher l’ajout manuel. */
  hasReadComicsFromExistingCatalog = computed(() => {
    const baseKeys = new Set(
      this.baseComics().map((c) => `${c.title}-${c.writer}`)
    );
    return this.userComics().some((c) => baseKeys.has(this.getComicKey(c)));
  });

  alreadyInReadlistComics = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistComics = this.readlistComics();
    return new Set(readlistComics.map((comic) => this.getComicKey(comic)));
  });

  allComics = computed<Comic[]>(() => {
    const allComicsList = this.baseComics().map(getEmptyComic);

    if (!this.isWatchOrReadlistMode()) {
      return allComicsList.filter(
        (comic) =>
          !this.readComics().has(this.getComicKey(comic)) &&
          !this.alreadyInReadlistComics().has(this.getComicKey(comic))
      );
    }

    return allComicsList.filter(
      (comic) =>
        !this.readComics().has(this.getComicKey(comic)) &&
        !this.alreadyInReadlistComics().has(this.getComicKey(comic))
    );
  });

  filteredComics = computed<Comic[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allComics();
    if (!normalizedTerm) return list;
    return list.filter((comic) => {
      const title = normalizeSearchText(comic.title ?? '');
      const writer = normalizeSearchText(comic.writer ?? '');
      const designer = normalizeSearchText(comic.designer ?? '');
      return (
        title.includes(normalizedTerm) ||
        writer.includes(normalizedTerm) ||
        designer.includes(normalizedTerm)
      );
    });
  });

  selectedComics = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedComics().size);

  isSelected(comic: Comic): boolean {
    return this.selectedComics().has(this.getComicKey(comic));
  }

  private getComicKey(comic: Comic): string {
    return `${comic.title}-${comic.writer}`;
  }

  toggleSelection(comic: Comic): void {
    const key = this.getComicKey(comic);
    const selected = new Set(this.selectedComics());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedComics.set(selected);
  }

  openAddComicDialog(): void {
    const dialogRef = this.dialog.open(AddComicComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/comics`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [baseComics, comics, readlist] = await Promise.all([
      getAllBaseComics(),
      getComicsByUser(userId),
      getCurrentReadlistComicsByUser(userId),
    ]);

    this.baseComics.set(baseComics);
    const allComics = await this.getAllComicsForSelection(userId);
    this.userComics.set(comics);
    this.readlistComics.set(readlist);
    this.allComicsMergedList.set(allComics);
  }

  private async getAllComicsForSelection(userId: string): Promise<Comic[]> {
    if (isLocalhost()) {
      return getAllComicsMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/comics/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedComics(): Promise<void> {
    const selectedComicsList = this.allComics()
      .filter((comic) => this.isSelected(comic))
      .map((comic) => {
        return {
          ...comic,
          readTimes: this.isWatchOrReadlistMode() ? 0 : 1,
          rating: 0,
          readDate: '',
        };
      });

    const comics = selectedComicsList.map((comic) => ({
      title: comic.title,
      writer: comic.writer,
    }));

    if (comics.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/comics/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          comics,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des comics :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/comics`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des comics.", error);
    }
  }
}
