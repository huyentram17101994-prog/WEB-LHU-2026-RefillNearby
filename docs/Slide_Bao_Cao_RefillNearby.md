# BỘ NỘI DUNG SLIDE BÁO CÁO TỐT NGHIỆP DỰ ÁN REFILLNEARBY (18 SLIDES)

---

## SLIDE 1: TRANG TIÊU ĐỀ BÁO CÁO
- **ĐƠN VỊ**: TRƯỜNG ĐẠI HỌC LẠC HỒNG (LHU) - KHOA CÔNG NGHỆ THÔNG TIN
- **ĐỀ TÀI**: XÂY DỰNG ỨNG DỤNG WEB HỖ TRỢ TÌM KIẾM TRẠM REFILL VÀ QUẢN LÝ TIÊU DÙNG XANH REFILLNEARBY
- **Sinh viên thực hiện**: Nhóm 06
- **Giảng viên hướng dẫn**: ThS. Huỳnh Trầm

---

## SLIDE 2: LÝ DO CHỌN ĐỀ TÀI & THỰC TRẠNG
- **Thực trạng**: Rác thải nhựa dùng 1 lần (chai/lọ nước giặt, nước rửa chén, dầu gội) gây ô nhiễm môi trường nghiêm trọng.
- **Nhu cầu**: Người tiêu dùng muốn chuyển sang hình thức đong chiết refill nhưng gặp khó khăn khi tìm kiếm vị trí trạm refill gần nhất.
- **Giải pháp RefillNearby**: Nền tảng Web số hóa quy trình định vị trạm refill trên bản đồ GPS, tìm sản phẩm và ứng dụng AI phân tích hóa đơn mua sắm.

---

## SLIDE 3: MỤC TIÊU & PHẠM VI NGHIÊN CỨU
- **Mục tiêu chính**:
  1. Xây dựng bản đồ tương tác GPS định vị các trạm refill trong bán kính < 30km.
  2. Ứng dụng AI OCR (Tesseract.js) đọc hóa đơn mua sắm tự động gợi ý sản phẩm xanh.
  3. Xây dựng hệ thống phân quyền 3 vai trò: Khách hàng (user), Chủ trạm (owner), Admin (admin).
- **Phạm vi**: Ứng dụng Web Responsive tương thích trên cả Máy tính và Điện thoại.

---

## SLIDE 4: MÔ HÌNH KIẾN TRÚC HỆ THỐNG
- **Mô hình kiến trúc**: Client-Server RESTful API kết hợp Clean Architecture 5 tầng.
- **Sơ đồ luồng dữ liệu**:
  - Client (ReactJS) <--> REST API (ExpressJS) <--> Database (SQL Server 2022).
- **Cấu trúc Backend 5 tầng**:
  - `config/` --> `middlewares/` --> `services/` --> `controllers/` --> `routes/`.
- *(Hình ảnh trên Slide: Chèn Hình 2.1 - Mô hình kiến trúc hệ thống)*

---

## SLIDE 5: CÔNG NGHỆ NỔI BẬT SỬ DỤNG
- **Frontend**: ReactJS, Vite, Tailwind CSS, React Leaflet (Bản đồ số GPS).
- **Backend**: Node.js, ExpressJS framework, JWT Authentication & Role Guard.
- **Cơ sở dữ liệu**: Microsoft SQL Server 2022 (Thiết kế đạt chuẩn 3NF).
- **Trí tuệ nhân tạo (AI Engine)**: Tesseract.js OCR (Bóc tách chữ tiếng Việt/Anh từ ảnh hóa đơn).

---

## SLIDE 6: BIỂU ĐỒ USE CASE TỔNG QUAN
- **3 Tác nhân chính (Actors)**:
  - **Khách hàng (user)**: Tìm trạm GPS, tìm sản phẩm, upload hóa đơn OCR, đánh giá trạm, thả tim yêu thích.
  - **Chủ trạm (owner)**: Quản lý hồ sơ trạm, quản lý giá & trạng thái hàng (stock_status), trả lời đánh giá.
  - **Quản trị viên (admin)**: Quản lý 6 phân hệ (User, Trạm, Sản phẩm, Lịch sử refill, Đánh giá, Yêu thích).
