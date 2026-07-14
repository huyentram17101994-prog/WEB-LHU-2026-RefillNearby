import { useEffect, useState } from 'react';

import api from '../services/api';

import { useNavigate } from 'react-router-dom';

import MapView from '../components/MapView';
import { RiLogoutCircleRLine } from "react-icons/ri";
import useFavorite from "../hooks/useFavorite";



function HomePage() {
   
    const [stations, setStations] = useState([]);
    const [search, setSearch] = useState('');
    const [allStations, setAllStations] = useState([]);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    
const {

    toggleFavorite,

    isFavorite

} = useFavorite("stations");
    const [nearestStations, setNearestStations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
);
const [favoriteStations, setFavoriteStations] = useState([]);


    // ================= FETCH STATIONS =================

    const fetchStations = async () => {

    try {

        const response =
            await api.get('/stations');

        setStations(response.data);

        setAllStations(response.data);

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

    
const fetchFavoriteStations = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await api.get(
            "/favorites",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setFavoriteStations(res.data);

    } catch (error) {

        console.log(error);

    }

};


const loadProfile = async () => {

    try {

        const token =
            localStorage.getItem('token');

        const res =
            await api.get(
                '/auth/profile',
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        setUser(res.data);

        localStorage.setItem(
            'user',
            JSON.stringify(res.data)
        );

    } catch (error) {

        console.log(error);

    }
};
//=======================
const calculateDistance = (

    lat1,
    lon1,

    lat2,
    lon2

) => {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =

        Math.sin(dLat / 2) *
        Math.sin(dLat / 2)

        +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180)

        *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

};
const showNearestStations = () => {

    if (!userLocation) {

        alert("Không lấy được vị trí");

        return;

    }

    const nearby = allStations.filter((station) => {

        const distance = calculateDistance(

            userLocation[0],
            userLocation[1],

            station.latitude,
            station.longitude

        );

        return distance <= 30;

    });

    setStations(nearby);

};
const showAllStations = () => {

    setStations(allStations);

};

// ================= HÀM LẤY SỐ THÔNG BÁO =================
const fetchUnreadCount = async () => {

    try {

        const token = localStorage.getItem("token");

        const res = await api.get(

            "/notifications/unread-count",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        setUnreadCount(res.data.unread_count);

    }

    catch (err) {

        console.log(err);

    }

};
    // ================= USE EFFECT =================

    useEffect(() => {

    fetchStations();
    fetchFavoriteStations();
    loadProfile();
    fetchUnreadCount();
    navigator.geolocation.getCurrentPosition(

        (position) => {

            setUserLocation([

                position.coords.latitude,

                position.coords.longitude

            ]);

        },

        (error) => {

            console.log(error);

        }

    );

}, []);


const logout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

};


    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">




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
            <div className="flex items-center gap-4">
               
    {/* Badge */}

    <div
        className="
            bg-yellow-100
            text-yellow-600
            px-6 py-4
            rounded-2xl
            font-semibold
            shadow
        "
    >
        🏅 {user?.badge || 'Người dùng mới'}
    
    </div>
        {/* Notification */}
     <button

    onClick={() => navigate("/notifications")}

    className="
        relative
        bg-red-100
        p-4
        rounded-4xl
        shadow-lg
        hover:bg-gray-100
        transition
    "

>
<span className="text-2xl">
    🔔
   </span>
    {unreadCount > 0 && (

        <span
            className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                rounded-full
                w-6
                h-6
                flex
                items-center
                justify-center
                text-xs
                font-bold
            "
        >
            {unreadCount}
</span>
      )}
</button>

                <div className="relative z-[9999]">
          
                    <details>

                        <summary className="list-none cursor-pointer bg-green-200 px-6 py-4 rounded-2xl shadow-lg hover:bg-green-50 transition font-bold text-green-700 flex items-center gap-3">

                            ☰ Chức năng

                        </summary>





                        <div className="absolute right-0  z-[9999] mt-4 w-80 bg-white rounded-3xl shadow-2xl p-4 bg-white">


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
    </div>




            {/* SEARCH */}

            <div className="mb-10 max-w-7xl mx-auto">

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
                    className="w-full p-4 rounded-3xl border border-gray-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 text-lg"
                />

            </div>


 {/* MAP */}

            <div className="mt-20 max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-6">

    <h2 className="text-4xl font-bold text-gray-700">

        🗺️ Bản đồ vị trí trạm refill

    </h2>

    <div className="flex gap-3 text-xl">

    <button
        onClick={showNearestStations}
        className="
            bg-red-500
            text-gray-100
            px-3 py-1
            rounded-xl
            hover:bg-red-400
            mb-4
        "
    >
        Trạm gần tôi
    </button>

    <button
        onClick={showAllStations}
        className="
            bg-green-500
            text-gray-100
            px-3 py-1
            rounded-xl
            hover:bg-green-400
            mb-4
        "
    >
        Tất cả trạm
    </button>

</div>

</div>

                
                <MapView
    stations={stations}
/>
            </div>


            {/* STATIONS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {
                    stations.map((station) => (

                        <div
                            key={station.station_id}
                            className="bg-white/80 backdrop-blur-lg rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300 w-72 mx-auto"
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
        toggleFavorite(station.station_id)
    }
    className="
        absolute
        top-4
        right-4
        bg-white/80
        backdrop-blur-md
        rounded-full
        w-12
        h-12
        text-2xl
        hover:scale-110
        transition
    "
>

    {isFavorite(station.station_id)
        ? "❤️"
        : "🤍"}

</button>

                            </div>





                            {/* CONTENT */}

                            <div className="p-6">

                                <h2 className="text-3xl font-bold text-gray-800 mb-2">

                                    {station.station_name}

                                </h2>





                                <p className="text-black-800 mb-3">

                                    - Địa chỉ: {station.address}

                                </p>





                                <p className="text-green-600 mb-4">

                                    - Mở cửa: {station.open_time}
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
                                    className="w-full bg-green-400 hover:bg-green-600 text-white py-2 rounded-2xl text-lg font-semibold shadow-md transition"
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