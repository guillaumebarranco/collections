const express = require('express');
const getComicsRouter = require('./get-comics');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveComicRouter = require('./save-comic');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addComicRouter = require('./add-comic');
const addExistingRouter = require('./add-existing');
const deleteComicRouter = require('./delete-comic');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(getComicsRouter);
router.use(saveComicRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addComicRouter);
router.use(addExistingRouter);
router.use(deleteComicRouter);

module.exports = router;

export {};
