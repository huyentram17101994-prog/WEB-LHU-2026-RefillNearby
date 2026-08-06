import { useEffect, useState } from 'react';
import FloatingPrintButton from '../components/FloatingPrintButton';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import { 
    FaStore, 
    FaSearch, 
    FaUser, 
    FaMapMarkerAlt, 
    FaClock, 
    FaCompass, 
    FaLock, 
    FaUnlock, 
    FaTrash, 
    FaEye, 
    FaTimes,
    FaShieldAlt,
    FaChevronLeft,
    FaChevronRight,
    FaExclamationTriangle
} from 'react-icons/fa';

const STATIONS_PER_PAGE = 10;

function AdminStationsPage() {
    const navigate = useNavigate();

    const [stations, setStations] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedStation, setSelectedStation] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [stationToDelete, setStationToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/stations');
            setStations(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách trạm admin:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStations = stations.filter(station => {
        const matchesSearch =
            station.station_name?.toLowerCase().includes(search.toLowerCase()) ||
            station.owner_name?.toLowerCase().includes(search.toLowerCase()) ||
            station.address?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === 'all'
                ? true
                : station.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredStations.length / STATIONS_PER_PAGE);
    const paginatedStations = filteredStations.slice(
        (currentPage - 1) * STATIONS_PER_PAGE,
        currentPage * STATIONS_PER_PAGE
    );

    const handleSearchChange = (val) => {
        setSearch(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val) => {
        setStatusFilter(val);
        setCurrentPage(1);
    };

    const confirmDeleteStation = async () => {
        if (!stationToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/stations/${stationToDelete.station_id}`);
            setStationToDelete(null);
            loadStations();
        } catch (error) {
            console.error("Lỗi xóa trạm:", error);
            alert('Không thể xóa trạm.');
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleStationStatus = async (station) => {
        try {
            const newStatus = station.status === "active" ? "inactive" : "active";

            await api.put(`/stations/${station.station_id}/status`, {
                status: newStatus
            });

            loadStations();
        } catch (error) {
            console.error("Lỗi đổi trạng thái trạm:", error);
            alert("Không thể cập nhật trạng thái.");
        }
    };

    const viewStationDetail = async (stationId) => {
        try {
            const res = await api.get(`/admin/stations/${stationId}`);
            setSelectedStation(res.data);
            setShowDetail(true);
        } catch (error) {
            console.error("Lỗi tải chi tiết trạm:", error);
            alert("Không thể tải thông tin chi tiết trạm.");
        }
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
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 p-4 md:p-8 relative">
            <FloatingPrintButton title="In hoặc Xuất PDF trạm Refill" />

            {/* BUTTON QUAY LẠI */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 text-base font-semibold text-gray-700"
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>

            <div className="max-w-7xl mx-auto space-y-6 mt-4">

                {/* HEADER BANNER */}
                <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6 border border-green-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 flex items-center gap-3">
                            <span className="p-3 bg-green-100 text-green-700 rounded-2xl text-2xl">
                                <FaShieldAlt />
                            </span>
                            Quản Lý Trạm Refill
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Giám sát toàn bộ các trạm refill trong hệ thống, kiểm duyệt thông tin và quản lý quyền hoạt động
                        </p>
                    </div>

                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-2xl font-bold text-sm border border-green-200">
                        Tổng số: {stations.length} trạm
                    </div>
                </div>

                {/* TÌM KIẾM VÀ DANH SÁCH */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 space-y-6">
                    
                    {/* BAR TÌM KIẾM VÀ BỘ LỌC */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1 max-w-2xl">
                            <div className="relative w-full sm:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="🔍 Tìm theo tên trạm, chủ trạm, địa chỉ..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-green-400 outline-none text-sm bg-gray-50 focus:bg-white transition font-medium cursor-pointer"
                            >
                                <option value="all">⚡ Tất cả trạng thái</option>
                                <option value="active">🟢 Đang hoạt động</option>
                                <option value="inactive">🔴 Đã khóa</option>
                            </select>
                        </div>

                        <span className="text-sm font-semibold text-gray-500 shrink-0">
                            Hiển thị: <b className="text-green-700">{filteredStations.length}</b> / {stations.length} trạm
                        </span>
                    </div>

                    {/* BẢNG DANH SÁCH TRẠM */}
                    {loading ? (
                        <div className="text-center py-16 text-gray-500">
                            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách trạm refill hệ thống...
                        </div>
                    ) : paginatedStations.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <span className="text-5xl block mb-3">🏪</span>
                            <p className="text-gray-700 font-bold text-lg">Không tìm thấy trạm Refill nào</p>
                            <p className="text-gray-500 text-xs mt-1">Thử thay đổi từ khóa tìm kiếm</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-green-50 text-green-900 text-sm uppercase tracking-wider font-extrabold border-b border-green-100">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Tên Trạm Refill</th>
                                            <th className="p-4">Chủ Sở Hữu</th>
                                            <th className="p-4">Địa Chỉ</th>
                                            <th className="p-4 text-center">Trạng Thái</th>
                                            <th className="p-4 text-center">Thao Tác</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {paginatedStations.map((station) => (
                                            <tr key={station.station_id} className="hover:bg-green-50/50 transition">
                                                <td className="p-4 font-mono font-bold text-gray-500">
                                                    #{station.station_id}
                                                </td>

                                                <td className="p-4 font-bold text-gray-800">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🏪</span>
                                                        <span>{station.station_name}</span>
                                                    </div>
                                                </td>

                                                <td className="p-4 font-medium text-gray-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <FaUser className="text-green-600 text-xs" />
                                                        <span>{station.owner_name || "Chưa có tên"}</span>
                                                    </div>
                                                </td>

                                                <td className="p-4 text-gray-600 max-w-xs truncate">
                                                    <div className="flex items-center gap-1.5">
                                                        <FaMapMarkerAlt className="text-red-500 text-xs shrink-0" />
                                                        <span className="truncate">{station.address || "Chưa cập nhật"}</span>
                                                    </div>
                                                </td>

                                                <td className="p-4 text-center">
                                                    {station.status === "active" ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs inline-flex items-center gap-1 border border-green-200">
                                                            🟢 Hoạt động
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs inline-flex items-center gap-1 border border-red-200">
                                                            🔴 Đã khóa
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => viewStationDetail(station.station_id)}
                                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-xs transition flex items-center gap-1 shadow"
                                                            title="Xem chi tiết"
                                                        >
                                                            <FaEye /> Xem
                                                        </button>

                                                        <button
                                                            onClick={() => toggleStationStatus(station)}
                                                            className={`px-3 py-1.5 rounded-xl text-white font-semibold text-xs transition flex items-center gap-1 shadow ${
                                                                station.status === "active"
                                                                    ? "bg-amber-500 hover:bg-amber-600"
                                                                    : "bg-green-600 hover:bg-green-700"
                                                            }`}
                                                            title={station.status === "active" ? "Khóa trạm" : "Mở khóa trạm"}
                                                        >
                                                            {station.status === "active" ? <><FaLock /> Khóa</> : <><FaUnlock /> Mở</>}
                                                        </button>

                                                        <button
                                                            onClick={() => setStationToDelete(station)}
                                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-xs transition flex items-center gap-1 shadow"
                                                            title="Xóa trạm"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
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
                                    Hiển thị {(currentPage - 1) * STATIONS_PER_PAGE + 1}–{Math.min(currentPage * STATIONS_PER_PAGE, filteredStations.length)} / {filteredStations.length} trạm Refill
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* MODAL CHI TIẾT TRẠM */}
            {showDetail && selectedStation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-[850px] max-w-full max-h-[90vh] overflow-y-auto border border-green-100">
                        {/* MODAL HEADER */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-3xl flex justify-between items-center sticky top-0 z-10">
                            <h2 className="text-2xl font-extrabold flex items-center gap-2">
                                🏪 Chi Tiết Trạm Refill #{selectedStation.station_id}
                            </h2>
                            <button
                                onClick={() => setShowDetail(false)}
                                className="p-2 rounded-full hover:bg-white/20 transition"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* MODAL BODY */}
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* CỘT THÔNG TIN */}
                                <div className="space-y-4">
                                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                                        <p className="text-xs text-green-700 font-bold uppercase">Tên trạm Refill</p>
                                        <p className="text-xl font-extrabold text-green-900 mt-1">{selectedStation.station_name}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                                        <p className="text-xs text-gray-500 font-bold uppercase">Chủ sở hữu &amp; Email</p>
                                        <p className="font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                                            <FaUser className="text-green-600" /> {selectedStation.owner_name || "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">📧 {selectedStation.owner_email || "Chưa có email"}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                                        <p className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-red-500" /> Địa chỉ trạm
                                        </p>
                                        <p className="font-semibold text-gray-800 mt-1">{selectedStation.address || "Chưa cập nhật"}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1"><FaClock /> Giờ mở cửa</p>
                                            <p className="font-bold text-gray-800 mt-1 text-sm">{selectedStation.open_time || "08:00"} - {selectedStation.close_time || "20:00"}</p>
                                        </div>
                                        <div className="bg-teal-50 p-3 rounded-xl border border-teal-100">
                                            <p className="text-xs text-teal-700 font-bold flex items-center gap-1"><FaCompass /> Tọa độ GPS</p>
                                            <p className="font-mono text-gray-800 mt-1 text-xs">{selectedStation.latitude || 0}, {selectedStation.longitude || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CỘT HÌNH ÁNH */}
                                <div>
                                    <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        🖼 Hình ảnh thực tế trạm
                                    </p>
                                    <div className="w-full h-64 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                                        {selectedStation.image_url ? (
                                            <img
                                                src={selectedStation.image_url.startsWith('http') ? selectedStation.image_url : `http://localhost:5000${selectedStation.image_url}`}
                                                alt={selectedStation.station_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center text-gray-400">
                                                <span className="text-4xl block mb-1">🏪</span>
                                                Không có hình ảnh
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* MÔ TẢ */}
                            {selectedStation.description && (
                                <div>
                                    <p className="font-bold text-gray-700 mb-2">📝 Mô tả thông tin trạm</p>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-sm text-gray-700 italic">
                                        "{selectedStation.description}"
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MODAL FOOTER */}
                        <div className="p-4 bg-gray-50 rounded-b-3xl flex justify-end border-t border-gray-100">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold shadow transition"
                            >
                                Đóng lại
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL XÁC NHẬN XÓA TRẠM */}
            {stationToDelete && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                            <FaExclamationTriangle />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Xóa Trạm Refill</h3>
                            <p className="text-gray-600 text-sm mt-2">
                                Bạn có chắc chắn muốn xóa trạm <b className="text-gray-900 font-extrabold">"{stationToDelete.station_name}"</b>?
                            </p>
                            <p className="text-red-500 text-xs font-semibold mt-1">
                                ⚠️ Hành động này sẽ xóa dữ liệu trạm khỏi hệ thống và không thể hoàn tác!
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                onClick={() => setStationToDelete(null)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={confirmDeleteStation}
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
        </div>
    );
}

export default AdminStationsPage;