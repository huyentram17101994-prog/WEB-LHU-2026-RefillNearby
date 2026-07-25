# REFILL NEARBY
## . Tổng quan dự án

### Tên dự án

Refill Nearby

### Mô tả

Refill Nearby là nền tảng hỗ trợ người dùng tìm kiếm các trạm refill gần nhất, xem sản phẩm refill, đánh giá chất lượng dịch vụ và theo dõi lượng nhựa tiết kiệm được thông qua hoạt động refill.

### Mục tiêu

* Giảm rác thải nhựa dùng một lần.
* Kết nối người dùng với các trạm refill.
* Hỗ trợ chủ trạm quản lý sản phẩm và thông tin trạm.
* Hỗ trợ quản trị viên quản lý toàn hệ thống.

---------------------------------------------------------
# 2. Kiến trúc hệ thống

## Three-tier Architecture

Presentation Layer - ReactJS - Vite - Tailwind CSS - Axios - React
Router - Leaflet

↓

Business Layer - NodeJS - ExpressJS - REST API - JWT Authentication -
Middleware - Controllers

↓

Data Layer - SQL Server 2022 - Stored Procedure - Trigger - Transaction

Luồng xử lý: Client → REST API → Controller → SQL Server → JSON → React
UI

------------------------------------------------------------------------

# 3. Công nghệ

## Backend

-   NodeJS
-   ExpressJS
-   JWT
-   bcryptjs
-   dotenv
-   mssql

## Frontend

-   ReactJS
-   Tailwind CSS
-   Vite
-   Axios
-   React Router

## Tích hợp

-   SQL Server
-   OCR Space API
-   OpenStreetMap/Leaflet
-   GitHub

------------------------------------------------------------------------




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


# 1.Module AUTHENTICATION

## AUTH-01 Đăng ký tài khoản

### Mục đích

Cho phép người dùng tạo tài khoản mới để sử dụng hệ thống Refill Nearby.

### Đối tượng sử dụng

-   Khách (Guest)

### Tiền điều kiện

-   Email chưa tồn tại.
-   Người dùng chưa đăng nhập.

### Mô tả chức năng

Người dùng nhập họ tên, email, số điện thoại và mật khẩu. Hệ thống kiểm
tra dữ liệu, mã hóa mật khẩu bằng bcrypt trước khi lưu vào cơ sở dữ
liệu. Sau khi đăng ký thành công, người dùng có thể đăng nhập bằng tài
khoản vừa tạo.

### Luồng xử lý

1.  Mở trang Đăng ký.
2.  Nhập thông tin.
3.  Kiểm tra dữ liệu.
4.  Kiểm tra email trùng.
5.  Mã hóa mật khẩu.
6.  Lưu bảng `users`.
7.  Thông báo thành công.

### Luồng ngoại lệ

-   Email đã tồn tại.
-   Thiếu dữ liệu.
-   Lỗi kết nối CSDL.

### Dữ liệu sử dụng

-   users

### Kết quả

Tài khoản được tạo thành công.

------------------------------------------------------------------------

## AUTH-02 Đăng nhập

### Mục đích

Xác thực người dùng và cấp JWT để truy cập hệ thống.

### Đối tượng

-   User
-   Store Owner
-   Admin

### Mô tả chức năng

Người dùng nhập email và mật khẩu. Backend kiểm tra thông tin, so sánh
mật khẩu bằng bcrypt, tạo JWT chứa user_id và role, sau đó trả về
frontend. Frontend lưu token và điều hướng đến giao diện phù hợp.

### Quy tắc nghiệp vụ

-   Sai email hoặc mật khẩu thì từ chối đăng nhập.
-   Tài khoản bị khóa không được phép đăng nhập.
-   Token phải gửi qua Authorization Bearer.

------------------------------------------------------------------------

# 2.Module PRODUCT

## PRD-01 Xem danh sách sản phẩm

### Mục đích

Cho phép người dùng xem toàn bộ sản phẩm refill đang được cung cấp trên
hệ thống.

### Đối tượng sử dụng

-   Guest
-   User

### Mô tả chức năng

Khi truy cập trang Products, hệ thống tải danh sách sản phẩm từ cơ sở dữ
liệu và hiển thị hình ảnh, tên, danh mục, giá, trạng thái còn hàng và
trạm cung cấp.

### Luồng xử lý

1.  Người dùng mở trang Products.
2.  Frontend gọi API lấy danh sách sản phẩm.
3.  Backend truy vấn bảng products.
4.  Trả dữ liệu JSON.
5.  Hiển thị danh sách.

### Kết quả

