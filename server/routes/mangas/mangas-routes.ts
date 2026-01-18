const express = require('express');
const getMangasRouter = require('./get-mangas');
const getEntitiesRouter = require('./get-entities');
const saveMangaRouter = require('./save-manga');
const batchRatingRouter = require('./batch-rating');
const addMangaRouter = require('./add-manga');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMangasRouter);
router.use(saveMangaRouter);
router.use(batchRatingRouter);
router.use(addMangaRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
