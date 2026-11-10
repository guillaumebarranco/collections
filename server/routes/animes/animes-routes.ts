const express = require('express');
const getAnimeWatchersRouter = require('./get-anime-watchers');
const getAnimesRouter = require('./get-animes');
const getWatchlistRouter = require('./get-watchlist');
const getEntitiesRouter = require('./get-entities');
const getMergedRouter = require('./get-merged');
const saveAnimeRouter = require('./save-anime');
const batchRatingRouter = require('./batch-rating');
const batchTimesWatchedRouter = require('./batch-times-watched');
const batchOwnedRouter = require('./batch-owned');
const addAnimeRouter = require('./add-anime');
const addExistingRouter = require('./add-existing');
const deleteAnimeRouter = require('./delete-anime');
const othersRatedRouter = require('./get-others-users-animes-rated');
const moveAnimeFromWatchlistRouter = require('./move-anime-from-watchlist-to-watched');

const router = express.Router();

router.use(getAnimeWatchersRouter);
router.use(getEntitiesRouter);
router.use(getMergedRouter);
router.use(getWatchlistRouter);
router.use(moveAnimeFromWatchlistRouter);
router.use(othersRatedRouter);
router.use(getAnimesRouter);
router.use(saveAnimeRouter);
router.use(batchRatingRouter);
router.use(batchTimesWatchedRouter);
router.use(batchOwnedRouter);
router.use(addAnimeRouter);
router.use(addExistingRouter);
router.use(deleteAnimeRouter);

module.exports = router;

export {};
