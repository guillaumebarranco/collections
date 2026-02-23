const express = require('express');
const { getBadgesForUser } = require('../../utils/badges/badges-utils');

function normalizeString(value: unknown, field: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
}

const router = express.Router();

router.get('/:userId/badges', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const data = getBadgesForUser(userId);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
