const express = require('express');
const getMusicsRouter = require('./get-musics');
const getEntitiesRouter = require('./get-entities');
const getMergedRouter = require('./get-merged');
const addExistingRouter = require('./add-existing');
const batchRatingRouter = require('./batch-rating');
const batchTimesListenedRouter = require('./batch-times-listened');
const saveMusicRouter = require('./save-music');
const saveAlbumNoteRouter = require('./save-album-note');
const saveAlbumsToListenRouter = require('./save-albums-to-listen');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getMergedRouter);
router.use(getMusicsRouter);
router.use(addExistingRouter);
router.use(batchRatingRouter);
router.use(batchTimesListenedRouter);
router.use(saveAlbumNoteRouter);
router.use(saveAlbumsToListenRouter);
router.use(saveMusicRouter);

module.exports = router;

export {};
