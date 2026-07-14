const express = require("express");

const router = express.Router();

const {

    getMyNotifications,

    markNotificationAsRead,
    countUnreadNotifications

} = require("../controllers/notification.controller");

const {

    verifyToken

} = require("../middlewares/auth.middleware");

// Lấy thông báo của người dùng

router.get(

    "/",

    verifyToken,

    getMyNotifications

);
router.get(

    "/unread-count",

    verifyToken,

    countUnreadNotifications

);

router.put(

    "/:id/read",

    verifyToken,

    markNotificationAsRead

);

module.exports = router;