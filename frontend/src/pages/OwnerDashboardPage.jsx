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

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">

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

                <div className="grid md:grid-cols-3 gap-6 mb-10">

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

                    

                </div>

                {/* Favorites by station */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">


                <div className="bg-white rounded-3xl shadow-lg p-8 h-[420px] flex flex-col">

                    <h2 className="text-2xl font-semibold mb-5">

                        ❤️ Lượt yêu thích theo trạm
        <span className="text-pink-500 text-2xl font-bold">
        ({dashboard.totalStationFavorites || 0})
    </span>
                    </h2>
                    

                    <div className="space-y-3
        overflow-y-auto
        flex-1
        pr-2">

                        {dashboard.stationFavorites?.map((station) => (

                            <div
                                key={station.station_id}
                                className="
                                    flex
justify-between
items-center
bg-pink-50
rounded-xl
p-4
transition-all
duration-200
hover:bg-pink-100
hover:shadow-md
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
<div className="bg-white rounded-3xl shadow-lg p-8 h-[420px] flex flex-col">

    <h2 className="text-2xl font-semibold mb-5">

        ❤️ Lượt yêu thích theo sản phẩm 
 <span className="text-pink-500 text-2xl font-bold">
        ({dashboard.totalProductFavorites || 0})
    </span>
    </h2>

    <div className="space-y-3
        overflow-y-auto
        flex-1
        pr-2">

        {dashboard.productFavorites?.map(product => (

            <div
                key={product.product_id}
                className="
                    flex
justify-between
items-center
bg-pink-50
rounded-xl
p-4
transition-all
duration-200
hover:bg-pink-100
hover:shadow-md
                "
            >

                <span className="font-semibold">

                    {product.product_name}

                </span>

                <span className="text-pink-600 font-bold">

                    ❤️ {product.totalFavorites}

                </span>

            </div>

        ))}

    </div>

</div>

</div>
            </div>

        </div>

    );

}

export default OwnerDashboardPage;