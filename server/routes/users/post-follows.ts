const express = require('express');
const { addFollow, getFollowedUserIds, normalizeUsername } = require('../../utils/users/follows-utils');
const { findUser } = require('../../utils/users/users-utils');

const router = express.Router();

router.post('/:userId/follows', (req: any, res: any) => {
  try {
    const userId = normalizeUsername(req.params.userId);
    const body = req.body || {};
    const followUserId = normalizeUsername(body.followUserId ?? body.username ?? '');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    if (!followUserId) {
      res.status(400).json({ error: 'Missing followUserId' });
      return;
    }
    if (userId === followUserId) {
      res.status(400).json({ error: 'Cannot follow yourself' });
      return;
    }
    const { user } = findUser(followUserId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    addFollow(userId, followUserId);
    const follows = getFollowedUserIds(userId);
    res.json({ follows });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
