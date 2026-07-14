import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
function OwnerStationsPage() {
    const [searchStation, setSearchStation] = useState('');
     const navigate = useNavigate();
     const [previewImage, setPreviewImage] =
    useState('');
    const [stations, setStations] = useState([]);

    const [imageFile, setImageFile] = useState(null);

    const [editingStationId, setEditingStationId] = useState(null);

    const [stationForm, setStationForm] = useState({

        station_name: '',
        address: '',
        latitude: '',
        longitude: '',
        open_time: '',
        close_time: '',
        description: '',
        image_url: ''

    });

    useEffect(() => {

        loadStations();

    }, []);

    const loadStations = async () => {

        try {

            const res =
                await api.get('/owner/my-stations');

            setStations(res.data);

        } catch (error) {

            console.log(error);

        }

    };

    const getCurrentLocation = () => {

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setStationForm({

                    ...stationForm,

                    latitude:
                        position.coords.latitude,

                    longitude:
                        position.coords.longitude

                });

            },

            () => {

                alert('Không lấy được vị trí');

            }

        );

    };

    const createStation = async () => {

        try {

            let imageUrl = '';

            if (imageFile) {

                const formData =
                    new FormData();

                formData.append(
                    'image',
                    imageFile
                );

                const uploadRes =
                    await api.post(
                        '/owner/upload-station-image',
                        formData
                    );

                imageUrl =
                    uploadRes.data.image_url;

            }

            await api.post(
                '/owner/stations',
                {
                    ...stationForm,
                    image_url: imageUrl
                }
            );

            alert('Thêm trạm thành công');

            resetForm();

            loadStations();

        } catch (error) {

            console.log(error);

        }

    };

    const editStation = (station) => {

        setEditingStationId(
            station.station_id
        );

        setImageFile(null);

        setStationForm({

            station_name:
                station.station_name,

            address:
                station.address,

            latitude:
                station.latitude,

            longitude:
                station.longitude,

            open_time:
                station.open_time,

            close_time:
                station.close_time,

            description:
                station.description,

            image_url:
                station.image_url

        });

    };

    const updateStation = async () => {

        try {

            let imageUrl =
                stationForm.image_url;

            if (imageFile) {

                const formData =
                    new FormData();

                formData.append(
                    'image',
                    imageFile
                );

                const uploadRes =
                    await api.post(
                        '/owner/upload-station-image',
                        formData
                    );

                imageUrl =
                    uploadRes.data.image_url;

            }

            await api.put(

                `/owner/stations/${editingStationId}`,

                {
                    ...stationForm,
                    image_url: imageUrl
                }

            );

            alert('Cập nhật thành công');

            resetForm();

            loadStations();

        } catch (error) {

            console.log(error);

        }

    };

    const deleteStation = async (id) => {

        if (
            !window.confirm(
                'Xóa trạm này?'
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/owner/stations/${id}`
            );

            loadStations();

        } catch (error) {

            console.log(error);

        }

    };

    const resetForm = () => {

        setEditingStationId(null);

        setImageFile(null);

        setStationForm({

            station_name: '',
            address: '',
            latitude: '',
            longitude: '',
            open_time: '',
            close_time: '',
            description: '',
            image_url: ''

        });

    };

    return (

        <div className="max-full mx-auto bg-gradient-to-br from-green-200 via-white to-green-500 min-h-screen bg-gray-100 p-8">
             
           
     {/* BACK BUTTON */}
                    <button
            onClick={() => navigate('/owner')}
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
         <div className="max-w-6xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-green-700 mb-8">

                    🏪 Quản lý trạm

                </h1>
                {/* FORM */}

                <div className="bg-white p-6 rounded-xl shadow mb-8">

                    <h2 className="text-2xl font-bold mb-4">

                        {
                            editingStationId
                                ? 'Cập nhật trạm'
                                : 'Thêm trạm'
                        }

                    </h2>

                    <input
                        placeholder="Tên trạm"
                        className=" 
                        w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
"
                        value={stationForm.station_name}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                station_name:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        placeholder="Địa chỉ"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.address}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                address:
                                    e.target.value
                            })
                        }
                    />

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="border
                            border-gray-300
                            rounded-2xl
                            bg-blue-500
                            text-white
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-400"
                    >
                        📍 Lấy vị trí hiện tại
                    </button>

                    <input
                        placeholder="Latitude"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.latitude}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                latitude:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        placeholder="Longitude"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.longitude}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                longitude:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="time"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.open_time}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                open_time:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="time"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.close_time}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                close_time:
                                    e.target.value
                            })
                        }
                    />

                    <textarea
                        placeholder="Mô tả"
                        className="w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400"
                        value={stationForm.description}
                        onChange={(e) =>
                            setStationForm({
                                ...stationForm,
                                description:
                                    e.target.value
                            })
                        }
                    />

                    <div className="mb-4">

    <label className="
                        block font-semibold mb-2">
        Hình ảnh trạm
    </label>

    <input
    type="file"
    accept="image/*"
    className="
        w-full
                        border
                            border-gray-300
                            rounded-2xl
                            mb-2
                            px-4
                            py-3
                            shadow-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-green-400
    "
    onChange={(e) => {

        const file =
            e.target.files[0];

        setImageFile(file);

        if (file) {

            setPreviewImage(
                URL.createObjectURL(file)
            );

        }

    }}
/>
{
    previewImage && (

        <div className="mt-3">

            <img
                src={previewImage}
                alt="preview"
                className="
                    w-30
                    h-30
                    object-cover
                    rounded-xl
                    border
                "
            />

        </div>

    )
}

    {
        imageFile && (
            <p className="mt-2 text-sm text-green-600">
                📷 {imageFile.name}
            </p>
        )
    }

</div>

                    <div className="mt-4 flex gap-2">

                        {
                            editingStationId ? (

                                <>
                                    <button
                                        onClick={updateStation}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded"
                                    >
                                        Cập nhật
                                    </button>

                                    <button
                                        onClick={resetForm}
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                    >
                                        Hủy
                                    </button>
                                </>

                            ) : (

                                <button
                                    onClick={createStation}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    Thêm trạm
                                </button>

                            )
                        }

                    </div>

                </div>

                {/* LIST */}

                <div className="bg-white p-6 rounded-xl shadow">
                        <input
    type="text"
    placeholder="🔍 Tìm theo tên trạm..."
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
                            focus:ring-green-400
    "
    value={searchStation}
    onChange={(e) =>
        setSearchStation(
            e.target.value
        )
    }
/>
                    <h2 className="text-2xl font-bold mb-5">

                        Danh sách trạm

                    </h2>

                    <div className="space-y-4">

                        {
                            stations
.filter((station) =>
    station.station_name
        .toLowerCase()
        .includes(
            searchStation.toLowerCase()
        )
)
.map((station) => (
                                <div
                                    key={station.station_id}
                                    className="bg-green-50 p-4 rounded-xl"
                                >

                                    <img
                                        src={`http://localhost:5000${station.image_url}`}
                                        alt={station.station_name}
                                        className="w-40 h-40 object-cover rounded mb-3"
                                    />

                                    <h3 className="font-bold text-lg">

                                        {station.station_name}

                                    </h3>

                                    <p>
                                        📍 {station.address}
                                    </p>

                                    <div className="mt-3 flex gap-2">

                                        <button
                                            onClick={() =>
                                                editStation(station)
                                            }
                                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                                        >
                                            Sửa
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteStation(
                                                    station.station_id
                                                )
                                            }
                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                        >
                                            Xóa
                                        </button>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>

            </div>


            </div>
    );

}

export default OwnerStationsPage;