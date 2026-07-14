import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import useFavorite from "../hooks/useFavorite";

function StationDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [station, setStation] = useState(null);

    const [products, setProducts] = useState([]);

    const [reviews, setReviews] = useState([]);

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState('');

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const {
    
        toggleFavorite,
    
        isFavorite
    
    } = useFavorite("stations");

    // ================= STATION DETAIL =================

    const fetchStationDetail = async () => {

        try {

            const response = await api.get(
                `/stations/${id}`
            );

            setStation(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    // ================= PRODUCTS =================

    const fetchProducts = async () => {

        try {

            const response = await api.get(
                `/products/station/${id}`
            );

            setProducts(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    // ================= REVIEWS =================

    const fetchReviews = async () => {

        try {

            const response = await api.get(
                `/reviews/station/${id}`
            );
            console.log(response.data);
            setReviews(response.data);

        } catch (error) {

            console.log(error);

        }

    };



    // ================= CREATE REVIEW =================

    const createReview = async () => {

    try {

        const token = localStorage.getItem('token');

        await api.post(
            '/reviews',
            {
                station_id: id,
                product_id: selectedProduct,
                rating,
                comment
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // CREATE REFILL HISTORY

        await api.post(
            '/refill-history',
            {
                station_id: id,
                product_id: selectedProduct,
                quantity
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert('Đánh giá thành công ⭐');

        setComment('');

        setRating(5);

        setSelectedProduct('');

        setQuantity('');

        fetchReviews();

    } catch (error) {

        console.log(error);

        alert('Đánh giá thất bại');

    }

};


    // ================= AVERAGE RATING =================

    const averageRating = reviews.length > 0
        ? (
            reviews.reduce(
                (total, review) => total + review.rating,
                0
            ) / reviews.length
        ).toFixed(1)
        : '0.0';



    // ================= USE EFFECT =================

    useEffect(() => {

        fetchStationDetail();

        fetchProducts();

        fetchReviews();

    }, []);




    if (!station) {

        return (

            <div className="text-center mt-20 text-3xl">

                Loading...

            </div>

        );

    }




    return (

        <div className="ax-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
 <button
                    onClick={() => navigate(-1)}
                    className="
                        w-fit
                        flex items-center gap-2
                        mb-6
                        px-5 py-3
                        bg-white
                        rounded-full
                        shadow-md
                        hover:bg-gray-50
                        hover:shadow-lg
                        transition-all duration-200
                        text-gray-700
                        font-semibold
                    "
                >

                    <IoChevronBack size={22} />

                    Quay lại

                </button>
            <div className="max-w-5xl mx-auto">




                {/* BACK BUTTON */}

               





                {/* MAIN CARD */}

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">




                    {/* IMAGE */}
                    <div className="relative">

                    <img
                        src={`http://localhost:5000${station.image_url}`}
    alt={station.station_name}
                        className="w-full h-[550px] object-cover"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-black/20"></div>

                                {/* FAVORITE */}

                                <button
                                    onClick={() =>
                                        toggleFavorite(station.station_id)
                                    }
                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full w-12 h-12 text-2xl hover:scale-110 transition"
                                >

                                    {isFavorite(station.station_id) ? '❤️' : '🤍'}

                                </button>

                                  </div>


                    {/* CONTENT */}

                    <div className="p-8">

                        <h1 className="text-5xl font-bold mb-5">

                            {station.station_name}

                        </h1>





                        <p className="text-xl text-gray-600 mb-4">

                            📍Địa chỉ:  {station.address}

                        </p>





                        <p className="text-lg text-green-600 mb-6">

                            🕒 Giờ mở cửa: {
                                station.open_time.replace(':', 'h')
                            }

                            {' - '}

                            {
                                station.close_time.replace(':', 'h')
                            }

                        </p>





                        <p className="text-lg leading-8 text-gray-700">

                            {station.description}

                        </p>





                        {/* PRODUCTS */}

                        <div className="mt-10">

                            <h2 className="text-3xl font-bold mb-5">

                                Sản phẩm Refill

                            </h2>





                            <div className="space-y-5">

                                {
                                    products.map((product) => (

                                        <div
                                            key={product.product_id}
                                            className="bg-gray-100 rounded-[25px] p-4 flex items-center gap-5 shadow-md hover:shadow-xl transition"
                                        >




                                            {/* PRODUCT IMAGE */}

                                            <img
    src={
        product.image_url
            ? `http://localhost:5000${product.image_url}`
            : '/images/default-product.png'
    }
    alt={product.product_name}
    className="w-28 h-28 object-cover rounded-2xl"
/>




                                            {/* PRODUCT CONTENT */}

                                            <div className="flex-1">

                                                <h3 className="text-2xl font-bold text-gray-800 mb-3">

                                                    {product.product_name}

                                                </h3>





                                                <p className="text-xl text-gray-700 mb-2">

                                                    Giá:
                                                    {' '}
                                                    {Number(product.price).toLocaleString('vi-VN')}
                                                    {' '}
                                                    vnđ/lít

                                                </p>





                                                <div className="flex items-center justify-between">

                                                    <p
    className={`text-lg font-semibold ${
        product.stock_status
            ? 'text-green-600'
            : 'text-red-600'
    }`}
>
    {product.stock_status
        ? '● Còn hàng'
        : '● Hết hàng'}
</p>





                                                    <p className="text-lg text-yellow-500 font-semibold">

    ⭐ {

        reviews.filter(
            (review) =>
                Number(review.product_id) === Number(product.product_id)
        ).length > 0

        ?

        (

            reviews
                .filter(
                    (review) =>
                        Number(review.product_id) === Number(product.product_id)
                )
                .reduce(
                    (total, review) =>
                        total + review.rating,
                    0
                )

            /

            reviews.filter(
                (review) =>
                    Number(review.product_id) === Number(product.product_id)
            ).length

        ).toFixed(1)

        : '0.0'
    }

    {' '}
    (

    {
        reviews.filter(
            (review) =>
                Number(review.product_id) === Number(product.product_id)
        ).length
    }

    {' '}
    đánh giá)

</p>

                                                </div>

                                            </div>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>





                        {/* REVIEWS */}

<div className="mt-14">

    <h2 className="text-3xl font-bold mb-6">

        ⭐ Đánh giá

    </h2>


    {/* REVIEW FORM */}

    <div className="bg-gray-100 rounded-[25px] p-6 mb-8">

        {/* PRODUCT */}

        <select
            value={selectedProduct}
            onChange={(e) =>
                setSelectedProduct(Number(e.target.value))
            }
            className="w-full p-4 rounded-2xl mb-4 border"
        >

            <option value="" disabled hidden>

                Chọn sản phẩm đã refill

            </option>

            {
                products.map((product) => (

                    <option
                        key={product.product_id}
                        value={product.product_id}
                    >

                        {product.product_name}

                    </option>

                ))
            }

        </select>


        {/* QUANTITY */}

        <input
            type="number"
            placeholder="Nhập số lượng refill (lít)"
            value={quantity}
            onChange={(e) =>
                setQuantity(e.target.value)
            }
            className="w-full p-4 rounded-2xl mb-4 border"
        />


        {/* RATING */}

        <select
            value={rating}
            onChange={(e) =>
                setRating(Number(e.target.value))
            }
            className="w-full p-4 rounded-2xl mb-4 border"
        >

            <option value={5}>⭐ 5 Sao</option>

            <option value={4}>⭐ 4 Sao</option>

            <option value={3}>⭐ 3 Sao</option>

            <option value={2}>⭐ 2 Sao</option>

            <option value={1}>⭐ 1 Sao</option>

        </select>


        {/* COMMENT */}

        <textarea
            placeholder="Chia sẻ trải nghiệm của bạn..."
            value={comment}
            onChange={(e) =>
                setComment(e.target.value)
            }
            className="w-full p-4 rounded-2xl border mb-4 h-32"
        />


        {/* BUTTON */}

        <button
            onClick={createReview}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition"
        >

            Gửi đánh giá

        </button>

    </div>


    {/* REVIEW LIST */}

    <div className="space-y-5">

        {
            reviews.map((review) => (

                <div
                    key={review.review_id}
                    className="bg-white border rounded-[25px] p-6 shadow-md"
                >

                    <div className="flex justify-between items-center mb-3">

                        {/* LEFT */}

                        <div>

                            <h3 className="text-2xl font-bold">

                                {review.full_name}

                            </h3>

                            <p className="text-green-600 font-semibold">

                                🧴 {review.product_name}

                            </p>

                        </div>


                        {/* RIGHT */}

                        <p className="text-yellow-500 text-xl font-bold">

                            {'⭐'.repeat(review.rating)}

                        </p>

                    </div>


                    {/* COMMENT */}

                    <p className="text-gray-700 text-lg leading-7">

                        {review.comment}

                    </p>
                    <span className="text-xs text-gray-500">
                    {review.created_at}
                </span>
               {
    review.owner_reply && (

        <div className="mt-4 ml-8 rounded-2xl bg-green-50 border-l-4 border-green-500 p-4">

            <div className="flex justify-between">

                <span className="font-bold text-green-700">
                    🏪 Chủ trạm phản hồi
                </span>

                <span className="text-xs text-gray-500">
                    {review.replied_at}
                </span>

            </div>

            <div className="mt-2 text-gray-700 whitespace-pre-line">

                {review.owner_reply}

            </div>

        </div>

    )
}
                </div>

            ))
        }

    </div>

</div>
                        </div>

                    </div>

                </div>

            </div>

    );

}

export default StationDetailPage;