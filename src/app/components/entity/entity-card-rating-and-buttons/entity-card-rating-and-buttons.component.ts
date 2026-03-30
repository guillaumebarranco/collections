import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntityType } from '../../../models/quizz-model';

import { StarInfo } from '../../../models/various-model';
import { getRatingStars } from '../../../utils/constants';
import { CanEditDirective } from '../../../directives/can-edit.directive';

/** Données communes à l’entité affichée dans la carte (note, priorité, type, etc.). */
export interface EntityCardEntityData {
  alreadySeenRead: boolean;
  alreadyInList: boolean;
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
  /** « Je veux voir/lire/jouer… » (profil d’un autre utilisateur) */
  addToMyWishlist: string;
  /** « Tiens, j’ai déjà vu/lu/joué… » */
  addToMyDone: string;
  /** Readlist livre : « J'ai commencé ce livre » (readTimes → 0.5). */
  markStartedReading?: string;
}
@Component({
  selector: 'app-entity-card-rating-and-buttons',
  standalone: true,
  imports: [CommonModule, CanEditDirective],
  templateUrl: './entity-card-rating-and-buttons.component.html',
  styleUrls: ['./entity-card-rating-and-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntityCardRatingAndButtonsComponent {
  @Input() entityData!: EntityCardEntityData;
  @Input() recommendationText = '';
  @Input() recommendationBadge = '';
  @Input() selectedView = '';
  @Input() showRating = true;
  /** Masquer le bouton "Je veux revoir/relire" (ex. section "Films pas encore vus" en vue acteurs/sagas/...) */
  @Input() hideWantToReReadButton = false;
  /** Override optionnel des libellés par défaut (déduits de entityType). */
  @Input() labels: Partial<EntityCardRatingLabels> = {};

  /** readTimes côté readlist (0 = pas commencé, 0.5 = en cours) — pour le bouton « J'ai commencé ». */
  @Input() listReadTimes = 0;

  /** Afficher la paire de boutons « copier vers ma liste / déjà fait chez moi » (vue autre profil). */
  @Input() showAddToMyListActions = false;
  @Input() canAddToMyWishlist = false;
  @Input() canAddToMyDone = false;

  @Output() openReview = new EventEmitter<void>();
  @Output() priorityUpdated = new EventEmitter<number>();
  @Output() addFromList = new EventEmitter<void>();
  @Output() addToList = new EventEmitter<void>();
  @Output() wantToReReadClick = new EventEmitter<void>();
  @Output() haveReReadClick = new EventEmitter<void>();
  @Output() addToMyWishlist = new EventEmitter<void>();
  @Output() addToMyDone = new EventEmitter<void>();
  @Output() startedReadingClick = new EventEmitter<void>();

  showAddToListButton = computed(() => {
    if (this.entityData?.alreadySeenRead) {
      return false;
    }

    return (
      this.selectedView !==
        this.getReadViewNameForType(this.entityData?.entityType) &&
      this.selectedView !==
        this.getReReadViewNameForType(this.entityData?.entityType) &&
      !this.isReadlistLikeView() &&
      this.selectedView !==
        this.getOwnedViewNameForType(this.entityData?.entityType)
    );
  });

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

  /** Livres : readlist ou « En cours » ; autres entités : vue liste habituelle. */
  isReadlistLikeView(): boolean {
    const t = this.entityData?.entityType;
    const v = this.selectedView;
    if (t === 'book') {
      return v === 'readlist' || v === 'readingInProgress';
    }
    return v === this.listViewName;
  }

  /** True quand la vue courante est la vue liste (readlist, watchlist, gamelist). */
  get isReadlistView(): boolean {
    return this.isReadlistLikeView();
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
          addToMyWishlist: 'Je veux lire cette BD',
          addToMyDone: "Tiens, j'ai déjà lu cette BD !",
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
          addToMyWishlist: 'Je veux lire ce livre',
          addToMyDone: "Tiens, j'ai déjà lu ce livre !",
          markStartedReading: "J'ai commencé ce livre",
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
          addToMyWishlist: 'Je veux lire ce manga',
          addToMyDone: "Tiens, j'ai déjà lu ce manga !",
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
          addToMyWishlist: 'Je veux lire ce comic',
          addToMyDone: "Tiens, j'ai déjà lu ce comic !",
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
          addToMyWishlist: 'Je veux lire ce manwha',
          addToMyDone: "Tiens, j'ai déjà lu ce manwha !",
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
          addToMyWishlist: 'Je veux voir ce film',
          addToMyDone: "Tiens, j'ai déjà vu ce film !",
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
          addToMyWishlist: 'Je veux jouer à ce jeu',
          addToMyDone: "Tiens, j'ai déjà joué à ce jeu !",
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
          addToMyWishlist: 'Je veux voir cette série',
          addToMyDone: "Tiens, j'ai déjà vu cette série !",
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
          addToMyWishlist: 'Je veux lire cette BD',
          addToMyDone: "Tiens, j'ai déjà lu cette BD !",
        };
    }
  }

  private getReadViewNameForType(entityType: EntityType | undefined): string {
    switch (entityType) {
      case 'movie':
      case 'serie':
        return 'watched';
      case 'game':
        return 'played';
      default:
        return 'read';
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

  private getOwnedViewNameForType(entityType: EntityType | undefined): string {
    switch (entityType) {
      case 'movie':
      case 'serie':
        return 'owned';
      case 'game':
        return 'owned';
      default:
        return 'owned';
    }
  }

  getRatingStars(rating: number): StarInfo[] {
    return getRatingStars(rating);
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

  addToMyWishlistBtnClass(): string {
    const t = this.entityData?.entityType;
    if (t === 'movie' || t === 'serie') {
      return 'makya-btn-small add-to-my-watchlist-btn';
    }
    if (t === 'game') {
      return 'makya-btn-small add-to-my-gamelist-btn';
    }
    return 'makya-btn-small add-to-my-readlist-btn';
  }

  addToMyDoneBtnClass(): string {
    const t = this.entityData?.entityType;
    if (t === 'movie' || t === 'serie') {
      return 'makya-btn-small add-to-my-watched-btn';
    }
    if (t === 'game') {
      return 'makya-btn-small add-to-my-played-btn';
    }
    return 'makya-btn-small add-to-my-read-btn';
  }

  onAddToMyWishlistClick(): void {
    this.addToMyWishlist.emit();
  }

  onAddToMyDoneClick(): void {
    this.addToMyDone.emit();
  }

  onStartedReadingClick(): void {
    this.startedReadingClick.emit();
  }

  get showMarkStartedReadingButton(): boolean {
    return (
      this.entityData?.entityType === 'book' &&
      this.selectedView === 'readlist' &&
      this.listReadTimes === 0
    );
  }
}
