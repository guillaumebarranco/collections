const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeComicFromFile,
  getUserComicsFiles,
} = require('../../utils/comics/comics-utils');

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
    const designer = normalizeString(input.designer, 'designer');
    if (!title || !designer) {
      res.status(400).json({ error: 'Missing title or designer' });
      return;
    }

    const comicFiles = getUserComicsFiles(userId);
    let updatedFile: string | null = null;

    for (const comicFile of comicFiles) {
      const fileContent = fs.readFileSync(comicFile, 'utf8');
      try {
        const updatedContent = removeComicFromFile(fileContent, {
          title,
          designer,
        });
        fs.writeFileSync(comicFile, updatedContent, 'utf8');
        updatedFile = comicFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Comic not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Comic not found' });
      return;
    }

    res.json({
      ok: true,
      comic: { title, designer },
      file: updatedFile,
    });

    console.log(
      'comic:delete',
      JSON.stringify({ file: updatedFile, title, designer })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
