import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import { 
    FaTint, 
    FaCalendarAlt, 
    FaSearch, 
    FaUndo, 
    FaSun, 
    FaCalendarWeek, 
    FaTrophy,
    FaStore,
    FaBox,
    FaPrint,
    FaBars
} from "react-icons/fa";

function AdminRefillStatisticsPage() {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [topStations, setTopStations] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [filteredQuantity, setFilteredQuantity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        loadData();
        fetchTopStations();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/admin/refill-statistics");
            setData(res.data || {});
        } catch (error) {
            console.error("Lỗi lấy dữ liệu thống kê:", error);
        } finally {
            setLoading(false);
        }
    };

    async function fetchTopStations() {
        try {
            const res = await api.get("/admin/refill-statistics/top-stations");
            setTopStations(res.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFilter = async () => {
        if (!fromDate || !toDate) {
            alert("Vui lòng chọn khoảng thời gian.");
            return;
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);
        const diff = (end - start) / (1000 * 60 * 60 * 24);

        if (diff < 0) {
            alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
            return;
        }

        if (diff > 30) {
            alert("Chỉ hỗ trợ lọc thời gian trong tối đa 30 ngày.");
            return;
        }

        try {
            const res = await api.get(
                `/admin/refill-statistics/filter?fromDate=${fromDate}&toDate=${toDate}`
            );
            setFilteredQuantity(res.data.total_quantity);
        } catch (error) {
            console.error(error);
            alert("Không thể thống kê theo bộ lọc này.");
        }
    };

    const handleRefresh = () => {
        setFromDate("");
        setToDate("");
        setFilteredQuantity(null);
    };

    // Format ngày dd/mm/yyyy đồng bộ (loại bỏ toàn bộ giờ/phút/giây)
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
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

    const handlePrint = () => {
        window.print();
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-300">
                <div className="w-14 h-14 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-semibold text-cyan-700">Đang tải thống kê dung lượng Refill...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            <AdminSidebar 
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 lg:ml-72 min-w-0 flex flex-col min-h-screen">
                <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">

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
                                <span className="p-2.5 bg-cyan-100 text-cyan-600 rounded-2xl text-xl">💧</span>
                                Thống Kê Lượng Refill
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Thống kê chi tiết tổng sản lượng chất lỏng tái nạp (Lít) phân bổ theo thời gian và từng trạm
                            </p>
                        </div>
                    </div>
                </div>

                {/* 3 STAT CARDS TÓM TẮT NẰM GIỮA TRANG */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">

                        {/* CARD 1: TỔNG LƯỢNG REFILL */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-cyan-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaTint className="text-cyan-600" /> Tổng lượng Refill
                                </p>
                                <p className="text-3xl font-extrabold text-cyan-600">
                                    {data?.totalQuantity || 0} <span className="text-xs text-gray-500 font-normal">Lít</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                                💧
                            </div>
                        </div>

                        {/* CARD 2: LƯỢNG REFILL HÔM NAY */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-blue-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaSun className="text-amber-500" /> Refill hôm nay
                                </p>
                                <p className="text-3xl font-extrabold text-blue-600">
                                    {data?.todayQuantity || 0} <span className="text-xs text-gray-500 font-normal">Lít</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                                ☀️
                            </div>
                        </div>

                        {/* CARD 3: LƯỢNG REFILL TRONG THÁNG */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-teal-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaCalendarWeek className="text-teal-600" /> Refill trong tháng
                                </p>
                                <p className="text-3xl font-extrabold text-teal-600">
                                    {data?.monthQuantity || 0} <span className="text-xs text-gray-500 font-normal">Lít</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                                📅
                            </div>
                        </div>

                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">

                    {/* BỘ LỌC THỜI GIAN */}
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

                        {/* BUTTONS */}
                        <button
                            onClick={handleFilter}
                            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                        >
                            <FaSearch size={11} /> Lọc kết quả
                        </button>

                        {(fromDate || toDate) && (
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                            >
                                <FaUndo size={11} /> Làm mới
                            </button>
                        )}
                    </div>

                    {/* KẾT QUẢ LỌC (NẾU CÓ) */}
                    {filteredQuantity !== null && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 text-center shadow-sm space-y-2">
                            <p className="text-sm font-bold text-gray-700">
                                📊 Tổng lượng Refill từ ngày <span className="text-red-600 font-extrabold">{formatDate(fromDate)}</span> đến ngày <span className="text-red-600 font-extrabold">{formatDate(toDate)}</span> là:
                            </p>
                            <p className="text-4xl font-extrabold text-cyan-700">
                                {filteredQuantity} Lít
                            </p>
                        </div>
                    )}

                    {/* DANG SÁCH TOP SẢN PHẨM & TRẠM */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">

                        {/* TOP SẢN PHẨM */}
                        <div className="bg-white rounded-2xl border border-purple-100 p-6 space-y-4 shadow-sm">
                            <h3 className="text-lg font-extrabold text-purple-900 flex items-center gap-2 border-b border-purple-50 pb-3">
                                <FaTrophy className="text-amber-500" /> Top sản phẩm Refill nhiều nhất
                            </h3>

                            <div className="divide-y divide-gray-100">
                                {data?.topProducts && data.topProducts.length > 0 ? (
                                    data.topProducts.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-3 text-sm">
                                            <span className="font-semibold text-gray-800 flex items-center gap-2">
                                                <span className="text-base">
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                                </span>
                                                <FaBox className="text-purple-400 text-xs shrink-0" />
                                                {item.product_name}
                                            </span>
                                            <span className="font-extrabold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 text-xs">
                                                {item.totalQuantity} Lít
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-gray-400 italic">Chưa có dữ liệu</div>
                                )}
                            </div>
                        </div>

                        {/* TOP TRẠM REFILL */}
                        <div className="bg-white rounded-2xl border border-green-100 p-6 space-y-4 shadow-sm">
                            <h3 className="text-lg font-extrabold text-green-900 flex items-center gap-2 border-b border-green-50 pb-3">
                                <FaTrophy className="text-amber-500" /> Top trạm có lượng Refill nhiều nhất
                            </h3>

                            <div className="divide-y divide-gray-100">
                                {topStations && topStations.length > 0 ? (
                                    topStations.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-3 text-sm">
                                            <span className="font-semibold text-gray-800 flex items-center gap-2">
                                                <span className="text-base">
                                                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                                                </span>
                                                <FaStore className="text-green-500 text-xs shrink-0" />
                                                {item.station_name}
                                            </span>
                                            <span className="font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100 text-xs">
                                                {item.totalQuantity} Lít
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-xs text-gray-400 italic">Chưa có dữ liệu</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
                </main>
            </div>
        </div>
    );
}

export default AdminRefillStatisticsPage;