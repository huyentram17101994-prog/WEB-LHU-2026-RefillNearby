import { useEffect, useState } from 'react';
import api, { getImageUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { RiLogoutCircleRLine } from "react-icons/ri";
import FloatingPrintButton from '../components/FloatingPrintButton';
import { 
    FaUserCircle, 
    FaStore, 
    FaBoxes, 
    FaStar, 
    FaHeart, 
    FaChartBar,
    FaChartPie,
    FaPrint,
    FaCalendarAlt,
    FaFilter,
    FaUndo,
    FaBars
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // BỘ LỌC NGÀY CHO BIỂU ĐỒ THỐNG KÊ
    const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | '7days' | '30days' | 'custom'
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activeDateRange, setActiveDateRange] = useState({ from: '', to: '' });

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

        loadData('', '');
    }, []);

    const loadData = async (from = '', to = '') => {
        setLoading(true);
        try {
            const params = {};
            if (from && to) {
                params.fromDate = from;
                params.toDate = to;
            }

            const [dashboardRes, stationsRes, profileRes] = await Promise.all([
                api.get('/owner/dashboard', { params }).catch(() => ({ data: {} })),
                api.get('/owner/my-stations').catch(() => ({ data: [] })),
                api.get('/auth/profile').catch(() => null)
            ]);

            setDashboard(dashboardRes.data || {});
            setStations(stationsRes.data || []);
            setActiveDateRange({ from, to });

            if (profileRes && profileRes.data) {
                setCurrentUser(profileRes.data);
                localStorage.setItem('user', JSON.stringify(profileRes.data));
            }
        } catch (error) {
            console.error("Lỗi tải dashboard chủ trạm:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyDateFilter = (filterType) => {
        setDateFilter(filterType);

        if (filterType === 'all') {
            setFromDate('');
            setToDate('');
            loadData('', '');
            return;
        }

        const today = new Date();
        let from = new Date();

        if (filterType === 'today') {
            from = new Date();
        } else if (filterType === '7days') {
            from.setDate(today.getDate() - 7);
        } else if (filterType === '30days') {
            from.setDate(today.getDate() - 30);
        }

        const fromStr = from.toISOString().split('T')[0];
        const toStr = today.toISOString().split('T')[0];

        setFromDate(fromStr);
        setToDate(toStr);
        loadData(fromStr, toStr);
    };

    const handleCustomFilterSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!fromDate || !toDate) {
            alert('Vui lòng chọn đầy đủ từ ngày và đến ngày');
            return;
        }
        setDateFilter('custom');
        loadData(fromDate, toDate);
    };

    const handleResetFilter = () => {
        setDateFilter('all');
        setFromDate('');
        setToDate('');
        loadData('', '');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const avatarUrl = currentUser?.avatar ? getImageUrl(currentUser.avatar) : null;

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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 text-slate-800 flex">
                <AdminSidebar 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    currentUser={currentUser}
                />
                <div className="flex-1 lg:ml-72 min-w-0 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg font-bold text-slate-700">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    // TÍNH TOÁN ĐIỂM TRUNG BÌNH & TỔNG ĐÁNH GIÁ MẶC ĐỊNH TOÀN THỜI GIAN (KHÔNG BỊ ẢNH HƯỞNG BỞI BỘ LỌC)
    const ownerReviewsList = dashboard.reviews || [];
    const stationRatingsArr = dashboard.stationRatings || [];
    
    const calculatedAllTimeTotalReviews = stationRatingsArr.reduce((sum, item) => sum + Number(item.totalReviews || 0), 0);
    const calculatedAllTimeScoreSum = stationRatingsArr.reduce((sum, item) => sum + (Number(item.averageRating || 0) * Number(item.totalReviews || 0)), 0);
    const calculatedAllTimeAvg = calculatedAllTimeTotalReviews > 0 ? (calculatedAllTimeScoreSum / calculatedAllTimeTotalReviews) : 0;

    const totalOwnerReviews = dashboard.allTimeTotalReviews ?? (calculatedAllTimeTotalReviews > 0 ? calculatedAllTimeTotalReviews : (dashboard.totalReviews ?? ownerReviewsList.length));
    const computedAverageRating = dashboard.allTimeAverageRating !== undefined && dashboard.allTimeAverageRating !== null
        ? Number(dashboard.allTimeAverageRating).toFixed(1)
        : (calculatedAllTimeTotalReviews > 0 
            ? calculatedAllTimeAvg.toFixed(1)
            : (dashboard.averageRating && Number(dashboard.averageRating) > 0 ? Number(dashboard.averageRating).toFixed(1) : "0.0"));

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                currentUser={currentUser}
            />

            <div className="flex-1 lg:ml-72 min-w-0 flex flex-col min-h-screen">
                <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">
                    
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
                                    Tổng Quan & Biểu Đồ Thống Kê
                                </h1>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">
                                    Theo dõi chỉ số hoạt động trạm refill, thống kê đánh giá và quản lý sản phẩm
                                </p>
                            </div>
                        </div>
                    </div>

                {/* THỐNG KÊ TỔNG QUAN (BUSINESS STATS GRID) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* TRẠM REFILL */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStore className="text-blue-600" /> Trạm sở hữu
                            </p>
                            <p className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-2 tracking-tight">
                                {dashboard.totalStations || stations.length || 0}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Trạm Refill trong hệ thống
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl shrink-0">
                            🏪
                        </div>
                    </div>

                    {/* SẢN PHẨM */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaBoxes className="text-teal-600" /> Sản phẩm đăng bán
                            </p>
                            <p className="text-4xl font-black text-teal-600 dark:text-teal-400 mt-2 tracking-tight">
                                {dashboard.totalProducts || 0}
                            </p>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Danh mục sản phẩm active
                            </p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl shrink-0">
                            📦
                        </div>
                    </div>

                    {/* ĐÁNH GIÁ CỬA HÀNG */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaStar className="text-amber-500" /> Đánh giá cửa hàng
                            </p>
                            <p className="text-4xl font-black text-amber-500 dark:text-amber-400 mt-2 tracking-tight">
                                {computedAverageRating} <span className="text-2xl">⭐</span>
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                                <span>Tổng: <b className="text-blue-600 dark:text-blue-400">{totalOwnerReviews}</b> đánh giá</span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl shrink-0">
                            ⭐
                        </div>
                    </div>

                    {/* LƯỢT YÊU THÍCH */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 font-semibold text-sm flex items-center gap-1.5">
                                <FaHeart className="text-pink-500" /> Tổng yêu thích
                            </p>
                            <p className="text-4xl font-black text-pink-600 dark:text-pink-400 mt-2 tracking-tight">
                                {dashboard.allTimeTotalFavorites ?? ((dashboard.allTimeStationFavorites || 0) + (dashboard.allTimeProductFavorites || 0))}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mt-1">
                                <span>🏪 Trạm: <b className="text-pink-600">{dashboard.allTimeStationFavorites ?? 0}</b></span>
                                <span>•</span>
                                <span>📦 SP: <b className="text-purple-600">{dashboard.allTimeProductFavorites ?? 0}</b></span>
                            </div>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center text-2xl shrink-0">
                            ❤️
                        </div>
                    </div>
                </div>

                {/* KHỐI TỔNG HỢP: BÁO CÁO THỐNG KÊ & BỘ LỌC THỜI GIAN & BIỂU ĐỒ (1 CARD DUY NHẤT) */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-green-100 space-y-8">

                    {/* HEADER BÁO CÁO THỐNG KÊ */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 flex items-center gap-2">
                                <span className="p-2 bg-green-100 text-green-700 rounded-xl">
                                    <FaChartBar />
                                </span>
                                Biểu Đồ Thống Kê
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">
                                Thống kê phân bố mức độ đánh giá, lượt yêu thích trạm & sản phẩm theo khoảng thời gian
                            </p>
                        </div>
                    </div>

                    {/* LỌC THỜI GIAN GIỐNG HỆT TRANG CHỦ ADMIN */}
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
                            onClick={handleCustomFilterSubmit}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                        >
                            <FaFilter size={11} /> Lọc dữ liệu
                        </button>

                        {(fromDate || toDate) && (
                            <button
                                onClick={handleResetFilter}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                                <FaUndo size={11} /> Xóa bộ lọc
                            </button>
                        )}
                    </div>

                    {/* PHẦN 1: BIỂU ĐỒ THỐNG KÊ LƯỢT YÊU THÍCH */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
                            <h3 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center gap-2">
                                <span className="p-2 bg-pink-100 text-pink-600 rounded-xl text-base">
                                    <FaChartBar />
                                </span>
                                Biểu Đồ Thống Kê Lượt Yêu Thích
                            </h3>
                            <span className="text-xs text-pink-600 font-semibold bg-pink-50 px-3 py-1 rounded-xl border border-pink-100">
                                ❤️ So sánh trạm &amp; sản phẩm
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* BIỂU ĐỒ CỘT YÊU THÍCH TRẠM */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                    🏪 Lượt yêu thích theo Trạm Refill
                                </h4>
                                <div className="h-[240px] w-full bg-pink-50/30 p-3 rounded-2xl border border-pink-100">
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
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                    📦 Lượt yêu thích theo Sản Phẩm
                                </h4>
                                <div className="h-[240px] w-full bg-purple-50/30 p-3 rounded-2xl border border-purple-100">
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

                    {/* PHẦN 2: BIỂU ĐỒ THỐNG KÊ ĐÁNH GIÁ */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                            <h3 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center gap-2">
                                <span className="p-2 bg-amber-100 text-amber-600 rounded-xl text-base">
                                    <FaChartPie />
                                </span>
                                Biểu Đồ Thống Kê Đánh Giá Cửa Hàng
                            </h3>
                            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                                ⭐ Phân bố sao &amp; điểm từng trạm
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* BIỂU ĐỒ CỘT NẰM NGANG PHÂN BỐ MỨC SAO (1 - 5 SAO) */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                    ⭐ Phân bố số sao từ khách hàng (1 - 5 sao)
                                </h4>
                                <div className="h-[240px] w-full bg-amber-50/30 p-3 rounded-2xl border border-amber-100">
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
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                    🏪 Điểm đánh giá trung bình theo Trạm (Thang 5 ⭐)
                                </h4>
                                <div className="h-[240px] w-full bg-amber-50/30 p-3 rounded-2xl border border-amber-100">
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

                </main>
            </div>
        </div>
    );
}

export default OwnerDashboardPage;