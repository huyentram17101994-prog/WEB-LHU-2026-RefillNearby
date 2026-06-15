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
                p.stock_status,
                rs.owner_id

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

        await sql.connect(config);

        const stationResult = await sql.query`
            SELECT COUNT(*) totalStations
            FROM refill_stations
            WHERE owner_id = ${ownerId}
        `;

        const productResult = await sql.query`
            SELECT COUNT(*) totalProducts
            FROM products p

            JOIN refill_stations rs
            ON p.station_id = rs.station_id

            WHERE rs.owner_id = ${ownerId}
        `;
        const favoriteResult = await sql.query`
    SELECT COUNT(*) totalFavorites
    FROM favorites f

    JOIN refill_stations rs
    ON f.station_id = rs.station_id

    WHERE rs.owner_id = ${ownerId}
`;
const stationFavoriteResult = await sql.query`
    SELECT
        rs.station_id,
        rs.station_name,
        COUNT(f.favorite_id) AS totalFavorites

    FROM refill_stations rs

    LEFT JOIN favorites f
    ON rs.station_id = f.station_id

    WHERE rs.owner_id = ${ownerId}

    GROUP BY
        rs.station_id,
        rs.station_name

    ORDER BY totalFavorites DESC
`;
const stationRatingResult = await sql.query`
SELECT
    rs.station_id,
    rs.station_name,
    AVG(CAST(r.rating AS FLOAT)) AS averageRating,
    COUNT(r.review_id) AS totalReviews

FROM refill_stations rs

LEFT JOIN reviews r
ON rs.station_id = r.station_id

WHERE rs.owner_id = ${ownerId}

GROUP BY
    rs.station_id,
    rs.station_name
`;
const reviewResult = await sql.query`
SELECT
    r.review_id,
    r.rating,
    r.comment,
    u.full_name,
    p.product_name,
    rs.station_name
FROM reviews r

JOIN users u
ON r.user_id = u.user_id

JOIN products p
ON r.product_id = p.product_id

JOIN refill_stations rs
ON r.station_id = rs.station_id

WHERE rs.owner_id = ${ownerId}

ORDER BY r.review_id DESC
`;

        res.json({

    totalStations:
        stationResult.recordset[0].totalStations,

    totalProducts:
        productResult.recordset[0].totalProducts,

    totalFavorites:
        favoriteResult.recordset[0].totalFavorites,

    stationFavorites:
        stationFavoriteResult.recordset,

    stationRatings:
        stationRatingResult.recordset,

    reviews:
        reviewResult.recordset

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
    getCategories
};