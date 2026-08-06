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
const { ensureUsersTableColumns } = require('../services/dbSetup.service');

const login = async (req, res) => {

    try {

        const {
            email,
            phone,
            account,
            password
        } = req.body;

        const loginInput = (email || phone || account || '').trim();

        if (!loginInput) {
            return res.status(400).json({
                message: 'Vui lòng nhập Email hoặc Số điện thoại'
            });
        }

        await ensureUsersTableColumns();
        await sql.connect(config);

        // tìm user theo email hoặc số điện thoại (truy vấn an toàn)
        let result;
        try {
            result = await sql.query`
                SELECT * FROM users
                WHERE email = ${loginInput} OR phone = ${loginInput}
            `;
        } catch (dbErr) {
            // Fallback tìm theo email nếu cột phone không tồn tại
            result = await sql.query`
                SELECT * FROM users
                WHERE email = ${loginInput}
            `;
        }

        // kiểm tra user tồn tại
        if (result.recordset.length === 0) {
            return res.status(404).json({
                message: 'Tài khoản (Email hoặc Số điện thoại) không tồn tại'
            });
        }

        const user = result.recordset[0];
        // kiểm tra tài khoản có bị khóa không
        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.'
            });
        }

        // kiểm tra password (hỗ trợ bcrypt hash, trim khoảng trắng MSSQL CHAR padding và plain-text legacy fallback)
        const dbPassword = user.password ? String(user.password).trim() : '';
        let isMatch = false;

        if (dbPassword.startsWith('$2a$') || dbPassword.startsWith('$2b$') || dbPassword.startsWith('$2y$')) {
            isMatch = await bcrypt.compare(password, dbPassword);
        } else {
            isMatch = (password === dbPassword);
        }

        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu không đúng'
            });
        }

        // kiểm tra cờ bắt buộc đổi mật khẩu & hết hạn
        const mustChangePassword = Boolean(user.must_change_password);
        if (mustChangePassword && user.temp_password_expires_at) {
            const expiresAt = new Date(user.temp_password_expires_at);
            if (new Date() > expiresAt) {
                return res.status(400).json({
                    message: '⚠️ Mật khẩu tạm thời đã hết hạn (quá 30 phút). Vui lòng liên hệ Quản trị viên để cấp lại.'
                });
            }
        }

        // tạo token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role,
                must_change_password: mustChangePassword
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: mustChangePassword ? 'Yêu cầu đổi mật khẩu mới' : 'Đăng nhập thành công',
            token,
            must_change_password: mustChangePassword,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                badge: user.badge,
                must_change_password: mustChangePassword
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({
            message: 'Đăng nhập thất bại: ' + (error.message || 'Lỗi server'),
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

/**
 * Người dùng đổi Mật Khẩu Bắt Buộc khi đăng nhập bằng Mật Khẩu Tạm từ Admin
 */
const changePasswordRequired = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const { currentPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length !== 8) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải có đúng 8 ký tự'
            });
        }

        await sql.connect(config);

        const userResult = await sql.query`
            SELECT * FROM users WHERE user_id = ${userId}
        `;

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
        }

        const user = userResult.recordset[0];

        // Xác minh mật khẩu hiện tại (mật khẩu tạm)
        const dbPassword = user.password ? String(user.password).trim() : '';
        let isMatch = false;

        if (dbPassword.startsWith('$2a$') || dbPassword.startsWith('$2b$') || dbPassword.startsWith('$2y$')) {
            isMatch = await bcrypt.compare(currentPassword, dbPassword);
        } else {
            isMatch = (currentPassword === dbPassword);
        }

        if (!isMatch) {
            return res.status(400).json({
                message: 'Mật khẩu tạm thời không đúng. Vui lòng kiểm tra lại!'
            });
        }

        // Mã hóa mật khẩu mới & Cập nhật cờ must_change_password = 0
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await sql.query`
            UPDATE users
            SET password = ${hashedPassword},
                must_change_password = 0,
                temp_password_expires_at = NULL
            WHERE user_id = ${userId}
        `;

        // Cấp JWT Token mới chính thức
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role,
                must_change_password: false
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: '🎉 Đổi mật khẩu thành công! Tài khoản của bạn đã được kích hoạt chính thức.',
            token,
            must_change_password: false,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                badge: user.badge,
                must_change_password: false
            }
        });
    } catch (error) {
        console.error("Lỗi changePasswordRequired:", error);
        res.status(500).json({ error: error.message || 'Lỗi hệ thống khi đổi mật khẩu' });
    }
};

const { logAudit } = require('../services/audit.service');

/**
 * Người dùng gửi Yêu Cầu Đặt Lại Mật Khẩu cho Admin
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { account, email } = req.body;
        const loginInput = (account || email || '').trim();

        if (!loginInput) {
            return res.status(400).json({
                message: 'Vui lòng nhập Email hoặc Số điện thoại đăng ký'
            });
        }

        await ensureUsersTableColumns();
        await sql.connect(config);

        // Tìm user theo email hoặc SĐT
        let userResult;
        try {
            userResult = await sql.query`
                SELECT user_id, full_name, email, role, status
                FROM users
                WHERE email = ${loginInput} OR phone = ${loginInput}
            `;
        } catch (err) {
            userResult = await sql.query`
                SELECT user_id, full_name, email, role, status
                FROM users
                WHERE email = ${loginInput}
            `;
        }

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                message: 'Tài khoản (Email hoặc Số điện thoại) không tồn tại trong hệ thống.'
            });
        }

        const user = userResult.recordset[0];

        if (user.status === 'inactive') {
            return res.status(403).json({
                message: 'Tài khoản đã bị khóa. Vui lòng liên hệ trực tiếp Quản trị viên.'
            });
        }

        // Cập nhật cờ reset_requested = 1 và thời gian gửi yêu cầu
        await sql.query`
            UPDATE users
            SET reset_requested = 1,
                reset_requested_at = GETDATE()
            WHERE user_id = ${user.user_id}
        `;

        // Ghi log audit
        await logAudit(
            null,
            user.user_id,
            'REQUEST_PASSWORD_RESET',
            `Người dùng #${user.user_id} (${user.email}) đã gửi yêu cầu Quên Mật Khẩu tới Quản trị viên.`
        );

        return res.json({
            message: `🎉 Yêu cầu Quên Mật Khẩu cho tài khoản "${user.full_name}" đã được gửi tới Quản trị viên thành công. Quản trị viên sẽ gửi Mật khẩu tạm qua Email cho bạn.`
        });
    } catch (error) {
        console.error("Lỗi requestPasswordReset:", error);
        return res.status(500).json({
            message: error.message || 'Lỗi hệ thống khi gửi yêu cầu'
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
    forgotPassword,
    changePasswordRequired,
    requestPasswordReset
};