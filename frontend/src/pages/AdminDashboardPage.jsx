import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
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
    FaTrophy,
    FaBars,
    FaBell,
    FaArrowRight,
    FaShieldAlt,
    FaSync
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [statistics, setStatistics] = useState({
        topProducts: [],
        refillByMonth: []
    });
    const [ratingStatistics, setRatingStatistics] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topStations, setTopStations] = useState([]);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pendingResetUsers, setPendingResetUsers] = useState([]);

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
            const [dashRes, statRes, ratingRes, topProdRes, topStatRes, profileRes, usersRes] = await Promise.all([
                api.get('/admin/dashboard').catch(() => ({ data: null })),
                api.get('/admin/refill-statistics').catch(() => ({ data: {} })),
                api.get('/admin/rating-statistics').catch(() => ({ data: [] })),
                api.get('/admin/refill-statistics/top-products').catch(() => ({ data: [] })),
                api.get('/admin/refill-statistics/top-stations').catch(() => ({ data: [] })),
                api.get('/auth/profile').catch(() => null),
                api.get('/admin/users').catch(() => ({ data: [] }))
            ]);

            setDashboard(dashRes.data);
            setStatistics(statRes.data || {});
            setRatingStatistics(ratingRes.data || []);
            setTopProducts(topProdRes.data || []);
            setTopStations(topStatRes.data || []);

            const allUsers = usersRes.data || [];
            const pending = allUsers.filter(u => Boolean(u.reset_requested));
            setPendingResetUsers(pending);

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

    const RatingTooltip = ({ active, payload }) => {
        if (!active || !payload || !payload.length) return null;
        const data = payload[0].payload;
        const total = ratingStatistics.reduce((sum, item) => sum + item.total, 0);
        const percent = total > 0 ? ((data.total / total) * 100).toFixed(1) : 0;

        return (
            <div className="bg-slate-900 text-white shadow-2xl rounded-2xl p-4 border border-slate-700">
                <p className="font-bold text-base text-amber-400 flex items-center gap-1">
                    ⭐ {data.rating} sao
                </p>
                <p className="text-xs text-slate-300 mt-1">
                    Số lượt đánh giá: <b className="text-white">{data.total}</b>
                </p>
                <p className="text-xs text-slate-300">
                    Tỷ lệ: <b className="text-emerald-400">{percent}%</b>
                </p>
            </div>
        );
    };

    if (loading && !dashboard) {
        return (
            <div className="min-h-screen bg-slate-100 text-slate-800 flex">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 lg:ml-72 min-w-0 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg font-bold text-slate-700">Đang tải dữ liệu Quản trị...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="min-h-screen bg-slate-100 text-slate-800 flex">
                <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <div className="flex-1 lg:ml-72 min-w-0 flex items-center justify-center min-h-screen p-6">
                    <div className="text-center bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 max-w-md w-full">
                        <span className="text-4xl block mb-3">⚠️</span>
                        <p className="text-slate-800 font-bold text-lg mb-2">Không thể kết nối dữ liệu máy chủ</p>
                        <p className="text-slate-500 text-sm mb-6">Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.</p>
                        <button 
                            onClick={loadAllData}
                            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow transition inline-flex items-center gap-2 cursor-pointer"
                        >
                            <FaSync /> Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Quản lý Người Dùng",
            value: dashboard.totalUsers || 0,
            unit: "tài khoản",
            icon: FaUsers,
            link: "/admin/users",
            bgSoft: "bg-blue-50 text-blue-700 border-blue-100",
            iconBg: "bg-blue-600 text-white",
            numColor: "text-blue-600 dark:text-blue-400"
        },
        {
            title: "Quản lý Trạm Refill",
            value: dashboard.totalStations || 0,
            unit: "trạm nạp",
            icon: FaStore,
            link: "/admin/stations",
            bgSoft: "bg-emerald-50 text-emerald-700 border-emerald-100",
            iconBg: "bg-emerald-600 text-white",
            numColor: "text-emerald-600 dark:text-emerald-400"
        },
        {
            title: "Quản lý Sản Phẩm",
            value: dashboard.totalProducts || 0,
            unit: "sản phẩm",
            icon: FaBoxes,
            link: "/admin/products",
            bgSoft: "bg-purple-50 text-purple-700 border-purple-100",
            iconBg: "bg-purple-600 text-white",
            numColor: "text-purple-600 dark:text-purple-400"
        },
        {
            title: "Lịch Sử Refill",
            value: dashboard.totalRefills || 0,
            unit: "lượt nạp",
            icon: FaRecycle,
            link: "/admin/refills",
            bgSoft: "bg-teal-50 text-teal-700 border-teal-100",
            iconBg: "bg-teal-600 text-white",
            numColor: "text-teal-600 dark:text-teal-400"
        },
        {
            title: "Thống Kê Lượng Refill",
            value: dashboard.totalQuantity || 0,
            unit: "Lít",
            icon: FaTint,
            link: "/admin/refills/statistics",
            bgSoft: "bg-cyan-50 text-cyan-700 border-cyan-100",
            iconBg: "bg-cyan-600 text-white",
            numColor: "text-cyan-600 dark:text-cyan-400"
        },
        {
            title: "Quản lý Yêu Thích",
            value: dashboard.totalFavorites || 0,
            unit: "lượt yêu thích",
            icon: FaHeart,
            link: "/admin/favorites",
            bgSoft: "bg-pink-50 text-pink-700 border-pink-100",
            iconBg: "bg-pink-600 text-white",
            numColor: "text-pink-600 dark:text-pink-400"
        },
        {
            title: "Quản lý Đánh Giá",
            value: dashboard.totalReviews || 0,
            unit: "bình luận",
            icon: FaStar,
            link: "/admin/reviews",
            bgSoft: "bg-amber-50 text-amber-700 border-amber-100",
            iconBg: "bg-amber-500 text-white",
            numColor: "text-amber-500 dark:text-amber-400"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">

            {/* LEFT SIDEBAR MENU */}
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                pendingResetCount={pendingResetUsers.length}
                currentUser={currentUser}
            />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 lg:ml-72 min-w-0 flex flex-col min-h-screen">

                {/* MAIN PAGE WORKSPACE */}
                <main className="flex-1 p-4 md:p-8 space-y-8 max-w-7xl w-full mx-auto">

                    {/* PAGE TITLE BANNER */}
                    <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition shrink-0"
                                title="Mở menu quản trị"
                            >
                                <FaBars size={18} />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                    <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl text-xl">📊</span>
                                    Tổng Quan Hệ Thống & Biểu Đồ
                                </h1>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">
                                    Tổng hợp số liệu tăng trưởng Refill, phân bố đánh giá sao và bảng xếp hạng top sản phẩm, trạm refill
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 flex-wrap">
                            {pendingResetUsers.length > 0 && (
                                <button
                                    onClick={() => navigate('/admin/users')}
                                    className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow font-bold text-xs transition animate-pulse cursor-pointer"
                                >
                                    <FaBell /> Reset Mật Khẩu ({pendingResetUsers.length})
                                </button>
                            )}

                            <button
                                onClick={loadAllData}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow transition flex items-center gap-2 cursor-pointer"
                            >
                                <FaSync className={loading ? "animate-spin" : ""} /> Cập nhật dữ liệu
                            </button>
                        </div>
                    </div>

                    {/* KPI CARDS GRID */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                                📊 Tổng Quan Chỉ Số Hệ Thống
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            {statCards.map((card, idx) => {
                                const IconComp = card.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                                                    {card.title}
                                                </p>
                                                <div className="flex items-baseline gap-1.5 mt-2">
                                                    <span className={`text-3xl font-black ${card.numColor} tracking-tight`}>
                                                        {typeof card.value === 'number' ? card.value.toLocaleString('vi-VN') : card.value}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500">
                                                        {card.unit}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-md shrink-0`}>
                                                <IconComp />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* BIỂU ĐỒ & BÁO CÁO THỐNG KÊ */}
                    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200/80 space-y-6">

                        {/* HEADER BÁO CÁO */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                            <div>
                                <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                                    <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl text-base">
                                        <FaChartBar />
                                    </span>
                                    Báo Cáo Phân Tích Biểu Đồ
                                </h2>
                                <p className="text-slate-500 text-xs mt-1">
                                    Biến động dung lượng Refill theo thời gian và tỷ lệ đánh giá thực tế
                                </p>
                            </div>
                        </div>

                        {/* BỘ LỌC THỜI GIAN */}
                        <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                            {/* Từ ngày */}
                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                                <FaCalendarAlt className="text-emerald-600 shrink-0" />
                                <span>Từ ngày:</span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="bg-transparent outline-none cursor-pointer"
                                />
                            </div>

                            {/* Đến ngày */}
                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                                <FaCalendarAlt className="text-emerald-600 shrink-0" />
                                <span>Đến ngày:</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="bg-transparent outline-none cursor-pointer"
                                />
                            </div>

                            <button
                                onClick={loadDashboardFilter}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <FaFilter size={11} /> Lọc dữ liệu
                            </button>

                            {(fromDate || toDate) && (
                                <button
                                    onClick={clearFilter}
                                    className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <FaUndo size={11} /> Xóa bộ lọc
                                </button>
                            )}
                        </div>

                        {/* BIỂU ĐỒ 1 & 2 */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">

                            {/* BIỂU ĐỒ LƯỢNG REFILL THEO THÁNG */}
                            <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-5 space-y-4">
                                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                    📈 Lượng Refill Theo Tháng (Lít)
                                </h3>
                                <div className="h-[320px] w-full">
                                    {statistics.refillByMonth && statistics.refillByMonth.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={statistics.refillByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                                <XAxis dataKey="month" tickFormatter={(val) => `Thg ${val}`} tick={{ fontSize: 11, fill: '#64748b' }} />
                                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                                                <Tooltip formatter={(value) => [`${value} lít`, "Đã Refill"]} labelFormatter={(label) => `Tháng ${label}`} contentStyle={{ borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                                <Bar dataKey="totalQuantity" fill="#059669" radius={[8, 8, 0, 0]} barSize={32} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                                            Chưa có dữ liệu Refill theo tháng
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* BIỂU ĐỒ PHÂN BỐ ĐÁNH GIÁ */}
                            <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-5 space-y-4">
                                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                                    ⭐ Phân Bố Đánh Giá Theo Sao
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
                                        <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                                            Chưa có dữ liệu phân bố đánh giá
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* TOP 5 SẢN PHẨM & TOP 5 TRẠM */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-4">

                            {/* TOP 5 SẢN PHẨM */}
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <FaTrophy className="text-amber-500" /> Top 5 Sản Phẩm Refill Nhiều Nhất
                                </h3>

                                {(() => {
                                    const totalRefill = topProducts.reduce((sum, item) => sum + item.total_quantity, 0) || 1;
                                    const barColors = ["bg-amber-400", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-slate-400"];

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
                                                                        <p className="font-bold text-slate-800">{item.product_name}</p>
                                                                        <p className="text-[11px] text-slate-400">Chiếm {percent}% tổng lượng</p>
                                                                    </div>
                                                                </div>
                                                                <span className="font-extrabold text-purple-700">{item.total_quantity} Lít</span>
                                                            </div>
                                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className={`${barColors[index]} h-full rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 text-xs text-slate-400 italic">Chưa có dữ liệu top sản phẩm</div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* TOP 5 TRẠM REFILL */}
                            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <FaTrophy className="text-amber-500" /> Top 5 Trạm Refill Hoạt Động Nhiều Nhất
                                </h3>

                                {(() => {
                                    const totalQuantity = topStations.reduce((sum, item) => sum + item.totalQuantity, 0) || 1;
                                    const barColors = ["bg-amber-400", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-slate-400"];

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
                                                                        <p className="font-bold text-slate-800">{item.station_name}</p>
                                                                        <p className="text-[11px] text-slate-400">Chiếm {percent}% tổng lượng</p>
                                                                    </div>
                                                                </div>
                                                                <span className="font-extrabold text-emerald-700">{item.totalQuantity} Lít</span>
                                                            </div>
                                                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className={`${barColors[index]} h-full rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-8 text-xs text-slate-400 italic">Chưa có dữ liệu top trạm</div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

export default AdminDashboardPage;