const express = require('express');
const getBdWatchersRouter = require('./get-bd-watchers');
const getBdsRouter = require('./get-bds');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveBdRouter = require('./save-bd');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addBdRouter = require('./add-bd');
const addExistingRouter = require('./add-existing');
const moveBdFromReadlistRouter = require('./move-bd-from-readlist-to-read');
const deleteBdRouter = require('./delete-bd');
const othersRatedRouter = require('./get-others-users-bds-rated');

const router = express.Router();

router.use(getBdWatchersRouter);
router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(othersRatedRouter);
router.use(getBdsRouter);
router.use(saveBdRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addBdRouter);
router.use(addExistingRouter);
router.use(moveBdFromReadlistRouter);
router.use(deleteBdRouter);

module.exports = router;

export {};