Người dùng xem được toàn bộ sản phẩm.

------------------------------------------------------------------------

## PRD-02 Tìm kiếm sản phẩm

### Mục đích

Tìm nhanh sản phẩm theo tên.

### Mô tả chức năng

Người dùng nhập từ khóa. Hệ thống tìm kiếm theo tên sản phẩm và cập nhật
kết quả theo thời gian thực.

### Luồng ngoại lệ

-   Không tìm thấy dữ liệu.
-   Từ khóa rỗng sẽ hiển thị toàn bộ.

------------------------------------------------------------------------

## PRD-03 Xem các trạm đang bán sản phẩm

### Mô tả chức năng

Sau khi chọn một sản phẩm, hệ thống hiển thị tất cả trạm đang bán sản
phẩm đó cùng giá bán, địa chỉ, khoảng cách và trạng thái còn hàng.

------------------------------------------------------------------------

## PRD-04 Thêm sản phẩm

### Đối tượng sử dụng

-   Store Owner

### Mô tả chức năng

Owner nhập tên, danh mục, giá, mô tả, hình ảnh và trạng thái còn hàng.
Hệ thống kiểm tra dữ liệu, lưu vào bảng products và hiển thị ngay trên
danh sách.

### Quy tắc nghiệp vụ

-   Giá bán \> 0.
-   Chủ trạm chỉ thêm sản phẩm thuộc trạm của mình.

------------------------------------------------------------------------

## PRD-05 Cập nhật sản phẩm

### Mô tả chức năng

Owner được chỉnh sửa tên, giá, danh mục, mô tả, hình ảnh và trạng thái
sản phẩm. Sau khi lưu, dữ liệu được cập nhật tức thời.

------------------------------------------------------------------------

## PRD-06 Cập nhật trạng thái còn hàng

### Mục đích

Quản lý tồn kho và gửi thông báo cho người dùng.

### Mô tả chức năng

Khi chuyển trạng thái từ Hết hàng sang Còn hàng, hệ thống: 1. Cập nhật
stock_status. 2. Tìm người dùng đã đăng ký thông báo. 3. Tạo
Notification. 4. Đánh dấu yêu cầu đã xử lý.

### Dữ liệu

-   products
-   product_notification_requests
-   notifications

------------------------------------------------------------------------

## PRD-07 Xóa sản phẩm

### Mô tả chức năng

Owner chỉ được xóa sản phẩm của mình. Admin có quyền xóa mọi sản phẩm.

------------------------------------------------------------------------

## PRD-08 Quản lý sản phẩm (Admin)

### Chức năng

-   Xem danh sách.
-   Tìm kiếm.
-   Xóa sản phẩm.
-   Theo dõi thống kê.
-   Xem Top 5 sản phẩm refill nhiều nhất.

------------------------------------------------------------------------
# 3.Module REFILL STATION

## STA-01 Xem danh sách trạm refill

### Mục đích

Cho phép người dùng xem toàn bộ các trạm refill đang hoạt động trên hệ
thống.

### Đối tượng sử dụng

-   User
-   Guest

### Tiền điều kiện

Hệ thống có dữ liệu trạm refill.

### Mô tả chức năng

Khi người dùng truy cập trang chủ hoặc trang tìm kiếm, hệ thống tải danh
sách trạm refill từ cơ sở dữ liệu và hiển thị theo dạng thẻ. Mỗi thẻ gồm
tên trạm, địa chỉ, hình ảnh, đánh giá trung bình và trạng thái hoạt
động.

### Luồng xử lý

1.  Mở trang Home.
2.  Frontend gọi API lấy danh sách trạm.
3.  Backend truy vấn bảng refill_stations.
4.  Trả dữ liệu JSON.
5.  Hiển thị danh sách.

### Luồng ngoại lệ

-   Không có dữ liệu.
-   Lỗi kết nối máy chủ.

### Dữ liệu sử dụng

-   refill_stations
-   reviews

### Kết quả

Danh sách trạm được hiển thị.

------------------------------------------------------------------------

## STA-02 Xem chi tiết trạm

### Mục đích

Hiển thị đầy đủ thông tin của một trạm refill.

### Mô tả chức năng

Người dùng chọn một trạm từ danh sách. Hệ thống hiển thị tên trạm, địa
chỉ, giờ mở cửa, hình ảnh, mô tả, vị trí bản đồ, danh sách sản phẩm,
đánh giá và nút yêu thích.

### Quy tắc nghiệp vụ

-   Chỉ hiển thị sản phẩm của trạm.
-   Đánh giá được sắp xếp mới nhất trước.

