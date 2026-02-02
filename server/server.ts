const express = require('express');
const moviesRoutes = require('./routes/movies/movies-routes');
const booksRoutes = require('./routes/books/books-routes');
const seriesRoutes = require('./routes/series/series-routes');
const gamesRoutes = require('./routes/games/games-routes');
const mangasRoutes = require('./routes/mangas/mangas-routes');
const manwhasRoutes = require('./routes/manwhas/manwhas-routes');
const comicsRoutes = require('./routes/comics/comics-routes');
const bdsRoutes = require('./routes/bds/bds-routes');
const musicsRoutes = require('./routes/musics/musics-routes');
const quizzsRoutes = require('./routes/quizzs/quizzs-routes');
const authRoutes = require('./routes/auth/auth-routes');

const PORT = 3001;

function setCors(res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const app = express();

app.use((req: any, res: any, next: any) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

app.use('/api/movies', moviesRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/series', seriesRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/mangas', mangasRoutes);
app.use('/api/manwhas', manwhasRoutes);
app.use('/api/comics', comicsRoutes);
app.use('/api/bds', bdsRoutes);
app.use('/api/musics', musicsRoutes);
app.use('/api/quizzs', quizzsRoutes);
app.use('/api/auth', authRoutes);

app.use((_req: any, res: any) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Makya API server running on http://localhost:${PORT}`);
});

export {};
