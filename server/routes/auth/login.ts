const express = require('express');
const { findUser, normalizeUsername } = require('../../utils/users/users-utils');
const { verifyPassword } = require('../../utils/auth/auth-utils');

const router = express.Router();

router.post('/login', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const username = normalizeUsername(input.username);
    const password = String(input.password || '');

    if (!username || !password) {
      res.status(400).json({ error: 'Missing username or password' });
      return;
    }

    const { user } = findUser(username);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const ok = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!ok) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json({ ok: true, username, admin: Boolean(user.admin) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
