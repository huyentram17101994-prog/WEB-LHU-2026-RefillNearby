const sql = require('mssql');
const config = require('../config/db.config');



// ================= GET ALL PRODUCTS =================
const getAllProducts = async (req, res) => {

    try {

        await sql.connect(config);

        // =========================
        // PHÂN TRANG
        // =========================

        const page =
            Math.max(
                parseInt(req.query.page) || 1,
                1
            );

        const limit =
            Math.max(
                parseInt(req.query.limit) || 15,
                1
            );

        const offset =
            (page - 1) * limit;


        // =========================
        // TÌM KIẾM
        // =========================

        const search =
            req.query.search || "";


        // =========================
        // LẤY TỔNG SỐ SẢN PHẨM
        // =========================

        const countResult = await sql.query`

            SELECT COUNT(*) AS total

            FROM (

                SELECT
                    p.product_name

                FROM products p

                INNER JOIN refill_stations rs
                    ON p.station_id = rs.station_id

                WHERE
                    rs.status = 'active'

                    AND p.product_name LIKE
                        ${`%${search}%`}

                GROUP BY
                    p.product_name

            ) AS product_list

        `;


        const total =
            countResult.recordset[0].total;


        const totalPages =
            Math.ceil(total / limit);


        // =========================
        // LẤY SẢN PHẨM THEO TRANG
        // =========================

        const result = await sql.query`

            SELECT

                MIN(p.product_id) AS product_id,

                p.product_name,

                MIN(p.price) AS min_price,

                COUNT(*) AS total_stations,

                MIN(p.image_url) AS image_url

            FROM products p

            INNER JOIN refill_stations rs
                ON p.station_id = rs.station_id

            WHERE
                rs.status = 'active'

                AND p.product_name LIKE
                    ${`%${search}%`}

            GROUP BY
                p.product_name

            ORDER BY
                p.product_name

            OFFSET ${offset} ROWS

            FETCH NEXT ${limit} ROWS ONLY

        `;


        // =========================
        // TRẢ KẾT QUẢ
        // =========================

        res.json({

            data: result.recordset,

            total: total,

            page: page,

            limit: limit,

            totalPages: totalPages

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            error: error.message

        });

    }

};
// ================= CREATE PRODUCT =================
const createProduct = async (req, res) => {

    try {

        const {
            station_id,
            category_id,
            product_name,
            price,
            stock_status,
            description
        } = req.body;

        await sql.connect(config);

        await sql.query`
            INSERT INTO products
            (
                station_id,
                category_id,
                product_name,
                price,
                stock_status,
                description
            )
            VALUES
            (
                ${station_id},
                ${category_id},
                ${product_name},
                ${price},
                ${stock_status},
                ${description}
            )
        `;

        res.status(201).json({
            message: 'Create product success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= UPDATE PRODUCT =================
const updateProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        const {
            category_id,
            product_name,
            price,
            stock_status,
            description
        } = req.body;

        await sql.connect(config);

        await sql.query`
            UPDATE products
            SET
                category_id = ${category_id},
                product_name = ${product_name},
                price = ${price},
                stock_status = ${stock_status},
                description = ${description}
            WHERE product_id = ${productId}
        `;

        res.json({
            message: 'Update product success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= DELETE PRODUCT =================
const deleteProduct = async (req, res) => {

    try {

        const productId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM products
            WHERE product_id = ${productId}
        `;

        res.json({
            message: 'Delete product success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const getProductsByStation = async (req, res) => {

    try {

        const { stationId } = req.params;

        await sql.connect(config);

        const result = await sql.query`
            SELECT *
            FROM products
            WHERE station_id = ${stationId}
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    
    }

};
const getProductStations = async (req, res) => {

    try {

        const productName = decodeURIComponent(req.params.productName);

        await sql.connect(config);

        const result = await sql.query`

            SELECT
                p.product_id,
                p.product_name,
                p.price,
                p.image_url,
                p.stock_status,
                p.description,
                rs.station_id,
                rs.station_name,
                rs.address,
                rs.latitude,
                rs.longitude

            FROM products p

            JOIN refill_stations rs

            ON p.station_id = rs.station_id

            WHERE p.product_name = ${productName}
            AND rs.status = 'active'

            ORDER BY p.price ASC

        `;

        res.json(result.recordset);

    }

    catch(error){

        res.status(500).json({
            error:error.message
        });

    }

};

module.exports = {
    getAllProducts,
    getProductsByStation,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStations
};
   