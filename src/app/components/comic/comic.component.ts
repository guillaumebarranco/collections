import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EntityCardComponent } from '../entity-card/entity-card.component';
import { AuthService } from '../../core/auth.service';
import { Comic } from '../../models/comic-model';

interface StarInfo {
  type: 'full' | 'half' | 'empty';
  value: number;
}

@Component({
  selector: 'app-comic',
  standalone: true,
  imports: [CommonModule, EntityCardComponent],
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  @Input() comic!: Comic;
  @Output() editRequested = new EventEmitter<void>();

  readonly canEdit = computed(() => {
    const directId = this.activatedRoute.snapshot.params['id'];
    const parentId = this.activatedRoute.parent?.snapshot.params['id'];
    return this.authService.canEdit(directId || parentId);
  });

  requestEdit(): void {
    this.editRequested.emit();
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
