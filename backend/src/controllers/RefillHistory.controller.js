const sql = require('mssql');

const config = require('../config/db.config');


// ================= CREATE REFILL HISTORY =================

const createRefillHistory = async (req, res) => {

    try {

        const {
            station_id,
            product_id,
            quantity
        } = req.body;

        const user_id = req.user.user_id;

        await sql.connect(config);

        
await sql.query`
    INSERT INTO refill_history
    (
        user_id,
        station_id,
        product_id,
        quantity
        
    )
    VALUES
    (
        ${user_id},
        ${station_id},
        ${product_id},
        ${quantity}
        
    )
`;
        res.status(201).json({
            message: 'Refill history created'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// ================= GET MY REFILL HISTORY =================

const getMyRefillHistory = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
    SELECT
        refill_history.refill_id,
        refill_history.quantity,

        FORMAT(
            refill_history.refill_date,
            'dd/MM/yyyy HH:mm'
        ) AS refill_date,

        refill_stations.station_name,
        products.product_name

    FROM refill_history

    JOIN refill_stations
    ON refill_history.station_id =
    refill_stations.station_id

    JOIN products
    ON refill_history.product_id =
    products.product_id

    WHERE refill_history.user_id = ${user_id}

    ORDER BY refill_history.refill_date DESC
`;
        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

module.exports = {
    createRefillHistory,
    getMyRefillHistory
};