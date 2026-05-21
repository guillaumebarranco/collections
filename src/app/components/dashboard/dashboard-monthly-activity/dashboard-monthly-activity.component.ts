import { Component, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Book } from '../../../models/book-model';
import type { Movie } from '../../../models/movie-model';
import type { Manga } from '../../../models/manga-model';
import type { Comic } from '../../../models/comic-model';
import type { Bd } from '../../../models/bd-model';
import type { Manwha } from '../../../models/manwha-model';
import type { Serie } from '../../../models/serie-model';
import type { Game } from '../../../models/game-model';
import type { Music } from '../../../models/music-model';
import {
  ViewToggleComponent,
  type ViewToggleOption,
} from '../../shared/view-toggle/view-toggle.component';
import {
  computeActivityInRange,
  computeActivityDurationInRange,
  formatActivityDurationLabel,
  formatRolling30Intro,
  getCalendarMonthsForYear,
  getLast12CalendarMonths,
  getRolling30DaysRange,
  getYearTabYears,
  parseYearTabValue,
  yearTabValue,
  type ActivityWindowResult,
  type CalendarMonthRange,
} from '../../../utils/dashboard-monthly-activity.utils';

@Component({
  selector: 'app-dashboard-monthly-activity',
  standalone: true,
  imports: [CommonModule, ViewToggleComponent],
  templateUrl: './dashboard-monthly-activity.component.html',
  styleUrls: ['./dashboard-monthly-activity.component.scss'],
})
export class DashboardMonthlyActivityComponent {
  readonly books = input<Book[]>([]);
  readonly mangas = input<Manga[]>([]);
  readonly comics = input<Comic[]>([]);
  readonly bds = input<Bd[]>([]);
  readonly manwhas = input<Manwha[]>([]);
  readonly movies = input<Movie[]>([]);
  readonly series = input<Serie[]>([]);
  readonly games = input<Game[]>([]);
  readonly musics = input<Music[]>([]);

  readonly periodTab = signal<string>('rolling30');

  readonly periodOptions = computed<ViewToggleOption[]>(() => {
    const years = getYearTabYears();
    return [
      { value: 'rolling30', label: '30 derniers jours' },
      { value: 'yearly', label: '12 derniers mois' },
      ...years.map((y) => ({ value: yearTabValue(y), label: String(y) })),
    ];
  });

  private readonly rollingRange = computed(() => getRolling30DaysRange());

  readonly rollingIntro = computed(() =>
    formatRolling30Intro(this.rollingRange()),
  );

  readonly rollingActivity = computed<ActivityWindowResult>(() => {
    const r = this.rollingRange();
    return computeActivityInRange(
      this.books(),
      this.mangas(),
      this.comics(),
      this.bds(),
      this.manwhas(),
      this.movies(),
      this.series(),
      this.games(),
      this.musics(),
      r.start,
      r.end,
    );
  });

  readonly periodRangeIntro = computed(() => {
    const tab = this.periodTab();
    if (tab === 'yearly') {
      return (
        'Chaque bloc correspond à un mois calendaire complet (du 1er au dernier jour), ' +
        'du plus récent au plus ancien.'
      );
    }
    const year = parseYearTabValue(tab);
    if (year != null) {
      return (
        `Chaque bloc correspond à un mois calendaire complet de ${year} ` +
        '(du 1er au dernier jour), du plus récent au plus ancien.'
      );
    }
    return '';
  });

  private readonly calendarMonthsForPeriod = computed((): CalendarMonthRange[] => {
    const tab = this.periodTab();
    if (tab === 'yearly') {
      return getLast12CalendarMonths();
    }
    const year = parseYearTabValue(tab);
    if (year != null) {
      return getCalendarMonthsForYear(year);
    }
    return [];
  });

  readonly monthlyRows = computed(() => {
    const months = this.calendarMonthsForPeriod();
    return months.map((m) => {
      const activity = computeActivityInRange(
        this.books(),
        this.mangas(),
        this.comics(),
        this.bds(),
        this.manwhas(),
        this.movies(),
        this.series(),
        this.games(),
        this.musics(),
        m.rangeStart,
        m.rangeEnd,
      );
      const duration = computeActivityDurationInRange(
        this.books(),
        this.mangas(),
        this.comics(),
        this.bds(),
        this.manwhas(),
        this.movies(),
        this.series(),
        m.rangeStart,
        m.rangeEnd,
      );
      return {
        key: m.key,
        label: m.label,
        readingDurationLabel: formatActivityDurationLabel(
          duration.readingMinutes,
          'lecture',
        ),
        viewingDurationLabel: formatActivityDurationLabel(
          duration.viewingMinutes,
          'visionnage',
        ),
        samples: activity.samples,
        total:
          activity.counts.books +
          activity.counts.mangas +
          activity.counts.comics +
          activity.counts.bds +
          activity.counts.manwhas +
          activity.counts.movies +
          activity.counts.series,
      };
    });
  });

  onPeriodChange(value: string): void {
    if (
      value === 'rolling30' ||
      value === 'yearly' ||
      parseYearTabValue(value) != null
    ) {
      this.periodTab.set(value);
    }
  }
}
