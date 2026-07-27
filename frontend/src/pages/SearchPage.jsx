import { useEffect, useState } from 'react';

import { useSearchParams, useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import useFavorite from "../hooks/useFavorite";

function SearchPage() {

    const [stations, setStations] = useState([]);

    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword');

    const navigate = useNavigate();
    const {
    
        toggleFavorite,
    
        isFavorite
    
    } = useFavorite("stations");





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

    useEffect(() => {

        searchStation();

    }, []);

    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">

         

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
        <div className="max-w-5xl mx-auto mb-10">

    <div className="text-center">

        <h1 className="text-5xl font-extrabold text-green-700 mb-3">
            🔍 Kết quả tìm kiếm
        </h1>

    </div>

</div>


            {/* STATIONS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                {
                    stations.map((station) => (

                        <div
                            key={station.station_id}
                            className="bg-white/80 backdrop-blur-lg rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300 w-72 mx-auto h-full flex flex-col"
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
                                        toggleFavorite(station.station_id)
                                    }
                                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-md rounded-full w-12 h-12 text-2xl hover:scale-110 transition"
                                >

                                  {isFavorite(station.station_id)
        ? "❤️"
        : "🤍"}


                                </button>

                            </div>

                            {/* CONTENT */}

                            <div className="p-6 flex flex-col flex-1">

                                <h2 className="text-2xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[56px] overflow-hidden">

                                    {station.station_name}

                                </h2>

                                <p className="text-black-800 mb-3 text-lg line-clamp-2 min-h-[56px] overflow-hidden">

                                    - Địa chỉ:  {station.address}

                                </p>

                                <p className="text-green-600 mb-3">

                                    - Mở cửa:  {station.open_time}
                                    {' - '}
                                    {station.close_time}

                                </p>

                                <p className="text-gray-700 leading-7 mb-3 line-clamp-2 min-h-[56px] overflow-hidden">

                                    {station.description}

                                </p>

                                <button
                                    onClick={() =>
                                        navigate(`/stations/${station.station_id}`)
                                    }
                                    className="w-full
                                                    bg-green-500
                                                    hover:bg-green-600
                                                    text-white
                                                    py-2
                                                    rounded-xl
                                                    font-semibold
                                                     mt-auto"
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