import { useEffect, useState } from 'react';

import api from '../services/api';

import { useNavigate } from 'react-router-dom';

import MapView from '../components/MapView';
import { RiLogoutCircleRLine } from "react-icons/ri";

function HomePage() {

    const [stations, setStations] = useState([]);

    const [search, setSearch] = useState('');

    const navigate = useNavigate();





    // ================= FETCH STATIONS =================

    const fetchStations = async () => {

        try {

            const response = await api.get('/stations');

            setStations(response.data);

        } catch (error) {

            console.log(error);

        }

    };





    // ================= SEARCH =================

    const searchStation = async () => {

        try {

            const response = await api.get(
                `/stations/search?keyword=${search}`
            );

            setStations(response.data);

        } catch (error) {

            console.log(error);

        }

    };





    // ================= FAVORITE =================

    const addFavorite = async (stationId) => {

        try {

            const token = localStorage.getItem('token');

            await api.post(
                '/favorites',
                {
                    station_id: stationId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert('Đã thêm vào yêu thích ❤️');

        } catch (error) {

            console.log(error);

            alert('Thêm yêu thích thất bại');

        }

    };





    // ================= USE EFFECT =================

    useEffect(() => {

    fetchStations();

}, []);


const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

};


    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">




            {/* HEADER */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">




                {/* LEFT */}

                <div>

                    <h1 className="text-5xl font-extrabold text-green-700 mb-2">

                        🌱 Refill Nearby

                    </h1>





                    <p className="text-gray-600 text-lg">

                        Tìm trạm refill gần bạn dễ dàng.

                    </p>

                </div>





                {/* RIGHT MENU */}

                <div className="relative z-50">

                    <details>

                        <summary className="list-none cursor-pointer bg-white px-6 py-4 rounded-2xl shadow-lg hover:bg-green-50 transition font-bold text-green-700 flex items-center gap-3">

                            ☰ Chức năng

                        </summary>





                        <div className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl p-4 bg-white">


                            <button
                                onClick={() =>
                                navigate('/products')
                             }
                            className="w-full text-left p-4 rounded-2xl hover:bg-green-50 transition"
                            >

                            📦 Xem sản phẩm refill

                            </button>


                            <button
                                onClick={() =>
                                navigate('/ocr')
                             }
                                className="w-full text-left p-4 rounded-2xl hover:bg-green-50 transition"
                            >

                             🧾 Chụp hóa đơn phân tích

                            </button>


                            <button
                                onClick={() =>
                                navigate('/statistics')
                                }
                                className="w-full text-left p-4 rounded-2xl hover:bg-green-50 transition"
                            >

                                ♻️ Thống kê lượng nhựa

                            </button>

                            <button
                                onClick={() =>
                                    navigate('/favorites')
                                }
                                className="w-full text-left p-4 rounded-2xl hover:bg-pink-50 transition"
                            >

                                ❤️ Danh sách yêu thích

                            </button>





                            <button
                                onClick={() =>
                                    navigate('/refill-history')
                                }
                                className="w-full text-left p-4 rounded-2xl hover:bg-green-50 transition"
                            >

                                📜 Lịch sử refill

                            </button>
                                <button
    onClick={logout}
    className="
        w-full
        flex items-center gap-3
        p-4
        rounded-2xl
        hover:bg-red-50
        text-red-600
        font-semibold
        transition
    "
>

    <RiLogoutCircleRLine size={22} />

    Đăng xuất

</button>
                        </div>

                    </details>

                </div>

            </div>





            {/* SEARCH */}

            <div className="mb-10">

                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm trạm refill..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    onKeyDown={(e) => {

                    if (e.key === 'Enter') {

                    navigate(
                        `/search?keyword=${search}`
                    );

                  }

}}
                    className="w-full p-5 rounded-3xl border border-gray-200 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 text-lg"
                />

            </div>


 {/* MAP */}

            <div className="mt-20 max-w-7xl mx-auto">

                <h2 className="text-4xl font-bold text-gray-800 mb-6">

                    🗺️ Xem vị trí các trạm trên bản đồ

                </h2>


                <MapView stations={stations} />
            </div>


            {/* STATIONS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {
                    stations.map((station) => (

                        <div
                            key={station.station_id}
                            className="bg-white/80 backdrop-blur-lg rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                        >




                            {/* IMAGE */}

                            <div className="relative">

                                <img
                                    src={

                                    station.image_url.startsWith('/uploads')

                                    ? `http://localhost:5000${station.image_url}`

                                    : station.image_url

                                    }

                            alt={station.station_name}
                            className="w-full h-64 object-cover rounded-lg mb-2"
                            />




                                {/* OVERLAY */}

                                <div className="absolute inset-0 bg-black/20"></div>





                                {/* FAVORITE */}

                                <button
                                    onClick={() =>
                                        addFavorite(station.station_id)
                                    }
                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full w-12 h-12 text-2xl hover:scale-110 transition"
                                >

                                    ❤️

                                </button>

                            </div>





                            {/* CONTENT */}

                            <div className="p-6">

                                <h2 className="text-3xl font-bold text-gray-800 mb-3">

                                    {station.station_name}

                                </h2>





                                <p className="text-gray-600 mb-3 text-lg">

                                    📍 {station.address}

                                </p>





                                <p className="text-gray-600 mb-4">

                                    🕒 {station.open_time}
                                    {' - '}
                                    {station.close_time}

                                </p>





                                <p className="text-gray-700 leading-7 mb-6">

                                    {station.description}

                                </p>





                                <button
                                    onClick={() =>
                                        navigate(`/stations/${station.station_id}`)
                                    }
                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-md transition"
                                >

                                    Xem chi tiết

                                </button>

                            </div>

                        </div>

                    ))
                }

            </div>





           
            </div>


    );

}

export default HomePage;