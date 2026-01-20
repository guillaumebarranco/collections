import { Serie } from '../models/serie-model';

export function getSerieSeasonsCount(serie: Serie): number {
  if (serie.seasonsData && serie.seasonsData.length > 0) {
    return serie.seasonsData.length;
  }
  return Math.max(0, Number(serie.nbSeasons) || 0);
}

export function getSerieTotalEpisodes(serie: Serie): number {
  if (serie.seasonsData && serie.seasonsData.length > 0) {
    return serie.seasonsData.reduce(
      (sum, season) => sum + (season.nbEpisodes || 0),
      0
    );
  }
  return Math.max(0, Number(serie.nbEpisodesTotal) || 0);
}

export function getSerieTotalLengthMinutes(serie: Serie): number {
  if (serie.seasonsData && serie.seasonsData.length > 0) {
    return serie.seasonsData.reduce(
      (sum, season) => sum + (season.totalLength || 0),
      0
    );
  }
  return Math.max(0, Number(serie.totalLength) || 0);
}

export function getSerieWatchedLengthMinutes(serie: Serie): number {
  if (
    serie.seasonsData &&
    serie.seasonsData.length > 0 &&
    serie.seasons &&
    serie.seasons.length > 0
  ) {
    const seasonsByNumber = new Map(
      serie.seasons.map((season) => [
        season.seasonNumber,
        season.seasonTimesWatched || 0,
      ])
    );
    const totalSeasonTimes = serie.seasons.reduce(
      (sum, season) => sum + (season.seasonTimesWatched || 0),
      0
    );

    if (totalSeasonTimes > 0) {
      return serie.seasonsData.reduce((sum, season) => {
        const timesWatched = seasonsByNumber.get(season.seasonNumber) || 0;
        return sum + (season.totalLength || 0) * timesWatched;
      }, 0);
    }
  }

  const totalLength = getSerieTotalLengthMinutes(serie);
  return totalLength * getSerieTotalTimesWatched(serie);
}

export function getSerieTotalTimesWatched(serie: Serie): number {
  if (serie.seasons && serie.seasons.length > 0) {
    return serie.seasons.reduce(
      (sum, season) => sum + (season.seasonTimesWatched || 0),
      0
    );
  }
  return 0;
}

export function getSerieAverageRating(serie: Serie): number {
  if (serie.seasons && serie.seasons.length > 0) {
    const ratings = serie.seasons.map((season) => season.seasonRating || 0);
    const hasAnyRating = ratings.some((rating) => rating > 0);
    if (!hasAnyRating) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating, 0);
    return total / ratings.length;
  }
  return 0;
}
