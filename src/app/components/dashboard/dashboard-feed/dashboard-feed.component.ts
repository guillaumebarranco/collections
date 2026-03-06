import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { FeedResponse } from '../../../models/feed-model';

@Component({
  selector: 'app-dashboard-feed',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-feed.component.html',
  styleUrls: ['./dashboard-feed.component.scss'],
})
export class DashboardFeedComponent {
  /** Données du feed (activité des utilisateurs suivis sur le dernier mois). */
  feedData = input.required<FeedResponse>();

  getUserName(userId: string): string {
    return this.capitalizeFirstLetter(userId);
  }

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }
}
