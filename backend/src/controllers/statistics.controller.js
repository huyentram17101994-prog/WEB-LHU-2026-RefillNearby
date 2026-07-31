const sql = require('mssql');

const config = require('../config/db.config');


// ======================================================
// GET USER STATISTICS
// ======================================================

const getMyStatistics = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        const { from, to } = req.query;

        await sql.connect(config);

        let query = `
            SELECT
                COUNT(*) AS total_refills,
                ISNULL(SUM(quantity), 0) AS total_quantity
            FROM refill_history
            WHERE user_id = @user_id
        `;

        const request = new sql.Request();

        request.input('user_id', sql.Int, user_id);

        // Có ngày bắt đầu
        if (from) {

            query += `
                AND refill_date >= @from
            `;

            request.input(
                'from',
                sql.Date,
                from
            );

        }

        // Có ngày kết thúc
        if (to) {

            query += `
                AND refill_date < DATEADD(day, 1, @to)
            `;

            request.input(
                'to',
                sql.Date,
                to
            );

        }

        const result =
            await request.query(query);

        const totalRefills =
            result.recordset[0].total_refills || 0;

        const totalQuantity =
            result.recordset[0].total_quantity || 0;

        // Ước tính lượng nhựa tiết kiệm
        const plasticSaved =
            totalQuantity * 20;

        // Ước tính CO2 giảm thải
        const co2Reduced =
            (totalQuantity * 0.04).toFixed(2);

        res.json({

            totalRefills,

            totalQuantity,

            plasticSaved,

            co2Reduced

        });

    }

    catch (error) {

        console.log(
            'Lỗi getMyStatistics:',
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

};


// ======================================================
// GET MONTHLY STATISTICS
// ======================================================

const getMonthlyStatistics = async (req, res) => {

    try {

        const user_id =
            req.user.user_id;

        const { from, to } =
            req.query;

        await sql.connect(config);

        let query = `
            SELECT

                YEAR(refill_date) AS year,

                MONTH(refill_date) AS month,

                SUM(quantity) AS total_quantity

            FROM refill_history

            WHERE user_id = @user_id
        `;

        const request =
            new sql.Request();

        request.input(
            'user_id',
            sql.Int,
            user_id
        );


        // =========================
        // NGÀY BẮT ĐẦU
        // =========================

        if (from) {

            query += `
                AND refill_date >= @from
            `;

            request.input(
                'from',
                sql.Date,
                from
            );

        }


        // =========================
        // NGÀY KẾT THÚC
        // =========================

        if (to) {

            query += `
                AND refill_date < DATEADD(day, 1, @to)
            `;

            request.input(
                'to',
                sql.Date,
                to
            );

        }


        query += `

            GROUP BY

                YEAR(refill_date),

                MONTH(refill_date)

            ORDER BY

                YEAR(refill_date),

                MONTH(refill_date)

        `;


        const result =
            await request.query(query);


        // Đổi dữ liệu thành dạng dễ dùng cho biểu đồ
        const data =
            result.recordset.map(item => ({

                year: item.year,

                month: item.month,

                total_quantity:
                    Number(item.total_quantity) || 0,

                label:
                    `T${item.month}/${item.year}`

            }));


        res.json(data);

    }

    catch (error) {

        console.log(
            'Lỗi getMonthlyStatistics:',
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

};


module.exports = {

    getMyStatistics,

    getMonthlyStatistics

};