
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