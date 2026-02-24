import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComicComponent } from '../../../components/collections/comic/comic.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Comic } from '../../../models/comic-model';
import { Quizz } from '../../../models/quizz-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getSortedComics } from '../../collections/comics/comics.utils';
import { getFullComic } from '../../../helpers/full-entities-helper';
import { AdminComicsHeaderComponent } from './comics-header/comics-header.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { EditComicComponent } from '../../edit/edit-comic/edit-comic.component';

@Component({
  selector: 'app-admin-comics',
  imports: [
    CommonModule,
    ComicComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    AdminComicsHeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComicsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);

  selectedView = signal<'read'>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  isLoadingComics = signal<boolean>(true);
  adminComicsList = signal<Comic[]>([]);

  allComics = computed<Comic[]>(() => this.adminComicsList());

  filteredComics = computed<Comic[]>(() => {
    const comics = this.allComics();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return comics;
    return comics.filter((comic) => this.matchesSearch(comic, term));
  });

  sortedComics = computed<Comic[]>(() =>
    getSortedComics([...this.filteredComics()], 'title')
  );

  visibleViewOptions = computed(() => [{ value: 'read' as const, label: 'Voir tout' }]);

  ngOnInit() {
    void this.refreshComics();
    void this.refreshQuizzs();
  }

  async refreshComics() {
    this.isLoadingComics.set(true);
    try {
      const baseComics = await getAllBaseComics();
      const comics = baseComics.map(getFullComic);
      this.adminComicsList.set(comics);
    } finally {
      this.isLoadingComics.set(false);
    }
  }

  async refreshQuizzs() {
    const q = await getAllQuizzs();
    this.quizzs.set(q);
  }

  onViewChange(_view: 'read') {
    this.selectedView.set('read');
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openQuizzModal(quizzs: Quizz[]) {
    if (!quizzs?.length) return;
    this.activeQuizzs.set(quizzs);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal() {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
  }

  openEditComicDialog(comic: Comic): void {
    const comics = this.sortedComics();
    const index = comics.findIndex(
      (item) => item.title === comic.title && item.writer === comic.writer
    );
    const dialogRef = this.dialog.open(EditComicComponent, {
      data: { comic, userId: 'admin', list: comics, index },
      width: '720px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) void this.refreshComics();
    });
  }

  onComicUpdated(): void {
    void this.refreshComics();
  }

  private matchesSearch(comic: Comic, term: string): boolean {
    const haystack = [comic.title, comic.writer, comic.designer, comic.genre]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
}
