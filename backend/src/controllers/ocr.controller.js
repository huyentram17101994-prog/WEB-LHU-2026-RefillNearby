const Tesseract = require('tesseract.js');
const sql = require('mssql');

const config = require('../config/db.config');
function removeVietnameseTones(str) {

    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();

}
const analyzeInvoice = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: 'No image uploaded'
            });

        }

        const imagePath = req.file.path;

        // OCR tiếng Việt + tiếng Anh
        const ocrResult = await Tesseract.recognize(
            imagePath,
            'vie+eng'
        );

        const text =
    ocrResult.data.text;

const cleanText =
    removeVietnameseTones(text);

        console.log('========== OCR RESULT ==========');
        console.log(text);

        await sql.connect(config);

        // Lấy toàn bộ sản phẩm trong database
        const productResult = await sql.query`
            SELECT
                product_id,
                product_name
            FROM products
        `;

        const products =
            productResult.recordset;

    const detectedProducts = [];


products.forEach(product => {

    const productName =
        removeVietnameseTones(
            product.product_name
        );

    const words =
        productName.split(' ');

    let score = 0;

    words.forEach(word => {

        if (
            word.length > 2 &&
            cleanText.includes(word)
        ) {

            score++;

        }

    });

    const percent =
        score / words.length;

    if (
    percent >= 0.8 &&
    words.length >= 3
) {

        detectedProducts.push({
            ...product,
            score
        });

    }

});
            
        let suggestions = [];

        if (detectedProducts.length > 0) {

            const ids =
                detectedProducts
                    .map(p => p.product_id)
                    .join(',');

            const suggestionResult =
                await sql.query(`
                    SELECT
                        products.product_id,
                        products.product_name,
                        products.price,

                        refill_stations.station_id,
                        refill_stations.station_name,
                        refill_stations.address

                    FROM products

                    JOIN refill_stations
                    ON products.station_id =
                    refill_stations.station_id

                    WHERE products.product_id IN (${ids})
                `);

            suggestions =
                suggestionResult.recordset;

        }
console.log('===== DETECTED =====');

detectedProducts.forEach(item => {
    console.log(
        item.product_name,
        item.score
    );
});
        res.json({

            detected_products:
                detectedProducts.map(
                    p => p.product_name
                ),

            suggestions,

            raw_text:
                ocrResult.data.text

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });

    }

};

module.exports = {
    analyzeInvoice
};