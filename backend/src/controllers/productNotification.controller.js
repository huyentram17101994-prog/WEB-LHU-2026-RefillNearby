const sql = require("mssql");
const config = require("../config/db.config");

// =============================
// Đăng ký nhận thông báo
// =============================
const registerNotification = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const { station_id, product_id } = req.body;

        await sql.connect(config);

        // Kiểm tra đã đăng ký chưa
        const check = await sql.query`

            SELECT *

            FROM product_notification_requests

            WHERE

                user_id = ${user_id}

                AND station_id = ${station_id}

                AND product_id = ${product_id}

                AND status = 'waiting'

        `;

        if (check.recordset.length > 0) {

            return res.status(400).json({

                message: "Bạn đã đăng ký rồi."

            });

        }

        await sql.query`

            INSERT INTO product_notification_requests
            (
                user_id,
                station_id,
                product_id
            )

            VALUES
            (
                ${user_id},
                ${station_id},
                ${product_id}
            )

        `;

        res.json({

            message: "Đăng ký thành công."

        });

    }

    catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

module.exports = {

    registerNotification

};