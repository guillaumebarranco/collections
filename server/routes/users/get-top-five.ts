const express = require('express');
const {
  getTopFive,
  normalizeString,
} = require('../../utils/top-five/top-five-utils');

const router = express.Router();

router.get('/:userId/top-five', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const data = getTopFive(userId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
