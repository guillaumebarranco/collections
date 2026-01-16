import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Book } from '../../models/book-model';
import { EditBookComponent } from '../../containers/edit/edit-book/edit-book.component';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  @Input() book!: Book;
  @Output() bookUpdated = new EventEmitter<void>();

  navigateToEdit(): void {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    const userId = directId || parentId;
    const dialogRef = this.dialog.open(EditBookComponent, {
      data: {
        book: this.book,
        userId: userId || 'guillaume',
      },
      width: '720px',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.bookUpdated.emit();
      }
    });
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
}
