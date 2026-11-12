const express = require('express');
const {
  getUserShowcase,
  normalizeString,
} = require('../../utils/user-showcase/user-showcase-utils');

const router = express.Router();

router.get('/:userId/user-showcase', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    res.json(getUserShowcase(userId));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