- *(Hình ảnh trên Slide: Chèn Hình 3.1 - Biểu đồ Use Case)*

---

## SLIDE 7: BIỂU ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAM)
- **Luồng 1: Tìm kiếm Trạm Refill GPS**:
  - Bật GPS --> Tính khoảng cách Haversine --> Ghim Marker Leaflet --> Click Marker chỉ đường Google Maps.
- **Luồng 2: AI Phân tích Hóa đơn OCR**:
  - Upload ảnh hóa đơn --> Engine Tesseract OCR đọc chữ --> Đối chiếu CSDL SQL Server --> Gợi ý Sản phẩm & Trạm bán.
- *(Hình ảnh trên Slide: Chèn Hình 3.2 & 3.3 - Biểu đồ Hoạt động)*

---

## SLIDE 8: SƠ ĐỒ THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD)
- **Cơ sở dữ liệu đạt chuẩn 3NF**:
  - Bảng `users`: Quản lý tài khoản & phân quyền (role, status).
  - Bảng `refill_stations`: Lưu tọa độ GPS (latitude, longitude), hotline, chủ trạm.
  - Bảng `products`: Lưu tên SP, đơn giá đong chiết, trạng thái stock_status.
  - Bảng `reviews` & `invoices`: Lưu đánh giá, phản hồi chủ trạm và lịch sử OCR.
- *(Hình ảnh trên Slide: Chèn Hình 3.4 - Sơ đồ ERD CSDL)*

---

## SLIDE 9: MODULE TÌM KIẾM TRẠM REFILL & BẢN ĐỒ GPS
- **Chức năng chính**:
  - Tự động lấy tọa độ thực tế (lat, lng), tính khoảng cách Haversine dưới 30km.
  - Ghim Marker sinh động trên bản đồ React Leaflet.
  - Click Marker xem Popup thông tin & Bấm nút "Chỉ đường" chuyển hướng Google Maps.
- *(Hình ảnh trên Slide: Chèn Hình 4.1 - Giao diện Bản đồ GPS)*

---

## SLIDE 10: MODULE TÌM KIẾM SẢN PHẨM REFILL
- **Chức năng chính**:
  - Tìm kiếm sản phẩm theo từ khóa ("Dầu gội bưởi", "Nước rửa chén").
  - Lọc sản phẩm theo từng nhóm ngành hàng danh mục (categories).
  - Hiển thị đơn giá đong chiết (Giá từ: 55.000 đ) và chỉ số trạm đang có hàng (Có tại: 2 trạm refill).
- *(Hình ảnh trên Slide: Chèn Hình 4.2 - Giao diện Tìm kiếm Sản phẩm)*

---

## SLIDE 11: MODULE AI PHÂN TÍCH HÓA ĐƠN OCR
- **Chức năng chính**:
  - Kéo thả upload tệp ảnh hóa đơn mua sắm siêu thị/cửa hàng.
  - Tesseract.js OCR bóc tách chuỗi chữ văn bản tên mặt hàng.
  - Truy vấn CSDL tự động gợi ý danh sách sản phẩm đong chiết thân thiện môi trường & trạm refill tương ứng.
- *(Hình ảnh trên Slide: Chèn Hình 4.3 - Giao diện AI OCR Hóa đơn)*

---

## SLIDE 12: MODULE QUẢN LÝ CỦA CHỦ TRẠM (OWNER DASHBOARD)
- **Chức năng chính**:
  - Tạo mới, cập nhật thông tin trạm refill và tải ảnh bìa qua Multer.
  - Bật/Tắt trạng thái tồn kho thời gian thực (stock_status = 1: Còn hàng, stock_status = 0: Hết hàng).
  - Xem và gửi câu trả lời phản hồi trực tiếp bình luận đánh giá của khách hàng (owner_reply).
- *(Hình ảnh trên Slide: Chèn Hình 4.4 - Giao diện Dashboard Chủ trạm)*

---

