const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (
            req.originalUrl.includes(
                'upload-product-image'
            )
        ) {

            cb(
                null,
                'uploads/products/'
            );

        } else {

            cb(
                null,
                'uploads/stations/'
            );

        }

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            path.extname(
                file.originalname
            );

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpg|jpeg|png|webp/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (extname) {

        cb(null, true);

    } else {

        cb(new Error('Only images are allowed'));

    }

};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;