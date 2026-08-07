import { useEffect, useState } from 'react';
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { 
    FaHeart, 
    FaSearch, 
    FaCalendarAlt, 
    FaUser, 
    FaStore, 
    FaUndo, 
    FaTrophy, 
    FaTimes,
    FaChevronLeft,
    FaChevronRight,
    FaBars
} from 'react-icons/fa';

const FAVORITES_PER_PAGE = 10;

// Format ngày dd/mm/yyyy đồng bộ (loại bỏ toàn bộ giờ/phút/giây)
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return 'Chưa có';
    const str = String(dateStr).trim();

    // 1. Chuỗi dạng DD/MM/YYYY hoặc DD-MM-YYYY (kèm hoặc không kèm giờ)
    const matchDMY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
    if (matchDMY) {
        const day = matchDMY[1].padStart(2, '0');
        const month = matchDMY[2].padStart(2, '0');
        const year = matchDMY[3];
        return `${day}/${month}/${year}`;
    }

    // 2. Chuỗi dạng YYYY-MM-DD hoặc YYYY/MM/DD (ISO / SQL format, kèm hoặc không kèm giờ)
    const matchISO = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (matchISO) {
        const year = matchISO[1];
        const month = matchISO[2].padStart(2, '0');
        const day = matchISO[3].padStart(2, '0');
        return `${day}/${month}/${year}`;
    }

    // 3. Fallback Date object
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return str;
};

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
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const [showStationModal, setShowStationModal] = useState(false);
    const [showProductModal, setShowProductModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const MAX_DAYS = 30;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadFavorites(),
                fetchStationCount(),
                fetchProductCount(),
                fetchTopStations(),
                fetchTopProducts()
            ]);
        } catch (error) {
            console.error("Lỗi tải dữ liệu yêu thích:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const res = await api.get("/admin/favorites", {
                params: { fromDate, toDate }
            });
            setFavorites(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStationCount = async () => {
        try {
            const res = await api.get("/admin/favorites/station-count");
            setStationCount(res.data || {});
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProductCount = async () => {
        try {
            const res = await api.get("/admin/favorites/product-count");
            setProductCount(res.data || {});
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTopStations = async () => {
        try {
            const res = await api.get("/admin/favorites/top-stations");
            setTopStations(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTopProducts = async () => {
        try {
            const res = await api.get("/admin/favorites/top-products");
            setTopProducts(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFilter = () => {
        if (!fromDate || !toDate) {
            alert("Vui lòng chọn đầy đủ từ ngày và đến ngày.");
            return;
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);

        if (diffDays < 0) {
            alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            return;
        }

        if (diffDays > MAX_DAYS) {
            alert("Chỉ hỗ trợ lọc thời gian trong tối đa 30 ngày.");
            return;
        }

        loadFavorites();
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        setFromDate("");
        setToDate("");
        setSearch("");
        setCurrentPage(1);
        loadFavorites();
    };

    const filteredFavorites = favorites.filter(item =>
        item.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.station_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.owner_name?.toLowerCase().includes(search.toLowerCase())
    );

    // Phân trang
    const totalPages = Math.ceil(filteredFavorites.length / FAVORITES_PER_PAGE);
    const paginatedFavorites = filteredFavorites.slice(
        (currentPage - 1) * FAVORITES_PER_PAGE,
        currentPage * FAVORITES_PER_PAGE
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    // Component Thanh Phân Trang
    const PaginationBar = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);

        return (
            <div className="flex items-center justify-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <FaChevronLeft size={13} className="text-gray-600" />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition shadow-sm ${
                            currentPage === p
                                ? 'bg-green-600 text-white shadow-green-200 shadow-md'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-400'
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-green-50 hover:border-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <FaChevronRight size={13} className="text-gray-600" />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            <AdminSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
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
                                <span className="p-2.5 bg-pink-100 text-pink-600 rounded-2xl text-xl">❤️</span>
                                Quản Lý Yêu Thích
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Thống kê lượt thả tim yêu thích trạm & sản phẩm từ người dùng trên toàn hệ thống
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-2 bg-pink-50 text-pink-700 rounded-2xl font-bold text-sm border border-pink-200 flex items-center gap-2">
                        <FaHeart className="text-red-500" /> Tổng lượt lưu: {(stationCount?.totalFavorites || 0) + (productCount?.totalFavorites || 0)}
                    </div>
                </div>

                {/* 2 STAT CARDS NHỎ GỌN NẰM GIỮA TRANG */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">

                        {/* CARD TRẠM YÊU THÍCH */}
                        <div
                            onClick={() => setShowStationModal(true)}
                            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-green-100 cursor-pointer transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaHeart className="text-red-500" /> Trạm Refill Yêu Thích
                                </p>
                                <p className="text-3xl font-extrabold text-green-700">
                                    {stationCount?.totalFavorites || 0} <span className="text-xs text-gray-500 font-normal">lượt</span>
                                </p>
                                <span className="text-xs text-green-600 font-medium group-hover:underline inline-block">
                                    Top 5 Trạm yêu thích →
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-hover:scale-110 transition shrink-0">
                                🏪
                            </div>
                        </div>

                        {/* CARD SẢN PHẨM YÊU THÍCH */}
                        <div
                            onClick={() => setShowProductModal(true)}
                            className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-emerald-100 cursor-pointer transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaHeart className="text-red-500" /> Sản Phẩm Yêu Thích
                                </p>
                                <p className="text-3xl font-extrabold text-emerald-700">
                                    {productCount?.totalFavorites || 0} <span className="text-xs text-gray-500 font-normal">lượt</span>
                                </p>
                                <span className="text-xs text-emerald-600 font-medium group-hover:underline inline-block">
                                    Top 5 Sản phẩm yêu thích →
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition shrink-0">
                                📦
                            </div>
                        </div>

                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">

                    {/* BỘ LỌC TÌM KIẾM & NGÀY */}
                    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
                            
                            {/* Search input */}
                            <div className="relative w-full sm:w-72">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm theo tên người dùng, trạm..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            {/* Từ ngày */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs font-semibold text-gray-600">
                                <FaCalendarAlt className="text-green-600 shrink-0" />
                                <span>Từ:</span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="bg-transparent outline-none text-gray-800 font-medium cursor-pointer"
                                />
                            </div>

                            {/* Đến ngày */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs font-semibold text-gray-600">
                                <FaCalendarAlt className="text-green-600 shrink-0" />
                                <span>Đến:</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="bg-transparent outline-none text-gray-800 font-medium cursor-pointer"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleFilter}
                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-2xl shadow transition flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <FaSearch size={12} /> Lọc
                                </button>

                                <button
                                    onClick={handleRefresh}
                                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <FaUndo size={12} /> Làm mới
                                </button>
                            </div>
                        </div>

                        <span className="text-sm font-semibold text-gray-500 shrink-0">
                            Hiển thị: <b className="text-green-700">{filteredFavorites.length}</b> / {favorites.length} lượt yêu thích
                        </span>
                    </div>

                    {/* BẢNG LỊCH SỬ THẢ TIM TRẠM */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải lịch sử yêu thích...
                        </div>
                    ) : paginatedFavorites.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">❤️</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy lượt yêu thích nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử thay đổi từ khóa hoặc loại bỏ điều kiện thời gian</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-50 text-green-900 font-bold text-xs uppercase tracking-wider border-b border-green-100">
                                        <tr>
                                            <th className="py-4 px-5 text-center w-[12%]">ID</th>
                                            <th className="py-4 px-5 w-[25%]">Người dùng</th>
                                            <th className="py-4 px-5 w-[28%]">Trạm yêu thích</th>
                                            <th className="py-4 px-5 w-[20%]">Chủ sở hữu</th>
                                            <th className="py-4 px-5 text-center w-[15%]">Ngày lưu</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedFavorites.map((item) => (
                                            <tr key={item.favorite_id} className="hover:bg-green-50/50 transition">
                                                <td className="py-4 px-5 text-center font-mono font-bold text-gray-500 whitespace-nowrap">
                                                    #{item.favorite_id}
                                                </td>
                                                
                                                <td className="py-4 px-5 font-bold text-gray-800">
                                                    <span className="flex items-center gap-2">
                                                        <FaUser className="text-green-600 shrink-0 text-xs" />
                                                        <span>{item.full_name}</span>
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 text-green-800 font-bold">
                                                    <span className="flex items-center gap-2">
                                                        <FaStore className="text-green-600 shrink-0 text-xs" />
                                                        <span>{item.station_name}</span>
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 text-gray-600">
                                                    {item.owner_name || 'Chưa có'}
                                                </td>

                                                <td className="py-4 px-5 text-center text-gray-700 font-semibold text-xs whitespace-nowrap">
                                                    📅 {formatDateDisplay(item.created_at)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* PHÂN TRANG */}
                            <PaginationBar />

                            {totalPages > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-2">
                                    Hiển thị {(currentPage - 1) * FAVORITES_PER_PAGE + 1}–{Math.min(currentPage * FAVORITES_PER_PAGE, filteredFavorites.length)} / {filteredFavorites.length} lượt yêu thích
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* MODAL TOP 5 TRẠM YÊU THÍCH */}
                {showStationModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-green-100 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <h2 className="text-xl font-extrabold text-green-800 flex items-center gap-2">
                                    <FaTrophy className="text-amber-400" /> Top 5 trạm được yêu thích nhất
                                </h2>
                                <button
                                    onClick={() => setShowStationModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {topStations.length > 0 ? (
                                    topStations.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-3 text-sm">
                                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                                <span className="text-base">
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                                </span>
                                                {item.station_name}
                                            </span>
                                            <span className="font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100 text-xs flex items-center gap-1">
                                                ❤️ {item.totalFavorites} lượt
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-6 text-xs text-gray-400 italic">Chưa có dữ liệu trạm yêu thích</p>
                                )}
                            </div>

                            <div className="pt-2 text-right">
                                <button
                                    onClick={() => setShowStationModal(false)}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL TOP 5 SẢN PHẨM YÊU THÍCH */}
                {showProductModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-emerald-100 space-y-4">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <h2 className="text-xl font-extrabold text-emerald-800 flex items-center gap-2">
                                    <FaTrophy className="text-amber-400" /> Top 5 sản phẩm được yêu thích nhất
                                </h2>
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {topProducts.length > 0 ? (
                                    topProducts.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-3 text-sm">
                                            <span className="font-bold text-gray-800 flex items-center gap-2">
                                                <span className="text-base">
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                                </span>
                                                {item.product_name}
                                            </span>
                                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 text-xs flex items-center gap-1">
                                                ❤️ {item.totalFavorites} lượt
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center py-6 text-xs text-gray-400 italic">Chưa có dữ liệu sản phẩm yêu thích</p>
                                )}
                            </div>

                            <div className="pt-2 text-right">
                                <button
                                    onClick={() => setShowProductModal(false)}
                                    className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                </main>
            </div>
        </div>
    );
}

export default AdminFavoritesPage;