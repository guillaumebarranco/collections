const express = require('express');
const { isAdminUser } = require('../../utils/users/users-utils');
const {
  getEntityAddRequests,
  addEntityAddRequest,
  clearEntityAddRequests,
} = require('../../utils/entity-add-requests/entity-add-requests-utils');

const router = express.Router();

/** Liste des demandes — réservé admin. */
router.get('/', (req: any, res: any) => {
  try {
    const userId = String(req.query.userId || '')
      .trim()
      .toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    if (!isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required' });
      return;
    }
    res.json({ requests: getEntityAddRequests() });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

/** Création d’une demande — tout utilisateur. */
router.post('/', (req: any, res: any) => {
  try {
    const request = addEntityAddRequest({
      entityType: req.body?.entityType,
      title: req.body?.title,
      secondaryKey: req.body?.secondaryKey,
      requestedBy: req.body?.requestedBy,
    });
    res.status(201).json({ request });
  } catch (error: any) {
    const message = error.message || 'Unknown error';
    const status =
      message.startsWith('Missing') || message.startsWith('Invalid')
        ? 400
        : 500;
    res.status(status).json({ error: message });
  }
});

/** Vide toute la liste — réservé admin. */
router.delete('/', (req: any, res: any) => {
  try {
    const userId = String(req.query.userId || '')
      .trim()
      .toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    if (!isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required' });
      return;
    }
    const cleared = clearEntityAddRequests();
    res.json({ cleared });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
