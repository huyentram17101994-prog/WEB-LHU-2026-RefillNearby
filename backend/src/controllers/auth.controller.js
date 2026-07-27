const bcrypt = require('bcryptjs');
const { sql, config } = require('../config/db.config');
const jwt = require('jsonwebtoken');
const isValidPassword = (password) => {
    return typeof password === 'string' && password.length === 8;
};
const register = async (req, res) => {
    try {

        const {
            full_name,
            email,
            password,
            phone,
            role
        } = req.body;
        // Mật khẩu phải đúng 8 ký tự
if (!isValidPassword(password)) {
    return res.status(400).json({
        message: 'Mật khẩu phải có đúng 8 ký tự'
    });
}
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
        // kiểm tra tài khoản có bị khóa không
if (user.status === 'inactive') {

    return res.status(403).json({
        message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
    });

}
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
                role: user.role,
                badge: user.badge
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

        await sql.connect(config);

        const result = await sql.query`
            SELECT
                user_id,
                full_name,
                email,
                phone,
                avatar,
                role,
                badge,
                created_at,
                status
            FROM users
            WHERE user_id = ${req.user.user_id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản'
            });
        }

        res.json(
            result.recordset[0]
        );

    } catch (error) {

        console.error('Lỗi lấy thông tin profile:', error);

        res.status(500).json({
            error: error.message
        });

    }
};
const updateProfile = async (req, res) => {
    try {

        const {
    full_name,
    phone,
    avatar
} = req.body;

        // Kiểm tra họ tên
        if (!full_name || !full_name.trim()) {
            return res.status(400).json({
                message: 'Họ và tên không được để trống'
            });
        }

        // Kiểm tra số điện thoại
        if (
            phone &&
            !/^[0-9]{9,15}$/.test(phone)
        ) {
            return res.status(400).json({
                message: 'Số điện thoại không hợp lệ'
            });
        }

        await sql.connect(config);

        await sql.query`
    UPDATE users
    SET
        full_name = ${full_name.trim()},
        phone = ${phone || null},
        avatar = ${avatar || null}
    WHERE user_id = ${req.user.user_id}
`;

        // Lấy lại thông tin mới nhất
        const result = await sql.query`
            SELECT
                user_id,
                full_name,
                email,
                phone,
                avatar,
                role,
                badge,
                created_at,
                status
            FROM users
            WHERE user_id = ${req.user.user_id}
        `;

        res.json({
            message: 'Cập nhật hồ sơ thành công',
            user: result.recordset[0]
        });

    } catch (error) {

        console.error('Lỗi cập nhật hồ sơ:', error);

        res.status(500).json({
            error: error.message
        });

    }
};
const verifyPassword = async (req, res) => {
    try {
        const { currentPassword } = req.body;

        // Mật khẩu hiện tại phải đúng 8 ký tự
        if (!currentPassword || currentPassword.length !== 8) {
            return res.status(400).json({
                message: 'Mật khẩu phải có đúng 8 ký tự'
            });
        }

        await sql.connect(config);

        const result = await sql.query`
            SELECT password
            FROM users
            WHERE user_id = ${req.user.user_id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản'
            });
        }

        const user = result.recordset[0];

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        res.json({
            message: 'Mật khẩu hiện tại chính xác'
        });

    } catch (error) {

        console.error('Verify password error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        // Kiểm tra dữ liệu
if (!currentPassword || !newPassword) {
    return res.status(400).json({
        message: 'Vui lòng nhập đầy đủ mật khẩu'
    });
}

// Mật khẩu hiện tại phải đúng 8 ký tự
if (!isValidPassword(currentPassword)) {
    return res.status(400).json({
        message: 'Mật khẩu hiện tại phải có đúng 8 ký tự'
    });
}

// Mật khẩu mới phải đúng 8 ký tự
if (!isValidPassword(newPassword)) {
    return res.status(400).json({
        message: 'Mật khẩu mới phải có đúng 8 ký tự'
    });
}

        // Lấy mật khẩu hiện tại từ database
        await sql.connect(config);

        const result = await sql.query`
            SELECT password
            FROM users
            WHERE user_id = ${req.user.user_id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy tài khoản'
            });
        }

        const user = result.recordset[0];

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Cập nhật mật khẩu
        await sql.query`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE user_id = ${req.user.user_id}
        `;

        res.json({
            message: 'Đổi mật khẩu thành công'
        });

    } catch (error) {

        console.error('Change password error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};
const forgotPassword = async (req, res) => {

    try {

        const { email, newPassword } = req.body;
        // Kiểm tra mật khẩu mới phải đúng 8 ký tự
if (!isValidPassword(newPassword)) {
    return res.status(400).json({
        message: 'Mật khẩu mới phải có đúng 8 ký tự'
    });
}
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
    updateProfile,
     verifyPassword,
    changePassword,
    forgotPassword
};