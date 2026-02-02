const express = require('express');
const getQuizzs = require('./get-quizzs');
const saveQuizz = require('./save-quizz');

const router = express.Router();

router.use('/', getQuizzs);
router.use('/', saveQuizz);

module.exports = router;

export {};
