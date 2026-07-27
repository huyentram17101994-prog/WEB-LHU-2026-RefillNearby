const express = require('express');

const router = express.Router();

const {
    register,
    login,
    profile,
    updateProfile,
     verifyPassword,
    changePassword,
    forgotPassword
} = require('../controllers/auth.controller');
const {
    verifyToken
} = require('../middlewares/auth.middleware');
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);
router.put('/profile', verifyToken, updateProfile);
router.post('/verify-password',verifyToken,verifyPassword);
router.put('/change-password',verifyToken,changePassword);
router.post('/forgot-password',forgotPassword );


module.exports = router;