/** Citation attachée à une œuvre. lastUpdated : heure locale YYYY-MM-DDTHH:mm. */
export interface EntityQuote {
  quoteText: string;
  lastUpdated: string;
}

export function formatQuoteLastUpdated(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function displayQuoteText(
  quote: EntityQuote | string | null | undefined
): string {
  const text = typeof quote === 'string' ? quote : (quote?.quoteText ?? '');
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\n');
}

export function formatQuoteUpdatedLabel(lastUpdated: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(lastUpdated);
  if (!match) {
    return lastUpdated;
  }
  return `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}`;
}

export function emptyQuote(): EntityQuote {
  return { quoteText: '', lastUpdated: formatQuoteLastUpdated() };
}

export function toEditableQuotes(
  quotes: Array<EntityQuote | string> | undefined
): EntityQuote[] {
  return (quotes ?? []).map((quote) => {
    if (typeof quote === 'string') {
      return {
        quoteText: displayQuoteText(quote),
        lastUpdated: formatQuoteLastUpdated(),
      };
    }
    return {
      quoteText: displayQuoteText(quote?.quoteText ?? ''),
      lastUpdated: quote?.lastUpdated || formatQuoteLastUpdated(),
    };
  });
}

export function quotesForSave(quotes: EntityQuote[]): EntityQuote[] {
  return quotes
    .map((quote) => ({
      quoteText: quote.quoteText.trim(),
      lastUpdated: quote.lastUpdated || formatQuoteLastUpdated(),
    }))
    .filter((quote) => quote.quoteText.length > 0);
}

export function withUpdatedQuoteText(
  quote: EntityQuote,
  quoteText: string
): EntityQuote {
  if (quote.quoteText === quoteText) {
    return quote;
  }
  return {
    quoteText,
    lastUpdated: formatQuoteLastUpdated(),
  };
}
