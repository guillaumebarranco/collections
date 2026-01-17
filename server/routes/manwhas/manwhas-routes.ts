const express = require('express');
const getManwhasRouter = require('./get-manwhas');
const getEntitiesRouter = require('./get-entities');
const saveManwhaRouter = require('./save-manwha');
const addManwhaRouter = require('./add-manwha');
const addExistingRouter = require('./add-existing');

const router = express.Router();

router.use(getEntitiesRouter);
router.use(getManwhasRouter);
router.use(saveManwhaRouter);
router.use(addManwhaRouter);
router.use(addExistingRouter);

module.exports = router;

export {};
