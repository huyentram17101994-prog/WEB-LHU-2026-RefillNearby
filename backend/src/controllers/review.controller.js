const sql = require('mssql');
const config = require('../config/db.config');



// ================= GET REVIEWS =================
const getAllReviews = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
            SELECT *
            FROM reviews
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

// ================= GET REVIEWS BY STATION =================

const getReviewsByStation = async (req, res) => {

    try {

        const stationId = req.params.stationId;

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                reviews.*,
                users.full_name,
                products.product_name
            FROM reviews

            JOIN users
            ON reviews.user_id = users.user_id

            JOIN products
            ON reviews.product_id = products.product_id

            WHERE reviews.station_id = ${stationId}

            ORDER BY reviews.created_at DESC
        `;

        res.json(result.recordset);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }

};

// ================= CREATE REVIEW =================
const createReview = async (req, res) => {

    try {

        const {
            station_id,
            product_id,
            rating,
            comment
        } = req.body;

        const user_id = req.user.user_id;

        await sql.connect(config);

        await sql.query`
            INSERT INTO reviews
            (
                user_id,
                station_id,
                product_id,
                rating,
                comment
            )
            VALUES
            (
                ${user_id},
                ${station_id},
                 ${product_id},
                ${rating},
                ${comment}
            )
        `;

        res.status(201).json({
            message: 'Create review success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= UPDATE REVIEW =================
const updateReview = async (req, res) => {

    try {

        const reviewId = req.params.id;

        const {
            rating,
            comment
        } = req.body;

        await sql.connect(config);

        await sql.query`
            UPDATE reviews
            SET
                rating = ${rating},
                comment = ${comment}
            WHERE review_id = ${reviewId}
        `;

        res.json({
            message: 'Update review success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= DELETE REVIEW =================
const deleteReview = async (req, res) => {

    try {

        const reviewId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM reviews
            WHERE review_id = ${reviewId}
        `;

        res.json({
            message: 'Delete review success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



module.exports = {
    getAllReviews,
    getReviewsByStation,
    createReview,
    updateReview,
    deleteReview
};