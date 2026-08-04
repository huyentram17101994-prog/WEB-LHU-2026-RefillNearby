import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { 
    FaRecycle, 
    FaSearch, 
    FaCalendarAlt, 
    FaUser, 
    FaStore, 
    FaBox, 
    FaTint, 
    FaUndo,
    FaSun,
    FaCalendarWeek,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

const REFILLS_PER_PAGE = 10;

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

function AdminRefillHistoryPage() {
    const navigate = useNavigate();

    const [refills, setRefills] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [summary, setSummary] = useState({
        total_refills: 0,
        today_refills: 0,
        month_refills: 0
    });
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    useEffect(() => {
        loadRefills();
        fetchSummary();
    }, []);

    const loadRefills = async () => {
        setLoading(true);
        try {
            if (fromDate && toDate) {
                const from = new Date(fromDate);
                const to = new Date(toDate);
                const diffDays = (to - from) / (1000 * 60 * 60 * 24);

                if (diffDays < 0) {
                    alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
                    setLoading(false);
                    return;
                }

                if (diffDays > 30) {
                    alert("Chỉ hỗ trợ lọc thời gian trong tối đa 30 ngày.");
                    setLoading(false);
                    return;
                }
            }

            const res = await api.get("/admin/refills", {
                params: { fromDate, toDate }
            });
            setRefills(res.data || []);
        } catch (error) {
            console.error("Lỗi tải lượt refill:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setFromDate('');
        setToDate('');
        setSearch('');
        setCurrentPage(1);

        try {
            const res = await api.get("/admin/refills");
            setRefills(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await api.get("/admin/refills/summary");
            setSummary(res.data || {});
        } catch (error) {
            console.error(error);
        }
    };

    const filteredRefills = refills.filter(refill =>
        refill.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        refill.station_name?.toLowerCase().includes(search.toLowerCase()) ||
        refill.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
        refill.product_name?.toLowerCase().includes(search.toLowerCase())
    );

    // Phân trang
    const totalPages = Math.ceil(filteredRefills.length / REFILLS_PER_PAGE);
    const paginatedRefills = filteredRefills.slice(
        (currentPage - 1) * REFILLS_PER_PAGE,
        currentPage * REFILLS_PER_PAGE
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
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8">

            {/* BUTTON QUAY LẠI */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700"
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>

            <div className="max-w-7xl mx-auto space-y-6 mt-4">

                {/* PAGE TITLE BANNER */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 flex items-center gap-3">
                            <span className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl text-2xl">♻️</span>
                            Quản Lý Lượt Refill
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Xem nhật ký lịch sử khách hàng đến tái nạp (Refill) sản phẩm tại tất cả các trạm
                        </p>
                    </div>
                </div>

                {/* 3 STAT CARDS TÓM TẮT NẰM GIỮA TRANG */}
                <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl">

                        {/* CARD TỔNG SỐ LƯỢT */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-emerald-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaRecycle className="text-emerald-600" /> Tổng lượt Refill
                                </p>
                                <p className="text-3xl font-extrabold text-emerald-700">
                                    {summary.total_refills} <span className="text-xs text-gray-500 font-normal">lượt</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                                ♻️
                            </div>
                        </div>

                        {/* CARD HÔM NAY */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-blue-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaSun className="text-amber-500" /> Refill hôm nay
                                </p>
                                <p className="text-3xl font-extrabold text-blue-700">
                                    {summary.today_refills} <span className="text-xs text-gray-500 font-normal">lượt</span>
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition shrink-0">
                                ☀️
                            </div>
                        </div>

                        {/* CARD TRONG THÁNG */}
                        <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg border border-teal-100 flex items-center justify-between transition-all group">
                            <div className="space-y-0.5">
                                <p className="text-gray-500 font-semibold text-base flex items-center gap-1.5">
                                    <FaCalendarWeek className="text-teal-600" /> Refill trong tháng
                                </p>
                                <p className="text-3xl font-extrabold text-teal-700">
                                    {summary.month_refills} <span className="text-xs text-gray-500 font-normal">lượt</span>
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

                    {/* BỘ LỌC TÌM KIẾM & NGÀY */}
                    <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">

                            {/* Search input */}
                            <div className="relative w-full sm:w-72">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm người dùng, trạm, sản phẩm..."
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
                                    onClick={loadRefills}
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
                            Hiển thị: <b className="text-green-700">{filteredRefills.length}</b> / {refills.length} lượt Refill
                        </span>
                    </div>

                    {/* BẢNG LỊCH SỬ REFILL */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải lịch sử Refill...
                        </div>
                    ) : paginatedRefills.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">♻️</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy lượt Refill nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử đổi từ khóa hoặc thiết lập lại khoảng thời gian</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-50 text-green-800 font-bold text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Người dùng</th>
                                            <th className="p-4">Trạm Refill</th>
                                            <th className="p-4">Chủ sở hữu</th>
                                            <th className="p-4">Sản phẩm</th>
                                            <th className="p-4 text-center">Lượng Refill</th>
                                            <th className="p-4">Thời gian</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedRefills.map((refill) => (
                                            <tr key={refill.refill_id} className="hover:bg-green-50/50 transition">
                                                <td className="p-4 font-mono font-bold text-gray-500 whitespace-nowrap">#{refill.refill_id}</td>
                                                
                                                <td className="p-4 font-bold text-gray-800 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaUser className="text-blue-500 shrink-0 text-xs" />
                                                        {refill.full_name}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-gray-700 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 font-medium">
                                                        <FaStore className="text-green-600 shrink-0 text-xs" />
                                                        {refill.station_name}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-gray-600 font-medium whitespace-nowrap">{refill.owner_name}</td>

                                                <td className="p-4 font-bold text-gray-800 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <FaBox className="text-purple-600 shrink-0 text-xs" />
                                                        {refill.product_name}
                                                    </span>
                                                </td>

                                                <td className="p-4 text-center whitespace-nowrap">
                                                    <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 font-extrabold text-xs border border-cyan-200 inline-flex items-center gap-1">
                                                        <FaTint /> {refill.quantity} Lít
                                                    </span>
                                                </td>

                                                <td className="p-4 text-gray-700 font-semibold text-xs whitespace-nowrap">
                                                    📅 {formatDateDisplay(refill.refill_date)}
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
                                    Hiển thị {(currentPage - 1) * REFILLS_PER_PAGE + 1}–{Math.min(currentPage * REFILLS_PER_PAGE, filteredRefills.length)} / {filteredRefills.length} lượt Refill
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminRefillHistoryPage;