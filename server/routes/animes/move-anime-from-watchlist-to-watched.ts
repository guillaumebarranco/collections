const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { escapeStringForTsDoubleQuote: escapeString } = require('../../utils/escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseAnimesFromFile,
  getUserAnimesFiles,
  removeAnimeFromFile,
  getUserWatchlistAnimesFiles,
  findBaseAnime,
  updateAnimeInFile,
} = require('../../utils/animes/animes-utils');

const router = express.Router();

function formatQuotesTs(quotes: unknown): string {
  const list = Array.isArray(quotes)
    ? quotes.filter((quote) => typeof quote === 'string' && quote.trim())
    : [];
  if (list.length === 0) return '[]';
  return `[${list.map((quote: string) => `"${escapeString(quote)}"`).join(', ')}]`;
}

const usersRootDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const createUserScript = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'create-user-files.js'
);

function ensureUserExists(userId: string) {
  const userDir = path.join(usersRootDir, userId);
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Saisons reçues du client watchlist lors du clic « J'ai vu cet animé ». */
type PayloadSeasonRow = {
  seasonNumber: number;
  seasonRating: number;
  watching?: boolean;
  seasonTimesWatched: number;
  firstViewedDate: string;
  lastViewedDate: string;
  otherViewedDates?: string[];
};

function sanitizePayloadSeasons(value: unknown): PayloadSeasonRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const out: PayloadSeasonRow[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') {
      continue;
    }
    const o = raw as Record<string, unknown>;
    const sn = Number(o['seasonNumber']);
    if (!Number.isFinite(sn) || sn < 1) {
      continue;
    }
    const sr = Number(o['seasonRating']);
    const tw = Number(o['seasonTimesWatched']);
    const fvd =
      typeof o['firstViewedDate'] === 'string' ? o['firstViewedDate'] : '';
    const lvd =
      typeof o['lastViewedDate'] === 'string' ? o['lastViewedDate'] : '';
    out.push({
      seasonNumber: sn,
      seasonRating: Number.isFinite(sr) ? sr : 0,
      watching: o['watching'] === true,
      seasonTimesWatched: Number.isFinite(tw) ? tw : 0,
      firstViewedDate: fvd ?? '',
      lastViewedDate: lvd ?? '',
    });
  }
  return out;
}

function findPayloadSeason(rows: PayloadSeasonRow[], seasonNumber: number) {
  return rows.find((r) => r.seasonNumber === seasonNumber);
}

function pickOtherViewedDates(
  wlRow?: PayloadSeasonRow,
  exRow?: { otherViewedDates?: string[] }
): string[] {
  const wl = wlRow?.otherViewedDates;
  if (Array.isArray(wl) && wl.length > 0) {
    return wl;
  }
  const ex = exRow?.otherViewedDates;
  if (Array.isArray(ex) && ex.length > 0) {
    return ex;
  }
  return [];
}

function formatOtherViewedDatesInline(dates: string[] | undefined): string {
  if (!Array.isArray(dates) || dates.length === 0) {
    return '[]';
  }
  return `[${dates.map((d) => `"${escapeString(d)}"`).join(', ')}]`;
}

/**
 * Fusion watchlist (+ optionnellement entrée « déjà vue » existante pour le même titre).
 * Les saisons en cours (watching ou legacy 0.5) passent à 1 avec date du jour.
 */
function mergeWatchlistSeasonsToWatched(params: {
  seasonsCount: number;
  payloadSeasons: PayloadSeasonRow[];
  existingSeasons?: {
    seasonNumber: number;
    seasonRating: number;
    seasonTimesWatched: number;
    firstViewedDate: string;
    lastViewedDate: string;
    otherViewedDates?: string[];
  }[];
}): PayloadSeasonRow[] {
  const today = getTodayISO();
  const count = Math.max(0, Number(params.seasonsCount) || 0);
  const wl = params.payloadSeasons;
  const ex = params.existingSeasons ?? [];
  const out: PayloadSeasonRow[] = [];

  for (let n = 1; n <= count; n++) {
    const wlRow = findPayloadSeason(wl, n);
    const exRow = ex.find((s) => s.seasonNumber === n);

    if (wlRow) {
      const tw = wlRow.seasonTimesWatched;
      const inProgress =
        wlRow.watching === true || tw === 0.5;
      // En cours → une fois vu entièrement, comme demandé métier.
      if (inProgress || tw === 0) {
        const existingFirst = String(exRow?.firstViewedDate ?? '').trim();
        out.push({
          seasonNumber: n,
          seasonRating: wlRow.seasonRating ?? 0,
          seasonTimesWatched: 1,
          firstViewedDate: existingFirst || today,
          lastViewedDate: today,
          otherViewedDates: pickOtherViewedDates(wlRow, exRow),
        });
        continue;
      }
      if (tw >= 1) {
        out.push({
          seasonNumber: n,
          seasonRating: wlRow.seasonRating ?? 0,
          seasonTimesWatched: wlRow.seasonTimesWatched,
          firstViewedDate:
            String(wlRow.firstViewedDate ?? '').trim() ||
            String(exRow?.firstViewedDate ?? '').trim() ||
            wlRow.lastViewedDate ||
            today,
          lastViewedDate: wlRow.lastViewedDate || today,
          otherViewedDates: pickOtherViewedDates(wlRow, exRow),
        });
        continue;
      }
      // Autre valeur inattendue : traiter comme visionnage à compléter.
      out.push({
        seasonNumber: n,
        seasonRating: wlRow.seasonRating ?? 0,
        seasonTimesWatched: 1,
        firstViewedDate: String(exRow?.firstViewedDate ?? '').trim() || today,
        lastViewedDate: today,
        otherViewedDates: pickOtherViewedDates(wlRow, exRow),
      });
      continue;
    }

    // Pas de ligne watchlist pour cette saison
    if (exRow != null && (exRow.seasonTimesWatched ?? 0) >= 1) {
      out.push({
        seasonNumber: n,
        seasonRating: Number(exRow.seasonRating ?? 0),
        seasonTimesWatched: Number(exRow.seasonTimesWatched),
        firstViewedDate: String(exRow.firstViewedDate || ''),
        lastViewedDate: String(exRow.lastViewedDate || ''),
        otherViewedDates: pickOtherViewedDates(undefined, exRow),
      });
      continue;
    }

    out.push({
      seasonNumber: n,
      seasonRating: 0,
      seasonTimesWatched: 1,
      firstViewedDate: today,
      lastViewedDate: today,
      otherViewedDates: [],
    });
  }

  return out;
}

