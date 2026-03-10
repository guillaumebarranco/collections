const express = require('express');
const { loadUsers, isAdminUser } = require('../../utils/users/users-utils');
const { buildAdminRecords } = require('../../utils/admin/records-utils');

const router = express.Router();

router.get('/users', (req: any, res: any) => {
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
    const users = loadUsers();
    res.json({
      count: users.length,
      users: users.map((user: any) => ({
        username: user.username,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

router.get('/records', (req: any, res: any) => {
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
    const records = buildAdminRecords();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
