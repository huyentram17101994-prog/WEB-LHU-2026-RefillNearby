import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { IoChevronBack } from "react-icons/io5";

function RefillHistoryPage() {

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const [filterType, setFilterType] = useState("all");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const ITEMS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // =====================================================
    // FETCH HISTORY
    // =====================================================

    const fetchHistory = async (
        page = 1,
        type = filterType,
        from = fromDate,
        to = toDate
    ) => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", ITEMS_PER_PAGE);
            params.append("period", type);

            if (type === "custom" && from) {
                params.append("fromDate", from);
            }

            if (type === "custom" && to) {
                params.append("toDate", to);
            }

            const response = await api.get(
                `/refill-history/my-history?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const result = response.data;

            setHistory(result.data || []);
            setTotal(result.total || 0);
            setCurrentPage(result.page || page);
            setTotalPages(result.totalPages || 0);

        } catch (error) {

            console.log("Lỗi tải lịch sử refill:", error);

            setHistory([]);
            setTotal(0);
            setTotalPages(0);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchHistory(1, "all", "", "");

    }, []);

    // =====================================================
    // FILTER
    // =====================================================

    const handleFilterType = (type) => {

        setFilterType(type);
        setCurrentPage(1);

        if (type !== "custom") {

            setFromDate("");
            setToDate("");

            fetchHistory(1, type, "", "");

        }

    };

    const handleCustomFilter = () => {

        if (!fromDate || !toDate) {

            alert("Vui lòng chọn đầy đủ Từ ngày và Đến ngày.");

            return;

        }

        if (toDate < fromDate) {

            alert("Đến ngày phải lớn hơn hoặc bằng Từ ngày.");

            return;

        }

        setCurrentPage(1);

        fetchHistory(
            1,
            "custom",
            fromDate,
            toDate
        );

    };

    const handleReset = () => {

        setFilterType("all");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);

        fetchHistory(1, "all", "", "");

    };

    // =====================================================
    // PAGINATION
    // =====================================================

    const handlePageChange = (page) => {

        if (page < 1 || page > totalPages) {
            return;
        }

        setCurrentPage(page);

        fetchHistory(
            page,
            filterType,
            fromDate,
            toDate
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };

    const getPageNumbers = () => {

        const pages = [];

        if (totalPages <= 7) {

            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;

        }

        pages.push(1);

        if (currentPage <= 4) {

            pages.push(2, 3, 4, 5, "...");
            pages.push(totalPages);

            return pages;

        }

        if (currentPage >= totalPages - 3) {

            pages.push("...");

            pages.push(
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            );

            return pages;

        }

        pages.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        );

        return pages;

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading && history.length === 0) {

        return (

            <div className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-green-200
                via-white
                to-green-400
            ">

                <p className="
                    text-xl
                    font-semibold
                    text-green-700
                ">
                    Đang tải lịch sử refill...
                </p>

            </div>

        );

    }

    return (

        <div className="
            min-h-screen
            bg-gradient-to-br
            from-green-200
            via-white
            to-green-400
            p-6
            md:p-8
        ">

            {/* BACK */}

            <button
                onClick={() => navigate(-1)}
                className="
                    flex
                    items-center
                    gap-2
                    mb-8
                    px-5
                    py-3
                    bg-white
                    rounded-full
                    shadow-md
                    hover:shadow-lg
                    hover:bg-gray-50
                    transition
                    font-semibold
                    text-gray-700
                "
            >

                <IoChevronBack size={22} />

                Quay lại

            </button>

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}

                <div className="text-center mb-10">

                    <h1 className="
                        text-4xl
                        md:text-5xl
                        font-extrabold
                        text-green-700
                    ">
                        📜 Lịch sử Refill
                    </h1>

                    <p className="
                        text-gray-600
                        text-lg
                        mt-3
                    ">
                        Theo dõi các lần refill
                        và lượng nhựa bạn đã tiết kiệm 🌱
                    </p>

                </div>

                {/* FILTER */}
<div
    className="
         max-w-3xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-4
                    md:p-3
                    mb-8
    "
>
    <div
        className="
            flex
            items-center
            gap-3
            min-w-max
        "
    >
                         {/* LABEL */}

        <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-xl">
                📅
            </span>

            <span className="font-semibold text-gray-700">
                Thời gian:
            </span>
        </div>
                        <select
                            value={filterType}
                            onChange={(e) =>
                                handleFilterType(e.target.value)
                            }
                            className="
                                border
                                border-gray-300
                                rounded-xl
                                px-3
                                py-2.5
                                bg-gray-50
                                font-semibold
                                text-gray-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-green-400
                            "
                        >

                            <option value="all">
                                Tất cả thời gian
                            </option>

                            <option value="7">
                                7 ngày qua
                            </option>

                            <option value="30">
                                30 ngày qua
                            </option>

                            <option value="3months">
                                3 tháng qua
                            </option>

                            <option value="6months">
                                6 tháng qua
                            </option>

                            <option value="year">
                                Năm nay
                            </option>

                            <option value="custom">
                                Tùy chọn ngày
                            </option>

                        </select>

                        {filterType === "custom" && (

                            <div className="
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-2
                                mx-auto
                            ">
                                
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(e.target.value)
                                    }
                                    className="
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-3
                                        py-2.5
                                        outline-none
                                        focus:ring-2
                                        focus:ring-green-400
                                    "
                                />

                                <span className="
                                    text-xl
                                    font-semibold
                                    text-gray-500
                                ">
                                    →
                                </span>

                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) =>
                                        setToDate(e.target.value)
                                    }
                                    className="
                                        border
                                        border-gray-300
                                        rounded-xl
                                        px-3
                                        py-2.5
                                        outline-none
                                        focus:ring-2
                                        focus:ring-green-400
                                        mx-auto
                                    "
                                />

                                <button
                                    onClick={handleCustomFilter}
                                    className="
                                        bg-green-500
                                        hover:bg-green-600
                                        text-white
                                        px-5
                                        py-2.5
                                        rounded-xl
                                        font-semibold
                                        transition
                                    "
                                >
                                    Lọc
                                </button>

                            </div>

                        )}

                       
                    </div>

                </div>

                {/* TOTAL */}

                <div className="
                    inline-flex
                    items-center
                    gap-2
                    bg-white/90
                    rounded-2xl
                    shadow-sm
                    px-5
                    py-3
                    mb-5
                ">

                    <span className="
                        text-lg
                        font-semibold
                        text-gray-700
                    ">
                        🔄 Tổng số lần refill:
                    </span>

                    <span className="
                        text-2xl
                        font-bold
                        text-green-600
                    ">
                        {total}
                    </span>

                    <span className="text-gray-600">
                        lần
                    </span>

                </div>

                {/* HISTORY */}

                {history.length === 0 ? (

                    <div className="
                        bg-white
                        rounded-3xl
                        p-10
                        text-center
                        shadow-md
                    ">

                        <p className="
                            text-xl
                            text-gray-500
                        ">
                            📭 Chưa có lịch sử refill
                            trong khoảng thời gian này.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {history.map((item) => (

                            <div
                                key={item.refill_id}
                                className="
                                    bg-white
                                    rounded-3xl
                                    px-6
                                    py-5
                                    shadow-md
                                    hover:shadow-lg
                                    transition
                                "
                            >

                                <div className="
                                    flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                    gap-2
                                ">

                                    <h2 className="
                                        text-xl
                                        md:text-2xl
                                        font-bold
                                        text-gray-800
                                    ">
                                        🏪 {item.station_name}
                                    </h2>

                                    <p className="
                                        text-gray-500
                                        text-sm
                                        md:text-base
                                        whitespace-nowrap
                                    ">
                                        🕒 {item.refill_date_display}
                                    </p>

                                </div>

                                <p className="
                                    text-lg
                                    md:text-xl
                                    text-gray-700
                                    font-semibold
                                    mt-3
                                ">
                                    📦 {item.product_name}
                                </p>

                                <div className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-x-10
                                    gap-y-2
                                    mt-3
                                ">

                                    <p className="
                                        text-lg
                                        text-gray-700
                                        font-semibold
                                    ">
                                        💧 {item.quantity} lít
                                    </p>

                                    <p className="
                                        text-lg
                                        text-green-600
                                        font-semibold
                                    ">
                                        ♻️ Tiết kiệm khoảng{" "}
                                        {(item.quantity * 20).toFixed(0)}
                                        g nhựa
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

                {/* PAGINATION */}

                {totalPages > 1 && (

                    <>

                        <div className="
                            flex
                            flex-wrap
                            justify-center
                            items-center
                            gap-2
                            mt-10
                        ">

                            <button
                                onClick={() =>
                                    handlePageChange(
                                        currentPage - 1
                                    )
                                }
                                disabled={currentPage === 1}
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

                            {getPageNumbers().map(
                                (page, index) => (

                                    page === "..." ? (

                                        <span
                                            key={`dots-${index}`}
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
                                            key={`page-${page}`}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`
                                                min-w-[42px]
                                                px-3
                                                py-2.5
                                                rounded-xl
                                                font-semibold
                                                transition
                                                ${
                                                    currentPage === page
                                                        ? "bg-green-500 text-white shadow-md"
                                                        : "bg-white text-gray-700 shadow-sm hover:bg-green-50"
                                                }
                                            `}
                                        >
                                            {page}
                                        </button>

                                    )

                                )
                            )}

                            <button
                                onClick={() =>
                                    handlePageChange(
                                        currentPage + 1
                                    )
                                }
                                disabled={
                                    currentPage === totalPages
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

                    </>

                )}

            </div>

        </div>

    );

}

export default RefillHistoryPage;