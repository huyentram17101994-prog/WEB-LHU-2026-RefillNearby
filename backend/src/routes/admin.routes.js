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
    getTopStations,
    getRefillSummary,
    getRefillStatistics,
    getRefillQuantityByDate,
    getAllFavorites,
    getTopFavoriteStations,
    getTopFavoriteProducts,
    getFavoriteStationCount,
    getFavoriteProductCount,
    toggleUserStatus,
    getStationDetail,
    getTopRefillProducts
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
router.put(
    '/users/:id/toggle-status',
    verifyToken,
    authorizeRoles('admin'),
    toggleUserStatus
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
    '/refills/summary',
    verifyToken,
    authorizeRoles('admin'),
    getRefillSummary
);
router.get(
    '/refills/statistics',
    verifyToken,
    authorizeRoles('admin'),
    getRefillStatistics
);
router.get(
    '/refill-statistics/filter',
    verifyToken,
    authorizeRoles('admin'),
    getRefillQuantityByDate
);

router.get(
    '/favorites',
    verifyToken,
    authorizeRoles('admin'),
    getAllFavorites
);

router.get(
    '/favorites/top-stations',
    verifyToken,
    authorizeRoles('admin'),
    getTopFavoriteStations
);

router.get(
    '/favorites/top-products',
    verifyToken,
    authorizeRoles('admin'),
    getTopFavoriteProducts
);
router.get(
    '/favorites/station-count',
    verifyToken,
    authorizeRoles('admin'),
    getFavoriteStationCount
);

router.get(
    '/favorites/product-count',
    verifyToken,
    authorizeRoles('admin'),
    getFavoriteProductCount
);
router.get(
    '/stations/:id',
    verifyToken,
    authorizeRoles('admin'),
    getStationDetail
);

router.get(
    '/refill-statistics/top-products',
    verifyToken,
    authorizeRoles('admin'),
    getTopRefillProducts
);
router.get(
    '/refill-statistics/top-stations',
    verifyToken,
    authorizeRoles('admin'),
    getTopStations
);




module.exports = router;