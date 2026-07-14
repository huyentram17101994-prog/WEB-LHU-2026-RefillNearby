import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
function RefillHistoryPage() {

    const [history, setHistory] = useState([]);
    const [allHistory, setAllHistory] = useState([]);
    const navigate = useNavigate();

    const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");


    // ================= FETCH HISTORY =================

    const fetchHistory = async () => {
        
        try {

            const token =
                localStorage.getItem('token');

            const response = await api.get(
                '/refill-history/my-history',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setHistory(response.data);
            console.log(response.data);
            setAllHistory(response.data);
        } catch (error) {

            console.log(error);

        }

    };

const handleFilter = () => {
console.log(allHistory);
    if (!fromDate || !toDate) {

        alert("Vui lòng chọn đầy đủ ngày.");

        return;

    }

    const from = new Date(fromDate);
from.setHours(0, 0, 0, 0);

const to = new Date(toDate);
to.setHours(23, 59, 59, 999);
    if (to < from) {

        alert("Đến ngày phải lớn hơn Từ ngày.");

        return;

    }

    const diffDays =

        (to - from)

        / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {

        alert("Chỉ được lọc tối đa 30 ngày.");

        return;

    }

    const filtered = allHistory.filter(item => {
          console.log(item.refill_date);
        const refillDate = new Date(
    item.refill_date.replace(" ", "T")
);
        console.log(refillDate);
        return refillDate >= from && refillDate <= to;

    });

    setHistory(filtered);

};
const resetFilter = () => {

    setHistory(allHistory);

    setFromDate("");

    setToDate("");

};



    // ================= USE EFFECT =================

    useEffect(() => {

        fetchHistory();

    }, []);





    return (

        <div className="max-full mx-auto min-h-screen bg-gradient-to-br from-green-200 via-white to-green-500 bg-gray-100 p-6">
 <button
    onClick={() => navigate(-1)}
    className="
        w-fit
        flex items-center gap-2
        mb-6
        px-5 py-3
        bg-white
        rounded-full
        shadow-md
        hover:bg-gray-50
        hover:shadow-lg
        transition-all duration-200
        text-gray-700
        font-semibold
    "
>

    <IoChevronBack size={22} />

    Quay lại

</button>

            <div className="max-w-6xl mx-auto relative p-5">
           
                <h1 className="text-5xl font-extrabold text-center text-green-600 mb-12">

                    📜 Lịch sử Refill

                </h1>
        <div className="flex justify-end mb-5">

      <div className=" w-fit
                            bg-gray
                            border
                            border-gray-300
                            rounded-2xl
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400


">

    

    <div className="flex flex-wrap items-center gap-4">
        
       <span className="font-semibold">
        Từ ngày:
    </span>
        <input

            type="date"

            value={fromDate}

            onChange={(e)=>setFromDate(e.target.value)}

            className="
                w-fit
                border
                rounded-xl
                px-1
                py-2
            "

        />

        <span className="text-xl">

            →

        </span>
        <span className="font-semibold">
        Đến ngày:
    </span>

        <input

            type="date"

            value={toDate}

            onChange={(e)=>setToDate(e.target.value)}

            className="
            w-fit
                border
                rounded-xl
                px-1
                py-2
            "

        />

        <button

            onClick={handleFilter}

            className="
                bg-green-500
                hover:bg-green-600
                text-white
                px-4
                py-3
                rounded-xl
                font-semibold
            "

        >

            🔍 Lọc

        </button>

        <button

            onClick={resetFilter}

            className="
            text-white
                bg-gray-400
                hover:bg-gray-500
                px-4
                py-3
                rounded-xl
                font-semibold
            "

        >

            Tất cả

        </button>

    </div>

</div>
</div>
<p className="text-3xl text-black mb-5">

    Số lần refill: <span className="font-bold text-green-600 mx-2">{history.length}</span>


</p>
                {
                    history.length === 0 ? (

                        <div className="bg-white rounded-3xl p-10 text-center shadow-md">

                            <p className="text-2xl text-gray-500">

                                Chưa có lịch sử refill

                            </p>

                        </div>

                    ) : (

                        <div className="space-y-6">

                            {
                                history.map((item) => (

                                    <div
                                        key={item.history_id}
                                        className="bg-white rounded-3xl p-6 shadow-md"
                                    >

                                        <div className="flex justify-between items-start">

                                            <div>

                                                <h2 className="text-2xl font-bold text-gray-800 mb-2">

                                                    {item.station_name}

                                                </h2>





                                                <p className="text-lg text-gray-600 mb-2">

                                                    📦 {item.product_name}

                                                </p>





                                                <p className="text-lg text-gray-600 mb-2">

                                                    💧 {item.quantity} lít

                                                </p>





                                                <p className="text-lg text-green-600 font-semibold">

                                                    ♻️ Tiết kiệm khoảng {' '}

                                                    {(item.quantity * 20).toFixed(0)}

                                                    g nhựa

                                                </p>

                                            </div>





                                            <p className="text-gray-500">
                                                🕒 {item.refill_date_display}
                                            </p>

                                        </div>

                                    </div>
                                ))
                            }

                                        </div>


                    )
                }

            </div>

        </div>

    );

}

export default RefillHistoryPage;