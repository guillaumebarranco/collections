const express = require('express');
const { removeFollow, getFollowedUserIds, normalizeUsername } = require('../../utils/users/follows-utils');

const router = express.Router();

router.delete('/:userId/follows/:followUserId', (req: any, res: any) => {
  try {
    const userId = normalizeUsername(req.params.userId);
    const followUserId = normalizeUsername(req.params.followUserId);
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    if (!followUserId) {
      res.status(400).json({ error: 'Missing followUserId' });
      return;
    }
    removeFollow(userId, followUserId);
    const follows = getFollowedUserIds(userId);
    res.json({ follows });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
