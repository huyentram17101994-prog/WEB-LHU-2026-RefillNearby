const sql = require('mssql');
const config = require('../config/db.config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendTempPasswordEmail, sendApprovalEmail } = require('../services/email.service');
const { logAudit } = require('../services/audit.service');
const { ensureUsersTableColumns } = require('../services/dbSetup.service');

const getDashboard = async (req, res) => {

    try {

        await sql.connect(config);

const result =
    await sql.query(
        'EXEC sp_GetAdminDashboard'
    );

res.json(
    result.recordset[0]
);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllUsers = async (req, res) => {

    try {

        await ensureUsersTableColumns();
        await sql.connect(config);

        const result = await sql.query`
            SELECT
                user_id,
                full_name,
                email,
                phone,
                role,
                status,
                must_change_password,
                reset_requested,
                reset_requested_at,
                created_at
            FROM users
            ORDER BY reset_requested DESC, user_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const deleteUser = async (req, res) => {

    try {

        const userId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM users
            WHERE user_id = ${userId}
        `;

        res.json({
            message: 'Xóa thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllStations = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                s.station_id,
                s.station_name,
                s.address,
                s.status,
                u.full_name AS owner_name
            FROM refill_stations s
            LEFT JOIN users u
                ON s.owner_id = u.user_id
            ORDER BY s.station_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const deleteStation = async (req, res) => {

    try {

        const stationId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM refill_stations
            WHERE station_id = ${stationId}
        `;

        res.json({
            message: 'Xóa thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllProducts = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                p.product_id,
                p.product_name,
                p.brand,
                p.price,
                p.stock_status,
                p.image_url,
                s.station_name,
                u.full_name AS owner_name
            FROM products p
            LEFT JOIN refill_stations s
                ON p.station_id = s.station_id
            LEFT JOIN users u
                ON s.owner_id = u.user_id
            ORDER BY p.product_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const deleteProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM products
            WHERE product_id = ${productId}
        `;

        res.json({
            message: 'Xóa sản phẩm thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllReviews = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
    r.review_id,
    r.rating,
    r.comment,
    r.created_at,
    r.owner_reply,
    r.replied_at,
    u.full_name,

    s.station_name,

    owner.full_name AS owner_name

FROM reviews r

LEFT JOIN users u
    ON r.user_id = u.user_id

LEFT JOIN refill_stations s
    ON r.station_id = s.station_id

LEFT JOIN users owner
    ON s.owner_id = owner.user_id

ORDER BY r.review_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const deleteReview = async (req, res) => {

    try {

        const reviewId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM reviews
            WHERE review_id = ${reviewId}
        `;

        res.json({
            message: 'Xóa thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllRefills = async (req, res) => {

    try {

        await sql.connect(config);
        const { fromDate, toDate } = req.query;
        if (fromDate && toDate) {

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const diffDays =
        (to - from) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {

        return res.status(400).json({
            message: "Chỉ được lọc tối đa trong khoảng 30 ngày."
        });

    }

}
        const from = fromDate || null;
        const to = toDate || null;
        const result = await sql.query`
            SELECT
                rh.refill_id,
                rh.quantity,
                rh.refill_date,

                u.full_name,
                owner.full_name AS owner_name,
                s.station_name,
               

                p.product_name

            FROM refill_history rh

LEFT JOIN users u
    ON rh.user_id = u.user_id

LEFT JOIN refill_stations s
    ON rh.station_id = s.station_id
LEFT JOIN users owner
    ON s.owner_id = owner.user_id

LEFT JOIN products p
    ON rh.product_id = p.product_id

WHERE
(
    ${from} IS NULL
    OR CAST(rh.refill_date AS DATE) >= ${from}
)
AND
(
    ${to} IS NULL
    OR CAST(rh.refill_date AS DATE) <= ${to}
)

ORDER BY rh.refill_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getRefillSummary = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT

    COUNT(*) AS total_refills,

    SUM(
        CASE
            WHEN CAST(refill_date AS DATE)
                = CAST(GETDATE() AS DATE)
            THEN 1
            ELSE 0
        END
    ) AS today_refills,

    SUM(
        CASE
            WHEN
                MONTH(refill_date) = MONTH(GETDATE())
                AND
                YEAR(refill_date) = YEAR(GETDATE())
            THEN 1
            ELSE 0
        END
    ) AS month_refills

FROM refill_history

        `;

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getRefillStatistics = async (req, res) => {

    try {

        await sql.connect(config);

      

        const topProducts = await sql.query`
            SELECT TOP 5
                p.product_name,
                SUM(r.quantity) AS totalQuantity
            FROM refill_history r
            INNER JOIN products p
                ON r.product_id = p.product_id
            GROUP BY p.product_name
            ORDER BY totalQuantity DESC
        `;
     const statistics = await sql.query`

SELECT

    ISNULL(SUM(quantity),0) AS totalQuantity,

    ISNULL(

        SUM(

            CASE

                WHEN CAST(refill_date AS DATE)=CAST(GETDATE() AS DATE)

                THEN quantity

                ELSE 0

            END

        ),0

    ) AS todayQuantity,

    ISNULL(

        SUM(

            CASE

                WHEN MONTH(refill_date)=MONTH(GETDATE())

                AND YEAR(refill_date)=YEAR(GETDATE())

                THEN quantity

                ELSE 0

            END

        ),0

    ) AS monthQuantity

FROM refill_history

`;
const refillByMonth = await sql.query`
    SELECT
        MONTH(refill_date) AS month,
        SUM(quantity) AS totalQuantity
    FROM refill_history
    WHERE YEAR(refill_date) = YEAR(GETDATE())
    GROUP BY MONTH(refill_date)
    ORDER BY month
`;
        res.json({

    totalQuantity:
        statistics.recordset[0].totalQuantity,

    todayQuantity:
        statistics.recordset[0].todayQuantity,

    monthQuantity:
        statistics.recordset[0].monthQuantity,

    topProducts:
        topProducts.recordset,
        
    refillByMonth:
    refillByMonth.recordset

});

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getRatingStatistics = async (req, res) => {
    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                rating,
                COUNT(*) AS total
            FROM reviews
            GROUP BY rating
            ORDER BY rating ASC
        `;

        res.json(result.recordset);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};
const getRefillQuantityByDate = async (req, res) => {

    try {

        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {

            return res.status(400).json({
                message: "Vui lòng chọn khoảng thời gian."
            });

        }

        await sql.connect(config);

        const result = await sql.query`

            SELECT

                ISNULL(SUM(quantity), 0) AS total_quantity

            FROM refill_history

            WHERE

                CAST(refill_date AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

        `;

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getDashboardStatisticsByDate = async (req, res) => {

    try {

        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {

            return res.status(400).json({
                message: "Vui lòng chọn khoảng thời gian."
            });

        }

        await sql.connect(config);

        // ===================
        // Tổng lượng refill
        // ===================

        const statistics = await sql.query`

            SELECT

                ISNULL(SUM(quantity),0) AS totalQuantity

            FROM refill_history

            WHERE

                CAST(refill_date AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

        `;

        // ===================
        // Refill theo tháng
        // ===================

        const refillByMonth = await sql.query`

            SELECT

                MONTH(refill_date) AS month,

                SUM(quantity) AS totalQuantity

            FROM refill_history

            WHERE

                CAST(refill_date AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

            GROUP BY
                MONTH(refill_date)

            ORDER BY
                MONTH(refill_date)

        `;

        // ===================
        // Top sản phẩm
        // ===================

        const topProducts = await sql.query`

            SELECT TOP 5

                p.product_name,

                SUM(rh.quantity) AS total_quantity

            FROM refill_history rh

            INNER JOIN products p
                ON rh.product_id = p.product_id

            WHERE

                CAST(rh.refill_date AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

            GROUP BY
                p.product_name

            ORDER BY
                total_quantity DESC

        `;

        // ===================
        // Top trạm
        // ===================

        const topStations = await sql.query`

            SELECT TOP 5

                rs.station_name,

                SUM(rh.quantity) AS totalQuantity

            FROM refill_history rh

            INNER JOIN refill_stations rs
                ON rh.station_id = rs.station_id

            WHERE

                CAST(rh.refill_date AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

            GROUP BY
                rs.station_name

            ORDER BY
                totalQuantity DESC

        `;

        res.json({

            totalQuantity:
                statistics.recordset[0].totalQuantity,

            refillByMonth:
                refillByMonth.recordset,

            topProducts:
                topProducts.recordset,

            topStations:
                topStations.recordset

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getRatingStatisticsByDate = async (req, res) => {

    try {

        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {

            return res.status(400).json({
                message: "Vui lòng chọn khoảng thời gian."
            });

        }

        await sql.connect(config);

        const result = await sql.query`

            SELECT

                rating,

                COUNT(*) AS total

            FROM reviews

            WHERE

                CAST(created_at AS DATE)

                BETWEEN ${fromDate}

                AND ${toDate}

            GROUP BY rating

            ORDER BY rating

        `;

        res.json(result.recordset);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllFavorites = async (req, res) => {

    try {

        await sql.connect(config);
        const { fromDate, toDate } = req.query;
        if (fromDate && toDate) {

    const result = await sql.query`

        SELECT

            f.favorite_id,

            u.full_name,

            s.station_name,

            owner.full_name AS owner_name,

            FORMAT(f.created_at,'dd/MM/yyyy HH:mm:ss') AS created_at

        FROM favorites f

        INNER JOIN users u
            ON f.user_id = u.user_id

        INNER JOIN refill_stations s
            ON f.station_id = s.station_id

        LEFT JOIN users owner
            ON s.owner_id = owner.user_id

        WHERE
            CAST(f.created_at AS DATE)
            BETWEEN CAST(${fromDate} AS DATE)
            AND CAST(${toDate} AS DATE)

        ORDER BY
            f.favorite_id DESC

    `;

    return res.json(result.recordset);

}
        const result = await sql.query`

            SELECT

                f.favorite_id,

                u.full_name,

                s.station_name,

                owner.full_name AS owner_name,

                FORMAT(f.created_at, 'dd/MM/yyyy HH:mm:ss') AS created_at

            FROM favorites f

            INNER JOIN users u
                ON f.user_id = u.user_id

            INNER JOIN refill_stations s
                ON f.station_id = s.station_id

            LEFT JOIN users owner
                ON s.owner_id = owner.user_id

            ORDER BY
                f.favorite_id DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getFavoriteStationCount = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT

                COUNT(*) AS totalFavorites

            FROM favorites

        `;

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getFavoriteProductCount = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT

                COUNT(*) AS totalFavorites

            FROM favorite_products

        `;

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getTopFavoriteStations = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT TOP 5

                s.station_name,

                COUNT(*) AS totalFavorites

            FROM favorites f

            INNER JOIN refill_stations s
                ON f.station_id = s.station_id

            GROUP BY
                s.station_name

            ORDER BY
                totalFavorites DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const getTopFavoriteProducts = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT TOP 5

                p.product_name,

                COUNT(*) AS totalFavorites

            FROM favorite_products fp

            INNER JOIN products p
                ON fp.product_id = p.product_id

            GROUP BY

                p.product_name

            ORDER BY

                totalFavorites DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};

const approveUser = async (req, res) => {
    try {
        const userId = req.params.id;
        await sql.connect(config);

        const userCheck = await sql.query`
            SELECT user_id, full_name, email FROM users WHERE user_id = ${userId}
        `;

        await sql.query`
            UPDATE users
            SET status = 'active'
            WHERE user_id = ${userId}
        `;

        if (userCheck.recordset.length > 0) {
            const targetUser = userCheck.recordset[0];
            await sendApprovalEmail(targetUser.email, targetUser.full_name);
        }

        res.json({
            message: "Duyệt tài khoản Chủ trạm thành công! Người dùng hiện đã có quyền đăng nhập và sử dụng trang quản lý."
        });

    } catch (error) {
        console.error("Lỗi approveUser:", error);
        res.status(500).json({
            error: error.message
        });
    }
};

const toggleUserStatus = async (req, res) => {

    try {

        const userId = req.params.id;

        await sql.connect(config);

        // Lấy trạng thái hiện tại

        const result = await sql.query`
            SELECT
                user_id,
                status
            FROM users
            WHERE user_id = ${userId}
        `;

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            });

        }

        const user = result.recordset[0];

        const newStatus =
            user.status === "active"
            ? "inactive"
            : "active";

        await sql.query`
            UPDATE users
            SET status = ${newStatus}
            WHERE user_id = ${userId}
        `;

        res.json({
            message: "Cập nhật trạng thái thành công"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }

};
const getStationDetail = async (req, res) => {

    try {

        const stationId = req.params.id;

        await sql.connect(config);

        const result = await sql.query`

            SELECT

                rs.station_id,
                rs.owner_id,
                rs.station_name,
                rs.address,
                rs.latitude,
                rs.longitude,

                CONVERT(VARCHAR(5), rs.open_time, 108) AS open_time,

                CONVERT(VARCHAR(5), rs.close_time, 108) AS close_time,

                rs.description,
                rs.image_url,

                u.full_name AS owner_name,
                u.email AS owner_email

            FROM refill_stations rs

            LEFT JOIN users u
            ON rs.owner_id = u.user_id

            WHERE rs.station_id = ${stationId}

        `;

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: "Không tìm thấy trạm."
            });

        }

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getTopRefillProducts = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT TOP 5

                p.product_name,

                SUM(rh.quantity) AS total_quantity

            FROM refill_history rh

            INNER JOIN products p
                ON rh.product_id = p.product_id

            GROUP BY
                p.product_name

            ORDER BY
                total_quantity DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getTopStations = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`

            SELECT TOP 5

                rs.station_name,

                SUM(rh.quantity) AS totalQuantity

            FROM refill_history rh

            INNER JOIN refill_stations rs
                ON rh.station_id = rs.station_id

            GROUP BY
                rs.station_name

            ORDER BY
                totalQuantity DESC

        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



/**
 * Tạo mật khẩu tạm ngẫu nhiên đủ độ phức tạp (chữ hoa, chữ thường, số, ký tự đặc biệt)
 */
const generateSecureTempPassword = (length = 10) => {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";
    const allChars = uppercase + lowercase + numbers + symbols;

    let password = "";
    // Đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
    password += uppercase[crypto.randomInt(0, uppercase.length)];
    password += lowercase[crypto.randomInt(0, lowercase.length)];
    password += numbers[crypto.randomInt(0, numbers.length)];
    password += symbols[crypto.randomInt(0, symbols.length)];

    for (let i = 4; i < length; i++) {
        password += allChars[crypto.randomInt(0, allChars.length)];
    }

    // Xáo trộn chuỗi mật khẩu
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};

/**
 * Admin Reset Mật Khẩu và Gửi Mật Khẩu Tạm cho Người Dùng
 */
const resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user?.user_id;

        await ensureUsersTableColumns();
        await sql.connect(config);

        // Lấy thông tin user
        const userCheck = await sql.query`
            SELECT user_id, full_name, email, role, status, reset_requested
            FROM users
            WHERE user_id = ${id}
        `;

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const targetUser = userCheck.recordset[0];

        if (targetUser.role === 'admin') {
            return res.status(403).json({ message: 'Không thể reset mật khẩu của tài khoản Admin khác.' });
        }

        if (!targetUser.reset_requested) {
            return res.status(400).json({ message: 'Người dùng này chưa gửi yêu cầu Quên / Reset mật khẩu.' });
        }

        // Sinh mật khẩu tạm an toàn
        const tempPassword = generateSecureTempPassword(10);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const EXPIRE_MINUTES = 30;

        // Cập nhật DB: password, must_change_password=1, temp_password_expires_at = DATEADD(minute, 30, GETDATE()), reset_requested = 0
        await sql.query`
            UPDATE users
            SET password = ${hashedPassword},
                must_change_password = 1,
                temp_password_expires_at = DATEADD(minute, ${EXPIRE_MINUTES}, GETDATE()),
                reset_requested = 0,
                reset_requested_at = NULL
            WHERE user_id = ${id}
        `;

        // Ghi Audit Log
        await logAudit(
            adminId,
            targetUser.user_id,
            'RESET_USER_PASSWORD',
            `Admin #${adminId} đã reset mật khẩu cho người dùng #${targetUser.user_id} (${targetUser.email}). Mật khẩu tạm có hiệu lực 30 phút.`
        );

        // Gửi Email thông báo mật khẩu tạm
        await sendTempPasswordEmail(
            targetUser.email,
            targetUser.full_name,
            tempPassword,
            EXPIRE_MINUTES
        );

        return res.json({
            message: `Reset mật khẩu thành công! Mật khẩu tạm đã được gửi tới email ${targetUser.email}`,
            tempPassword: tempPassword,
            expiresInMinutes: EXPIRE_MINUTES
        });

    } catch (error) {
        console.error("Lỗi resetUserPassword:", error);
        return res.status(500).json({ error: error.message || 'Lỗi hệ thống khi reset mật khẩu' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email } = req.body;
        await sql.connect(config);

        if (!email || !email.trim()) {
            return res.status(400).json({ message: 'Email không được để trống.' });
        }

        const checkEmail = await sql.query`
            SELECT user_id FROM users WHERE email = ${email.trim()} AND user_id != ${id}
        `;
        if (checkEmail.recordset.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng bởi tài khoản khác.' });
        }

        await sql.query`
            UPDATE users
            SET full_name = ${full_name ? full_name.trim() : ''},
                email = ${email.trim()}
            WHERE user_id = ${id}
        `;

        res.json({ message: 'Cập nhật thông tin người dùng thành công!' });
    } catch (error) {
        console.error("Lỗi updateUser:", error);
        res.status(500).json({ error: error.message || 'Không thể cập nhật người dùng.' });
    }
};

module.exports = {
    getDashboard,
    getAllUsers,
    deleteUser,
    updateUser,
    getAllStations,
    getTopStations,
    deleteStation,
    getAllProducts,
    deleteProduct,
    getAllReviews,
    deleteReview,
    getAllRefills,
    getRefillSummary,
    getRefillStatistics,
    getRatingStatistics,
    getRatingStatisticsByDate,
    getRefillQuantityByDate,
    getDashboardStatisticsByDate,
    getAllFavorites,
    getTopFavoriteStations, 
    getTopFavoriteProducts,
    getFavoriteStationCount,
    getFavoriteProductCount,
    toggleUserStatus,
    approveUser,
    getStationDetail,
    getTopRefillProducts,
    resetUserPassword
};