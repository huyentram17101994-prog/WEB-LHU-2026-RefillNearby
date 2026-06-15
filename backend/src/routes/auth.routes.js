const express = require('express');

const router = express.Router();

const {
    register,
    login,
    profile,
    forgotPassword
} = require('../controllers/auth.controller');
const {
    verifyToken
} = require('../middlewares/auth.middleware');
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);
router.post('/forgot-password',forgotPassword );

module.exports = router;