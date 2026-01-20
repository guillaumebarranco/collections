const express = require('express');
const {
  findUser,
  saveUsers,
  normalizeUsername,
} = require('../../utils/users/users-utils');
const { hashPassword } = require('../../utils/auth/auth-utils');

const router = express.Router();

router.post('/register', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const username = normalizeUsername(input.username);
    const password = String(input.password || '');

    if (!username || !password) {
      res.status(400).json({ error: 'Missing username or password' });
      return;
    }

    const { user, users } = findUser(username);
    if (user && user.passwordHash) {
      res.status(409).json({ error: 'User already has a password' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    if (user) {
      user.passwordHash = hash;
      user.passwordSalt = salt;
    } else {
      users.push({
        username,
        passwordHash: hash,
        passwordSalt: salt,
      });
    }

    saveUsers(users);
    res.json({ ok: true, username });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
