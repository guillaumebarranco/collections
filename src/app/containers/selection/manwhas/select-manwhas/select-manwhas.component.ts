import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../../components/menu/menu.component';
import { Manwha } from '../../../../models/manwha-model';
import {
  getAllManwhasMerged,
  getCurrentReadlistManwhasByUser,
  getManwhasByUser,
} from '../../../../facades/manwhas/manwhas.facade';
import { SelectEntitiesComponent } from '../../select-base.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddManwhaComponent } from '../../../add/add-manwha/add-manwha.component';
import { getApiBaseUrl, isLocalhost } from '../../../../core/config';
import { Router } from '@angular/router';
import { SelectEntityComponent } from '../../../../components/select-entity/select-entity.component';

@Component({
  selector: 'app-select-manwhas',
  imports: [
    CommonModule,
    MenuComponent,
    MatDialogModule,
    SelectEntityComponent,
  ],
  templateUrl: './select-manwhas.component.html',
  styleUrls: ['./select-manwhas.component.scss', '../../select-base.scss'],
})
export class SelectManwhasComponent
  extends SelectEntitiesComponent
  implements OnInit
{
  private readonly dialog = inject(MatDialog);

  userManwhas = signal<Manwha[]>([]);
  readlistManwhas = signal<Manwha[]>([]);
  allManwhasMergedList = signal<Manwha[]>([]);
  searchTerm = signal('');

  readManwhas = computed<Set<string>>(() => {
    const userManwhas = this.userManwhas();
    return new Set(userManwhas.map((manwha) => this.getManwhaKey(manwha)));
  });

  alreadyInReadlistManwhas = computed<Set<string>>(() => {
    if (!this.isWatchOrReadlistMode()) {
      return new Set();
    }
    const readlistManwhas = this.readlistManwhas();
    return new Set(readlistManwhas.map((manwha) => this.getManwhaKey(manwha)));
  });

  allManwhas = computed<Manwha[]>(() => {
    const allManwhasList = this.allManwhasMergedList();

    if (!this.isWatchOrReadlistMode()) {
      return allManwhasList.filter(
        (manwha) =>
          !this.readManwhas().has(this.getManwhaKey(manwha)) &&
          !this.alreadyInReadlistManwhas().has(this.getManwhaKey(manwha))
      );
    }

    return allManwhasList.filter(
      (manwha) =>
        !this.readManwhas().has(this.getManwhaKey(manwha)) &&
        !this.alreadyInReadlistManwhas().has(this.getManwhaKey(manwha))
    );
  });

  filteredManwhas = computed<Manwha[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.allManwhas();
    if (!term) return list;
    return list.filter((manwha) => {
      const title = manwha.title?.toLowerCase() || '';
      const author = manwha.author?.toLowerCase() || '';
      return title.includes(term) || author.includes(term);
    });
  });

  selectedManwhas = signal<Set<string>>(new Set());
  selectedCount = computed(() => this.selectedManwhas().size);

  isSelected(manwha: Manwha): boolean {
    return this.selectedManwhas().has(this.getManwhaKey(manwha));
  }

  private getManwhaKey(manwha: Manwha): string {
    return `${manwha.title}-${manwha.author}`;
  }

  toggleSelection(manwha: Manwha): void {
    const key = this.getManwhaKey(manwha);
    const selected = new Set(this.selectedManwhas());

    if (selected.has(key)) {
      selected.delete(key);
    } else {
      selected.add(key);
    }

    this.selectedManwhas.set(selected);
  }

  openAddManwhaDialog(): void {
    const dialogRef = this.dialog.open(AddManwhaComponent, {
      data: { userId: this.userId() },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate([`${this.userId()}/manwhas`]);
      }
    });
  }

  async ngOnInit() {
    const userId = this.userId();
    const [manwhas, readlist] = await Promise.all([
      getManwhasByUser(userId),
      getCurrentReadlistManwhasByUser(userId),
    ]);
    const allManwhas = await this.getAllManwhasForSelection(userId);
    this.userManwhas.set(manwhas);
    this.readlistManwhas.set(readlist);
    this.allManwhasMergedList.set(allManwhas);
  }

  private async getAllManwhasForSelection(userId: string): Promise<Manwha[]> {
    if (isLocalhost()) {
      return getAllManwhasMerged(userId);
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas/entities`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  protected async addSelectedManwhas(): Promise<void> {
    const selectedManwhasList = this.allManwhas()
      .filter((manwha) => this.isSelected(manwha))
      .map((manwha) => {
        return {
          ...manwha,
          readTimes: this.isWatchOrReadlistMode() ? 0 : 1,
          rating: 0,
          readDate: '',
        };
      });

    const manwhas = selectedManwhasList.map((manwha) => ({
      title: manwha.title,
      author: manwha.author,
    }));

    if (manwhas.length === 0) return;

    try {
      const response = await fetch(`${getApiBaseUrl()}/manwhas/add-existing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId(),
          manwhas,
          readlist: this.isWatchOrReadlistMode(),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        console.warn(
          "Échec de l'ajout batch des manwhas :",
          payload?.error || response.statusText
        );
        return;
      }

      this.router.navigate([`${this.userId()}/manwhas`]);
    } catch (error) {
      console.warn("Erreur réseau lors de l'ajout batch des manwhas.", error);
    }
  }
}
