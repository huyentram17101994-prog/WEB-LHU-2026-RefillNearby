const express = require('express');

const router = express.Router();

const {
    getFavorites,
    addFavorite,
    deleteFavorite,
    getFavoriteProducts,
    addFavoriteProduct,
    deleteFavoriteProduct
    
} = require('../controllers/favorite.controller');

const {
    verifyToken
} = require('../middlewares/auth.middleware');



// ===== Trạm yêu thích =====
router.get(
    '/',
    verifyToken,
    getFavorites
);

router.post(
    '/',
    verifyToken,
    addFavorite
);

router.delete(
    '/:id',
    verifyToken,
    deleteFavorite
);

// ===== Sản phẩm yêu thích =====
router.get(
    '/products',
    verifyToken,
    getFavoriteProducts
);

router.post(
    '/products',
    verifyToken,
    addFavoriteProduct
);

router.delete(
    '/products/:id',
    verifyToken,
    deleteFavoriteProduct
);



module.exports = router;