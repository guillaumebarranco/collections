/** Dates ISO (YYYY-MM-DD) ou chaînes valides, sans entrées vides. */
export function normalizeActivityExtraDates(
  dates: string[] | undefined | null,
): string[] {
  if (!Array.isArray(dates)) {
    return [];
  }
  const out: string[] = [];
  for (const raw of dates) {
    if (typeof raw !== 'string') {
      continue;
    }
    const s = raw.trim();
    if (!s) {
      continue;
    }
    if (!out.includes(s)) {
      out.push(s);
    }
  }
  return out;
}

/**
 * Avant de remplacer lastReadDate / lastViewedDate par une nouvelle date (ex. relecture),
 * conserve l'ancienne valeur dans otherReadDates / otherSeenDates.
 */
export function shiftPreviousLastDateToExtras(
  previousLastDate: string | undefined,
  extraDates: string[] | undefined | null,
  newLastDate: string
): string[] {
  const extras = normalizeActivityExtraDates(extraDates);
  const prev = (previousLastDate ?? '').trim();
  const next = newLastDate.trim();
  if (!prev || prev === next || extras.includes(prev)) {
    return extras;
  }
  return [...extras, prev];
}

/** Date du jour au format ISO (YYYY-MM-DD), fuseau local. */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
