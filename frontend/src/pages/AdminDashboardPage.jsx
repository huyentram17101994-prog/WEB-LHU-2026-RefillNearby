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
    FaCalendarAlt, 
    FaChartBar, 
    FaRecycle, 
    FaTint, 
    FaUsers, 
    FaUndo, 
    FaFilter,
    FaTrophy
} from "react-icons/fa";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
} from "recharts";

const COLORS = [
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6"
];

function AdminDashboardPage() {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [statistics, setStatistics] = useState({
        topProducts: [],
        refillByMonth: []
    });
    const [ratingStatistics, setRatingStatistics] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topStations, setTopStations] = useState([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Lỗi đọc thông tin user:", e);
            }
        }

        loadAllData();
    }, []);

    const loadAllData = async () => {
        setLoading(true);
        try {
            const [dashRes, statRes, ratingRes, topProdRes, topStatRes, profileRes] = await Promise.all([
                api.get('/admin/dashboard').catch(() => ({ data: null })),
                api.get('/admin/refill-statistics').catch(() => ({ data: {} })),
                api.get('/admin/rating-statistics').catch(() => ({ data: [] })),
                api.get('/admin/refill-statistics/top-products').catch(() => ({ data: [] })),
                api.get('/admin/refill-statistics/top-stations').catch(() => ({ data: [] })),
                api.get('/auth/profile').catch(() => null)
            ]);

            setDashboard(dashRes.data);
            setStatistics(statRes.data || {});
            setRatingStatistics(ratingRes.data || []);
            setTopProducts(topProdRes.data || []);
            setTopStations(topStatRes.data || []);

            if (profileRes && profileRes.data) {
                setCurrentUser(profileRes.data);
                localStorage.setItem('user', JSON.stringify(profileRes.data));
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu Admin Dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardFilter = async () => {
        if (!fromDate || !toDate) {
            alert("Vui lòng chọn khoảng thời gian.");
            return;
        }

        try {
            const [dashboardRes, ratingRes] = await Promise.all([
                api.get("/admin/dashboard-statistics/filter", {
                    params: { fromDate, toDate }
                }),
                api.get("/admin/rating-statistics/filter", {
                    params: { fromDate, toDate }
                })
            ]);

            setStatistics((prev) => ({
                ...prev,
                totalQuantity: dashboardRes.data.totalQuantity,
                refillByMonth: dashboardRes.data.refillByMonth
            }));

            setTopProducts(dashboardRes.data.topProducts || []);
            setTopStations(dashboardRes.data.topStations || []);
            setRatingStatistics(ratingRes.data || []);

        } catch (err) {
            console.error("Lỗi lọc dữ liệu admin:", err);
        }
    };

    const clearFilter = async () => {
        setFromDate("");
        setToDate("");
        loadAllData();
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Đường dẫn Avatar admin
    const avatarUrl = currentUser?.avatar
        ? currentUser.avatar.startsWith('/uploads')
            ? `http://localhost:5000${currentUser.avatar}`
            : currentUser.avatar
        : null;

    // Tooltip tùy chỉnh cho biểu đồ đánh giá
    const RatingTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        const data = payload[0].payload;
        const total = ratingStatistics.reduce((sum, item) => sum + item.total, 0);
        const percent = total > 0 ? ((data.total / total) * 100).toFixed(1) : 0;

        return (
            <div className="bg-white shadow-xl rounded-2xl p-4 border border-gray-100">
                <p className="font-bold text-base text-amber-600 flex items-center gap-1">
                    ⭐ {data.rating} sao
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Số lượt đánh giá: <b className="text-gray-800">{data.total}</b>
                </p>
                <p className="text-xs text-gray-600">
                    Tỷ lệ: <b className="text-green-600">{percent}%</b>
                </p>
            </div>
        );
    };

    if (loading && !dashboard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-300">
                <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-semibold text-green-700">Đang tải dữ liệu Quản trị...</p>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 font-semibold text-xl mb-4">Không thể tải thông tin Dashboard Admin.</p>
                <button 
                    onClick={loadAllData}
                    className="px-6 py-2 bg-green-600 text-white rounded-2xl font-medium shadow hover:bg-green-700 transition"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* TOP HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg border border-green-100">
                    <div className="flex items-center gap-4">
                        {/* AVATAR ADMIN */}
                        <div 
                            onClick={() => navigate('/profile')}
                            className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100 flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition group"
                            title="Bấm để xem hồ sơ cá nhân"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <FaUserCircle className="w-full h-full text-blue-600 p-1" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 flex items-center gap-2">
                                Quản Trị Hệ Thống 🛡️
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                Chào mừng quay trở lại <span className="font-bold text-blue-700">{currentUser?.full_name || "Quản trị viên"}</span>!
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

                {/* THỐNG KÊ TỔNG QUAN (ADMIN STATS GRID) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* NGƯỜI DÙNG */}
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-blue-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaUsers className="text-blue-600" /> Người dùng
                            </p>
                            <p className="text-4xl font-extrabold text-blue-700 mt-2">
                                {dashboard.totalUsers || 0}
                            </p>
                            <span className="text-xs text-blue-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý người dùng →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            👤
                        </div>
                    </div>

                    {/* TRẠM REFILL */}
                    <div
                        onClick={() => navigate('/admin/stations')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-green-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStore className="text-green-600" /> Trạm Refill
                            </p>
                            <p className="text-4xl font-extrabold text-green-700 mt-2">
                                {dashboard.totalStations || 0}
                            </p>
                            <span className="text-xs text-green-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý trạm Refill →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            🏪
                        </div>
                    </div>

                    {/* SẢN PHẨM */}
                    <div
                        onClick={() => navigate('/admin/products')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-purple-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaBoxes className="text-purple-600" /> Sản phẩm
                            </p>
                            <p className="text-4xl font-extrabold text-purple-700 mt-2">
                                {dashboard.totalProducts || 0}
                            </p>
                            <span className="text-xs text-purple-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý sản phẩm →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            📦
                        </div>
                    </div>

                    {/* LƯỢT REFILL */}
                    <div
                        onClick={() => navigate('/admin/refills')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-emerald-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaRecycle className="text-emerald-600" /> Lượt Refill
                            </p>
                            <p className="text-4xl font-extrabold text-emerald-700 mt-2">
                                {dashboard.totalRefills || 0}
                            </p>
                            <span className="text-xs text-emerald-600 font-medium group-hover:underline mt-1 inline-block">
                                Lịch sử Refill →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            ♻️
                        </div>
                    </div>

                    {/* TỔNG LƯỢNG REFILL */}
                    <div
                        onClick={() => navigate('/admin/refills/statistics')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-cyan-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaTint className="text-cyan-600" /> Tổng lượng Refill
                            </p>
                            <p className="text-4xl font-extrabold text-cyan-700 mt-2">
                                {dashboard.totalQuantity || 0} <span className="text-lg font-bold text-cyan-600">Lít</span>
                            </p>
                            <span className="text-xs text-cyan-600 font-medium group-hover:underline mt-1 inline-block">
                                Báo cáo chi tiết →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            💧
                        </div>
                    </div>

                    {/* YÊU THÍCH */}
                    <div
                        onClick={() => navigate('/admin/favorites')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-pink-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaHeart className="text-pink-500" /> Yêu thích
                            </p>
                            <p className="text-4xl font-extrabold text-pink-600 mt-2">
                                {dashboard.totalFavorites || 0}
                            </p>
                            <span className="text-xs text-pink-500 font-medium group-hover:underline mt-1 inline-block">
                                Thống kê yêu thích →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            ❤️
                        </div>
                    </div>

                    {/* ĐÁNH GIÁ */}
                    <div
                        onClick={() => navigate('/admin/reviews')}
                        className="
                            bg-white p-6 rounded-3xl shadow-md border border-amber-100
                            cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                            flex items-center justify-between group
                        "
                    >
                        <div>
                            <p className="text-gray-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStar className="text-amber-500" /> Đánh giá
                            </p>
                            <p className="text-4xl font-extrabold text-amber-600 mt-2">
                                {dashboard.totalReviews || 0}
                            </p>
                            <span className="text-xs text-amber-600 font-medium group-hover:underline mt-1 inline-block">
                                Quản lý đánh giá →
                            </span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                            ⭐
                        </div>
                    </div>

                </div>

                {/* KHỐI BÁO CÁO THỐNG KÊ & BỘ LỌC THỜI GIAN */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-green-100 space-y-6">

                    {/* HEADER BÁO CÁO THỐNG KÊ */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 flex items-center gap-2">
                                <span className="p-2 bg-green-100 text-green-700 rounded-xl">
                                    <FaChartBar />
                                </span>
                                Báo Cáo Thống Kê Toàn Hệ Thống
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">
                                Thống kê tổng quan lượng Refill, mức độ đánh giá và top sản phẩm/trạm hoạt động hiệu quả
                            </p>
                        </div>
                    </div>

                    {/* LỌC THỜI GIAN */}
                    <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                        {/* Từ ngày */}
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">
                            <FaCalendarAlt className="text-green-600 shrink-0" />
                            <span>Từ:</span>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer"
                            />
                        </div>

                        {/* Đến ngày */}
                        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700">
                            <FaCalendarAlt className="text-green-600 shrink-0" />
                            <span>Đến:</span>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="bg-transparent outline-none cursor-pointer"
                            />
                        </div>

                        {/* BUTTON LỌC & RESET */}
                        <button
                            onClick={loadDashboardFilter}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                        >
                            <FaFilter size={11} /> Lọc dữ liệu
                        </button>

                        {(fromDate || toDate) && (
                            <button
                                onClick={clearFilter}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                            >
                                <FaUndo size={11} /> Xóa bộ lọc
                            </button>
                        )}
                    </div>

                    {/* BIỂU ĐỒ 1 & 2 */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">

                        {/* BIỂU ĐỒ LƯỢNG REFILL THEO THÁNG */}
                        <div className="bg-gradient-to-br from-green-50/50 to-white rounded-3xl border border-green-100 p-5 space-y-4">
                            <h3 className="text-lg font-extrabold text-green-900 flex items-center gap-2">
                                📈 Lượng Refill theo tháng (Lít)
                            </h3>
                            <div className="h-[320px] w-full">
                                {statistics.refillByMonth && statistics.refillByMonth.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={statistics.refillByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcfce7" />
                                            <XAxis dataKey="month" tickFormatter={(val) => `Thg ${val}`} tick={{ fontSize: 11, fill: '#4b5563' }} />
                                            <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} />
                                            <Tooltip formatter={(value) => [`${value} lít`, "Đã Refill"]} labelFormatter={(label) => `Tháng ${label}`} contentStyle={{ borderRadius: '12px', border: '1px solid #bbf7d0' }} />
                                            <Bar dataKey="totalQuantity" fill="#22c55e" radius={[8, 8, 0, 0]} barSize={32} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có dữ liệu Refill theo tháng
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BIỂU ĐỒ PHÂN BỐ ĐÁNH GIÁ */}
                        <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-3xl border border-amber-100 p-5 space-y-4">
                            <h3 className="text-lg font-extrabold text-amber-900 flex items-center gap-2">
                                ⭐ Phân bố đánh giá (Tỷ lệ số sao)
                            </h3>
                            <div className="h-[320px] w-full">
                                {ratingStatistics && ratingStatistics.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={ratingStatistics}
                                                dataKey="total"
                                                nameKey="rating"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={100}
                                                label={({ rating, percent }) => `${rating}⭐ (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {ratingStatistics.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<RatingTooltip />} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">
                                        Chưa có dữ liệu phân bố đánh giá
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* TOP 5 SẢN PHẨM & TOP 5 TRẠM */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">

                        {/* TOP 5 SẢN PHẨM */}
                        <div className="bg-white rounded-3xl border border-purple-100 p-6 space-y-4 shadow-sm">
                            <h3 className="text-xl font-extrabold text-purple-900 flex items-center gap-2">
                                <FaTrophy className="text-amber-500" /> Top 5 sản phẩm Refill nhiều nhất
                            </h3>

                            {(() => {
                                const totalRefill = topProducts.reduce((sum, item) => sum + item.total_quantity, 0) || 1;
                                const barColors = ["bg-amber-400", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-gray-400"];

                                return (
                                    <div className="space-y-4 pt-2">
                                        {topProducts.length > 0 ? (
                                            topProducts.map((item, index) => {
                                                const maxValue = topProducts[0]?.total_quantity || 1;
                                                const width = (item.total_quantity / maxValue) * 100;
                                                const percent = ((item.total_quantity / totalRefill) * 100).toFixed(1);

                                                return (
                                                    <div key={index} className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-base font-bold w-6 text-center">
                                                                    {index === 0 && "🥇"}
                                                                    {index === 1 && "🥈"}
                                                                    {index === 2 && "🥉"}
                                                                    {index > 2 && `#${index + 1}`}
                                                                </span>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{item.product_name}</p>
                                                                    <p className="text-[11px] text-gray-400">Chiếm {percent}% tổng lượng Refill</p>
                                                                </div>
                                                            </div>
                                                            <span className="font-extrabold text-purple-700">{item.total_quantity} Lít</span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`${barColors[index]} h-full rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-xs text-gray-400 italic">Chưa có dữ liệu top sản phẩm</div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                        {/* TOP 5 TRẠM REFILL */}
                        <div className="bg-white rounded-3xl border border-green-100 p-6 space-y-4 shadow-sm">
                            <h3 className="text-xl font-extrabold text-green-900 flex items-center gap-2">
                                <FaTrophy className="text-amber-500" /> Top 5 trạm Refill hoạt động nhiều nhất
                            </h3>

                            {(() => {
                                const totalQuantity = topStations.reduce((sum, item) => sum + item.totalQuantity, 0) || 1;
                                const barColors = ["bg-amber-400", "bg-green-500", "bg-blue-500", "bg-purple-500", "bg-gray-400"];

                                return (
                                    <div className="space-y-4 pt-2">
                                        {topStations.length > 0 ? (
                                            topStations.map((item, index) => {
                                                const maxValue = topStations[0]?.totalQuantity || 1;
                                                const width = (item.totalQuantity / maxValue) * 100;
                                                const percent = ((item.totalQuantity / totalQuantity) * 100).toFixed(1);

                                                return (
                                                    <div key={index} className="space-y-1.5">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className="flex items-center gap-2.5">
                                                                <span className="text-base font-bold w-6 text-center">
                                                                    {index === 0 && "🥇"}
                                                                    {index === 1 && "🥈"}
                                                                    {index === 2 && "🥉"}
                                                                    {index > 2 && `#${index + 1}`}
                                                                </span>
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{item.station_name}</p>
                                                                    <p className="text-[11px] text-gray-400">Chiếm {percent}% tổng lượng Refill</p>
                                                                </div>
                                                            </div>
                                                            <span className="font-extrabold text-green-700">{item.totalQuantity} Lít</span>
                                                        </div>
                                                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`${barColors[index]} h-full rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-xs text-gray-400 italic">Chưa có dữ liệu top trạm</div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboardPage;