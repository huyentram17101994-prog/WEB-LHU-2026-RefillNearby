const sql = require('mssql');
const config = require('../config/db.config');

// chinh sua tram 
const getMyStations = async (req, res) => {

    try {
        console.log(req.user);
        const ownerId = req.user.user_id;
        
        console.log('Owner ID:', req.user.user_id);
        await sql.connect(config);

        const result = await sql.query`
            SELECT *
            FROM refill_stations
            WHERE owner_id = ${ownerId}
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const createMyStation = async (req, res) => {

    try {

        const ownerId = req.user.user_id;

        const {
            station_name,
            address,
            latitude,
            longitude,
            open_time,
            close_time,
            description,
            image_url
        } = req.body;

        await sql.connect(config);

        await sql.query`
            INSERT INTO refill_stations
            (
                owner_id,
                station_name,
                address,
                latitude,
                longitude,
                open_time,
                close_time,
                description,
                image_url,
                status
            )
            VALUES
            (
                ${ownerId},
                ${station_name},
                ${address},
                ${latitude},
                ${longitude},
                ${open_time},
                ${close_time},
                ${description},
                ${image_url},
                'active'
            )
        `;

        res.status(201).json({
            message: 'Tạo trạm thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const updateMyStation = async (req, res) => {

    try {

        const stationId = req.params.id;

        const ownerId = req.user.user_id;

        const {
            station_name,
            address,
            latitude,
            longitude,
            open_time,
            close_time,
            description,
            image_url
        } = req.body;

        await sql.connect(config);

        const stationResult = await sql.query`
            SELECT *
            FROM refill_stations
            WHERE station_id = ${stationId}
        `;

        if (stationResult.recordset.length === 0) {

            return res.status(404).json({
                message: 'Không tìm thấy trạm'
            });

        }

        const station = stationResult.recordset[0];

        if (station.owner_id !== ownerId) {

            return res.status(403).json({
                message: 'Bạn không sở hữu trạm này'
            });

        }

        const finalImageUrl =
            image_url || station.image_url;

        await sql.query`
            UPDATE refill_stations
            SET
                station_name = ${station_name},
                address = ${address},
                latitude = ${latitude},
                longitude = ${longitude},
                open_time = ${open_time},
                close_time = ${close_time},
                description = ${description},
                image_url = ${finalImageUrl}
            WHERE station_id = ${stationId}
        `;

        res.json({
            message: 'Cập nhật thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const deleteMyStation = async (req, res) => {

    try {

        const stationId = req.params.id;

        const ownerId = req.user.user_id;

        await sql.connect(config);

        const stationResult = await sql.query`
            SELECT *
            FROM refill_stations
            WHERE station_id = ${stationId}
        `;

        if (
            stationResult.recordset.length === 0
        ) {

            return res.status(404).json({
                message: 'Không tìm thấy trạm'
            });

        }

        const station =
            stationResult.recordset[0];

        if (
            station.owner_id !== ownerId
        ) {

            return res.status(403).json({
                message: 'Bạn không sở hữu trạm này'
            });

        }

        await sql.query`
            DELETE FROM refill_stations
            WHERE station_id = ${stationId}
        `;

        res.json({
            message: 'Xóa trạm thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
// chinh sua sp
const getMyProducts = async (req, res) => {

    try {

        const ownerId = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                p.product_id,
                
                p.category_id,
                p.product_name,
                p.brand,
                p.price,
                p.stock_status,
                p.description,
                p.image_url,

                rs.station_id,
                rs.station_name

            FROM products p

            JOIN refill_stations rs
            ON p.station_id = rs.station_id

            WHERE rs.owner_id = ${ownerId}

            ORDER BY p.product_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const createMyProduct = async (req, res) => {

    try {

        const ownerId = req.user.user_id;

        const {
            station_id,
            category_id,
            product_name,
            brand,
            price,
            stock_status,
            description,
            image_url
        } = req.body;

        await sql.connect(config);

        // kiểm tra trạm có thuộc owner không

        const stationResult = await sql.query`
            SELECT *
            FROM refill_stations
            WHERE station_id = ${station_id}
        `;

        if (
            stationResult.recordset.length === 0
        ) {

            return res.status(404).json({
                message: 'Không tìm thấy trạm'
            });

        }

        const station =
            stationResult.recordset[0];

        if (
            station.owner_id !== ownerId
        ) {

            return res.status(403).json({
                message: 'Bạn không sở hữu trạm này'
            });

        }

        await sql.query`
            INSERT INTO products
            (
                station_id,
                category_id,
                product_name,
                brand,
                price,
                stock_status,
                description,
                image_url
            )
            VALUES
            (
                ${station_id},
                ${category_id},
                ${product_name},
                ${brand},
                ${price},
                ${stock_status},
                ${description},
                ${image_url}
            )
        `;

        res.status(201).json({
            message: 'Thêm sản phẩm thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const updateMyProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        const ownerId = req.user.user_id;

        const {
            category_id,
            product_name,
            brand,
            price,
            stock_status,
            description,
            image_url
        } = req.body;

        await sql.connect(config);

        const productResult = await sql.query`
            SELECT
                p.*,
                rs.owner_id,
                rs.station_name,
                rs.address,
                rs.open_time,
                rs.close_time
            FROM products p
            JOIN refill_stations rs
            ON p.station_id = rs.station_id
            WHERE p.product_id = ${productId}
        `;

        if (
            productResult.recordset.length === 0
        ) {

            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });

        }

        const product =
            productResult.recordset[0];
        const oldStockStatus = product.stock_status;
        console.log("oldStockStatus =", oldStockStatus);
console.log("newStockStatus =", stock_status);
console.log(typeof oldStockStatus);
console.log(typeof stock_status);

        if (
            product.owner_id !== ownerId
        ) {

            return res.status(403).json({
                message: 'Bạn không sở hữu sản phẩm này'
            });

        }

        await sql.query`
            UPDATE products
            SET
                category_id = ${category_id},
                product_name = ${product_name},
                brand = ${brand},
                price = ${price},
                stock_status = ${stock_status},
                description = ${description},
                image_url = ${image_url}
            WHERE product_id = ${productId}
        `;
        if (Number(oldStockStatus) === 0 && Number(stock_status) === 1) {

    // lấy danh sách người đăng ký

    const waitingUsers = await sql.query`

        SELECT user_id

        FROM product_notification_requests

        WHERE

            station_id = ${product.station_id}

            AND product_id = ${productId}

            AND status = 'waiting'

    `;

    for (const item of waitingUsers.recordset) {

        await sql.query`

    EXEC sp_CreateNotification

        @user_id = ${item.user_id},

        @station_id = ${product.station_id},

        @product_id = ${productId},

        @title = ${"Sản phẩm đã có hàng"},

        @content = ${product_name + " tại " + product.station_name + " đã có hàng trở lại."},

        @product_name = ${product_name},

        @station_name = ${product.station_name},

        @station_address = ${product.address},

        @open_time = ${product.open_time},

        @close_time = ${product.close_time},

        @image_url = ${image_url};

`;

    }
await sql.query`

    UPDATE product_notification_requests

    SET status = 'done'

    WHERE

        station_id = ${product.station_id}

        AND product_id = ${productId}

        AND status = 'waiting'

`;
}

        res.json({
            message: 'Cập nhật sản phẩm thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const deleteMyProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        const ownerId = req.user.user_id;

        await sql.connect(config);

        const productResult = await sql.query`
            SELECT
                p.product_id,
                rs.owner_id

            FROM products p

            JOIN refill_stations rs
            ON p.station_id = rs.station_id

            WHERE p.product_id = ${productId}
        `;

        if (
            productResult.recordset.length === 0
        ) {

            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });

        }

        const product =
            productResult.recordset[0];

        if (
            product.owner_id !== ownerId
        ) {

            return res.status(403).json({
                message: 'Bạn không sở hữu sản phẩm này'
            });

        }

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
const toggleProductStatus = async (req, res) => {

    try {

        const productId = req.params.id;

        const ownerId = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                p.product_id,
                p.product_name,
                p.image_url,
                p.station_id,
                p.stock_status,

                rs.owner_id,
                rs.station_name,
                rs.address,
                rs.open_time,
                rs.close_time


            FROM products p

            JOIN refill_stations rs
            ON p.station_id = rs.station_id

            WHERE p.product_id = ${productId}
        `;

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: 'Không tìm thấy sản phẩm'
            });

        }

        const product = result.recordset[0];

        if (product.owner_id !== ownerId) {

            return res.status(403).json({
                message: 'Không có quyền'
            });

        }

        const newStatus =
    product.stock_status
        ? false
        : true;

        await sql.query`
            UPDATE products
            SET stock_status = ${newStatus}
            WHERE product_id = ${productId}
        `;
        if (Number(product.stock_status) === 0 && Number(newStatus) === 1) {

    // Lấy danh sách người đang chờ

    const waitingUsers = await sql.query`

        SELECT user_id

        FROM product_notification_requests

        WHERE

            station_id = ${product.station_id}

            AND product_id = ${productId}

            AND status = 'waiting'

    `;

    for (const item of waitingUsers.recordset) {

        await sql.query`

            EXEC sp_CreateNotification

                @user_id = ${item.user_id},

                @station_id = ${product.station_id},

                @product_id = ${productId},

                @title = ${"Sản phẩm đã có hàng"},

                @content = ${product.product_name + " tại " + product.station_name + " đã có hàng trở lại."},

                @product_name = ${product.product_name},

                @station_name = ${product.station_name},

                @station_address = ${product.address},

                @open_time = ${product.open_time},

                @close_time = ${product.close_time},

                @image_url = ${product.image_url};

        `;

    }

    await sql.query`

        UPDATE product_notification_requests

        SET status = 'done'

        WHERE

            station_id = ${product.station_id}

            AND product_id = ${productId}

            AND status = 'waiting'

    `;

}
        res.json({
            message: 'Cập nhật trạng thái thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getOwnerDashboard = async (req, res) => {
    try {
        const ownerId = req.user.user_id;
        const { fromDate, toDate } = req.query;

        await sql.connect(config);

        const request = new sql.Request();
        request.input('ownerId', sql.Int, ownerId);

        let dateConditionReview = '';
        let dateConditionRefill = '';
        let dateConditionFavStation = '';
        let dateConditionFavProduct = '';

        if (fromDate && toDate) {
            request.input('fromDate', sql.VarChar, fromDate);
            request.input('toDate', sql.VarChar, toDate);
            dateConditionReview = ` AND CAST(r.created_at AS DATE) BETWEEN @fromDate AND @toDate`;
            dateConditionRefill = ` AND CAST(rh.refill_date AS DATE) BETWEEN @fromDate AND @toDate`;
            dateConditionFavStation = ` AND CAST(f.created_at AS DATE) BETWEEN @fromDate AND @toDate`;
            dateConditionFavProduct = ` AND CAST(fp.created_at AS DATE) BETWEEN @fromDate AND @toDate`;
        }

        // Báo cáo tổng quan toàn bộ hệ thống (Không phụ thuộc vào bộ lọc ngày)
        const allTimeStationFavResult = await request.query(`
            SELECT COUNT(f.favorite_id) AS total
            FROM favorites f
            JOIN refill_stations rs ON f.station_id = rs.station_id
            WHERE rs.owner_id = @ownerId
        `);
        const allTimeStationFavorites = allTimeStationFavResult.recordset[0]?.total || 0;

        let allTimeProductFavorites = 0;
        try {
            const allTimeProdFavResult = await request.query(`
                SELECT COUNT(fp.favorite_product_id) AS total
                FROM favorite_products fp
                JOIN products p ON fp.product_id = p.product_id
                JOIN refill_stations rs ON p.station_id = rs.station_id
                WHERE rs.owner_id = @ownerId
            `);
            allTimeProductFavorites = allTimeProdFavResult.recordset[0]?.total || 0;
        } catch (e) {
            console.error("All time product favorites query error:", e.message);
        }

        const allTimeTotalFavorites = allTimeStationFavorites + allTimeProductFavorites;

        const stationResult = await request.query(`
            SELECT COUNT(*) totalStations
            FROM refill_stations
            WHERE owner_id = @ownerId
        `);

        const productResult = await request.query(`
            SELECT COUNT(*) totalProducts
            FROM products p
            JOIN refill_stations rs ON p.station_id = rs.station_id
            WHERE rs.owner_id = @ownerId
        `);

        const favoriteResult = await request.query(`
            SELECT COUNT(*) totalFavorites
            FROM favorites f
            JOIN refill_stations rs ON f.station_id = rs.station_id
            WHERE rs.owner_id = @ownerId ${dateConditionFavStation}
        `);

        const stationFavoriteResult = await request.query(`
            SELECT
                rs.station_id,
                rs.station_name,
                COUNT(f.favorite_id) AS totalFavorites
            FROM refill_stations rs
            LEFT JOIN favorites f ON rs.station_id = f.station_id ${dateConditionFavStation}
            WHERE rs.owner_id = @ownerId
            GROUP BY rs.station_id, rs.station_name
            HAVING COUNT(f.favorite_id) > 0
            ORDER BY totalFavorites DESC
        `);

        const totalStationFavorites = stationFavoriteResult.recordset.reduce(
            (sum, item) => sum + item.totalFavorites,
            0
        );

        const productFavoriteResult = await request.query(`
            SELECT
                p.product_id,
                p.product_name,
                COUNT(fp.favorite_product_id) AS totalFavorites
            FROM products p
            INNER JOIN favorite_products fp ON p.product_id = fp.product_id ${dateConditionFavProduct}
            JOIN refill_stations rs ON p.station_id = rs.station_id
            WHERE rs.owner_id = @ownerId
            GROUP BY p.product_id, p.product_name
            ORDER BY totalFavorites DESC
        `);

        const totalProductFavorites = productFavoriteResult.recordset.reduce(
            (sum, item) => sum + item.totalFavorites,
            0
        );

        const stationRatingResult = await request.query(`
            SELECT *
            FROM vw_StationRatings
            WHERE owner_id = @ownerId
        `);

        const reviewResult = await request.query(`
            SELECT
                r.review_id,
                r.rating,
                r.comment,
                r.owner_reply,
                r.created_at,
                CONVERT(varchar(19), r.created_at, 120) AS created_at_display,
                FORMAT(r.replied_at,'dd/MM/yyyy HH:mm:ss') AS replied_at,
                u.full_name,
                p.product_name,
                rs.station_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            JOIN products p ON r.product_id = p.product_id
            JOIN refill_stations rs ON r.station_id = rs.station_id
            WHERE rs.owner_id = @ownerId ${dateConditionReview}
            ORDER BY r.review_id DESC
        `);

        let refillResult = { recordset: [{ totalRefillQuantity: 0, totalRefillCount: 0 }] };
        try {
            refillResult = await request.query(`
                SELECT
                    ISNULL(SUM(rh.quantity), 0) AS totalRefillQuantity,
                    COUNT(rh.refill_id) AS totalRefillCount
                FROM refill_history rh
                JOIN refill_stations rs ON rh.station_id = rs.station_id
                WHERE rs.owner_id = @ownerId ${dateConditionRefill}
            `);
        } catch (e) {
            console.error("Refill history query error:", e.message);
        }

        const reviewsArr = reviewResult.recordset || [];
        const totalReviewsCount = reviewsArr.length;
        const totalRatingSum = reviewsArr.reduce((sum, r) => sum + Number(r.rating || 0), 0);
        const averageRating = totalReviewsCount > 0 ? Number((totalRatingSum / totalReviewsCount).toFixed(1)) : 0;

        // Tính điểm trung bình & tổng số đánh giá TOÀN THỜI GIAN từ vw_StationRatings (không tốn thêm query SQL)
        const stationRatingsArr = stationRatingResult.recordset || [];
        const allTimeTotalReviews = stationRatingsArr.reduce((sum, item) => sum + Number(item.totalReviews || 0), 0);
        const allTimeRatingSum = stationRatingsArr.reduce((sum, item) => sum + (Number(item.averageRating || 0) * Number(item.totalReviews || 0)), 0);
        const allTimeAverageRating = allTimeTotalReviews > 0 ? Number((allTimeRatingSum / allTimeTotalReviews).toFixed(1)) : 0;

        res.json({
            totalStations: stationResult.recordset[0].totalStations,
            totalProducts: productResult.recordset[0].totalProducts,
            totalProductFavorites,
            totalStationFavorites,
            totalFavorites: favoriteResult.recordset[0].totalFavorites,
            allTimeStationFavorites,
            allTimeProductFavorites,
            allTimeTotalFavorites,
            allTimeAverageRating,
            allTimeTotalReviews,
            averageRating,
            totalReviews: totalReviewsCount,
            stationFavorites: stationFavoriteResult.recordset,
            productFavorites: productFavoriteResult.recordset,
            stationRatings: stationRatingResult.recordset,
            reviews: reviewsArr,
            totalRefillQuantity: refillResult.recordset[0]?.totalRefillQuantity || 0,
            totalRefillCount: refillResult.recordset[0]?.totalRefillCount || 0,
            fromDate: fromDate || null,
            toDate: toDate || null
        });
    } catch (error) {
        console.error("Lỗi getOwnerDashboard:", error);
        res.status(500).json({ error: error.message });
    }
};
const replyReview = async (req, res) => {

    try {

        const reviewId = req.params.id;

        const { owner_reply } = req.body;

        await sql.connect(config);

        await sql.query`

            EXEC sp_ReplyReview

                @ReviewID = ${reviewId},

                @OwnerReply = ${owner_reply};

        `;

        res.json({
            message: "Phản hồi thành công"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const uploadStationImage =
(req, res) => {
    console.log(req.file);
    try {

        res.json({

            image_url:
            `/uploads/stations/${req.file.filename}`

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const uploadProductImage =
(req, res) => {

    res.json({

        image_url:
            `/uploads/products/${req.file.filename}`

    });

};
const getCategories = async (req, res) => {

    try {

        await sql.connect(config);

        const result =
            await sql.query(`
                SELECT *
                FROM categories
            `);

        res.json(
            result.recordset
        );

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
module.exports = {
    getMyStations,
    createMyStation,
    updateMyStation,
    deleteMyStation,

    getMyProducts,
    createMyProduct,
    updateMyProduct,
    deleteMyProduct,
    getOwnerDashboard,
    uploadStationImage,
    uploadProductImage,
    toggleProductStatus,
    getCategories,
    replyReview
};