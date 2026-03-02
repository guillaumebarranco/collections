import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MangaComponent } from '../../../components/collections/manga/manga.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { QuizzModalComponent } from '../../../components/modals/quizz-modal/quizz-modal.component';
import { Manga } from '../../../models/manga-model';
import { Quizz } from '../../../models/quizz-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getSortedMangas } from '../../collections/mangas/mangas.utils';
import { getFullManga } from '../../../helpers/full-entities-helper';
import { AdminMangasHeaderComponent } from './mangas-header/mangas-header.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { EditMangaComponent } from '../../edit/edit-manga/edit-manga.component';

@Component({
  selector: 'app-admin-mangas',
  imports: [
    CommonModule,
    MangaComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    AdminMangasHeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMangasComponent implements OnInit {
  private readonly dialog = inject(MatDialog);

  selectedView = signal<'read'>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  isLoadingMangas = signal<boolean>(true);
  adminMangasList = signal<Manga[]>([]);

  allMangas = computed<Manga[]>(() => this.adminMangasList());

  filteredMangas = computed<Manga[]>(() => {
    const mangas = this.allMangas();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return mangas;
    return mangas.filter((manga) => this.matchesSearch(manga, term));
  });

  sortedMangas = computed<Manga[]>(() =>
    getSortedMangas([...this.filteredMangas()], 'title')
  );

  visibleViewOptions = computed(() => [
    { value: 'read' as const, label: 'Voir tout' },
  ]);

  ngOnInit() {
    void this.refreshMangas();
    void this.refreshQuizzs();
  }

  async refreshMangas() {
    this.isLoadingMangas.set(true);
    try {
      const baseMangas = await getAllBaseMangas();
      const mangas = baseMangas.map(getFullManga);
      this.adminMangasList.set(mangas);
    } finally {
      this.isLoadingMangas.set(false);
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

  openEditMangaDialog(manga: Manga): void {
    const mangas = this.sortedMangas();
    const index = mangas.findIndex(
      (item) => item.title === manga.title && item.author === manga.author
    );
    const dialogRef = this.dialog.open(EditMangaComponent, {
      data: { manga, userId: 'admin', list: mangas, index },
      width: '720px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) void this.refreshMangas();
    });
  }

  onMangaUpdated(): void {
    void this.refreshMangas();
  }

  private matchesSearch(manga: Manga, term: string): boolean {
    const haystack = [manga.title, manga.author, manga.genre]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = this.normalizeSearchText(haystack);
    const normalizedTerm = this.normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
