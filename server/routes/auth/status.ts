const express = require('express');
const { findUser } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/status/:username', (req: any, res: any) => {
  try {
    const username = req.params.username || '';
    const { user } = findUser(username);
    if (!user) {
      res.json({ exists: false, hasPassword: false });
      return;
    }

    const hasPassword = Boolean(user.passwordHash && user.passwordSalt);
    res.json({ exists: true, hasPassword, admin: Boolean(user.admin) });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
