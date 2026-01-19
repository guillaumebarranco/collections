const express = require('express');
const getMusicsRouter = require('./get-musics');
const getEntitiesRouter = require('./get-entities');
const addExistingRouter = require('./add-existing');
const batchRatingRouter = require('./batch-rating');
const batchTimesListenedRouter = require('./batch-times-listened');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMusicsRouter);
router.use(addExistingRouter);
router.use(batchRatingRouter);
router.use(batchTimesListenedRouter);

module.exports = router;

export {};
