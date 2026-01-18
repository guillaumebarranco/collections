const express = require('express');

const router = express.Router();

const getGames = require('./get-games');
const getEntities = require('./get-entities');
const saveGame = require('./save-game');
const batchRating = require('./batch-rating');
const addGame = require('./add-game');
const addExisting = require('./add-existing');

router.use('/', getGames);
router.use('/', getEntities);
router.use('/', saveGame);
router.use('/', batchRating);
router.use('/', addGame);
router.use('/', addExisting);

module.exports = router;

export {};
