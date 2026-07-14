# REFILL NEARBY
## 1. Tổng quan dự án

### Tên dự án

Refill Nearby

### Mô tả

Refill Nearby là nền tảng hỗ trợ người dùng tìm kiếm các trạm refill gần nhất, xem sản phẩm refill, đánh giá chất lượng dịch vụ và theo dõi lượng nhựa tiết kiệm được thông qua hoạt động refill.

### Mục tiêu

* Giảm rác thải nhựa dùng một lần.
* Kết nối người dùng với các trạm refill.
* Hỗ trợ chủ trạm quản lý sản phẩm và thông tin trạm.
* Hỗ trợ quản trị viên quản lý toàn hệ thống.

---

# 2. Tech Stack
## Refill Nearby được xây dựng theo mô hình Client–Server sử dụng kiến trúc Three-Tier Architecture gồm:

* Presentation Layer: ReactJS + Vite + TailwindCSS
* Business Logic Layer: NodeJS + ExpressJS REST API
* Data Layer: Microsoft SQL Server
## Frontend

* ReactJS
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Leaflet Map

## Backend

* NodeJS
* ExpressJS
* JWT Authentication
* bcryptjs

## Database

* Microsoft SQL Server 2022

## Khác

* OCR Space API
* OpenStreetMap
* GitHub

---

# 3. Kiến trúc hệ thống

Frontend (React)

↓

REST API (ExpressJS)

↓

SQL Server Database

---

# 4. Phân quyền hệ thống

## User

Người dùng cuối

### Chức năng

* Đăng ký
* Đăng nhập
* Quên mật khẩu
* Xem trạm refill
* Tìm kiếm trạm refill
* Xem sản phẩm refill
* Yêu thích trạm và sản phẩm
* Đánh giá sản phẩm
* Lịch sử refill
* Thống kê nhựa tiết kiệm
* OCR hóa đơn

---

## Owner

Chủ trạm refill

### Chức năng

* Quản lý trạm refill
* Thêm trạm
* Sửa trạm
* Xóa trạm
* Quản lý sản phẩm
* Thêm sản phẩm
* Sửa sản phẩm
* Xóa sản phẩm
* Xem đánh giá
* Lọc, xem đánh giá theo số sao và phản hồi đánh giá
* Dashboard thống kê

---

## Admin

### Chức năng

* Dashboard
* Quản lý User
* Quản lý Trạm refill
* Quản lý Sản phẩm
* Quản lý Đánh giá
* Quản lý Yêu thích
* Quản lý Lịch sử refill
* Thống kê toàn hệ thống

---


# 5. Module Authentication


## Mục đích

Authentication Module chịu trách nhiệm xác thực người dùng và phân quyền
truy cập hệ thống. Mọi chức năng đều yêu cầu người dùng đăng nhập bằng
tài khoản hợp lệ và được cấp JWT Token.

## Chức năng

-   Đăng ký tài khoản.
-   Đăng nhập.
-   Quên mật khẩu.
-   Xác thực JWT.
-   Phân quyền User / Store Owner / Admin.
-   Bảo vệ API bằng Middleware.

## Luồng hoạt động

Người dùng → Đăng nhập → Kiểm tra tài khoản → Sinh JWT → Truy cập hệ
thống.

# 6. Module Refill Stations

### User

-   Xem danh sách trạm.
-   Tìm kiếm theo tên.
-   Xem chi tiết trạm.
-   Xem vị trí trên bản đồ.
-   Xem sản phẩm của trạm.
-   Xem đánh giá.

### Store Owner

-   Thêm trạm.
-   Chỉnh sửa thông tin.
-   Cập nhật thời gian hoạt động.
-   Cập nhật hình ảnh.
-   Xóa trạm của mình.

### Admin

-   Xem toàn bộ trạm.
-   Quản lý thông tin.
-   Xóa trạm.
-   Theo dõi thống kê.

# 7. Module Products

## Mục đích

Quản lý sản phẩm refill.

## Chức năng

## User

-   Xem sản phẩm.
-   Tìm kiếm.
-   Xem trạm đang bán.
-   So sánh giá.

## Store Owner

-   Thêm sản phẩm.
-   Cập nhật giá.
-   Cập nhật mô tả.
-   Đổi trạng thái còn hàng / hết hàng.
-   Quản lý hình ảnh.

Khi chuyển trạng thái từ hết hàng sang còn hàng, hệ thống tự động gửi
thông báo đến những người dùng đã đăng ký nhận thông báo.

## Admin

