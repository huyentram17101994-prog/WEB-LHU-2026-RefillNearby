const uploadImage = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: 'No file uploaded'
            });

        }

        res.json({

            message: 'Upload success',

            image_url: `/uploads/${req.file.filename}`

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