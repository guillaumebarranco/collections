const express = require('express');
const getManwhaWatchersRouter = require('./get-manwha-watchers');
const getManwhasRouter = require('./get-manwhas');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const getMergedRouter = require('./get-merged');
const saveManwhaRouter = require('./save-manwha');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addManwhaRouter = require('./add-manwha');
const addExistingRouter = require('./add-existing');
const moveManwhaFromReadlistRouter = require('./move-manwha-from-readlist-to-read');
const deleteManwhaRouter = require('./delete-manwha');
const othersRatedRouter = require('./get-others-users-manwhas-rated');

const router = express.Router();

router.use(getManwhaWatchersRouter);
router.use(getEntitiesRouter);
router.use(getMergedRouter);
router.use(getReadlistRouter);
router.use(othersRatedRouter);
router.use(getManwhasRouter);
router.use(saveManwhaRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addManwhaRouter);
router.use(addExistingRouter);
router.use(moveManwhaFromReadlistRouter);
router.use(deleteManwhaRouter);

module.exports = router;

export {};
