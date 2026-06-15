const express = require('express');

const router = express.Router();

const {
    getMyStatistics
} = require('../controllers/statistics.controller');

const {
    verifyToken
} = require('../middlewares/auth.middleware');
const {
    getMonthlyStatistics
} = require('../controllers/statistics.controller');
router.get(
    '/my-statistics',
    verifyToken,
    getMyStatistics
);
router.get(
    '/monthly',
    verifyToken,
    getMonthlyStatistics
);

module.exports = router;