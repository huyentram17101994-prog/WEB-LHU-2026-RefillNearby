import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
function AdminRefillStatisticsPage() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    console.log("Component render");
    const [fromDate, setFromDate] = useState("");
    const [topStations, setTopStations] = useState([]);
const [toDate, setToDate] = useState("");

const [filteredQuantity, setFilteredQuantity] = useState(null);

   const loadData = async () => {

    try {

        console.log("Đang gọi API statistics...");

        const res = await api.get("/admin/refills/statistics");

        console.log("Statistics:", res.data);

        setData(res.data);

        console.log("Đã setData");

    } catch (error) {

        console.error(error);

    }

};
useEffect(() => {

        loadData();
       fetchTopStations();

    }, []);
    if (!data) {

        return (
            <div className="text-center mt-20 text-3xl">
                Loading...
            </div>
        );

    }
const handleFilter = async () => {

    if (!fromDate || !toDate) {

        alert("Vui lòng chọn khoảng thời gian.");

        return;

    }

    const start = new Date(fromDate);

    const end = new Date(toDate);

    const diff =
        (end - start) / (1000 * 60 * 60 * 24);

    if (diff < 0) {

        alert("Ngày kết thúc phải lớn hơn ngày bắt đầu.");

        return;

    }

    if (diff > 30) {

        alert("Chỉ được lọc tối đa 30 ngày.");

        return;

    }

    try {

        const res = await api.get(

            `/admin/refill-statistics/filter?fromDate=${fromDate}&toDate=${toDate}`

        );

        setFilteredQuantity(
            res.data.total_quantity
        );

    } catch (error) {

        alert("Không thể thống kê.");

    }

};

const handleRefresh = () => {

    setFromDate("");

    setToDate("");

    setFilteredQuantity(null);

};
const formatDate = (date) => {

    if (!date) return "";

    const d = new Date(date);

    return d.toLocaleDateString("vi-VN");

};
async function fetchTopStations() {

    try {

        const res = await api.get(
            "/admin/refill-statistics/top-stations"
        );

        setTopStations(res.data);

    } catch (error) {

        console.log(error);

    }

}
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
<button
                    onClick={() => navigate(-1)}
                    className="
                        flex items-center gap-2
                        mb-8
                        px-5 py-3
                        bg-white
                        rounded-full
                        shadow-md
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>
            <div className="max-w-7xl mx-auto">
        
                <h1 className="text-5xl text-center font-bold text-green-600 mb-8">

                     💧 Thống kê lượng refill

                </h1>

                <div
                    className="
                        flex
                        justify-center
                        gap-8
                        mb-8
                    "
                >

                    {/* Tổng */}

                    <div
                        className="
                            w-[300px]
                            bg-white
                            rounded-3xl
                            shadow-md
                            px-5
                            py-4
                            flex
                            items-center
                            gap-2
                            mb-8 flex-wrap
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                text-2xl
                                rounded-full
                                bg-green-100
                                flex
                                items-center
                                justify-center

                            "
                        >
                            ♻️
                        </div>

                        <div>

                            <p
                                className="
                                    text-gray-600
                                    text-lg
                                    font-medium
                                "
                            >
                                Tổng lượng refill
                            </p>

                            <h2
                                className="
                                    text-5xl
                                    font-bold
                                    text-green-600
                                "
                            >
                                {data.totalQuantity} L
                            </h2>

                        </div>

                    </div>

    {/* Hôm nay */}

  <div
    className="
        w-[300px]
        bg-white
        rounded-3xl
        shadow-md
        px-5
        py-4
        flex
        items-center
        gap-2
        mb-8 ex-wrap
    "
>

    <div
        className="
            w-12
            h-12
            text-2xl
            rounded-full
            bg-green-100
            flex
            items-center
            justify-center
        "
    >
        ☀️
    </div>

    <div>

        <p
            className="
                text-gray-600
                text-lg
                font-medium
            "
        >
            Hôm nay
        </p>

        <h2
            className="
                text-5xl
                font-bold
                text-blue-600
            "
        >
            {data.todayQuantity} L
        </h2>

    </div>

