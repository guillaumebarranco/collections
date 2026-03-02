const express = require('express');
const getQuizzs = require('./get-quizzs');
const saveQuizz = require('./save-quizz');
const getScores = require('./get-scores');
const postScore = require('./post-score');

const router = express.Router();

router.use('/', getScores);
router.use('/', postScore);
router.use('/', getQuizzs);
router.use('/', saveQuizz);

module.exports = router;

export {};
