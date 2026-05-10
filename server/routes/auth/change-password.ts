const express = require('express');
const {
  findUser,
  saveUsers,
  normalizeUsername,
} = require('../../utils/users/users-utils');
const {
  verifyPassword,
  hashPassword,
} = require('../../utils/auth/auth-utils');

const router = express.Router();

router.post('/change-password', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const username = normalizeUsername(input.username);
    const oldPassword = String(input.oldPassword || '');
    const newPassword = String(input.newPassword || '');

    if (!username || !oldPassword || !newPassword) {
      res.status(400).json({ error: 'Missing username, oldPassword or newPassword' });
      return;
    }

    if (newPassword === oldPassword) {
      res.status(400).json({
        error: 'Le nouveau mot de passe doit \xeatre diff\xe9rent de l\u2019ancien.',
      });
      return;
    }

    const { user, users } = findUser(username);
    if (!user || !user.passwordHash || !user.passwordSalt) {
      res.status(404).json({ error: 'User not found or has no password set' });
      return;
    }

    const ok = verifyPassword(oldPassword, user.passwordHash, user.passwordSalt);
    if (!ok) {
      res.status(401).json({ error: 'Invalid current password' });
      return;
    }

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
    saveUsers(users);

    res.json({ ok: true, username, admin: Boolean(user.admin) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
