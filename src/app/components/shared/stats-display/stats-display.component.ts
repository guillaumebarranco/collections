import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  Input,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { compactStatValueForMobile } from '../../../utils/stats.utils';

export enum StatItemColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  DANGER = 'danger',
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: StatItemColor;
}

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss'],
})
export class StatsDisplayComponent {
  @Input() stats: StatItem[] = [];
  @Input() count: number = 0;
  @Input() countLabel: string = 'éléments';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly isMobileViewport = signal(false);

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const mediaQuery = window.matchMedia('(max-width: 768px)');
      const syncViewport = () => this.isMobileViewport.set(mediaQuery.matches);

      syncViewport();
      mediaQuery.addEventListener('change', syncViewport);
      this.destroyRef.onDestroy(() =>
        mediaQuery.removeEventListener('change', syncViewport)
      );
    });
  }

  displayValue(value: string): string {
    return this.isMobileViewport()
      ? compactStatValueForMobile(value)
      : value;
  }
}
