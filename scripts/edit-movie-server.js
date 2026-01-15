const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const USERS_MOVIES_DIR = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'utils',
  'users'
);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function normalizeNumber(value, field) {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number for ${field}`);
  }
  return parsed;
}

function normalizeBoolean(value, field) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean for ${field}`);
}

function normalizeString(value, field) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Invalid string for ${field}`);
  }
  return value;
}

function parseStringField(objectText, key) {
  const regex = new RegExp(`${key}\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`);
  const match = objectText.match(regex);
  if (!match) return null;
  const quote = match[1];
  return match[2]
    .replace(new RegExp(`\\\\${quote}`, 'g'), quote)
    .replace(/\\\\/g, '\\');
}

function parseNumberField(objectText, key) {
  const regex = new RegExp(`${key}\\s*:\\s*([^,\\n]+)`);
  const match = objectText.match(regex);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBooleanField(objectText, key) {
  const regex = new RegExp(`${key}\\s*:\\s*(true|false)`);
  const match = objectText.match(regex);
  if (!match) return null;
  return match[1] === 'true';
}

function parseMoviesFromFile(content) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const movies = [];
  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const title = parseStringField(objectText, 'title');
        const director = parseStringField(objectText, 'director');
        if (title && director) {
          movies.push({
            title,
            director,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            timesWatched: parseNumberField(objectText, 'timesWatched') ?? 0,
            firstViewedDate:
              parseStringField(objectText, 'firstViewedDate') ?? '',
            lastViewedDate:
              parseStringField(objectText, 'lastViewedDate') ?? '',
            seenAtCinema:
              parseBooleanField(objectText, 'seenAtCinema') ?? false,
          });
        }
      }
    }
    i += 1;
  }

  return movies;
}

function replaceField(objectText, key, value) {
  if (value === undefined) return objectText;
  let next = objectText;
  if (typeof value === 'string') {
    const regex = new RegExp(
      `(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`
    );
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, (match, prefix, quote) => {
      const escaped = value
        .replace(/\\/g, '\\\\')
        .replace(new RegExp(quote, 'g'), `\\${quote}`);
      return `${prefix}${quote}${escaped}${quote}`;
    });
    return next;
  }

  if (typeof value === 'boolean') {
    const regex = new RegExp(`(${key}\\s*:\\s*)(true|false)`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, `$1${value}`);
    return next;
  }

  if (typeof value === 'number') {
    const regex = new RegExp(`(${key}\\s*:\\s*)([^,\\n]+)`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, `$1${value}`);
    return next;
  }

  return next;
}

function updateMovieInFile(content, payload) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const title = parseStringField(objectText, 'title');
        const director = parseStringField(objectText, 'director');

        if (title === payload.title && director === payload.director) {
          let updated = objectText;
          updated = replaceField(updated, 'rating', payload.rating);
          updated = replaceField(updated, 'timesWatched', payload.timesWatched);
          updated = replaceField(
            updated,
            'firstViewedDate',
            payload.firstViewedDate
          );
          updated = replaceField(
            updated,
            'lastViewedDate',
            payload.lastViewedDate
          );
          updated = replaceField(
            updated,
            'seenAtCinema',
            payload.seenAtCinema
          );

          return (
            content.slice(0, objectStart) +
            updated +
            content.slice(objectEnd + 1)
          );
        }
      }
    }
    i += 1;
  }

  throw new Error('Movie not found');
}

function getUserMoviesFiles(userId) {
  const userMoviesDir = path.join(USERS_MOVIES_DIR, userId, 'movies');
  if (!fs.existsSync(userMoviesDir)) {
    throw new Error(`User movies directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userMoviesDir)
    .filter((file) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file) => path.join(userMoviesDir, file));
}

const app = express();

app.use((req, res, next) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

app.get('/api/movies/:userId', (req, res) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const movieFiles = getUserMoviesFiles(userId);
    const movies = movieFiles.flatMap((movieFile) => {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      return parseMoviesFromFile(fileContent);
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

app.post('/api/movies', (req, res) => {
  try {
    const input = req.body || {};

    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const director = normalizeString(input.director, 'director');
    if (!title || !director) {
      res.status(400).json({ error: 'Missing title or director' });
      return;
    }

    const payload = {
      title,
      director,
      rating: normalizeNumber(input.rating, 'rating'),
      timesWatched: normalizeNumber(input.timesWatched, 'timesWatched'),
      firstViewedDate: normalizeString(
        input.firstViewedDate,
        'firstViewedDate'
      ),
      lastViewedDate: normalizeString(
        input.lastViewedDate,
        'lastViewedDate'
      ),
      seenAtCinema: normalizeBoolean(input.seenAtCinema, 'seenAtCinema'),
    };

    const movieFiles = getUserMoviesFiles(userId);
    let updatedFile = null;

    for (const movieFile of movieFiles) {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      try {
        const updatedContent = updateMovieInFile(fileContent, payload);
        fs.writeFileSync(movieFile, updatedContent, 'utf8');
        updatedFile = movieFile;
        break;
      } catch (error) {
        if (error.message !== 'Movie not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    res.json({
      ok: true,
      movie: { title: payload.title, director: payload.director },
      file: updatedFile,
    });

    console.log(
      'movie:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        director: payload.director,
        rating: payload.rating,
        timesWatched: payload.timesWatched,
        firstViewedDate: payload.firstViewedDate,
        lastViewedDate: payload.lastViewedDate,
        seenAtCinema: payload.seenAtCinema,
      })
    );
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Edit movie server running on http://localhost:${PORT}`);
});
