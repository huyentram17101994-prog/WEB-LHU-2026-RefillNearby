const express = require('express');

const router = express.Router();

const {
    verifyToken
} = require('../middlewares/auth.middleware');

const {
    authorizeRoles
} = require('../middlewares/role.middleware');

const upload =
require('../middlewares/upload.middleware');
const {
    getMyStations,
    createMyStation,
    updateMyStation,
    deleteMyStation,

    getMyProducts,
    createMyProduct,
    updateMyProduct,
    deleteMyProduct,
    getOwnerDashboard,
    uploadProductImage,
    uploadStationImage,
    toggleProductStatus,
    getCategories

} = require('../controllers/owner.controller');
router.get(
    '/my-stations',
    verifyToken,
    authorizeRoles('store_owner'),
    getMyStations
);
router.post(
    '/stations',
    verifyToken,
    authorizeRoles('store_owner'),
    createMyStation
);
router.put(
    '/stations/:id',
    verifyToken,
    authorizeRoles('store_owner'),
    updateMyStation
);
router.delete(
    '/stations/:id',
    verifyToken,
    authorizeRoles('store_owner'),
    deleteMyStation
);
router.get(
    '/products',
    verifyToken,
    authorizeRoles('store_owner'),
    getMyProducts
);
router.post(
    '/products',
    verifyToken,
    authorizeRoles('store_owner'),
    createMyProduct
);
router.put(
    '/products/:id',
    verifyToken,
    authorizeRoles('store_owner'),
    updateMyProduct
);
router.delete(
    '/products/:id',
    verifyToken,
    authorizeRoles('store_owner'),
    deleteMyProduct
);
router.get(
    '/dashboard',
    verifyToken,
    authorizeRoles('store_owner'),
    getOwnerDashboard
);
router.post(
    '/upload-station-image',
    verifyToken,
    authorizeRoles('store_owner'),
    upload.single('image'),
    uploadStationImage
);
router.post(
    '/upload-product-image',
    verifyToken,
    authorizeRoles('store_owner'),
    upload.single('image'),
    uploadProductImage
);
router.put(
    '/products/:id/toggle-status',
    verifyToken,
    authorizeRoles('store_owner'),
    toggleProductStatus
);
router.get(
    '/categories',
    getCategories
);
module.exports = router;