------------------------------------------------------------------------

## STA-03 Tìm kiếm trạm

### Mục đích

Hỗ trợ tìm kiếm nhanh theo tên hoặc địa chỉ.

### Mô tả chức năng

Người dùng nhập từ khóa. Hệ thống tìm các trạm có tên hoặc địa chỉ phù
hợp và cập nhật kết quả ngay trên giao diện.

------------------------------------------------------------------------

## STA-04 Thêm trạm refill

### Đối tượng sử dụng

-   Store Owner

### Mô tả chức năng

Owner nhập thông tin trạm gồm tên, địa chỉ, số điện thoại, mô tả, giờ
hoạt động, tọa độ và hình ảnh. Hệ thống kiểm tra dữ liệu hợp lệ trước
khi lưu.

### Quy tắc nghiệp vụ

-   Mỗi trạm thuộc đúng một Owner.
-   Không được để trống tên và địa chỉ.

------------------------------------------------------------------------

## STA-05 Cập nhật thông tin trạm

### Mô tả chức năng

Owner có thể cập nhật thông tin, hình ảnh, thời gian hoạt động và vị trí
của trạm. Sau khi lưu, dữ liệu được cập nhật ngay cho người dùng.

------------------------------------------------------------------------

## STA-06 Xóa trạm

### Mô tả chức năng

Owner được xóa trạm thuộc quyền sở hữu của mình. Admin có quyền xóa mọi
trạm nếu cần.

### Luồng ngoại lệ

-   Không đủ quyền.
-   Trạm đang có ràng buộc dữ liệu.

------------------------------------------------------------------------

## STA-07 Quản lý trạm (Admin)

### Mục đích

Cho phép Admin quản lý toàn bộ trạm refill.

### Chức năng

-   Xem danh sách.
-   Tìm kiếm.
-   Xóa trạm.
-   Xem chi tiết.
-   Theo dõi thống kê.
--------------------------------------------------------------------

# 4.Module FAVORITE

## Giới thiệu

Favorite Module cho phép người dùng lưu các trạm refill và sản phẩm yêu
thích để truy cập nhanh trong những lần sử dụng tiếp theo. Đồng thời dữ
liệu yêu thích được sử dụng để xây dựng các báo cáo thống kê và đánh giá
mức độ quan tâm của người dùng đối với từng trạm và từng sản phẩm.

------------------------------------------------------------------------

## FAV-01 Thêm trạm vào danh sách yêu thích

### Mục đích

Cho phép người dùng lưu một trạm refill yêu thích.

### Đối tượng sử dụng

-   User

### Tiền điều kiện

-   Người dùng đã đăng nhập.
-   Trạm refill tồn tại.

### Mô tả chức năng

Người dùng nhấn biểu tượng trái tim tại trang chi tiết trạm. Hệ thống
kiểm tra xem người dùng đã yêu thích trạm hay chưa. Nếu chưa có, hệ
thống tạo bản ghi trong bảng favorites và cập nhật trạng thái nút yêu
thích trên giao diện.

### Luồng xử lý

1.  Chọn biểu tượng yêu thích.
2.  Gửi API thêm yêu thích.
3.  Kiểm tra dữ liệu trùng.
4.  Lưu vào bảng favorites.
5.  Trả kết quả thành công.
6.  Giao diện đổi sang trạng thái đã yêu thích.

### Quy tắc nghiệp vụ

-   Một người dùng chỉ được yêu thích một trạm một lần.
-   Chỉ User mới được thêm yêu thích.

### Bảng dữ liệu

-   favorites
-   users
-   refill_stations

------------------------------------------------------------------------

## FAV-02 Hủy yêu thích trạm

### Mục đích

Xóa trạm khỏi danh sách yêu thích.

### Mô tả chức năng

Khi người dùng nhấn lại biểu tượng trái tim, hệ thống xóa bản ghi tương
ứng trong bảng favorites và cập nhật lại giao diện.

### Kết quả

Trạm không còn xuất hiện trong danh sách yêu thích.

------------------------------------------------------------------------

## FAV-03 Thêm sản phẩm vào yêu thích

### Mục đích

Lưu sản phẩm yêu thích.

### Mô tả chức năng

Người dùng nhấn nút yêu thích tại trang sản phẩm. Hệ thống lưu dữ liệu
vào bảng favorite_products.

### Quy tắc nghiệp vụ

-   Một người dùng chỉ được yêu thích một sản phẩm một lần.

### Bảng dữ liệu

-   favorite_products
-   products
-   users

------------------------------------------------------------------------

## FAV-04 Hủy yêu thích sản phẩm

