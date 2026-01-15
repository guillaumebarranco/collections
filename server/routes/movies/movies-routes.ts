const express = require('express');
const getMoviesRouter = require('./get-movies');
const saveMovieRouter = require('./save-movie');

const router = express.Router();

router.use(getMoviesRouter);
router.use(saveMovieRouter);

module.exports = router;

export {};
