const express = require('express');

const router = express.Router();

const {
    getAllStations,
    getStationsPagination,
    getStationById,
    searchStations,
    createStation,
    updateStation,
    deleteStation,
    toggleStationStatus
} = require('../controllers/station.controller');
const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');
router.get('/', getAllStations);
router.get('/pagination',getStationsPagination);
router.get('/search', searchStations);
router.get('/:id', getStationById);
router.post(
    '/',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    createStation
);
router.put(
    '/:id',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    updateStation
);
router.delete(
    '/:id',
    verifyToken,
    authorizeRoles('admin', 'store_owner'),
    deleteStation
);
router.put(
    '/:id/status',
    verifyToken,
    authorizeRoles('admin'),
    toggleStationStatus
);

module.exports = router;