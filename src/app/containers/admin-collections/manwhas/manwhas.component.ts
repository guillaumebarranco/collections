import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManwhaComponent } from '../../../components/collections/manwha/manwha.component';
import { MenuComponent } from '../../../components/menu/menu.component';

import { Manwha } from '../../../models/manwha-model';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';
import { getSortedManwhas } from '../../collections/manwhas/manwhas.utils';
import { getFullManwha } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { AdminManwhasHeaderComponent } from './manwhas-header/manwhas-header.component';
import { LoaderComponent } from '../../../components/shared/loader/loader.component';

import { EditManwhaComponent } from '../../edit/edit-manwha/edit-manwha.component';

@Component({
  selector: 'app-admin-manwhas',
  imports: [
    CommonModule,
    ManwhaComponent,
    MenuComponent,
    MatDialogModule,

    AdminManwhasHeaderComponent,
    LoaderComponent,
  ],
  templateUrl: './manwhas.component.html',
  styleUrls: ['./manwhas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminManwhasComponent implements OnInit {
  private readonly dialog = inject(MatDialog);

  selectedView = signal<'read'>('read');
  searchTerm = signal<string>('');

  isLoadingManwhas = signal<boolean>(true);
  adminManwhasList = signal<Manwha[]>([]);

  allManwhas = computed<Manwha[]>(() => this.adminManwhasList());

  filteredManwhas = computed<Manwha[]>(() => {
    const manwhas = this.allManwhas();
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return manwhas;
    return manwhas.filter((manwha) => this.matchesSearch(manwha, term));
  });

  sortedManwhas = computed<Manwha[]>(() =>
    getSortedManwhas([...this.filteredManwhas()], 'title')
  );

  visibleViewOptions = computed(() => [
    { value: 'read' as const, label: 'Voir tout' },
  ]);

  ngOnInit() {
    void this.refreshManwhas();
  }

  async refreshManwhas() {
    this.isLoadingManwhas.set(true);
    try {
      const baseManwhas = await getAllBaseManwhas();
      const manwhas = baseManwhas.map(getFullManwha);
      this.adminManwhasList.set(manwhas);
    } finally {
      this.isLoadingManwhas.set(false);
    }
  }

  onViewChange(_view: 'read') {
    this.selectedView.set('read');
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  openEditManwhaDialog(manwha: Manwha): void {
    const manwhas = this.sortedManwhas();
    const index = manwhas.findIndex(
      (item) => item.title === manwha.title && item.author === manwha.author
    );
    const dialogRef = this.dialog.open(EditManwhaComponent, {
      data: { manwha, userId: 'admin', list: manwhas, index },
      width: '720px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) void this.refreshManwhas();
    });
  }

  onManwhaUpdated(): void {
    void this.refreshManwhas();
  }

  private matchesSearch(manwha: Manwha, term: string): boolean {
    const haystack = [manwha.title, manwha.author, manwha.genre]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }
}
