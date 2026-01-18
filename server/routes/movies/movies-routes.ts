const express = require('express');
const getMoviesRouter = require('./get-movies');
const getEntitiesRouter = require('./get-entities');
const saveMovieRouter = require('./save-movie');
const batchRatingRouter = require('./batch-rating');
const batchTimesWatchedRouter = require('./batch-times-watched');
const addMovieRouter = require('./add-movie');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMoviesRouter);
router.use(saveMovieRouter);
router.use(batchRatingRouter);
router.use(batchTimesWatchedRouter);
router.use(addMovieRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
