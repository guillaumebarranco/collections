const express = require('express');
const getManwhasRouter = require('./get-manwhas');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveManwhaRouter = require('./save-manwha');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const addManwhaRouter = require('./add-manwha');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(getManwhasRouter);
router.use(saveManwhaRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(addManwhaRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
