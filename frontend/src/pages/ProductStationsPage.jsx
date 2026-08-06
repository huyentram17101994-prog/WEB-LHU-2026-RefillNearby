import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { IoChevronBack } from "react-icons/io5";

function ProductStationsPage() {
    const navigate = useNavigate();
    const { productName } = useParams();

    const [stations, setStations] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
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

    useEffect(() => {
        if (userLocation) {
            fetchData();
        } else {
            fetchData();
        }
    }, [userLocation]);

    const fetchData = async () => {
        try {
            const response = await api.get(
                `/products/stations/${productName}`
            );
            let data = response.data || [];

            if (userLocation) {
                data.sort(
                    (a, b) =>
                        calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            a.latitude,
                            a.longitude
                        ) -
                        calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            b.latitude,
                            b.longitude
                        )
                );
            }
            setStations(data);
        } catch (error) {
            console.log(error);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const registerNotification = async (stationId, productId) => {
        try {
            const token = localStorage.getItem("token");
            await api.post(
                "/product-notifications/register",
                {
                    station_id: stationId,
                    product_id: productId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("✅ Đã đăng ký nhận thông báo khi có hàng.");
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Đăng ký thất bại.");
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-green-300 via-white to-green-500">
            {/* KHUNG CỐ ĐỊNH MAX-W-7XL CHO TOÀN BỘ TRANG */}
            <div className="max-w-7xl mx-auto space-y-6">

                {/* NÚT QUAY LẠI CHUẨN */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700 print:hidden cursor-pointer"
                >
                    <IoChevronBack size={22} />
                    Quay lại
                </button>

                {/* TIÊU ĐỀ SẢN PHẨM */}
                <h1 className="text-4xl md:text-5xl text-green-600 text-center font-bold mb-6">
                    {productName}
                </h1>

                {/* THÔNG TIN CHI TIẾT SẢN PHẨM HERO BANNER */}
                {stations.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-md border border-white rounded-3xl p-6 shadow-xl max-w-4xl mx-auto mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-center">
                            {/* IMAGE */}
                            <div className="flex justify-center">
                                <img
                                    src={
                                        stations[0].image_url?.startsWith('/uploads')
                                            ? `http://localhost:5000${stations[0].image_url}`
                                            : stations[0].image_url
                                    }
                                    alt={stations[0].product_name}
                                    className="w-52 h-52 object-cover rounded-3xl shadow-lg border border-green-500"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="space-y-3">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    📝 Giới thiệu sản phẩm
                                </h2>

                                <p className="text-gray-700 text-lg leading-8">
                                    {stations[0].description || 'Chưa có thông tin mô tả cho sản phẩm này.'}
                                </p>

                                <div className="flex items-center gap-2 text-green-600 font-semibold pt-1">
                                    ♻️ <span>Sản phẩm có thể refill tại trạm</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DANH SÁCH CÁC TRẠM REFILL CÓ SẢN PHẨM NÀY */}
                <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b border-green-200 pb-3">
                        🏪 Trạm refill cung cấp sản phẩm ({stations.length})
                    </h2>

                    {stations.length === 0 ? (
                        <div className="bg-white/80 rounded-3xl shadow-lg p-12 text-center max-w-7xl mx-auto">
                            <div className="text-5xl mb-3">🏪</div>
                            <h3 className="text-xl font-bold text-gray-700">Chưa có trạm nào kinh doanh sản phẩm này</h3>
                            <p className="text-gray-500 mt-1">Vui lòng quay lại sau.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {stations.map((item) => (
                                <div
                                    key={item.station_id}
                                    className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between border border-white"
                                >
                                    <div className="space-y-3">
                                        {/* TOP */}
                                        <h2 className="text-xl font-bold text-gray-800 line-clamp-2" title={item.station_name}>
                                            🏪 {item.station_name}
                                        </h2>

                                        {/* ADDRESS */}
                                        <p className="text-gray-600 text-sm line-clamp-2" title={item.address}>
                                            📍 {item.address}
                                        </p>

                                        {/* INFO TAGS */}
                                        <div className="flex flex-wrap items-center gap-3 pt-1">
                                            {/* PRICE */}
                                            <span className="text-red-600 font-semibold text-base">
                                                💰 {Number(item.price).toLocaleString()} đ
                                            </span>

                                            {/* STOCK */}
                                            {item.stock_status ? (
                                                <span className="text-green-600 font-bold text-sm bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                                                    🟢 Còn hàng
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-bold text-sm bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                                    🔴 Hết hàng
                                                </span>
                                            )}

                                            {/* DISTANCE */}
                                            {userLocation && item.latitude && item.longitude && (
                                                <span className="text-gray-600 text-sm">
                                                    📏 {calculateDistance(
                                                        userLocation[0],
                                                        userLocation[1],
                                                        item.latitude,
                                                        item.longitude
                                                    ).toFixed(1)} km
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="flex items-center gap-2.5 mt-6 pt-2">
                                        {!item.stock_status && (
                                            <button
                                                onClick={() =>
                                                    registerNotification(
                                                        item.station_id,
                                                        item.product_id
                                                    )
                                                }
                                                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-xs shadow-md transition cursor-pointer"
                                            >
                                                🔔 Nhận thông báo có hàng
                                            </button>
                                        )}

                                        <button
                                            onClick={() =>
                                                navigate(`/stations/${item.station_id}`)
                                            }
                                            className={`py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-xs shadow-md transition cursor-pointer ${
                                                !item.stock_status ? 'flex-1' : 'w-full'
                                            }`}
                                        >
                                            Xem trạm
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductStationsPage;