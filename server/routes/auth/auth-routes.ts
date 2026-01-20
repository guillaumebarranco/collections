const express = require('express');
const statusRouter = require('./status');
const loginRouter = require('./login');
const registerRouter = require('./register');

const router = express.Router();

router.use(statusRouter);
router.use(loginRouter);
router.use(registerRouter);

module.exports = router;

export {};