### Mô tả chức năng

Hệ thống xóa dữ liệu trong bảng favorite_products và cập nhật giao diện.

------------------------------------------------------------------------

## FAV-05 Xem danh sách yêu thích

### Mục đích

Hiển thị toàn bộ trạm và sản phẩm mà người dùng đã lưu.

### Mô tả chức năng

Người dùng truy cập trang Favorites. Hệ thống tải danh sách trạm yêu
thích và sản phẩm yêu thích của chính người dùng.

### Hiển thị

-   Hình ảnh
-   Tên
-   Giá
-   Địa chỉ
-   Trạng thái

------------------------------------------------------------------------

## FAV-06 Quản lý yêu thích (Admin)

### Mục đích

Cho phép Admin theo dõi toàn bộ dữ liệu yêu thích.

### Chức năng

-   Xem danh sách yêu thích.
-   Hiển thị tên người dùng.
-   Hiển thị tên trạm.
-   Hiển thị chủ sở hữu.
-   Hiển thị ngày yêu thích.
-   Tìm kiếm theo người dùng.
-   Tìm kiếm theo trạm.
-   Tìm kiếm theo chủ sở hữu.
-   Lọc theo khoảng thời gian.

------------------------------------------------------------------------

## FAV-07 Thống kê yêu thích trạm

### Mục đích

Thống kê tổng lượt yêu thích của tất cả các trạm refill.

### Mô tả chức năng

Dashboard hiển thị một Card chứa tổng số lượt yêu thích của các trạm
refill. Khi nhấn vào Card, hệ thống hiển thị cửa sổ Top 5 trạm được yêu
thích nhiều nhất.

### Dữ liệu hiển thị

-   Tổng lượt yêu thích.
-   Top 5 trạm.
-   Số lượt yêu thích từng trạm.

------------------------------------------------------------------------

## FAV-08 Thống kê yêu thích sản phẩm

### Mục đích

Thống kê tổng lượt yêu thích của các sản phẩm.

### Mô tả chức năng

Dashboard hiển thị Card tổng lượt yêu thích sản phẩm. Khi nhấn vào Card
sẽ hiển thị Top 5 sản phẩm được yêu thích nhiều nhất.

### Dữ liệu hiển thị

-   Tổng lượt yêu thích.
-   Top 5 sản phẩm.
-   Số lượt yêu thích.

------------------------------------------------------------------------
# 5.Module REVIEW

## Giới thiệu

Review Module cho phép người dùng đánh giá chất lượng trạm refill sau
khi sử dụng dịch vụ. Các đánh giá giúp những người dùng khác có thêm
thông tin tham khảo trước khi lựa chọn trạm refill, đồng thời giúp chủ
trạm cải thiện chất lượng dịch vụ.

------------------------------------------------------------------------

## REV-01 Xem danh sách đánh giá

### Mục đích

Hiển thị toàn bộ đánh giá của một trạm refill.

### Đối tượng sử dụng

-   Guest
-   User
-   Store Owner
-   Admin

### Mô tả chức năng

Khi người dùng mở trang chi tiết trạm refill, hệ thống tải toàn bộ đánh
giá của trạm từ cơ sở dữ liệu và hiển thị theo thứ tự mới nhất.

### Thông tin hiển thị

-   Tên người dùng
-   Số sao
-   Nội dung đánh giá
-   Ngày tạo
-   Phản hồi của chủ trạm (nếu có)

------------------------------------------------------------------------

## REV-02 Thêm đánh giá

### Mục đích

Cho phép người dùng đánh giá trạm refill.

### Tiền điều kiện

-   Đăng nhập.
-   Trạm refill tồn tại.

### Mô tả chức năng

Người dùng chọn số sao từ 1 đến 5, nhập nội dung đánh giá và gửi. Hệ
thống lưu dữ liệu vào bảng reviews và cập nhật điểm đánh giá trung bình
của trạm.

### Quy tắc nghiệp vụ

-   Mỗi đánh giá phải có số sao.
-   Nội dung không được để trống.

------------------------------------------------------------------------

## REV-03 Chỉnh sửa đánh giá

### Mô tả chức năng

Người dùng có thể chỉnh sửa số sao hoặc nội dung đánh giá của chính
mình. Sau khi lưu, hệ thống cập nhật dữ liệu và tính lại điểm trung
bình.

------------------------------------------------------------------------

## REV-04 Xóa đánh giá

### Mô tả chức năng

Người dùng có thể xóa đánh giá của mình. Admin có quyền xóa mọi đánh giá
vi phạm.

------------------------------------------------------------------------

