const { sql, config } = require('../config/db.config');

/**
 * Đảm bảo các cột must_change_password và temp_password_expires_at đã sẵn sàng trong bảng users
 */
const ensureUsersTableColumns = async () => {
    try {
        await sql.connect(config);
        
        // Kiểm tra & Thêm cột must_change_password
        await sql.query`
            IF NOT EXISTS (
                SELECT * FROM sys.columns 
                WHERE object_id = OBJECT_ID('users') AND name = 'must_change_password'
            )
            BEGIN
                ALTER TABLE users ADD must_change_password BIT DEFAULT 0;
            END
        `;

        // Kiểm tra & Thêm cột temp_password_expires_at
        await sql.query`
            IF NOT EXISTS (
                SELECT * FROM sys.columns 
                WHERE object_id = OBJECT_ID('users') AND name = 'temp_password_expires_at'
            )
            BEGIN
                ALTER TABLE users ADD temp_password_expires_at DATETIME2 NULL;
            END
        `;

        // Kiểm tra & Thêm cột reset_requested
        await sql.query`
            IF NOT EXISTS (
                SELECT * FROM sys.columns 
                WHERE object_id = OBJECT_ID('users') AND name = 'reset_requested'
            )
            BEGIN
                ALTER TABLE users ADD reset_requested BIT DEFAULT 0;
            END
        `;

        // Kiểm tra & Thêm cột reset_requested_at
        await sql.query`
            IF NOT EXISTS (
                SELECT * FROM sys.columns 
                WHERE object_id = OBJECT_ID('users') AND name = 'reset_requested_at'
            )
            BEGIN
                ALTER TABLE users ADD reset_requested_at DATETIME2 NULL;
            END
        `;

        // Kiểm tra & Thêm cột status
        await sql.query`
            IF NOT EXISTS (
                SELECT * FROM sys.columns 
                WHERE object_id = OBJECT_ID('users') AND name = 'status'
            )
            BEGIN
                ALTER TABLE users ADD status VARCHAR(50) DEFAULT 'active';
            END
        `;
    } catch (err) {
        console.error("Lỗi khi tự động nâng cấp schema bảng users:", err.message);
    }
};

module.exports = {
    ensureUsersTableColumns
};