</div>
    <div
    className="
        w-[300px]
        bg-white
        rounded-3xl
        shadow-md
        px-5
        py-4
        flex
        items-center
        gap-2
        mb-8 flex-wrap
    "
>

    <div
        className="
            w-12
            h-12
            text-2xl
            rounded-full
            bg-green-100
            flex
            items-center
            justify-center
        "
    >
        📆
    </div>

    <div>

        <p
            className="
                text-gray-600
                text-lg
                font-medium
            "
        >
            Tháng này
        </p>

        <h2
            className="
                text-5xl
                font-bold
                text-orange-500
            "
        >
            {data.monthQuantity} L
        </h2>

    </div>

</div>
</div>
                <div className="flex justify-end mb-8">
<div
    className="
        flex
        items-end
        gap-4
        mb-8
        flex-wrap


    "
>

    <div>

        <label className="block mb-2 font-semibold">

            📅 Từ ngày

        </label>

        <input

            type="date"

            value={fromDate}

            onChange={(e) =>
                setFromDate(e.target.value)
            }

            className="
                border
                rounded-xl
                px-4
                py-3
            "

        />

    </div>

    <div>

        <label className="block mb-2 font-semibold">

            📅 Đến ngày

        </label>

        <input

            type="date"

            value={toDate}

            onChange={(e) =>
                setToDate(e.target.value)
            }

            className="
                border
                rounded-xl
                px-4
                py-3
            "

        />

    </div>

    <button

        onClick={handleFilter}

        className="
            bg-green-500
            hover:bg-green-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
        "

    >

        🔍 Lọc

    </button>

    <button

        onClick={handleRefresh}

        className="
            bg-gray-500
            hover:bg-gray-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
        "

    >

         Làm mới

    </button>

</div>
</div>
{
    filteredQuantity !== null && (

        <div
            className="
                w-200
                mx-auto
                bg-green-50
                border
                border-green-200
                rounded-3xl
                p-6
                shadow-md
                mb-8
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                    text-gray-600
                "
            >

                📊 Tổng lượng refill
                 từ ngày <span className="font-bold text-red-700">{formatDate(fromDate)}</span> đến ngày <span className="font-bold text-red-700">{formatDate(toDate)}</span> là:

            </h2>

        

            <h1
                className="
                    text-5xl
                    font-bold
                    text-green-600
                    mt-4
                    text-center
                "
            >

                {filteredQuantity} L

            </h1>

        </div>

    )
}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                ">

                    <h2 className="
                        text-2xl
                        font-bold
                        mb-6
                        text-gray-700
                    ">

                        🏆 Top sản phẩm refill nhiều nhất

                    </h2>

                    {data.topProducts.map(
                        (item, index) => (

                        <div
                            key={index}
                            className="
                                flex
                                justify-between
                                py-4
                                border-b
                                border-gray-200
                            "
                        >

                         
    <span>

                    {index + 1}.

                    {" "}

                    {item.product_name}


                </span>

    



                            <span className="
                                font-bold
                                text-green-600
                            ">

                                {item.totalQuantity} L

                            </span>

                        </div>

                    ))}
                </div>
<div
    className="
        bg-white
        rounded-3xl
        shadow-lg
        p-8
    "
>

    <h2
        className="
            text-2xl
            font-bold
            mb-6
             text-gray-700
        "
    >

        🏆  Top trạm có lượng refill nhiều nhất

    </h2>

    {

        topStations.map((item, index) => (

            <div

                key={index}

                className="
                    flex
                    justify-between
                    py-4
                    border-b
                    border-gray-200
                "

            >

                <span>

                    {index + 1}.

                    {" "}

                    {item.station_name}

                </span>

                <span
                    className="
                        font-bold
                        text-green-600
                    "
                >

                    {item.totalQuantity} L

                </span>

            </div>

        ))

    }

</div>
</div>
            </div>

        </div>

    );

}

export default AdminRefillStatisticsPage;