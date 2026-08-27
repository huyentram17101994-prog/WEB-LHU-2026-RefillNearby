import { useEffect, useState } from 'react';
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { 
    FaStar, 
    FaSearch, 
    FaCalendarAlt, 
    FaUser, 
    FaStore, 
    FaTrash, 
    FaUndo,
    FaCommentDots,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle,
    FaBars
} from 'react-icons/fa';

const REVIEWS_PER_PAGE = 10;

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

function AdminReviewsPage() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const MAX_DAYS = 30;

    const daysBetween = (start, end) => {
        const diff = new Date(end) - new Date(start);
        return diff / (1000 * 60 * 60 * 24);
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/reviews');
            setReviews(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteReview = async () => {
        if (!reviewToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/reviews/${reviewToDelete.review_id}`);
            setReviewToDelete(null);
            loadReviews();
        } catch (error) {
            console.error(error);
            alert("Không thể xóa đánh giá.");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredReviews = reviews.filter(review => {
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

        const keyword = search.toLowerCase();
        const matchSearch =
            review.full_name?.toLowerCase().includes(keyword) ||
            review.station_name?.toLowerCase().includes(keyword) ||
            review.owner_name?.toLowerCase().includes(keyword) ||
            review.comment?.toLowerCase().includes(keyword);

        const matchRating = ratingFilter === "" || review.rating === Number(ratingFilter);

        return matchRating && matchSearch && matchDate;
    });

    const hasFilter = search || ratingFilter || fromDate || toDate;

    // Phân trang
    const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = filteredReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleRatingFilterChange = (val) => {
        setRatingFilter(val);
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
        setFromDate('');
        setToDate('');
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
                                <span className="p-2.5 bg-amber-100 text-amber-600 rounded-2xl text-xl">⭐</span>
                                Quản Lý Đánh Giá & Bình Luận
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Xem tất cả phản hồi đánh giá từ người dùng đối với các trạm Refill và quản lý xóa đánh giá vi phạm
                            </p>
                        </div>
                    </div>

                    <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl font-bold text-sm border border-amber-200 flex items-center gap-2">
                        <FaStar className="text-amber-500" /> Tổng số: {reviews.length} đánh giá
                    </div>
                </div>

                {/* MAIN CONTENT CARD */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">

                    {/* BỘ LỌC TÌM KIẾM & THỜI GIAN */}
                    <div className="space-y-4 mb-4 pb-4 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center flex-wrap">

                            {/* Search input */}
                            <div className="relative flex-1 min-w-[220px]">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo người dùng, trạm, chủ sở hữu, nội dung..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            {/* Lọc sao */}
                            <select
                                value={ratingFilter}
                                onChange={(e) => handleRatingFilterChange(e.target.value)}
                                className="px-4 py-2.5 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition font-medium min-w-[130px]"
                            >
                                <option value="">⭐ Tất cả sao</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5 sao</option>
                                <option value="4">⭐⭐⭐⭐ 4 sao</option>
                                <option value="3">⭐⭐⭐ 3 sao</option>
                                <option value="2">⭐⭐ 2 sao</option>
                                <option value="1">⭐ 1 sao</option>
                            </select>

                            {/* Từ ngày */}
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2 text-xs font-semibold text-gray-600">
                                <FaCalendarAlt className="text-green-600 shrink-0" />
                                <span>Từ:</span>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => handleFromDateChange(e.target.value)}
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
                                    onChange={(e) => handleToDateChange(e.target.value)}
                                    className="bg-transparent outline-none text-gray-800 font-medium cursor-pointer"
                                />
                            </div>

                            {/* Reset filter */}
                            {hasFilter && (
                                <button
                                    onClick={resetFilters}
                                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap"
                                >
                                    <FaUndo size={12} /> Xóa lọc
                                </button>
                            )}
                        </div>

                        {/* BÁO LỖI KHOẢNG NGÀY KHÔNG HỢP LỆ */}
                        {fromDate && toDate && daysBetween(fromDate, toDate) < 0 && (
                            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-2.5 text-red-600 text-xs font-semibold flex items-center gap-2">
                                ⚠️ Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.
                            </div>
                        )}
                        {fromDate && toDate && daysBetween(fromDate, toDate) > MAX_DAYS && (
                            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-amber-700 text-xs font-semibold flex items-center gap-2">
                                ⚠️ Chỉ hỗ trợ lọc thời gian trong tối đa 30 ngày.
                            </div>
                        )}
                    </div>

                    {/* BẢNG ĐÁNH GIÁ */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách đánh giá...
                        </div>
                    ) : paginatedReviews.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">⭐</span>
                            <p className="text-gray-700 font-bold text-lg">Chưa tìm thấy đánh giá nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử thay đổi từ khóa hoặc loại bỏ điều kiện lọc</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-green-50 text-green-900 font-bold text-xs uppercase tracking-wider border-b border-green-100">
                                        <tr>
                                            <th className="py-4 px-5 text-center whitespace-nowrap">ID</th>
                                            <th className="py-4 px-5 whitespace-nowrap">Người dùng</th>
                                            <th className="py-4 px-5 whitespace-nowrap">Trạm Refill</th>
                                            <th className="py-4 px-5 whitespace-nowrap">Chủ sở hữu</th>
                                            <th className="py-4 px-5 text-center whitespace-nowrap">Số sao</th>
                                            <th className="py-4 px-5 min-w-[280px]">Bình luận &amp; Phản hồi</th>
                                            <th className="py-4 px-5 text-center whitespace-nowrap">Ngày tạo</th>
                                            <th className="py-4 px-5 text-center whitespace-nowrap">Thao tác</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {paginatedReviews.map((review) => (
                                            <tr key={review.review_id} className="hover:bg-green-50/50 transition">
                                                <td className="py-4 px-5 text-center font-mono font-bold text-gray-500 whitespace-nowrap">
                                                    #{review.review_id}
                                                </td>

                                                <td className="py-4 px-5 font-bold text-gray-800 whitespace-nowrap">
                                                    <span className="flex items-center gap-1.5">
                                                        <FaUser className="text-green-600 shrink-0 text-xs" />
                                                        {review.full_name}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 text-green-800 font-bold whitespace-nowrap">
                                                    <span className="flex items-center gap-1.5">
                                                        <FaStore className="text-green-600 shrink-0 text-xs" />
                                                        {review.station_name}
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 text-gray-600 whitespace-nowrap">
                                                    {review.owner_name || <span className="italic text-gray-400">Chưa có</span>}
                                                </td>

                                                <td className="py-4 px-5 text-center whitespace-nowrap">
                                                    <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold text-xs border border-amber-200 inline-block">
                                                        ⭐ {review.rating}/5
                                                    </span>
                                                </td>

                                                <td className="py-4 px-5 max-w-md space-y-1.5">
                                                    <p className="text-gray-800 font-medium italic">"{review.comment}"</p>
                                                    
                                                    {review.owner_reply ? (
                                                        <div className="bg-green-50 dark:bg-slate-900 p-2.5 rounded-xl border border-green-200 dark:border-emerald-800/60 text-xs text-gray-700 dark:text-gray-200 space-y-1">
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded-md text-[11px] font-black tracking-wider shadow-sm">
                                                                <FaCommentDots size={11} className="text-white" /> Phản hồi từ chủ trạm:
                                                            </span>
                                                            <p className="pl-3 border-l-2 border-green-500 dark:border-emerald-400 text-gray-800 dark:text-slate-100 font-semibold">{review.owner_reply}</p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[11px] text-gray-400 italic">Chưa có phản hồi từ trạm</span>
                                                    )}
                                                </td>

                                                <td className="py-4 px-5 text-center text-gray-700 font-semibold text-xs whitespace-nowrap">
                                                    📅 {formatDateDisplay(review.created_at)}
                                                </td>

                                                <td className="py-4 px-5 text-center whitespace-nowrap">
                                                    <button
                                                        onClick={() => setReviewToDelete(review)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1 mx-auto"
                                                    >
                                                        <FaTrash size={11} /> Xóa
                                                    </button>
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
                                    Hiển thị {(currentPage - 1) * REVIEWS_PER_PAGE + 1}–{Math.min(currentPage * REVIEWS_PER_PAGE, filteredReviews.length)} / {filteredReviews.length} đánh giá
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* MODAL XÁC NHẬN XÓA ĐÁNH GIÁ */}
                {reviewToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-red-100">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                                <FaExclamationTriangle />
                            </div>

                            <div>
                                <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Xóa Đánh Giá</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Bạn có chắc chắn muốn xóa đánh giá từ khách hàng <b className="text-gray-900 font-extrabold">"{reviewToDelete.full_name}"</b>?
                                </p>
                                <p className="text-red-500 text-xs font-semibold mt-1">
                                    ⚠️ Hành động này không thể hoàn tác!
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => setReviewToDelete(null)}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={confirmDeleteReview}
                                    disabled={isDeleting}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang xóa...
                                        </>
                                    ) : (
                                        <>
                                            <FaTrash /> Xác nhận xóa
                                        </>
                                    )}
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

export default AdminReviewsPage;