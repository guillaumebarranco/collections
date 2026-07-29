const express = require('express');
const {
  getMergedUserMusics,
} = require('../../utils/entities/merge-user-collection');

const router = express.Router();

router.get('/:userId/merged', (req: any, res: any) => {
  try {
    const userId = String(req.params.userId || '').trim().toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    res.json(getMergedUserMusics(userId));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
