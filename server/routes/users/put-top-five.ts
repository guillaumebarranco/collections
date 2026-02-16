const express = require('express');
const {
  saveTopFive,
  normalizeString,
} = require('../../utils/top-five/top-five-utils');

const router = express.Router();

router.put('/:userId/top-five', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const body = req.body;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid body: expected object' });
      return;
    }
    saveTopFive(userId, body);
    res.json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
