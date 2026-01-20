const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeMangaFromFile,
  getUserMangasFiles,
} = require('../../utils/mangas/mangas-utils');

const router = express.Router();

router.post('/delete', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const author = normalizeString(input.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    const mangaFiles = getUserMangasFiles(userId);
    let updatedFile: string | null = null;

    for (const mangaFile of mangaFiles) {
      const fileContent = fs.readFileSync(mangaFile, 'utf8');
      try {
        const updatedContent = removeMangaFromFile(fileContent, {
          title,
          author,
        });
        fs.writeFileSync(mangaFile, updatedContent, 'utf8');
        updatedFile = mangaFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Manga not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Manga not found' });
      return;
    }

    res.json({
      ok: true,
      manga: { title, author },
      file: updatedFile,
    });

    console.log(
      'manga:delete',
      JSON.stringify({ file: updatedFile, title, author })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
