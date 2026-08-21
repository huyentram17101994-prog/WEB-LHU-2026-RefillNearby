const sql = require('mssql');
const config = require('../config/db.config');



// ================= GET ALL PRODUCTS =================
const getAllProducts = async (req, res) => {
    try {
        await sql.connect(config);

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 15, 1);
        const offset = (page - 1) * limit;
        const search = req.query.search || "";
        const categoryId = req.query.categoryId || req.query.category_id || "";

        const request = new sql.Request();
        request.input("search", sql.NVarChar, `%${search}%`);
        request.input("offset", sql.Int, offset);
        request.input("limit", sql.Int, limit);

        let whereConditions = [`rs.status = 'active'`, `p.product_name LIKE @search`];

        if (categoryId && categoryId !== 'all') {
            request.input("categoryId", sql.Int, parseInt(categoryId));
            whereConditions.push(`p.category_id = @categoryId`);
        }

        const whereClause = `WHERE ` + whereConditions.join(" AND ");

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (
                SELECT p.product_name
                FROM products p
                INNER JOIN refill_stations rs ON p.station_id = rs.station_id
                ${whereClause}
                GROUP BY p.product_name
            ) AS product_list
        `;

        const countResult = await request.query(countQuery);
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);

        const dataQuery = `
            SELECT
                MIN(p.product_id) AS product_id,
                p.product_name,
                MIN(p.price) AS min_price,
                COUNT(*) AS total_stations,
                MIN(p.image_url) AS image_url,
                MIN(p.category_id) AS category_id
            FROM products p
            INNER JOIN refill_stations rs ON p.station_id = rs.station_id
            ${whereClause}
            GROUP BY p.product_name
            ORDER BY p.product_name
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;

        const result = await request.query(dataQuery);

        res.json({
            data: result.recordset,
            total: total,
            page: page,
            limit: limit,
            totalPages: totalPages
        });
    } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
        res.status(500).json({ error: error.message });
    }
};

// ================= GET CATEGORIES =================
const getCategories = async (req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT category_id, category_name, description
            FROM categories
            ORDER BY category_name ASC
        `;
        res.json(result.recordset);
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        res.status(500).json({ error: error.message });
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

        // ===========================
        // PHÂN TRANG
        // ===========================

        const page =
            Math.max(parseInt(req.query.page) || 1, 1);

        const limit =
            Math.max(parseInt(req.query.limit) || 10, 1);

        const offset =
            (page - 1) * limit;

        const search =
            req.query.search || "";

        // ===========================
        // ĐẾM TỔNG
        // ===========================

        const countRequest = new sql.Request();

        countRequest.input("stationId", sql.Int, stationId);
        countRequest.input("search", sql.NVarChar, `%${search}%`);

        const countResult = await countRequest.query(`

            SELECT COUNT(*) AS total

            FROM products

            WHERE station_id=@stationId

            AND product_name LIKE @search

        `);

        const total =
            countResult.recordset[0].total;

        const totalPages =
            Math.ceil(total / limit);

        // ===========================
        // LẤY DỮ LIỆU
        // ===========================

        const request = new sql.Request();

        request.input("stationId", sql.Int, stationId);

        request.input("search", sql.NVarChar, `%${search}%`);

        request.input("offset", sql.Int, offset);

        request.input("limit", sql.Int, limit);

        const result = await request.query(`

            SELECT *

            FROM products

            WHERE station_id=@stationId

            AND product_name LIKE @search

            ORDER BY product_name

            OFFSET @offset ROWS

            FETCH NEXT @limit ROWS ONLY

        `);

        res.json({

            data: result.recordset,

            page,

            limit,

            total,

            totalPages

        });

    }

    catch (error) {

        console.log(error);

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
    getCategories,
    getProductsByStation,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductStations
};
   