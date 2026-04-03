const express = require('express');
const fs = require('fs');
const { getQuizzFiles, parseQuizzsFromFile } = require('../../utils/quizzs/quizzs-utils');

import type { Quizz } from '../../../src/app/models/quizz-model';

const router = express.Router();

router.get('/', (_req: any, res: any) => {
  try {
    const quizzFiles = getQuizzFiles();
    const quizzs: Quizz[] = quizzFiles.flatMap((filePath: string) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return parseQuizzsFromFile(content);
    });

    res.json(quizzs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