function formatSeasons(seasons: PayloadSeasonRow[]) {
  const lines = seasons.map(
    (season: PayloadSeasonRow) => `      {
        seasonNumber: ${season.seasonNumber},
        seasonRating: ${season.seasonRating},
        watching: false,
        seasonTimesWatched: ${season.seasonTimesWatched},
        firstViewedDate: "${escapeString(season.firstViewedDate || '')}",
        lastViewedDate: "${escapeString(season.lastViewedDate || '')}",
        otherViewedDates: ${formatOtherViewedDatesInline(season.otherViewedDates)},
      }`
  );
  return `    seasons: [\n${lines.join(',\n')}\n    ],`;
}

/** Nombre total de saisons : base données + max des fichiers utilisateur/watchlist pour les cas hors base. */
function resolveSeasonsCount(
  baseCount: number,
  payloadSeasons: PayloadSeasonRow[],
  existingSeasons?: { seasonNumber: number }[]
): number {
  let maxSeason = Math.max(0, Number(baseCount) || 0);
  for (const s of payloadSeasons) {
    if (Number.isFinite(s.seasonNumber)) {
      maxSeason = Math.max(maxSeason, s.seasonNumber);
    }
  }
  if (Array.isArray(existingSeasons)) {
    for (const s of existingSeasons) {
      if (Number.isFinite(s?.seasonNumber)) {
        maxSeason = Math.max(maxSeason, s.seasonNumber);
      }
    }
  }
  return maxSeason;
}

function formatUserAnime(
  anime: any,
  options?: {
    ratingComment?: string;
    mergedSeasonRows?: PayloadSeasonRow[];
    payloadSeasons?: PayloadSeasonRow[];
    existingSeasonRows?: PayloadSeasonRow[];
  }
) {
  const wl = options?.payloadSeasons ?? [];
  const inferred = resolveSeasonsCount(
    anime.seasonsCount,
    wl,
    options?.existingSeasonRows
  );
  const merged =
    options?.mergedSeasonRows ??
    mergeWatchlistSeasonsToWatched({
      seasonsCount: inferred,
      payloadSeasons: wl,
      existingSeasons: options?.existingSeasonRows,
    });
  const ratingComment =
    typeof options?.ratingComment === 'string' ? options.ratingComment : '';
  return `  {
    title: "${escapeString(anime.title)}",
    director: "${escapeString(anime.director)}",
${formatSeasons(merged)}
    owned: false,
    watchPriority: ${anime.watchPriority ?? 1},
    wantToWatchAgain: false,
    ratingComment: "${escapeString(ratingComment)}",
    borrowed: "${escapeString(typeof anime.borrowed === 'string' ? anime.borrowed : '')}",
    loaned: "${escapeString(typeof anime.loaned === 'string' ? anime.loaned : '')}",
    quotes: ${formatQuotesTs(anime.quotes)},
  },`;
}

