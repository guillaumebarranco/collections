const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

const FOLDER_BY_ENTITY: Record<string, string> = {
  movies: 'movies_pictures',
  series: 'series_pictures',
  animes: 'entities_covers',
  books: 'books_pictures',
  'children-books': 'children_books_pictures',
  bds: 'bds_pictures',
  comics: 'comics_pictures',
  mangas: 'mangas_pictures',
  manwhas: 'manwhas_pictures',
  games: 'games_pictures',
  musics: 'musics_pictures',
};

const PUBLIC_DIR = path.resolve(__dirname, '../../../public');
const MAX_BYTES = 15 * 1024 * 1024;

const rawParser = express.raw({ type: () => true, limit: MAX_BYTES });

function detectImage(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'jpg';
  }
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'png';
  }
  const gif = buffer.subarray(0, 6).toString('ascii');
  if (gif === 'GIF87a' || gif === 'GIF89a') return 'gif';
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buffer.subarray(8, 12).toString('ascii');
    if (brand === 'avif' || brand === 'avis') return 'avif';
    if (
      brand === 'heic' ||
      brand === 'heix' ||
      brand === 'hevc' ||
      brand === 'mif1' ||
      brand === 'msf1'
    ) {
      return 'heic';
    }
  }
  return null;
}

router.post(
  '/:entityType',
  (req: any, res: any, next: any) => {
    rawParser(req, res, (err: any) => {
      if (!err) {
        next();
        return;
      }
      const tooLarge = err.type === 'entity.too.large' || err.status === 413;
      res.status(tooLarge ? 413 : 400).json({
        error: tooLarge
          ? 'Image trop volumineuse (15 Mo maximum).'
          : 'Impossible de lire l’image.',
      });
    });
  },
  (req: any, res: any) => {
    try {
      const folder = FOLDER_BY_ENTITY[req.params.entityType];
      if (!folder) {
        res.status(400).json({ error: 'Type d’entité inconnu.' });
        return;
      }

      const body = req.body;
      if (!Buffer.isBuffer(body) || body.length === 0) {
        res.status(400).json({ error: 'Image manquante.' });
        return;
      }

      const extension = detectImage(body);
      if (extension === 'heic') {
        res.status(400).json({
          error:
            'Le format HEIC n’est pas pris en charge. Choisissez une image JPEG ou PNG.',
        });
        return;
      }
      if (!extension) {
        res.status(400).json({
          error: 'Format non reconnu. Utilisez JPEG, PNG, WebP, GIF ou AVIF.',
        });
        return;
      }

      const filename = `${crypto.randomBytes(6).toString('hex')}.${extension}`;
      const dir = path.join(PUBLIC_DIR, folder);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, filename), body);
      res.json({ coverUrl: `/${folder}/${filename}` });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Unknown error' });
    }
  },
);

module.exports = router;

export {};
