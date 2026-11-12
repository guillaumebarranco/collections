const express = require('express');
const {
  saveUserShowcase,
  normalizeShowcaseForSave,
  getUserShowcase,
  normalizeString,
} = require('../../utils/user-showcase/user-showcase-utils');

const router = express.Router();

router.put('/:userId/user-showcase', (req: any, res: any) => {
  try {
    const userId = normalizeString(req.params.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    const showcase = normalizeShowcaseForSave(req.body, userId);
    saveUserShowcase(userId, showcase);
    res.json(getUserShowcase(userId));
  } catch (error: any) {
    const status = error.statusCode === 400 ? 400 : 500;
    res.status(status).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
