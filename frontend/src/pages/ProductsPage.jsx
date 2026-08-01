import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { IoChevronBack } from "react-icons/io5";

import useFavorite from "../hooks/useFavorite";


function ProductsPage() {

    // =========================
    // STATE
    // =========================

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const [totalProducts, setTotalProducts] =
        useState(0);


    // =========================
    // CONSTANT
    // =========================

    const PRODUCTS_PER_PAGE = 15;


    const navigate = useNavigate();


    const {
        toggleFavorite,
        isFavorite
    } = useFavorite("products");


    // =========================
    // FETCH PRODUCTS
    // =========================

    const fetchProducts = async (
        page = 1,
        keyword = ""
    ) => {

        try {

            const response = await api.get(
                `/products?page=${page}&limit=${PRODUCTS_PER_PAGE}&search=${encodeURIComponent(keyword)}`
            );


            setProducts(
                response.data.data
            );


            setCurrentPage(
                response.data.page
            );


            setTotalPages(
                response.data.totalPages
            );


            setTotalProducts(
                response.data.total
            );

        }

        catch (error) {

            console.error(
                "Lỗi lấy sản phẩm:",
                error
            );

        }

    };


    // =========================
    // LOAD PRODUCTS
    // =========================

    useEffect(() => {

        fetchProducts(
            currentPage,
            search
        );

    }, [currentPage]);


    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {

        const value =
            e.target.value;

        setSearch(value);

        // Khi tìm kiếm
        // quay về trang 1

        if (currentPage !== 1) {

            setCurrentPage(1);

        }

        else {

            fetchProducts(
                1,
                value
            );

        }

    };


    // =========================
    // CHANGE PAGE
    // =========================

    const handlePageChange = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {

            return;

        }


        setCurrentPage(page);


        // Cuộn lên đầu danh sách

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };


    // =========================
    // PAGE NUMBERS
    // =========================

    const getPageNumbers = () => {

        const pages = [];


        // Nếu ít trang

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


        // Trang đầu

        pages.push(1);


        // Nếu đang ở gần đầu

        if (currentPage <= 4) {

            pages.push(2);

            pages.push(3);

            pages.push(4);

            pages.push(5);

            pages.push("...");

            pages.push(totalPages);

            return pages;

        }


        // Nếu đang ở gần cuối

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


        // Ở giữa

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

        pages.push(totalPages);


        return pages;

    };


    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-green-200
            via-white
            to-green-500
            p-6
        ">


            {/* =========================
                HEADER
            ========================= */}

            <div className="relative mb-10">

                <button
                    onClick={() =>
                        navigate(-1)
                    }
                    className="
                        flex
                        items-center
                        gap-2
                        mb-8
                        ml-2
                        px-5
                        py-3
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

                    <IoChevronBack
                        size={22}
                    />

                    Quay lại

                </button>


                <h1 className="
                    text-5xl
                    text-center
                    font-extrabold
                    text-green-600
                    mb-12
                ">

                    📦 Sản phẩm Refill

                </h1>

            </div>

{/* SEARCH */}

<div className="
    mb-10
    flex
    justify-center
">

    <div className="
        relative
        w-full
        max-w-3xl
    ">

        <input
            type="text"
            placeholder="🔍 Tìm sản phẩm refill..."
            value={search}
            onChange={handleSearch}
            className="
                w-full
                p-3
                pr-14
                rounded-3xl
                bg-white/80
                border
                border-gray-100
                shadow-lg
                focus:outline-none
                focus:ring-2
                focus:ring-green-400
                text-lg
                pl-6
            "
        />

        {/* RESET SEARCH */}

        {search && (

            <button
                type="button"
                onClick={() => {
                    setSearch("");
                    setCurrentPage(1);
                    fetchProducts(1, "");
                }}
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
            {/* =========================
                PRODUCTS
            ========================= */}

            {products.length === 0 ? (

                <div className="
                    flex
                    flex-col
                    items-center
                    justify-center
                    py-20
                ">

                    <div className="
                        text-6xl
                        mb-4
                    ">

                        🔍

                    </div>


                    <h2 className="
                        text-2xl
                        font-bold
                        text-gray-700
                    ">

                        Không tìm thấy sản phẩm

                    </h2>


                    <p className="
                        text-gray-500
                        mt-2
                    ">

                        Hãy thử tìm kiếm với
                        từ khóa khác.

                    </p>

                </div>

            ) : (

                <div className="
                      grid
    grid-cols-2
    md:grid-cols-3
    lg:grid-cols-5
    gap-6
    
                      
                ">

                    {products.map(
                        (product) => (

                            <div
                                key={
                                    product.product_id
                                }
                                className="
                                    bg-white
        rounded-3xl
        overflow-hidden
        shadow-lg
        hover:shadow-xl
        transition
        w-full
        max-w-[300px]
        mx-auto
                                "
                            >


                                {/* IMAGE */}

                                <div className="
                                    relative
                                ">

                                    <img

                                        src={
                                            `http://localhost:5000${product.image_url}`
                                        }

                                        alt={
                                            product.product_name
                                        }

                                        className="
                                            w-full
                                            h-56
                                            object-cover
                                        "

                                    />


                                    {/* OVERLAY */}

                                    <div className="
                                        absolute
                                        inset-0
                                        bg-black/20
                                    " />


                                    {/* FAVORITE */}

                                    <button

                                        onClick={() =>
                                            toggleFavorite(
                                                product.product_id
                                            )
                                        }

                                        className="
                                            absolute
                                            top-4
                                            right-4
                                            bg-white/80
                                            backdrop-blur-md
                                            rounded-full
                                            w-12
                                            h-12
                                            text-2xl
                                            shadow-lg
                                            hover:scale-125
                                            active:scale-90
                                            transition-all
                                            duration-200
                                        "
                                    >

                                        {
                                            isFavorite(
                                                product.product_id
                                            )

                                                ?

                                                "❤️"

                                                :

                                                "🤍"
                                        }

                                    </button>

                                </div>


                                {/* CONTENT */}

                                <div className="p-4">

                                    <h3 className="
                                        text-xl
                                        font-semibold
                                        mb-3
                                        line-clamp-2
                                        min-h-[56px]
                                    ">

                                        {
                                            product.product_name
                                        }

                                    </h3>


                                    <p className="
                                        text-gray-700
                                        mb-2
                                    ">

                                        💰 Giá từ:{" "}

                                        {
                                            Number(
                                                product.min_price
                                            ).toLocaleString()
                                        }

                                        {" "}đ

                                    </p>


                                    <p className="
                                        text-gray-600
                                        mb-4
                                    ">

                                        📍 Có tại:{" "}

                                        {
                                            product.total_stations
                                        }

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
                                            bg-green-500
                                            hover:bg-green-600
                                            text-white
                                            py-2
                                            rounded-xl
                                            font-semibold
                                            transition
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


            {/* =========================
                PAGINATION
            ========================= */}

            {totalPages > 1 && (

                <div className="
                    flex
                    flex-wrap
                    justify-center
                    items-center
                    gap-2
                    mt-12
                    mb-8
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
                        (page, index) => (

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

                                    key={page}

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
                                        ${
                                            currentPage === page
                                                ? "bg-green-500 text-white shadow-md"
                                                : "bg-white text-gray-700 hover:bg-green-50 shadow-sm"
                                        }
                                    `}
                                >

                                    {page}

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

        </div>

    );

}


export default ProductsPage;