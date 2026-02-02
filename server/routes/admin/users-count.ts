const express = require('express');
const { loadUsers, isAdminUser } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/users/count', (req: any, res: any) => {
  try {
    const userId = String(req.query.userId || '').trim().toLowerCase();
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    if (!isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required' });
      return;
    }
    const users = loadUsers();
    res.json({ count: users.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
