import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { ViewToggleComponent } from '../../../../components/view-toggle/view-toggle.component';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';
import { GameView } from '../../../collections/games/games.utils';
import { FormsModule } from '@angular/forms';
import { AddGameComponent } from '../../../add/add-game/add-game.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-games-header',
  imports: [
    RouterModule,
    FormsModule,
    ViewToggleComponent,
    MatDialogModule,
  ],
  templateUrl: './games-header.component.html',
  styleUrls: ['./games-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGamesHeaderComponent {
  onViewChange = output<GameView>();
  onSearchChange = output<string>();

  selectedView = input<GameView>('played');
  searchTermInput = input<string>('');
  filteredGamesCount = input<number>(0);
  viewOptions = input<
    {
      value: GameView;
      label: string;
    }[]
  >([]);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  searchTerm = signal<string>('');

  constructor() {
    effect(() => {
      this.searchTerm.set(this.searchTermInput());
    });
  }

  gamesPageTitle = computed(() => {
    if (this.isAdminView()) {
      return `Jeux (${this.filteredGamesCount()})`;
    }
    return 'Jeux';
  });

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  openAddGameAdminDialog(): void {
    const dialogRef = this.dialog.open(AddGameComponent, {
      data: { userId: 'admin' },
      width: '760px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created) {
        this.router.navigate(['/admin/games']);
      }
    });
  }
}
