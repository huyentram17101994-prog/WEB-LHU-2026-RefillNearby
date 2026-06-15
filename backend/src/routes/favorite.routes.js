const express = require('express');

const router = express.Router();

const {
    getFavorites,
    addFavorite,
    deleteFavorite
} = require('../controllers/favorite.controller');

const {
    verifyToken
} = require('../middlewares/auth.middleware');



// ================= GET FAVORITES =================
router.get(
    '/',
    verifyToken,
    getFavorites
);



// ================= ADD FAVORITE =================
router.post(
    '/',
    verifyToken,
    addFavorite
);



// ================= DELETE FAVORITE =================
router.delete(
    '/:id',
    verifyToken,
    deleteFavorite
);



module.exports = router;