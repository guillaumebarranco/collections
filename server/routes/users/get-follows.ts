const express = require('express');
const { getFollowedUserIds, normalizeUsername } = require('../../utils/users/follows-utils');

const router = express.Router();

router.get('/:userId/follows', (req: any, res: any) => {
  try {
    const userId = normalizeUsername(req.params.userId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const follows = getFollowedUserIds(userId);
    res.json({ follows });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
