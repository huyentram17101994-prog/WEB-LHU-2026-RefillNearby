const bcrypt = require('bcryptjs');

const { sql, config } = require('../config/db.config');
const jwt = require('jsonwebtoken');
const register = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            phone,
            role
        } = req.body;

        // mã hóa password
        const hashedPassword = await bcrypt.hash(password, 10);

        // kết nối database
        await sql.connect(config);

        // insert user
        await sql.query`
            INSERT INTO users
            (full_name, email, password, phone, role)
            VALUES
            (
                ${full_name},
                ${email},
                ${hashedPassword},
                ${phone},
                ${role}
            )
        `;

        res.status(201).json({
            message: 'Đăng ký thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        await sql.connect(config);

        // tìm user theo email
        const result = await sql.query`
            SELECT * FROM users
            WHERE email = ${email}
        `;

        // kiểm tra user tồn tại
        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Email không tồn tại'
            });
        }

        const user = result.recordset[0];

        // kiểm tra password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu không đúng'
            });
        }

        // tạo token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
const profile = async (req, res) => {

    try {

        res.json({
            message: 'Thông tin người dùng',
            user: req.user
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

const forgotPassword = async (req, res) => {

    try {

        const { email, newPassword } = req.body;

        await sql.connect(config);

        const user = await sql.query`
            SELECT *
            FROM users
            WHERE email = ${email}
        `;

        if (user.recordset.length === 0) {

            return res.status(404).json({
                message: 'Email không tồn tại'
            });

        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await sql.query`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE email = ${email}
        `;

        res.json({
            message: 'Đổi mật khẩu thành công'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
module.exports = {
    register,
    login,
    profile,
    forgotPassword
};