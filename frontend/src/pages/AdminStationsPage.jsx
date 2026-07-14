import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";

function AdminStationsPage() {

    const navigate = useNavigate();

    const [stations, setStations] = useState([]);

    const [search, setSearch] = useState('');
    const [selectedStation, setSelectedStation] = useState(null);

const [showDetail, setShowDetail] = useState(false);

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
const toggleStationStatus = async (station) => {

    try {

        const newStatus =
            station.status === "active"
                ? "inactive"
                : "active";

        await api.put(

            `/stations/${station.station_id}/status`,

            {
                status: newStatus
            }

        );

        loadStations();

    } catch (error) {

        console.log(error);

        alert("Không thể cập nhật trạng thái.");

    }

};
const viewStationDetail = async (stationId) => {

    try {

        const res = await api.get(
            `/admin/stations/${stationId}`
        );

        setSelectedStation(res.data);

        setShowDetail(true);

    } catch (error) {

        console.log(error);

        alert("Không thể tải thông tin trạm.");

    }

};
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
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
            <div className="max-w-8xl mx-auto">

                

                <h1 className="text-5xl text-center text-green-500 font-bold mb-8">

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
                                    Trạng thái
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
                                        border-gray-200
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

    {station.status === "active" ? (

        <span
            className="
                bg-green-100
                text-green-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
            "
        >
            🟢 Hoạt động
        </span>

    ) : (

        <span
            className="
                bg-red-100
                text-red-700
                px-3
                py-1
                rounded-full
                text-sm
                font-semibold
            "
        >
            🔴 Đã khóa
        </span>

    )}

</td>
                                    <td className="p-4 text-center">

                                        <div className="flex gap-2">
<button
            onClick={() =>
                viewStationDetail(station.station_id)
            }
            className="
                bg-green-500
                hover:bg-green-600
                text-white
                px-4
                py-2
                rounded-xl
                font-semibold
            "
        >
            Xem chi tiết
        </button>
 <button

    onClick={() =>
        toggleStationStatus(station)
    }

    className={`
        px-4
        py-2
        rounded-xl
        text-white
        font-semibold

        ${station.status === "active"

            ? "bg-yellow-500 hover:bg-yellow-600"

            : "bg-green-500 hover:bg-green-600"}

    `}

>

    {station.status === "active"

        ? "Khóa"

        : "Mở khóa"}

</button>
        <button
            onClick={() =>
                deleteStation(station.station_id)
            }
            className="
                bg-red-500
                hover:bg-red-600
                text-white
                px-4
                py-2
                rounded-xl
                font-semibold
            "
        >
            Xóa
        </button>
   
</div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
{
    showDetail && selectedStation && (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                flex
                items-center
                justify-center
                z-50
            "
        >

            <div
                className="
                      bg-white
        rounded-3xl
        shadow-2xl
        w-[900px]
        max-w-[90vw]
        max-h-[100vh]
        overflow-y-auto
                "
            >

          <div
    className="
        bg-green-500
        text-white
        px-6
        py-3
        rounded-t-3xl
    "
>

    <h2 className="text-3xl font-bold text-center">

        🏪 Chi tiết trạm

    </h2>

</div>

                <div className="p-6">

    <div className="grid grid-cols-2 gap-8">

        {/* Cột trái */}

        <div>

            <p className="mb-3">
                <span className="font-bold">🏪 Tên trạm:</span><br />
                {selectedStation.station_name}
            </p>

            <p className="mb-3">
                <span className="font-bold">👤 Chủ sở hữu:</span><br />
                {selectedStation.owner_name}
            </p>

            <p className="mb-3">
                <span className="font-bold">📧 Email:</span><br />
                {selectedStation.owner_email}
            </p>

            <p className="mb-3">
                <span className="font-bold">📍 Địa chỉ:</span><br />
                {selectedStation.address}
            </p>

            <p className="mb-3">
                <span className="font-bold">🕒 Giờ hoạt động:</span><br />
                {selectedStation.open_time} - {selectedStation.close_time}
            </p>

            <p className="mb-3">
                <span className="font-bold">🌍 Latitude:</span><br />
                {selectedStation.latitude}
            </p>

            <p className="mb-3">
                <span className="font-bold">🌍 Longitude:</span><br />
                {selectedStation.longitude}
            </p>

        </div>

        {/* Cột phải */}

        <div>

            <p className="font-bold mb-3">
                🖼 Hình ảnh trạm
            </p>

            {
                selectedStation.image_url ? (

                    <img
                        src={`http://localhost:5000${selectedStation.image_url}`}
                        alt={selectedStation.station_name}
                        className="
                            w-72
                            h-72
                            object-cover
                            rounded-2xl
                            border
                        "
                    />

                ) : (

                    <div
                        className="
                            h-72
                            bg-gray-100
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            text-gray-400
                        "
                    >
                        Không có hình ảnh
                    </div>

                )
            }

        </div>

    </div>

    {/* Mô tả */}

    <div className="mt-6">

        <p className="font-bold mb-2">
            📝 Mô tả
        </p>

        <div className="bg-gray-100 rounded-xl p-4">

            {selectedStation.description || "Không có mô tả"}

        </div>

    </div>

</div>
<div className=" p-4 flex justify-end">

    <button

        onClick={() => setShowDetail(false)}

        className="
            bg-green-500
            hover:bg-green-600
            text-white
            px-5
            py-2
            rounded-xl
            font-semibold
        "

    >

        Đóng

    </button>

</div>

            </div>

        </div>

    )
}
        </div>

    );

}

export default AdminStationsPage;