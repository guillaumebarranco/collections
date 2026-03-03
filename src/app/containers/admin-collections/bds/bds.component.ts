import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdComponent } from '../../../components/collections/bd/bd.component';
import { MenuComponent } from '../../../components/menu/menu.component';
import { QuizzModalComponent } from '../../../components/modals/quizz-modal/quizz-modal.component';
import { Bd } from '../../../models/bd-model';
import { Quizz } from '../../../models/quizz-model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getSortedBds } from '../../collections/bds/bds.utils';
import { getFullBd } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { AdminBdsHeaderComponent } from './bds-header/bds-header.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';

import { EditBdComponent } from '../../edit/edit-bd/edit-bd.component';

@Component({
  selector: 'app-admin-bds',
  imports: [
    CommonModule,
    BdComponent,
    MenuComponent,
    MatDialogModule,
    QuizzModalComponent,
    AdminBdsHeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './bds.component.html',
  styleUrls: ['./bds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBdsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);

  selectedView = signal<'read'>('read');
  searchTerm = signal<string>('');
  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  quizzs = signal<Quizz[]>([]);
  isLoadingBds = signal<boolean>(true);
  adminBdsList = signal<Bd[]>([]);

  allBds = computed<Bd[]>(() => this.adminBdsList());

  filteredBds = computed<Bd[]>(() => {
    const bds = this.allBds();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return bds;
    return bds.filter((bd) => this.matchesSearch(bd, term));
  });

  sortedBds = computed<Bd[]>(() =>
    getSortedBds([...this.filteredBds()], 'title')
  );

  visibleViewOptions = computed(() => [
    { value: 'read' as const, label: 'Voir tout' },
  ]);

  ngOnInit() {
    void this.refreshBds();
  }

  async refreshBds() {
    this.isLoadingBds.set(true);
    try {
      const baseBds = await getAllBaseBds();
      const bds = baseBds.map(getFullBd);
      this.adminBdsList.set(bds);
    } finally {
      this.isLoadingBds.set(false);
    }
  }

  onViewChange(_view: 'read') {
    this.selectedView.set('read');
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openEditBdDialog(bd: Bd): void {
    const bds = this.sortedBds();
    const index = bds.findIndex(
      (item) => item.title === bd.title && item.writer === bd.writer
    );
    const dialogRef = this.dialog.open(EditBdComponent, {
      data: { bd, userId: 'admin', list: bds, index },
      width: '720px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) void this.refreshBds();
    });
  }

  onBdUpdated(): void {
    void this.refreshBds();
  }

  private matchesSearch(bd: Bd, term: string): boolean {
    const haystack = [bd.title, bd.writer, bd.designer, bd.genre]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

}