## REV-05 Phản hồi đánh giá

### Đối tượng

-   Store Owner

### Mô tả chức năng

Chủ trạm xem các đánh giá thuộc trạm của mình và gửi phản hồi trực tiếp.
Phản hồi sẽ hiển thị bên dưới đánh giá để người dùng theo dõi.

------------------------------------------------------------------------

## REV-06 Quản lý đánh giá (Admin)

### Mục đích

Quản lý toàn bộ đánh giá trên hệ thống.

### Chức năng

-   Xem danh sách đánh giá.
-   Hiển thị ID.
-   Hiển thị người dùng.
-   Hiển thị trạm refill.
-   Hiển thị chủ sở hữu.
-   Hiển thị số sao.
-   Hiển thị nội dung.
-   Hiển thị phản hồi của chủ trạm.
-   Hiển thị ngày tạo.
-   Tìm kiếm theo người dùng.
-   Tìm kiếm theo trạm.
-   Tìm kiếm theo nội dung.
-   Lọc theo số sao.
-   Xóa đánh giá.

------------------------------------------------------------------------

## REV-07 Thống kê đánh giá

### Mục đích

Theo dõi chất lượng dịch vụ.

### Chức năng

-   Tổng số đánh giá.
-   Điểm đánh giá trung bình.
-   Thống kê số lượng đánh giá theo số sao.

------------------------------------------------------------------------

## Bảng dữ liệu sử dụng

-   reviews
-   users
-   refill_stations

--------------------------------------------------------------------------
# 6.Module REFILL HISTORY

## Giới thiệu

Refill History Module quản lý toàn bộ lịch sử các lần refill của người
dùng trên hệ thống Refill Nearby. Dữ liệu từ module này là nguồn chính
để xây dựng các báo cáo thống kê, tính lượng nhựa tiết kiệm và đánh giá
hiệu quả hoạt động của các trạm refill.

------------------------------------------------------------------------

# REF-01 Tạo lịch sử refill

## Mục đích

Ghi nhận một lần refill sau khi người dùng hoàn thành giao dịch tại trạm
refill.

## Đối tượng sử dụng

-   User

## Tiền điều kiện

-   Người dùng đã đăng nhập.
-   Trạm refill tồn tại.
-   Sản phẩm tồn tại.

## Mô tả chức năng

Người dùng nhập thông tin lần refill gồm sản phẩm, trạm refill và số
lượng refill. Hệ thống kiểm tra dữ liệu hợp lệ trước khi lưu vào bảng
`refill_history`. Đồng thời hệ thống cập nhật lượng nhựa tiết kiệm của
người dùng để phục vụ thống kê.

## Luồng xử lý

1.  Người dùng chọn sản phẩm.
2.  Chọn trạm refill.
3.  Nhập số lượng refill.
4.  Gửi yêu cầu tạo lịch sử.
5.  Backend kiểm tra dữ liệu.
6.  Lưu vào bảng refill_history.
7.  Cập nhật thống kê.
8.  Trả kết quả thành công.

## Quy tắc nghiệp vụ

-   Số lượng refill phải lớn hơn 0.
-   Chỉ ghi nhận khi sản phẩm tồn tại.

------------------------------------------------------------------------

# REF-02 Xem lịch sử refill

## Mục đích

Cho phép người dùng xem toàn bộ các lần refill đã thực hiện.

## Mô tả chức năng

Hệ thống hiển thị lịch sử refill theo thời gian giảm dần.

### Thông tin hiển thị

-   Tên sản phẩm
-   Trạm refill
-   Số lượng refill
-   Ngày refill

------------------------------------------------------------------------

# REF-03 Tìm kiếm lịch sử

## Mục đích

Hỗ trợ tìm nhanh lịch sử refill.

## Mô tả chức năng

Người dùng nhập tên sản phẩm hoặc tên trạm refill. Hệ thống trả về các
bản ghi phù hợp.

------------------------------------------------------------------------

# REF-04 Lọc theo khoảng thời gian

## Mục đích

Lọc lịch sử refill theo ngày bắt đầu và ngày kết thúc.

## Mô tả chức năng

Người dùng chọn khoảng thời gian. Backend truy vấn dữ liệu theo điều
kiện ngày refill và trả về danh sách phù hợp.

------------------------------------------------------------------------

# REF-05 Thống kê lượng refill

## Mục đích

Tổng hợp dữ liệu refill phục vụ Dashboard.

## Chức năng

-   Tổng lượng refill.
-   Tổng lượng refill hôm nay.
-   Tổng lượng refill trong tháng.
-   Tổng lượng refill theo khoảng thời gian.
-   Top 5 sản phẩm refill nhiều nhất.
-   Top 5 trạm refill nhiều nhất.