-   Quản lý toàn bộ sản phẩm.
-   Xóa sản phẩm.
-   Theo dõi thống kê.


# 8. Module Favorites

## Mục đích

Lưu các trạm và sản phẩm  yêu thích.

## Chức năng
### User

-   Thêm hoặc hủy yêu thích trạm.
-   Thêm hoặc hủy yêu thích sản phẩm.
-   Xem danh sách yêu thích.
### Owner
-   Xem tổng lượt yêu thích trạm/ danh sách trạm yêu thích
-   Xem tổng lượt yêu thích sản phẩm/ danh sách sản phẩm yêu thích

### Admin
-   Quản lý toàn bộ lượt yêu thích.
-   Tìm kiếm theo người dùng, trạm, chủ sở hữu.
-   Lọc theo ngày.

# 9. Module Reviews

## Mục đích

### User
- Đánh giá sản phẩm và trạm refill.

### Owner
-   Xem đánh giá.
-   Lọc theo số sao.
-   Phản hồi đánh giá của khách hàng.


### Admin
-   Quản lý toàn bộ đánh giá.
-   Tìm kiếm theo người dùng, trạm và nội dung.
-   Lọc theo số sao.
-   Hiển thị chủ sở hữu.
-   Hiển thị phản hồi của chủ trạm.
-   Xóa đánh giá vi phạm.



# 10. Module Refill History

## Mục đích

Lưu toàn bộ lịch sử refill.

## User

-   Tạo lịch sử refill.
-   Xem lịch sử.
-   Theo dõi lượng nhựa tiết kiệm.

## Admin

-   Quản lý lịch sử refill.
-   Tìm kiếm.
-   Lọc theo ngày.
-   Xóa bản ghi nếu cần.

# 11. Module Statistics

## Mục đích

Module thống kê giúp theo dõi hoạt động của hệ thống.

## User Dashboard

-   Tổng lượt refill.
-   Tổng lượng refill.
-   Tổng nhựa tiết kiệm.



## Admin Dashboard

-   Tổng người dùng.
-   Tổng chủ trạm.
-   Tổng trạm.
-   Tổng sản phẩm.
-   Tổng đánh giá.
-   Tổng lượt refill.
-   Tổng lượng refill.
-   Tổng lượng refill hôm nay.
-   Tổng lượng refill trong tháng.
-   Thống kê theo khoảng thời gian.
-   Top 5 sản phẩm refill nhiều nhất.
-   Top 5 trạm refill nhiều nhất.
-   Thống kê yêu thích.
# 12. Module OCR

## Mục đích

Module OCR giúp nhận diện sản phẩm từ hóa đơn.

Quy trình:

Upload ảnh hóa đơn

↓

OCR Space API

↓

Trích xuất văn bản

↓

Nhận diện tên sản phẩm

↓

Tìm kiếm sản phẩm trong cơ sở dữ liệu

↓

Đề xuất các trạm refill phù hợp.

# 13. Notification Module

Người dùng có thể đăng ký nhận thông báo khi sản phẩm hết hàng.

Khi chủ trạm cập nhật trạng thái từ hết hàng sang còn hàng, hệ thống sẽ
tự động tạo thông báo và gửi đến tất cả người dùng đã đăng ký.

Người dùng có thể xem danh sách thông báo và đánh dấu đã đọc.

# 14. Map Module
## Mục đích

Hiển thị vị trí trạm refill trên bản đồ.

## Công nghệ

* Leaflet
* OpenStreetMap

## Chức năng:

-   Hiển thị vị trí hiện tại.
-   Marker các trạm.
-   Popup thông tin.
-   Khoảng cách.
-   Chỉ đường.
-   Điều hướng sang Google Maps.

# 15. Business Rules

-   Mỗi người dùng chỉ yêu thích một trạm một lần.
-   Mỗi người dùng chỉ yêu thích một sản phẩm một lần.
-   Chủ trạm chỉ được quản lý dữ liệu thuộc quyền sở hữu.
-   Admin quản lý toàn bộ dữ liệu.
-   Khi sản phẩm có lại hàng, thông báo được gửi tự động.
-   Thống kê được tính trực tiếp từ dữ liệu thực tế trong SQL Server.


# 16. Các API chính

## Authentication

/auth/*

## Stations

/stations/*

## Products

/products/*

## Favorites

/favorites/*

## Reviews

/reviews/*

## OCR

/ocr/*

## Statistics

/statistics/*

## Owner

/owner/*

## Admin

/admin/*

---

