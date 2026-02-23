const express = require('express');
const getTopFiveRouter = require('./get-top-five');
const putTopFiveRouter = require('./put-top-five');
const getBadgesRouter = require('./get-badges');

const router = express.Router();

router.use(getTopFiveRouter);
router.use(putTopFiveRouter);
router.use(getBadgesRouter);

module.exports = router;

export {};
