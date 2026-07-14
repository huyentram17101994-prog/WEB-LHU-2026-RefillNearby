import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { IoChevronBack } from "react-icons/io5";

import api from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
function StatisticsPage() {

    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);


    // ================= FETCH STATISTICS =================

    const fetchStatistics = async () => {

        try {

            const token =
                localStorage.getItem('token');

            const response = await api.get(
                '/statistics/my-statistics',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStats(response.data);

        } catch (error) {

            console.log(error);

        }

    };

const fetchMonthlyStatistics = async () => {

    try {

        const token =
            localStorage.getItem('token');

        const response = await api.get(
            '/statistics/monthly',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMonthlyData(response.data);

        console.log(response.data);

    } catch (error) {

        console.log(error);

    }

};

    // ================= USE EFFECT =================

    useEffect(() => {

        fetchStatistics();
        fetchMonthlyStatistics();
    }, []);




    if (!stats) {

        return (

            <div className="text-center mt-20 text-3xl">

                Loading...

            </div>

        );

    }




  return (

    <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-500  p-8">
             {/* BACK BUTTON */}

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
                        transition-all
                        duration-200
                        font-semibold
                        text-gray-700
                    "
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>
        <div className="max-w-5xl mx-auto relative">

            





            {/* TITLE */}

            <h1 className="text-5xl font-bold text-center text-green-700 mb-16 mt-24">

                ♻️ Thống kê lượng nhựa đã tiết kiệm

            </h1>





            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* TOTAL REFILL */}

                <div className="bg-white rounded-3xl p-8 shadow-md">

                    <h2 className="text-2xl font-bold mb-4">

                        🔄 Tổng số lần refill

                    </h2>

                    <p className="text-5xl font-bold text-green-600">

                        {stats.totalRefills}

                    </p>

                </div>





                {/* TOTAL QUANTITY */}

                <div className="bg-white rounded-3xl p-8 shadow-md">

                    <h2 className="text-2xl font-bold mb-4">

                        💧 Tổng lượng refill

                    </h2>

                    <p className="text-5xl font-bold text-blue-500">

                        {stats.totalQuantity} lít

                    </p>

                </div>





                {/* PLASTIC SAVED */}

                <div className="bg-white rounded-3xl p-8 shadow-md">

                    <h2 className="text-2xl font-bold mb-4">

                        ♻️ Nhựa đã tiết kiệm

                    </h2>

                    <p className="text-5xl font-bold text-green-500">

                        {stats.plasticSaved} g

                    </p>

                </div>





                {/* CO2 */}

                <div className="bg-white rounded-3xl p-8 shadow-md">

                    <h2 className="text-2xl font-bold mb-4">

                        🌍 CO₂ giảm thải

                    </h2>

                    <p className="text-5xl font-bold text-emerald-600">

                        {stats.co2Reduced} kg

                    </p>

                </div>

            </div>





            {/* CHART */}

            <div className="bg-white rounded-3xl p-8 shadow-md mt-10">

                <h2 className="text-3xl font-bold mb-6 text-green-700">

                    📊 Thống kê refill theo tháng

                </h2>

                <ResponsiveContainer width="100%" height={350}>

                    <BarChart data={monthlyData}>

                        <XAxis
                            dataKey="month"
                            tickFormatter={(month) => `T${month}`}
                        />

                        <YAxis />

                        <Tooltip />

                        <Bar
                            dataKey="total_quantity"
                            fill="#22c55e"
                            radius={[10, 10, 0, 0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>

    </div>

);
    

}

export default StatisticsPage;