import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";

function FavoritesPage() {

    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();





    // ================= FETCH FAVORITES =================

    const fetchFavorites = async () => {

        try {

            const token = localStorage.getItem('token');

            const response = await api.get(
                '/favorites',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setFavorites(response.data);

        } catch (error) {

            console.log(error);

        }

    };





    // ================= REMOVE FAVORITE =================

    const removeFavorite = async (favoriteId) => {

        try {

            const token = localStorage.getItem('token');

            await api.delete(
                `/favorites/${favoriteId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );





            // cập nhật lại danh sách

            setFavorites(
                favorites.filter(
                    (item) =>
                        item.favorite_id !== favoriteId
                )
            );

        } catch (error) {

            console.log(error);

            alert('Xóa yêu thích thất bại');

        }

    };





    // ================= USE EFFECT =================

    useEffect(() => {

        fetchFavorites();

    }, []);





    return (

        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-green-50 p-6">




            {/* TITLE */}
            {/* BACK BUTTON */}
            <button
    onClick={() => navigate(-1)}
    className="
        flex items-center gap-2
        mb-8
        ml-2
        px-5 py-3
        bg-white
        rounded-full
        shadow-md
        hover:shadow-lg
        hover:bg-gray-50
        transition-all
        duration-200
        text-base
        font-semibold
        text-gray-700
    "
>
    <IoChevronBack size={22} />
    Quay lại
</button>
            <h1 className="text-5xl font-extrabold text-center text-pink-600 mb-12">

                ❤️ Danh sách yêu thích

            </h1>





            {/* FAVORITES */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

                {
                    favorites.map((favorite) => (

                        <div
                            key={favorite.favorite_id}
                            className="bg-white/80 backdrop-blur-lg rounded-[30px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                        >




                            {/* IMAGE */}

                            <div className="relative">

                                <img
    src={
        favorite.image_url?.startsWith('/uploads')
            ? `http://localhost:5000${favorite.image_url}`
            : favorite.image_url
    }
    alt={favorite.station_name}
    className="w-full h-64 object-cover rounded-lg mb-2"
/>





                                <div className="absolute inset-0 bg-black/20"></div>

                            </div>





                            {/* CONTENT */}

                            <div className="p-6">

                                <h2 className="text-3xl font-bold text-gray-800 mb-3">

                                    {favorite.station_name}

                                </h2>





                                <p className="text-gray-600 mb-3 text-lg">

                                    📍 {favorite.address}

                                </p>





                                <p className="text-gray-600 mb-4">

                                    🕒
                                    {
                                        favorite.open_time.replace(':', 'h')
                                    }
                                    {' - '}
                                    {
                                        favorite.close_time.replace(':', 'h')
                                    }


                                </p>





                                <p className="text-gray-700 leading-7 mb-6">

                                    {favorite.description}

                                </p>





                                {/* BUTTONS */}

                                <div className="flex gap-4">

                                    {/* DETAIL */}

                                    <button
                                        onClick={() =>
                                            navigate(`/stations/${favorite.station_id}`)
                                        }
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold shadow-md transition"
                                    >

                                        Xem chi tiết

                                    </button>





                                    {/* REMOVE */}

                                    <button
                                        onClick={() =>
                                            removeFavorite(favorite.favorite_id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-5 rounded-2xl text-2xl transition"
                                    >

                                        🗑️Xóa

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))
                }

            </div>

        </div>

    );

}

export default FavoritesPage;