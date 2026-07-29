const express = require('express');
const getBookWatchersRouter = require('./get-book-watchers');
const getBooksRouter = require('./get-books');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const getMergedRouter = require('./get-merged');
const saveBookRouter = require('./save-book');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addBookRouter = require('./add-book');
const addExistingRouter = require('./add-existing');
const deleteBookRouter = require('./delete-book');
const othersRatedRouter = require('./get-others-users-books-rated');
const moveBookFromReadlistRouter = require('./move-book-from-readlist-to-read');

const router = express.Router();

router.use(getBookWatchersRouter);
router.use(getEntitiesRouter);
router.use(getMergedRouter);
router.use(getReadlistRouter);
router.use(othersRatedRouter);
router.use(getBooksRouter);
router.use(saveBookRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addBookRouter);
router.use(addExistingRouter);
router.use(deleteBookRouter);
router.use(moveBookFromReadlistRouter);

module.exports = router;

export {};
