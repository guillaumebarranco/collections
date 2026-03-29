import { MatDialog } from '@angular/material/dialog';
import {
  CollectionEntityFollowUpModalComponent,
  type CollectionEntityFollowUpModalData,
} from '../components/modals/collection-entity-follow-up-modal/collection-entity-follow-up-modal.component';

export function openCollectionEntityFollowUpModal(
  dialog: MatDialog,
  data: CollectionEntityFollowUpModalData
): void {
  dialog.open(CollectionEntityFollowUpModalComponent, {
    data,
    width: 'min(440px, 95vw)',
    maxHeight: '90vh',
    panelClass: 'collection-entity-follow-up-dialog',
    autoFocus: '.entity-follow-up__footer .makya-btn',
  });
}
