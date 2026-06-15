const express = require('express');
const router = express.Router();

const {
    getDashboard,
    getAllUsers,
    deleteUser,
    getAllStations,
    deleteStation,
    getAllProducts,
    deleteProduct,
    getAllReviews,
    deleteReview,
    getAllRefills,
    getRefillStatistics,
    getAllFavorites
} = require('../controllers/admin.controller');

const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');

router.get(
    '/dashboard',
    verifyToken,
    authorizeRoles('admin'),
    getDashboard
);

router.get(
    '/users',
    verifyToken,
    authorizeRoles('admin'),
    getAllUsers
);


router.delete(
    '/users/:id',
    verifyToken,
    authorizeRoles('admin'),
    deleteUser
);

router.get(
    '/stations',
    verifyToken,
    authorizeRoles('admin'),
    getAllStations
);
router.delete(
    '/stations/:id',
    verifyToken,
    authorizeRoles('admin'),
    deleteStation
);
router.get(
    '/products',
    verifyToken,
    authorizeRoles('admin'),
    getAllProducts
);

router.delete(
    '/products/:id',
    verifyToken,
    authorizeRoles('admin'),
    deleteProduct
);
router.get(
    '/reviews',
    verifyToken,
    authorizeRoles('admin'),
    getAllReviews
);

router.delete(
    '/reviews/:id',
    verifyToken,
    authorizeRoles('admin'),
    deleteReview
);
router.get(
    '/refills',
    verifyToken,
    authorizeRoles('admin'),
    getAllRefills
);

router.get(
    '/refills/statistics',
    verifyToken,
    authorizeRoles('admin'),
    getRefillStatistics
);
router.get(
    '/favorites',
    verifyToken,
    authorizeRoles('admin'),
    getAllFavorites
);
module.exports = router;