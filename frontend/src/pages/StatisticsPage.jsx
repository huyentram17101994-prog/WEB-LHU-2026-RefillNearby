import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { IoChevronBack } from "react-icons/io5";

import api from "../services/api";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";


function StatisticsPage() {

    const navigate = useNavigate();


    // ==================================================
    // STATE
    // ==================================================

    const [stats, setStats] =
        useState(null);

    const [monthlyData, setMonthlyData] =
        useState([]);

    const [filter, setFilter] =
        useState("all");

    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");

    const [loading, setLoading] =
        useState(true);


    // ==================================================
    // FORMAT DATE
    // ==================================================

    const formatDate = (date) => {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    // ==================================================
    // LẤY KHOẢNG NGÀY
    // ==================================================

    const getDateRange = (selectedFilter) => {

        const today =
            new Date();

        const end =
            new Date(today);

        let start =
            new Date(today);


        // =========================
        // TẤT CẢ
        // =========================

        if (
            selectedFilter === "all"
        ) {

            return {
                from: "",
                to: ""
            };

        }


        // =========================
        // 7 NGÀY
        // =========================

        if (
            selectedFilter === "7days"
        ) {

            start.setDate(
                today.getDate() - 6
            );

        }


        // =========================
        // 30 NGÀY
        // =========================

        if (
            selectedFilter === "30days"
        ) {

            start.setDate(
                today.getDate() - 29
            );

        }


        // =========================
        // 3 THÁNG
        // =========================

        if (
            selectedFilter === "3months"
        ) {

            start.setMonth(
                today.getMonth() - 3
            );

        }


        // =========================
        // 6 THÁNG
        // =========================

        if (
            selectedFilter === "6months"
        ) {

            start.setMonth(
                today.getMonth() - 6
            );

        }


        // =========================
        // NĂM NAY
        // =========================

        if (
            selectedFilter === "year"
        ) {

            start =
                new Date(
                    today.getFullYear(),
                    0,
                    1
                );

        }


        return {

            from:
                formatDate(start),

            to:
                formatDate(end)

        };

    };


    // ==================================================
    // FETCH STATISTICS
    // ==================================================

    const fetchStatistics = async () => {

        try {

            setLoading(true);


            const token =
                localStorage.getItem(
                    "token"
                );


            const range =
                filter === "custom"

                    ? {
                        from: fromDate,
                        to: toDate
                    }

                    : getDateRange(filter);


            const params = {};


            if (range.from) {

                params.from =
                    range.from;

            }


            if (range.to) {

                params.to =
                    range.to;

            }


            // =========================
            // THỐNG KÊ TỔNG
            // =========================

            const statsResponse =
                await api.get(

                    "/statistics/my-statistics",

                    {
                        params,

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            // =========================
            // THỐNG KÊ BIỂU ĐỒ
            // =========================

            const monthlyResponse =
                await api.get(

                    "/statistics/monthly",

                    {
                        params,

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );


            setStats(
                statsResponse.data
            );


            setMonthlyData(
                monthlyResponse.data
            );

        }

        catch (error) {

            console.log(
                "Lỗi tải thống kê:",
                error
            );

        }

        finally {

            setLoading(false);

        }

    };


    // ==================================================
    // FILTER CHANGE
    // ==================================================

    const handleFilterChange = (value) => {

        setFilter(value);


        if (
            value !== "custom"
        ) {

            setFromDate("");

            setToDate("");

        }

    };


    // ==================================================
    // USE EFFECT
    // ==================================================

    useEffect(() => {

        if (
            filter !== "custom"
        ) {

            fetchStatistics();

        }

    }, [filter]);


    // ==================================================
    // CUSTOM DATE
    // ==================================================

    const handleApplyCustomDate = () => {

        if (
            !fromDate ||
            !toDate
        ) {

            alert(
                "Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc."
            );

            return;

        }


        if (
            fromDate > toDate
        ) {

            alert(
                "Ngày bắt đầu không được lớn hơn ngày kết thúc."
            );

            return;

        }


        fetchStatistics();

    };


    // ==================================================
    // LOADING
    // ==================================================

    if (
        loading &&
        !stats
    ) {

        return (

            <div
                className="
                    min-h-screen
                    flex
                    items-center
                    justify-center
                    bg-gradient-to-br
                    from-green-100
                    via-white
                    to-green-300
                "
            >

                <p
                    className="
                        text-xl
                        font-semibold
                        text-green-700
                    "
                >

                    Đang tải thống kê...

                </p>

            </div>

        );

    }


    // ==================================================
    // RETURN
    // ==================================================

    return (

        <div
            className="
                min-h-screen
                bg-gradient-to-br
                from-green-200
                via-white
                to-green-400
                p-4
                md:p-8
            "
        >

            {/* ================================================= */}
            {/* BACK BUTTON */}
            {/* ================================================= */}

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

                <IoChevronBack
                    size={22}
                />

                Quay lại

            </button>


            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    max-w-5xl
                    mx-auto
                    text-center
                    mb-8
                "
            >

                <h1
                    className="
                        text-4xl
                        md:text-5xl
                        font-extrabold
                        text-green-700
                    "
                >

                    📊 Thống kê refill

                </h1>

                <p
                    className="
                        mt-3
                        text-gray-600
                        text-lg
                    "
                >

                    Theo dõi lượng refill và tác động
                    tích cực đến môi trường 🌱

                </p>

            </div>


            {/* ================================================= */}
            {/* FILTER */}
            {/* ================================================= */}

            <div
                className="
             max-w-3xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                    md:p-3
                    mb-8
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        gap-4
                    "
                >

                    {/* LABEL */}

                    <div
                        className="
                            font-bold
                            text-gray-700
                            whitespace-nowrap
                        "
                    >

                        📅 Thời gian :

                    </div>


                    {/* SELECT */}

                    <select

                        value={filter}

                        onChange={(e) =>
                            handleFilterChange(
                                e.target.value
                            )
                        }

                        className="
                            flex-1
                            md:max-w-50
                            px-3
                            py-2.5
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

                        <option value="7days">
                            7 ngày qua
                        </option>

                        <option value="30days">
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


                    {/* CUSTOM DATE */}

                    {filter === "custom" && (

                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                                flex-1
                            "
                        >

                            <input

                                type="date"

                                value={fromDate}

                                onChange={(e) =>
                                    setFromDate(
                                        e.target.value
                                    )
                                }

                                className="
                                    px-3
                            py-2.5
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-green-400
                                "
                            />


                            <span
                                className="
                                    hidden
                                    sm:flex
                                    items-center
                                    text-gray-500
                                    font-semibold
                                "
                            >

                                đến

                            </span>


                            <input

                                type="date"

                                value={toDate}

                                onChange={(e) =>
                                    setToDate(
                                        e.target.value
                                    )
                                }

                                className="
                                    px-3
                            py-2.5
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-green-400
                                "
                            />


                            <button

                                onClick={
                                    handleApplyCustomDate
                                }

                                className="
                                    px-4
                            py-2.5
                                   rounded-xl
                                    bg-green-500
                                    hover:bg-green-600
                                    text-white
                                    font-bold
                                    transition
                                    whitespace-nowrap
                                "
                            >

                                Lọc

                            </button>

                        </div>

                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* STATISTIC CARDS */}
            {/* ================================================= */}

            {stats && (

                <div
                    className="
                        max-w-6xl
                        mx-auto
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-5
                    "
                >

                    {/* TOTAL REFILLS */}

                    <div
                        className="
                            bg-green-100
                            border
                            border-green-500
                            rounded-3xl
                            p-6
                            shadow-lg
                            hover:-translate-y-1
                            transition
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-4
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-700
                                "
                            >

                                🔄 Lần refill

                            </h2>

                        </div>
                        <p
                            className="
                                text-5xl
                                font-extrabold
                                text-green-600
                            "
                        >

                            {stats.totalRefills}

                        </p>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            Tổng số lần refill

                        </p>

                    </div>


                    {/* TOTAL QUANTITY */}

                    <div
                        className="
                            bg-green-100
                            border
                            border-green-500
                            rounded-3xl
                            p-6
                            shadow-lg
                            hover:-translate-y-1
                            transition
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-4
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-700
                                "
                            >

                                💧 Lượng refill

                            </h2>

                           

                        </div>


                        <p
                            className="
                                text-5xl
                                font-extrabold
                                text-blue-500
                            "
                        >

                            {stats.totalQuantity}

                            <span
                                className="
                                    text-2xl
                                    ml-1
                                "
                            >
                                lít
                            </span>

                        </p>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            Tổng lượng sản phẩm

                        </p>

                    </div>


                    {/* PLASTIC */}

                    <div
                        className="
                            bg-green-100
                            border
                            border-green-500
                            rounded-3xl
                            p-6
                            shadow-lg
                            hover:-translate-y-1
                            transition
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-4
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-700
                                "
                            >

                                ♻️ Nhựa tiết kiệm

                            </h2>

                            

                        </div>


                        <p
                            className="
                                text-5xl
                                font-extrabold
                                text-green-500
                            "
                        >

                            {stats.plasticSaved}

                            <span
                                className="
                                    text-2xl
                                    ml-1
                                "
                            >
                                g
                            </span>

                        </p>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            Ước tính bao bì nhựa giảm

                        </p>

                    </div>


                    {/* CO2 */}

                    <div
                        className="
                            bg-green-100
                            border
                            border-green-500
                            rounded-3xl
                            p-6
                            shadow-lg
                            hover:-translate-y-1
                            transition
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                mb-4
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    font-bold
                                    text-gray-700
                                "
                            >

                                🌍 CO₂ giảm

                            </h2>

                            

                        </div>


                        <p
                            className="
                                text-5xl
                                font-extrabold
                                text-emerald-600
                            "
                        >

                            {stats.co2Reduced}

                            <span
                                className="
                                    text-2xl
                                    ml-1
                                "
                            >
                                kg
                            </span>

                        </p>


                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-2
                            "
                        >

                            Ước tính CO₂ giảm thải

                        </p>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* CHART */}
            {/* ================================================= */}

            <div
                className="
                    max-w-6xl
                    mx-auto
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-5
                    md:p-8
                    mt-8
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-2
                        mb-6
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                md:text-3xl
                                font-extrabold
                                text-green-700
                            "
                        >

                            📊 Biểu đồ lượng refill 

                        </h2>

                        <p
                            className="
                                text-gray-500
                                mt-1
                            "
                        >

                            Tổng lượng sản phẩm đã refill

                        </p>

                    </div>

                </div>


                {monthlyData.length > 0 ? (

                    <ResponsiveContainer
                        width="100%"
                        height={350}
                    >

                        <BarChart
                            data={monthlyData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 0,
                                bottom: 10
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="label"
                                tick={{
                                    fontSize: 13
                                }}
                            />

                            <YAxis
                                allowDecimals={false}
                            />

                            <Tooltip
                                formatter={(
                                    value
                                ) => [
                                    `${value} lít`,
                                    "Lượng refill"
                                ]}
                            />

                            <Bar
                                dataKey="total_quantity"
                                fill="#22c55e"
                                radius={[
                                    10,
                                    10,
                                    0,
                                    0
                                ]}
                                barSize={55}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                ) : (

                    <div
                        className="
                            h-[350px]
                            flex
                            items-center
                            justify-center
                            text-gray-500
                            text-lg
                        "
                    >

                        📭 Chưa có dữ liệu refill
                        trong khoảng thời gian này.

                    </div>

                )}

            </div>


            {/* ================================================= */}
            {/* FOOTER NOTE */}
            {/* ================================================= */}

            <div
                className="
                    max-w-6xl
                    mx-auto
                    text-center
                    mt-6
                    text-sm
                    text-gray-500
                "
            >

                🌱 Mỗi lần refill là một bước nhỏ
                giúp giảm rác thải nhựa.

            </div>

        </div>

    );

}


export default StatisticsPage;