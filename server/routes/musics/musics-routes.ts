const express = require('express');
const getMusicsRouter = require('./get-musics');
const getEntitiesRouter = require('./get-entities');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMusicsRouter);

module.exports = router;

export {};
