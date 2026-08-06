import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function ForceChangePasswordPage() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword) {
            alert('⚠️ Vui lòng nhập Mật khẩu tạm thời!');
            return;
        }

        if (newPassword.length !== 8) {
            alert('⚠️ Mật khẩu mới phải có đúng 8 ký tự!');
            return;
        }

        if (newPassword === currentPassword) {
            alert('⚠️ Mật khẩu mới phải khác với Mật khẩu tạm thời!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('⚠️ Xác nhận mật khẩu mới không trùng khớp!');
            return;
        }

        try {
            setLoading(true);
            const res = await api.post('/auth/change-password-required', {
                currentPassword,
                newPassword
            });

            // Cập nhật lại Token & thông tin User mới đã xóa cờ must_change_password
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            if (res.data.user) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
            }

            alert('🎉 Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo mật an toàn.');

            const user = res.data.user || JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'store_owner') {
                navigate('/owner');
            } else {
                navigate('/location-permission');
            }
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message || '❌ Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu tạm!'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-green-300 flex items-center justify-center p-4 md:p-6 select-none">
            
            {/* THẺ ĐỔI MẬT KHẨU BẮT BUỘC NHỎ GỌN */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/70 shadow-2xl rounded-3xl p-6 md:p-8 w-full max-w-md space-y-6">
                
                {/* HEADER */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner border border-amber-200">
                        <FaShieldAlt />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-green-800 pt-1">
                        Khởi Tạo Mật Khẩu Mới
                    </h1>
                    <p className="text-gray-600 text-xs">
                        Tài khoản của bạn vừa sử dụng Mật khẩu tạm. Vui lòng tạo mật khẩu mới để tiếp tục sử dụng ứng dụng.
                    </p>
                </div>

                {/* CANH BÁO */}
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-2xl font-medium">
                    ⚠️ <b>Yêu cầu bảo mật:</b> Bạn không thể chuyển trang nếu chưa hoàn tất khởi tạo mật khẩu mới.
                </div>

                {/* FORM ĐỔI MẬT KHẨU */}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    
                    {/* MẬT KHẨU TẠM THỜI */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Mật khẩu tạm thời (Từ Email) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu tạm được gửi về Email"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showCurrent ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* MẬT KHẨU MỚI */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Mật khẩu mới (Đúng 8 ký tự) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type={showNew ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu mới (đúng 8 ký tự)"
                                value={newPassword}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.length <= 8) setNewPassword(val);
                                }}
                                maxLength={8}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showNew ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                            </button>
                        </div>

                        {/* THÔNG BÁO MẬT KHẨU MỚI */}
                        {newPassword.length > 0 && newPassword.length < 8 && (
                            <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaExclamationCircle size={12} /> Mật khẩu phải đúng 8 ký tự ({newPassword.length}/8)
                            </p>
                        )}
                        {newPassword.length === 8 && (
                            <p className="text-green-600 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaCheckCircle size={12} /> Mật khẩu hợp lệ (8/8)
                            </p>
                        )}
                    </div>

                    {/* XÁC NHẬN MẬT KHẨU MỚI */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                maxLength={8}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 focus:bg-white text-sm transition"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                            >
                                {showConfirm ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                            </button>
                        </div>

                        {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                            <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                <FaExclamationCircle size={12} /> Xác nhận mật khẩu chưa trùng khớp
                            </p>
                        )}
                    </div>

                    {/* NÚT XÁC NHẬN */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-green-200 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang lưu mật khẩu...
                            </>
                        ) : (
                            'Xác Nhận Đổi Mật Khẩu'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}

export default ForceChangePasswordPage;