## SLIDE 13: MODULE QUẢN TRỊ HỆ THỐNG (ADMIN DASHBOARD)
- **Chức năng điều hành 6 phân hệ**:
  1. Quản lý tài khoản: Xem danh sách, duyệt Chủ trạm, khóa tài khoản (status = 'locked'), reset MK.
  2. Quản lý trạm refill: Kiểm duyệt trạm mới, khóa/xóa trạm vi phạm.
  3. Quản lý sản phẩm refill: Xóa sản phẩm kém chất lượng.
  4. Quản lý lịch sử refill: Tra cứu nhật ký lượt đong chiết.
  5. Quản lý đánh giá: Xóa bình luận rác, thô tục.
  6. Quản lý yêu thích: Thống kê trạm và sản phẩm được thả tim nhiều nhất.
- *(Hình ảnh trên Slide: Chèn Hình 4.5 - Giao diện Dashboard Admin)*

---

## SLIDE 14: KẾT QUẢ KIỂM THỬ HỆ THỐNG (TESTING)
- **Phương pháp**: Black-box Testing kết hợp Postman API Testing.
- **Tóm tắt 6 Testcases trọng yếu**:
  - **TC-01**: Validate form đăng ký (Chặn gửi API khi sai email/bỏ trống). --> **PASSED**
  - **TC-02**: Bảo mật RBAC (Token Khách hàng gọi API Admin bị chặn 403 Forbidden). --> **PASSED**
  - **TC-03**: Check Constraint (Nhập giá <= 0 bị từ chối 400 Bad Request). --> **PASSED**
  - **TC-04**: Unique Constraint (Đăng ký trùng email báo lỗi). --> **PASSED**
  - **TC-05**: Cascading Delete (ON DELETE CASCADE xóa trạm tự dọn dẹp review/favorite). --> **PASSED**
  - **TC-06**: Tích hợp (GPS Haversine & AI OCR Tesseract phản hồi thời gian thực). --> **PASSED**

---

## SLIDE 15: ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC
- **Về nghiệp vụ**:
  - Đáp ứng 100% mục tiêu ban đầu, thay thế phương thức mua đồ nhựa 1 lần bằng ứng dụng đong chiết xanh.
  - Phân quyền sử dụng trọn vẹn cho 3 nhóm tác nhân.
- **Về kỹ thuật**:
  - Mã nguồn 5 tầng sạch sẽ, dễ bảo trì.
  - CSDL SQL Server đạt chuẩn 3NF, truy vấn mượt mà.
  - Giao diện mượt mà, hỗ trợ Responsive trên cả Máy tính và Điện thoại.

---

## SLIDE 16: HẠN CHẾ CỦA HỆ THỐNG
- **Về nghiệp vụ**: Chưa tích hợp cổng thanh toán trực tuyến (VNPay/MoMo); chưa có tính năng đặt lịch đong chiết hẹn giờ.
- **Về công nghệ**: Độ chính xác OCR bị giảm khi ảnh chụp hóa đơn bị mờ, nhăn; chưa phát triển phiên bản Mobile App Native (React Native/Flutter).
- **Về bảo mật**: Chưa tích hợp xác thực 2 yếu tố (2FA); chưa trang bị tường lửa WAF chuyên dụng.

---

## SLIDE 17: ĐỊNH HƯỚNG PHÁT TRIỂN TƯƠNG LAI
1. **Ứng dụng Gemini AI Agent**: Tự động gợi ý lộ trình tiêu dùng xanh cá nhân hóa.
2. **Phát triển Mobile App & Geofencing**: Tự động gửi Push Notification khi đi gần trạm refill trong bán kính 1km.
3. **Kết nối Cổng thanh toán**: Tích hợp VNPay/MoMo/ZaloPay và tích điểm thưởng xanh (Green Loyalty Points).
4. **Dịch vụ Eco-Delivery**: Kết nối shipper xe điện giao đồ đong chiết tận nhà.

---

## SLIDE 18: KẾT THÚC BÁO CÁO
- **CHÂN THÀNH CẢM ƠN QUÝ THẦY CÔ VÀ HỘI ĐỒNG ĐÃ LẮNG NGHE!**
- *Nhóm 06 xin nhận các ý kiến đóng góp và câu hỏi phản biện từ Hội đồng.*
