import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { FaRecycle } from "react-icons/fa";


function AdminRefillHistoryPage() {

    const navigate = useNavigate();

    const [refills, setRefills] = useState([]);

    const [search, setSearch] = useState('');
    const [summary, setSummary] = useState({
    total_refills: 0,
    today_refills: 0,
    month_refills: 0
});
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {

        loadRefills();
        fetchSummary();

    }, []);

    const loadRefills = async () => {

        try {
           if (fromDate && toDate) {

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const diffDays =
        (to - from) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {

        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
        return;

    }

    if (diffDays > 30) {

        alert("Chỉ được lọc tối đa trong khoảng 30 ngày.");
        return;

    }

}

        const res = await api.get(
            "/admin/refills",
            {
                params: {
                    fromDate,
                    toDate
                }
            }
        );

        setRefills(res.data);

    } catch (error) {

        console.error(error);

    }

};
const handleRefresh = async () => {

    setFromDate('');
    setToDate('');
    setSearch('');

    try {

        const res = await api.get(
            "/admin/refills"
        );

        setRefills(res.data);

    } catch (error) {

        console.error(error);

    }

};
const fetchSummary = async () => {

    try {

        const res = await api.get(
            "/admin/refills/summary"
        );

        setSummary(res.data);

    } catch (error) {

        console.error(error);

    }

};
    const filteredRefills = refills.filter(refill =>

        refill.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        refill.station_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||
        refill.owner_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||

        refill.product_name
            ?.toLowerCase()
            .includes(search.toLowerCase())
        

    );

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
                        hover:shadow-lg
                        hover:bg-gray-50
                        transition
                        text-gray-700
                        font-semibold
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>

            <div className="max-w-7xl mx-auto">

              
                <h1 className="text-5xl text-center text-green-500 font-bold mb-8">

                    ♻️ Quản lý lượt refill

                </h1>
                <div className="max-w-5xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

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
            Tổng lượt refill
        </p>

        <h2
            className="
                text-5xl
                font-bold
                text-green-600
            "
        >
            {summary.total_refills}
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
            {summary.today_refills}
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
            {summary.month_refills}
        </h2>

    </div>

</div>

</div>

</div>

                <div className="mb-6">
                
                    <div className="flex flex-wrap items-end gap-4 mb-6">
 <div className="flex-1 min-w-[300px]">

        
        <input
            type="text"
            placeholder="🔍Tìm người dùng/trạm/chủ sở hữu/sản phẩm..."
            value={search}
            onChange={(e) =>
                setSearch(e.target.value)
            }
            className="
                w-full
                bg-white
                border
                border-gray-200
                rounded-2xl
                px-4
                py-3
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-green-400
            "
        />

    </div>
    <div>
        <label className="block font-semibold mb-2">
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
        <label className="block font-semibold mb-2">
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
<div className="flex gap-3">

            <button
                onClick={loadRefills}
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
                </div>

                <div className="bg-white rounded-3xl shadow-lg p-6 overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-50 text-green-700">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Người dùng
                                </th>

                                <th className="p-4 text-left">
                                    Trạm refill
                                </th>

                                <th className="p-4 text-left">
                                    Chủ sở hữu
                                </th>

                                <th className="p-4 text-left">
                                    Sản phẩm
                                </th>

                                <th className="p-4 text-center">
                                    Số lượng
                                </th>

                                <th className="p-4 text-left">
                                    Ngày refill
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredRefills.map(refill => (

                                <tr
                                    key={refill.refill_id}
                                    className="
                                        border-b
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    <td className="p-4">
                                        {refill.refill_id}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {refill.full_name}
                                    </td>

                                    <td className="p-4">
                                        {refill.station_name}
                                    </td>
                                    <td className="p-4">
                                        {refill.owner_name}
                                    </td>
                                    <td className="p-4">
                                        {refill.product_name}
                                    </td>

                                    <td className="p-4 text-center">

                                        <span className="
                                            px-3 py-1
                                            rounded-full
                                            bg-cyan-100
                                            text-cyan-700
                                            font-semibold
                                        ">
                                            {refill.quantity} L
                                        </span>

                                    </td>

                                    <td className="p-4">

                                        {
                                            new Date(
                                                refill.refill_date
                                            ).toLocaleDateString(
                                                'vi-VN'
                                            )
                                        }

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminRefillHistoryPage;