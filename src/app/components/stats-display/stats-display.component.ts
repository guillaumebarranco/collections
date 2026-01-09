import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

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
}
