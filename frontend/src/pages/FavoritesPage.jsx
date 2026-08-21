import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import api, { getImageUrl } from "../services/api";
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

                <div className="max-w-7xl mx-auto">

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
                        sm:grid-cols-2
                        lg:grid-cols-3
                        xl:grid-cols-5
                        gap-5
                        mb-14
                    ">

                        {stations.map((station) => (

                            <div
                                key={station.station_id}
                                className="
                                    bg-white/90
                                    backdrop-blur-md
                                    rounded-3xl
                                    overflow-hidden
                                    shadow-lg
                                    hover:shadow-2xl
                                    hover:-translate-y-1.5
                                    transition
                                    duration-300
                                    w-full
                                    max-w-[280px]
                                    mx-auto
                                    flex
                                    flex-col
                                    border
                                    border-green-100
                                    group
                                "
                            >

                                {/* IMAGE */}

                                <div className="relative">

                                    <img
                                        src={getImageUrl(station.image_url)}
                                        alt={station.station_name}
                                        className="
                                            w-full
                                            h-52
                                            object-cover
                                        "
                                    />

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
                                            bg-white/90
                                            backdrop-blur-md
                                            rounded-full
                                            w-11
                                            h-11
                                            text-xl
                                            shadow-md
                                            hover:scale-110
                                            transition
                                            flex
                                            items-center
                                            justify-center
                                            cursor-pointer
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
                                        text-xl
                                        font-bold
                                        text-gray-800
                                        mb-2
                                        line-clamp-2
                                        min-h-[48px]
                                        group-hover:text-green-700
                                        transition
                                        
                                    ">

                                        {station.station_name}

                                    </h2>

                                    <p className="
                                        text-gray-700
                                        text-sm
                                        mb-2
                                        line-clamp-2
                                        min-h-[40px]
                                    ">

                                        📍{" "}
                                        {station.address}

                                    </p>

                                    <p className="
                                        text-green-600
                                        text-sm
                                        font-medium
                                        mb-2
                                    ">

                                        🕒{" "}
                                        {station.open_time}
                                        {' - '}
                                        {station.close_time}

                                    </p>

                                    <p className="
                                        text-gray-600
                                        text-sm
                                        leading-6
                                        mb-4
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
                                            w-full
                                            bg-green-600  
                                            hover:bg-green-700
                                            text-white
                                            py-2.5
                                            rounded-xl
                                            font-bold
                                            text-xs
                                            shadow-md
                                            transition
                                            mt-auto
                                            cursor-pointer
                                        "
                                    >

                                        Xem chi tiết

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

            {/* SẢN PHẨM YÊU THÍCH */}

            {showProducts && (

                <div className="max-w-7xl mx-auto">

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
                        grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-5
                        gap-6
                        mb-14
                    ">

                        {products.map((product) => (

                            <div
                                key={product.favorite_product_id}
                                className="
                                    bg-white/90
                                    backdrop-blur-md
                                    rounded-3xl
                                    overflow-hidden
                                    shadow-lg
                                    hover:shadow-2xl
                                    hover:-translate-y-1.5
                                    transition
                                    duration-300
                                    w-full
                                    max-w-[280px]
                                    mx-auto
                                    flex
                                    flex-col
                                    border
                                    border-green-100
                                    group
                                "
                            >

                                {/* IMAGE */}

                                <div className="relative overflow-hidden">

                                    <img
                                        src={getImageUrl(product.image_url)}
                                        alt={product.product_name}
                                        className="
                                            w-full
                                            h-52
                                            object-cover
                                            group-hover:scale-105
                                            transition
                                            duration-500
                                        "
                                    />

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
                                            bg-white/90
                                            backdrop-blur-md
                                            rounded-full
                                            w-10
                                            h-10
                                            text-lg
                                            shadow-md
                                            hover:scale-110
                                            active:scale-95
                                            transition
                                            flex
                                            items-center
                                            justify-center
                                            cursor-pointer
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
                                        font-bold
                                        text-gray-800
                                        mb-2
                                        line-clamp-2
                                        min-h-[48px]
                                        group-hover:text-green-700
                                        transition
                                    ">

                                        {product.product_name}

                                    </h3>

                                    <p className="
                                        text-gray-700
                                        text-base
                                        mb-1.5
                                        font-medium
                                    ">

                                        💰 Giá từ:{" "}
                                        <b className="text-green-600 font-extrabold">
                                            {Number(
                                                product.min_price
                                            ).toLocaleString()} đ
                                        </b>
                                    </p>

                                    <p className="
                                        text-gray-600
                                        text-base
                                        mb-4
                                    ">

                                        📍 Có tại:{" "}
                                        <b className="text-green-600 font-bold">
                                            {product.total_stations}
                                        </b>
                                        {" "}trạm refill

                                    </p>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/products/${encodeURIComponent(
                                                    product.product_name
                                                )}`
                                            )
                                        }
                                        className="
                                            w-full
                                            bg-green-600
                                            hover:bg-green-700
                                            text-white
                                            py-2.5
                                            rounded-xl
                                            font-bold
                                            text-xs
                                            shadow-md
                                            transition
                                            mt-auto
                                            cursor-pointer
                                        "
                                    >

                                        Xem chi tiết

                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>

    );

}

            export default FavoritesPage;