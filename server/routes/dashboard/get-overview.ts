const express = require('express');
const {
  buildDashboardOverview,
} = require('../../utils/dashboard/dashboard-overview-utils');

const router = express.Router();

/**
 * Collections fusionnées allégées pour la vue d'ensemble du dashboard.
 * Les onglets stats / activité / badges continuent d'utiliser les GET classiques.
 */
router.get('/:userId/overview', (req: any, res: any) => {
  try {
    const userId = String(req.params.userId || '')
      .trim()
      .toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    res.json(buildDashboardOverview(userId));
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
