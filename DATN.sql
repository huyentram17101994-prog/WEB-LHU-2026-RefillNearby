
CREATE DATABASE RefillNearby;
GO

USE RefillNearby;
GO

-- =========================================
-- TABLE: USERS

CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL,
    avatar VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE()
);

-- =========================================
-- TABLE: CATEGORIES

CREATE TABLE categories (
    category_id INT PRIMARY KEY IDENTITY(1,1),
    category_name NVARCHAR(100) NOT NULL
);

-- =========================================
-- TABLE: REFILL_STATIONS

CREATE TABLE refill_stations (
    station_id INT PRIMARY KEY IDENTITY(1,1),
    owner_id INT NOT NULL,
    station_name NVARCHAR(100) NOT NULL,
    address NVARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    description NVARCHAR(500),
    image_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active',

    CONSTRAINT FK_station_owner
    FOREIGN KEY (owner_id)
    REFERENCES users(user_id)
);

-- =========================================
-- TABLE: PRODUCTS

CREATE TABLE products (
    product_id INT PRIMARY KEY IDENTITY(1,1),
    station_id INT NOT NULL,
    category_id INT NOT NULL,
    product_name NVARCHAR(100) NOT NULL,
    brand NVARCHAR(100),
    price DECIMAL(10,2) CHECK(price > 0),
    stock_status BIT DEFAULT 1,
    description NVARCHAR(500),

    CONSTRAINT FK_product_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id),

    CONSTRAINT FK_product_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
);
ALTER TABLE products
DROP COLUMN category

ALTER TABLE products
ADD image_url VARCHAR(255);
-- =========================================
-- TABLE: REVIEWS ( danh gia )

CREATE TABLE reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_review_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id),

    CONSTRAINT FK_review_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id)
);

ALTER TABLE reviews
ADD product_id INT;

ALTER TABLE reviews
ADD CONSTRAINT FK_review_product
FOREIGN KEY (product_id)
REFERENCES products(product_id);

select * from [dbo].[reviews]
-- =========================================
-- TABLE: INVOICES
CREATE TABLE invoices (
    invoice_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    extracted_text NVARCHAR(MAX),
    upload_date DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_invoice_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);

-- =========================================
-- TABLE: FAVORITES ( Luu tram yeu thich )

CREATE TABLE favorites (

    favorite_id INT PRIMARY KEY IDENTITY(1,1),

    user_id INT NOT NULL,

    station_id INT NOT NULL,

    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_favorite_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id),

    CONSTRAINT FK_favorite_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id)

);
select * from [dbo].[favorites]
-- =========================================
-- TABLE: PLASTIC_SAVINGS ( thong ke bv mt )
CREATE TABLE plastic_savings (
    saving_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    amount_saved FLOAT CHECK(amount_saved >= 0),
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_saving_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
);
-- =========================================
-- Tạo table : refill_history ( lịch sử refill)
CREATE TABLE refill_history (

    refill_id INT PRIMARY KEY IDENTITY(1,1),

    user_id INT NOT NULL,

    station_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity FLOAT NOT NULL,

    refill_date DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_refill_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id),

    CONSTRAINT FK_refill_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id),

    CONSTRAINT FK_refill_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id)

);
-- =========================================
-- Thêm dl cho bảng USERS

INSERT INTO users(full_name, email, password, phone, role)
VALUES
(N'Nguyễn Văn A', 'admin@gmail.com', '123456', '0900000001', 'admin'),
(N'Trần Thị B', 'owner@gmail.com', '123456', '0900000002', 'store_owner'),
(N'Lê Văn C', 'user@gmail.com', '123456', '0900000003', 'user');
select * from [dbo].[users]

-- =========================================
-- Thêm dl cho bảng CATEGORIES
INSERT INTO categories(category_name)
VALUES
(N'Nước giặt'),
(N'Dầu gội'),
(N'Dầu xả'),
(N'Nước lau nhà'),
(N'Nước rửa chén');
select * from [dbo].[categories]

