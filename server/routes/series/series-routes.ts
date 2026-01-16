const express = require('express');
const getSeriesRouter = require('./get-series');
const getEntitiesRouter = require('./get-entities');
const saveSerieRouter = require('./save-serie');
const addSerieRouter = require('./add-serie');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getSeriesRouter);
router.use(saveSerieRouter);
router.use(addSerieRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
