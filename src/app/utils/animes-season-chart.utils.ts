import type { Anime, UserAnimeSeason } from '../models/anime-model';
import {
  type ScanTrackingPeriod,
  SCAN_CHART_START_YEAR,
  formatActivityPeriodDurationLabel,
  parseActivityDate,
} from './dashboard-monthly-activity.utils';

function getAnimeChartKey(anime: Pick<Anime, 'title' | 'director'>): string {
  return `${anime.title}|${anime.director}`;
}

/** Dates de visionnage prises en compte sur le graphique timeline des saisons. */
export function collectSeasonViewDatesForChart(
  season: UserAnimeSeason,
  includeRewatches = true,
): string[] {
  if (!includeRewatches) {
    if (season.firstViewedDate) {
      return [season.firstViewedDate];
    }
    return season.lastViewedDate ? [season.lastViewedDate] : [];
  }

  const times = season.seasonTimesWatched ?? 1;
  if (times <= 1) {
    const dateStr = season.lastViewedDate || season.firstViewedDate;
    return dateStr ? [dateStr] : [];
  }

  const dates: string[] = [];
  const seen = new Set<string>();

  const add = (raw?: string) => {
    if (raw && !seen.has(raw)) {
      dates.push(raw);
      seen.add(raw);
    }
  };

  add(season.firstViewedDate);
  if (
    season.lastViewedDate &&
    season.lastViewedDate !== season.firstViewedDate
  ) {
    add(season.lastViewedDate);
  }
  for (const raw of season.otherViewedDates ?? []) {
    add(raw);
  }

  return dates;
}

function seasonHasChartDate(season: UserAnimeSeason): boolean {
  if (isSeasonWatchingInProgress(season)) {
    return true;
  }
  return collectSeasonViewDatesForChart(season, true).length > 0;
}

function isSeasonWatchingInProgress(season: UserAnimeSeason): boolean {
  return (
    season.watching &&
    Boolean(season.firstViewedDate?.trim()) &&
    !season.lastViewedDate?.trim()
  );
}

function seasonLabel(
  anime: Anime,
  season: UserAnimeSeason,
  suffix?: string,
): string {
  const base = `${anime.title} (S${season.seasonNumber})`;
  return suffix ? `${base} ${suffix}` : base;
}

function pushSeasonPeriod(
  periods: ScanTrackingPeriod[],
  options: {
    key: string;
    label: string;
    start: Date;
    end: Date;
    trackingKind: 'season-view' | 'season-rewatch' | 'season-in-progress';
    rangeStart: Date;
    rangeEnd: Date;
    durationLabel?: string;
  },
): void {
  const { start, end, rangeStart, rangeEnd } = options;
  if (end.getTime() < start.getTime()) {
    return;
  }
  if (
    end.getTime() < rangeStart.getTime() ||
    start.getTime() > rangeEnd.getTime()
  ) {
    return;
  }

  periods.push({
    key: options.key,
    label: options.label,
    start,
    end,
    trackingKind: options.trackingKind,
    durationLabel: options.durationLabel,
  });
}

/** Une barre par date de visionnage (comme les lectures de livres), sauf saison en cours sans fin. */
export function getAnimesSeasonTrackingPeriods(
  animes: Anime[],
  includeRewatches = true,
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date(),
): ScanTrackingPeriod[] {
  const rangeStart = new Date(startYear, 0, 1);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(reference);
  rangeEnd.setHours(23, 59, 59, 999);

  const periods: ScanTrackingPeriod[] = [];

  for (const anime of animes) {
    for (const season of anime.seasons ?? []) {
      if ((season.seasonTimesWatched ?? 0) <= 0) {
        continue;
      }

      if (isSeasonWatchingInProgress(season)) {
        const start = parseActivityDate(season.firstViewedDate);
        if (start) {
          start.setHours(0, 0, 0, 0);
          const end = new Date(reference);
          end.setHours(23, 59, 59, 999);
          pushSeasonPeriod(periods, {
            key: `${getAnimeChartKey(anime)}|s${season.seasonNumber}|progress`,
            label: seasonLabel(anime, season, '· en cours'),
            start,
            end,
            trackingKind: 'season-in-progress',
            rangeStart,
            rangeEnd,
            durationLabel: formatActivityPeriodDurationLabel(start, end),
          });
        }
        continue;
      }

      const dateStrings = collectSeasonViewDatesForChart(
        season,
        includeRewatches,
      );
      const parsedDates = dateStrings
        .map((dateStr) => parseActivityDate(dateStr))
        .filter((date): date is Date => date !== null)
        .sort((a, b) => a.getTime() - b.getTime());

      const showViewNumber = parsedDates.length > 1;

      parsedDates.forEach((viewDate, index) => {
        const dayStart = new Date(viewDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const suffix = showViewNumber ? `· visionnage ${index + 1}` : undefined;

        pushSeasonPeriod(periods, {
          key: `${getAnimeChartKey(anime)}|s${season.seasonNumber}|v${index}`,
          label: seasonLabel(anime, season, suffix),
          start: dayStart,
          end: dayEnd,
          trackingKind: 'season-view',
          rangeStart,
          rangeEnd,
        });
      });
    }
  }

  return periods.sort(
    (a, b) =>
      a.start.getTime() - b.start.getTime() ||
      a.label.localeCompare(b.label, 'fr'),
  );
}

export type AnimesChartListEntry = {
  title: string;
  director: string;
};

export type AnimesChartPartialDatesEntry = AnimesChartListEntry & {
  undatedSeasonsCount: number;
};

/** Animés avec au moins une saison vue mais aucune date pour le graphique timeline. */
export function getAnimesMissingFromSeasonChart(
  animes: Anime[],
): AnimesChartListEntry[] {
  return animes
    .filter((anime) => {
      const watched = (anime.seasons ?? []).filter(
        (s) => (s.seasonTimesWatched ?? 0) > 0,
      );
      if (watched.length === 0) {
        return false;
      }
      return watched.every((s) => !seasonHasChartDate(s));
    })
    .map((anime) => ({ title: anime.title, director: anime.director }))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/** Animés déjà sur le graphique avec d'autres saisons vues sans dates. */
export function getAnimesWithUndatedSeasonsOnChart(
  animes: Anime[],
  startYear = SCAN_CHART_START_YEAR,
  reference = new Date(),
): AnimesChartPartialDatesEntry[] {
  const animesOnChart = new Set(
    getAnimesSeasonTrackingPeriods(animes, true, startYear, reference).map(
      (period) => {
        const match = period.key.match(/^(.*)\|s\d+\|/);
        return match ? match[1] : period.key;
      },
    ),
  );

  return animes
    .map((anime) => {
      const onChart = animesOnChart.has(getAnimeChartKey(anime));
      if (!onChart) {
        return null;
      }
      const undatedSeasonsCount = (anime.seasons ?? []).filter(
        (s) =>
          (s.seasonTimesWatched ?? 0) > 0 && !seasonHasChartDate(s),
      ).length;
      if (undatedSeasonsCount === 0) {
        return null;
      }
      return {
        title: anime.title,
        director: anime.director,
        undatedSeasonsCount,
      };
    })
    .filter((entry): entry is AnimesChartPartialDatesEntry => entry !== null)
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}
