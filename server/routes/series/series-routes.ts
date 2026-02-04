const express = require('express');
const getSeriesRouter = require('./get-series');
const getWatchlistRouter = require('./get-watchlist');
const getEntitiesRouter = require('./get-entities');
const saveSerieRouter = require('./save-serie');
const batchRatingRouter = require('./batch-rating');
const batchTimesWatchedRouter = require('./batch-times-watched');
const batchOwnedRouter = require('./batch-owned');
const addSerieRouter = require('./add-serie');
const addExistingRouter = require('./add-existing');
const deleteSerieRouter = require('./delete-serie');
const othersRatedRouter = require('./get-others-users-series-rated');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getWatchlistRouter);
router.use(othersRatedRouter);
router.use(getSeriesRouter);
router.use(saveSerieRouter);
router.use(batchRatingRouter);
router.use(batchTimesWatchedRouter);
router.use(batchOwnedRouter);
router.use(addSerieRouter);
router.use(addExistingRouter);
router.use(deleteSerieRouter);

module.exports = router;

export {};
