const express = require('express');
const getUsersListRouter = require('./get-users-list');
const getTopFiveRouter = require('./get-top-five');
const putTopFiveRouter = require('./put-top-five');
const getBadgesRouter = require('./get-badges');
const getProfileBadgeRouter = require('./get-profile-badge');
const putProfileBadgeRouter = require('./put-profile-badge');
const moviesListsRouter = require('./movies-lists');
const getFollowsRouter = require('./get-follows');
const getFeedRouter = require('./get-feed');
const postFollowsRouter = require('./post-follows');
const deleteFollowRouter = require('./delete-follow');

const router = express.Router();

router.use(getUsersListRouter);
router.use(getTopFiveRouter);
router.use(putTopFiveRouter);
router.use(getBadgesRouter);
router.use(getProfileBadgeRouter);
router.use(putProfileBadgeRouter);
router.use(moviesListsRouter);
router.use(getFollowsRouter);
router.use(getFeedRouter);
router.use(postFollowsRouter);
router.use(deleteFollowRouter);

module.exports = router;

export {};
