const sql = require('mssql');

const config = require('../config/db.config');


// =====================================================
// CREATE REFILL HISTORY
// =====================================================

const createRefillHistory = async (req, res) => {

    try {

        const {
            station_id,
            product_id,
            quantity
        } = req.body;
// Kiểm tra số lượng refill
        if (
            quantity === undefined ||
            quantity === null ||
            Number(quantity) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Số lượng refill phải lớn hơn 0."
            });
        }
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

    }

    catch (error) {

        console.error(
            'CREATE REFILL HISTORY ERROR:',
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

};


// =====================================================
// GET MY REFILL HISTORY
// =====================================================

const getMyRefillHistory = async (req, res) => {

    try {

        const user_id = req.user.user_id;

        await sql.connect(config);


        // =================================================
        // PHÂN TRANG
        // =================================================

        const page =
            Math.max(
                parseInt(req.query.page) || 1,
                1
            );


        const limit =
            Math.max(
                parseInt(req.query.limit) || 10,
                1
            );


        const offset =
            (page - 1) * limit;


        // =================================================
        // BỘ LỌC THỜI GIAN
        // =================================================

        const period =
            req.query.period || 'all';


        const fromDate =
            req.query.fromDate || null;


        const toDate =
            req.query.toDate || null;


        // =================================================
        // TẠO ĐIỀU KIỆN THỜI GIAN
        // =================================================

        let dateCondition = '';


        // -------------------------------------------------
        // TẤT CẢ THỜI GIAN
        // -------------------------------------------------

        if (period === 'all') {

            dateCondition = '';

        }


        // -------------------------------------------------
        // 7 NGÀY QUA
        // -------------------------------------------------

        else if (period === '7') {

            dateCondition = `

                AND refill_history.refill_date >=
                    DATEADD(
                        DAY,
                        -7,
                        CAST(GETDATE() AS DATE)
                    )

                AND refill_history.refill_date <
                    DATEADD(
                        DAY,
                        1,
                        CAST(GETDATE() AS DATE)
                    )

            `;

        }


        // -------------------------------------------------
        // 30 NGÀY QUA
        // -------------------------------------------------

        else if (period === '30') {

            dateCondition = `

                AND refill_history.refill_date >=
                    DATEADD(
                        DAY,
                        -30,
                        CAST(GETDATE() AS DATE)
                    )

                AND refill_history.refill_date <
                    DATEADD(
                        DAY,
                        1,
                        CAST(GETDATE() AS DATE)
                    )

            `;

        }


        // -------------------------------------------------
        // 3 THÁNG QUA
        // -------------------------------------------------

        else if (period === '3months') {

            dateCondition = `

                AND refill_history.refill_date >=
                    DATEADD(
                        MONTH,
                        -3,
                        CAST(GETDATE() AS DATE)
                    )

                AND refill_history.refill_date <
                    DATEADD(
                        DAY,
                        1,
                        CAST(GETDATE() AS DATE)
                    )

            `;

        }


        // -------------------------------------------------
        // 6 THÁNG QUA
        // -------------------------------------------------

        else if (period === '6months') {

            dateCondition = `

                AND refill_history.refill_date >=
                    DATEADD(
                        MONTH,
                        -6,
                        CAST(GETDATE() AS DATE)
                    )

                AND refill_history.refill_date <
                    DATEADD(
                        DAY,
                        1,
                        CAST(GETDATE() AS DATE)
                    )

            `;

        }


        // -------------------------------------------------
        // NĂM NAY
        // -------------------------------------------------

        else if (period === 'year') {

            dateCondition = `

                AND refill_history.refill_date >=
                    DATEFROMPARTS(
                        YEAR(GETDATE()),
                        1,
                        1
                    )

                AND refill_history.refill_date <
                    DATEADD(
                        DAY,
                        1,
                        CAST(GETDATE() AS DATE)
                    )

            `;

        }


        // -------------------------------------------------
        // TÙY CHỌN NGÀY
        // -------------------------------------------------

        else if (period === 'custom') {

            if (fromDate) {

                dateCondition += `

                    AND refill_history.refill_date >=
                        CAST('${fromDate}' AS DATE)

                `;

            }


            if (toDate) {

                dateCondition += `

                    AND refill_history.refill_date <
                        DATEADD(
                            DAY,
                            1,
                            CAST('${toDate}' AS DATE)
                        )

                `;

            }

        }


        // =================================================
        // LẤY TỔNG SỐ BẢN GHI
        // =================================================

        const countQuery = `

            SELECT
                COUNT(*) AS total

            FROM refill_history

            WHERE
                refill_history.user_id = @user_id

                ${dateCondition}

        `;


        const countRequest =
            new sql.Request();


        countRequest.input(
            'user_id',
            sql.Int,
            user_id
        );


        const countResult =
            await countRequest.query(
                countQuery
            );


        const total =
            countResult.recordset[0].total;


        const totalPages =
            Math.ceil(
                total / limit
            );


        // =================================================
        // LẤY DỮ LIỆU THEO TRANG
        // =================================================

        const dataQuery = `

            SELECT

                refill_history.refill_id,

                refill_history.quantity,


                FORMAT(

                    refill_history.refill_date,

                    'yyyy-MM-dd HH:mm:ss'

                ) AS refill_date,


                FORMAT(

                    refill_history.refill_date,

                    'dd/MM/yyyy HH:mm'

                ) AS refill_date_display,


                refill_stations.station_name,

                products.product_name


            FROM refill_history


            JOIN refill_stations

                ON refill_history.station_id =
                   refill_stations.station_id


            JOIN products

                ON refill_history.product_id =
                   products.product_id


            WHERE

                refill_history.user_id = @user_id

                ${dateCondition}


            ORDER BY

                refill_history.refill_date DESC


            OFFSET @offset ROWS

            FETCH NEXT @limit ROWS ONLY

        `;


        const dataRequest =
            new sql.Request();


        dataRequest.input(
            'user_id',
            sql.Int,
            user_id
        );


        dataRequest.input(
            'offset',
            sql.Int,
            offset
        );


        dataRequest.input(
            'limit',
            sql.Int,
            limit
        );


        const result =
            await dataRequest.query(
                dataQuery
            );


        // =================================================
        // TRẢ KẾT QUẢ
        // =================================================

        res.json({

            data: result.recordset,

            total: total,

            page: page,

            limit: limit,

            totalPages: totalPages,

            period: period,

            fromDate: fromDate,

            toDate: toDate

        });

    }

    catch (error) {

        console.error(
            'GET REFILL HISTORY ERROR:',
            error
        );

        res.status(500).json({

            error: error.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createRefillHistory,

    getMyRefillHistory

};