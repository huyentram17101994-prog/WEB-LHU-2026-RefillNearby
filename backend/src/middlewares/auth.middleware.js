const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        // kiểm tra token tồn tại
        if (!authHeader) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        // lấy token sau chữ Bearer
        const token = authHeader.split(' ')[1];

        // verify token
        const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
);

console.log('TOKEN DATA:', decoded);

// lưu user vào request
req.user = decoded;

next();

    } catch (error) {

        res.status(401).json({
            message: 'Invalid token'
        });

    }

};
const authorizeRoles = (...roles) => {

    return (req, res, next) => {

        // kiểm tra role có hợp lệ không
        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: 'Access denied'
            });

        }

        next();

    };

};
module.exports = {
    verifyToken,
    authorizeRoles
};