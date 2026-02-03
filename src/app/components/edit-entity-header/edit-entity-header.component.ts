import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  Input,
} from '@angular/core';
import { isBaseEntityView } from '../../core/config';
import { EntityType } from '../../models/quizz-model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-entity-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-entity-header.component.html',
  styleUrls: ['./edit-entity-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditEntityHeaderComponent {
  navigateToEntityList = output<void>();
  navigatePrevious = output<void>();
  navigateNext = output<void>();

  entity = input<EntityType>();
  @Input() dialogRef: any;
  canNavigatePrevious = input<boolean>(false);
  canNavigateNext = input<boolean>(false);
  dialogPositionLabel = input<string>('');
  hasDialogNavigation = input<boolean>(false);

  isBaseEntityView = isBaseEntityView();

  isDialogMode(): boolean {
    return Boolean(this.dialogRef);
  }

  getBackLinkText(): string {
    switch (this.entity()) {
      case EntityType.BOOK:
        return 'livres';
      case EntityType.SERIE:
        return 'séries';
      case EntityType.BD:
        return 'BDs';
      case EntityType.MOVIE:
        return 'films';
      case EntityType.MANWHA:
        return 'manwhas';
      case EntityType.MANGA:
        return 'mangas';
      case EntityType.GAME:
        return 'jeux';
      case EntityType.COMIC:
        return 'comics';
    }
    return 'entités';
  }
}
