const express = require('express');

const router = express.Router();

const {
    getAllProducts,
    getProductsByStation,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStations
} = require('../controllers/product.controller');

const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');



// ================= GET PRODUCTS =================
router.get('/', getAllProducts);
router.get(
    '/station/:stationId',
    getProductsByStation
);


// ================= CREATE PRODUCT =================
router.post(
    '/',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    createProduct
);



// ================= UPDATE PRODUCT =================
router.put(
    '/:id',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    updateProduct
);



// ================= DELETE PRODUCT =================
router.delete(
    '/:id',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    deleteProduct
);

router.get(
    '/stations/:productName',
    getProductStations
);

module.exports = router;