------------------------------------------------------------------------

# REF-06 Quản lý lịch sử refill (Admin)

## Mục đích

Quản lý toàn bộ lịch sử refill của hệ thống.

## Chức năng

-   Xem danh sách.
-   Tìm kiếm.
-   Lọc theo ngày.
-   Xem chi tiết.
-   Theo dõi thống kê.

------------------------------------------------------------------------

# Bảng dữ liệu sử dụng

-   refill_history
-   users
-   products
-   refill_stations

------------------------------------------------------------------------

# 7.Module STATISTICS

## 1. Giới thiệu

Statistics Module cung cấp các chức năng thống kê và báo cáo nhằm giúp
người dùng, chủ trạm và quản trị viên theo dõi tình hình hoạt động của
hệ thống Refill Nearby. Toàn bộ dữ liệu thống kê được tổng hợp trực tiếp
từ cơ sở dữ liệu SQL Server và cập nhật theo thời gian thực.

------------------------------------------------------------------------

# STA-01 Dashboard Người dùng

## Mục đích

Hiển thị các thông tin thống kê cá nhân của người dùng.

### Chức năng

-   Tổng số lần refill.
-   Tổng lượng refill.
-   Tổng lượng nhựa tiết kiệm.
-   Lịch sử refill gần đây.

------------------------------------------------------------------------

# STA-02 Dashboard Chủ trạm

## Mục đích

Theo dõi hoạt động kinh doanh của trạm refill.

### Chức năng

-   Tổng sản phẩm.
-   Tổng lượt refill.
-   Tổng lượng refill.
-   Tổng đánh giá.
-   Thống kê theo từng trạm.
-   Theo dõi doanh số refill.

------------------------------------------------------------------------

# STA-03 Dashboard Quản trị viên

## Mục đích

Theo dõi toàn bộ hoạt động của hệ thống.

### Chức năng

-   Tổng người dùng.
-   Tổng chủ trạm.
-   Tổng trạm refill.
-   Tổng sản phẩm.
-   Tổng đánh giá.
-   Tổng lượt refill.

------------------------------------------------------------------------

# STA-04 Thống kê tổng lượng refill

## Mục đích

Hiển thị tổng lượng refill của toàn hệ thống.

### Mô tả

Hệ thống tính tổng trường quantity trong bảng refill_history và hiển thị
dưới dạng Card trên Dashboard.

------------------------------------------------------------------------

# STA-05 Thống kê lượng refill hôm nay

## Mô tả

Hệ thống tính tổng lượng refill có refill_date bằng ngày hiện tại.

### Kết quả

Hiển thị Card "Tổng lượng refill hôm nay".

------------------------------------------------------------------------

# STA-06 Thống kê lượng refill trong tháng

## Mô tả

Hệ thống thống kê toàn bộ lượng refill trong tháng hiện tại.

------------------------------------------------------------------------

# STA-07 Thống kê theo khoảng thời gian

## Mục đích

Cho phép Admin xem lượng refill theo thời gian tùy chọn.

### Luồng xử lý

1.  Chọn ngày bắt đầu.
2.  Chọn ngày kết thúc.
3.  Nhấn nút Thống kê.
4.  Backend tính tổng quantity.
5.  Hiển thị kết quả.

------------------------------------------------------------------------

# STA-08 Top 5 sản phẩm refill nhiều nhất

## Mục đích

Xác định các sản phẩm được refill nhiều nhất.

### Dữ liệu hiển thị

-   Tên sản phẩm.
-   Tổng lượng refill.

------------------------------------------------------------------------

# STA-09 Top 5 trạm refill nhiều nhất

## Mục đích

Xác định các trạm refill có tổng lượng refill cao nhất.

### Dữ liệu hiển thị

-   Tên trạm.
-   Tổng lượng refill.

------------------------------------------------------------------------

# STA-10 Thống kê yêu thích trạm

## Mục đích

Hiển thị tổng lượt yêu thích của tất cả trạm refill.

### Mô tả

Dashboard hiển thị Card tổng lượt yêu thích trạm. Khi người quản trị
nhấn vào Card, hệ thống mở cửa sổ Top 5 trạm được yêu thích nhiều nhất.

### Dữ liệu

-   Tổng lượt yêu thích.
-   Top 5 trạm.
-   Số lượt yêu thích.

------------------------------------------------------------------------

# STA-11 Thống kê yêu thích sản phẩm

## Mục đích

