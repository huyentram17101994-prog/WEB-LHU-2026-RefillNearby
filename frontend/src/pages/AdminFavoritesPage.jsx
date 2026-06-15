import { useEffect, useState } from 'react';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function AdminFavoritesPage() {

    const navigate = useNavigate();

    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {

        loadFavorites();

    }, []);

    const loadFavorites = async () => {

        try {

            const res =
                await api.get('/admin/favorites');

            setFavorites(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const filteredFavorites =
        favorites.filter(item =>

            item.full_name
                ?.toLowerCase()
                .includes(search.toLowerCase())

            ||

            item.station_name
                ?.toLowerCase()
                .includes(search.toLowerCase())

        );

    return (

        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">

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

                {/* TITLE */}

                <h1 className="text-5xl font-bold text-center text-red-500 mb-8">

                    ❤️ Quản lý yêu thích

                </h1>

                {/* SEARCH */}

                <div className="mb-6">

                    <input
                        type="text"
                        placeholder="🔍 Tìm người dùng hoặc trạm..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="
                            w-full
                            bg-white
                            border
                            border-gray-200
                            rounded-2xl
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-red-400
                        "
                    />

                </div>

                {/* TABLE */}

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-red-50 text-red-700">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Người dùng
                                </th>

                                <th className="p-4 text-left">
                                    Trạm yêu thích
                                </th>

                                <th className="p-4 text-left">
                                    Ngày thêm
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredFavorites.map(item => (

                                <tr
                                    key={item.favorite_id}
                                    className="
                                        border-b
                                        hover:bg-red-50
                                        transition
                                    "
                                >

                                    <td className="p-4">
                                        {item.favorite_id}
                                    </td>

                                    <td className="p-4 font-medium">
                                        {item.full_name}
                                    </td>

                                    <td className="p-4">
                                        {item.station_name}
                                    </td>

                                    <td className="p-4">
                                        {
                                            item.created_at
                                                ? new Date(
                                                    item.created_at
                                                ).toLocaleDateString('vi-VN')
                                                : ''
                                        }
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default AdminFavoritesPage;