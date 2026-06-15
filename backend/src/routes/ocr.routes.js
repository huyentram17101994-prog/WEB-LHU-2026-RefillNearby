const express = require('express');

const router = express.Router();

const multer = require('multer');

const {
    analyzeInvoice
} = require('../controllers/ocr.controller');

const upload = multer({
    dest: 'uploads/'
});

router.post(
    '/analyze',
    upload.single('image'),
    analyzeInvoice
);

module.exports = router;