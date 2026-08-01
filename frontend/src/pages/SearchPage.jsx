import { useEffect, useState } from "react";

import {
    useSearchParams,
    useNavigate
} from "react-router-dom";

import api from "../services/api";

import { IoChevronBack } from "react-icons/io5";

import useFavorite from "../hooks/useFavorite";


function SearchPage() {

    // =====================================================
    // STATE
    // =====================================================

    const [stations, setStations] = useState([]);

    const [searchText, setSearchText] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // SEARCH PARAMS
    // =====================================================

    const [searchParams] = useSearchParams();

    const keyword =
        searchParams.get("keyword") || "";


    const navigate = useNavigate();


    const {
        toggleFavorite,
        isFavorite
    } = useFavorite("stations");


    // =====================================================
    // PAGINATION
    // =====================================================

    const STATIONS_PER_PAGE = 15;

    const [currentPage, setCurrentPage] =
        useState(1);


    // =====================================================
    // SEARCH STATION
    // =====================================================

    const searchStation = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    `/stations/search?keyword=${encodeURIComponent(
                        keyword
                    )}`
                );


            setStations(
                response.data || []
            );


            setCurrentPage(1);

        } catch (error) {

            console.log(
                "Lỗi tìm kiếm trạm:",
                error
            );

            setStations([]);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // SEARCH WHEN KEYWORD CHANGES
    // =====================================================

    useEffect(() => {

        setSearchText(keyword);

        searchStation();

    }, [keyword]);


    // =====================================================
    // PAGINATION DATA
    // =====================================================

    const totalStations =
        stations.length;


    const totalPages =
        Math.ceil(
            totalStations /
            STATIONS_PER_PAGE
        );


    const startIndex =
        (currentPage - 1) *
        STATIONS_PER_PAGE;


    const currentStations =
        stations.slice(
            startIndex,
            startIndex +
            STATIONS_PER_PAGE
        );


    // =====================================================
    // PAGE CHANGE
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


        setCurrentPage(page);


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // =====================================================
    // PAGE NUMBERS
    // =====================================================

    const getPageNumbers = () => {

        const pages = [];


        if (totalPages <= 7) {

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


        if (currentPage <= 4) {

            pages.push(2);
            pages.push(3);
            pages.push(4);
            pages.push(5);
            pages.push("...");
            pages.push(totalPages);

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

            pages.push(totalPages);

            return pages;

        }


        pages.push("...");

        pages.push(
            currentPage - 1
        );

        pages.push(currentPage);

        pages.push(
            currentPage + 1
        );

        pages.push("...");

        pages.push(totalPages);


        return pages;

    };


    // =====================================================
    // SEARCH AGAIN
    // =====================================================

    const handleSearch = (e) => {

        e.preventDefault();


        const value =
            searchText.trim();


        if (!value) {

            navigate("/search");

            return;

        }


        navigate(
            `/search?keyword=${encodeURIComponent(
                value
            )}`
        );

    };


    // =====================================================
    // RESET SEARCH
    // =====================================================

    const handleReset = () => {

        setSearchText("");

        navigate("/search");

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
            px-4
            py-6
            md:px-8
            md:py-8
        ">
  {/* BACK */}

                    <button

                        onClick={() =>
                            navigate(-1)
                        }

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


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div>

                {/* =================================================
                    TITLE
                ================================================= */}

                <div className="
                    text-center
                    mb-7
                ">
                    <h1 className="
                        text-5xl
                        md:text-5xl
                        font-extrabold
                        text-green-700
                        mb-2
                    ">

                          🔍 Kết quả tìm kiếm trạm

                    </h1>


                    {keyword && (

                        <p className="
                            text-gray-600
                            text-base
                            md:text-lg
                        ">

                            Kết quả cho từ khóa{" "}

                            <span className="
                                font-bold
                                text-green-700
                            ">

                                "{keyword}"

                            </span>

                        </p>

                    )}

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="
                        bg-white/80
                        rounded-3xl
                        shadow-lg
                        p-12
                        text-center
                        mb-8
                    ">

                        <div className="
                            text-4xl
                            mb-3
                        ">

                            🔎

                        </div>


                        <p className="
                            text-gray-600
                            font-medium
                        ">

                            Đang tìm kiếm trạm...

                        </p>

                    </div>

                )}


                {/* =================================================
                    EMPTY
                ================================================= */}

                {!loading &&
                    stations.length === 0 && (

                        <div className="
                            max-w-2xl
                            mx-auto
                            bg-white/85
                            backdrop-blur-md
                            rounded-3xl
                            shadow-xl
                            p-10
                            md:p-14
                            text-center
                        ">

                            <div className="
                                text-6xl
                                mb-5
                            ">

                                😢

                            </div>


                            <h2 className="
                                text-2xl
                                md:text-3xl
                                font-bold
                                text-gray-700
                                mb-3
                            ">

                                Không tìm thấy trạm

                            </h2>


                            <p className="
                                text-gray-500
                                mb-6
                            ">

                                Không có trạm refill phù hợp
                                với từ khóa bạn tìm kiếm.

                            </p>

                        </div>

                    )}


                {/* =================================================
                    STATION LIST
                ================================================= */}

                {!loading &&
                    currentStations.length > 0 && (

                        <>

                            <div className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-5
                                gap-5
                            ">


                                {currentStations.map(
                                    (station) => (

                                        <div

                                            key={
                                                station.station_id
                                            }

                                            className="
                                                bg-white/90
                                                backdrop-blur-lg
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
                                                h-full
                                                flex
                                                flex-col
                                            "
                                        >


                                            {/* IMAGE */}

                                            <div className="
                                                relative
                                            ">

                                                <img

                                                    src={
                                                        station.image_url?.startsWith(
                                                            "/uploads"
                                                        )

                                                            ?

                                                            `http://localhost:5000${station.image_url}`

                                                            :

                                                            station.image_url
                                                    }

                                                    alt={
                                                        station.station_name
                                                    }

                                                    className="
                                                        w-full
                                                        h-48
                                                        md:h-52
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
                                                        w-10
                                                        h-10
                                                        flex
                                                        items-center
                                                        justify-center
                                                        bg-white/90
                                                        backdrop-blur-md
                                                        rounded-full
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
                                                ">

                                                    {
                                                        station.station_name
                                                    }

                                                </h2>


                                                {/* ADDRESS */}

                                                <p className="
                                                    text-gray-700
                                                    text-sm
                                                    leading-6
                                                    mb-2
                                                    line-clamp-2
                                                    min-h-[48px]
                                                ">

                                                    📍{" "}
                                                    {
                                                        station.address
                                                    }

                                                </p>


                                                {/* OPEN TIME */}

                                                <p className="
                                                    text-green-600
                                                    text-sm
                                                    font-medium
                                                    mb-2
                                                ">

                                                    🕒{" "}

                                                    {
                                                        station.open_time
                                                    }

                                                    {" - "}

                                                    {
                                                        station.close_time
                                                    }

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
                                                        station.description ||
                                                        "Chưa có mô tả."
                                                    }

                                                </p>


                                                {/* DETAIL */}

                                                <button

                                                    onClick={() =>
                                                        navigate(
                                                            `/stations/${station.station_id}`
                                                        )
                                                    }

                                                    className="
                                                        w-full
                                                        bg-green-500
                                                        hover:bg-green-600
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
                                            py-2.5
                                            rounded-xl
                                            bg-white
                                            shadow-md
                                            text-gray-700
                                            font-semibold
                                            disabled:opacity-40
                                            disabled:cursor-not-allowed
                                            hover:bg-green-50
                                            transition
                                        "
                                    >

                                        ← Trước

                                    </button>


                                    {/* NUMBERS */}

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
                                                        py-2.5
                                                        rounded-xl
                                                        font-semibold
                                                        transition
                                                        ${
                                                            currentPage ===
                                                            page

                                                                ?

                                                                "bg-green-500 text-white shadow-md"

                                                                :

                                                                "bg-white text-gray-700 shadow-sm hover:bg-green-50"
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
                                            py-2.5
                                            rounded-xl
                                            bg-white
                                            shadow-md
                                            text-gray-700
                                            font-semibold
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
                                    mt-4
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

                        </>

                    )}

            </div>

        </div>

    );

}


export default SearchPage;