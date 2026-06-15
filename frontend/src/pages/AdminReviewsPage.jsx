import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function AdminReviewsPage() {

    const navigate = useNavigate();
    const [ratingFilter, setRatingFilter] = useState('');
   
    const [reviews, setReviews] = useState([]);

    const [search, setSearch] = useState('');

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

    const matchSearch =

        review.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        review.station_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        review.comment
            ?.toLowerCase()
            .includes(search.toLowerCase());

    const matchRating =

        ratingFilter === ''

        ||

        String(review.rating)
            === ratingFilter;

    return matchSearch && matchRating;

});
    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">

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

                <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                    ⭐ Quản lý đánh giá

                </h1>

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Tìm người dùng, trạm hoặc nội dung..."
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
                </div>

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

                            {filteredReviews.map(review => (

                                <tr
                                    key={review.review_id}
                                    className="
                                        border-b
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
                                        {review.comment}
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
                                            🗑 Xóa
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminReviewsPage;