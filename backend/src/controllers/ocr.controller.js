const Tesseract = require('tesseract.js');
const sql = require('mssql');

const config = require('../config/db.config');
function removeVietnameseTones(str) {

    if (!str) return '';

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
                product_name,
                  image_url
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
    percent === 1
){

        detectedProducts.push({
            ...product,
            score
        });

    }

});
            
       let suggestions = [];

if (detectedProducts.length > 0) {

    const allProducts =
        productResult.recordset;

    detectedProducts.forEach(detected => {

        const detectedName =
            removeVietnameseTones(
                detected.product_name
            );

        const keywords =
            detectedName
                .split(' ')
                .filter(word => word.length > 2);

        allProducts.forEach(product => {

            if (
                product.product_id ===
                detected.product_id
            ) {
                return;
            }

            const productName =
                removeVietnameseTones(
                    product.product_name
                );

            let score = 0;

            keywords.forEach(keyword => {

                if (
                    productName.includes(
                        keyword
                    )
                ) {
                    score++;
                }

            });

            if (score > 0) {

                suggestions.push({
                    ...product,
                    similarity: score
                });

            }

        });

    });

    suggestions.sort(
        (a, b) =>
            b.similarity -
            a.similarity
    );

    suggestions =
        suggestions.slice(0, 10);
}
if (suggestions.length > 0) {

    const ids =
        suggestions
            .map(
                item =>
                item.product_id
            )
            .join(',');

    const stationResult =
        await sql.query(`
            SELECT
                p.product_id,
                p.product_name,
                p.price,

                rs.station_id,
                rs.station_name,
                rs.address

            FROM products p

            JOIN refill_stations rs
            ON p.station_id =
            rs.station_id

            WHERE p.product_id IN (${ids})
            AND rs.status = 'active'
        `);

    suggestions =
        stationResult.recordset;
}
let detectedWithStations = [];

for (const product of detectedProducts) {

    const stationResult = await sql.query`
        SELECT
            COUNT(*) totalStations
        FROM products
        WHERE product_name = ${product.product_name}
    `;

    detectedWithStations.push({

        product_id:
            product.product_id,

        product_name:
            product.product_name,
            image_url: product.image_url,

        total_stations:
            stationResult.recordset[0]
                .totalStations

    });

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
        detectedWithStations,

    suggestions: [],

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