function getUserAnimesTargetFile(userId: string, isWatchlist: boolean) {
  const userDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'animes'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User animes directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts');

  const scopedFiles = files.filter((file: string) =>
    isWatchlist ? file.includes('watchlist') : !file.includes('watchlist')
  );

  const preferred = scopedFiles.find((file: string) =>
    isWatchlist
      ? file.includes(`${userId}_watchlist_animes`)
      : file.includes(`${userId}_animes`)
  );
  const selected = preferred || scopedFiles.sort()[0];
  if (!selected) {
    throw new Error(`User animes file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

function findExistingWatchedAnime(
  userFiles: string[],
  title: string,
  director: string
): { filePath: string; content: string; anime: Record<string, unknown> } | null {
  const key = `${title}|${director}`;
  for (const filePath of userFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const list = parseAnimesFromFile(content) as Record<string, unknown>[];
    const anime = list.find((s: any) => `${s.title}|${s.director}` === key);
    if (anime) {
      return { filePath, content, anime };
    }
  }
  return null;
}

router.post('/move-anime-from-watchlist-to-watched', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const animesPayload = Array.isArray(input.animes) ? input.animes : [];
    const watchlistBool = normalizeBoolean(input.watchlist, 'watchlist') ?? false;
    const ratingComment =
      typeof input.ratingComment === 'string' ? input.ratingComment : undefined;

    const normalizedRows = animesPayload
      .map((anime: any) => {
        const title = normalizeString(anime.title, 'title');
        const director = normalizeString(anime.director, 'director');
        const payloadSeasons = sanitizePayloadSeasons(anime.seasons);
        return {
          title,
          director,
          payloadSeasons,
          borrowed:
            typeof anime.borrowed === 'string' ? anime.borrowed : undefined,
          loaned: typeof anime.loaned === 'string' ? anime.loaned : undefined,
        };
      })
      .filter((r: any) => r.title && r.director);

    if (normalizedRows.length === 0) {
      res.status(400).json({ error: 'Missing animes' });
      return;
    }

    const userFiles = getUserAnimesFiles(userId);
    const userWatchedFile = getUserAnimesTargetFile(userId, watchlistBool);

    let appended = 0;
    let mergedExisting = 0;

    const watchlistFiles = getUserWatchlistAnimesFiles(userId);

    for (const row of normalizedRows) {
      const baseAnime = findBaseAnime(row.title!, row.director!);
      const seasonsCountBase = baseAnime?.seasonsData?.length ?? 0;

      const found = findExistingWatchedAnime(
        userFiles,
        row.title!,
        row.director!
      );

      const animeSnapshot = found?.anime as
        | {
            seasons?: PayloadSeasonRow[];
            borrowed?: unknown;
            loaned?: unknown;
          }
        | undefined;
      const existingSeasonsRaw: PayloadSeasonRow[] = Array.isArray(
        animeSnapshot?.seasons
      )
        ? animeSnapshot.seasons
        : [];

      const inferred = resolveSeasonsCount(
        seasonsCountBase,
        row.payloadSeasons,
        existingSeasonsRaw
      );

      const mergedSeasons = mergeWatchlistSeasonsToWatched({
        seasonsCount: inferred,
        payloadSeasons: row.payloadSeasons,
        existingSeasons: existingSeasonsRaw,
      });

      if (found) {
        let content = fs.readFileSync(found.filePath, 'utf8');
        const snap = found.anime as {
          seasons?: PayloadSeasonRow[];
          borrowed?: unknown;
          loaned?: unknown;
        };
        const borrowedPreserve =
          typeof snap.borrowed === 'string' ? snap.borrowed : '';
        const loanedPreserve =
          typeof snap.loaned === 'string' ? snap.loaned : '';
        const updatePayload = {
          title: row.title,
          director: row.director,
          seasons: mergedSeasons,
          borrowed: borrowedPreserve,
          loaned: loanedPreserve,
          ...(ratingComment !== undefined ? { ratingComment } : {}),
        };
        content = updateAnimeInFile(content, updatePayload);
        fs.writeFileSync(found.filePath, content, 'utf8');
        mergedExisting += 1;
      } else {
        let nextContent = fs.readFileSync(userWatchedFile, 'utf8');
        nextContent = appendObjectToArrayFile(
          userWatchedFile,
          formatUserAnime(
            {
              title: row.title,
              director: row.director,
              seasonsCount: seasonsCountBase,
              watchPriority: 1,
              borrowed:
                row.borrowed !== undefined
                  ? row.borrowed
                  : '',
              loaned:
                row.loaned !== undefined
                  ? row.loaned
                  : '',
            },
            {
              ...(ratingComment != null ? { ratingComment } : {}),
              mergedSeasonRows: mergedSeasons,
            }
          )
        );
        fs.writeFileSync(userWatchedFile, nextContent, 'utf8');
        appended += 1;
      }

      let removedFromWl: string | null = null;
      for (const animeFile of watchlistFiles) {
        const wlContent = fs.readFileSync(animeFile, 'utf8');
        try {
          const updatedWl = removeAnimeFromFile(wlContent, {
            title: row.title,
            director: row.director,
          });
          fs.writeFileSync(animeFile, updatedWl, 'utf8');
          removedFromWl = animeFile;
          break;
        } catch (error: any) {
          if (error.message !== 'Anime not found') {
            throw error;
          }
        }
      }

      if (!removedFromWl) {
        res.status(404).json({ error: 'Anime not found in watchlist' });
        return;
      }
    }

    res.json({
      ok: true,
      added: appended,
      merged: mergedExisting,
      file: userWatchedFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
