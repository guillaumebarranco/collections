const express = require('express');
const getBdsRouter = require('./get-bds');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveBdRouter = require('./save-bd');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const addBdRouter = require('./add-bd');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(getBdsRouter);
router.use(saveBdRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(addBdRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
