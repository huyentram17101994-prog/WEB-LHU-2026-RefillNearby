import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import api from "../services/api";
import useFavorite from "../hooks/useFavorite";

function FavoritesPage() {

    const navigate = useNavigate();

    // Danh sách
    const [stations, setStations] = useState([]);
    const [products, setProducts] = useState([]);

    // Mở / đóng
    const [showStations, setShowStations] = useState(false);
    const [showProducts, setShowProducts] = useState(false);

    // ==========================
    // LOAD DATA
    // ==========================

    useEffect(() => {

        fetchData();

    }, []);

    const fetchData = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const stationRes =
                await api.get(
                    "/favorites",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            const productRes =
                await api.get(
                    "/favorites/products",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setStations(stationRes.data);
            setProducts(productRes.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    // REMOVE STATION
    const {
        removeFavorite
    } = useFavorite("stations");

    const {
        removeFavorite: removeProductFavorite
    } = useFavorite("products");

    return (

        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-300 p-8 ">

            {/* BACK */}

            <button
                onClick={() => navigate(-1)}
                className="
                    flex items-center
                    gap-2
                    mb-8
                    px-5 py-3
                    bg-white
                    rounded-full
                    shadow-md
                    hover:shadow-lg
                    transition
                "
            >

                <IoChevronBack size={22} />

                Quay lại

            </button>

            {/* TITLE */}

            <h1 className="text-5xl font-bold text-center text-pink-600 mb-14">

                ❤️ Danh sách yêu thích

            </h1>

            {/* SUMMARY */}

            <div className="
                flex
                flex-col
                md:flex-row
                justify-center
                items-center
                gap-5
                mb-10
            ">

                {/* STATION */}

                <div
                    onClick={() =>
                        setShowStations(!showStations)
                    }
                    className="
                        w-full
                        md:w-[380px]
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-6
                        cursor-pointer
                        hover:scale-[1.03]
                        transition
                    "
                >

                    <h2 className="text-2xl font-bold">

                        🏪 Trạm refill yêu thích

                    </h2>

                    <p className="mt-3 text-lg">

                        Đã lưu

                        <span className="
                            font-bold
                            text-pink-600
                            mx-2
                        ">

                            {stations.length}

                        </span>

                        trạm

                    </p>

                </div>

                {/* PRODUCT */}

                <div
                    onClick={() =>
                        setShowProducts(!showProducts)
                    }
                    className="
                        w-full
                        md:w-[380px]
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-6
                        cursor-pointer
                        hover:scale-[1.03]
                        transition
                    "
                >

                    <h2 className="text-2xl font-bold">

                        📦 Sản phẩm yêu thích

                    </h2>

                    <p className="mt-3 text-lg">

                        Đã lưu

                        <span className="
                            font-bold
                            text-pink-600
                            mx-2
                        ">

                            {products.length}

                        </span>

                        sản phẩm

                    </p>

                </div>

            </div>

            {/* EMPTY / GUIDE STATE */}

            {!showStations && !showProducts && (

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    mt-10
                    mb-12
                    px-4
                ">

                    <div className="
                        w-20
                        h-20
                        rounded-full
                        bg-white/80
                        shadow-md
                        flex
                        items-center
                        justify-center
                        text-4xl
                        mb-5
                    ">

                        ❤️

                    </div>

                    <h3 className="
                        text-2xl
                        font-bold
                        text-gray-700
                        mb-2
                    ">

                        Hãy chọn mục yêu thích

                    </h3>

                    <p className="
                        text-gray-500
                        text-lg
                        max-w-md
                        leading-relaxed
                    ">

                        Nhấn vào{" "}

                        <span className="
                            font-semibold
                            text-pink-600
                        ">

                            Trạm refill yêu thích

                        </span>

                        {" "}hoặc{" "}

                        <span className="
                            font-semibold
                            text-pink-600
                        ">

                            Sản phẩm yêu thích

                        </span>

                        {" "}ở phía trên để xem danh sách của bạn.

                    </p>

                </div>

            )}

            {/* TRẠM YÊU THÍCH */}

            {showStations && (

                <>

                    <h2 className="
                        text-4xl
                        font-bold
                        text-pink-600
                        mb-8
                      
                    ">

                        🏪 Trạm refill yêu thích

                    </h2>

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-5
                        gap-6
                        mb-14
                        
                    ">

                        {stations.map((station) => (

                            <div
                                key={station.station_id}
                                className="
                                    bg-white/80
                                    backdrop-blur-lg
                                    rounded-[30px]
                                    overflow-hidden
                                    shadow-xl
                                    hover:shadow-2xl
                                    hover:-translate-y-2
                                    transition
                                    duration-300
                                    w-64
                                    mx-auto
                                    h-full
                                    flex
                                    flex-col
                                "
                            >

                                {/* IMAGE */}

                                <div className="relative">

                                    <img
                                        src={
                                            station.image_url.startsWith('/uploads')
                                                ? `http://localhost:5000${station.image_url}`
                                                : station.image_url
                                        }
                                        alt={station.station_name}
                                        className="
                                            w-full
                                            h-52
                                            object-cover
                                            rounded-lg
                                            mb-2
                                        "
                                    />

                                    <div className="
                                        absolute
                                        inset-0
                                        bg-black/20
                                    "></div>

                                    {/* FAVORITE */}

                                    <button
                                        onClick={async () => {

                                            await removeFavorite(
                                                station.station_id
                                            );

                                            fetchData();

                                        }}
                                        className="
                                            absolute
                                            top-3
                                            right-3
                                            bg-white/80
                                            backdrop-blur-md
                                            rounded-full
                                            w-10
                                            h-10
                                            text-xl
                                            hover:scale-110
                                            transition
                                        "
                                    >

                                        ❤️

                                    </button>

                                </div>

                                {/* CONTENT */}

                                <div className="
                                    p-5
                                    flex
                                    flex-col
                                    flex-1
                                ">

                                    <h2 className="
                                        font-bold
                                        text-gray-800
                                        text-xl
                                        mb-3
                                        line-clamp-2
                                        min-h-[56px]
                                    ">

                                        {station.station_name}

                                    </h2>

                                    <p className="
                                        text-gray-800
                                        mb-3
                                        line-clamp-2
                                        min-h-[48px]
                                    ">

                                        - Địa chỉ: {station.address}

                                    </p>

                                    <p className="
                                        text-green-600
                                        mb-4
                                    ">

                                        - Mở cửa: {station.open_time}
                                        {' - '}
                                        {station.close_time}

                                    </p>

                                    <p className="
                                        text-gray-700
                                        leading-7
                                        mb-3
                                        line-clamp-2
                                        min-h-[48px]
                                    ">

                                        {station.description}

                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/stations/${station.station_id}`
                                            )
                                        }
                                        className="
                                            mt-auto
                                            w-full
                                            bg-green-500
                                            hover:bg-green-600
                                            text-white
                                            py-2
                                            rounded-xl
                                            font-semibold
                                        "
                                    >

                                        Xem chi tiết

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </>

            )}

            {/* SẢN PHẨM YÊU THÍCH */}

            {showProducts && (

                <>

                    <h2 className="
                        text-4xl
                        font-bold
                        text-pink-600
                        mb-8
                    ">

                        📦 Sản phẩm yêu thích

                    </h2>

                    <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-5
                        gap-6
                        mb-14
                    ">

                        {products.map((product) => (

                            <div
                                key={product.favorite_product_id}
                                className="
                                    bg-white/80
                                    backdrop-blur-lg
                                    rounded-[30px]
                                    overflow-hidden
                                    shadow-xl
                                    hover:shadow-2xl
                                    hover:-translate-y-2
                                    transition
                                    duration-300
                                    w-64
                                    mx-auto
                                    h-full
                                    flex
                                    flex-col
                                "
                            >

                                {/* IMAGE */}

                                <div className="relative">

                                    <img
                                        src={
                                            product.image_url?.startsWith("/uploads")
                                                ? `http://localhost:5000${product.image_url}`
                                                : product.image_url
                                        }
                                        alt={product.product_name}
                                        className="
                                            w-full
                                            h-52
                                            object-cover
                                        "
                                    />

                                    <div className="
                                        absolute
                                        inset-0
                                        bg-black/20
                                    "></div>

                                    <button
                                        onClick={async () => {

                                            await removeProductFavorite(
                                                product.product_id
                                            );

                                            fetchData();

                                        }}
                                        className="
                                            absolute
                                            top-3
                                            right-3
                                            bg-white/80
                                            rounded-full
                                            w-10
                                            h-10
                                            text-xl
                                            hover:scale-110
                                            transition
                                        "
                                    >

                                        ❤️

                                    </button>

                                </div>

                                {/* CONTENT */}

                                <div className="
                                    p-4
                                    flex
                                    flex-col
                                    flex-1
                                ">

                                    <h3 className="
                                        text-xl
                                        font-semibold
                                        mb-3
                                        line-clamp-2
                                        min-h-[56px]
                                    ">

                                        {product.product_name}

                                    </h3>

                                    <p className="
                                        text-base
                                        text-gray-700
                                        mb-2
                                    ">

                                        💰 Giá từ:{" "}
                                        {Number(
                                            product.min_price
                                        ).toLocaleString()} đ

                                    </p>

                                    <p className="
                                        text-gray-600
                                        mb-5
                                    ">

                                        📍 Có tại:{" "}
                                        {product.total_stations}
                                        {" "}trạm refill

                                    </p>

                                    <div className="
                                        flex
                                        gap-3
                                        mt-auto
                                    ">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/products/${encodeURIComponent(
                                                        product.product_name
                                                    )}`
                                                )
                                            }
                                            className="
                                                flex-1
                                                bg-green-500
                                                hover:bg-green-600
                                                text-white
                                                py-2
                                                rounded-xl
                                                font-semibold
                                            "
                                        >

                                            Xem chi tiết

                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </>

            )}

        </div>

    );

}

export default FavoritesPage;