const express = require('express');

const router = express.Router();

const {
    getAllStations,
    getStationById,
    searchStations,
    createStation,
    updateStation,
    deleteStation
} = require('../controllers/station.controller');
const {
    verifyToken,
    authorizeRoles
} = require('../middlewares/auth.middleware');
router.get('/', getAllStations);
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

module.exports = router;