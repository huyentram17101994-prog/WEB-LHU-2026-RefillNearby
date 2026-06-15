const sql = require('mssql');
const config = require('../config/db.config');



// ================= GET FAVORITES =================
const getFavorites = async (req, res) => {

    try {

        const userId = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`

    SELECT
        f.favorite_id,
        rs.station_id,
        rs.station_name,
        rs.address,
        rs.description,
        rs.image_url,
        CONVERT(VARCHAR(5), open_time, 108) AS open_time,
        CONVERT(VARCHAR(5), close_time, 108) AS close_time

    FROM favorites f

    JOIN refill_stations rs
        ON f.station_id = rs.station_id

    WHERE f.user_id = ${userId}

`;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= ADD FAVORITE =================
const addFavorite = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            station_id
        } = req.body;

        await sql.connect(config);

        await sql.query`
            INSERT INTO favorites
            (
                user_id,
                station_id
            )
            VALUES
            (
                ${userId},
                ${station_id}
            )
        `;

        res.status(201).json({
            message: 'Add favorite success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= DELETE FAVORITE =================
const deleteFavorite = async (req, res) => {

    try {

        const favoriteId = req.params.id;

        await sql.connect(config);

        await sql.query`
            DELETE FROM favorites
            WHERE favorite_id = ${favoriteId}
        `;

        res.json({
            message: 'Delete favorite success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



module.exports = {
    getFavorites,
    addFavorite,
    deleteFavorite
};