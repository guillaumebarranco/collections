const express = require('express');
const { getScoresForUser, normalizeString } = require('../../utils/quizzs/scores-utils');

const router = express.Router();

router.get('/scores/:userId', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const scores = getScoresForUser(userId);
    res.json(scores);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
