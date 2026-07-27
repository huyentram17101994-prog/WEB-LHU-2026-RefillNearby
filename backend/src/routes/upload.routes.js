const express = require('express');

const router = express.Router();

const {
    uploadImage
} = require('../controllers/upload.controller');

const upload = require('../middlewares/upload.middleware');

const {
    verifyToken
} = require('../middlewares/auth.middleware');

// ================= UPLOAD IMAGE =================
router.post(
    '/',
    verifyToken,
    upload.single('image'),
    uploadImage
);
router.post(
    '/avatar',
    verifyToken,
    upload.single('image'),
    uploadImage
);
module.exports = router;