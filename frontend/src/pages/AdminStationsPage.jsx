import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function AdminStationsPage() {

    const navigate = useNavigate();

    const [stations, setStations] = useState([]);

    const [search, setSearch] = useState('');

    useEffect(() => {

        loadStations();

    }, []);

    const loadStations = async () => {

        try {

            const res =
                await api.get('/admin/stations');

            setStations(res.data);

        } catch (error) {

            console.log(error);

        }

    };

   const filteredStations = stations.filter(station =>

    station.station_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    ||

    station.owner_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

);
const deleteStation = async (id) => {

    if (!window.confirm('Xóa trạm này?')) return;

    try {

        await api.delete(`/admin/stations/${id}`);

        loadStations();

    } catch (error) {

        console.log(error);

    }

};
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

                <h1 className="text-4xl text-center text-green-500 font-bold mb-8">

                    🏪 Quản lý trạm refill

                </h1>

                <input
                    type="text"
                    placeholder="🔍 Tìm tên trạm/ chủ sở hữu..."
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
                        mb-6
                        focus:outline-none
            focus:ring-2
            focus:ring-green-400

                    "
                />

                <div className="bg-white rounded-3xl shadow-lg p-6">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-green-50 text-green-700">

                                <th className="p-4 text-left">
                                    ID
                                </th>

                                <th className="p-4 text-left">
                                    Tên trạm
                                </th>

                                <th className="p-4 text-left">
                                    Chủ sở hữu
                                </th>

                                <th className="p-4 text-left">
                                    Địa chỉ
                                </th>

                                

                                <th className="p-4 text-center">
                                    Thao tác
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredStations.map(station => (

                                <tr
                                    key={station.station_id}
                                    className="
                                        border-b
                                        hover:bg-green-50
                                        transition
                                    "
                                >

                                    <td className="p-4">
                                        {station.station_id}
                                    </td>

                                    <td className="p-4 font-semibold">
                                        {station.station_name}
                                    </td>

                                    <td className="p-4">
                                        {station.owner_name}
                                    </td>

                                    <td className="p-4">
                                        {station.address}
                                    </td>

                                    
                                    <td className="p-4 text-center">

                                        <button
                                          onClick={() =>
        deleteStation(station.station_id)
    }

                                            className="
                                                bg-red-500
                                                hover:bg-red-600
                                                text-white
                                                px-4 py-2
                                                rounded-xl
                                            "
                                        >
                                            🗑 Xóa
                                        </button>

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

export default AdminStationsPage;