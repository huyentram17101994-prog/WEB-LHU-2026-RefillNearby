const uploadImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: 'No file uploaded'
            });

        }

        let folder = 'stations';

        if (
            req.originalUrl.includes('/upload/avatar')
        ) {

            folder = 'avatars';

        } else if (
            req.originalUrl.includes('upload-product-image')
        ) {

            folder = 'products';

        }

        res.json({

            message: 'Upload success',

            image_url: `/uploads/${folder}/${req.file.filename}`

        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


module.exports = {
    uploadImage
};