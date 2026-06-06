/**
 * Films présents dans les données utilisateur locaux mais absents de allBaseMovies.
 * Usage : npx tsx scripts/find-orphan-user-movies.ts
 */
import type { BaseMovie, UserMovie } from '../src/app/models/movie-model';
import { allBaseMovies } from './facades/local-movies.facade';

import { amandineMovies1 } from '../src/app/utils/users/amandine/movies/amandine_movies';
import { amandineMovies2 } from '../src/app/utils/users/amandine/movies/amandine_movies_2';
import { amandineWatchlistMovies } from '../src/app/utils/users/amandine/movies/amandine_watchlist_movies';
import { bastienMovies } from '../src/app/utils/users/bastien/movies/bastien_movies';
import { bastienWatchListMovies } from '../src/app/utils/users/bastien/movies/bastien_watchlist_movies';
import { cassandreMovies } from '../src/app/utils/users/cassandre/movies/cassandre_movies';
import { cassandreWatchListMovies } from '../src/app/utils/users/cassandre/movies/cassandre_watchlist_movies';
import { clemenceMovies } from '../src/app/utils/users/clemence/movies/clemence_movies';
import { clemenceWatchListMovies } from '../src/app/utils/users/clemence/movies/clemence_watchlist_movies';
import { dantesMovies } from '../src/app/utils/users/dantes/movies/dantes_movies';
import { dantesWatchListMovies } from '../src/app/utils/users/dantes/movies/dantes_watchlist_movies';
import { emmanuelleMovies } from '../src/app/utils/users/emmanuelle/movies/emmanuelle_movies';
import { emmanuelleWatchListMovies } from '../src/app/utils/users/emmanuelle/movies/emmanuelle_watchlist_movies';
import { gigiMovies } from '../src/app/utils/users/gigi/movies/gigi_movies';
import { gigiWatchListMovies } from '../src/app/utils/users/gigi/movies/gigi_watchlist_movies';
import { guillaumeMoviesPage1 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_1';
import { guillaumeMoviesPage2 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_2';
import { guillaumeMoviesPage3 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_3';
import { guillaumeMoviesPage4 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_4';
import { guillaumeMoviesPage5 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_5';
import { guillaumeMoviesMcu } from '../src/app/utils/users/guillaume/movies/guillaume_movies_mcu';
import { guillaumeMoviesDc } from '../src/app/utils/users/guillaume/movies/guillaume_movies_dc';
import { guillaumeMoviesOtherSuperheroes } from '../src/app/utils/users/guillaume/movies/guillaume_movies_other_superheroes';
import { guillaumeMoviesLove } from '../src/app/utils/users/guillaume/movies/guillaume_movies_love';
import { guillaumeMoviesAnimated } from '../src/app/utils/users/guillaume/movies/guillaume_movies_animated';
import { guillaumeMoviesSagaPage1 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_saga_1';
import { guillaumeMoviesSagaPage2 } from '../src/app/utils/users/guillaume/movies/guillaume_movies_saga_2';
import { guillaumeWatchlistMovies } from '../src/app/utils/users/guillaume/movies/guillaume_watchlist_movies';
import { hikenMovies } from '../src/app/utils/users/hiken/movies/hiken_movies';
import { hikenWatchListMovies } from '../src/app/utils/users/hiken/movies/hiken_watchlist_movies';
import { kevinMovies } from '../src/app/utils/users/kevin/movies/kevin_movies';
import { kevinWatchlistMovies } from '../src/app/utils/users/kevin/movies/kevin_watchlist_movies';
import { lucileMovies } from '../src/app/utils/users/lucile/movies/lucile_movies';
import { lucileWatchListMovies } from '../src/app/utils/users/lucile/movies/lucile_watchlist_movies';
import { marinaMovies } from '../src/app/utils/users/marina/movies/marina_movies';
import { marinaWatchListMovies } from '../src/app/utils/users/marina/movies/marina_watchlist_movies';
import { masterofmadnessMovies } from '../src/app/utils/users/masterofmadness/movies/masterofmadness_movies';
import { masterofmadnessWatchListMovies } from '../src/app/utils/users/masterofmadness/movies/masterofmadness_watchlist_movies';
import { ronanMovies } from '../src/app/utils/users/ronan/movies/ronan_movies';
import { ronanCinemaMovies } from '../src/app/utils/users/ronan/movies/ronan_cinema_movies';
import { ronanWatchlistMovies } from '../src/app/utils/users/ronan/movies/ronan_watchlist_movies';
import { unhoMovies } from '../src/app/utils/users/unho/movies/unho_movies';
import { unhoWatchListMovies } from '../src/app/utils/users/unho/movies/unho_watchlist_movies';
import { williamMovies } from '../src/app/utils/users/william/movies/william_movies';
import { williamWatchListMovies } from '../src/app/utils/users/william/movies/william_watchlist_movies';
import { xerythMovies } from '../src/app/utils/users/xeryth/movies/xeryth_movies';
import { xerythWatchListMovies } from '../src/app/utils/users/xeryth/movies/xeryth_watchlist_movies';

function movieKey(m: { title: string; director: string }): string {
  return `${m.title.trim()}|${m.director.trim()}`;
}

function findMatchingBase(
  um: UserMovie,
  base: BaseMovie[]
): BaseMovie | undefined {
  const byTitle = base.filter((b) => b.title === um.title);
  if (byTitle.length === 1) return byTitle[0];
  return byTitle.find((b) => b.director === um.director);
}

const allUserMovies: UserMovie[] = [
  ...amandineMovies1,
  ...amandineMovies2,
  ...amandineWatchlistMovies,
  ...bastienMovies,
  ...bastienWatchListMovies,
  ...cassandreMovies,
  ...cassandreWatchListMovies,
  ...clemenceMovies,
  ...clemenceWatchListMovies,
  ...dantesMovies,
  ...dantesWatchListMovies,
  ...emmanuelleMovies,
  ...emmanuelleWatchListMovies,
  ...gigiMovies,
  ...gigiWatchListMovies,
  ...guillaumeMoviesPage1,
  ...guillaumeMoviesPage2,
  ...guillaumeMoviesPage3,
  ...guillaumeMoviesPage4,
  ...guillaumeMoviesPage5,
  ...guillaumeMoviesMcu,
  ...guillaumeMoviesDc,
  ...guillaumeMoviesOtherSuperheroes,
  ...guillaumeMoviesLove,
  ...guillaumeMoviesAnimated,
  ...guillaumeMoviesSagaPage1,
  ...guillaumeMoviesSagaPage2,
  ...guillaumeWatchlistMovies,
  ...hikenMovies,
  ...hikenWatchListMovies,
  ...kevinMovies,
  ...kevinWatchlistMovies,
  ...lucileMovies,
  ...lucileWatchListMovies,
  ...marinaMovies,
  ...marinaWatchListMovies,
  ...masterofmadnessMovies,
  ...masterofmadnessWatchListMovies,
  ...ronanMovies,
  ...ronanCinemaMovies,
  ...ronanWatchlistMovies,
  ...unhoMovies,
  ...unhoWatchListMovies,
  ...williamMovies,
  ...williamWatchListMovies,
  ...xerythMovies,
  ...xerythWatchListMovies,
];

const baseKeys = new Set(allBaseMovies.map(movieKey));
const seenUserKeys = new Set<string>();
const orphans: { title: string; director: string }[] = [];

for (const um of allUserMovies) {
  const k = movieKey(um);
  if (seenUserKeys.has(k)) continue;
  seenUserKeys.add(k);

  const match = findMatchingBase(um, allBaseMovies);
  if (!match && !baseKeys.has(k)) {
    orphans.push({ title: um.title, director: um.director });
  }
}

orphans.sort((a, b) => a.title.localeCompare(b.title, 'fr'));

console.log(
  `Total base movies: ${allBaseMovies.length}, user movie entries (unique): ${seenUserKeys.size}`
);
console.log(`Orphans (in user data, not in base): ${orphans.length}\n`);
for (const o of orphans) {
  console.log(`- « ${o.title} » — ${o.director}`);
}
