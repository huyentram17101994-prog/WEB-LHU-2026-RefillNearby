const { sql, config } = require('../config/db.config');

const getAllStations = async (req, res) => {

    try {

        await sql.connect(config);

        const result = await sql.query`
    SELECT
        rs.station_id,
        rs.owner_id,
        rs.status,
        rs.station_name,
        rs.address,
        rs.latitude,
        rs.longitude,

        CONVERT(VARCHAR(5), rs.open_time, 108) AS open_time,
        CONVERT(VARCHAR(5), rs.close_time, 108) AS close_time,

        rs.description,
        rs.image_url

    FROM refill_stations rs
    WHERE rs.status = 'active'
`;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const createStation = async (req, res) => {

    try {

        const {
            station_name,
            address,
            latitude,
            longitude,
            open_time,
            close_time,
            description
        } = req.body;

        // lấy owner từ token
        const owner_id = req.user.user_id;

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
                description
            )
            VALUES
            (
                ${owner_id},
                ${station_name},
                ${address},
                ${latitude},
                ${longitude},
                ${open_time},
                ${close_time},
                ${description}
            )
        `;

        res.status(201).json({
            message: 'Create station success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const updateStation = async (req, res) => {

    try {

        const stationId = req.params.id;

        const {
            station_name,
            address,
            latitude,
            longitude,
            open_time,
            close_time,
            description
        } = req.body;

        await sql.connect(config);

        await sql.query`
            UPDATE refill_stations
            SET
                station_name = ${station_name},
                address = ${address},
                latitude = ${latitude},
                longitude = ${longitude},
                open_time = ${open_time},
                close_time = ${close_time},
                description = ${description}
            WHERE station_id = ${stationId}
        `;

        res.json({
            message: 'Update station success'
        });

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
            message: 'Delete station success'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const toggleStationStatus = async (req, res) => {

    try {

        const stationId = req.params.id;

        const { status } = req.body;

        await sql.connect(config);

        await sql.query`

            UPDATE refill_stations

            SET status = ${status}

            WHERE station_id = ${stationId}

        `;

        res.json({

            message: "Cập nhật trạng thái thành công"

        });

    } catch (error) {

        res.status(500).json({

            error: error.message

        });

    }

};
const getStationById = async (req, res) => {

    try {

        const stationId = req.params.id;

        await sql.connect(config);

        const result = await sql.query`
    SELECT
        rs.station_id,
        rs.owner_id,
        rs.station_name,
        rs.address,
        rs.latitude,
        rs.longitude,

        CONVERT(VARCHAR(5), rs.open_time, 108) AS open_time,
        CONVERT(VARCHAR(5), rs.close_time, 108) AS close_time,

        rs.description,
        rs.image_url,

        p.product_name

    FROM refill_stations rs
    LEFT JOIN products p
    ON rs.station_id = p.station_id

    WHERE rs.station_id = ${stationId}
    AND

rs.status='active'
`;

        if (result.recordset.length === 0) {

            return res.status(404).json({
                message: 'Station not found'
            });

        }

        res.json(result.recordset[0]);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const searchStations = async (req, res) => {

    try {

        const keyword = req.query.keyword;

        await sql.connect(config);

        const result = await sql.query`
    SELECT
        station_id,
        owner_id,
        station_name,
        address,
        latitude,
        longitude,

        CONVERT(VARCHAR(5), open_time, 108) AS open_time,
        CONVERT(VARCHAR(5), close_time, 108) AS close_time,

        description,
        image_url

    FROM refill_stations
    WHERE
    status='active'

AND

    station_name LIKE ${'%' + keyword + '%'}
`;

        res.json(result.recordset);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
module.exports = {
    getAllStations,
    getStationById,
    searchStations,
    createStation,
    updateStation,
    deleteStation,
    toggleStationStatus
};