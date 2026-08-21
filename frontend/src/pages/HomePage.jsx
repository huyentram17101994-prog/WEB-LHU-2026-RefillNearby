import { useEffect, useState } from "react";

import api, { getImageUrl } from "../services/api";

import { useNavigate } from "react-router-dom";

import MapView from "../components/MapView";

import { RiLogoutCircleRLine } from "react-icons/ri";

import useFavorite from "../hooks/useFavorite";


function HomePage() {

    // =====================================================
    // STATE
    // =====================================================

    // Toàn bộ trạm
    // Dùng để tính trạm gần tôi + hiển thị bản đồ
    const [allStations, setAllStations] = useState([]);

    // Trạm đang hiển thị trên BẢN ĐỒ
    // Tách riêng hoàn toàn với danh sách bên dưới
    const [mapStations, setMapStations] = useState([]);

    // 15 trạm đang hiển thị ở DANH SÁCH
    const [stations, setStations] = useState([]);

    const [search, setSearch] = useState("");

    const [unreadCount, setUnreadCount] = useState(0);

    const [userLocation, setUserLocation] = useState(null);

    const [showLocationModal, setShowLocationModal] = useState(false);

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user")
        )
    );


    // =====================================================
    // PAGINATION - DANH SÁCH TRẠM
    // =====================================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalStations, setTotalStations] =
        useState(0);

    const STATIONS_PER_PAGE = 15;


    const navigate = useNavigate();


    const {
        toggleFavorite,
        isFavorite
    } = useFavorite("stations");


    // =====================================================
    // LẤY TOÀN BỘ TRẠM
    // DÙNG CHO BẢN ĐỒ
    // =====================================================

    const fetchAllStations = async () => {

        try {

            const response =
                await api.get("/stations");

            const data =
                response.data || [];

            setAllStations(data);

            // Khi mở Home:
            // bản đồ hiển thị tất cả trạm
            setMapStations(data);

        } catch (error) {

            console.log(
                "Lỗi lấy toàn bộ trạm:",
                error
            );

        }

    };


    // =====================================================
    // LẤY 15 TRẠM CHO DANH SÁCH
    // =====================================================

    const fetchStationsPagination = async (
        page = 1
    ) => {

        try {

            const response =
                await api.get(
                    `/stations/pagination?page=${page}&limit=${STATIONS_PER_PAGE}`
                );


            setStations(
                response.data.data || []
            );


            setCurrentPage(
                response.data.page || page
            );


            setTotalPages(
                response.data.totalPages || 1
            );


            setTotalStations(
                response.data.total || 0
            );

        } catch (error) {

            console.log(
                "Lỗi phân trang trạm:",
                error
            );

        }

    };


    // =====================================================
    // TÍNH KHOẢNG CÁCH
    // =====================================================

    const calculateDistance = (

        lat1,
        lon1,

        lat2,
        lon2

    ) => {

        const R = 6371;


        const dLat =
            (lat2 - lat1) *
            Math.PI / 180;


        const dLon =
            (lon2 - lon1) *
            Math.PI / 180;


        const a =

            Math.sin(
                dLat / 2
            ) *
            Math.sin(
                dLat / 2
            )

            +

            Math.cos(
                lat1 *
                Math.PI /
                180
            )

            *

            Math.cos(
                lat2 *
                Math.PI /
                180
            )

            *

            Math.sin(
                dLon / 2
            ) *
            Math.sin(
                dLon / 2
            );


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return R * c;

    };


    // =====================================================
    // TRẠM GẦN TÔI & XIN QUYỀN TRUY CẬP VỊ TRÍ
    // =====================================================
    const filterNearbyStations = (latitude, longitude) => {
        const nearbyStations = allStations.filter((station) => {
            const stationLat = Number(station.latitude);
            const stationLng = Number(station.longitude);
            if (!stationLat || !stationLng) return false;

            const distance = calculateDistance(
                latitude,
                longitude,
                stationLat,
                stationLng
            );
            return distance <= 30;
        });

        setMapStations(nearbyStations);
    };

    const showNearestStations = () => {
        // Nếu đã có vị trí người dùng -> Lọc trạm 30km ngay lập tức
        if (userLocation && userLocation[0] && userLocation[1]) {
            filterNearbyStations(userLocation[0], userLocation[1]);
            return;
        }

        // Nếu chưa có vị trí -> Mở Modal hỏi xin phép người dùng
        setShowLocationModal(true);
    };

    const handleConfirmLocation = () => {
        setShowLocationModal(false);

        if (!navigator.geolocation) {
            alert("Trình duyệt của bạn không hỗ trợ lấy vị trí GPS.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                localStorage.setItem("latitude", latitude);
                localStorage.setItem("longitude", longitude);
                localStorage.setItem("locationPermission", "granted");

                setUserLocation([latitude, longitude]);
                filterNearbyStations(latitude, longitude);
            },
            (error) => {
                console.log("Lỗi lấy vị trí GPS:", error);
                alert("Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí trên thiết bị.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleCancelLocation = () => {
        // Bấm Hủy: Giữ nguyên bản đồ không có vị trí người dùng
        setShowLocationModal(false);
    };


    // =====================================================
    // TẤT CẢ TRẠM
    // CHỈ THAY ĐỔI BẢN ĐỒ
    // =====================================================

    const showAllStations = () => {

        setMapStations(
            allStations
        );

    };


    // =====================================================
    // PROFILE
    // =====================================================

    const loadProfile = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                return;

            }


            const res =
                await api.get(
                    "/auth/profile",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            setUser(
                res.data
            );


            localStorage.setItem(
                "user",
                JSON.stringify(
                    res.data
                )
            );

        } catch (error) {

            console.log(
                "Lỗi lấy profile:",
                error
            );

        }

    };


    // =====================================================
    // UNREAD NOTIFICATION
    // =====================================================

    const fetchUnreadCount = async () => {

        try {

            const token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                return;

            }


            const res =
                await api.get(
                    "/notifications/unread-count",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            setUnreadCount(
                res.data.unread_count || 0
            );

        } catch (error) {

            console.log(
                "Lỗi thông báo:",
                error
            );

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        // Bản đồ
        fetchAllStations();

        // Danh sách 15 trạm
        fetchStationsPagination(1);

        // User
        loadProfile();

        // Notification
        fetchUnreadCount();

        // CHỈ TỰ ĐỘNG HIỂN THỊ VỊ TRÍ NẾU NGƯỜI DÙNG ĐÃ CHO PHÉP TRƯỚC ĐÓ (granted)
        const isGranted = localStorage.getItem("locationPermission") === "granted";
        const lat = Number(localStorage.getItem("latitude"));
        const lng = Number(localStorage.getItem("longitude"));

        if (isGranted && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            setUserLocation([lat, lng]);
        }

    }, []);


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/login");

    };


    // =====================================================
    // PHÂN TRANG DANH SÁCH
    // =====================================================

    const handlePageChange = (
        page
    ) => {

        if (
            page < 1 ||
            page > totalPages
        ) {

            return;

        }


        setCurrentPage(
            page
        );


        fetchStationsPagination(
            page
        );


        // Cuộn tới danh sách
        window.scrollTo({

            top: 500,

            behavior: "smooth"

        });

    };


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const getPageNumbers = () => {

        const pages = [];


        if (
            totalPages <= 7
        ) {

            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {

                pages.push(i);

            }

            return pages;

        }


        pages.push(1);


        if (
            currentPage <= 4
        ) {

            pages.push(2);

            pages.push(3);

            pages.push(4);

            pages.push(5);

            pages.push("...");

            pages.push(
                totalPages
            );

            return pages;

        }


        if (
            currentPage >=
            totalPages - 3
        ) {

            pages.push("...");

            pages.push(
                totalPages - 4
            );

            pages.push(
                totalPages - 3
            );

            pages.push(
                totalPages - 2
            );

            pages.push(
                totalPages - 1
            );

            pages.push(
                totalPages
            );

            return pages;

        }


        pages.push("...");

        pages.push(
            currentPage - 1
        );

        pages.push(
            currentPage
        );

        pages.push(
            currentPage + 1
        );

        pages.push("...");

        pages.push(
            totalPages
        );


        return pages;

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-green-200
            via-white
            to-green-500
            p-6
            md:p-8
        ">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="
                max-w-8xl
                mx-auto
                flex
                flex-col
                md:flex-row
                justify-between
                items-center
                gap-5
                mb-8
            ">


                {/* LOGO / TITLE */}

                <div>

                    <h1 className="
                        text-4xl
                        md:text-5xl
                        font-extrabold
                        text-green-700
                        mb-1
                    ">

                        🌱 Refill Nearby

                    </h1>


                    <p className="
                        text-gray-600
                        text-base
                        md:text-lg
                    ">

                        Tìm trạm refill gần bạn
                        dễ dàng.

                    </p>

                </div>


                {/* RIGHT MENU */}

                <div className="
                    flex
                    items-center
                    gap-3
                ">


                    {/* BADGE */}

                    <div className="
                        bg-yellow-100
                        text-yellow-700
                        px-3
                        py-2
                        rounded-2xl
                        font-bold
                        shadow-md
                        whitespace-nowrap
                    ">

                        🏅{" "}

                        {user?.badge ||
                            "Người dùng mới"}

                    </div>


                    {/* NOTIFICATION */}

                    <button

                        onClick={() =>
                            navigate(
                                "/notifications"
                            )
                        }

                        className="
                            relative
                            bg-red-50
                            p-2
                            rounded-2xl
                            shadow-md
                            hover:bg-red-200
                            hover:scale-105
                            transition
                        "
                    >

                        <span className="
                            text-xl
                        ">

                            🔔

                        </span>


                        {unreadCount > 0 && (

                            <span className="
                                absolute
                                -top-2
                                -right-2
                                bg-red-500
                                text-white
                                rounded-full
                                w-6
                                h-6
                                flex
                                items-center
                                justify-center
                                text-xs
                                font-bold
                            ">

                                {unreadCount}

                            </span>

                        )}

                    </button>


                    {/* MENU */}

                    <div className="
                        relative
                        z-[9999]
                    ">

                        <details>

                            <summary className="
                                list-none
                                cursor-pointer
                                bg-green-200
                                px-3
                                py-2
                                rounded-2xl
                                shadow-md
                                hover:bg-green-100
                                transition
                                font-bold
                                text-green-700
                                flex
                                items-center
                                gap-2
                                whitespace-nowrap
                            ">

                                ☰ Chức năng

                            </summary>


                            <div className="
    absolute
    right-0
    z-[9999]
    mt-3
    w-60
    bg-white
    rounded-2xl
    shadow-2xl
    p-2
">


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/profile"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    👤 Hồ sơ cá nhân

                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/products"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    📦 Xem sản phẩm refill

                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/ocr"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    🧾 Chụp hóa đơn phân tích

                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/statistics"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    ♻️ Thống kê lượng nhựa

                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/favorites"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-pink-50
                                        transition
                                    "
                                >

                                    ❤️ Danh sách yêu thích

                                </button>


                                <button
                                    onClick={() =>
                                        navigate(
                                            "/refill-history"
                                        )
                                    }
                                    className="
                                        w-full
                                        text-left
                                        p-2
                                        rounded-xl
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    📜 Lịch sử refill

                                </button>


                                <button
                                    onClick={
                                        logout
                                    }
                                    className="
                                        w-full
                                        flex
                                        items-center
                                        gap-3
                                        p-2
                                        rounded-xl
                                        hover:bg-red-50
                                        text-red-600
                                        font-semibold
                                        transition
                                    "
                                >

                                    <RiLogoutCircleRLine
                                        size={21}
                                    />

                                    Đăng xuất

                                </button>

                            </div>

                        </details>

                    </div>

                </div>

            </div>


            {/* =================================================
                SEARCH
                TÌM KIẾM -> TRANG TÌM KIẾM RIÊNG
            ================================================= */}

            <div className="
                mb-8
                max-w-4xl
                mx-auto
            ">

                <div className="
                    relative
                ">


                    <input

                        type="text"

                        placeholder="🔍 Tìm kiếm trạm refill...
                        "

                        value={search}

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (
                                e.key ===
                                "Enter" &&
                                search.trim()
                            ) {

                                navigate(
                                    `/search?keyword=${encodeURIComponent(
                                        search.trim()
                                    )}`
                                );

                            }

                        }}

                        className="
                            w-full
                            p-3
                            pr-14
                            rounded-3xl
                            bg-white/90
                            border
                            border-gray-200
                            shadow-lg
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
                            text-lg
                            text-left
                            pl-6
                        "

                    />


                    {search && (

                        <button

                            type="button"

                            onClick={() =>
                                setSearch("")
                            }

                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                w-9
                                h-9
                                rounded-full
                                bg-gray-200
                                hover:bg-gray-300
                                text-gray-600
                                font-bold
                                flex
                                items-center
                                justify-center
                                transition
                            "

                            title="Xóa tìm kiếm"

                        >

                            ✕

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                MAP
            ================================================= */}

            <div className="
                max-w-7xl
                mx-auto
                mt-8
            ">


                {/* MAP HEADER */}

                <div className="
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    md:items-center
                    gap-4
                    mb-5
                ">


                    <h2 className="
                        text-2xl
                        md:text-3xl
                        font-bold
                        text-gray-700
                    ">

                        🗺️ Bản đồ vị trí trạm refill

                    </h2>


                    <div className="
                        flex
                        items-center
                        gap-3
                    ">


                        {/* NEAREST */}

                        <button

                            onClick={
                                showNearestStations
                            }

                            className="
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                px-4
                                py-2
                                rounded-xl
                                font-semibold
                                shadow-md
                                transition
                                whitespace-nowrap
                            "
                        >

                            Trạm gần tôi

                        </button>


                        {/* ALL */}

                        <button

                            onClick={
                                showAllStations
                            }

                            className="
                                bg-green-500
                                hover:bg-green-600
                                text-white
                                px-4
                                py-2
                                rounded-xl
                                font-semibold
                                shadow-md
                                transition
                                whitespace-nowrap
                            "
                        >

                            Tất cả trạm

                        </button>

                    </div>

                </div>


                {/* MAP */}
                <MapView
                    stations={mapStations}
                    userLocation={userLocation}
                />

            </div>


            {/* =================================================
                STATION LIST
                ĐỘC LẬP VỚI BẢN ĐỒ
            ================================================= */}

            <div className="
                max-w-7xl
                mx-auto
                mt-10
                mb-5
                flex
                flex-col
                sm:flex-row
                justify-between
                sm:items-center
                gap-2
            ">


                <h2 className="
                    text-2xl
                    font-bold
                    text-gray-700
                ">

                    🏪 Danh sách trạm refill

                </h2>


                <p className="
                    text-gray-600
                ">

                    Tổng{" "}

                    <span className="
                        font-bold
                        text-green-600
                    ">

                        {totalStations}

                    </span>

                    {" "}trạm

                </p>

            </div>


            {/* =================================================
                STATION CARDS
            ================================================= */}

            {stations.length === 0 ? (

                <div className="
                    max-w-7xl
                    mx-auto
                    bg-white/80
                    rounded-3xl
                    shadow-lg
                    p-12
                    text-center
                ">

                    <div className="
                        text-6xl
                        mb-4
                    ">

                        🏪

                    </div>


                    <h3 className="
                        text-2xl
                        font-bold
                        text-gray-700
                    ">

                        Không có trạm

                    </h3>

                </div>

            ) : (

                <div className="
                    max-w-7xl
                    mx-auto
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-5
                    gap-5
                ">


                    {stations.map(
                        (station) => (

                            <div

                                key={
                                    station.station_id
                                }

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

                                <div className="
                                    relative
                                ">

                                    <img
                                        src={getImageUrl(station.image_url)}

                                        alt={
                                            station.station_name
                                        }

                                        className="
                                            w-full
                                            h-52
                                            object-cover
                                        "

                                    />


                                    {/* FAVORITE */}

                                    <button

                                        onClick={() =>
                                            toggleFavorite(
                                                station.station_id
                                            )
                                        }

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
                                        "
                                    >

                                        {
                                            isFavorite(
                                                station.station_id
                                            )

                                                ?

                                                "❤️"

                                                :

                                                "🤍"
                                        }

                                    </button>

                                </div>


                                {/* CONTENT */}

                                <div className="
                                    p-5
                                    flex
                                    flex-col
                                    flex-1
                                ">


                                    {/* NAME */}

                                    <h2 className="
                                        text-xl
                                        font-bold
                                        text-gray-800
                                        mb-2
                                        line-clamp-2
                                        min-h-[56px]
                                        group-hover:text-green-700
                                        transition
                                    ">

                                        {
                                            station.station_name
                                        }

                                    </h2>


                                    {/* ADDRESS */}

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


                                    {/* TIME */}

                                    <p className="
                                        text-green-600
                                        text-sm
                                        font-medium
                                        mb-2
                                    ">

                                        🕒{" "}

                                        {station.open_time}

                                        {" - "}

                                        {station.close_time}

                                    </p>


                                    {/* DESCRIPTION */}

                                    <p className="
                                        text-gray-600
                                        text-sm
                                        leading-6
                                        mb-4
                                        line-clamp-2
                                        min-h-[48px]
                                    ">

                                        {
                                            station.description
                                        }

                                    </p>


                                    {/* DETAIL BUTTON */}

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
                                            py-2
                                            rounded-xl
                                            font-semibold
                                            shadow-sm
                                            transition
                                            mt-auto
                                        "
                                    >

                                        Xem chi tiết

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

                <div className="
                    flex
                    flex-wrap
                    justify-center
                    items-center
                    gap-2
                    mt-10
                    mb-4
                ">


                    {/* PREVIOUS */}

                    <button

                        onClick={() =>
                            handlePageChange(
                                currentPage - 1
                            )
                        }

                        disabled={
                            currentPage === 1
                        }

                        className="
                            px-4
                            py-2
                            rounded-xl
                            bg-white
                            shadow-md
                            font-semibold
                            text-gray-700
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            hover:bg-green-50
                            transition
                        "
                    >

                        ← Trước

                    </button>


                    {/* PAGE NUMBERS */}

                    {getPageNumbers().map(
                        (
                            page,
                            index
                        ) => (

                            page === "..." ? (

                                <span

                                    key={
                                        `dots-${index}`
                                    }

                                    className="
                                        px-2
                                        py-2
                                        text-gray-500
                                    "
                                >

                                    ...

                                </span>

                            ) : (

                                <button

                                    key={
                                        page
                                    }

                                    onClick={() =>
                                        handlePageChange(
                                            page
                                        )
                                    }

                                    className={`
                                        min-w-[42px]
                                        px-3
                                        py-2
                                        rounded-xl
                                        font-semibold
                                        transition
                                        ${currentPage ===
                                            page

                                            ?

                                            "bg-green-500 text-white shadow-md"

                                            :

                                            "bg-white text-gray-700 hover:bg-green-50 shadow-sm"
                                        }
                                    `}
                                >

                                    {
                                        page
                                    }

                                </button>

                            )

                        )
                    )}


                    {/* NEXT */}

                    <button

                        onClick={() =>
                            handlePageChange(
                                currentPage + 1
                            )
                        }

                        disabled={
                            currentPage ===
                            totalPages
                        }

                        className="
                            px-4
                            py-2
                            rounded-xl
                            bg-white
                            shadow-md
                            font-semibold
                            text-gray-700
                            disabled:opacity-40
                            disabled:cursor-not-allowed
                            hover:bg-green-50
                            transition
                        "
                    >

                        Sau →

                    </button>

                </div>

            )}


            {/* PAGE INFO */}

            {totalPages > 1 && (

                <p className="
                    text-center
                    text-gray-600
                    mb-8
                ">

                    Trang{" "}

                    <span className="
                        font-bold
                        text-green-600
                    ">

                        {currentPage}

                    </span>

                    {" "} / {totalPages}

                </p>

            )}

            {/* LOCATION PERMISSION POPUP MODAL */}
            {showLocationModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-green-100 animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto text-emerald-600">
                            📍
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800">
                            Cho phép truy cập vị trí?
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed">
                            Ứng dụng cần vị trí của bạn để hiển thị vị trí trên bản đồ và tìm các trạm refill gần bạn nhất trong bán kính 30km.
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={handleCancelLocation}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition cursor-pointer"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleConfirmLocation}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl font-bold text-sm shadow-md transition cursor-pointer"
                            >
                                Đồng ý (OK)
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

}


export default HomePage;