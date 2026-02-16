import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityType } from '../../models/quizz-model';

/** Données communes à l’entité affichée dans la carte (note, priorité, type, etc.). */
export interface EntityCardEntityData {
  rating: number;
  hasRatingComment: boolean;
  currentPriority: 1 | 2 | 3;
  entityType: EntityType;
  wantToReRead: boolean;
}

export interface EntityCardRatingLabels {
  viewComment: string;
  addFromList: string;
  addToList: string;
  alreadyInList: string;
  wantToReRead: string;
  alreadyWantToReRead: string;
  haveReRead: string;
}

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-entity-card-rating-and-buttons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entity-card-rating-and-buttons.component.html',
  styleUrls: ['./entity-card-rating-and-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardRatingAndButtonsComponent {
  @Input() entityData!: EntityCardEntityData;
  @Input() recommendationText = '';
  @Input() recommendationBadge = '';
  @Input() showAddToListButton = true;
  @Input() isInList = false;
  @Input() selectedView = '';
  @Input() showRating = true;
  /** Override optionnel des libellés par défaut (déduits de entityType). */
  @Input() labels: Partial<EntityCardRatingLabels> = {};

  @Output() openReview = new EventEmitter<void>();
  @Output() priorityUpdated = new EventEmitter<number>();
  @Output() addFromList = new EventEmitter<void>();
  @Output() addToList = new EventEmitter<void>();
  @Output() wantToReReadClick = new EventEmitter<void>();
  @Output() haveReReadClick = new EventEmitter<void>();

  get rating(): number {
    return this.entityData?.rating ?? 0;
  }

  get hasRatingComment(): boolean {
    return this.entityData?.hasRatingComment ?? false;
  }

  get currentPriority(): 1 | 2 | 3 {
    return (this.entityData?.currentPriority ?? 1) as 1 | 2 | 3;
  }

  get wantToReRead(): boolean {
    return this.entityData?.wantToReRead ?? false;
  }

  get reReadViewName(): string {
    return this.getReReadViewNameForType(this.entityData?.entityType);
  }

  get listViewName(): string {
    return this.getListViewNameForType(this.entityData?.entityType);
  }

  /** True quand la vue courante est la vue liste (readlist, watchlist, gamelist). */
  get isReadlistView(): boolean {
    return this.selectedView === this.listViewName;
  }

  get effectiveLabels(): EntityCardRatingLabels {
    const defaultLabels = this.getDefaultLabelsForType(
      this.entityData?.entityType
    );
    return { ...defaultLabels, ...this.labels };
  }

  private getDefaultLabelsForType(
    entityType: EntityType | undefined
  ): EntityCardRatingLabels {
    switch (entityType) {
      case 'bd':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu cette BD",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire cette BD',
          alreadyWantToReRead: 'Déjà ajouté à vos BDs à relire',
          haveReRead: "J'ai relu cette BD",
        };
      case 'book':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu ce livre",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire ce livre',
          alreadyWantToReRead: 'Déjà ajouté à vos livres à relire',
          haveReRead: "J'ai relu ce livre",
        };
      case 'manga':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu ce manga",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire ce manga',
          alreadyWantToReRead: 'Déjà ajouté à vos mangas à relire',
          haveReRead: "J'ai relu ce manga",
        };
      case 'comic':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu ce comic",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire ce comic',
          alreadyWantToReRead: 'Déjà ajouté à vos comics à relire',
          haveReRead: "J'ai relu ce comic",
        };
      case 'manwha':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu ce manwha",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire ce manwha',
          alreadyWantToReRead: 'Déjà ajouté à vos manwhas à relire',
          haveReRead: "J'ai relu ce manwha",
        };
      case 'movie':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai vu ce film",
          addToList: 'Ajouter à ma watchlist',
          alreadyInList: 'Déjà dans votre watchlist',
          wantToReRead: 'Je veux revoir ce film',
          alreadyWantToReRead: 'Déjà ajouté à vos films à revoir',
          haveReRead: "J'ai revu ce film",
        };
      case 'game':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai joué à ce jeu",
          addToList: 'Ajouter à ma gamelist',
          alreadyInList: 'Déjà dans votre gamelist',
          wantToReRead: 'Je veux rejouer à ce jeu',
          alreadyWantToReRead: 'Déjà ajouté à vos jeux à rejouer',
          haveReRead: "J'ai rejoué à ce jeu",
        };
      case 'serie':
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai vu cette série",
          addToList: 'Ajouter à ma watchlist',
          alreadyInList: 'Déjà dans votre watchlist',
          wantToReRead: 'Je veux revoir cette série',
          alreadyWantToReRead: 'Déjà ajouté à vos séries à revoir',
          haveReRead: "J'ai revu cette série",
        };
      default:
        return {
          viewComment: 'Voir le commentaire',
          addFromList: "J'ai lu cette BD",
          addToList: 'Ajouter à ma readlist',
          alreadyInList: 'Déjà dans votre readlist',
          wantToReRead: 'Je veux relire cette BD',
          alreadyWantToReRead: 'Déjà ajouté à vos BDs à relire',
          haveReRead: "J'ai relu cette BD",
        };
    }
  }

  private getReReadViewNameForType(entityType: EntityType | undefined): string {
    switch (entityType) {
      case 'movie':
      case 'serie':
        return 'toReWatch';
      case 'game':
        return 'toRePlay';
      default:
        return 'toReRead';
    }
  }

  private getListViewNameForType(entityType: EntityType | undefined): string {
    switch (entityType) {
      case 'movie':
      case 'serie':
        return 'watchlist';
      case 'game':
        return 'gamelist';
      default:
        return 'readlist';
    }
  }

  getRatingStars(rating: number): StarInfo[] {
    const stars: StarInfo[] = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push({ type: 'full', value: i });
      } else if (rating >= i - 0.5) {
        stars.push({ type: 'half', value: i });
      } else {
        stars.push({ type: 'empty', value: i });
      }
    }
    return stars;
  }

  get priorities(): [1, 2, 3] {
    return [1, 2, 3];
  }

  onOpenReview(): void {
    this.openReview.emit();
  }

  onPriorityUpdated(priority: number): void {
    this.priorityUpdated.emit(priority);
  }

  onAddFromList(): void {
    this.addFromList.emit();
  }

  onAddToList(): void {
    this.addToList.emit();
  }

  onWantToReReadClick(): void {
    this.wantToReReadClick.emit();
  }

  onHaveReReadClick(): void {
    this.haveReReadClick.emit();
  }
}