Hiển thị tổng lượt yêu thích của các sản phẩm.

### Mô tả

Dashboard hiển thị Card tổng lượt yêu thích sản phẩm. Khi nhấn vào Card
sẽ hiển thị Top 5 sản phẩm được yêu thích nhiều nhất.
# Bảng dữ liệu sử dụng

-   refill_history
-   products
-   refill_stations
-   favorites
-   favorite_products
-   users

------------------------------------------------------------------------
# 8.Module NOTIFICATION

## Giới thiệu

Notification Module giúp người dùng nhận thông báo khi sản phẩm refill
đã có hàng trở lại. Chức năng này giúp người dùng không cần kiểm tra thủ
công và tăng trải nghiệm sử dụng hệ thống.

------------------------------------------------------------------------

# NOT-01 Đăng ký nhận thông báo

## Mục đích

Cho phép người dùng đăng ký nhận thông báo khi sản phẩm hết hàng được bổ
sung.

### Đối tượng

-   User

### Tiền điều kiện

-   Đăng nhập.
-   Sản phẩm đang ở trạng thái hết hàng.

### Luồng xử lý

1.  Người dùng nhấn "Thông báo khi có hàng".
2.  Frontend gửi API đăng ký.
3.  Backend kiểm tra đã đăng ký hay chưa.
4.  Nếu chưa có thì lưu vào `product_notification_requests`.
5.  Trả thông báo thành công.

### Quy tắc nghiệp vụ

-   Một người dùng chỉ đăng ký một lần cho một sản phẩm.

------------------------------------------------------------------------

# NOT-02 Hủy đăng ký thông báo

### Mô tả

Người dùng có thể hủy yêu cầu nhận thông báo trước khi sản phẩm có hàng.

------------------------------------------------------------------------

# NOT-03 Tự động gửi thông báo

## Mục đích

Tự động gửi thông báo khi Owner cập nhật sản phẩm từ "Hết hàng" sang
"Còn hàng".

### Luồng xử lý

1.  Owner cập nhật trạng thái sản phẩm.
2.  Backend tìm các yêu cầu còn trạng thái `waiting`.
3.  Tạo bản ghi trong bảng `notifications`.
4.  Cập nhật trạng thái yêu cầu thành `done`.
5.  Người dùng nhận thông báo trong ứng dụng.

### Dữ liệu sử dụng

-   products
-   product_notification_requests
-   notifications

------------------------------------------------------------------------

# NOT-04 Xem danh sách thông báo

### Mục đích

Hiển thị toàn bộ thông báo của người dùng.

### Thông tin hiển thị

-   Tiêu đề
-   Nội dung
-   Tên sản phẩm
-   Tên trạm
-   Địa chỉ
-   Giờ mở cửa
-   Hình ảnh
-   Thời gian tạo
-   Trạng thái đã đọc

------------------------------------------------------------------------

# NOT-05 Đánh dấu đã đọc

### Mô tả

Khi người dùng mở thông báo, hệ thống cập nhật trường `is_read = 1`.

------------------------------------------------------------------------

# NOT-06 Quản lý thông báo

### Chức năng

-   Xem danh sách.
-   Sắp xếp mới nhất.
-   Đánh dấu đã đọc.
-   Hiển thị số thông báo chưa đọc.

------------------------------------------------------------------------

# Bảng dữ liệu

-   notifications
-   product_notification_requests
-   products
-   refill_stations
-   users

------------------------------------------------------------------------
# 9.Module OCR

## Giới thiệu

OCR Module hỗ trợ người dùng tải ảnh hóa đơn mua sắm để hệ thống tự động
nhận diện tên sản phẩm. Sau khi phân tích, hệ thống gợi ý các trạm
refill đang kinh doanh những sản phẩm tương ứng, giúp người dùng chuyển
sang hình thức mua refill thân thiện với môi trường.

------------------------------------------------------------------------

# OCR-01 Tải ảnh hóa đơn

## Mục đích

Cho phép người dùng chọn hoặc chụp ảnh hóa đơn.

### Đối tượng

-   User

### Tiền điều kiện

-   Đăng nhập.
-   Ảnh đúng định dạng (JPG, JPEG, PNG).

### Luồng xử lý

1.  Người dùng chọn ảnh.
2.  Frontend kiểm tra định dạng.
3.  Gửi ảnh lên Backend.
4.  Backend chuyển ảnh đến dịch vụ OCR.

------------------------------------------------------------------------

# OCR-02 Nhận diện văn bản

## Mô tả

Hệ thống OCR trích xuất nội dung văn bản từ hóa đơn, bao gồm tên sản
phẩm và các thông tin liên quan.

