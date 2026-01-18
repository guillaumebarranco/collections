const express = require('express');
const getMangasRouter = require('./get-mangas');
const getReadlistRouter = require('./get-readlist');
const getEntitiesRouter = require('./get-entities');
const saveMangaRouter = require('./save-manga');
const batchRatingRouter = require('./batch-rating');
const batchTimesReadRouter = require('./batch-times-read');
const addMangaRouter = require('./add-manga');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getReadlistRouter);
router.use(getMangasRouter);
router.use(saveMangaRouter);
router.use(batchRatingRouter);
router.use(batchTimesReadRouter);
router.use(addMangaRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
