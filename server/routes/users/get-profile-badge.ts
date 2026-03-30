const express = require('express');
const {
  getProfileBadge,
  normalizeString,
} = require('../../utils/profile-badge/profile-badge-utils');

const router = express.Router();

router.get('/:userId/profile-badge', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const badgeId = getProfileBadge(userId);
    res.json({ badgeId });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
