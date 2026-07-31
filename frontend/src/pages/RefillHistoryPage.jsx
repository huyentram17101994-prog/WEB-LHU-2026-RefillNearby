import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";

import { IoChevronBack } from "react-icons/io5";


function RefillHistoryPage() {

    const navigate = useNavigate();


    // =========================
    // DATA
    // =========================

    const [history, setHistory] = useState([]);

    const [allHistory, setAllHistory] = useState([]);


    // =========================
    // FILTER
    // =========================

    const [filterType, setFilterType] =
        useState("all");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    // =========================
    // FETCH HISTORY
    // =========================

    const fetchHistory = async () => {

        try {

            const token =
                localStorage.getItem("token");


            const response = await api.get(

                "/refill-history/my-history",

                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }

            );


            setHistory(response.data);

            setAllHistory(response.data);

        }

        catch (error) {

            console.log(error);

        }

    };


    // =========================
    // GET DATE
    // =========================

    const getItemDate = (item) => {

        if (!item.refill_date) {
            return null;
        }


        const dateString =
            String(item.refill_date)
                .replace(" ", "T");


        const date =
            new Date(dateString);


        return isNaN(date.getTime())
            ? null
            : date;

    };


    // =========================
    // FILTER BY TYPE
    // =========================

    const handleFilterType = (type) => {

        setFilterType(type);


        // TẤT CẢ
        if (type === "all") {

            setHistory(allHistory);

            setFromDate("");

            setToDate("");

            return;

        }


        const now = new Date();


        let from = new Date();

        let to = new Date();


        // =========================
        // 7 NGÀY QUA
        // =========================

        if (type === "7days") {

            from.setDate(
                now.getDate() - 7
            );

        }


        // =========================
        // 30 NGÀY QUA
        // =========================

        else if (type === "30days") {

            from.setDate(
                now.getDate() - 30
            );

        }


        // =========================
        // 3 THÁNG QUA
        // =========================

        else if (type === "3months") {

            from.setMonth(
                now.getMonth() - 3
            );

        }


        // =========================
        // 6 THÁNG QUA
        // =========================

        else if (type === "6months") {

            from.setMonth(
                now.getMonth() - 6
            );

        }


        // =========================
        // NĂM NAY
        // =========================

        else if (type === "year") {

            from =
                new Date(
                    now.getFullYear(),
                    0,
                    1
                );

        }


        // =========================
        // SET TIME
        // =========================

        from.setHours(
            0,
            0,
            0,
            0
        );


        to.setHours(
            23,
            59,
            59,
            999
        );


        const filtered =
            allHistory.filter(item => {

                const refillDate =
                    getItemDate(item);


                if (!refillDate) {
                    return false;
                }


                return (

                    refillDate >= from &&
                    refillDate <= to

                );

            });


        setHistory(filtered);

    };


    // =========================
    // CUSTOM DATE
    // =========================

    const handleCustomFilter = () => {

        if (!fromDate || !toDate) {

            alert(
                "Vui lòng chọn đầy đủ Từ ngày và Đến ngày."
            );

            return;

        }


        const from =
            new Date(fromDate);


        const to =
            new Date(toDate);


        from.setHours(
            0,
            0,
            0,
            0
        );


        to.setHours(
            23,
            59,
            59,
            999
        );


        if (to < from) {

            alert(
                "Đến ngày phải lớn hơn hoặc bằng Từ ngày."
            );

            return;

        }


        const filtered =
            allHistory.filter(item => {

                const refillDate =
                    getItemDate(item);


                if (!refillDate) {
                    return false;
                }


                return (

                    refillDate >= from &&
                    refillDate <= to

                );

            });


        setHistory(filtered);

    };


    // =========================
    // CUSTOM DATE CHANGE
    // =========================

    const handleFilterChange = (value) => {

        setFilterType(value);


        if (value !== "custom") {

            setFromDate("");

            setToDate("");

        }

    };


    // =========================
    // USE EFFECT
    // =========================

    useEffect(() => {

        fetchHistory();

    }, []);


    // =========================
    // LOADING
    // =========================

    if (!allHistory) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-green-200
                    via-white
                    to-green-400
                "
            >

                <p className="text-xl font-semibold text-green-700">

                    Đang tải lịch sử refill...

                </p>

            </div>

        );

    }


    return (

        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-green-200
                via-white
                to-green-400
                p-6
                md:p-8
            "
        >


            {/* ========================= */}
            {/* BACK BUTTON */}
            {/* ========================= */}

            <button

                onClick={() =>
                    navigate(-1)
                }

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



            {/* ========================= */}
            {/* MAIN */}
            {/* ========================= */}

            <div
                className="
                    max-w-5xl
                    mx-auto
                "
            >


                {/* ========================= */}
                {/* HEADER */}
                {/* ========================= */}

                <div className="text-center mb-10">

                    <h1
                        className="
                            text-4xl
                            md:text-5xl
                            font-extrabold
                            text-green-700
                        "
                    >

                        📜 Lịch sử Refill

                    </h1>


                    <p
                        className="
                            text-gray-600
                            text-lg
                            mt-3
                        "
                    >

                        Theo dõi các lần refill
                        và lượng nhựa bạn đã tiết kiệm 🌱

                    </p>

                </div>



                {/* ========================= */}
                {/* FILTER */}
                {/* ========================= */}

<div
    className="
         max-w-4xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-5
                    md:p-6
                    mb-8
    "
>
    <div
        className="
            flex
            items-center
            gap-4
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


        {/* SELECT */}

        <select
            value={filterType}
            onChange={(e) => {
                setFilterType(e.target.value);

                if (e.target.value !== "custom") {
                    setFromDate("");
                    setToDate("");
                }
            }}
            className="
                flex-1
                            md:max-w-50
                            px-4
                            py-3
                            rounded-xl
                            border
                            border-gray-200
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

            <option value="90">
                3 tháng qua
            </option>

            <option value="180">
                6 tháng qua
            </option>

            <option value="year">
                Năm nay
            </option>

            <option value="custom">
                Tùy chọn ngày
            </option>
        </select>


        {/* CUSTOM DATE */}

        {filterType === "custom" && (

            <>
                

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

               

                <span className="font-semibold text-gray-700 whitespace-nowrap">
                    Đến:
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
                        whitespace-nowrap
                    "
                >
                    🔍 Lọc
                </button>

            </>

        )}

    </div>
</div>



                {/* ========================= */}
                {/* TOTAL */}
                {/* ========================= */}

                <div
                    className="
                        inline-flex
                        items-center
                        gap-2
                        bg-white/90
                        rounded-2xl
                        shadow-sm
                        px-5
                        py-3
                        mb-5
                    "
                >

                    <span
                        className="
                            text-lg
                            font-semibold
                            text-gray-700
                        "
                    >

                        🔄 Tổng số lần refill:

                    </span>


                    <span
                        className="
                            text-2xl
                            font-bold
                            text-green-600
                        "
                    >

                        {history.length}

                    </span>


                    <span
                        className="
                            text-gray-600
                        "
                    >

                        lần

                    </span>

                </div>



                {/* ========================= */}
                {/* HISTORY LIST */}
                {/* ========================= */}

                {history.length === 0 ? (

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            p-10
                            text-center
                            shadow-md
                        "
                    >

                        <p
                            className="
                                text-xl
                                text-gray-500
                            "
                        >

                            📭 Chưa có lịch sử refill
                            trong khoảng thời gian này.

                        </p>

                    </div>

                ) : (

                    <div className="space-y-4">

                        {history.map((item) => (

                            <div

                                key={item.history_id}

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


                                {/* ========================= */}
                                {/* STATION + DATE */}
                                {/* ========================= */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                        gap-2
                                    "
                                >

                                    <h2
                                        className="
                                            text-xl
                                            md:text-2xl
                                            font-bold
                                            text-gray-800
                                        "
                                    >

                                        🏪 {item.station_name}

                                    </h2>


                                    <p
                                        className="
                                            text-gray-500
                                            text-sm
                                            md:text-base
                                            whitespace-nowrap
                                        "
                                    >

                                        🕒 {item.refill_date_display}

                                    </p>

                                </div>



                                {/* ========================= */}
                                {/* PRODUCT */}
                                {/* ========================= */}

                                <p
                                    className="
                                        text-lg
                                        md:text-xl
                                        text-gray-700
                                        font-semibold
                                        mt-3
                                    "
                                >

                                    📦 {item.product_name}

                                </p>



                                {/* ========================= */}
                                {/* QUANTITY + PLASTIC */}
                                {/* ========================= */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-10
                                        gap-y-2
                                        mt-3
                                    "
                                >

                                    {/* QUANTITY */}

                                    <p
                                        className="
                                            text-lg
                                            text-gray-700
                                            font-semibold
                                        "
                                    >

                                        💧 {item.quantity} lít

                                    </p>



                                    {/* PLASTIC */}

                                    <p
                                        className="
                                            text-lg
                                            text-green-600
                                            font-semibold
                                        "
                                    >

                                        ♻️ Tiết kiệm khoảng{" "}

                                        {(
                                            item.quantity * 20
                                        ).toFixed(0)}

                                        g nhựa

                                    </p>

                                </div>


                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}


export default RefillHistoryPage;