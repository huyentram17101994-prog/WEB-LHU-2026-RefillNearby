import { useEffect, useState } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";

function SearchPage() {

    const [stations, setStations] = useState([]);

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword');

    const navigate = useNavigate();





    // ================= SEARCH =================

    const searchStation = async () => {

        try {

            const response = await api.get(
                `/stations/search?keyword=${keyword}`
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





    useEffect(() => {

        searchStation();

    }, []);





    return (

        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-6">




         <div className="max-w-7xl mx-auto mb-10">

    {/* BACK BUTTON */}

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

    {/* TITLE */}

    <div className="text-center">

        <h1 className="text-5xl font-extrabold text-green-700 mb-3">
            🔍 Kết quả tìm kiếm
        </h1>

    </div>

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
                                src={`http://localhost:5000${station.image_url}`}
                                alt={station.station_name}
                                className="w-full h-64 object-cover"
                            />






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

export default SearchPage;