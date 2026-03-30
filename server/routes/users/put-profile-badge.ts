const express = require('express');
const {
  getProfileBadge,
  saveProfileBadge,
  normalizeString,
} = require('../../utils/profile-badge/profile-badge-utils');
const { getBadgesForUser } = require('../../utils/badges/badges-utils');

const router = express.Router();

router.put('/:userId/profile-badge', (req: any, res: any) => {
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
    const raw = body.badgeId;
    let badgeId: string | null = null;
    if (raw === null || raw === undefined || raw === '') {
      badgeId = null;
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim();
      badgeId = trimmed === '' ? null : trimmed;
    } else {
      res.status(400).json({ error: 'Invalid badgeId' });
      return;
    }

    if (badgeId !== null) {
      const earned = getBadgesForUser(userId);
      if (!earned.includes(badgeId)) {
        res.status(403).json({
          error: 'Badge non débloqué pour cet utilisateur',
        });
        return;
      }
    }

    saveProfileBadge(userId, badgeId);
    res.json({ ok: true, badgeId: getProfileBadge(userId) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
