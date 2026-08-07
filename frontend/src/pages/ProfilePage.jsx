import { useEffect, useState } from "react";
import api from "../services/api";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import { 
    FaUserShield, 
    FaStore, 
    FaUsers, 
    FaBoxes, 
    FaStar, 
    FaHistory, 
    FaChartBar, 
    FaHeart,
    FaRegEdit,
    FaKey,
    FaCheckCircle,
    FaArrowRight,
    FaMapMarkerAlt,
    FaBars
} from "react-icons/fa";

function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Đổi mật khẩu
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordVerified, setPasswordVerified] = useState(false);
    const [checkingPassword, setCheckingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Role-specific stats
    const [adminStats, setAdminStats] = useState(null);
    const [ownerStats, setOwnerStats] = useState(null);
    const [ownerStations, setOwnerStations] = useState([]);
    const [loadingRoleData, setLoadingRoleData] = useState(false);

    // =========================
    // LẤY THÔNG TIN PROFILE
    // =========================
    const loadProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = response.data;
            setUser(userData);
            setFullName(userData.full_name || "");
            setPhone(userData.phone || "");

            // Cập nhật lại user trong localStorage
            localStorage.setItem("user", JSON.stringify(userData));

            // Tải dữ liệu vai trò đặc thù (Admin / Owner)
            loadRoleData(userData.role);

        } catch (error) {
            console.error("Lỗi lấy thông tin profile:", error);
        } finally {
            setLoading(false);
        }
    };

    // Tải thông tin thống kê dành cho Admin và Owner
    const loadRoleData = async (role) => {
        setLoadingRoleData(true);
        try {
            if (role === 'admin') {
                const dashRes = await api.get('/admin/dashboard').catch(() => null);
                if (dashRes && dashRes.data) {
                    setAdminStats(dashRes.data);
                }
            } else if (role === 'store_owner') {
                const dashRes = await api.get('/owner/dashboard').catch(() => null);
                if (dashRes && dashRes.data) {
                    setOwnerStats(dashRes.data);
                }

                const stationsRes = await api.get('/owner/my-stations').catch(() => null);
                if (stationsRes && stationsRes.data) {
                    setOwnerStations(stationsRes.data);
                }
            }
        } catch (err) {
            console.error("Lỗi tải thông tin vai trò:", err);
        } finally {
            setLoadingRoleData(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // =========================
    // HIỂN THỊ LOADING
    // =========================
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-300">
                <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-semibold text-green-700">
                    Đang tải thông tin hồ sơ...
                </p>
            </div>
        );
    }

    // =========================
    // KHÔNG CÓ USER
    // =========================
    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-red-500 font-semibold text-xl mb-4">
                    Không thể tải thông tin người dùng.
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl font-medium"
                >
                    Đăng nhập lại
                </button>
            </div>
        );
    }

    // =========================
    // AVATAR
    // =========================
    const avatarUrl = user.avatar
        ? user.avatar.startsWith("/uploads")
            ? `http://localhost:5000${user.avatar}`
            : user.avatar
        : null;

    // =========================
    // FORMAT NGÀY
    // =========================
    const formatDate = (date) => {
        if (!date) return "Chưa cập nhật";
        return new Date(date).toLocaleDateString("vi-VN");
    };

    // =========================
    // HỦY CHỈNH SỬA
    // =========================
    const handleCancel = () => {
        setFullName(user.full_name || "");
        setPhone(user.phone || "");
        setIsEditing(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Chỉ được chọn ảnh JPG, JPEG, PNG hoặc WEBP");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Ảnh không được vượt quá 5MB");
            return;
        }

        setSelectedAvatar(file);
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    const handleUploadAvatar = async () => {
        if (!selectedAvatar) {
            alert("Vui lòng chọn ảnh trước");
            return;
        }

        try {
            setUploadingAvatar(true);

            const formData = new FormData();
            formData.append("image", selectedAvatar);

            const uploadResponse = await api.post("/upload/avatar", formData);
            const imageUrl = uploadResponse.data.image_url;

            const profileResponse = await api.put("/auth/profile", {
                full_name: user.full_name,
                phone: user.phone,
                avatar: imageUrl
            });

            const updatedUser = profileResponse.data.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setSelectedAvatar(null);
            setAvatarPreview(null);
            alert("Đổi ảnh đại diện thành công!");

        } catch (error) {
            console.error("Lỗi đổi avatar:", error);
            alert(error.response?.data?.message || "Không thể đổi ảnh đại diện");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.put(
                "/auth/profile",
                {
                    full_name: fullName,
                    phone: phone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedUser = response.data.user;

            setUser(updatedUser);
            setFullName(updatedUser.full_name || "");
            setPhone(updatedUser.phone || "");

            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            alert("Cập nhật hồ sơ thành công!");

        } catch (error) {
            console.error("Lỗi cập nhật hồ sơ:", error);
            alert(error.response?.data?.message || "Không thể cập nhật hồ sơ");
        }
    };

    const handleCurrentPasswordChange = async (e) => {
        const value = e.target.value;
        setCurrentPassword(value);

        setPasswordVerified(false);
        setPasswordMessage('');

        if (value.length !== 8) {
            return;
        }

        try {
            setCheckingPassword(true);
            const response = await api.post('/auth/verify-password', {
                currentPassword: value
            });

            setPasswordVerified(true);
            setPasswordMessage(response.data.message || '✅ Mật khẩu hiện tại chính xác');
        } catch (error) {
            setPasswordVerified(false);
            setPasswordMessage(error.response?.data?.message || 'Mật khẩu hiện tại không đúng');
        } finally {
            setCheckingPassword(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordVerified) return;

        if (newPassword.length !== 8) {
            setPasswordMessage('Mật khẩu mới phải có đúng 8 ký tự');
            return;
        }

        if (confirmPassword.length !== 8) {
            setPasswordMessage('Vui lòng nhập lại đủ 8 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage('Mật khẩu mới nhập lại không giống nhau');
            return;
        }

        try {
            setChangingPassword(true);
            setPasswordMessage('');

            const response = await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });

            alert(response.data.message || 'Đổi mật khẩu thành công');

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setPasswordVerified(false);
            setPasswordMessage('');
            setShowChangePassword(false);

        } catch (error) {
            setPasswordMessage(error.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleCancelChangePassword = () => {
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordVerified(false);
        setPasswordMessage('');
    };

    const roleText = {
        user: "👤 Người dùng",
        store_owner: "🏪 Chủ trạm Refill",
        admin: "🛡️ Quản trị viên"
    };

    const roleBadgeColor = {
        user: "bg-green-100 text-green-800 border-green-300",
        store_owner: "bg-blue-100 text-blue-800 border-blue-300",
        admin: "bg-purple-100 text-purple-800 border-purple-300"
    };

    const isAdminOrOwner = user.role === 'admin' || user.role === 'store_owner';

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 flex">
            {isAdminOrOwner && (
                <AdminSidebar 
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    currentUser={user}
                />
            )}

            <div className={`flex-1 ${isAdminOrOwner ? 'lg:ml-72' : ''} min-w-0 flex flex-col min-h-screen`}>
                <main className="flex-1 p-4 md:p-8 space-y-6 max-w-7xl w-full mx-auto">

                {/* PAGE TITLE BANNER */}
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        {isAdminOrOwner && (
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition shrink-0"
                                title="Mở menu quản trị"
                            >
                                <FaBars size={18} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                                <span className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl text-xl">👤</span>
                                Hồ Sơ Cá Nhân
                            </h1>
                            <p className="text-slate-500 text-xs md:text-sm mt-1">
                                Quản lý thông tin cá nhân, cài đặt bảo mật và cài đặt tài khoản của bạn
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTAINER CHÍNH */}
                <div className="space-y-8">
                
                {/* PROFILE CARD CARD HÀNG ĐẦU */}
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-md overflow-hidden border border-emerald-100">
                    <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-800 text-white p-5 md:p-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            {/* AVATAR SECTION */}
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="relative w-20 h-20 md:w-24 md:h-24">
                                    <label
                                        htmlFor="avatarInput"
                                        className="block w-full h-full rounded-full overflow-hidden shadow-lg cursor-pointer relative border-2 border-white/90 hover:opacity-90 transition"
                                    >
                                        {avatarPreview ? (
                                            <img
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white flex items-center justify-center">
                                                <span className="text-3xl text-slate-400">👤</span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                            <span className="text-base">📷</span>
                                        </div>

                                        <input
                                            id="avatarInput"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {selectedAvatar && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={handleUploadAvatar}
                                            disabled={uploadingAvatar}
                                            className="bg-white text-emerald-800 px-2.5 py-1 rounded-xl font-bold shadow hover:bg-emerald-50 transition text-xs disabled:opacity-50"
                                        >
                                            {uploadingAvatar ? "⏳ Đang tải..." : "💾 Lưu ảnh"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAvatar(null);
                                                setAvatarPreview(null);
                                            }}
                                            disabled={uploadingAvatar}
                                            className="bg-white/20 text-white px-2.5 py-1 rounded-xl font-bold hover:bg-white/30 transition text-xs"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* USER BASIC DETAILS */}
                            <div className="text-center sm:text-left flex-1 space-y-1">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                                        {user.full_name}
                                    </h2>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleBadgeColor[user.role]}`}>
                                        {roleText[user.role]}
                                    </span>
                                </div>

                                <p className="text-emerald-100 text-xs md:text-sm font-medium">
                                    📧 {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

              
                {/* ======================================================== */}
                {/* ⚙️ PHẦN THÔNG TIN CÁ NHÂN & ĐỔI MẬT KHẨU                 */}
                {/* ======================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* THÔNG TIN CÁ NHÂN */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between border border-gray-100">
                        <div>
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaRegEdit className="text-green-600" /> Thông Tin Cá Nhân
                                </h2>

                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition flex items-center gap-2"
                                    >
                                        ✏️ Chỉnh sửa
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* HỌ VÀ TÊN */}
                                <div>
                                    <label className="block text-gray-600 font-semibold mb-2 text-sm">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        disabled={!isEditing}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className={`w-full p-2 rounded-xl border outline-none transition ${
                                            isEditing
                                                ? "border-green-400 focus:ring-2 focus:ring-green-300 bg-white"
                                                : "bg-gray-100 border-gray-200 text-gray-700"
                                        }`}
                                    />
                                </div>

                                {/* EMAIL */}
                                <div>
                                    <label className="block text-gray-600 font-semibold mb-2 text-sm">
                                        Email đăng nhập
                                    </label>
                                    <input
                                        type="email"
                                        value={user.email || ""}
                                        disabled
                                        className="w-full p-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Email cố định dùng để xác thực tài khoản nên không thể sửa.
                                    </p>
                                </div>

                                {/* SỐ ĐIỆN THOẠI */}
                                <div>
                                    <label className="block text-gray-600 font-semibold mb-2 text-sm">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        disabled={!isEditing}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Chưa cập nhật số điện thoại"
                                        className={`w-full p-2 rounded-xl border outline-none transition ${
                                            isEditing
                                                ? "border-green-400 focus:ring-2 focus:ring-green-300 bg-white"
                                                : "bg-gray-100 border-gray-200 text-gray-700"
                                        }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* NÚT LƯU HỦY THÔNG TIN CÁ NHÂN */}
                        {isEditing && (
                            <div className="flex gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold transition cursor-pointer"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="flex-1 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold shadow transition cursor-pointer"
                                >
                                    💾 Lưu cập nhật
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ĐỔI MẬT KHẨU */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col justify-between border border-gray-100">
                        <div>
                            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaKey className="text-amber-500" /> Đổi Mật Khẩu
                                </h2>

                                {!showChangePassword && (
                                    <button
                                        type="button"
                                        onClick={() => setShowChangePassword(true)}
                                        className="px-2 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition flex items-center gap-2"
                                    >
                                        🔐 Đổi mật khẩu
                                    </button>
                                )}
                            </div>

                            {!showChangePassword ? (
                                <div className="py-8 text-center text-gray-500">
                                    <p className="text-5xl mb-3">🔒</p>
                                    <p className="font-medium text-gray-700">Mật khẩu được bảo mật với định dạng 8 ký tự</p>
                                    <p className="text-sm text-gray-400 mt-1">Bấm vào nút "Đổi mật khẩu" để thực hiện thay đổi mật khẩu của bạn.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* MẬT KHẨU HIỆN TẠI */}
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium text-sm">
                                            Mật khẩu hiện tại (8 ký tự)
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={handleCurrentPasswordChange}
                                            maxLength={8}
                                            placeholder="Nhập đúng 8 ký tự"
                                            className="w-full px-4 py-2 rounded-xl border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
                                        />

                                        {currentPassword.length > 0 && currentPassword.length < 8 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                ⚠️ Mật khẩu phải có đúng 8 ký tự
                                            </p>
                                        )}

                                        {checkingPassword && (
                                            <p className="text-gray-500 text-xs mt-1 animate-pulse">
                                                ⏳ Đang kiểm tra mật khẩu...
                                            </p>
                                        )}

                                        {!checkingPassword && passwordVerified && (
                                            <p className="text-green-600 text-xs mt-1 font-semibold flex items-center gap-1">
                                                <FaCheckCircle /> Mật khẩu hiện tại chính xác
                                            </p>
                                        )}

                                        {!checkingPassword && currentPassword.length === 8 && !passwordVerified && passwordMessage && (
                                            <p className="text-red-500 text-xs mt-1">
                                                ❌ {passwordMessage}
                                            </p>
                                        )}
                                    </div>

                                    {/* MẬT KHẨU MỚI */}
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium text-sm">
                                            Mật khẩu mới (8 ký tự)
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 8) {
                                                    setNewPassword(e.target.value);
                                                }
                                            }}
                                            maxLength={8}
                                            disabled={!passwordVerified}
                                            placeholder="Nhập đúng 8 ký tự"
                                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
                                                passwordVerified
                                                    ? 'border-green-400 focus:ring-green-300 bg-white'
                                                    : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                                            }`}
                                        />
                                        {passwordVerified && newPassword.length > 0 && newPassword.length < 8 && (
                                            <p className="text-red-500 text-xs mt-1">
                                                ⚠️ Mật khẩu mới phải có đúng 8 ký tự
                                            </p>
                                        )}
                                        {passwordVerified && newPassword.length === 8 && (
                                            <p className="text-green-600 text-xs mt-1 font-semibold">
                                                ✓ Mật khẩu mới hợp lệ
                                            </p>
                                        )}
                                    </div>

                                    {/* NHẬP LẠI MẬT KHẨU */}
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium text-sm">
                                            Nhập lại mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => {
                                                if (e.target.value.length <= 8) {
                                                    setConfirmPassword(e.target.value);
                                                }
                                            }}
                                            maxLength={8}
                                            disabled={!passwordVerified}
                                            placeholder="Nhập lại đúng 8 ký tự"
                                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 ${
                                                passwordVerified
                                                    ? 'border-green-400 focus:ring-green-300 bg-white'
                                                    : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                                            }`}
                                        />
                                        {passwordVerified && confirmPassword.length === 8 && newPassword !== confirmPassword && (
                                            <p className="text-red-500 text-xs mt-1">
                                                ❌ Mật khẩu nhập lại không trùng khớp
                                            </p>
                                        )}
                                        {passwordVerified && confirmPassword.length === 8 && newPassword === confirmPassword && (
                                            <p className="text-green-600 text-xs mt-1 font-semibold">
                                                ✓ Hai mật khẩu trùng khớp
                                            </p>
                                        )}
                                    </div>

                                    {/* BUTTONS ĐỔI MẬT KHẨU */}
                                    <div className="flex gap-3 mt-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={
                                                !passwordVerified ||
                                                newPassword.length !== 8 ||
                                                confirmPassword.length !== 8 ||
                                                newPassword !== confirmPassword ||
                                                changingPassword
                                            }
                                            className="flex-1 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {changingPassword ? '⏳ Đang đổi...' : '🔐 Xác nhận đổi'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelChangePassword}
                                            disabled={changingPassword}
                                            className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold transition cursor-pointer"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ======================================================== */}
                {/* 📌 KHU VỰC THÔNG TIN TÀI KHOẢN TỔNG QUAN                */}
                {/* ======================================================== */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>🛡️</span> Thông Tin Chi Tiết Tài Khoản
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                Vai trò hệ thống
                            </p>
                            <p className="font-bold text-gray-800 mt-2 text-lg">
                                {roleText[user.role] || user.role}
                            </p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                Ngày khởi tạo
                            </p>
                            <p className="font-bold text-gray-800 mt-2 text-lg">
                                📅 {formatDate(user.created_at)}
                            </p>
                        </div>

                        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                            {user.role === 'store_owner' ? (
                                <>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                        Tổng số trạm
                                    </p>
                                    <p className="font-bold text-gray-800 mt-2 text-lg flex items-center gap-2">
                                        🏪 {loadingRoleData ? "..." : ownerStations.length} trạm
                                    </p>
                                </>
                            ) : user.role === 'admin' ? (
                                <>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                        Phạm vi quản lý
                                    </p>
                                    <p className="font-bold text-gray-800 mt-2 text-lg flex items-center gap-2">
                                        🌐 Toàn hệ thống
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                        Danh hiệu / Badge
                                    </p>
                                    <p className="font-bold text-gray-800 mt-2 text-lg">
                                        🏅 {user.badge || "Người dùng mới"}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
                            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                Trạng thái tài khoản
                            </p>
                            <p className="font-bold mt-2 text-lg">
                                {user.status === "active" ? (
                                    <span className="text-green-600 flex items-center gap-1.5">
                                        🟢 Đang hoạt động
                                    </span>
                                ) : (
                                    <span className="text-red-600 flex items-center gap-1.5">
                                        🔴 Đã bị khóa
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            </main>
        </div>
    </div>
    );
}

export default ProfilePage;