### Kết quả

-   Văn bản nhận diện.
-   Danh sách tên sản phẩm.

------------------------------------------------------------------------

# OCR-03 Phân tích sản phẩm

## Mục đích

Đối chiếu tên sản phẩm trên hóa đơn với dữ liệu trong hệ thống.

### Luồng xử lý

1.  Chuẩn hóa tên sản phẩm.
2.  So khớp với bảng products.
3.  Loại bỏ dữ liệu trùng.
4.  Tạo danh sách sản phẩm phù hợp.

------------------------------------------------------------------------

# OCR-04 Gợi ý trạm refill

## Mục đích

Hiển thị các trạm refill đang bán sản phẩm đã nhận diện.

### Thông tin hiển thị

-   Tên sản phẩm.
-   Tên trạm.
-   Địa chỉ.
-   Giá refill.
-   Trạng thái còn hàng.
-   Khoảng cách (nếu có vị trí người dùng).

------------------------------------------------------------------------

# OCR-05 Xử lý ngoại lệ

### Trường hợp

-   Ảnh mờ.
-   Không đọc được văn bản.
-   Không tìm thấy sản phẩm.
-   Không có trạm refill phù hợp.

### Phản hồi

Hệ thống hiển thị thông báo rõ ràng và cho phép người dùng tải ảnh khác.

------------------------------------------------------------------------

# Quy tắc nghiệp vụ

-   Chỉ xử lý ảnh hợp lệ.
-   Không lưu ảnh gốc nếu không cần thiết.
-   Chỉ gợi ý sản phẩm và trạm còn hoạt động.

------------------------------------------------------------------------

# Bảng dữ liệu

-   products
-   refill_stations
-   categories

------------------------------------------------------------------------
# 10.Module MAP & LOCATION

## Giới thiệu

Module Map & Location hỗ trợ xác định vị trí người dùng, hiển thị các
trạm refill trên bản đồ và tìm kiếm trạm gần nhất nhằm giúp người dùng
tiếp cận dịch vụ refill nhanh chóng.

------------------------------------------------------------------------

# MAP-01 Cấp quyền truy cập vị trí

## Mục đích

Xin quyền truy cập GPS của thiết bị.

### Đối tượng

-   Guest
-   User

### Luồng xử lý

1.  Người dùng mở ứng dụng.
2.  Hệ thống yêu cầu quyền truy cập vị trí.
3.  Người dùng đồng ý hoặc từ chối.
4.  Nếu đồng ý, lấy tọa độ hiện tại.

### Ngoại lệ

-   Từ chối quyền.
-   GPS tắt.
-   Không lấy được vị trí.

------------------------------------------------------------------------

# MAP-02 Xác định vị trí hiện tại

## Mô tả

Hệ thống sử dụng GPS để lấy: - Vĩ độ (Latitude) - Kinh độ (Longitude)

Sau đó lưu tạm để phục vụ tìm kiếm và tính khoảng cách.

------------------------------------------------------------------------

# MAP-03 Hiển thị bản đồ

## Mục đích

Hiển thị bản đồ Google Maps cùng các trạm refill.

### Thông tin hiển thị

-   Marker vị trí người dùng.
-   Marker các trạm refill.
-   Tên trạm.
-   Địa chỉ.

------------------------------------------------------------------------

# MAP-04 Tìm trạm gần nhất

## Mục đích

Sắp xếp các trạm theo khoảng cách từ vị trí hiện tại.

### Luồng xử lý

1.  Lấy GPS.
2.  Lấy danh sách trạm.
3.  Tính khoảng cách.
4.  Sắp xếp tăng dần.
5.  Hiển thị kết quả.

------------------------------------------------------------------------

# MAP-05 Điều hướng đến trạm

## Mục đích

Cho phép mở Google Maps để dẫn đường.

### Kết quả

Google Maps mở với điểm đến là trạm refill đã chọn.

------------------------------------------------------------------------

# MAP-06 Tìm kiếm theo địa chỉ

## Mô tả

Người dùng nhập địa chỉ hoặc tên khu vực, hệ thống định vị vị trí và
hiển thị các trạm refill gần khu vực đó.

------------------------------------------------------------------------

# Quy tắc nghiệp vụ

-   Chỉ hiển thị các trạm đang hoạt động.
-   Khoảng cách được cập nhật theo vị trí hiện tại.
-   Nếu không có GPS vẫn cho phép tìm theo từ khóa.

------------------------------------------------------------------------

# Dữ liệu sử dụng

-   refill_stations
-   users

------------------------------------------------------------------------

