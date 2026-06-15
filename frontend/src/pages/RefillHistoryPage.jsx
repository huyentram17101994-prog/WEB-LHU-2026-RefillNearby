import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
function RefillHistoryPage() {

    const [histories, setHistories] = useState([]);

    const navigate = useNavigate();



    // ================= FETCH HISTORY =================

    const fetchHistories = async () => {

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

            setHistories(response.data);
            console.log(response.data);
        } catch (error) {

            console.log(error);

        }

    };





    // ================= USE EFFECT =================

    useEffect(() => {

        fetchHistories();

    }, []);





    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-6xl mx-auto relative">
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
                <h1 className="text-5xl font-extrabold text-center text-green-600 mb-12">

                    📜 Lịch sử Refill

                </h1>





                {
                    histories.length === 0 ? (

                        <div className="bg-white rounded-3xl p-10 text-center shadow-md">

                            <p className="text-2xl text-gray-500">

                                Chưa có lịch sử refill

                            </p>

                        </div>

                    ) : (

                        <div className="space-y-6">

                            {
                                histories.map((item) => (

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
    🕒 {item.refill_date}
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