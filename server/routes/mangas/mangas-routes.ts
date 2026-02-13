const express = require('express');
const getMangasRouter = require('./get-mangas');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveMangaRouter = require('./save-manga');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const batchOwnedRouter = require('./batch-owned');
const addMangaRouter = require('./add-manga');
const addExistingRouter = require('./add-existing');
const moveMangaFromReadlistRouter = require('./move-manga-from-readlist-to-read');
const deleteMangaRouter = require('./delete-manga');
const othersRatedRouter = require('./get-others-users-mangas-rated');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(othersRatedRouter);
router.use(getMangasRouter);
router.use(saveMangaRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(batchOwnedRouter);
router.use(addMangaRouter);
router.use(addExistingRouter);
router.use(moveMangaFromReadlistRouter);
router.use(deleteMangaRouter);

module.exports = router;

export {};
