# RefillNearby - Hệ thống tìm kiếm trạm Refill

## 1. Thông tin đề tài

### Tên đề tài

**RefillNearby - Hệ thống tìm kiếm trạm Refill**

### Nhóm thực hiện

**Nhóm 06**

### Thành viên

- Huỳnh Thị Huyền Trâm- MSSV 725000001
- Trần Thị Hoài - MSSV: 725000818

---

# 2. Công nghệ sử dụng (Tech Stack)

## Frontend

- ReactJS
- Vite
- Axios
- React Router DOM
- React Leaflet
- Leaflet
- Recharts

## Backend

- Node.js
- ExpressJS
- JWT (JSON Web Token)
- bcryptjs
- Multer

## Database

- Microsoft SQL Server

## OCR

- Tesseract.js

## Công cụ phát triển

- Visual Studio Code
- Git
- GitHub

---

# 3. Hướng dẫn cài đặt

## Yêu cầu môi trường

- Node.js (v18 trở lên)
- Microsoft SQL Server
- Git
- Visual Studio Code

---

## Bước 1: Clone dự án

```bash
git clone https://github.com/huyentram17101994-prog/WEB-LHU-2026-Nhom06-RefillNearby.git
```

---

## Bước 2: Cài đặt Backend

Di chuyển vào thư mục backend

```bash
cd backend
```

Cài đặt thư viện

```bash
npm install
```

---

## Bước 3: Cấu hình biến môi trường (.env)

Tạo file `.env` trong thư mục **backend**

Ví dụ:

```env
PORT=5000

DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=RefillNearby

JWT_SECRET=your_secret_key
```

---

## Bước 4: Chạy Backend

```bash
npm run dev
```

hoặc

```bash
npm start
```

Backend sẽ chạy tại:

```
http://localhost:5000
```

---

## Bước 5: Cài đặt Frontend

Di chuyển vào thư mục frontend

```bash
cd frontend
```

Cài đặt thư viện

```bash
npm install
```

---

## Bước 6: Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại:

```
http://localhost:5173
```

---

# 4. Chức năng chính của hệ thống

- Đăng ký và đăng nhập người dùng.
- Xác thực người dùng bằng JWT.
- Phân quyền Admin, Chủ trạm và Người dùng.
- Tìm kiếm trạm refill theo tên.
- Tìm kiếm các trạm refill gần vị trí người dùng.
- Hiển thị bản đồ các trạm refill.
- Chỉ đường đến trạm refill.
- Quản lý sản phẩm refill của từng trạm.
- Yêu thích trạm refill và sản phẩm.
- Đánh giá và nhận xét trạm refill.
- Phân tích hóa đơn bằng OCR (Tesseract.js).
- Quản lý lịch sử refill và thống kê lượng nhựa tiết kiệm.
- Chủ trạm quản lý trạm và sản phẩm.
- Quản trị viên quản lý người dùng, trạm refill, sản phẩm và danh mục.

---

# 5. Cấu trúc Repository

```
WEB_LHU_2026_Nhom06_RefillNearby
│
├── backend
├── frontend
├── docs
├── README.md
```

---

# 6. Ghi chú

- Hệ thống sử dụng **Tesseract.js** để nhận diện văn bản từ hóa đơn mua hàng (OCR).
- Dữ liệu sản phẩm sau khi nhận diện sẽ được đối chiếu với cơ sở dữ liệu để gợi ý các trạm refill phù hợp.
- Bản đồ của hệ thống được xây dựng bằng **React Leaflet** kết hợp dữ liệu bản đồ **CartoDB Voyager**.