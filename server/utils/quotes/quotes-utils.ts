const {
  escapeStringForTsDoubleQuote: escapeString,
} = require('../escape-ts-string');

function formatQuoteLastUpdated(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function unescapeQuoted(raw: string, quote: string): string {
  return raw
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(quote === '"' ? /\\"/g : /\\'/g, quote)
    .replace(/\\\\/g, '\\');
}

function readString(source: string, start: number): { value: string; end: number } {
  const quote = source[start];
  let i = start + 1;
  let raw = '';
  while (i < source.length) {
    if (source[i] === '\\') {
      raw += source.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (source[i] === quote) {
      return { value: unescapeQuoted(raw, quote), end: i + 1 };
    }
    raw += source[i];
    i += 1;
  }
  throw new Error('Unterminated string in quotes array');
}

function findArrayEnd(source: string, bracketStart: number): number {
  let depth = 0;
  let quote: string | null = null;
  let i = bracketStart;
  while (i < source.length) {
    const char = source[i];
    if (quote) {
      if (char === '\\') {
        i += 2;
        continue;
      }
      if (char === quote) quote = null;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      i += 1;
      continue;
    }
    if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) return i;
    }
    i += 1;
  }
  throw new Error('Unterminated quotes array');
}

function findQuotesKey(objectText: string): number {
  let quote: string | null = null;
  for (let i = 0; i < objectText.length; i += 1) {
    const char = objectText[i];
    if (quote) {
      if (char === '\\') {
        i += 1;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (
      objectText.startsWith('quotes', i) &&
      (i === 0 || !/[A-Za-z0-9_]/.test(objectText[i - 1])) &&
      /^\s*:/.test(objectText.slice(i + 6))
    ) {
      return i;
    }
  }
  return -1;
}

function readField(objectText: string, key: string): string {
  let quote: string | null = null;
  for (let i = 0; i < objectText.length; i += 1) {
    const char = objectText[i];
    if (quote) {
      if (char === '\\') {
        i += 1;
        continue;
      }
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (
      objectText.startsWith(key, i) &&
      (i === 0 || !/[A-Za-z0-9_]/.test(objectText[i - 1]))
    ) {
      const after = objectText.slice(i + key.length);
      const match = /^\s*:\s*/.exec(after);
      if (!match) continue;
      const valueStart = i + key.length + match[0].length;
      if (objectText[valueStart] === '"' || objectText[valueStart] === "'") {
        return readString(objectText, valueStart).value;
      }
    }
  }
  return '';
}

function parseQuotesArray(arrayText: string) {
  const quotes: { quoteText: string; lastUpdated: string }[] = [];
  let i = 1;
  const end = arrayText.length - 1;
  while (i < end) {
    while (i < end && /[\s,]/.test(arrayText[i])) i += 1;
    if (i >= end) break;
    const char = arrayText[i];
    if (char === '"' || char === "'") {
      const parsed = readString(arrayText, i);
      const quoteText = parsed.value.trim();
      if (quoteText) {
        quotes.push({
          quoteText,
          lastUpdated: formatQuoteLastUpdated(),
        });
      }
      i = parsed.end;
      continue;
    }
    if (char === '{') {
      let depth = 0;
      let quote: string | null = null;
      let j = i;
      while (j < arrayText.length) {
        const current = arrayText[j];
        if (quote) {
          if (current === '\\') {
            j += 2;
            continue;
          }
          if (current === quote) quote = null;
          j += 1;
          continue;
        }
        if (current === '"' || current === "'") {
          quote = current;
          j += 1;
          continue;
        }
        if (current === '{') depth += 1;
        else if (current === '}') {
          depth -= 1;
          if (depth === 0) {
            j += 1;
            break;
          }
        }
        j += 1;
      }
      const objectText = arrayText.slice(i, j);
      const quoteText = readField(objectText, 'quoteText').trim();
      const lastUpdated =
        readField(objectText, 'lastUpdated').trim() || formatQuoteLastUpdated();
      if (quoteText) {
        quotes.push({ quoteText, lastUpdated });
      }
      i = j;
      continue;
    }
    i += 1;
  }
  return quotes;
}

function parseQuotesField(objectText: string) {
  const keyIndex = findQuotesKey(objectText);
  if (keyIndex === -1) return [];
  const bracket = objectText.indexOf('[', keyIndex);
  if (bracket === -1) return [];
  const end = findArrayEnd(objectText, bracket);
  return parseQuotesArray(objectText.slice(bracket, end + 1));
}

function normalizeQuotes(quotes: unknown) {
  if (!Array.isArray(quotes)) return [];
  const now = formatQuoteLastUpdated();
  const result: { quoteText: string; lastUpdated: string }[] = [];
  for (const quote of quotes) {
    if (typeof quote === 'string') {
      const quoteText = quote.trim();
      if (quoteText) result.push({ quoteText, lastUpdated: now });
      continue;
    }
    if (quote && typeof quote === 'object') {
      const record = quote as { quoteText?: unknown; lastUpdated?: unknown };
      const quoteText = String(record.quoteText ?? '').trim();
      if (!quoteText) continue;
      const lastUpdated =
        typeof record.lastUpdated === 'string' && record.lastUpdated.trim()
          ? record.lastUpdated.trim()
          : now;
      result.push({ quoteText, lastUpdated });
    }
  }
  return result;
}

function formatQuotesTs(quotes: unknown): string {
  const list = normalizeQuotes(quotes);
  if (list.length === 0) return '[]';
  const items = list.map(
    (quote) =>
      `{\n      quoteText: "${escapeString(quote.quoteText)}",\n      lastUpdated: "${escapeString(quote.lastUpdated)}",\n    }`
  );
  return `[\n    ${items.join(',\n    ')},\n  ]`;
}

module.exports = {
  formatQuoteLastUpdated,
  parseQuotesField,
  normalizeQuotes,
  formatQuotesTs,
};
export {};
