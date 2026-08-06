const sql = require('mssql');
const config = require('../config/db.config');

/**
 * Kiểm tra và tự động khởi tạo bảng audit_logs nếu chưa tồn tại trong MSSQL
 */
const ensureAuditLogsTable = async () => {
    try {
        await sql.connect(config);
        await sql.query`
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'audit_logs')
            BEGIN
                CREATE TABLE audit_logs (
                    log_id INT IDENTITY(1,1) PRIMARY KEY,
                    admin_id INT NULL,
                    target_user_id INT NULL,
                    action NVARCHAR(100) NOT NULL,
                    details NVARCHAR(MAX) NULL,
                    created_at DATETIME2 DEFAULT GETDATE()
                );
            END
        `;
    } catch (err) {
        console.error("Lỗi khi kiểm tra/tạo bảng audit_logs:", err.message);
    }
};

/**
 * Ghi bản ghi Lịch Sử Thao Tác (Audit Log)
 * @param {number} adminId - ID của Admin thực hiện
 * @param {number} targetUserId - ID của Người dùng bị ảnh hưởng
 * @param {string} action - Tên hành động (e.g. 'RESET_USER_PASSWORD')
 * @param {string} details - Chi tiết thao tác dạng chuỗi hoặc JSON
 */
const logAudit = async (adminId, targetUserId, action, details) => {
    try {
        await ensureAuditLogsTable();
        await sql.connect(config);
        await sql.query`
            INSERT INTO audit_logs (admin_id, target_user_id, action, details, created_at)
            VALUES (${adminId}, ${targetUserId}, ${action}, ${details}, GETDATE())
        `;
        console.log(`📝 [AUDIT LOG RECORDED] Admin #${adminId} -> Action: ${action} -> Target User #${targetUserId}`);
    } catch (err) {
        console.error("❌ Lỗi khi ghi Audit Log:", err.message);
    }
};

module.exports = {
    ensureAuditLogsTable,
    logAudit
};
