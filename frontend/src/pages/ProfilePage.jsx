import { useEffect, useState } from "react";
import api from "../services/api";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

            setUser(response.data);

            setFullName(response.data.full_name || "");
            setPhone(response.data.phone || "");

            // Cập nhật lại user trong localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

        } catch (error) {
            console.error("Lỗi lấy thông tin profile:", error);
        } finally {
            setLoading(false);
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-300">
                <p className="text-xl font-semibold text-green-700">
                    Đang tải thông tin...
                </p>
            </div>
        );
    }

    // =========================
    // KHÔNG CÓ USER
    // =========================
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 font-semibold">
                    Không thể tải thông tin người dùng.
                </p>
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

    // Kiểm tra định dạng
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

    // Kiểm tra dung lượng: tối đa 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("Ảnh không được vượt quá 5MB");
        return;
    }

    setSelectedAvatar(file);

    // Tạo ảnh xem trước
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

        const uploadResponse = await api.post(
            "/upload/avatar",
            formData
        );

        const imageUrl = uploadResponse.data.image_url;

        // Cập nhật avatar vào database
        const profileResponse = await api.put(
            "/auth/profile",
            {
                full_name: user.full_name,
                phone: user.phone,
                avatar: imageUrl
            }
        );

        const updatedUser = profileResponse.data.user;

        setUser(updatedUser);

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setSelectedAvatar(null);
        setAvatarPreview(null);

        alert("Đổi ảnh đại diện thành công!");

    } catch (error) {

        console.error(
            "Lỗi đổi avatar:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Không thể đổi ảnh đại diện"
        );

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

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setIsEditing(false);

        alert("Cập nhật hồ sơ thành công!");

    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ:", error);

        alert(
            error.response?.data?.message ||
            "Không thể cập nhật hồ sơ"
        );
    }
};
const handleCurrentPasswordChange = async (e) => {
    const value = e.target.value;

    setCurrentPassword(value);

    // Nếu người dùng sửa lại mật khẩu
    // thì khóa phần mật khẩu mới
    setPasswordVerified(false);
    setPasswordMessage('');

    // Chưa đủ 8 ký tự thì chưa kiểm tra
    if (value.length !== 8) {
        return;
    }

    try {
        setCheckingPassword(true);

        const response = await api.post(
            '/auth/verify-password',
            {
                currentPassword: value
            }
        );

        setPasswordVerified(true);

        setPasswordMessage(
            response.data.message ||
            '✅ Mật khẩu hiện tại chính xác'
        );

    } catch (error) {

        setPasswordVerified(false);

        setPasswordMessage(
            error.response?.data?.message ||
            'Mật khẩu hiện tại không đúng'
        );

    } finally {
        setCheckingPassword(false);
    }
};
const handleChangePassword = async () => {

    if (!passwordVerified) {
        return;
    }

    if (newPassword.length !== 8) {
        setPasswordMessage(
            'Mật khẩu mới phải có đúng 8 ký tự'
        );
        return;
    }

    if (confirmPassword.length !== 8) {
        setPasswordMessage(
            'Vui lòng nhập lại đủ 8 ký tự'
        );
        return;
    }

    if (newPassword !== confirmPassword) {
        setPasswordMessage(
            'Mật khẩu mới nhập lại không giống nhau'
        );
        return;
    }

    try {

        setChangingPassword(true);
        setPasswordMessage('');

        const response = await api.put(
            '/auth/change-password',
            {
                currentPassword,
                newPassword
            }
        );

        alert(
            response.data.message ||
            'Đổi mật khẩu thành công'
        );

        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordVerified(false);
        setPasswordMessage('');
        setShowChangePassword(false);

    } catch (error) {

        setPasswordMessage(
            error.response?.data?.message ||
            'Không thể đổi mật khẩu'
        );

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
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-200 via-white to-green-400 p-6 md:p-10">
                <button
                onClick={() => navigate(-1)}
                className="
                    flex items-center gap-2
                    mb-8
                    ml-2
                    px-5 py-3
                    bg-white
                    rounded-full
                    shadow-md
                    hover:shadow-lg
                    hover:bg-gray-50
                    transition-all
                    duration-200
                    text-base
                    font-semibold
                    text-gray-700
                "
            >
                <IoChevronBack size={22} />
                Quay lại
            </button>
            {/* HEADER */}
            <div className="max-w-5xl mx-auto mb-8">

                <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 text-center">
                   👤 Hồ sơ cá nhân
                </h1>

            </div>


            {/* PROFILE CARD */}
            <div className="max-w-5xl mx-auto">

                <div className="bg-white/90 backdrop-blur-lg rounded-[30px] shadow-2xl overflow-hidden">

               {/* TOP PROFILE */}
<div className="bg-green-600 text-white p-8">

    <div className="flex flex-col md:flex-row items-center gap-6">

        {/* CỘT AVATAR */}
        <div className="flex flex-col items-center flex-shrink-0">

            {/* AVATAR */}
            <div className="relative w-32 h-32">

                <label
                    htmlFor="avatarInput"
                    className="block w-full h-full rounded-full overflow-hidden shadow-xl cursor-pointer relative"
                >

                    {/* Ảnh đại diện */}
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
                            <span className="text-6xl">
                                👤
                            </span>
                        </div>
                    )}

                    {/* Lớp mờ + camera chính giữa */}
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                        <span className="text-3xl">
                            📷
                        </span>
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

            {/* NÚT LƯU / HỦY */}
            {selectedAvatar && (
                <div className="flex gap-2 mt-3">

                    <button
                        type="button"
                        onClick={handleUploadAvatar}
                        disabled={uploadingAvatar}
                        className="bg-white text-green-700 px-3 py-2 rounded-xl font-semibold shadow hover:bg-green-50 transition disabled:opacity-50"
                    >
                        {uploadingAvatar
                            ? "⏳"
                            : "💾 Lưu ảnh"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedAvatar(null);
                            setAvatarPreview(null);
                        }}
                        disabled={uploadingAvatar}
                        className="bg-white/20 text-white px-3 py-2 rounded-xl font-semibold hover:bg-white/30 transition"
                    >
                        Hủy
                    </button>

                </div>
            )}

        </div>


        {/* THÔNG TIN USER */}
        <div className="text-center md:text-left">

            <h2 className="text-4xl font-bold">
                {user.full_name}
            </h2>

            <p className="text-green-100 mt-1 text-xl">
                {user.email}
            </p>

            

        </div>

    </div>

