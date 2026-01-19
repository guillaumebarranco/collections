const express = require('express');
const getMusicsRouter = require('./get-musics');
const getEntitiesRouter = require('./get-entities');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMusicsRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
