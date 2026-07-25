--============ Tạo VIEW ===============
CREATE VIEW vw_StationRatings
AS

SELECT

    rs.station_id,

    rs.station_name,

    rs.owner_id,

    AVG(CAST(r.rating AS FLOAT))
        AS averageRating,

    COUNT(r.review_id)
        AS totalReviews

FROM refill_stations rs

LEFT JOIN reviews r
ON rs.station_id = r.station_id

GROUP BY

    rs.station_id,

    rs.station_name,

    rs.owner_id

CREATE VIEW vw_UserLeaderboard
AS

SELECT

    u.user_id,

    u.full_name,

    u.badge,

    ISNULL(
        SUM(rh.quantity),
        0
    ) AS totalRefill

FROM users u

LEFT JOIN refill_history rh
ON u.user_id = rh.user_id

GROUP BY

    u.user_id,

    u.full_name,

    u.badge
SELECT *
FROM vw_UserLeaderboard
ORDER BY totalRefill DESC

--======== Tạo Stored Procedure=====================
CREATE PROCEDURE sp_GetAdminDashboard
AS
BEGIN

    SELECT

        (SELECT COUNT(*)
         FROM users)
            AS totalUsers,

        (SELECT COUNT(*)
         FROM refill_stations)
            AS totalStations,

        (SELECT COUNT(*)
         FROM products)
            AS totalProducts,

        (SELECT COUNT(*)
         FROM reviews)
            AS totalReviews,

        (SELECT COUNT(*)
         FROM favorites)
            AS totalFavorites,

        (SELECT COUNT(*)
         FROM refill_history)
            AS totalRefills,

        (SELECT ISNULL(
            SUM(quantity),
            0
        )
         FROM refill_history)
            AS totalQuantity

END
-- EXEC sp_GetAdminDashboard
CREATE PROCEDURE sp_UpdateUserBadge
    @UserId INT
AS
BEGIN

    DECLARE @TotalLiters DECIMAL(10,2)

    SELECT
        @TotalLiters = ISNULL(SUM(quantity),0)
    FROM refill_history
    WHERE user_id = @UserId

    DECLARE @Badge NVARCHAR(50)

    SET @Badge =
    CASE
        WHEN @TotalLiters >= 100 THEN N'Bậc Thầy Sinh Thái'
        WHEN @TotalLiters >= 50 THEN N'Anh Hùng Sinh Thái'
        WHEN @TotalLiters >= 10 THEN N'Người bạn Sinh Thái'
        ELSE N'Người dùng mới'
    END

    UPDATE users
    SET badge = @Badge
    WHERE user_id = @UserId

END
EXEC sp_UpdateUserBadge @UserId = 4

--==== Tạo trigger======
CREATE TRIGGER trg_UpdateBadgeAfterRefill
ON refill_history
AFTER INSERT
AS
BEGIN

    DECLARE @UserId INT

    SELECT TOP 1
        @UserId = user_id
    FROM inserted

    EXEC sp_UpdateUserBadge @UserId

END

--========Tạo Stored Procedure sp_CreateNotification

CREATE OR ALTER PROCEDURE sp_CreateNotification
(
    @user_id INT,

    @station_id INT,

    @product_id INT,

    @title NVARCHAR(255),

    @content NVARCHAR(MAX),

    @product_name NVARCHAR(255),

    @station_name NVARCHAR(255),

    @station_address NVARCHAR(255),

    @open_time TIME,

    @close_time TIME,

    @image_url NVARCHAR(500)
)
AS
BEGIN

    SET NOCOUNT ON;

    INSERT INTO notifications
    (
        user_id,

        station_id,

        product_id,

        title,

        content,

        product_name,

        station_name,

        station_address,

        open_time,

        close_time,

        image_url,

        is_read,

        created_at
    )

    VALUES
    (
        @user_id,

        @station_id,

        @product_id,

        @title,

        @content,

        @product_name,

        @station_name,

        @station_address,

        @open_time,

        @close_time,

        @image_url,

        0,

        GETDATE()
    );

END;
--======== T?o Stored Procedure=====================

--Ph?n h?i ?ánh giá
CREATE PROCEDURE sp_ReplyReview

    @ReviewID INT,
    @OwnerReply NVARCHAR(1000)

AS
BEGIN

    SET NOCOUNT ON;

    UPDATE reviews

    SET
        owner_reply = @OwnerReply,
        replied_at = GETDATE()

    WHERE review_id = @ReviewID;

END
GO