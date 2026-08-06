const express = require("express");
const router = express.Router();

const {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    countUnreadNotifications
} = require("../controllers/notification.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

// Lấy thông báo của người dùng
router.get("/", verifyToken, getMyNotifications);

// Đếm số thông báo chưa đọc
router.get("/unread-count", verifyToken, countUnreadNotifications);

// Đánh dấu TẤT CẢ thông báo là đã đọc
router.put("/read-all", verifyToken, markAllNotificationsAsRead);

// Đánh dấu 1 thông báo là đã đọc
router.put("/:id/read", verifyToken, markNotificationAsRead);

module.exports = router;