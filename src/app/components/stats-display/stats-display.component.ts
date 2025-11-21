import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatItem {
  label: string;
  value: string;
  icon: string;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger';
}

@Component({
  selector: 'app-stats-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-display.component.html',
  styleUrls: ['./stats-display.component.scss']
})
export class StatsDisplayComponent {
  @Input() stats: StatItem[] = [];
  @Input() count: number = 0;
  @Input() countLabel: string = 'éléments';
}