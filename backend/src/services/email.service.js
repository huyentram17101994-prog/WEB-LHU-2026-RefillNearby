const nodemailer = require('nodemailer');

/**
 * Tùy chọn cấu hình Nodemailer Transport
 * Nếu có cấu hình .env (SMTP_USER & SMTP_PASS), sẽ gửi Email thực tế qua SMTP (ví dụ Gmail / Outlook).
 * Nếu chưa cấu hình, sẽ ghi Log Mật khẩu Tạm ra Console để phát triển môi trường Local mượt mà.
 */
const createTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }
    return null;
};

/**
 * Gửi Email chứa Mật Khẩu Tạm cho Người Dùng với Giao Diện HTML Thương Hiệu Refill Nearby
 * @param {string} toEmail - Email nhận
 * @param {string} fullName - Tên đầy đủ người dùng
 * @param {string} tempPassword - Mật khẩu tạm vừa khởi tạo
 * @param {number} expireMinutes - Thời gian hết hạn (phút)
 */
const sendTempPasswordEmail = async (toEmail, fullName, tempPassword, expireMinutes = 30) => {
    const appName = "Refill Nearby";
    const appUrl = process.env.FRONTEND_URL || "http://localhost:5173/login";

    const subject = `[${appName}] Mật Khẩu Tạm Đặt Lại Bởi Quản Trị Viên`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mật Khẩu Tạm ${appName}</title>
        <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px; color: #1f2937; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #dcfce7; }
            .header { background: linear-gradient(135deg, #16a34a, #059669); padding: 32px 24px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 32px 28px; }
            .greeting { font-size: 16px; font-weight: 600; color: #15803d; margin-bottom: 12px; }
            .badge { display: inline-block; background-color: #fef3c7; color: #b45309; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 20px; border: 1px solid #fde68a; }
            .password-box { background: #f0fdf4; border: 2px dashed #22c55e; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
            .password-box p { margin: 0 0 8px; font-size: 13px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .password-text { font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 900; color: #15803d; letter-spacing: 3px; word-break: break-all; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #991b1b; margin-bottom: 24px; line-height: 1.5; }
            .btn-container { text-align: center; margin-top: 28px; }
            .btn { display: inline-block; background-color: #16a34a; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); transition: all 0.2s; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 ${appName}</h1>
                <p>Hệ Thống Trạm Refill Xanh Gần Bạn</p>
            </div>
            <div class="content">
                <div class="greeting">Xin chào ${fullName || 'Người dùng'},</div>
                <div class="badge">🔒 Yêu cầu Đặt Lại Mật Khẩu từ Quản Trị Viên</div>
                
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
                    Quản trị viên hệ thống đã tạo một <b>Mật khẩu tạm thời</b> cho tài khoản của bạn. Vui lòng sử dụng mật khẩu dưới đây để đăng nhập vào ứng dụng.
                </p>

                <div class="password-box">
                    <p>Mật Khẩu Tạm Thời Của Bạn</p>
                    <div class="password-text">${tempPassword}</div>
                </div>

                <div class="warning">
                    ⚠️ <b>Lưu ý quan trọng:</b><br/>
                    • Mật khẩu tạm thời này chỉ có hiệu lực trong vòng <b>${expireMinutes} phút</b>.<br/>
                    • Hệ thống sẽ <b>bắt buộc bạn tạo mật khẩu mới</b> ngay sau khi đăng nhập thành công.
                </div>

                <div class="btn-container">
                    <a href="${appUrl}" class="btn" target="_blank">Đăng Nhập Ngay Để Đổi Mật Khẩu</a>
                </div>
            </div>
            <div class="footer">
                <p>Email này được tự động gửi từ hệ thống ${appName}. Vui lòng không phản hồi email này.</p>
                <p>&copy; 2026 ${appName}. Tất cả các quyền được bảo lưu.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = createTransporter();

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"${appName}" <${process.env.SMTP_USER}>`,
                to: toEmail,
                subject,
                html: htmlContent
            });
            console.log(`✉️ [EMAIL SENT] Mật khẩu tạm đã được gửi tới ${toEmail}`);
            return true;
        } catch (err) {
            console.error(`❌ [EMAIL ERROR] Không thể gửi mail tới ${toEmail}:`, err.message);
            // Fallback log
        }
    }

    // Console Fallback khi chạy thử nghiệm local không có SMTP
    console.log("\n=======================================================");
    console.log(`✉️ [SIMULATED EMAIL TO: ${toEmail}]`);
    console.log(`👤 Người nhận: ${fullName}`);
    console.log(`🔑 Mật khẩu tạm: ${tempPassword}`);
    console.log(`⏳ Hết hạn trong: ${expireMinutes} phút`);
    console.log("=======================================================\n");
    return true;
};

/**
 * Gửi Email thông báo tài khoản Chủ trạm đã được Quản trị viên phê duyệt
 * @param {string} toEmail - Email chủ trạm
 * @param {string} fullName - Họ tên chủ trạm
 */
const sendApprovalEmail = async (toEmail, fullName) => {
    const appName = "Refill Nearby";
    const loginUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/login$/, '') + "/login";

    const subject = `[${appName}] 🎉 Tài Khoản Chủ Trạm Của Bạn Đã Được Phê Duyệt!`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tài Khoản Được Phê Duyệt - ${appName}</title>
        <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px; color: #1f2937; }
            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #dcfce7; }
            .header { background: linear-gradient(135deg, #16a34a, #059669); padding: 32px 24px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 32px 28px; }
            .greeting { font-size: 16px; font-weight: 600; color: #15803d; margin-bottom: 12px; }
            .badge { display: inline-block; background-color: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 700; margin-bottom: 20px; border: 1px solid #bbf7d0; }
            .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 20px; margin: 24px 0; }
            .info-box p { margin: 6px 0; font-size: 13.5px; color: #166534; line-height: 1.5; }
            .btn-container { text-align: center; margin-top: 28px; }
            .btn { display: inline-block; background-color: #16a34a; color: #ffffff !important; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3); transition: all 0.2s; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🌱 ${appName}</h1>
                <p>Hệ Thống Trạm Refill Xanh Gần Bạn</p>
            </div>
            <div class="content">
                <div class="greeting">Xin chào ${fullName || 'Chủ trạm'},</div>
                <div class="badge">🎉 Tài Khoản Đã Được Phê Duyệt</div>
                
                <p style="font-size: 14px; line-height: 1.6; color: #4b5563;">
                    Chúc mừng bạn! Tài khoản Chủ trạm của bạn trên hệ thống <b>${appName}</b> đã được Quản trị viên (Admin) xét duyệt và kích hoạt thành công.
                </p>

                <div class="info-box">
                    <p>✅ <b>Trạng thái:</b> Đã kích hoạt (Active)</p>
                    <p>🏪 <b>Quyền hạn:</b> Bạn hiện có thể tạo, chỉnh sửa và quản lý các trạm Refill của mình trên ứng dụng.</p>
                </div>

                <div class="btn-container">
                    <a href="${loginUrl}" class="btn" target="_blank">Đăng Nhập Ngay</a>
                </div>
            </div>
            <div class="footer">
                <p>Email này được tự động gửi từ hệ thống ${appName}. Vui lòng không phản hồi email này.</p>
                <p>&copy; 2026 ${appName}. Tất cả các quyền được bảo lưu.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = createTransporter();

    if (transporter) {
        try {
            await transporter.sendMail({
                from: `"${appName}" <${process.env.SMTP_USER}>`,
                to: toEmail,
                subject,
                html: htmlContent
            });
            console.log(`✉️ [EMAIL SENT] Thông báo duyệt tài khoản đã được gửi tới ${toEmail}`);
            return true;
        } catch (err) {
            console.error(`❌ [EMAIL ERROR] Không thể gửi mail duyệt tài khoản tới ${toEmail}:`, err.message);
        }
    }

    console.log("\n=======================================================");
    console.log(`✉️ [SIMULATED APPROVAL EMAIL TO: ${toEmail}]`);
    console.log(`👤 Người nhận: ${fullName}`);
    console.log(`🎉 Trạng thái: Tài khoản Chủ trạm đã được duyệt`);
    console.log("=======================================================\n");
    return true;
};

module.exports = {
    sendTempPasswordEmail,
    sendApprovalEmail
};
