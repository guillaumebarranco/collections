import {
  Component,
  OnInit,
  computed,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/menu/menu.component';
import { QuizzModalComponent } from '../../../components/quizz-modal/quizz-modal.component';
import { Quizz, EntityType } from '../../../models/quizz-model';
import { getAllQuizzs } from '../../../facades/quizzs/quizzs.facade';
import { getAllBaseBooks } from '../../../facades/books/books.facade';
import { getAllBaseMovies } from '../../../facades/movies/movies.facade';
import { getAllBaseSeries } from '../../../facades/series/series.facade';
import { getAllBaseGames } from '../../../facades/games/games.facade';
import { getAllBaseBds } from '../../../facades/bds/bds.facade';
import { getAllBaseComics } from '../../../facades/comics/comics.facade';
import { getAllBaseMangas } from '../../../facades/mangas/mangas.facade';
import { getAllBaseManwhas } from '../../../facades/manwhas/manwhas.facade';

export interface QuizzCardGroup {
  entityType: EntityType;
  entityTitle: string;
  entityTypeLabel: string;
  coverUrl: string;
  quizzs: Quizz[];
}

const ENTITY_TYPE_LABELS: Record<EntityType, string> = {
  [EntityType.MOVIE]: 'Film',
  [EntityType.SERIE]: 'Série',
  [EntityType.BOOK]: 'Livre',
  [EntityType.GAME]: 'Jeu',
  [EntityType.BD]: 'BD',
  [EntityType.COMIC]: 'Comic',
  [EntityType.MANGA]: 'Manga',
  [EntityType.MANWHA]: 'Manwha',
};

const PLACEHOLDER_COVER =
  'https://placehold.co/200x280/e8e4f0/5a4a7a?text=Quizz';

function getEntityTypeLabel(type: EntityType): string {
  return ENTITY_TYPE_LABELS[type] ?? type;
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function buildCoverMapKey(entityType: EntityType, title: string): string {
  return `${entityType}|${normalizeTitle(title)}`;
}

/** Construit une map entityType|titleNormalized -> coverUrl à partir des bases. */
async function loadEntityCoverMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const [books, movies, series, games, bds, comics, mangas, manwhas] =
    await Promise.all([
      getAllBaseBooks(),
      getAllBaseMovies(),
      getAllBaseSeries(),
      getAllBaseGames(),
      getAllBaseBds(),
      getAllBaseComics(),
      getAllBaseMangas(),
      getAllBaseManwhas(),
    ]);

  const addAll = (type: EntityType, items: { title: string; coverUrl: string }[]) => {
    items.forEach((item) => {
      if (item.coverUrl) {
        map.set(buildCoverMapKey(type, item.title), item.coverUrl);
      }
    });
  };

  addAll(EntityType.BOOK, books);
  addAll(EntityType.MOVIE, movies);
  addAll(EntityType.SERIE, series);
  addAll(EntityType.GAME, games);
  addAll(EntityType.BD, bds);
  addAll(EntityType.COMIC, comics);
  addAll(EntityType.MANGA, mangas);
  addAll(EntityType.MANWHA, manwhas);
  return map;
}

function groupQuizzsByEntity(
  quizzs: Quizz[],
  coverMap: Map<string, string>
): QuizzCardGroup[] {
  const map = new Map<string, Quizz[]>();
  for (const q of quizzs) {
    const key = `${q.entityType}|${q.entityTitle}`;
    const list = map.get(key) ?? [];
    list.push(q);
    map.set(key, list);
  }
  const groups: QuizzCardGroup[] = [];
  map.forEach((list, key) => {
    const first = list[0];
    const coverKey = buildCoverMapKey(first.entityType, first.entityTitle);
    const coverUrl = coverMap.get(coverKey) ?? PLACEHOLDER_COVER;
    groups.push({
      entityType: first.entityType,
      entityTitle: first.entityTitle,
      entityTypeLabel: getEntityTypeLabel(first.entityType),
      coverUrl,
      quizzs: list,
    });
  });
  return groups.sort((a, b) => a.entityTitle.localeCompare(b.entityTitle));
}

@Component({
  selector: 'app-quizzs',
  standalone: true,
  imports: [CommonModule, MenuComponent, QuizzModalComponent],
  templateUrl: './quizzs.component.html',
  styleUrls: ['./quizzs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizzsComponent implements OnInit {
  private loading = signal<boolean>(true);
  private quizzsRaw = signal<Quizz[]>([]);
  private coverMap = signal<Map<string, string>>(new Map());

  readonly isLoading = this.loading;
  readonly cardGroups = computed<QuizzCardGroup[]>(() =>
    groupQuizzsByEntity(this.quizzsRaw(), this.coverMap())
  );

  isQuizzModalOpen = signal<boolean>(false);
  activeQuizzs = signal<Quizz[]>([]);
  preselectedQuizz = signal<Quizz | null>(null);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [list, covers] = await Promise.all([
        getAllQuizzs(),
        loadEntityCoverMap(),
      ]);
      this.quizzsRaw.set(list);
      this.coverMap.set(covers);
    } finally {
      this.loading.set(false);
    }
  }

  openQuizz(quizz: Quizz): void {
    this.activeQuizzs.set([quizz]);
    this.preselectedQuizz.set(quizz);
    this.isQuizzModalOpen.set(true);
  }

  closeQuizzModal(): void {
    this.isQuizzModalOpen.set(false);
    this.activeQuizzs.set([]);
    this.preselectedQuizz.set(null);
  }
}
