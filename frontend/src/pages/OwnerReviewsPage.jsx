import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import {
    FaStar,
    FaSearch,
    FaCalendarAlt,
    FaStore,
    FaCommentDots,
    FaReply,
    FaEdit,
    FaCheck,
    FaUndo,
    FaUser,
    FaBox,
    FaChevronLeft,
    FaChevronRight,
    FaPrint,
    FaBars
} from 'react-icons/fa';

const REVIEWS_PER_PAGE = 10;

// Format ngày hiển thị dạng Ngày/Tháng/Năm (dd/mm/yyyy)
const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';

    if (typeof dateStr === 'string') {
        const trimmed = dateStr.trim();

        // 1. Nếu backend đã trả về dạng "DD/MM/YYYY..." (Ví dụ: "04/08/2026 15:30:00")
        if (trimmed.includes('/')) {
            const datePart = trimmed.split(' ')[0]; // lấy phần "04/08/2026"
            const parts = datePart.split('/');
            if (parts.length === 3) {
                const [d, m, y] = parts;
                if (d.length <= 2 && m.length <= 2 && y.length === 4) {
                    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
                }
            }
        }

        // 2. Nếu là dạng chuỗi ISO "YYYY-MM-DD..." (Ví dụ: "2026-08-04T15:30:00.000Z")
        if (trimmed.includes('-')) {
            const d = new Date(trimmed);
            if (!isNaN(d.getTime())) {
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
        }
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return dateStr;
};

function OwnerReviewsPage() {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [ratingFilter, setRatingFilter] = useState('');
    const [stationFilter, setStationFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [dashboard, setDashboard] = useState({});
    const [reply, setReply] = useState({});
    const [editingReview, setEditingReview] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [submittingReply, setSubmittingReply] = useState(false);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);

    const MAX_DAYS = 30;

    const daysBetween = (start, end) => {
        const diff = new Date(end) - new Date(start);
        return diff / (1000 * 60 * 60 * 24);
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/owner/dashboard');
            setDashboard(res.data || {});
        } catch (error) {
            console.error('Lỗi lấy danh sách đánh giá:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    // Danh sách trạm duy nhất cho bộ lọc
    const stationList = Array.from(
        new Set(dashboard.reviews?.map((r) => r.station_name).filter(Boolean))
    );

    // Map điểm sao & tổng đánh giá từng trạm
    const stationRatingsMap = {};
    dashboard.stationRatings?.forEach((station) => {
        stationRatingsMap[station.station_name] = station;
    });

    // Hàm kiểm tra review khớp điều kiện lọc
    const filterReview = (review) => {
        const matchRating =
            ratingFilter === '' || review.rating === Number(ratingFilter);

        const matchStation =
            stationFilter === 'all' || review.station_name === stationFilter;

        const keyword = search.toLowerCase();
        const matchSearch =
            review.full_name?.toLowerCase().includes(keyword) ||
            review.station_name?.toLowerCase().includes(keyword) ||
            review.comment?.toLowerCase().includes(keyword) ||
            review.product_name?.toLowerCase().includes(keyword);

        const reviewDate = new Date(review.created_at);
        let matchDate = true;

        if (fromDate && toDate) {
            const diff = daysBetween(fromDate, toDate);
            if (diff < 0 || diff > MAX_DAYS) {
                matchDate = false;
            } else {
                const from = new Date(fromDate);
                from.setHours(0, 0, 0, 0);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                matchDate = reviewDate >= from && reviewDate <= to;
            }
        } else if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            matchDate = reviewDate >= from;
        } else if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            matchDate = reviewDate <= to;
        }

        return matchRating && matchStation && matchSearch && matchDate;
    };

    // Tất cả review sau khi lọc
    const filteredReviews = (dashboard.reviews || []).filter(filterReview);

    // Phân trang
    const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    // Gom nhóm 10 review trên trang hiện tại theo trạm
    const groupedPaginatedReviews = paginatedReviews.reduce((acc, review) => {
        const station = review.station_name || 'Khác';
        if (!acc[station]) acc[station] = [];
        acc[station].push(review);
        return acc;
    }, {});

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleRatingFilterChange = (val) => {
        setRatingFilter(val);
        setCurrentPage(1);
    };

    const handleStationFilterChange = (val) => {
        setStationFilter(val);
        setCurrentPage(1);
    };

    const handleFromDateChange = (val) => {
        setFromDate(val);
        setCurrentPage(1);
    };

    const handleToDateChange = (val) => {
        setToDate(val);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearch('');
        setRatingFilter('');
        setStationFilter('all');
        setFromDate('');
        setToDate('');
        setCurrentPage(1);
    };

    const handleReplyChange = (reviewId, value) => {
        setReply((prev) => ({ ...prev, [reviewId]: value }));
    };

    const startEditReply = (review) => {
        setEditingReview(review.review_id);
        setReply((prev) => ({ ...prev, [review.review_id]: review.owner_reply }));
    };

    const replyReview = async (reviewId) => {
        if (!reply[reviewId]?.trim()) {
            alert('Vui lòng nhập nội dung phản hồi.');
            return;
        }

        setSubmittingReply(true);
        try {
            await api.put(`/owner/reviews/${reviewId}/reply`, {
                owner_reply: reply[reviewId],
            });

            alert('✨ Lưu phản hồi thành công!');
            setReply((prev) => ({ ...prev, [reviewId]: '' }));
            setEditingReview(null);
            loadReviews();
        } catch (error) {
            console.error(error);
            alert('Phản hồi thất bại. Vui lòng thử lại.');
        } finally {
            setSubmittingReply(false);
        }
    };

    const hasFilter =
        search || ratingFilter || stationFilter !== 'all' || fromDate || toDate;

    const totalReviewsCount = dashboard.reviews?.length || 0;

    // Component Thanh Phân Trang
    const PaginationBar = () => {
        if (totalPages <= 1) return null;
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);

        return (
            <div className="flex items-center justify-center gap-2 mt-8 print:hidden">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <FaChevronLeft size={13} className="text-slate-600 dark:text-slate-300" />
                </button>

                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition shadow-sm cursor-pointer ${
                            currentPage === p
                                ? 'bg-emerald-600 text-white shadow-emerald-600/30 shadow-md'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        {p}
                    </button>
                ))}

                <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-emerald-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                    <FaChevronRight size={13} className="text-slate-600 dark:text-slate-300" />
                </button>
            </div>
        );
    };

    const handlePrint = () => {
        window.print();
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
                                    <span className="p-2.5 bg-amber-100 text-amber-700 rounded-2xl text-xl">⭐</span>
                                    Quản Lý Đánh Giá
                                </h1>
                                <p className="text-slate-500 text-xs md:text-sm mt-1">
                                    Xem phản hồi đánh giá từ khách hàng, lọc theo trạm / mức sao / thời gian và trực tiếp tương tác
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl font-bold text-sm border border-amber-200 flex items-center gap-2">
                                <FaStar className="text-amber-500" /> Tổng số: {totalReviewsCount} đánh giá
                            </div>
                        </div>
                    </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200/80">

                    {/* BAR BỘ LỌC */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center flex-wrap">

                            {/* TÌM KIẾM */}
                            <div className="relative flex-1 min-w-[220px]">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên người dùng, trạm, sản phẩm, nội dung..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition placeholder:text-slate-400"
                                />
                            </div>

                            {/* LỌC TRẠM */}
                            <select
                                value={stationFilter}
                                onChange={(e) => handleStationFilterChange(e.target.value)}
                                className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium min-w-[160px] transition cursor-pointer"
                            >
                                <option value="all">🏪 Tất cả trạm</option>
                                {stationList.map((st) => (
                                    <option key={st} value={st}>
                                        {st}
                                    </option>
                                ))}
                            </select>

                            {/* LỌC SỐ SAO */}
                            <select
                                value={ratingFilter}
                                onChange={(e) => handleRatingFilterChange(e.target.value)}
                                className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium min-w-[130px] transition cursor-pointer"
                            >
                                <option value="">⭐ Tất cả sao</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                                <option value="4">⭐⭐⭐⭐ 4 sao</option>
                                <option value="3">⭐⭐⭐ 3 sao</option>
                                <option value="2">⭐⭐ 2 sao</option>
                                <option value="1">⭐ 1 sao</option>
                            </select>

                            {/* TỪ NGÀY */}
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Từ:</span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => handleFromDateChange(e.target.value)}
                                    className="bg-transparent outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                                />
                            </div>

                            {/* ĐẾN NGÀY */}
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                <FaCalendarAlt className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Đến:</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => handleToDateChange(e.target.value)}
                                    className="bg-transparent outline-none text-slate-900 dark:text-white font-semibold cursor-pointer"
                                />
                            </div>

                            {/* RESET FILTER */}
                            {hasFilter && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                                >
                                    <FaUndo size={12} /> Xóa lọc
                                </button>
                            )}
                        </div>

                        {/* BÁO LỖI KHOẢNG NGÀY KHÔNG HỢP LỆ */}
                        {fromDate && toDate && daysBetween(fromDate, toDate) < 0 && (
                            <div className="rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-4 py-2.5 flex items-center gap-2">
                                ⚠️ Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.
                            </div>
                        )}
                        {fromDate && toDate && daysBetween(fromDate, toDate) > MAX_DAYS && (
                            <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-4 py-2.5 flex items-center gap-2">
                                ⚠️ Chỉ hỗ trợ lọc thời gian trong tối đa 30 ngày.
                            </div>
                        )}
                    </div>

                    {/* DANH SÁCH ĐÁNH GIÁ CỦA CÁC TRẠM */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách đánh giá...
                        </div>
                    ) : filteredReviews.length > 0 ? (
                        <>
                            <div className="space-y-8">
                                {Object.entries(groupedPaginatedReviews).map(([stationName, reviews]) => {
                                    const statRating = stationRatingsMap[stationName];
                                    const avgRating = Number(statRating?.averageRating || 0).toFixed(1);
                                    const totalReviewsForStation = statRating?.totalReviews || reviews.length;

                                    return (
                                        <div key={stationName} className="space-y-4">

                                            {/* HEADER CỦA TRẠM: HIỂN THỊ TÊN TRẠM, ĐIỂM TRUNG BÌNH & TỔNG LƯỢT ĐÁNH GIÁ */}
                                            <div className="bg-emerald-50/90 dark:bg-slate-900 p-4 md:p-5 rounded-3xl border-2 border-emerald-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="p-3 bg-emerald-600 text-white rounded-2xl text-xl font-black shadow-md shrink-0">
                                                        <FaStore />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-black text-emerald-950 dark:text-emerald-300 tracking-tight">
                                                            {stationName}
                                                        </h3>
                                                        <p className="text-xs text-emerald-700 dark:text-slate-400 font-bold mt-0.5">
                                                            Trạm Refill sở hữu
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2.5 bg-white dark:bg-slate-950 px-4 py-2.5 rounded-2xl border border-emerald-200 dark:border-slate-700 shadow-sm self-start sm:self-auto">
                                                    <FaStar className="text-amber-400 text-lg" />
                                                    <span className="font-black text-slate-900 dark:text-white text-lg">{avgRating}</span>
                                                    <span className="text-slate-600 dark:text-slate-400 text-xs font-bold">({totalReviewsForStation} đánh giá)</span>
                                                </div>
                                            </div>

                                            {/* CÁC ĐÁNH GIÁ THUỘC TRẠM NÀY */}
                                            <div className="space-y-4 pl-0 sm:pl-3">
                                                {reviews.map((review) => (
                                                    <div
                                                        key={review.review_id}
                                                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 p-5 transition duration-200 space-y-3"
                                                    >
                                                        {/* NGUỜI DÙNG & ĐIỂM SỐ */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                                                                    <FaUser />
                                                                </div>
                                                                <div>
                                                                    <p className="font-black text-slate-900 dark:text-white text-base">
                                                                        {review.full_name || 'Khách hàng'}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                                        📅 {formatDateDisplay(review.created_at)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* ĐIỂM SAO */}
                                                            <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 px-3.5 py-1.5 rounded-full text-xs font-black border border-amber-200 dark:border-slate-700 self-start sm:self-auto">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <FaStar
                                                                        key={i}
                                                                        className={`text-sm ${
                                                                            i < review.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                                                        }`}
                                                                    />
                                                                ))}
                                                                <span className="ml-1 text-slate-900 dark:text-slate-100">{review.rating}/5</span>
                                                            </div>
                                                        </div>

                                                        {/* NỘI DUNG ĐÁNH GIÁ */}
                                                        {review.comment && (
                                                            <p className="text-slate-900 dark:text-slate-100 text-sm font-medium leading-relaxed bg-slate-100 dark:bg-slate-800/80 p-4 rounded-2xl italic border border-slate-200 dark:border-slate-700">
                                                                "{review.comment}"
                                                            </p>
                                                        )}

                                                        {/* TÊN SẢN PHẨM MUA */}
                                                        {review.product_name && (
                                                            <div className="flex items-center gap-2 text-xs font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-3.5 py-2 rounded-xl w-fit border border-purple-200 dark:border-purple-800">
                                                                <FaBox className="text-purple-600 dark:text-purple-400" />
                                                                <span>Sản phẩm: {review.product_name}</span>
                                                            </div>
                                                        )}

                                                        {/* PHẢN HỒI ĐÃ CÓ */}
                                                        {review.owner_reply && editingReview !== review.review_id && (
                                                            <div className="mt-3 bg-emerald-100/70 dark:bg-slate-950 rounded-2xl border-2 border-emerald-500/50 dark:border-emerald-500/50 p-4 shadow-sm space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="font-extrabold text-emerald-900 dark:text-emerald-400 text-xs flex items-center gap-2">
                                                                        <FaReply className="text-emerald-600 dark:text-emerald-400 transform rotate-180" />
                                                                        <span>PHẢN HỒI TỪ CHỦ TRẠM</span>
                                                                        {review.replied_at && (
                                                                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">• {formatDateDisplay(review.replied_at)}</span>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        onClick={() => startEditReply(review)}
                                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-extrabold flex items-center gap-1 hover:underline transition cursor-pointer"
                                                                    >
                                                                        <FaEdit size={12} /> Chỉnh sửa
                                                                    </button>
                                                                </div>

                                                                <p className="text-slate-900 dark:text-white font-semibold text-sm whitespace-pre-line leading-relaxed pl-3.5 border-l-4 border-emerald-600 dark:border-emerald-400">
                                                                    {review.owner_reply}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* FORM SOẠN THẢO / CHỈNH SỬA PHẢN HỒI */}
                                                        {(editingReview === review.review_id || !review.owner_reply) && (
                                                            <div className="mt-3 pt-2">
                                                                <label className="block text-xs font-extrabold text-slate-800 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
                                                                    <FaCommentDots className="text-emerald-600 dark:text-emerald-400" />
                                                                    {editingReview === review.review_id ? 'Chỉnh sửa phản hồi của bạn:' : 'Nhập phản hồi cho khách hàng:'}
                                                                </label>

                                                                <textarea
                                                                    rows={3}
                                                                    value={reply[review.review_id] || ''}
                                                                    onChange={(e) => handleReplyChange(review.review_id, e.target.value)}
                                                                    placeholder="Cảm ơn khách hàng hoặc giải đáp thắc mắc về sản phẩm / dịch vụ..."
                                                                    className="w-full p-3.5 text-sm font-medium bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl border-2 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none transition placeholder:text-slate-400"
                                                                />

                                                                <div className="flex gap-2 justify-end mt-2">
                                                                    {editingReview === review.review_id && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => setEditingReview(null)}
                                                                            disabled={submittingReply}
                                                                            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition cursor-pointer"
                                                                        >
                                                                            Hủy
                                                                        </button>
                                                                    )}

                                                                    <button
                                                                        type="button"
                                                                        onClick={() => replyReview(review.review_id)}
                                                                        disabled={submittingReply}
                                                                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                                                    >
                                                                        <FaCheck size={12} />
                                                                        {submittingReply ? 'Đang gửi...' : editingReview === review.review_id ? 'Lưu cập nhật' : 'Gửi phản hồi'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* THANH PHÂN TRANG */}
                            <PaginationBar />

                            {/* THÔNG TIN PHÂN TRANG */}
                            {totalPages > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    Hiển thị {(currentPage - 1) * REVIEWS_PER_PAGE + 1}–{Math.min(currentPage * REVIEWS_PER_PAGE, filteredReviews.length)} / {filteredReviews.length} đánh giá
                                </p>
                            )}
                        </>
                    ) : (
                        /* EMPTY STATE */
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">⭐</span>
                            <p className="text-gray-700 font-bold text-lg">
                                {hasFilter
                                    ? 'Không tìm thấy đánh giá nào phù hợp với bộ lọc'
                                    : 'Chưa có đánh giá nào từ khách hàng'}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 mb-4">
                                {hasFilter
                                    ? 'Thử thay đổi từ khóa hoặc xóa điều kiện lọc để xem thêm'
                                    : 'Khi có khách hàng đánh giá trạm Refill của bạn, nội dung sẽ xuất hiện ở đây'}
                            </p>
                            {hasFilter && (
                                <button
                                    onClick={resetFilters}
                                    className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-xs font-bold transition inline-flex items-center gap-1.5 shadow"
                                >
                                    <FaUndo /> Xóa bộ lọc
                                </button>
                            )}
                        </div>
                    )}
                </div>

                </main>
            </div>
        </div>
    );
}

export default OwnerReviewsPage;