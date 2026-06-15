const express = require('express');

const router = express.Router();

const {
    getAllReviews,
    getReviewsByStation,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/review.controller');

const {
    verifyToken
} = require('../middlewares/auth.middleware');



// ================= GET ALL REVIEWS =================

router.get('/', getAllReviews);



// ================= GET REVIEWS BY STATION =================

router.get(
    '/station/:stationId',
    getReviewsByStation
);



// ================= CREATE REVIEW =================

router.post(
    '/',
    verifyToken,
    createReview
);



// ================= UPDATE REVIEW =================

router.put(
    '/:id',
    verifyToken,
    updateReview
);



// ================= DELETE REVIEW =================

router.delete(
    '/:id',
    verifyToken,
    deleteReview
);



module.exports = router;