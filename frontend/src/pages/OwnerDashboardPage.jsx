import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { 
    FaUserCircle, 
    FaStore, 
    FaBoxes, 
    FaStar, 
    FaHeart, 
    FaChartBar,
    FaChartPie
} from "react-icons/fa";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    CartesianGrid
} from 'recharts';

function OwnerDashboardPage() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState({});
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Lỗi đọc user:", e);
            }
        }

        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [dashboardRes, stationsRes, profileRes] = await Promise.all([
                api.get('/owner/dashboard').catch(() => ({ data: {} })),
                api.get('/owner/my-stations').catch(() => ({ data: [] })),
                api.get('/auth/profile').catch(() => null)
            ]);

            setDashboard(dashboardRes.data || {});
            setStations(stationsRes.data || []);
            if (profileRes && profileRes.data) {
                setCurrentUser(profileRes.data);
                localStorage.setItem('user', JSON.stringify(profileRes.data));
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu Dashboard Owner:", error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Đường dẫn ảnh đại diện
    const avatarUrl = currentUser?.avatar
        ? currentUser.avatar.startsWith('/uploads')
            ? `http://localhost:5000${currentUser.avatar}`
            : currentUser.avatar
        : null;

    // ============================================
    // XỬ LÝ DỮ LIỆU BIỂU ĐỒ (RECHARTS DATA)
    // ============================================

    // 1. Dữ liệu Yêu thích theo Trạm
    const stationFavoritesData = (dashboard.stationFavorites || []).map((item) => ({
        name: item.station_name,
        favorites: item.totalFavorites,
    }));

    // 2. Dữ liệu Yêu thích theo Sản phẩm
    const productFavoritesData = (dashboard.productFavorites || []).map((item) => ({
        name: item.product_name,
        favorites: item.totalFavorites,
    }));

    // 3. Phân bố Đánh giá theo Mức sao (1 đến 5 sao)
    const RATING_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#22c55e']; // 1 -> 5 sao
    const ratingDistributionData = [1, 2, 3, 4, 5].map((star) => {
        const count = (dashboard.reviews || []).filter((r) => Number(r.rating) === star).length;
        return {
            name: `${star} ⭐`,
            star,
            count,
        };
    });

    // 4. Điểm Trung Bình Đánh Giá theo từng Trạm
    const stationRatingsChartData = (dashboard.stationRatings || []).map((item) => ({
        name: item.station_name,
        average: Number(Number(item.averageRating || 0).toFixed(1)),
        totalReviews: item.totalReviews || 0,
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* TOP HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-green-100">
                    <div className="flex items-center gap-4">
                        {/* AVATAR CHỦ TRẠM */}
                        <div 
                            onClick={() => navigate('/profile')}
                            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition group"
                            title="Bấm để đến trang Hồ sơ cá nhân"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="w-full h-full text-blue-500 p-1" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-green-800 flex items-center gap-2">
                                🏪 {currentUser?.full_name || "Chủ trạm"}
                               
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Chào mừng quay trở lại, <span className="font-bold text-blue-700">{currentUser?.full_name || "Chủ trạm"}</span>!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                        <button
                            onClick={() => navigate('/profile')}
                            className="
                                flex items-center gap-2
                                px-4 py-2.5
                                bg-blue-600
                                hover:bg-blue-700
                                text-white
                                rounded-2xl
                                shadow-md
                                hover:shadow-lg
                                transition-all
                                font-semibold
                                text-sm
                            "
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Mini Avatar" className="w-5 h-5 rounded-full object-cover border border-white shrink-0" />
                            ) : (
                                <FaUserCircle size={18} />
                            )}
                            Hồ sơ cá nhân
                        </button>
                        <button
                            onClick={logout}
                            className="
                                flex items-center gap-2
                                px-4 py-2.5
                                bg-red-500
                                hover:bg-red-600
                                text-white
                                rounded-2xl
                                shadow-md
                                hover:shadow-lg
                                transition-all
                                font-semibold
                                text-sm
                            "
                        >
                            <RiLogoutCircleRLine size={18} />
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* THỐNG KÊ TỔNG QUAN (BUSINESS STATS GRID) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* TRẠM REFILL */}
                    <div
                        onClick={() => navigate('/owner/stations')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-blue-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStore className="text-blue-600" /> Trạm sở hữu
                            </p>
                            <p className="text-4xl font-extrabold text-blue-700 mt-2">
                                {dashboard.totalStations || stations.length || 0}
                            </p>
                            <span className="text-xs text-blue-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý danh sách trạm →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            🏪
                        </div>
                    </div>

                    {/* SẢN PHẨM */}
                    <div
                        onClick={() => navigate('/owner/products')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-teal-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaBoxes className="text-teal-600" /> Sản phẩm đăng bán
                            </p>
                            <p className="text-4xl font-extrabold text-teal-700 mt-2">
                                {dashboard.totalProducts || 0}
                            </p>
                            <span className="text-xs text-teal-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý sản phẩm →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            📦
                        </div>
                    </div>

                    {/* ĐÁNH GIÁ */}
                    <div
                        onClick={() => navigate('/owner/reviews')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-amber-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStar className="text-amber-500" /> Đánh giá cửa hàng
                            </p>
                            <p className="text-4xl font-extrabold text-amber-600 mt-2">
                                {dashboard.averageRating ? Number(dashboard.averageRating).toFixed(1) : "5.0"} ⭐
                            </p>
                            <span className="text-xs text-amber-600 font-medium group-hover:underline mt-1 inline-block">
                                Xem &amp; Phản hồi đánh giá →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            ⭐
                        </div>
                    </div>

                    {/* LƯỢT YÊU THÍCH */}
                    <div
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-pink-100
                            flex items-center justify-between
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaHeart className="text-pink-500" /> Tổng yêu thích
                            </p>
                            <p className="text-4xl font-extrabold text-pink-600 mt-2">
                                {(dashboard.totalStationFavorites || 0) + (dashboard.totalProductFavorites || 0)}
                            </p>
                            <span className="text-xs text-pink-500 font-medium mt-1 inline-block">
                                ❤️ Trạm &amp; Sản phẩm
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl">
                            ❤️
                        </div>
                    </div>
                </div>

                {/* KHỐI 2: BIỂU ĐỒ THỐNG KÊ LƯỢT YÊU THÍCH (RECHARTS BAR CHARTS) */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-pink-100 space-y-6">
                    <div className="flex items-center justify-between border-b border-pink-50 pb-4">
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                            <span className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
                                <FaChartBar />
                            </span>
                            Biểu Đồ Thống Kê Lượt Yêu Thích
                        </h2>
                        <span className="text-xs text-pink-600 font-semibold bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-100">
                            ❤️ So sánh trạm &amp; sản phẩm
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* BIỂU ĐỒ CỘT YÊU THÍCH TRẠM */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                🏪 Lượt yêu thích theo Trạm Refill
                            </h3>
                            <div className="h-[250px] w-full bg-pink-50/30 p-3 rounded-2xl border border-pink-100">
                                {stationFavoritesData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stationFavoritesData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fbcfe8" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-15} textAnchor="end" />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fbcfe8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="favorites" name="Lượt yêu thích" fill="#ec4899" radius={[8, 8, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có dữ liệu yêu thích trạm
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BIỂU ĐỒ CỘT YÊU THÍCH SẢN PHẨM */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                📦 Lượt yêu thích theo Sản Phẩm
                            </h3>
                            <div className="h-[250px] w-full bg-purple-50/30 p-3 rounded-2xl border border-purple-100">
                                {productFavoritesData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={productFavoritesData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9d5ff" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-15} textAnchor="end" />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e9d5ff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="favorites" name="Lượt yêu thích" fill="#8b5cf6" radius={[8, 8, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có dữ liệu yêu thích sản phẩm
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* KHỐI 3: BIỂU ĐỒ THỐNG KÊ ĐÁNH GIÁ (RECHARTS REVIEW CHARTS) */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-amber-100 space-y-6">
                    <div className="flex items-center justify-between border-b border-amber-50 pb-4">
                        <h2 className="text-xl md:text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                            <span className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                                <FaChartPie />
                            </span>
                            Biểu Đồ Thống Kê Đánh Giá Cửa Hàng
                        </h2>
                        <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                            ⭐ Phân bố sao &amp; điểm từng trạm
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* BIỂU ĐỒ CỘT NẰM NGANG PHÂN BỐ MỨC SAO (1 - 5 SAO) */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                ⭐ Phân bố số sao từ khách hàng (1 - 5 sao)
                            </h3>
                            <div className="h-[250px] w-full bg-amber-50/30 p-3 rounded-2xl border border-amber-100">
                                {dashboard.reviews && dashboard.reviews.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={ratingDistributionData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fde68a" />
                                            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} width={55} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="count" name="Số lượt đánh giá" radius={[0, 8, 8, 0]} barSize={20}>
                                                {ratingDistributionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={RATING_COLORS[index]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có đánh giá nào từ khách hàng
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BIỂU ĐỒ ĐIỂM TRUNG BÌNH CỦA CÁC TRẠM */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                🏪 Điểm đánh giá trung bình theo Trạm (Thang 5 ⭐)
                            </h3>
                            <div className="h-[250px] w-full bg-amber-50/30 p-3 rounded-2xl border border-amber-100">
                                {stationRatingsChartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stationRatingsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fde68a" />
                                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-15} textAnchor="end" />
                                            <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#6b7280' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #fde68a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                                            <Bar dataKey="average" name="Điểm trung bình (⭐)" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có dữ liệu đánh giá trạm
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OwnerDashboardPage;