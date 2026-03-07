import {
  Component,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameComponent } from '../../../components/collections/game/game.component';
import { AdminGamesHeaderComponent } from './games-header/games-header.component';
import { Game } from '../../../models/game-model';
import { GameView, getSortedGames } from '../../collections/games/games.utils';
import { getAllBaseGames } from '../../../facades/games/games.facade';
import { getFullGame } from '../../../helpers/full-entities-helper';
import { normalizeSearchText } from '../../../utils/normalize-search-text';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

const adminViewOptions: { value: GameView; label: string }[] = [
  { value: 'played', label: 'Voir tout' },
  { value: 'platined', label: 'Jeux platinés' },
];

@Component({
  selector: 'app-admin-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GameComponent,
    AdminGamesHeaderComponent,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class AdminGamesComponent implements OnInit {
  router = inject(Router);
  private readonly authService = inject(AuthService);

  selectedView = signal<GameView>('played');
  searchTerm = signal<string>('');
  adminGamesList = signal<Game[]>([]);

  allGames = computed<Game[]>(() => this.adminGamesList());

  visibleViewOptions = computed(() => adminViewOptions);

  platinedGames = computed<Game[]>(() =>
    this.allGames().filter((game) => game.platined)
  );

  filteredGames = computed<Game[]>(() => {
    let games = this.allGames();
    if (this.selectedView() === 'platined') {
      games = this.platinedGames();
    }
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return games;
    return games.filter((game) => this.matchesSearch(game, term));
  });

  sortedGames = computed<Game[]>(() =>
    getSortedGames([...this.filteredGames()], 'title')
  );

  isAdminView(): boolean {
    return this.authService.isAdmin() && this.router.url.startsWith('/admin');
  }

  ngOnInit(): void {
    void this.refreshGames();
  }

  async refreshGames(): Promise<void> {
    const baseGames = await getAllBaseGames();
    const games = baseGames.map(getFullGame);
    this.adminGamesList.set(games);
  }

  onViewChange(view: GameView): void {
    this.selectedView.set(view);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  private matchesSearch(game: Game, term: string): boolean {
    const haystack = [
      game.title,
      game.editor,
      game.platform,
      game.saga,
      game.hero,
    ]
      .filter(Boolean)
      .join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);
    const normalizedTerm = normalizeSearchText(term);
    return normalizedHaystack.includes(normalizedTerm);
  }

}
