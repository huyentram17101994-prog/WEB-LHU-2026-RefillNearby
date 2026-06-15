import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
function OwnerReviewsPage() {
    const navigate = useNavigate();
const [ratingFilter, setRatingFilter] = useState('');
const [search, setSearch] = useState('');
const [dashboard, setDashboard] = useState({});
useEffect(() => {

    loadReviews();

}, []);
const loadReviews = async () => {

    try {

        const res =
            await api.get('/owner/dashboard');

        setDashboard(
            res.data
        );

    } catch (error) {

        console.log(error);

    }

};
const reviewsByStation =
    dashboard.reviews?.reduce((acc, review) => {

        const station =
            review.station_name;

        if (!acc[station]) {

            acc[station] = [];

        }

        acc[station].push(review);

        return acc;

    }, {}) || {};
    const stationRatingsMap = {};

dashboard.stationRatings?.forEach((station) => {

    stationRatingsMap[
        station.station_name
    ] = station;

});

return (

<div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-6xl mx-auto">
<button
    onClick={() => navigate('/owner')}
    className="
        flex items-center gap-2
        mb-8
        px-5 py-3
        bg-white
        rounded-full
        shadow-md
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
    <div className="space-y-4">

        {Object.entries(reviewsByStation).length > 0 ? (

    Object.entries(reviewsByStation)
.filter(([stationName, reviews]) => {

    return reviews.some(review => {

        const matchRating =

            ratingFilter === ''

            ||

            review.rating === Number(ratingFilter);

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

        return matchRating && matchSearch;

    });

})
.map(

        ([stationName, reviews]) => (

            <div
                key={stationName}
                className="mb-8"
            >

                <div className="mb-3">

    <h3 className="text-xl font-bold text-green-700">

        🏪 {stationName}

    </h3>

    <p className="text-yellow-600 font-semibold">

        ⭐ {
            Number(
                stationRatingsMap[stationName]
                    ?.averageRating || 0
            ).toFixed(1)
        }

        ({stationRatingsMap[stationName]
            ?.totalReviews || 0} đánh giá)

    </p>

</div>

                <div className="space-y-3">
{reviews
.filter(review => {

    const matchRating =

        ratingFilter === ''

        ||

        review.rating === Number(ratingFilter);

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

    return matchRating && matchSearch;

})
.map((review) => (
                        <div
                            key={review.review_id}
                            className="border rounded-xl p-4 bg-gray-50"
                        >

                            <div className="font-semibold">

                                👤 {review.full_name}

                            </div>

                            <div className="text-yellow-500 font-bold">

                                ⭐ {review.rating}/5

                            </div>

                            <div className="text-gray-700 mt-2">

                                {review.comment}

                            </div>

                            <div className="text-sm text-gray-500 mt-2">

                                📦 {review.product_name}

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        )

    )

) : (

    <p>Chưa có đánh giá nào.</p>

)}
    </div>

</div>
     </div>

);
}
export default OwnerReviewsPage;