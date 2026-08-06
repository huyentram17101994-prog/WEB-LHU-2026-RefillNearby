const sql = require("mssql");
const config = require("../config/db.config");

// ======================
// Lấy thông báo của user (Mới nhất lên đầu)
// ======================
const getMyNotifications = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        await sql.connect(config);

        // Quy định: Tự động xóa bớt các thông báo cũ nhất nếu quá 20 thông báo
        await sql.query`
            DELETE FROM notifications
            WHERE user_id = ${user_id}
              AND notification_id NOT IN (
                  SELECT TOP 20 notification_id
                  FROM notifications
                  WHERE user_id = ${user_id}
                  ORDER BY created_at DESC, notification_id DESC
              )
        `.catch(err => console.error("Lỗi xóa dọn dẹp thông báo cũ:", err.message));

        // Lấy 20 thông báo mới nhất
        const result = await sql.query`
            SELECT TOP 20
                notification_id,
                title,
                content,
                product_name,
                station_id,
                station_name,
                station_address,
                open_time,
                close_time,
                image_url,
                is_read,
                created_at AS raw_created_at,
                FORMAT(created_at, 'dd/MM/yyyy HH:mm:ss') AS created_at
            FROM notifications
            WHERE user_id = ${user_id}
            ORDER BY notifications.created_at DESC, notification_id DESC
        `;

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// =========Đánh dấu 1 thông báo đã đọc=============
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const user_id = req.user.user_id;

        await sql.connect(config);

        await sql.query`
            UPDATE notifications
            SET is_read = 1
            WHERE notification_id = ${notificationId}
              AND user_id = ${user_id}
        `;

        res.json({
            message: "Đã đánh dấu đã đọc"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// =========Đánh dấu TẤT CẢ thông báo đã đọc=============
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        await sql.connect(config);

        await sql.query`
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = ${user_id} AND is_read = 0
        `;

        res.json({
            message: "Đã đánh dấu tất cả là đã đọc"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// ========== Đếm thông báo chưa đọc================
const countUnreadNotifications = async (req, res) => {
    try {
        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
            SELECT COUNT(*) AS unread_count
            FROM notifications
            WHERE user_id = ${user_id} AND is_read = 0
        `;

        res.json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

module.exports = {
    getMyNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    countUnreadNotifications
};