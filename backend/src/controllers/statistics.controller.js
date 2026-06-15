const sql = require('mssql');

const config = require('../config/db.config');


// ================= GET USER STATISTICS =================

const getMyStatistics = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                COUNT(*) AS total_refills,
                SUM(quantity) AS total_quantity
            FROM refill_history

            WHERE user_id = ${user_id}
        `;

        const totalRefills =
            result.recordset[0].total_refills || 0;

        const totalQuantity =
            result.recordset[0].total_quantity || 0;

        const plasticSaved =
            totalQuantity * 20;

        const co2Reduced =
            (totalQuantity * 0.04).toFixed(2);

        res.json({
            totalRefills,
            totalQuantity,
            plasticSaved,
            co2Reduced
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// ================= MONTHLY STATISTICS =================

const getMonthlyStatistics = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                MONTH(refill_date) AS month,
                SUM(quantity) AS total_quantity
            FROM refill_history

            WHERE user_id = ${user_id}

            GROUP BY MONTH(refill_date)

            ORDER BY month
        `;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


module.exports = {
    getMyStatistics,
    getMonthlyStatistics
};