</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    {/* PERSONAL INFORMATION */}
                    <div className="h-full flex flex-col">
                    <div className="p-8 h-full">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold text-gray-800">
                                Thông tin cá nhân
                            </h2>

                            {!isEditing && (

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold shadow transition"
                                >
                                    ✏️
                                </button>

                            )}

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

                            {/* FULL NAME */}
                            <div>

                                <label className="block text-gray-600 font-semibold mb-2">
                                    Họ và tên
                                </label>

                                <input
                                    type="text"
                                    value={fullName}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                    className={`w-full p-4 rounded-xl border outline-none transition ${
                                        isEditing
                                            ? "border-green-400 focus:ring-2 focus:ring-green-300"
                                            : "bg-gray-100 border-gray-200"
                                    }`}
                                />

                            </div>

                            {/* EMAIL */}
                            <div>

                                <label className="block text-gray-600 font-semibold mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={user.email || ""}
                                    disabled
                                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                                />

                                <p className="text-sm text-red-400 mt-1">
                                    Email dùng để đăng nhập nên không thể chỉnh sửa.
                                </p>

                            </div>

                            {/* PHONE */}
                            <div>

                                <label className="block text-gray-600 font-semibold mb-2">
                                    Số điện thoại
                                </label>

                                <input
                                    type="text"
                                    value={phone}
                                    disabled={!isEditing}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    className={`w-full p-4 rounded-xl border outline-none transition ${
                                        isEditing
                                            ? "border-green-400 focus:ring-2 focus:ring-green-300"
                                            : "bg-gray-100 border-gray-200"
                                    }`}
                                />

                            </div>

                        </div>


                        {/* BUTTONS */}
                        {isEditing && (

                            <div className="flex gap-4 mt-8">

                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                                >
                                    Hủy
                                </button>

                                <button
                                    onClick={handleSaveProfile}
                                    className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow transition"
                                >
                                    Lưu
                                </button>

                            </div>

                        )}

                    </div>
</div>
<div className="h-full flex flex-col">
{/* ĐỔI MẬT KHẨU */}

