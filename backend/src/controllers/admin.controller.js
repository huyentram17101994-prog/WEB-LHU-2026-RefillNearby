const sql = require('mssql');
const config = require('../config/db.config');

const getDashboard = async (req, res) => {

    try {

        await sql.connect(config);

        const users = await sql.query`
            SELECT COUNT(*) AS total
            FROM users
        `;

        const stations = await sql.query`
            SELECT COUNT(*) AS total
            FROM refill_stations
        `;

        const products = await sql.query`
            SELECT COUNT(*) AS total
            FROM products
        `;

        const refills = await sql.query`
            SELECT
                COUNT(*) AS total_refills,
                ISNULL(SUM(quantity),0)
                AS total_quantity
            FROM refill_history
        `;

        const favorites = await sql.query`
            SELECT COUNT(*) AS total
            FROM favorites
        `;
        const reviewResult = await sql.query`
    SELECT COUNT(*) AS totalReviews
    FROM reviews
`;

        res.json({

            totalUsers:
                users.recordset[0].total,

            totalStations:
                stations.recordset[0].total,

            totalProducts:
                products.recordset[0].total,

            totalRefills:
                refills.recordset[0].total_refills,

            totalQuantity:
                refills.recordset[0].total_quantity,

            totalFavorites:
                favorites.recordset[0].total,

            totalReviews:
                reviewResult.recordset[0].totalReviews

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllUsers = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                user_id,
                full_name,
                email,
                role,
                created_at
            FROM users
            ORDER BY user_id DESC
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
                s.station_name
            FROM products p
            LEFT JOIN refill_stations s
                ON p.station_id = s.station_id
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
                u.full_name,
                s.station_name
            FROM reviews r
            LEFT JOIN users u
                ON r.user_id = u.user_id
            LEFT JOIN refill_stations s
                ON r.station_id = s.station_id
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

        const result = await sql.query`
            SELECT
                rh.refill_id,
                rh.quantity,
                rh.refill_date,

                u.full_name,

                s.station_name,

                p.product_name

            FROM refill_history rh

            LEFT JOIN users u
                ON rh.user_id = u.user_id

            LEFT JOIN refill_stations s
                ON rh.station_id = s.station_id

            LEFT JOIN products p
                ON rh.product_id = p.product_id

            ORDER BY rh.refill_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getRefillStatistics = async (req, res) => {

    try {

        await sql.connect(config);

        const totalResult = await sql.query`
            SELECT
                ISNULL(SUM(quantity),0) AS totalQuantity
            FROM refill_history
        `;

        const topProducts = await sql.query`
            SELECT
                p.product_name,
                SUM(r.quantity) AS totalQuantity
            FROM refill_history r
            INNER JOIN products p
                ON r.product_id = p.product_id
            GROUP BY p.product_name
            ORDER BY totalQuantity DESC
        `;

        res.json({

            totalQuantity:
                totalResult.recordset[0].totalQuantity,

            topProducts:
                topProducts.recordset

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getAllFavorites = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                f.favorite_id,
                u.full_name,
                s.station_name,
                f.created_at
            FROM favorites f
            INNER JOIN users u
                ON f.user_id = u.user_id
            INNER JOIN refill_stations s
                ON f.station_id = s.station_id
            ORDER BY f.favorite_id DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
module.exports = {
    getDashboard,
    getAllUsers,
    deleteUser,
    getAllStations,
    deleteStation,
    getAllProducts,
    deleteProduct,
    getAllReviews,
    deleteReview,
    getAllRefills,
    getRefillStatistics,
    getAllFavorites
};