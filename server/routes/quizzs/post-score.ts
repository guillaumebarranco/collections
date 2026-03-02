const express = require('express');
const { addOrUpdateScore, normalizeString } = require('../../utils/quizzs/scores-utils');

const router = express.Router();

router.post('/scores', (req: any, res: any) => {
  try {
    const body = req.body || {};
    const userId = normalizeString(body.userId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const entityType = body.entityType ?? '';
    const entityTitle = body.entityTitle ?? '';
    const creator = body.creator ?? '';
    const level = Number(body.level) || 1;
    const correct = Number(body.correct) || 0;
    const total = Number(body.total) || 0;
    if (!entityTitle || !creator) {
      res.status(400).json({ error: 'Missing entityTitle or creator' });
      return;
    }
    const scores = addOrUpdateScore(userId, {
      entityType,
      entityTitle,
      creator,
      level,
      correct,
      total,
      completedAt: new Date().toISOString(),
    });
    res.json(scores);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
