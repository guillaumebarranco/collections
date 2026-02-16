const express = require('express');
const getTopFiveRouter = require('./get-top-five');
const putTopFiveRouter = require('./put-top-five');

const router = express.Router();

router.use(getTopFiveRouter);
router.use(putTopFiveRouter);

module.exports = router;

export {};
