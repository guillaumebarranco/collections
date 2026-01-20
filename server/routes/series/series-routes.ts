const express = require('express');
const getSeriesRouter = require('./get-series');
const getWatchlistRouter = require('./get-watchlist');
const getEntitiesRouter = require('./get-entities');
const saveSerieRouter = require('./save-serie');
const batchRatingRouter = require('./batch-rating');
const batchTimesWatchedRouter = require('./batch-times-watched');
const addSerieRouter = require('./add-serie');
const addExistingRouter = require('./add-existing');
const deleteSerieRouter = require('./delete-serie');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getWatchlistRouter);
router.use(getSeriesRouter);
router.use(saveSerieRouter);
router.use(batchRatingRouter);
router.use(batchTimesWatchedRouter);
router.use(addSerieRouter);
router.use(addExistingRouter);
router.use(deleteSerieRouter);

module.exports = router;

export {};