-- =========================================
-- Thêm dl cho bảng REFILL STATIONS

INSERT INTO refill_stations(owner_id, station_name, address, latitude, longitude, open_time, close_time, description)
VALUES(2, N'Eco Refill Bình Thuận', N'123 Trần Hưng Đạo, Phan Thiết, Bình Thuận',10.9301, 108.1050,'07:30', '20:30',N'Trạm refill sản phẩm hữu cơ và thân thiện môi trường'),

(2, N'Green Life Refill', N'45 Nguyễn Tất Thành, Phan Thiết, Bình Thuận',10.9275, 108.1008,'08:00', '21:00',N'Cung cấp các sản phẩm refill sinh hoạt gia đình'),

(2, N'Nature Refill Store', N'88 Lê Lợi, Lagi, Bình Thuận',10.6702, 107.9915,'08:00', '19:30',N'Trạm refill với sản phẩm thiên nhiên an toàn'),

(2, N'Happy Refill Station', N'15 Võ Văn Kiệt, Hàm Tiến, Bình Thuận',10.9508, 108.2821,'09:00', '22:00',N'Chuyên refill dầu gội, nước giặt và nước rửa chén'),

(2, N'Green Earth Refill', N'200 Tôn Đức Thắng, Phan Thiết, Bình Thuận',10.9354, 108.1152,'07:00', '21:30',N'Trạm refill bảo vệ môi trường và giảm rác thải nhựa');

UPDATE refill_stations
SET owner_id = 2
WHERE station_id IN (1,2,3);

UPDATE refill_stations
SET owner_id = 5
WHERE station_id IN (4,5);

UPDATE refill_stations
SET image_url = '/uploads/stations/Eco.png'
WHERE station_name = 'Eco Refill Bình Thuận';
UPDATE refill_stations
SET image_url = '/uploads/stations/Life.png'
WHERE station_name = 'Green Life Refill';
UPDATE refill_stations
SET image_url = '/uploads/stations/nature.png'
WHERE station_name = 'Nature Refill Store';
UPDATE refill_stations
SET image_url = '/uploads/stations/happy.png'
WHERE station_name = 'Happy Refill Station';
UPDATE refill_stations
SET image_url = '/uploads/stations/Earth.png'
WHERE station_name = 'Green Earth Refill';

SELECT station_id,
       station_name,
       image_url
FROM refill_stations
WHERE station_name LIKE '%Eco%';
UPDATE refill_stations
SET image_url = '/uploads/stations/Eco.png'
WHERE station_id = 1;
select * from [dbo].[refill_stations]

-- =========================================
-- Thêm dl cho bảng PRODUCTS
INSERT INTO products (station_id, category_id, product_name, brand, price, stock_status, description)
VALUES(1, 1, N'Nước giặt sinh học Bio Clean', N'Bio Clean',45000, 1,N'Nước giặt thân thiện môi trường'),

(2, 1, N'Nước giặt thiên nhiên Green Wash', N'Green Wash',50000, 1,N'Sản phẩm ít bọt, an toàn da tay'),

(1, 2, N'Dầu gội bưởi thiên nhiên', N'Green Life',55000, 1,N'Dầu gội chiết xuất bưởi giảm gãy rụng'),

(3, 2, N'Dầu gội hữu cơ Eco Hair', N'Eco Hair',60000, 0,N'Dầu gội organic dành cho tóc khô'),

(2, 3, N'Dầu xả mềm tóc Nature Care', N'Nature Care',65000, 1,N'Dầu xả dưỡng tóc từ tinh dầu thiên nhiên'),

(4, 3, N'Dầu xả thảo mộc Green Herbal', N'Green Herbal',70000, 1,N'Dầu xả giúp tóc mềm mượt'),

(3, 4, N'Nước lau nhà tinh dầu sả', N'Fresh Home',40000, 1,N'Nước lau nhà khử mùi tự nhiên'),

