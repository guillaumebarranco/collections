const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeBdFromFile,
  getUserBdsFiles,
} = require('../../utils/bds/bds-utils');

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

    const bdFiles = getUserBdsFiles(userId);
    let updatedFile: string | null = null;

    for (const bdFile of bdFiles) {
      const fileContent = fs.readFileSync(bdFile, 'utf8');
      try {
        const updatedContent = removeBdFromFile(fileContent, { title, designer });
        fs.writeFileSync(bdFile, updatedContent, 'utf8');
        updatedFile = bdFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Bd not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Bd not found' });
      return;
    }

    res.json({
      ok: true,
      bd: { title, designer },
      file: updatedFile,
    });

    console.log(
      'bd:delete',
      JSON.stringify({ file: updatedFile, title, designer })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
