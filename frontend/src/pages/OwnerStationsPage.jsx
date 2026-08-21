import { useEffect, useState } from 'react';
import api, { getImageUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from "react-icons/io5";
import FloatingPrintButton from '../components/FloatingPrintButton';
import AdminSidebar from '../components/AdminSidebar';
import { 
    FaStore, 
    FaPlus, 
    FaMapMarkerAlt, 
    FaClock, 
    FaCompass, 
    FaEdit, 
    FaTrash, 
    FaImage, 
    FaSearch, 
    FaTimes, 
    FaCheck, 
    FaGlobe,
    FaPrint,
    FaBars,
    FaExclamationTriangle
} from 'react-icons/fa';
import { formatTimeDisplay, formatTimeInput } from '../utils/formatters';

function OwnerStationsPage() {
    const navigate = useNavigate();

    const [stations, setStations] = useState([]);
    const [searchStation, setSearchStation] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [editingStationId, setEditingStationId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stationToDelete, setStationToDelete] = useState(null);
    const [isDeletingStation, setIsDeletingStation] = useState(false);

    const [stationForm, setStationForm] = useState({
        station_name: '',
        address: '',
        latitude: '',
        longitude: '',
        open_time: '08:00',
        close_time: '20:00',
        description: '',
        image_url: ''
    });

    useEffect(() => {
        loadStations();
    }, []);

    const loadStations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/owner/my-stations');
            setStations(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy danh sách trạm:", error);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Trình duyệt của bạn không hỗ trợ định vị GPS');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setStationForm(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toFixed(6),
                    longitude: position.coords.longitude.toFixed(6)
                }));
                alert(`📍 Lấy tọa độ GPS thành công!\nLat: ${position.coords.latitude.toFixed(6)}, Lng: ${position.coords.longitude.toFixed(6)}`);
            },
            (error) => {
                console.error(error);
                alert('Không thể lấy vị trí hiện tại. Vui lòng cho phép truy cập vị trí trên trình duyệt.');
            }
        );
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Chỉ được chọn tệp hình ảnh');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Hình ảnh không được vượt quá 5MB');
            return;
        }

        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const createStation = async (e) => {
        if (e) e.preventDefault();
        
        if (!stationForm.station_name.trim()) {
            alert('Vui lòng nhập tên trạm Refill');
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl = '';

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await api.post('/owner/upload-station-image', formData);
                imageUrl = uploadRes.data.image_url;
            }

            await api.post('/owner/stations', {
                ...stationForm,
                image_url: imageUrl
            });

            alert('✨ Thêm trạm Refill thành công!');
            resetForm();
            setShowForm(false);
            loadStations();

        } catch (error) {
            console.error("Lỗi tạo trạm:", error);
            alert(error.response?.data?.message || 'Không thể thêm trạm mới. Vui lòng kiểm tra lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const editStation = (station) => {
        setEditingStationId(station.station_id);
        setImageFile(null);
        setPreviewImage('');

        setStationForm({
            station_name: station.station_name || '',
            address: station.address || '',
            latitude: station.latitude || '',
            longitude: station.longitude || '',
            open_time: formatTimeInput(station.open_time) || '08:00',
            close_time: formatTimeInput(station.close_time) || '20:00',
            description: station.description || '',
            image_url: station.image_url || ''
        });

        setShowForm(true);
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    const updateStation = async (e) => {
        if (e) e.preventDefault();

        if (!stationForm.station_name.trim()) {
            alert('Vui lòng nhập tên trạm Refill');
            return;
        }

        setSubmitting(true);
        try {
            let imageUrl = stationForm.image_url;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await api.post('/owner/upload-station-image', formData);
                imageUrl = uploadRes.data.image_url;
            }

            await api.put(`/owner/stations/${editingStationId}`, {
                ...stationForm,
                image_url: imageUrl
            });

            alert('✅ Cập nhật trạm Refill thành công!');
            resetForm();
            setShowForm(false);
            loadStations();

        } catch (error) {
            console.error("Lỗi cập nhật trạm:", error);
            alert(error.response?.data?.message || 'Không thể cập nhật trạm.');
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteStation = async () => {
        if (!stationToDelete) return;
        setIsDeletingStation(true);
        try {
            await api.delete(`/owner/stations/${stationToDelete.station_id}`);
            setStationToDelete(null);
            loadStations();
        } catch (error) {
            console.error("Lỗi xóa trạm:", error);
            alert(error.response?.data?.message || 'Không thể xóa trạm.');
        } finally {
            setIsDeletingStation(false);
        }
    };

    const resetForm = () => {
        setEditingStationId(null);
        setImageFile(null);
        setPreviewImage('');

        setStationForm({
            station_name: '',
            address: '',
            latitude: '',
            longitude: '',
            open_time: '08:00',
            close_time: '20:00',
            description: '',
            image_url: ''
        });
    };

    const filteredStations = stations.filter(station =>
        station.station_name?.toLowerCase().includes(searchStation.toLowerCase()) ||
        station.address?.toLowerCase().includes(searchStation.toLowerCase())
    );

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
                                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl text-xl">🏪</span>
                                Quản Lý Trạm Refill
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Thêm mới, chỉnh sửa thông tin vị trí, giờ hoạt động và hình ảnh các trạm Refill
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm border border-blue-200">
                            Tổng số: {stations.length} trạm
                        </div>
                    </div>
                </div>

                {/* FORM TẠO / SỬA TRẠM */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                {editingStationId ? (
                                    <>
                                        <FaEdit className="text-amber-500" /> Cập Nhật Thông Tin Trạm Refill
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="text-emerald-600" /> Thêm Trạm Refill Mới
                                    </>
                                )}
                            </h2>
                            <button 
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(false);
                                }}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        <form onSubmit={editingStationId ? updateStation : createStation} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* TÊN TRẠM */}
                                <div>
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm">
                                        Tên trạm Refill <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Trạm Refill Xanh - Chi nhánh Quận 1"
                                        required
                                        value={stationForm.station_name}
                                        onChange={(e) => setStationForm({ ...stationForm, station_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                    />
                                </div>

                                {/* ĐỊA CHỈ TRẠM */}
                                <div>
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm">
                                        Địa chỉ cụ thể <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1"
                                        required
                                        value={stationForm.address}
                                        onChange={(e) => setStationForm({ ...stationForm, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                    />
                                </div>

                                {/* TỌA ĐỘ LATITUDE & LONGITUDE */}
                                <div className="md:col-span-2 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                                        <div>
                                            <h3 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                                                <FaGlobe className="text-blue-600 dark:text-blue-400 text-lg" /> Tọa độ bản đồ GPS
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                                Nhập tọa độ hoặc bấm nút định vị GPS tự động để hiển thị trạm trên bản đồ ứng dụng
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-extrabold shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
                                        >
                                            <FaCompass size={14} /> Định vị GPS hiện tại
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-slate-700 dark:text-slate-200 text-xs font-bold mb-1.5">
                                                Latitude (Vĩ độ) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ví dụ: 10.776889"
                                                value={stationForm.latitude}
                                                onChange={(e) => setStationForm({ ...stationForm, latitude: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-slate-700 dark:text-slate-200 text-xs font-bold mb-1.5">
                                                Longitude (Kinh độ) <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ví dụ: 106.700806"
                                                value={stationForm.longitude}
                                                onChange={(e) => setStationForm({ ...stationForm, longitude: e.target.value })}
                                                className="w-full px-4 py-3 bg-white dark:bg-slate-950 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* GIỜ MỞ CỬA & GIỜ ĐÓNG CỬA */}
                                <div>
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm flex items-center gap-1.5">
                                        <FaClock className="text-blue-500" /> Giờ mở cửa
                                    </label>
                                    <input
                                        type="time"
                                        value={stationForm.open_time}
                                        onChange={(e) => setStationForm({ ...stationForm, open_time: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm flex items-center gap-1.5">
                                        <FaClock className="text-blue-500" /> Giờ đóng cửa
                                    </label>
                                    <input
                                        type="time"
                                        value={stationForm.close_time}
                                        onChange={(e) => setStationForm({ ...stationForm, close_time: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                    />
                                </div>

                                {/* MÔ TẢ TRẠM */}
                                <div className="md:col-span-2">
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm">
                                        Mô tả chi tiết trạm
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Giới thiệu về các dòng sản phẩm refill tại trạm, hướng dẫn mang theo chai lọ cá nhân..."
                                        value={stationForm.description}
                                        onChange={(e) => setStationForm({ ...stationForm, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none transition"
                                    />
                                </div>

                                {/* UPLOAD HÌNH ẢNH TRẠM */}
                                <div className="md:col-span-2">
                                    <label className="block text-slate-700 dark:text-slate-200 font-bold mb-2 text-sm flex items-center gap-1.5">
                                        <FaImage className="text-emerald-600 dark:text-emerald-400" /> Hình ảnh thực tế của trạm Refill
                                    </label>

                                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                                        {/* KHOẢNG HÌNH ẢNH PREVIEW */}
                                        <div className="w-36 h-36 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 shadow-inner">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                            ) : stationForm.image_url ? (
                                                <img 
                                                    src={getImageUrl(stationForm.image_url)} 
                                                    alt="Station" 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <div className="text-center text-slate-400 p-2">
                                                    <FaImage size={32} className="mx-auto mb-1 opacity-50" />
                                                    <span className="text-xs">Chưa có ảnh</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* INPUT FILE UPLOAD */}
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full text-sm text-slate-500 dark:text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
                                            />
                                            <p className="text-xs text-slate-400">
                                                Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa 5MB.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* NÚT THAO TÁC SUBMIT */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setShowForm(false);
                                    }}
                                    disabled={submitting}
                                    className="px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? (
                                        <>⏳ Đang xử lý...</>
                                    ) : editingStationId ? (
                                        <><FaCheck /> Cập Nhật Trạm</>
                                    ) : (
                                        <><FaPlus /> Tạo Trạm Ngay</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* DANH SÁCH TRẠM REFILL */}
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200/80">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>🏪</span> Danh Sách Trạm Refill ({filteredStations.length})
                        </h2>

                        {/* Ô TÌM KIẾM + NÚT THÊM TRẠM */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-80">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên hoặc địa chỉ trạm..."
                                    value={searchStation}
                                    onChange={(e) => setSearchStation(e.target.value)}
                                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-400 outline-none text-sm transition"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (showForm && editingStationId) {
                                        resetForm();
                                    }
                                    setShowForm(!showForm);
                                }}
                                className="px-5 py-2.5 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm bg-emerald-600 text-white hover:bg-emerald-500 whitespace-nowrap cursor-pointer"
                            >
                                <FaPlus /> Thêm Trạm Mới
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            Đang tải danh sách trạm Refill...
                        </div>
                    ) : filteredStations.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <span className="text-5xl block mb-3">🏪</span>
                            <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Chưa tìm thấy trạm Refill nào</p>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">
                                {searchStation ? 'Không tìm thấy trạm trùng khớp từ từ khóa của bạn' : 'Hãy bấm nút "Thêm Trạm Mới" để tạo trạm đầu tiên!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredStations.map((station) => (
                                <div
                                    key={station.station_id}
                                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                                >
                                    <div>
                                        {/* HÌNH ÁNH VÀ TRẠNG THÁI */}
                                        <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                            {station.image_url ? (
                                                <img
                                                    src={getImageUrl(station.image_url)}
                                                    alt={station.station_name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400">
                                                    <span className="text-5xl mb-1">🏪</span>
                                                    <span className="text-xs font-bold uppercase tracking-wider">Refill Station</span>
                                                </div>
                                            )}

                                            <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold shadow-md backdrop-blur-md ${station.status === 'active' ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                                                {station.status === 'active' ? '🟢 Hoạt động' : '🔴 Tạm nghỉ'}
                                            </span>
                                        </div>

                                        {/* NỘI DUNG TRẠM */}
                                        <div className="p-5 space-y-3">
                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-500 transition">
                                                {station.station_name}
                                            </h3>

                                            <p className="text-slate-600 dark:text-slate-300 text-xs flex items-start gap-2 min-h-[2.5rem]">
                                                <FaMapMarkerAlt className="text-rose-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2 leading-relaxed">{station.address || "Chưa cập nhật địa chỉ"}</span>
                                            </p>

                                            {(station.open_time || station.close_time) && (
                                                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2">
                                                    <FaClock className="text-blue-500 shrink-0" />
                                                    <span>Giờ hoạt động: <b className="text-slate-800 dark:text-slate-200">{formatTimeDisplay(station.open_time) || "8h00"} - {formatTimeDisplay(station.close_time) || "20h00"}</b></span>
                                                </p>
                                            )}

                                            {station.description && (
                                                <p className="text-slate-600 dark:text-slate-300 text-xs bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl line-clamp-2 italic">
                                                    "{station.description}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* THAO TÁC SỬA / XÓA */}
                                    <div className="p-5 pt-0 flex gap-2">
                                        <button
                                            onClick={() => editStation(station)}
                                            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <FaEdit /> Sửa Trạm
                                        </button>

                                        <button
                                            onClick={() => setStationToDelete(station)}
                                            className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <FaTrash /> Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* MODAL XÁC NHẬN XÓA TRẠM REFILL */}
                {stationToDelete && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 text-center space-y-5 border border-red-100">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
                                <FaExclamationTriangle />
                            </div>

                            <div>
                                <h3 className="text-xl font-extrabold text-gray-800">Xác Nhận Xóa Trạm Refill</h3>
                                <p className="text-gray-600 text-sm mt-2">
                                    Bạn có chắc chắn muốn xóa trạm Refill <b className="text-gray-900 font-extrabold">"{stationToDelete.station_name}"</b>?
                                </p>
                                <p className="text-red-500 text-xs font-semibold mt-1">
                                    ⚠️ Hành động này sẽ xóa trạm khỏi hệ thống và không thể hoàn tác!
                                </p>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => setStationToDelete(null)}
                                    disabled={isDeletingStation}
                                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm transition flex-1 disabled:opacity-50 cursor-pointer"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={confirmDeleteStation}
                                    disabled={isDeletingStation}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 transition flex-1 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isDeletingStation ? (
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

export default OwnerStationsPage;