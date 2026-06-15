const express = require('express');

const router = express.Router();

const {
    createRefillHistory,
    getMyRefillHistory
} = require('../controllers/RefillHistory.controller');

const {
    verifyToken
} = require('../middlewares/auth.middleware');

router.post(
    '/',
    verifyToken,
    createRefillHistory
);

router.get(
    '/my-history',
    verifyToken,
    getMyRefillHistory
);

module.exports = router;