<div className="bg-white rounded-2xl shadow p-8 h-full">

    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">
                🔐 Đổi mật khẩu
            </h2>

            
        </div>

        {!showChangePassword && (
            <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
                ✏️
            </button>
        )}

    </div>

    {showChangePassword && (

        <div className="mt-6">

            {/* MẬT KHẨU HIỆN TẠI */}

            <div>

                <label className="block mb-2 text-gray-700 font-medium">
                    Mật khẩu hiện tại
                </label>

                <input
                    type="password"
                    value={currentPassword}
                    onChange={handleCurrentPasswordChange}
                    maxLength={8}
                    placeholder="Nhập đúng 8 ký tự"
                    className="w-full px-4 py-3 rounded-xl border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-300"
                />

                {/* Thông báo kiểm tra */}

                {currentPassword.length > 0 &&
                    currentPassword.length < 8 && (
                        <p className="text-red-500 text-sm mt-2">
                            ⚠️ Mật khẩu phải có đúng 8 ký tự
                        </p>
                    )}

                {checkingPassword && (
                    <p className="text-gray-500 text-sm mt-2">
                        ⏳ Đang kiểm tra mật khẩu...
                    </p>
                )}

                {!checkingPassword &&
                    passwordVerified && (
                        <p className="text-green-600 text-sm mt-2">
                            ✅ Mật khẩu hiện tại chính xác
                        </p>
                    )}

                {!checkingPassword &&
                    currentPassword.length === 8 &&
                    !passwordVerified &&
                    passwordMessage && (
                        <p className="text-red-500 text-sm mt-2">
                            ❌ {passwordMessage}
                        </p>
                    )}

            </div>

            {/* MẬT KHẨU MỚI */}

            <div className="mt-5">

                <label className="block mb-2 text-gray-700 font-medium">
                    Mật khẩu mới
                </label>

                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {

                        const value = e.target.value;

                        if (value.length <= 8) {
                            setNewPassword(value);
                        }

                    }}
                    maxLength={8}
                    disabled={!passwordVerified}
                    placeholder="Nhập đúng 8 ký tự"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        passwordVerified
                            ? 'border-green-400 focus:ring-green-300 bg-white'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    }`}
                />

                {passwordVerified &&
                    newPassword.length > 0 &&
                    newPassword.length < 8 && (
                        <p className="text-red-500 text-sm mt-2">
                            ⚠️ Mật khẩu mới phải có đúng 8 ký tự
                        </p>
                    )}

                {passwordVerified &&
                    newPassword.length === 8 && (
                        <p className="text-green-600 text-sm mt-2">
                            ✓ Mật khẩu mới hợp lệ
                        </p>
                    )}

            </div>


            {/* NHẬP LẠI MẬT KHẨU */}

            <div className="mt-5">

                <label className="block mb-2 text-gray-700 font-medium">
                    Nhập lại mật khẩu mới
                </label>

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {

                        const value = e.target.value;

                        if (value.length <= 8) {
                            setConfirmPassword(value);
                        }

                    }}
                    maxLength={8}
                    disabled={!passwordVerified}
                    placeholder="Nhập lại đúng 8 ký tự"
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                        passwordVerified
                            ? 'border-green-400 focus:ring-green-300 bg-white'
                            : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    }`}
                />

                {passwordVerified &&
                    confirmPassword.length > 0 &&
                    confirmPassword.length < 8 && (
                        <p className="text-red-500 text-sm mt-2">
                            ⚠️ Vui lòng nhập đủ 8 ký tự
                        </p>
                    )}

                {passwordVerified &&
                    confirmPassword.length === 8 &&
                    newPassword !== confirmPassword && (
                        <p className="text-red-500 text-sm mt-2">
                            ❌ Mật khẩu nhập lại không trùng khớp
                        </p>
                    )}

                {passwordVerified &&
                    confirmPassword.length === 8 &&
                    newPassword === confirmPassword && (
                        <p className="text-green-600 text-sm mt-2">
                            ✓ Hai mật khẩu trùng khớp
                        </p>
                    )}

            </div>

            {/* BUTTON */}

            <div className="flex gap-3 mt-6">

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
                    className="px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {changingPassword
                        ? '⏳ Đang đổi...'
                        : '🔐 Xác nhận'}
                </button>


                <button
                    type="button"
                    onClick={handleCancelChangePassword}
                    disabled={changingPassword}
                    className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
                >
                    Hủy
                </button>

            </div>

        </div>

    )}

</div>
</div>
</div>
                    {/* ACCOUNT INFORMATION */}
                    <div className="border-t border-gray-200 p-8">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🔐 Thông tin tài khoản
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">

                            <div className=" bg-green-100 p-5 rounded-2xl">
                                <p className="text-gray-500 ">
                                    Vai trò
                                </p>

                                <p className="font-bold text-gray-800 mt-1">
                                    👤 {user.role || "user"}
                                </p>
                            </div>


                            <div className="bg-green-100 p-5 rounded-2xl">
                                <p className="text-gray-500">
                                    Ngày tham gia
                                </p>

                                <p className="font-bold text-gray-800 mt-1">
                                    📅 {formatDate(user.created_at)}
                                </p>
                            </div>


                            <div className="bg-green-100 p-5 rounded-2xl">
                                <p className="text-gray-500">
                                    Huy hiệu
                                </p>

                                <p className="font-bold text-gray-800 mt-1">
                                    🏅 {user.badge || "Người dùng mới"}
                                </p>
                            </div>


                            <div className="bg-green-100 p-5 rounded-2xl">
                                <p className="text-gray-500">
                                    Trạng thái tài khoản
                                </p>

                                <p className="font-bold text-green-600 mt-1">
                                    <span
    className={
        user.status === "active"
            ? "text-green-600"
            : "text-red-600"
    }
>
    {user.status === "active"
        ? "🟢 Đang hoạt động"
        : "🔴 Đã khóa"}
</span>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>
 </div>
   </div>
  
    );
}

export default ProfilePage;