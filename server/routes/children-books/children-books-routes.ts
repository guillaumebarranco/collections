const express = require('express');
const getChildrenBookWatchersRouter = require('./get-children-book-watchers');
const getChildrenBooksRouter = require('./get-children-books');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const getMergedRouter = require('./get-merged');
const saveChildrenBookRouter = require('./save-children-book');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addChildrenBookRouter = require('./add-children-book');
const addExistingRouter = require('./add-existing');
const deleteChildrenBookRouter = require('./delete-children-book');
const othersRatedRouter = require('./get-others-users-children-books-rated');
const moveChildrenBookFromReadlistRouter = require('./move-children-book-from-readlist-to-read');

const router = express.Router();

router.use(getChildrenBookWatchersRouter);
router.use(getEntitiesRouter);
router.use(getMergedRouter);
router.use(getReadlistRouter);
router.use(othersRatedRouter);
router.use(getChildrenBooksRouter);
router.use(saveChildrenBookRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addChildrenBookRouter);
router.use(addExistingRouter);
router.use(deleteChildrenBookRouter);
router.use(moveChildrenBookFromReadlistRouter);

module.exports = router;

export {};
