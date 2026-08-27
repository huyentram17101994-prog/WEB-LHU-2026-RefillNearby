import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import api, { getImageUrl } from "../services/api";
import useFavorite from "../hooks/useFavorite";

function StationDetailPage() {

    const { id } = useParams();

    const navigate = useNavigate();
    
    const {
        toggleFavorite,
        isFavorite
    } = useFavorite("stations");

    // =========================
    // STATION
    // =========================

    const [station, setStation] = useState(null);

    // =========================
    // PRODUCTS
    // =========================

    const [products, setProducts] = useState([]);

    const [productPage, setProductPage] = useState(1);

    const [productTotalPages, setProductTotalPages] = useState(1);

    const [productSearch, setProductSearch] = useState("");

    const [productTotal, setProductTotal] = useState(0);
    // =========================
    // REVIEWS
    // =========================

    const [reviews, setReviews] = useState([]);

    const [reviewPage, setReviewPage] = useState(1);

    const [reviewTotalPages, setReviewTotalPages] = useState(1);

    const [ratingFilter, setRatingFilter] = useState(0);

    // =========================
    // CREATE REVIEW
    // =========================

    const [rating, setRating] = useState(5);

    const [comment, setComment] = useState("");

    const [selectedProduct, setSelectedProduct] = useState("");

    const [quantity, setQuantity] = useState("");

    const [reviewTotal, setReviewTotal] = useState(0);

    // =========================
    // FETCH STATION
    // =========================

    const fetchStationDetail = async () => {

        try {

            const response = await api.get(`/stations/${id}`);

            setStation(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async (

        page = productPage,

        keyword = productSearch

    ) => {

        try {

            const response = await api.get(

                `/products/station/${id}`,

                {

                    params: {

                        page,

                        limit: 10,

                        search: keyword

                    }

                }

            );

            setProducts(response.data.data);

setProductTotalPages(response.data.totalPages);

setProductTotal(response.data.total);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // FETCH REVIEWS
    // =========================

    const fetchReviews = async (

        page = reviewPage,

        star = ratingFilter

    ) => {

        try {

            const response = await api.get(

                `/reviews/station/${id}`,

                {

                    params: {

                        page,

                        limit: 5,

                        rating: star

                    }

                }

            );

            setReviews(response.data.data);

            setReviewTotalPages(response.data.totalPages);
            setReviewTotal(response.data.total);

        } catch (error) {

            console.log(error);

        }

    };

    // =========================
    // CREATE REVIEW
    // =========================

    const createReview = async () => {
        const quantityNumber = Number(quantity);

if (Number.isNaN(quantityNumber) || quantityNumber <= 0) {
    alert("Số lượng refill phải lớn hơn 0.");
    return;
}
        try {

            const token = localStorage.getItem("token");

            await api.post(

                "/reviews",

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

            await api.post(

                "/refill-history",

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

            alert("Đánh giá thành công");

            setComment("");

            setRating(5);

            setSelectedProduct("");

            setQuantity("");

            fetchReviews();

        } catch (error) {

            console.log(error);

            alert("Đánh giá thất bại");

        }

    };

    // =========================
    // AVERAGE
    // =========================

    const averageRating = useMemo(() => {

        if (!station) return "0.0";

        return Number(

            station.average_rating || 0

        ).toFixed(1);

    }, [station]);


    // USE EFFECT
    // =========================

    useEffect(() => {

        fetchStationDetail();

    }, []);

    useEffect(() => {

        fetchProducts(

            productPage,

            productSearch

        );

    }, [productPage]);

    useEffect(() => {

        fetchReviews(

            reviewPage,

            ratingFilter

        );

    }, [reviewPage, ratingFilter]);

    if (!station) {

        return (

            <div className="flex justify-center items-center min-h-screen text-2xl">

                Đang tải dữ liệu...

            </div>

        );

    }

    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
    <button
    onClick={() => navigate(-1)}
    className="
        flex items-center gap-2
        mb-8
        ml-2
        px-5 py-3
        bg-white
        rounded-full
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50
        transition-all
        duration-200
        text-base
        font-semibold
        text-gray-700
    "
>
    <IoChevronBack size={22} />
    Quay lại
</button>
            <div className="max-w-6xl mx-auto px-5 py-8">

              
                                {/* ===========================
                    HEADER
                =========================== */}

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">

                    {/* Banner */}

                    <div className="relative">

                        <img

                            src={getImageUrl(station.image_url)}

                            alt={station.station_name}

                            className="w-full h-[420px] object-cover"

                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Favorite */}

                        <button

                            onClick={() => toggleFavorite(station.station_id)}

                            className="absolute top-5 right-5 w-14 h-14 rounded-full bg-white/90 backdrop-blur text-3xl hover:scale-110 transition"

                        >

                            {isFavorite(station.station_id) ? "❤️" : "🤍"}

                        </button>

                        {/* Title */}

                        <div className="absolute bottom-8 left-8 text-white">

                            <h1 className="text-5xl font-bold mb-4">

                                {station.station_name}

                            </h1>

                            <div className="flex flex-wrap gap-6 text-xl font-semibold">

                                <span>

                                    ⭐ {averageRating}

                                </span>

                                <span>

                                    💬 {station.review_count || 0} đánh giá

                                </span>

                                <span>

                                    📦 {station.product_count || products.length} sản phẩm

                                </span>

                            </div>

                        </div>

                    </div>

                    {/* Info */}

                    <div className="p-8">

                        <div className="grid lg:grid-cols-[2fr_1fr] gap-10">

                            <div>

                                

                                <div className="space-y-5 text-lg">
                                    <div className="flex items-center gap-3 mt-1">
                                    <p>

                                        <strong>📍 Địa chỉ:</strong>

                                        {" "}

                                        {station.address}

                                    </p>
                                    <div className="space-y-4">

                                <a

                                    href={`https://www.google.com/maps?q=${station.latitude},${station.longitude}`}

                                    target="_blank"

                                    rel="noreferrer"

                                    className="block w-35 text-center bg-blue-600 hover:bg-blue-700 transition text-base text-white py-2 rounded-xl font-semibold"

                                >

                                    🧭 Chỉ đường

                                </a>

                            </div>
                            </div>
                                    <p>

                                        <strong>📞 Điện thoại:</strong>

                                        {" "}

                                        {station.phone}

                                    </p>

                                    <p>

                                        <strong>🕒 Giờ mở cửa:</strong>

                                        {" "}

                                        {station.open_time}

                                        {" - "}

                                        {station.close_time}

                                    </p>

                                    <p>

                                        <strong>📝 Mô tả:</strong>

                                    </p>

                                    <p className="leading-8 text-gray-700">

                                        {station.description || "Chưa có mô tả."}

                                    </p>

                                </div>

                            </div>

                            {/* Right */}

                            

                        </div>

                    </div>

                </div>

               
                                {/* ===========================
                    DANH SÁCH SẢN PHẨM
                =========================== */}

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                        <div className="flex items-center gap-3 mt-1">
                        <h2 className="text-3xl font-bold text-green-700">

                            Sản phẩm tại trạm

                        </h2>
                        <span className="text-3xl font-bold text-green-700">

                            ({productTotal})

                        </span>
                        </div>
                        <div className="flex gap-3">

                            <input

                                type="text"

                                placeholder="🔍 Tìm sản phẩm..."

                                value={productSearch}

                                onChange={(e) =>

                                    setProductSearch(e.target.value)

                                }

                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        setProductPage(1);

                                        fetchProducts(1, productSearch);

                                    }

                                }}

                                className="w-72 px-3 py-2 rounded-2xl border border-green-500 focus:ring-2 focus:ring-green-500 outline-none"

                            />

                            <button

                                onClick={() => {

                                    setProductPage(1);

                                    fetchProducts(1, productSearch);

                                }}

                                className="px-4 py-2 rounded-2xl bg-green-600 text-white hover:bg-green-700"

                            >

                                Tìm

                            </button>

                            <button

                                onClick={() => {

                                    setProductSearch("");

                                    setProductPage(1);

                                    fetchProducts(1, "");

                                }}

                                className="px-5 py-2 rounded-2xl bg-gray-300 hover:bg-gray-400"

                            >

                                Reset

                            </button>

                        </div>

                    </div>

                    {/* GRID */}

              <div className="grid grid-cols-1 gap-5">

    {
        products.map(product => {
              const productReviews = reviews.filter(
            review =>
                Number(review.product_id) === Number(product.product_id)
        );


        const averageRating = productReviews.length > 0
            ? (
                productReviews.reduce(
                    (sum, review) => sum + review.rating,
                    0
                ) / productReviews.length
            ).toFixed(1)
            : "0.0";


        return (


            <div
                key={product.product_id}
                className="bg-green-50 border border-green-500  rounded-xl overflow-hidden shadow hover:shadow-lg transition flex flex-col md:flex-row"
            >


                {/* Ảnh nhỏ hơn */}
                <img
                    src={getImageUrl(product.image_url)}
                    alt={product.product_name}
                    className="w-full md:w-48 h-32 object-cover border border-green-500"
                />


                <div className="p-3 flex-1">

                
                       <div className="flex items-center gap-3 mt-1">

    {/* Tên sản phẩm */}
    <h3 className="text-xl font-bold">
        {product.product_name}
    </h3>


    {/* Đánh giá */}
    
         <span className="text-lg text-yellow-500 font-semibold">
        ( ⭐{averageRating})
       
    </span>
</div>
                    <div className="flex items-center gap-3 mt-1">

    {/* Giá */}
    <p className="text-green-700 font-bold text-lg">
        {Number(product.price).toLocaleString()} đ
    </p>


    {/* Trạng thái */}
    {
        product.stock_status ?

        (
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                Còn hàng
            </span>
        )

        :

        (
            <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                Hết hàng
            </span>
        )

    }

</div>

                    {
                        product.description &&

                        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {product.description}
                        </p>

                    }

                </div>


            </div>

        );
    })
}

</div>
                    {/* PAGINATION */}

                    {

                        productTotalPages > 1 &&

                        <div className="flex justify-center gap-3 mt-10">

                            <button

                                disabled={productPage === 1}

                                onClick={() =>

                                    setProductPage(productPage - 1)

                                }

                                className="px-5 py-2 rounded-xl bg-gray-200 disabled:opacity-50"

                            >

                                ←

                            </button>

                            {

                                [...Array(productTotalPages)].map((_, index) => (

                                    <button

                                        key={index}

                                        onClick={() =>

                                            setProductPage(index + 1)

                                        }

                                        className={`w-11 h-11 rounded-xl font-bold ${

                                            productPage === index + 1

                                                ? "bg-green-600 text-white"

                                                : "bg-gray-200"

                                        }`}

                                    >

                                        {index + 1}

                                    </button>

                                ))

                            }

                            <button

                                disabled={productPage === productTotalPages}

                                onClick={() =>

                                    setProductPage(productPage + 1)

                                }

                                className="px-5 py-2 rounded-xl bg-gray-200 disabled:opacity-50"

                            >

                                →

                            </button>

                        </div>

                    }

                </div>
                                {/* ===========================
                    ĐÁNH GIÁ
                =========================== */}

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-8">
                         <div className="flex items-center gap-3 mt-1">
                        <h2 className="text-3xl font-bold text-green-700">

                            Đánh giá từ khách hàng

                        </h2>
                        <span className="text-3xl font-bold text-green-700">

                            ({reviewTotal})

                        </span>
                        </div>
                        <select

                            value={ratingFilter}

                            onChange={(e) => {

                                setRatingFilter(Number(e.target.value));

                                setReviewPage(1);

                            }}

                            className="bg-gray-100 border border-gray-500 rounded-xl px-3 py-2 text-center"

                        >

                            <option value={0}>

                                Tất cả

                            </option>

                            <option value={5}>

                                5 ⭐

                            </option>

                            <option value={4}>

                                4 ⭐

                            </option>

                            <option value={3}>

                                3 ⭐

                            </option>

                            <option value={2}>

                                2 ⭐

                            </option>

                            <option value={1}>

                                1 ⭐

                            </option>

                        </select>

                    </div>

                    {/* REVIEW LIST */}

                    <div className="space-y-6">

                        {

                            reviews.length === 0 ?

                            (

                                <div className="text-center text-gray-500 py-12">

                                    Chưa có đánh giá nào.

                                </div>

                            )

                            :

                            (

                                reviews.map(review => (

                                    <div

                                        key={review.review_id}

                                        className="border border-green-500 bg-green-50 rounded-2xl p-4"

                                    >

                                        <div className="flex justify-between ">

                                            <div>

                                                <h3 className="font-bold text-xl">

                                                    {review.full_name}

                                                </h3>

                                                <div className="text-yellow-500 text-lg mt-1">

                                                    {"⭐".repeat(review.rating)}

                                                </div>

                                            </div>

                                            <div className="text-gray-500">

                                                {review.created_at}

                                            </div>

                                        </div>

                                        <div className="mt-2 font-semibold text-base">

                                            <span className="font-semibold">

                                                Sản phẩm:

                                            </span>

                                            {" "}

                                            {review.product_name}

                                        </div>

                                        <p className="mt-2 leading-8 text-gray-700">

                                            {review.comment}

                                        </p>

                                        {

                                            review.owner_reply &&
                                            <div className="mt-5 bg-white dark:bg-slate-900 border-l-4 border-green-600 rounded-xl p-4 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-green-600 dark:bg-amber-500 text-white font-black text-xs rounded-lg shadow-sm">
                                                        Phản hồi của chủ trạm
                                                    </span>
                                                </div>
                                                <p className="text-slate-800 dark:text-slate-100 font-medium text-sm">
                                                    {review.owner_reply}
                                                </p>
                                            </div>
                                        }

                                    </div>

                                ))

                            )

                        }

                    </div>

                    {/* PAGINATION */}

                    {

                        reviewTotalPages > 1 &&

                        <div className="flex justify-center gap-3 mt-10">

                            <button

                                disabled={reviewPage === 1}

                                onClick={() =>

                                    setReviewPage(reviewPage - 1)

                                }

                                className="px-5 py-2 rounded-xl bg-gray-200 disabled:opacity-50"

                            >

                                ←

                            </button>

                            {

                                [...Array(reviewTotalPages)].map((_, index) => (

                                    <button

                                        key={index}

                                        onClick={() =>

                                            setReviewPage(index + 1)

                                        }

                                        className={`w-11 h-11 rounded-xl font-bold ${

                                            reviewPage === index + 1

                                                ? "bg-green-600 text-white"

                                                : "bg-gray-200"

                                        }`}

                                    >

                                        {index + 1}

                                    </button>

                                ))

                            }

                            <button

                                disabled={reviewPage === reviewTotalPages}

                                onClick={() =>

                                    setReviewPage(reviewPage + 1)

                                }

                                className="px-5 py-2 rounded-xl bg-gray-200 disabled:opacity-50"

                            >

                                →

                            </button>

                        </div>

                    }

                </div>
{/* ===========================
    VIẾT ĐÁNH GIÁ
=========================== */}

<div className="bg-white rounded-3xl shadow-xl p-8 mb-8">

    <h2 className="text-3xl font-bold text-green-700 mb-5">
        Viết đánh giá
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* =======================
            CỘT TRÁI
        ======================= */}

        <div className="space-y-3">

            {/* Tên sản phẩm */}
            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Sản phẩm
                </label>

                <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full border border-green-500 rounded-xl p-2 focus:ring-2 focus:ring-green-500 outline-none"
                >

                    <option value="">
                        Chọn sản phẩm
                    </option>

                    {
                        products.map(item => (

                            <option
                                key={item.product_id}
                                value={item.product_id}
                            >
                                {item.product_name}
                            </option>

                        ))
                    }

                </select>

            </div>


            {/* Số lượng refill */}

            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Số lượng refill
                </label>

                <input
    type="number"
    min={0.01}
    step="any"
    placeholder="số lượng lớn hơn 0"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}
    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-green-500 outline-none  no-spinner"
/>

            </div>
            {/* Đánh giá sao */}
            <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Đánh giá
                </label>

                <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-green-500 rounded-xl p-2 focus:ring-2 focus:ring-green-500 outline-none"
                >

                    <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                    <option value={3}>⭐⭐⭐ (3 sao)</option>
                    <option value={2}>⭐⭐ (2 sao)</option>
                    <option value={1}>⭐ (1 sao)</option>

                </select>

            </div>

        </div>


        {/* =======================
            CỘT PHẢI
        ======================= */}

        <div className="flex flex-col">

            <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nội dung đánh giá
            </label>

            <textarea
    placeholder="Hãy chia sẻ trải nghiệm của bạn sau khi refill sản phẩm..."
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="w-full h-32 border border-green-500 rounded-xl p-4 resize-none focus:ring-2 focus:ring-green-500 outline-none mb-1"
></textarea>

            <button
                onClick={createReview}
                className="w-30 mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold transition"
            >
                Gửi đánh giá
            </button>

        </div>

    </div>

</div>

            </div>

        </div>

    );

}

export default StationDetailPage;