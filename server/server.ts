const express = require('express');
const moviesRoutes = require('./routes/movies/movies-routes');

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

app.use((_req: any, res: any) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Edit movie server running on http://localhost:${PORT}`);
});

export {};
