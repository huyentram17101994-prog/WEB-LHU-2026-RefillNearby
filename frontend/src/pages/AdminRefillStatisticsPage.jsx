import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
function AdminRefillStatisticsPage() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const res =
                await api.get(
                    '/admin/refills/statistics'
                );

            setData(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    if (!data) {

        return (
            <div className="text-center mt-20 text-3xl">
                Loading...
            </div>
        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">
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
                <h1 className="text-5xl text-center font-bold text-cyan-600 mb-8">

                    💧 Thống kê lượng refill

                </h1>

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-lg
                    p-8
                    mb-8
                ">

                    <h2 className="text-xl font-semibold mb-3">

                        Tổng lượng refill

                    </h2>

                    <p className="
                        text-6xl
                        font-bold
                        text-cyan-500
                    ">

                        {data.totalQuantity} L

                    </p>

                </div>

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
                            "
                        >

                            <span>

                                {index + 1}.
                                {' '}
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

            </div>

        </div>

    );

}

export default AdminRefillStatisticsPage;