const express = require('express');

const router = express.Router();

const getGameWatchers = require('./get-game-watchers');
const getGames = require('./get-games');
const getGamelist = require('./get-gamelist');
const getEntities = require('./get-entities');
const saveGame = require('./save-game');
const batchRating = require('./batch-rating');
const batchTimesFinished = require('./batch-times-finished');
const batchOwned = require('./batch-owned');
const addGame = require('./add-game');
const addExisting = require('./add-existing');
const moveGameFromGamelistRouter = require('./move-game-from-gamelist-to-played');
const deleteGame = require('./delete-game');
const othersRatedRouter = require('./get-others-users-games-rated');

router.use('/', getGameWatchers);
router.use('/', getGamelist);
router.use('/', othersRatedRouter);
// /entities avant /:userId — sinon "entities" est pris pour un userId
router.use('/', getEntities);
router.use('/', getGames);
router.use('/', saveGame);
router.use('/', batchRating);
router.use('/', batchTimesFinished);
router.use('/', batchOwned);
router.use('/', addGame);
router.use('/', addExisting);
router.use('/', moveGameFromGamelistRouter);
router.use('/', deleteGame);

module.exports = router;

export {};
