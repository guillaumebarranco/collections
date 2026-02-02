const express = require('express');
const { saveQuizz } = require('../../utils/quizzs/quizzs-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const quizz = req.body;
    if (!quizz || !quizz.creator || !quizz.entityType || !quizz.entityTitle) {
      res.status(400).json({ error: 'Invalid quizz payload' });
      return;
    }
    if (!Array.isArray(quizz.questions) || quizz.questions.length === 0) {
      res.status(400).json({ error: 'Quizz must have questions' });
      return;
    }
    if (quizz.questions.length > 20) {
      res.status(400).json({ error: 'Quizz has too many questions' });
      return;
    }

    saveQuizz(quizz);
    res.json({ quizz });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
