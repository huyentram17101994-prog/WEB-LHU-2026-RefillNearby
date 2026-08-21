import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../services/api";
import { IoChevronBack } from "react-icons/io5";
import { FaBell, FaStore, FaBoxOpen, FaMapMarkerAlt, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all"); // 'all' | 'unread'
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // =============================
    // Lấy danh sách thông báo
    // =============================
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await api.get("/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Sắp xếp thời gian mới nhất lên trước và giới hạn tối đa 20 thông báo
            const sortedData = (res.data || [])
                .sort((a, b) => {
                    const dateA = a.raw_created_at ? new Date(a.raw_created_at) : new Date(0);
                    const dateB = b.raw_created_at ? new Date(b.raw_created_at) : new Date(0);
                    return dateB - dateA;
                })
                .slice(0, 20);

            setNotifications(sortedData);

            // Cập nhật số thông báo chưa đọc vào localStorage
            const unreadCount = sortedData.filter(item => !item.is_read).length;
            localStorage.setItem("unreadNotification", unreadCount);
        } catch (error) {
            console.error("Lỗi lấy danh sách thông báo:", error);
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // Đánh dấu 1 thông báo là đã đọc
    // =============================
    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(
                `/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Cập nhật badge ngoài Home
            const countRes = await api.get("/notifications/unread-count", {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => null);

            if (countRes && countRes.data) {
                localStorage.setItem("unreadNotification", countRes.data.unread_count || 0);
            }

            fetchNotifications();
        } catch (error) {
            console.error("Lỗi đánh dấu đã đọc:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter(item => !item.is_read).length;

    const displayedNotifications = notifications.filter(item => {
        if (filter === "unread") return !item.is_read;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-emerald-200 p-4 md:p-8 relative">
            {/* BUTTON QUAY LẠI GIỐNG CÁC TRANG KHÁC */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700 print:hidden mb-6 cursor-pointer"
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>

            <div className="max-w-4xl mx-auto space-y-6">

            {/* TIÊU ĐỀ CĂN GIỮA KHÔNG BỌC CARD */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-4xl md:text-5xl">
                    🔔
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-red-500">
                    Thông báo
                </h1>
            </div>

                {/* NÚT LỌC "TẤT CẢ" VÀ "CHƯA ĐỌC" */}
                <div className="flex items-center justify-between flex-wrap gap-3 bg-white/90 p-2 rounded-2xl shadow-md border border-green-100">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                                filter === "all"
                                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            🌐 Tất cả ({notifications.length})
                        </button>

                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                                filter === "unread"
                                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            🔴 Chưa đọc
                            {unreadCount > 0 ? (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                    filter === "unread" ? "bg-white text-green-700" : "bg-red-500 text-white"
                                }`}>
                                    {unreadCount}
                                </span>
                            ) : (
                                <span className="text-[10px] text-gray-400 font-normal">(0)</span>
                            )}
                        </button>
                    </div>

                    <span className="text-xs text-gray-500 font-medium px-2">
                        Hiển thị: <b className="text-green-700 font-bold">{displayedNotifications.length}</b> thông báo
                    </span>
                </div>

                {/* DANH SÁCH THÔNG BÁO */}
                {loading ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center text-gray-500 font-semibold">
                        ⏳ Đang tải thông báo mới nhất...
                    </div>
                ) : displayedNotifications.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-12 text-center border border-green-100 space-y-4">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto">
                            🔔
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {filter === "unread" ? "Không có thông báo chưa đọc" : "Bạn chưa có thông báo nào"}
                        </h2>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            {filter === "unread"
                                ? "Tất cả các thông báo của bạn đều đã được đọc đầy đủ."
                                : "Khi sản phẩm có hàng trở lại, thông báo sẽ xuất hiện tại đây."
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedNotifications.map((item) => {
                            const isUnread = !item.is_read;
                            const imageSrc = getImageUrl(item.image_url);

                            return (
                                <div
                                    key={item.notification_id}
                                    onClick={() => markNotificationAsRead(item.notification_id)}
                                    className={`
                                        relative rounded-3xl p-5 md:p-6 transition-all duration-300 shadow-md hover:shadow-xl border cursor-pointer group
                                        ${
                                            isUnread
                                                ? "bg-gradient-to-r from-green-50/90 via-white to-emerald-50/50 border-green-300 border-l-8 border-l-green-500 shadow-green-100"
                                                : "bg-white/90 border-gray-100 opacity-95 hover:opacity-100"
                                        }
                                    `}
                                >
                                    {/* HEADER CỦA CARD: TIÊU ĐỀ & THỜI GIAN */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl md:text-2xl font-extrabold text-red-500">
                                                {item.title}
                                            </h2>
                                            {isUnread && (
                                                <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                                    MỚI
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                           {item.created_at}
                                        </span>
                                    </div>

                                    {/* BODY CỦA CARD: HÌNH ẢNH & THÔNG TIN SẢN PHẨM / TRẠM */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* HÌNH ẢNH SẢN PHẨM */}
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={item.product_name || "Sản phẩm"}
                                                className="w-24 h-24 rounded-2xl object-cover shadow-md border border-gray-200 shrink-0 group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-3xl font-extrabold shadow-inner border border-green-200 shrink-0">
                                                🏪
                                            </div>
                                        )}

                                        {/* THÔNG TIN CHI TIẾT */}
                                        <div className="flex-1 space-y-1.5 w-full">
                                            {item.product_name && (
                                                <p className="text-lg font-extrabold text-green-700 flex items-center gap-1.5">
                                                    <FaBoxOpen className="text-green-600 shrink-0" />
                                                    {item.product_name}
                                                </p>
                                            )}

                                            {item.station_name && (
                                                <p className="text-gray-800 font-bold text-base md:text-lg flex items-center gap-1.5">
                                                    <FaStore className="text-blue-600 shrink-0" />
                                                    {item.station_name}
                                                </p>
                                            )}

                                            {item.station_address && (
                                                <p className="text-gray-600 text-sm md:text-base flex items-center gap-1.5">
                                                    <FaMapMarkerAlt className="text-red-500 shrink-0" />
                                                     Địa chỉ: {item.station_address}
                                                </p>
                                            )}
                                        </div>

                                        {/* NÚT XEM TRẠM */}
                                        <div className="flex items-center justify-end w-full sm:w-auto pt-2 sm:pt-0">
                                            {item.station_id && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markNotificationAsRead(item.notification_id);
                                                        navigate(`/stations/${item.station_id}`);
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                                                >
                                                    Xem trạm <FaExternalLinkAlt size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* TRẠNG THÁI "ĐÃ ĐỌC" / "CHƯA ĐỌC" NẰM SÁT GÓC PHẢI DƯỚI CARD */}
                                    <div className="absolute bottom-3 right-4 md:bottom-3.5 md:right-6 pointer-events-none">
                                        {isUnread ? (
                                            <span className="text-[11px] font-extrabold text-green-700 bg-green-100/90 border border-green-200 px-2.5 py-0.5 rounded-full shadow-sm">
                                                ● Chưa đọc
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                                                <FaCheckCircle className="text-gray-400" size={12} /> Đã đọc
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationPage;