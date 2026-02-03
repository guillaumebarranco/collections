const express = require('express');
const getMoviesRouter = require('./get-movies');
const getWatchlistRouter = require('./get-watchlist');
const getEntitiesRouter = require('./get-entities');
const saveMovieRouter = require('./save-movie');
const batchRatingRouter = require('./batch-rating');
const batchTimesWatchedRouter = require('./batch-times-watched');
const batchOwnedRouter = require('./batch-owned');
const batchCinemaRouter = require('./batch-cinema');
const addMovieRouter = require('./add-movie');
const addExistingRouter = require('./add-existing');
const deleteMovieRouter = require('./delete-movie');
const othersRatedRouter = require('./get-others-users-movies-rated');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getWatchlistRouter);
router.use(othersRatedRouter);
router.use(getMoviesRouter);
router.use(saveMovieRouter);
router.use(batchRatingRouter);
router.use(batchTimesWatchedRouter);
router.use(batchOwnedRouter);
router.use(batchCinemaRouter);
router.use(addMovieRouter);
router.use(addExistingRouter);
router.use(deleteMovieRouter);

module.exports = router;

export {};