(5, 4, N'Nước lau nhà Eco Floor', N'Eco Floor',42000, 1,N'Làm sạch sàn và thân thiện môi trường'),

(1, 5, N'Nước rửa chén hữu cơ Bio Dish', N'Bio Dish',35000, 1,N'Nước rửa chén an toàn cho da tay'),

(4, 5, N'Nước rửa chén chanh sả', N'Clean Natural',38000, 0,N'Nước rửa chén chiết xuất thiên nhiên');

UPDATE products
SET image_url = '/uploads/products/nuoc-giat-sinh-hoc.jpg'
WHERE product_id = 1;

UPDATE products
SET image_url = '/uploads/products/thien-nhien.jpg'
WHERE product_id = 2;

UPDATE products
SET image_url = '/uploads/products/dau-goi-buoi.jpg'
WHERE product_id = 3;

UPDATE products
SET image_url = '/uploads/products/dau-goi-huu-co.webp'
WHERE product_id = 4;

UPDATE products
SET image_url = '/uploads/products/dau xa tu nhien.jpg'
WHERE product_id = 5;

UPDATE products
SET image_url = '/uploads/products/dau xa thao moc.jpg'
WHERE product_id = 6;

UPDATE products
SET image_url = '/uploads/products/nuoc-lau-san-tinh-dau-sa-.jpg'
WHERE product_id = 7;

UPDATE products
SET image_url = '/uploads/products/nuoc lau nha eco.jpg'
WHERE product_id = 8;

UPDATE products
SET image_url = '/uploads/products/nuoc rua chen hc.jpg'
WHERE product_id = 9;

UPDATE products
SET image_url = '/uploads/products/nrc chanh sa.jpeg'
WHERE product_id = 10;


select * from [dbo].[products]
-- =========================================
--Thêm dl cho bảng REVIEWS

INSERT INTO reviews(user_id, station_id, rating, comment)
VALUES(3, 1, 5,N'Sản phẩm tốt, giá hợp lý và nhân viên thân thiện'),

(3, 2, 4,N'Trạm refill sạch sẽ, nhiều sản phẩm để lựa chọn'),

(3, 3, 5,N'Dầu gội thiên nhiên rất thơm và chất lượng'),

(3, 4, 3,N'Giá hơi cao nhưng sản phẩm khá ổn'),

(3, 5, 4,N'Vị trí dễ tìm, phục vụ nhanh chóng');

select * from [dbo].[reviews]

-- =========================================
-- Thêm dl cho bảng INVOICES

INSERT INTO invoices (user_id, image_url, extracted_text)
VALUES(3, 'invoice_01.jpg',N'Nước giặt Bio Clean, Dầu gội bưởi thiên nhiên'),

(3, 'invoice_02.jpg',N'Nước rửa chén hữu cơ Bio Dish, Nước lau nhà tinh dầu sả'),

(3, 'invoice_03.jpg',N'Dầu xả mềm tóc Nature Care, Dầu gội Eco Hair');

select * from [dbo].[invoices]


-- =========================================
-- Thêm dl bảng PLASTIC SAVINGS

INSERT INTO plastic_savings
(user_id, amount_saved)
VALUES
(3, 2.5);

select * from [dbo].[plastic_savings]

-- =========================================
-- Thêm dl bảng FOVARITES

INSERT INTO favorites
(
    user_id,
    station_id
)
VALUES

(1, 2),

(1, 3),

(2, 1);
SELECT * FROM [dbo].[favorites]
SELECT * FROM [dbo].[invoices]
SELECT * FROM [dbo].[refill_stations]
SELECT * FROM [dbo].[users]
SELECT * FROM [dbo].[reviews]
SELECT * FROM [dbo].[categories]
SELECT * FROM [dbo].[plastic_savings]
SELECT * FROM [dbo].[products]
SELECT * FROM refill_history




