import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function AdminReviewsPage() {

    const navigate = useNavigate();
    const [ratingFilter, setRatingFilter] = useState('');
   
    const [reviews, setReviews] = useState([]);

    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const MAX_DAYS = 30;

const daysBetween = (start, end) => {

    const diff =
        new Date(end) - new Date(start);

    return diff / (1000 * 60 * 60 * 24);

};

const [toDate, setToDate] = useState('');

    useEffect(() => {

        loadReviews();

    }, []);

    const loadReviews = async () => {

        try {

            const res =
                await api.get('/admin/reviews');
            
            setReviews(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteReview = async (id) => {

        if (!window.confirm('Xóa đánh giá này?')) {

            return;

        }

        try {

            await api.delete(
                `/admin/reviews/${id}`
            );

            loadReviews();

        } catch (error) {

            console.log(error);

        }

    };

   const filteredReviews = reviews.filter(review => {
const reviewDate = new Date(review.created_at);

const from = fromDate
    ? new Date(fromDate)
    : null;

const to = toDate
    ? new Date(toDate)
    : null;

let matchDate = true;

if (fromDate && toDate) {

    const diff = daysBetween(fromDate, toDate);

    if (diff < 0) {
        matchDate = false;
    }
    else if (diff > MAX_DAYS) {
        matchDate = false;
    }
    else {

        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);

        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);

        matchDate =
            reviewDate >= from &&
            reviewDate <= to;
    }

}
else if (fromDate) {

    const from = new Date(fromDate);
    from.setHours(0, 0, 0, 0);

    matchDate = reviewDate >= from;

}
else if (toDate) {

    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);

    matchDate = reviewDate <= to;

}

const matchSearch =

    review.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    review.station_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    review.owner_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    review.comment
        ?.toLowerCase()
        .includes(search.toLowerCase());

const matchRating =

    ratingFilter === ""

    ||

    review.rating === Number(ratingFilter);
    return (
    matchRating &&
    matchSearch &&
    matchDate
);
})
const hasFilter =
    search ||
    ratingFilter ||
    fromDate ||
    toDate;
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
 <button
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center gap-2
                        mb-8
                        px-5 py-3
                        bg-white
                        rounded-full
                        shadow-md
                        hover:shadow-lg
                        hover:bg-gray-50
                        transition
                        text-gray-700
                        font-semibold
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>
            <div className="max-w-8xl mx-auto">

               

                <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                    ⭐ Quản lý đánh giá

                </h1>

             <div
    className="
        flex
        items-end
        gap-4
        mb-6
    "
>
                     <div className="flex-1">
                    <input
                        type="text"
                        placeholder="🔍 Tìm người dùng/ trạm/ chủ sở hữu/ nội dung..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
                        "
                    />
                    </div>
                    
                    <select
    value={ratingFilter}
    onChange={(e) =>
        setRatingFilter(e.target.value)
    }
    className="
        text-center
        bg-white
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        text-gray-700
        appearance-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-400
        focus:border-green-400
        min-w-[110px]
        "
>
    <option value="">
        Tất cả
    </option>

    <option value="5">
        ⭐ 5 sao
    </option>

    <option value="4">
        ⭐ 4 sao
    </option>

    <option value="3">
        ⭐ 3 sao
    </option>

    <option value="2">
        ⭐ 2 sao
    </option>

    <option value="1">
        ⭐ 1 sao
    </option>

</select>

<div>

        <label className="  block mb-2 font-semibold">

            📅 Từ ngày

        </label>
<input

    type="date"
    value={fromDate}
    onChange={(e) => {
    setFromDate(e.target.value);
}}
    className="
        text-center
        bg-white
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        text-gray-700
        appearance-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-400
        focus:border-green-400
        
    "
/>

</div>
<div>

        <label className="block mb-2 font-semibold">

            📅 Đến ngày

        </label>
<input
    type="date"
    value={toDate}
   onChange={(e) => {
    setToDate(e.target.value);
}}
    className="
        text-center
        bg-white
        border
        border-gray-200
        rounded-2xl
        px-4
        py-3
        shadow-sm
        text-gray-700
        appearance-none
        focus:outline-none
        focus:ring-2
        focus:ring-green-400
        focus:border-green-400
        
    "
/>
</div>
</div>
               {fromDate && toDate && daysBetween(fromDate, toDate) < 0 && (
    <div className="mt-2 rounded-lg bg-red-100 border border-red-300 px-4 py-2 text-red-700 text-sm">
        ⚠️ Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.
    </div>
)}

{fromDate && toDate && daysBetween(fromDate, toDate) > MAX_DAYS && (
    <div className="mt-2 rounded-lg bg-red-100 border border-red-300 px-4 py-2 text-red-700 text-sm">
        ⚠️ Chỉ được lọc tối đa trong khoảng 30 ngày.
    </div>
)}  

                <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-50 text-green-700">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Người dùng
                                </th>

                                <th className="p-4 text-left">
                                    Trạm refill
                                </th>
                                <th className="p-4 text-left">
                                    Chủ sở hữu
                                </th>
                                <th className="p-4 text-center">
                                    Số sao
                                </th>

                                <th className="p-4 text-left">
                                    Nội dung
                                </th>

                                <th className="p-4 text-left">
                                    Ngày tạo
                                </th>

                                <th className="p-4 text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>
                        {filteredReviews.length > 0 ? (

                            filteredReviews.map(review => (

                                <tr
                                    key={review.review_id}
                                    className="
                                        border-b
                                        border-gray-200
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    <td className="p-4">
                                        {review.review_id}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {review.full_name}
                                    </td>

                                    <td className="p-4">
                                        {review.station_name}
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">
                                         {review.owner_name || (
                                            <span className="text-gray-400 italic">
                                               Chưa có
                                            </span>
                                          )}
                                    </td>
                                       
                                    <td className="p-4 text-center">

                                        <span className="
                                            bg-yellow-100
                                            text-yellow-700
                                            px-3 py-1
                                            rounded-full
                                            font-semibold
                                        ">
                                            ⭐ {review.rating}
                                        </span>

                                    </td>

                                    <td className="p-4 max-w-md">

    <div className="space-y-2">

        <div>
            {review.comment}
        </div>

        <div className="border-t pt-2">

            <span className="font-semibold text-green-600">
                💬 Chủ trạm:
            </span>

            <div className="text-gray-600">

                {review.owner_reply || (
                    <span className="italic text-gray-400">
                        Chưa phản hồi
                    </span>
                )}

            </div>

        </div>

    </div>

</td>

                                    <td className="p-4">
                                        {
                                            new Date(
                                                review.created_at
                                            ).toLocaleDateString(
                                                'vi-VN'
                                            )
                                        }
                                    </td>

                                    <td className="p-4 text-center">

                                        <button
                                            onClick={() =>
                                                deleteReview(
                                                    review.review_id
                                                )
                                            }
                                            className="
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                px-4 py-2
                                                rounded-xl
                                                font-semibold
                                            "
                                        >
                                            Xóa
                                        </button>

                                    </td>

                                </tr>

                        
 ))

) : (

    <tr>

        <td
            colSpan="8"
            className="text-center py-10 text-gray-500"
        >

            {hasFilter
                ? "🔍 Không tìm thấy đánh giá nào phù hợp."
                : "📝 Chưa có đánh giá nào."}

        </td>

    </tr>

)}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminReviewsPage;