const express = require('express');
const { loadUsers } = require('../../utils/users/users-utils');

const router = express.Router();

/** GET /api/users/list - Liste des usernames (pour la sélection "comptes suivis"). */
router.get('/list', (req: any, res: any) => {
  try {
    const users = loadUsers();
    const usernames = users.map((u: any) => (u.username || '').trim().toLowerCase()).filter(Boolean);
    res.json({ users: usernames });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
