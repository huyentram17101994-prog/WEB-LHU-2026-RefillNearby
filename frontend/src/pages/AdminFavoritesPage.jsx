import { useEffect, useState } from 'react';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

function AdminFavoritesPage() {

    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');
    const [stationCount, setStationCount] = useState(null);

const [productCount, setProductCount] = useState(null);

const [topStations, setTopStations] = useState([]);

const [topProducts, setTopProducts] = useState([]);
const [fromDate, setFromDate] = useState("");

const [toDate, setToDate] = useState("");

const [showStationModal, setShowStationModal] = useState(false);

const [showProductModal, setShowProductModal] = useState(false);

    useEffect(() => {

        loadFavorites();
        fetchStationCount();
        fetchProductCount();
        fetchTopStations();
        fetchTopProducts();

    }, []);

    const loadFavorites = async () => {

    try {

        const res = await api.get(
            "/admin/favorites",
            {
                params: {
                    fromDate,
                    toDate
                }
            }
        );

        setFavorites(res.data);

    } catch (error) {

        console.log(error);

    }

};
const handleFilter = () => {

    if (!fromDate || !toDate) {

        alert("Vui lòng chọn đầy đủ ngày.");

        return;

    }

    const start = new Date(fromDate);

    const end = new Date(toDate);

    const diffDays =
        (end - start) /
        (1000 * 60 * 60 * 24);

    if (diffDays < 0) {

        alert("Ngày kết thúc phải lớn hơn ngày bắt đầu.");

        return;

    }

    if (diffDays > 30) {

        alert("Chỉ được lọc tối đa 30 ngày.");

        return;

    }

    loadFavorites();

};
const handleRefresh = () => {

    setFromDate("");

    setToDate("");

    loadFavorites();

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
            ||
            item.owner_name
             ?.toLowerCase()
                .includes(search.toLowerCase())

        );
const fetchStationCount = async () => {

    try {

        const res = await api.get(
            "/admin/favorites/station-count"
        );

        setStationCount(res.data);

    } catch (error) {

        console.log(error);

    }

};
const fetchProductCount = async () => {

    try {

        const res = await api.get(
            "/admin/favorites/product-count"
        );

        setProductCount(res.data);

    } catch (error) {

        console.log(error);

    }

};
const fetchTopStations = async () => {

    try {

        const res = await api.get(
            "/admin/favorites/top-stations"
        );

        setTopStations(res.data);

    } catch (error) {

        console.log(error);

    }

};
const fetchTopProducts = async () => {

    try {

        const res = await api.get(
            "/admin/favorites/top-products"
        );

        setTopProducts(res.data);

    } catch (error) {

        console.log(error);

    }

};
    return (

        <div className="max-full mx-auto bg-gradient-to-br from-pink-200 via-white to-pink-500 min-h-screen bg-gray-100 p-8">
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
            <div className="max-w-7xl mx-auto">

                {/* TITLE */}

                <h1 className="text-5xl font-bold text-center text-pink-600 mb-8">

                    ❤️ Quản lý yêu thích

                </h1>
       <div
    className="
        flex
        justify-center
        gap-8
        mb-8
        flex-wrap
    "
>
    {/* Card Trạm */}

    <div
    onClick={() => setShowStationModal(true)}
    className="
        w-[400px]
        bg-white
        rounded-3xl
        shadow-md
        hover:shadow-lg
        transition
        cursor-pointer
        px-5
        py-5
        flex
        items-center
        gap-4
    "
>

    <div
        className="
            w-16
            h-16
            rounded-full
            bg-pink-100
            flex
            items-center
            justify-center
            text-3xl
        "
    >
        ❤️
    </div>

    <div>

        <p className="text-gray-600 text-xl font-medium">

            Tổng lượt yêu thích trạm

        </p>

        <h2
            className="
                text-5xl
                font-bold
                text-pink-600
            "
        >

            {stationCount?.totalFavorites}

        </h2>

        <p className="text-sm text-gray-400">

            Nhấn để xem Top 5

        </p>

    </div>

</div>

    {/* Card Sản phẩm */}

<div
    onClick={() => setShowProductModal(true)}
    className="
        w-[400px]
        bg-white
        rounded-3xl
        shadow-md
        hover:shadow-lg
        transition
        cursor-pointer
        px-5
        py-5
        flex
        items-center
        gap-4
    "
>

    <div
        className="
            w-16
            h-16
            rounded-full
            bg-pink-100
            flex
            items-center
            justify-center
            text-3xl
        "
    >
        ❤️
    </div>

    <div>

        <p className="text-gray-600 text-xl font-medium">

            Tổng lượt yêu thích sản phẩm

        </p>

        <h2
            className="
                text-5xl
                font-bold
                text-pink-600
            "
        >

        {productCount?.totalFavorites}
        </h2>

        <p className="text-sm text-gray-400">

            Nhấn để xem Top 5

        </p>

    </div>

</div>
</div>
                <div className="flex flex-wrap items-end gap-4 mb-6">
{/* Tìm kiếm */}
    <div className="flex-1 min-w-[300px]">
        <input
            type="text"
            placeholder="🔍 Tìm Người dùng / Trạm / Chủ sở hữu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                w-full
                bg-white
                border
                border-gray-200
                rounded-xl
                px-4
                py-3
                shadow-sm
                focus:outline-none
                focus:ring-2
                focus:ring-pink-400
            "
        />

    </div>
    {/* Từ ngày */}
    <div>

        <label className="block font-semibold mb-2">
            📅 Từ ngày
        </label>

        <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-xl px-4 py-3"
        />

    </div>

    {/* Đến ngày */}
    <div>

        <label className="block font-semibold mb-2">
            📅 Đến ngày
        </label>

        <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-xl px-4 py-3"
        />

    </div>
{/* Nút Lọc */}
    <button
        onClick={handleFilter}
        className="
            bg-pink-400
            hover:bg-pink-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
        "
    >
        🔍 Lọc
    </button>

    {/* Nút Làm mới */}
    <button
        onClick={handleRefresh}
        className="
            bg-purple-500
            hover:bg-purple-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
        "
    >
        Làm mới
    </button>
    

    

</div>

                {/* TABLE */}

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-pink-200 text-pink-700">

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
                                    Chủ sở hữu
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
                                        border-gray-200
                                        hover:bg-pink-50
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
                                        {item.owner_name}
                                        </td>
                                    <td>{item.created_at}</td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>
{
showStationModal && (

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
            w-[500px]
            p-8
            shadow-xl
        "
    >

        <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">

                🏆 Top 5 trạm được yêu thích

            </h2>

            <button

                onClick={() =>
                    setShowStationModal(false)
                }

                className="
                    text-gray-500
                    hover:text-pink-500
                    text-2xl
                "

            >

                ✕

            </button>

        </div>

        {

            topStations.map((item, index) => (

                <div

                    key={index}

                    className="
                        flex
                        justify-between
                        py-4
                        border-b
                         border-gray-200
                    "

                >

                    <span>

                        {

                            index === 0 ? "🥇" :

                            index === 1 ? "🥈" :

                            index === 2 ? "🥉" :

                            `${index + 1}.`

                        }

                        {" "}

                        {item.station_name}

                    </span>

                    <span className="font-bold text-pink-600">

                        ❤️ {item.totalFavorites}

                    </span>

                </div>

            ))

        }

    </div>

</div>

)
}
{
showProductModal && (

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
            w-[500px]
            p-8
            shadow-xl
        "
    >

        <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold">

                🏆 Top 5 sản phẩm được yêu thích

            </h2>

            <button

                onClick={() =>
                    setShowProductModal(false)
                }

                className="
                    text-gray-500
                    hover:text-pink-500
                    text-2xl
                "

            >

                ✕

            </button>

        </div>

        {

            topProducts.map((item, index) => (

                <div

                    key={index}

                    className="
                        flex
                        justify-between
                        py-4
                        border-b
                        border-gray-200
                    "

                >

                    <span>

                        {

                            index === 0 ? "🥇" :

                            index === 1 ? "🥈" :

                            index === 2 ? "🥉" :

                            `${index + 1}.`

                        }

                        {" "}

                        {item.product_name}

                    </span>

                    <span className="font-bold text-pink-600">

                        ❤️ {item.totalFavorites}

                    </span>

                </div>

            ))

        }

    </div>

</div>

)
}
        </div>

    );

}

export default AdminFavoritesPage;