import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { BaseBd, Bd } from '../../../../models/bd-model';
import {
  getAllBdsMerged,
  getCurrentReadlistBdsByUser,
  getBdsByUser,
  getAllBaseBds,
} from '../../../../facades/bds/bds.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddBdComponent } from '../../../add/add-bd/add-bd.component';
import { RequestEntityAddModalComponent } from '../../../../components/modals/request-entity-add-modal/request-entity-add-modal.component';
import { getApiBaseUrl } from '../../../../core/config';
import { SelectEntityComponent } from '../../../../components/entity/select-entity/select-entity.component';
import { getEmptyBd } from '../../../../helpers/empty-entities-helper';
import { normalizeSearchText } from '../../../../utils/normalize-search-text';

@Component({
  selector: 'app-select-bds',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-bds.component.html',
  styleUrls: ['./select-bds.component.scss', '../../select-base.scss'],
})
export class SelectBdsComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  baseBds = signal<BaseBd[]>([]);
  userBds = signal<Bd[]>([]);
  readlistBds = signal<Bd[]>([]);
  allBdsMergedList = signal<Bd[]>([]);
  searchTerm = signal('');

  readBds = computed<Set<string>>(() => {
    const userBds = this.userBds();
    return new Set(userBds.map((bd) => this.getBdKey(bd)));
  });

  /** Au moins une BD lue issue du catalogue — pour afficher l’ajout manuel. */
  hasReadBdsFromExistingCatalog = computed(() => {
    const baseKeys = new Set(
      this.baseBds().map((b) => `${b.title}-${b.writer}`)
    );
    return this.userBds().some((bd) => baseKeys.has(this.getBdKey(bd)));
  });

  alreadyInReadlistBds = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistBds = this.readlistBds();
    return new Set(readlistBds.map((bd) => this.getBdKey(bd)));
  });

  allBds = computed<Bd[]>(() => {
    const allBdsList = this.baseBds().map(getEmptyBd);

    if (!this.isWatchOrReadlistMode()) {
      return allBdsList.filter(
        (bd) =>
          !this.readBds().has(this.getBdKey(bd)) &&
          !this.alreadyInReadlistBds().has(this.getBdKey(bd))
      );
    }

    return allBdsList.filter(
      (bd) =>
        !this.readBds().has(this.getBdKey(bd)) &&
        !this.alreadyInReadlistBds().has(this.getBdKey(bd))
    );
  });

  filteredBds = computed<Bd[]>(() => {
    const normalizedTerm = normalizeSearchText(this.searchTerm().trim());
    const list = this.allBds();
    if (!normalizedTerm) return list;
    return list.filter((bd) => {
      const title = normalizeSearchText(bd.title ?? '');
      const writer = normalizeSearchText(bd.writer ?? '');
      const designer = normalizeSearchText(bd.designer ?? '');
      return (
        title.includes(normalizedTerm) ||
        writer.includes(normalizedTerm) ||
        designer.includes(normalizedTerm)
      );
    });
  });

  selectedBds = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedBds().size);

  isSelected(bd: Bd): boolean {
    return this.selectedBds().has(this.getBdKey(bd));
  }

  private getBdKey(bd: Bd): string {
    return `${bd.title}-${bd.writer}`;
  }

  toggleSelection(bd: Bd): void {
    const key = this.getBdKey(bd);
    const selected = new Set(this.selectedBds());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedBds.set(selected);
  }

  openRequestEntityAddDialog(): void {
    this.dialog.open(RequestEntityAddModalComponent, {
      data: { entityType: 'bd', userId: this.userId() },
      width: '480px',
      maxWidth: '95vw',
    });
  }

  openAddBdDialog(): void {
    const dialogRef = this.dialog.open(AddBdComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/bds`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [baseBds, bds, readlist] = await Promise.all([
      getAllBaseBds(),
      getBdsByUser(userId),
      getCurrentReadlistBdsByUser(userId),
    ]);
    const allBds = await this.getAllBdsForSelection(userId);
    this.baseBds.set(baseBds);
    this.userBds.set(bds);
    this.readlistBds.set(readlist);
    this.allBdsMergedList.set(allBds);
  }

  private async getAllBdsForSelection(_userId: string): Promise<Bd[]> {
    return (await getAllBaseBds()).map(getEmptyBd);
  }

  protected async addSelectedBds(): Promise<void> {
    const selectedBdsList = this.allBds()
      .filter((bd) => this.isSelected(bd))
      .map((bd) => {
        return {
          ...bd,
          readTimes: this.isWatchOrReadlistMode() ? 0 : 1,
          rating: 0,
          readDate: '',
        };
      });

    const bds = selectedBdsList.map((bd) => ({
      title: bd.title,
      writer: bd.writer,
    }));

    if (bds.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/bds/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          bds,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des bds :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/bds`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des bds.", error);
    }
  }
}
