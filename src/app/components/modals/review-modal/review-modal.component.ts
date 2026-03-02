import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface ReviewModalData {
  workTitle: string;
  rating: number;
  ratingComment: string;
  userName: string;
}

@Component({
  selector: 'app-review-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './review-modal.component.html',
  styleUrls: ['./review-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ReviewModalComponent>);
  readonly data = inject<ReviewModalData>(MAT_DIALOG_DATA);

  get reviewTitle(): string {
    const name = this.data.userName;
    const capitalized =
      name.length > 0 ? name.charAt(0).toUpperCase() + name.slice(1) : name;
    return `Review de ${capitalized}`;
  }

  getStars(rating: number): Array<'full' | 'half' | 'empty'> {
    const stars: Array<'full' | 'half' | 'empty'> = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('full');
      else if (rating >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }
    return stars;
  }

  close(): void {
    this.dialogRef.close();
  }
}
