
-- TABLE: USERS

CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) NOT NULL,
    avatar VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    badge NVARCHAR(50),
    status NVARCHAR(20) DEFAULT 'active'
);

select * from users
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
    image_url VARCHAR(255),

    CONSTRAINT FK_product_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id),

    CONSTRAINT FK_product_category
    FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
);


-- =========================================
-- TABLE: REVIEWS ( danh gia )

CREATE TABLE reviews (
    review_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    product_id INT,
    owner_reply NVARCHAR(1000) NULL,
    replied_at DATETIME NULL;

    CONSTRAINT FK_review_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id),

    CONSTRAINT FK_review_station
    FOREIGN KEY (station_id)
    REFERENCES refill_stations(station_id)

    CONSTRAINT FK_review_product
    FOREIGN KEY (product_id)
    REFERENCES products(product_id);
);
SELECT
review_id,
owner_reply
FROM reviews
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
--============================
--Tạo bảng favorite_products
CREATE TABLE favorite_products (
    favorite_product_id INT IDENTITY(1,1) PRIMARY KEY,

    user_id INT NOT NULL,

    product_id INT NOT NULL,

    created_at DATETIME DEFAULT GETDATE(),

    FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);
SELECT TOP 1 *
FROM favorite_products;
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
SELECT TOP 1 *
FROM refill_history;
--=====Tạo bảng đk nhận thông báo==============
CREATE TABLE product_notification_requests
(
    request_id INT IDENTITY(1,1) PRIMARY KEY,

    user_id INT NOT NULL,

    station_id INT NOT NULL,

    product_id INT NOT NULL,

    status NVARCHAR(20) DEFAULT 'waiting',

    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_notify_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id),

    CONSTRAINT FK_notify_station
        FOREIGN KEY(station_id)
        REFERENCES refill_stations(station_id),

    CONSTRAINT FK_notify_product
        FOREIGN KEY(product_id)
        REFERENCES products(product_id)
);

--========Tạo bảng notifications=============
CREATE TABLE notifications
(
    notification_id INT IDENTITY(1,1) PRIMARY KEY,

    user_id INT NOT NULL,

    title NVARCHAR(255) NOT NULL,

    content NVARCHAR(MAX) NOT NULL,

    is_read BIT DEFAULT 0,

    created_at DATETIME DEFAULT GETDATE(),
    station_id INT NULL,

    product_id INT NULL,

    product_name NVARCHAR(255) NULL,

    station_name NVARCHAR(255) NULL,

    station_address NVARCHAR(255) NULL,

    open_time TIME NULL,

    close_time TIME NULL,

    image_url NVARCHAR(500) NULL,

    CONSTRAINT FK_notification_user
        FOREIGN KEY(user_id)
        REFERENCES users(user_id)
);


SELECT * FROM vw_StationRatings
SELECT * FROM [dbo].[favorites]
SELECT * FROM [dbo].[favorite_products]
SELECT * FROM [dbo].[invoices]
SELECT * FROM [dbo].[refill_stations]
SELECT * FROM [dbo].[users]
SELECT * FROM [dbo].[reviews]
SELECT * FROM [dbo].[categories]
SELECT * FROM [dbo].[plastic_savings]
SELECT * FROM [dbo].[products]
SELECT * FROM refill_history
SELECT * FROM [dbo].[notifications]
SELECT * FROM [dbo].[product_notification_requests]






