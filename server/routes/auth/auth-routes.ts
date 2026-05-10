const express = require('express');
const statusRouter = require('./status');
const loginRouter = require('./login');
const registerRouter = require('./register');
const changePasswordRouter = require('./change-password');

const router = express.Router();

router.use(statusRouter);
router.use(loginRouter);
router.use(registerRouter);
router.use(changePasswordRouter);

module.exports = router;

export {};
