const sql = require("mssql");
const config = require("../config/db.config");

// ======================
// Lấy thông báo của user
// ======================

const getMyNotifications = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`

    SELECT

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
     
      FORMAT(created_at, 'dd/MM/yyyy HH:mm:ss') AS created_at

    FROM notifications

    WHERE user_id = ${user_id}
    

    ORDER BY created_at DESC

`;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
// =========Đánh dấu đã đọc=============

const markNotificationAsRead = async (req, res) => {

    try {

        const notificationId = req.params.id;

        const user_id = req.user.user_id;

        await sql.connect(config);

        await sql.query`

            UPDATE notifications

            SET is_read = 1

            WHERE

                notification_id = ${notificationId}

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
// ========== Đếm thông báo chưa đọc================

const countUnreadNotifications = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`

            SELECT COUNT(*) AS unread_count

            FROM notifications

            WHERE

                user_id = ${user_id}

                AND is_read = 0

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
    countUnreadNotifications
};