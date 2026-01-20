const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeManwhaFromFile,
  getUserManwhasFiles,
} = require('../../utils/manwhas/manwhas-utils');

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

    const manwhaFiles = getUserManwhasFiles(userId);
    let updatedFile: string | null = null;

    for (const manwhaFile of manwhaFiles) {
      const fileContent = fs.readFileSync(manwhaFile, 'utf8');
      try {
        const updatedContent = removeManwhaFromFile(fileContent, {
          title,
          author,
        });
        fs.writeFileSync(manwhaFile, updatedContent, 'utf8');
        updatedFile = manwhaFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Manwha not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Manwha not found' });
      return;
    }

    res.json({
      ok: true,
      manwha: { title, author },
      file: updatedFile,
    });

    console.log(
      'manwha:delete',
      JSON.stringify({ file: updatedFile, title, author })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
