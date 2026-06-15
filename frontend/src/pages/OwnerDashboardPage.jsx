import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";

function OwnerDashboardPage() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const dashboardRes =
                await api.get('/owner/dashboard');

            setDashboard(
                dashboardRes.data
            );

        } catch (error) {

            console.log(error);

        }

    };

    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('role');

        navigate('/login');

    };

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-8">

                    <h1 className="text-5xl font-bold text-green-700">
                        🏪 Owner Dashboard
                    </h1>

                    <button
                        onClick={logout}
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            rounded-lg
                        "
                    >
                        <RiLogoutCircleRLine size={22} />
                        Đăng xuất
                    </button>

                </div>

                {/* Statistics */}

                <div className="grid md:grid-cols-4 gap-6 mb-10">

                    <div
                        onClick={() => navigate('/owner/stations')}
                        className="
                            bg-white p-6 rounded-3xl shadow
                            cursor-pointer hover:shadow-xl
                        "
                    >

                        <h2 className="text-xl font-bold">
                            🏪 Tổng số trạm
                        </h2>

                        <p className="text-4xl mt-3 font-bold text-green-600">
                            {dashboard.totalStations || 0}
                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/owner/products')}
                        className="
                            bg-white p-6 rounded-3xl shadow
                            cursor-pointer hover:shadow-xl
                        "
                    >

                        <h2 className="text-xl font-bold">
                            📦 Tổng số sản phẩm
                        </h2>

                        <p className="text-4xl mt-3 font-bold text-green-600">
                            {dashboard.totalProducts || 0}
                        </p>

                    </div>

                    <div
                        onClick={() => navigate('/owner/reviews')}
                        className="
                            bg-white p-6 rounded-3xl shadow
                            cursor-pointer hover:shadow-xl
                        "
                    >

                        <h2 className="text-xl font-bold">
                            ⭐ Đánh giá
                        </h2>

                        <p className="text-lg mt-3 text-gray-600">
                            Xem đánh giá cửa hàng
                        </p>

                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow">

                        <h2 className="text-xl font-bold">
                            ❤️ Tổng lượt yêu thích
                        </h2>

                        <p className="text-4xl mt-3 font-bold text-pink-500">
                            {dashboard.totalFavorites || 0}
                        </p>

                    </div>

                </div>

                {/* Favorites by station */}

                <div className="bg-white p-6 rounded-3xl shadow">

                    <h2 className="text-2xl font-semibold mb-5">

                        ❤️ Lượt yêu thích theo trạm

                    </h2>

                    <div className="space-y-3">

                        {dashboard.stationFavorites?.map((station) => (

                            <div
                                key={station.station_id}
                                className="
                                    flex
                                    justify-between
                                    items-center
                                    bg-pink-50
                                    p-4
                                    rounded-xl
                                "
                            >

                                <span className="font-semibold">

                                    {station.station_name}

                                </span>

                                <span className="font-bold text-pink-600">

                                    ❤️ {station.totalFavorites}

                                </span>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );

}

export default OwnerDashboardPage;